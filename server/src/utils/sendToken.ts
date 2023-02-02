import { Response } from "express";

export default async function sendToken(
  res: Response,
  user: { getJWTToken: () => Promise<string> },
  message: string,
  statusCode = 200
) {
  const token = await user.getJWTToken();
  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      //secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message,
      user,
    });
}
