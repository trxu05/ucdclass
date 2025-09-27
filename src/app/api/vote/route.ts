import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function normalizeCrn(input: string) {
  const str = input.replace(/\s+/g, '').toUpperCase();
  const match = str.match(/^([A-Z]{3})(\d{1,3})([A-Z]?)$/);
  if (!match) return str;
  const dept = match[1];
  const num = match[2].padStart(3, '0');
  const suffix = match[3];
  return `${dept}${num}${suffix}`;
}

export async function POST(req: NextRequest) {
  const { crn, tag, turnstileToken } = await req.json();
  if (!crn || !tag || !turnstileToken) {
    return NextResponse.json({ error: 'Missing crn, tag, or turnstileToken' }, { status: 400 });
  }
  if (
    crn.length > 20 ||
    tag.length > 30
  ) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 });
  }
  // Verify Turnstile
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${turnstileToken}`,
    }
  );
  const result = await response.json();
  console.log('Turnstile verification result:', result); // Debug log
  if (!result.success) {
    return NextResponse.json({ error: 'Turnstile verification failed', details: result }, { status: 400 });
  }
  // Allow multiple votes per class/tag (no duplicate check)
  const vote = await prisma.vote.create({
    data: { crn: normalizeCrn(crn), tag },
  });
  return NextResponse.json(vote);
} 