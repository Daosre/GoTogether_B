/*
  Warnings:

  - You are about to drop the column `maxParticpants` on the `Event` table. All the data in the column will be lost.
  - Added the required column `maxParticipants` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "maxParticpants",
ADD COLUMN     "maxParticipants" INTEGER NOT NULL;
