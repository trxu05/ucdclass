import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const tag = req.nextUrl.searchParams.get('tag');
  if (!tag) {
    return NextResponse.json([]);
  }
  // Group by both crn and tag to avoid duplicate entries
  const votes = await prisma.vote.groupBy({
    by: ['crn', 'tag'],
    where: { tag: { equals: tag, mode: 'insensitive' } },
    _count: { crn: true },
  });
  // Deduplicate by crn and sum the counts
  const crnMap = new Map();
  for (const v of votes) {
    crnMap.set(v.crn, (crnMap.get(v.crn) || 0) + v._count.crn);
  }
  const result = Array.from(crnMap.entries())
    .map(([crn, count]) => ({ crn, count }))
    .sort((a, b) => b.count - a.count);
  return NextResponse.json(result);
} 