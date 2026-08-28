/*
  Warnings:

  - Changed the type of `frequency` on the `Income` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "IncomeFrequency" AS ENUM ('ONE_TIME', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "frequency",
ADD COLUMN     "frequency" "IncomeFrequency" NOT NULL;
