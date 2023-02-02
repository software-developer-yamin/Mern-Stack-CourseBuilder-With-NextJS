import createHttpError from "http-errors";
import { createTransport } from "nodemailer";
import userModel from "../models/user.model";

const options = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT as unknown as number,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = createTransport(options);

  await transporter.sendMail({
    to,
    subject,
    text,
  });
};


