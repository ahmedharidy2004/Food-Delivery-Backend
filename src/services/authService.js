import { hashPassword, comparePassword } from "./../utils/password.js";
import { signToken, verifyToken } from "./../utils/jwt.js";
import AppError from "./../utils/appError.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "./../config/config.js";

export const signup = async (body) => {
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: await hashPassword(body.password),
      phoneNumber: body.phoneNumber,
    },

    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

export const login = async (body) => {
  // check for email / passowrd existance
  if (!body.email || !body.password) {
    throw new AppError("you can not leave the email/password empty!", 400);
  }

  // check if email exists in the database.
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  if (!user) {
    throw new AppError(
      "The email you entered is not found. please create a new account.",
      400,
    );
  }

  // check if the password is correct.
  if (!(await comparePassword(body.password, user.password))) {
    throw new AppError("Incorrect password provided", 400);
  }

  // if so return user
  return user;
};

export const updatePassword = async (body, user) => {
  // verification of the token is done using protect middleware

  // check existance of fields required
  if (!body.password || !body.newPasswordConfirm || !body.newPassword) {
    throw new AppError("empty requirement", 400);
  }
  // checking current password
  if (!(await comparePassword(body.password, user.password))) {
    throw new AppError("Incorrect Password", 400);
  }

  // check if the newPassword and newPasswordConfirm matches
  if (body.newPassword !== body.newPasswordConfirm) {
    throw new AppError("Passwords do not match!", 400);
  }

  const updatedUser = await prisma.user.update({
    data: {
      password: await hashPassword(body.newPassword),
    },
    where: {
      id: user.id,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  return updatedUser;
};

export const forgetPassword = async (bodyEmail) => {
  const user = await prisma.user.findUnique({
    where: {
      email: bodyEmail,
    },
  });

  if (!user) throw new AppError("Email not found", 400);

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpiresIn: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  return resetToken;
};

export const resetPassword = async (token, password) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpiresIn: {
        gt: new Date(),
      },
    },
  });

  if (!user) throw new AppError("Token is invalid or expired", 400);

  const hashedPassword = await hashPassword(password);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiresIn: null,
    },
  });
};
