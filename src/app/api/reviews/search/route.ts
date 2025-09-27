import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get('query') || '';
  if (!query) {
    return NextResponse.json([]);
  }
  const reviews = await prisma.review.findMany({
    where: {
      OR: [
        { crn: { contains: query, mode: 'insensitive' } },
        { comment: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(reviews, { headers: { 'Cache-Control': 's-maxage=60' } });
} 