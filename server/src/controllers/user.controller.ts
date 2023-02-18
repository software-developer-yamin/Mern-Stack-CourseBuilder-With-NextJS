import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import userModel from "../models/user.model";
import { sendEmail } from "../utils/sendEmail";
import sendToken from "../utils/sendToken";
import * as crypto from "crypto";
import courseModel from "../models/course.model";
import getDataURL from "../utils/dataURL";
import cloudinary from "cloudinary";
import statsModel from "../models/stats.model";

// register
interface IRegisterBody {
  name: string;
  email: string;
  password: string;
}

export const register: RequestHandler<
  unknown,
  unknown,
  IRegisterBody,
  unknown
> = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file;

    if (!name || !email || !password) {
      throw createHttpError(400, "Please enter all field");
    }

    let user = await userModel.findOne({ email });

    if (user) {
      throw createHttpError(409, "User Already Exist");
    }

    const fileURL = getDataURL(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileURL?.content!);

    user = await userModel.create({
      name,
      email,
      password,
      avatar: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
    });

    sendToken(res, user, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

// login
interface ILoginBody {
  email: string;
  password: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  ILoginBody,
  unknown
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createHttpError(400, "Please enter all field");
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      throw createHttpError(401, "Incorrect Email or Password");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw createHttpError(401, "Incorrect Email or Password");
    }
    sendToken(res, user, `Welcome back, ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};

// logout
export const logout: RequestHandler = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        //secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  } catch (error) {
    next(error);
  }
};

// getMyProfile
export const getMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const user = await userModel.findById(res.locals.user._id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// changePassword
interface IChangePasswordBody {
  oldPassword: string;
  newPassword: string;
}

export const changePassword: RequestHandler<
  unknown,
  unknown,
  IChangePasswordBody,
  unknown
> = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw createHttpError(400, "Please enter all field");
    }
    const user = await userModel
      .findById(res.locals.user._id)
      .select("+password");
    const isMatch = await user?.comparePassword(oldPassword);
    if (user && isMatch) {
      user.password = newPassword;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Password Changed Successfully",
      });
    } else {
      throw createHttpError(400, "Incorrect Old Password");
    }
  } catch (error) {
    next(error);
  }
};

//updateProfile
interface IUpdateProfileBody {
  name: string;
  email: string;
}

export const updateProfile: RequestHandler<
  unknown,
  unknown,
  IUpdateProfileBody,
  unknown
> = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await userModel.findById(res.locals.user._id);
    if (user) {
      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      await user.save();
      res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

// updateprofilepicture
export const updateprofilepicture: RequestHandler = async (req, res, next) => {
  try {
    const file = req.file;

    const user = await userModel.findById(res.locals.user._id);

    const fileURL = getDataURL(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileURL?.content!);

    if (user) {
      await cloudinary.v2.uploader.destroy(user?.avatar?.public_id!);

      user.avatar = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      };
      await user.save();

      res.status(200).json({
        success: true,
        message: "Profile Picture Updated Successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

// forgetPassword
interface IForgetPasswordBody {
  email: string;
}

export const forgetPassword: RequestHandler<
  unknown,
  unknown,
  IForgetPasswordBody,
  unknown
> = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      throw createHttpError(400, "User not found");
    }

    const resetToken = await user.getResetToken();

    await user.save();

    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const message = `Click on the link to reset your password. ${url}. If you have not request then please ignore.`;

    // Send token via email
    await sendEmail(user.email, "CourseBundler Reset Password", message);

    res.status(200).json({
      success: true,
      message: `Reset Token has been sent to ${user.email}`,
    });
  } catch (error) {
    next(error);
  }
};

// userResetPassword
export const resetPassword: RequestHandler<
  { token: string },
  unknown,
  { password: string },
  unknown
> = async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw createHttpError(401, "Token is invalid or has been expired");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
  });
};

// addToPlaylist
interface AddToPlaylistBody {
  id: string;
}

export const addToPlaylist: RequestHandler<
  unknown,
  unknown,
  AddToPlaylistBody,
  unknown
> = async (req, res, next) => {
  const user = await userModel.findById(res.locals.user._id);

  const course = await courseModel.findById(req.body.id);

  if (!course) {
    throw createHttpError(404, "Invalid Course Id");
  }

  if (user) {
    const itemExist = user.playlist.find((item) => {
      if (item.course && item.course.toString() === course._id.toString())
        return true;
    });

    if (itemExist) {
      throw createHttpError(409, "Item Already Exist");
    }

    user.playlist.push({
      course: course._id,
      poster: course.poster && course.poster.url,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Added to playlist",
    });
  }
};

export const removeFromPlaylist: RequestHandler<
  unknown,
  unknown,
  unknown,
  { id: string }
> = async (req, res, next) => {
  try {
    const user = await userModel.findById(res.locals.user._id);
    const course = await courseModel.findById(req.query.id);
    if (!course) {
      throw createHttpError(404, "Invalid Course Id");
    }

    if (user) {
      const newPlaylist = user.playlist.filter((item) => {
        if (item.course && item.course.toString() !== course._id.toString())
          return item;
      });

      user.playlist = newPlaylist;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Removed From Playlist",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Admin Controllers

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userModel.find({});

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole: RequestHandler<
  { id: string },
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (user.role === "user") {
      user.role = "admin";
    } else {
      user.role = "user";
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Role Updated",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler<
  { id: string },
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    await cloudinary.v2.uploader.destroy(user?.avatar?.public_id!);

    // Cancel Subscription

    await user.remove();

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const user = await userModel.findById(res.locals.user._id);
    if (user) {
      await cloudinary.v2.uploader.destroy(user?.avatar?.public_id!);

      // Cancel Subscription

      await user.remove();

      res
        .status(200)
        .cookie("token", null, {
          expires: new Date(Date.now()),
        })
        .json({
          success: true,
          message: "User Deleted Successfully",
        });
    }
  } catch (error) {
    next(error);
  }
};

userModel.watch().on("change", async () => {
  const stats = await statsModel.find({}).sort({ createdAt: "desc" }).limit(1);

  const subscription = await userModel.find({
    "subscription.status": "active",
  });

  if (
    stats &&
    stats[0]?.users &&
    stats[0]?.subscription &&
    stats[0]?.createdAt
  ) {
    stats[0].users = await userModel.countDocuments();
    stats[0].subscription = subscription.length;
    stats[0].createdAt = new Date(Date.now());

    await stats[0].save();
  }
});
