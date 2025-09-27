import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(reviews);
}

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
  try {
    const data = await req.json();
    const { crn, title, instructor, rating, comment, turnstileToken } = data;
    if (!crn || !title || !instructor || !rating || !comment || !turnstileToken) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (
      crn.length > 20 ||
      title.length > 100 ||
      instructor.length > 50 ||
      comment.length > 500
    ) {
      return NextResponse.json({ error: 'Input too long' }, { status: 400 });
    }
    if (Number(rating) < 1 || Number(rating) > 10) {
      return NextResponse.json({ error: 'Rating must be between 1 and 10' }, { status: 400 });
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
    if (!result.success) {
      return NextResponse.json({ error: 'Turnstile verification failed', details: result }, { status: 400 });
    }
    const review = await prisma.review.create({
      data: { crn: normalizeCrn(crn), title, instructor, rating: Number(rating), comment }
    });
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 