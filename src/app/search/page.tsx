'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import styles from './search.module.css';

interface Class {
  crn: string;
  title: string;
  instructor: string;
  averageRating: number;
  reviewCount: number;
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

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setHasSearched(true);
    if (!searchTerm.trim()) {
      setClasses([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/classes/search?query=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error searching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.navButton} style={{ marginTop: 0, marginBottom: 16, fontSize: '1.2rem', display: 'inline-block' }}>
        <FaHome style={{ marginRight: 8, verticalAlign: 'middle' }} />
        Home
      </Link>
      <h1>Search Classes</h1>
      <form className={styles.searchContainer} onSubmit={e => { e.preventDefault(); handleSearch(); }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by CRN, title, or instructor..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.results}>
          {classes.length > 0 ? (
            classes.map((cls) => (
              <div key={cls.crn} className={styles.classCard}>
                <h2 className={styles.crnTitle}>{normalizeCrn(cls.crn)}</h2>
                <p><strong>Course Title:</strong> {cls.title}</p>
                <p><strong>Instructor:</strong> {cls.instructor}</p>
                <p><strong>Average Rating:</strong> {cls.averageRating.toFixed(1)}</p>
                <p><strong>Reviews:</strong> {cls.reviewCount}</p>
                <Link href={`/class/${encodeURIComponent(cls.crn)}`}>
                  <button className={styles.viewDetailsButton} style={{ marginTop: 12, display: 'inline-block' }}>
                    View Details
                  </button>
                </Link>
              </div>
            ))
          ) : (
            hasSearched && searchTerm && <p>No classes found.</p>
          )}
        </div>
      )}
    </div>
  );
} 