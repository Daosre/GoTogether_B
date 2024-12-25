/*
  Warnings:

  - You are about to drop the `Evenement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Evenement" DROP CONSTRAINT "Evenement_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Evenement" DROP CONSTRAINT "Evenement_userId_fkey";

-- DropForeignKey
ALTER TABLE "User_Participates_Event" DROP CONSTRAINT "User_Participates_Event_eventId_fkey";

-- DropTable
DROP TABLE "Evenement";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "city" VARCHAR(30) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "maxParticpants" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User_Participates_Event" ADD CONSTRAINT "User_Participates_Event_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
