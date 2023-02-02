import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { instance } from "../app";
import userModel from "../models/user.model";
import * as crypto from "crypto";
import paymentModel from "../models/payment.model";

export const buySubscription: RequestHandler = async (req, res, next) => {
  try {
    const user = await userModel.findById(res.locals.user._id);
    if (user) {
      if (user.role === "admin") {
        throw createHttpError(400, "Admin can't buy subscription");
      }

      const plan_id = process.env.PLAN_ID || "plan_JuJevKAcuZdtRO";

      const subscription = await instance.subscriptions.create({
        plan_id,
        customer_notify: 1,
        total_count: 12,
      });

      if (user.subscription) {
        user.subscription.id = subscription.id;

        user.subscription.status = subscription.status;

        await user.save();

        res.status(201).json({
          success: true,
          subscriptionId: subscription.id,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

//paymentVerification
interface paymentVerificationReqBody {
  razorpay_signature: string;
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
}

export const paymentVerification: RequestHandler<
  unknown,
  unknown,
  paymentVerificationReqBody,
  unknown
> = async (req, res, next) => {
  try {
    const {
      razorpay_signature,
      razorpay_payment_id,
      razorpay_subscription_id,
    } = req.body;
    const user = await userModel.findById(res.locals.user._id);
    if (user?.subscription) {
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
        .update(razorpay_payment_id + "|" + user?.subscription.id, "utf-8")
        .digest("hex");

      const isAuthentic = generated_signature === razorpay_signature;

      if (!isAuthentic)
        return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);

      // database comes here
      await paymentModel.create({
        razorpay_signature,
        razorpay_payment_id,
        razorpay_subscription_id,
      });

      user.subscription.status = "active";

      await user.save();

      res.redirect(
        `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
      );
    }
  } catch (error) {
    next(error);
  }
};

export const getRazorPayKey: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription: RequestHandler = async (req, res, next) => {
  try {
    const user = await userModel.findById(res.locals.user._id);

    if (user?.subscription) {
      const subscriptionId = user.subscription.id;
      let refund = false;

      await instance.subscriptions.cancel(subscriptionId);

      const payment = await paymentModel.findOne({
        razorpay_subscription_id: subscriptionId,
      });
      
      if (payment) {
        const gap = Date.now() - (payment.createdAt as unknown as number);

        const refundTime =
          (process.env.REFUND_DAYS as unknown as number) * 24 * 60 * 60 * 1000;

        if (refundTime > gap) {
          await instance.payments.refund(payment.razorpay_payment_id);
          refund = true;
        }

        await payment.remove();
        user.subscription.id = undefined;
        user.subscription.status = undefined;
        await user.save();

        res.status(200).json({
          success: true,
          message: refund
            ? "Subscription cancelled, You will receive full refund within 7 days."
            : "Subscription cancelled, Now refund initiated as subscription was cancelled after 7 days.",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
