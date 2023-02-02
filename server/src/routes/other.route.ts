import  { Router } from "express";
import { contact, courseRequest, getDashboardStats } from "../controllers/other.controller";
import { isAuthenticated, authorizeAdmin } from "../middlewares/auth.middleware";

const router = Router();

// contact form
router.route("/contact").post(contact);

// Request form
router.route("/courserequest").post(courseRequest);

// Get Admin Dashboard Stats
router
  .route("/admin/stats")
  .get(isAuthenticated, authorizeAdmin, getDashboardStats);

export default router;