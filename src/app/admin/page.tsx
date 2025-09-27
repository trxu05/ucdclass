'use client';

import { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import styles from '../page.module.css';

interface Review {
  id: number;
  crn: string;
  title: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Vote {
  id: number;
  crn: string;
  tag: string;
  createdAt: string;
}

const ADMIN_PASSWORD = ''; // Change this to your desired password

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [login, setLogin] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetch('/api/reviews')
        .then(res => res.json())
        .then(data => {
          setReviews(data);
          setLoading(false);
        });
      fetch('/api/vote/all')
        .then(res => res.json())
        .then(data => setVotes(data));
    }
  }, [isAdmin]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (login.password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setLoginError('');
    } else {
      setLoginError('Incorrect password');
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    setReviews(reviews.filter(r => r.id !== id));
  };

  const handleDeleteVote = async (id: number) => {
    await fetch(`/api/vote/${id}`, { method: 'DELETE' });
    setVotes(votes.filter(v => v.id !== id));
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1>Admin Review Management</h1>
        {!isAdmin ? (
          <form onSubmit={handleLogin} className={styles.adminLoginForm} style={{ marginBottom: 32 }}>
            <input
              name="username"
              placeholder="Admin Username (any)"
              value={login.username}
              onChange={handleLoginChange}
              className={styles.bigInput}
              autoComplete="username"
            />
            <input
              name="password"
              type="password"
              placeholder="Admin Password"
              value={login.password}
              onChange={handleLoginChange}
              className={styles.bigInput}
              autoComplete="current-password"
            />
            <button type="submit" className={styles.bigSubmitButton} style={{ marginTop: 8 }}>Login as Admin</button>
            {loginError && <div style={{ color: 'red', marginTop: 8 }}>{loginError}</div>}
          </form>
        ) : (
          <div style={{ marginTop: 48, width: '100%', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            {loading ? (
              <div>Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888' }}>No reviews yet.</div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <strong>{review.crn} - {review.title}</strong>
                    <span className={styles.stars}>
                      {'★'.repeat(Math.max(0, Math.min(10, review.rating)))}
                      {'☆'.repeat(10 - Math.max(0, Math.min(10, review.rating)))}
                    </span>
                    <span className={styles.date}>{new Date(review.createdAt).toLocaleString()}</span>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className={styles.deleteButton}
                      style={{ marginLeft: 16 }}
                    >
                      Delete
                    </button>
                  </div>
                  <p className={styles.comment}>{review.comment}</p>
                </div>
              ))
            )}
            {/* Votes management section */}
            <div style={{ marginTop: 48 }}>
              <h2>Manage Votes</h2>
              {votes.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888' }}>No votes yet.</div>
              ) : (
                votes.map((vote) => (
                  <div key={vote.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <strong>{vote.crn}</strong>
                      <span style={{ marginLeft: 16 }}>{vote.tag}</span>
                      <span className={styles.date}>{new Date(vote.createdAt).toLocaleString()}</span>
                      <button
                        onClick={() => handleDeleteVote(vote.id)}
                        className={styles.deleteButton}
                        style={{ marginLeft: 16 }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 