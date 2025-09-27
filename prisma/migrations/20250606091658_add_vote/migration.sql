-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "crn" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);
