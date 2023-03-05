import express, { Express } from "express";
import { config } from "dotenv";
import courseRoute from "./routes/course.route";
import userRoute from "./routes/user.route";
import { connectDatabase } from "./config/database";
import errorHandler from "./middlewares/errorHandler.middleware";
import { error } from "console";
import createHttpError from "http-errors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import cloudinary from "cloudinary";
import RazorPay from "razorpay";
import paymentRoute from "./routes/payment.route";
import otherRoute from "./routes/other.route";
import nodeCron from "node-cron";
import statsModel from "./models/stats.model";

config();
const app: Express = express();

// middlewares configuration
app.use(express.json());
app.use(morgan("dev"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// configuration routes
app.use("/api/v1", userRoute);
app.use("/api/v1", courseRoute);
app.use("/api/v1", paymentRoute);
app.use("/api/v1", otherRoute);
app.get("/", (req, res) =>
  res.send(
    `<h1>Site is Working. click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
  )
);

// error handlers
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});
app.use(errorHandler);

// database connection
connectDatabase();

// video storage
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// payment methods
export const instance = new RazorPay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// create autmatically stats model
nodeCron.schedule("0 0 0 5 * *", async () => {
  try {
    await statsModel.create({});
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
