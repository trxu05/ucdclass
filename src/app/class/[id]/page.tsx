import { PrismaClient } from '@prisma/client';
import styles from './page.module.css';
import Link from 'next/link';
import { FaHome, FaSearch } from 'react-icons/fa';

const prisma = new PrismaClient();

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: Date;
  instructor: string;
};

type ClassPageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    tag?: string;
  };
};

export default async function Page(props: ClassPageProps) {
  const { params, searchParams } = await props;
  const crn = decodeURIComponent(params.id);
  const tag = searchParams?.tag;
  // Fetch all reviews for this CRN
  const reviews = await prisma.review.findMany({
    where: { crn },
    orderBy: { createdAt: 'desc' },
  });
  if (reviews.length === 0) {
    return (
      <main className={styles.main}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <Link href="/" className={styles.homeLink} style={{ color: '#003262', fontWeight: 500, fontSize: '1.1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}><FaHome style={{ marginRight: 4 }} /> Home</Link>
          <Link href="/search" className={styles.homeLink} style={{ color: '#003262', fontWeight: 500, fontSize: '1.1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}><FaSearch style={{ marginRight: 4 }} /> Search</Link>
          <Link href={tag ? `/tag?tag=${encodeURIComponent(tag)}` : "/tag"} className={styles.homeLink} style={{ color: '#003262', fontWeight: 500, fontSize: '1.1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>Tag</Link>
        </div>
        <h1>No reviews found for this class.</h1>
      </main>
    );
  }
  // Use the first review for class info (title)
  const { title } = reviews[0];
  const averageRating =
    reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length;
  return (
    <main className={styles.main}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Link href="/" className={styles.homeLink} style={{ color: '#003262', fontWeight: 500, fontSize: '1.1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}><FaHome style={{ marginRight: 4 }} /> Home</Link>
        <Link href="/search" className={styles.homeLink} style={{ color: '#003262', fontWeight: 500, fontSize: '1.1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}><FaSearch style={{ marginRight: 4 }} /> Search</Link>
        <Link href={tag ? `/tag?tag=${encodeURIComponent(tag)}` : "/tag"} className={styles.homeLink} style={{ color: '#003262', fontWeight: 500, fontSize: '1.1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>Tag</Link>
      </div>
      <h1>{title} ({crn})</h1>
      <h3>Average Rating: {averageRating.toFixed(1)} ({reviews.length} review{reviews.length > 1 ? 's' : ''})</h3>
      <div className={styles.reviews}>
        <h2>Class Reviews</h2>
        {reviews.map((review: Review) => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.stars}>
                {review.rating}/10
              </div>
              <span className={styles.date}>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <div className={styles.instructor}><strong>Instructor:</strong> {review.instructor}</div>
            <p className={styles.comment}><strong>Comment:</strong> {review.comment}</p>
          </div>
        ))}
      </div>
    </main>
  );
} 