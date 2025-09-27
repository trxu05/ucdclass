import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UC Davis Class Reviews & Ratings | Find the Best UC Davis Courses",
  description: "Discover and review UC Davis classes. Read real student reviews, compare ratings, and find the best courses at UC Davis. Share your experience and help others choose the right class!",
  openGraph: {
    title: "UC Davis Class Reviews & Ratings | Find the Best UC Davis Courses",
    description: "Discover and review UC Davis classes. Read real student reviews, compare ratings, and find the best courses at UC Davis. Share your experience and help others choose the right class!",
    url: "https://ucdcourse.com/",
    siteName: "UC Davis Class Reviews",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UC Davis Class Reviews & Ratings | Find the Best UC Davis Courses",
    description: "Discover and review UC Davis classes. Read real student reviews, compare ratings, and find the best courses at UC Davis. Share your experience and help others choose the right class!",
    site: "@ucdcourse",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
