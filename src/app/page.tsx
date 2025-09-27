'use client';

import Navbar from './Navbar';
import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.bigTitle}>UC Davis Class Tool</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <Link href="/review" className={styles.bigLeaveReviewButton}>
            Leave a Review
          </Link>
          <Link href="/vote" className={styles.bigVoteButton}>
            Vote Class
          </Link>
        </div>
      </main>
    </div>
  );
}
