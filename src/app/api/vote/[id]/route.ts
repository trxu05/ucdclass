import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, context: any) {
  const id = Number(context.params.id);
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await prisma.vote.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 