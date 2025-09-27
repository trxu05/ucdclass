-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "crn" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
