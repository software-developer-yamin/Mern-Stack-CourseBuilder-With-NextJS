import { RequestHandler } from "express";
import createHttpError from "http-errors";
import courseModel from "../models/course.model";
import cloudinary from "cloudinary";
import getDataURL from "../utils/dataURL";
import statsModel from "../models/stats.model";

export const getAllCourses: RequestHandler<
  unknown,
  unknown,
  unknown,
  { keyword?: string; category?: string }
> = async (req, res, next) => {
  try {
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";

    const courses = await courseModel
      .find({
        title: {
          $regex: keyword,
          $options: "i",
        },
        category: {
          $regex: category,
          $options: "i",
        },
      })
      .select("-lectures");
    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

interface CreateCourseBody {
  title: string;
  description: string;
  category: string;
  createdBy: string;
}

export const createCourse: RequestHandler<
  unknown,
  unknown,
  CreateCourseBody,
  unknown
> = async (req, res, next) => {
  try {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
      throw createHttpError(400, "Please add all fields");
    }

    const file = req.file;

    const fileURL = getDataURL(file);

    const mycloud = await cloudinary.v2.uploader.upload(fileURL?.content!);

    await courseModel.create({
      title,
      description,
      category,
      createdBy,
      poster: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
    });
    res.status(201).json({
      success: true,
      message: "Course Created Successfully. You can add lectures now.",
    });
  } catch (error) {
    next(error);
  }
};

//getCourseLectures

export const getCourseLectures: RequestHandler<
  { id: string },
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const course = await courseModel.findById(req.params.id);

    if (!course) {
      throw createHttpError(404, "Course not found");
    }

    course.views += 1;

    await course.save();

    res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    next(error);
  }
};

// Max video size 100mb
interface IAddLecture {
  title: string;
  description: string;
}

export const addLecture: RequestHandler<
  { id: string },
  unknown,
  IAddLecture,
  unknown
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const course = await courseModel.findById(id);

    if (!course) {
      throw createHttpError(404, "Course not found");
    }

    const file = req.file;
    const fileURL = getDataURL(file);

    const mycloud = await cloudinary.v2.uploader.upload(fileURL?.content!, {
      resource_type: "video",
    });

    course.lectures.push({
      title,
      description,
      video: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
    });

    course.numOfVideos = course.lectures.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture added in Course",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse: RequestHandler<
  { id: string },
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await courseModel.findById(id);

    if (!course) {
      throw createHttpError(404, "Course not found");
    }

    await cloudinary.v2.uploader.destroy(course?.poster?.public_id!);

    for (let i = 0; i < course.lectures.length; i++) {
      const singleLecture = course.lectures[i];
      await cloudinary.v2.uploader.destroy(singleLecture?.video?.public_id!, {
        resource_type: "video",
      });
    }

    await course.remove();

    res.status(200).json({
      success: true,
      message: "Course Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// deleteLecture
interface ILecture {
  title: string;
  description: string;
  video?: {
    public_id: string;
    url: string;
  };
  _id?: string;
}

export const deleteLecture: RequestHandler<
  { id: string },
  unknown,
  unknown,
  {
    courseId: string;
    lectureId: string;
  }
> = async (req, res, next) => {
  try {
    const { courseId, lectureId } = req.query;

    const course = await courseModel.findById(courseId);

    if (!course) {
      throw createHttpError(404, "Course not found");
    }

    const lecture = course.lectures.find((item: ILecture) => {
      if (item._id!.toString() === lectureId.toString()) return item;
    });

    await cloudinary.v2.uploader.destroy(lecture?.video?.public_id!, {
      resource_type: "video",
    });

    course.lectures = course.lectures.filter((item: ILecture) => {
      if (item._id!.toString() !== lectureId.toString()) return item;
    });

    course.numOfVideos = course.lectures.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

courseModel.watch().on("change", async () => {
  const stats = await statsModel.find({}).sort({ createdAt: "desc" }).limit(1);

  const courses = await courseModel.find({});

  let totalViews = 0;

  for (let i = 0; i < courses.length; i++) {
    totalViews += courses[i].views;
  }
  stats[0].views = totalViews;
  stats[0].createdAt = new Date(Date.now());

  await stats[0].save();
});
