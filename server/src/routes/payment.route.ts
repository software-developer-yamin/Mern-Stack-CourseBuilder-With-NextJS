import {Router} from "express";
import { buySubscription, cancelSubscription, getRazorPayKey, paymentVerification } from "../controllers/payment.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

// Buy Subscription
router.route("/subscribe").get(isAuthenticated, buySubscription);

// Verify Payment and save reference in database
router.route("/paymentverification").post(isAuthenticated, paymentVerification);

// Get Razorpay key
router.route("/razorpaykey").get(getRazorPayKey);

// Cancel Subscription
router.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription);

export default router;