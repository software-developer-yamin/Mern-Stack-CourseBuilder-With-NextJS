import { RequestHandler } from "express";
import createHttpError from "http-errors";
import statsModel from "../models/stats.model";
import { sendEmail } from "../utils/sendEmail";

// contact
interface IContactReqBody {
  name: string;
  email: string;
  message: string;
}

export const contact: RequestHandler<
  unknown,
  unknown,
  IContactReqBody,
  unknown
> = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      throw createHttpError(400, "All fields are mandatory");
    }

    const to = process.env.MY_MAIL!;
    const subject = "Contact from CourseBundler";
    const text = `I am ${name} and my Email is ${email}. \n${message}`;

    await sendEmail(to, subject, text);

    res.status(200).json({
      success: true,
      message: "Your Message Has Been Sent.",
    });
  } catch (error) {
    next(error);
  }
};

//courseRequest
interface ICourseRequestBody {
  name: string;
  email: string;
  course: string;
}

export const courseRequest: RequestHandler<
  unknown,
  unknown,
  ICourseRequestBody,
  unknown
> = async (req, res, next) => {
  try {
    const { name, email, course } = req.body;
    if (!name || !email || !course) {
      throw createHttpError(400, "All fields are mandatory");
    }

    const to = process.env.MY_MAIL!;
    const subject = "Requesting for a course on CourseBundler";
    const text = `I am ${name} and my Email is ${email}. \n${course}`;

    await sendEmail(to, subject, text);

    res.status(200).json({
      success: true,
      message: "Your Request Has Been Sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats: RequestHandler = async (req, res, next) => {
  try {
    const stats = await statsModel
      .find({})
      .sort({ createdAt: "desc" })
      .limit(12);

    const statsData = [];

    for (let i = 0; i < stats.length; i++) {
      statsData.unshift(stats[i]);
    }
    const requiredSize = 12 - stats.length;

    for (let i = 0; i < requiredSize; i++) {
      statsData.unshift({
        users: 0,
        subscription: 0,
        views: 0,
      });
    }

    const usersCount = statsData[11].users;
    const subscriptionCount = statsData[11].subscription;
    const viewsCount = statsData[11].views;

    let usersPercentage = 0,
      viewsPercentage = 0,
      subscriptionPercentage = 0;
    let usersProfit = true,
      viewsProfit = true,
      subscriptionProfit = true;

    if (statsData[10].users === 0) usersPercentage = usersCount * 100;
    if (statsData[10].views === 0) viewsPercentage = viewsCount * 100;
    if (statsData[10].subscription === 0)
      subscriptionPercentage = subscriptionCount * 100;
    else {
      const difference = {
        users: statsData[11].users - statsData[10].users,
        views: statsData[11].views - statsData[10].views,
        subscription: statsData[11].subscription - statsData[10].subscription,
      };

      usersPercentage = (difference.users / statsData[10].users) * 100;
      viewsPercentage = (difference.views / statsData[10].views) * 100;
      subscriptionPercentage =
        (difference.subscription / statsData[10].subscription) * 100;
      if (usersPercentage < 0) usersProfit = false;
      if (viewsPercentage < 0) viewsProfit = false;
      if (subscriptionPercentage < 0) subscriptionProfit = false;
    }

    res.status(200).json({
      success: true,
      stats: statsData,
      usersCount,
      subscriptionCount,
      viewsCount,
      subscriptionPercentage,
      viewsPercentage,
      usersPercentage,
      subscriptionProfit,
      viewsProfit,
      usersProfit,
    });
  } catch (error) {
    next(error);
  }
};
