import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const votes = await prisma.vote.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(votes);
} 