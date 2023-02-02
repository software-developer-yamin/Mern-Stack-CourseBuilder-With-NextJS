import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";

//isAuthenticated
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw createHttpError(401, "Not Logged In");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      _id: string;
    };
    res.locals.user = await userModel.findById(decoded._id)
    next();
  } catch (error) {
    next(error);
  }
};

// authorizeSubscribers
export const authorizeSubscribers: RequestHandler = (req, res, next) => {
  try {
    if (
      res.locals.user.subscription.status !== "active" &&
      res.locals.user.role !== "admin"
    ) {
      throw createHttpError(403, `Only Subscribers can acces this resource`);
    }
    next();
  } catch (error) {
    next(error);
  }
};

// authorizeAdmin
export const authorizeAdmin: RequestHandler = (req, res, next) => {
  try {
    if (res.locals.user.role !== "admin") {
      throw createHttpError(
        403,
        `${res.locals.user.role} is not allowed to access this resource`
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
