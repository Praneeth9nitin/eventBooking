-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'HOLD', 'BOOKED');

-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "holdBy" INTEGER,
ADD COLUMN     "holdUntil" TIMESTAMP(3),
ADD COLUMN     "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE';
