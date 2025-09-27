import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://ucdcourse.com';
  // Static routes
  const staticUrls = [
    '',
    '/review',
    '/search',
    '/tag',
    // Add more static routes as needed
  ];

  // Example: Add dynamic class pages (replace with real data fetching if needed)
  // const classCrns = ['ECS120', 'GEL12'];
  // const classUrls = classCrns.map(crn => `/class/${encodeURIComponent(crn)}`);

  const urls = [
    ...staticUrls,
    // ...classUrls, // Uncomment and generate dynamically if needed
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (url) => `
      <url>
        <loc>${baseUrl}${url}</loc>
      </url>
    `
      )
      .join('')}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 