import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  // Extract the id from the URL
  const url = req.nextUrl;
  const id = Number(url.pathname.split('/').pop());
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 