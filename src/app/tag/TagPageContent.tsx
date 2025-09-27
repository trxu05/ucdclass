"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../page.module.css';
import { FaHome, FaArrowRight } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';

const TAGS = [
  'Good Class',
  'Bad Class',
  'Useful Class',
  'Useless Class',
  'Fun Class',
  'Boring Class',
];

interface TagClass {
  crn: string;
  count: number;
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

export default function TagPageContent() {
  const searchParams = useSearchParams();
  const tagFromQuery = searchParams.get('tag') || '';
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [classes, setClasses] = useState<TagClass[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tagFromQuery && tagFromQuery !== selectedTag) {
      setSelectedTag(tagFromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagFromQuery]);

  useEffect(() => {
    if (!selectedTag) return;
    setLoading(true);
    fetch(`/api/vote/by-tag?tag=${encodeURIComponent(selectedTag)}`)
      .then(res => res.json())
      .then(data => {
        setClasses(data);
        setLoading(false);
      });
  }, [selectedTag]);

  return (
    <div className={`${styles.page} ${styles.tagPage}`}>
      <main className={styles.main} style={{ paddingTop: 0, gap: 8 }}>
        <Link href="/" className={styles.homeLink} style={{ marginTop: 0, marginBottom: 0, fontSize: '1.2rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaHome style={{ marginRight: 4 }} /> Home
        </Link>
        <h1 className={styles.bigTitle} style={{ marginTop: '0', marginBottom: '0.7rem' }}>UC Davis Class Tool</h1>
        <h2 className={styles.bigTitle} style={{ fontSize: '2rem', marginBottom: '0.7rem', marginTop: 0 }}>Browse Classes by Tag</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', minHeight: 220 }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: 16 }}>
            {TAGS.map(tag => (
              <button
                key={tag}
                className={styles.bigVoteButton}
                style={{ background: selectedTag === tag ? '#003262' : '#ffd700', color: selectedTag === tag ? '#fff' : '#003262', fontSize: '1.2rem', padding: '1rem 2rem' }}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
            {selectedTag ? (
              loading ? (
                <div>Loading...</div>
              ) :
                classes.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#888', minHeight: 40 }}>No classes for this tag yet.</div>
                ) : (
                  <>
                    {classes.map(cls => (
                      <div key={cls.crn} className={styles.classCard} style={{ display: 'block', marginBottom: 16 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#003262' }}>{normalizeCrn(cls.crn)}</div>
                        <div style={{ color: '#333', fontSize: '1.1rem' }}>Votes: {cls.count}</div>
                        <Link href={`/class/${encodeURIComponent(normalizeCrn(cls.crn))}?tag=${encodeURIComponent(selectedTag)}`}>
                          <button className={styles.viewDetailsButton} style={{ marginTop: 8, cursor: 'pointer', fontWeight: 600, fontSize: '1rem', border: 'none', outline: 'none', background: '#003262', color: '#fff', borderRadius: 6, padding: '0.5rem 1.2rem', transition: 'background 0.2s, color 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
                            onMouseOver={e => (e.currentTarget.style.background = '#002244', e.currentTarget.style.color = '#ffd700')}
                            onMouseOut={e => (e.currentTarget.style.background = '#003262', e.currentTarget.style.color = '#fff')}
                            onFocus={e => (e.currentTarget.style.background = '#002244', e.currentTarget.style.color = '#ffd700')}
                            onBlur={e => (e.currentTarget.style.background = '#003262', e.currentTarget.style.color = '#fff')}
                          >
                            View Details <FaArrowRight style={{ marginLeft: 4 }} />
                          </button>
                        </Link>
                      </div>
                    ))}
                  </>
                )
              ) : (
              <div style={{ textAlign: 'center', color: '#888', minHeight: 40 }}>Select a tag to see classes.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 