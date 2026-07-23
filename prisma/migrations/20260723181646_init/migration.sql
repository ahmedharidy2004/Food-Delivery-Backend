-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordExpiresIn" TEXT,
ADD COLUMN     "resetPasswordToken" TEXT;
