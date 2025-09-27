import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get('query') || '';
  if (!query) {
    return NextResponse.json([]);
  }
  // Find all reviews that match the query in crn, title, or instructor
  const reviews = await prisma.review.findMany({
    where: {
      OR: [
        { crn: { contains: query, mode: 'insensitive' } },
        { title: { contains: query, mode: 'insensitive' } },
        { instructor: { contains: query, mode: 'insensitive' } },
      ],
    },
  });
  // Group by crn only
  const classMap = new Map();
  for (const review of reviews) {
    const key = review.crn;
    if (!classMap.has(key)) {
      classMap.set(key, {
        crn: review.crn,
        titles: new Set(),
        instructors: new Set(),
        ratings: [],
        reviewCount: 0,
        latestTitle: review.title,
        latestInstructor: review.instructor,
        latestCreatedAt: review.createdAt,
      });
    }
    const entry = classMap.get(key);
    entry.titles.add(review.title);
    entry.instructors.add(review.instructor);
    entry.ratings.push(review.rating);
    entry.reviewCount++;
    // Use the latest review's title/instructor for display
    if (review.createdAt > entry.latestCreatedAt) {
      entry.latestTitle = review.title;
      entry.latestInstructor = review.instructor;
      entry.latestCreatedAt = review.createdAt;
    }
  }
  const classes = Array.from(classMap.values()).map(cls => ({
    crn: cls.crn,
    title: cls.latestTitle,
    instructor: cls.latestInstructor,
    averageRating: cls.ratings.reduce((a: number, b: number) => a + b, 0) / cls.ratings.length,
    reviewCount: cls.reviewCount,
  }));
  return NextResponse.json(classes, { headers: { 'Cache-Control': 's-maxage=60' } });
} 