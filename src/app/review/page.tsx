"use client";

import { useState } from 'react';
import Navbar from '../Navbar';
import styles from "../page.module.css";
import React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

const TURNSTILE_SITE_KEY = "";

export default function ReviewPage() {
  const [form, setForm] = useState({ crn: '', title: '', instructor: '', rating: 10, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  function normalizeCrn(input: string) {
    const str = input.replace(/\s+/g, '').toUpperCase();
    const match = str.match(/^([A-Z]{3})(\d{1,3})([A-Z]?)$/);
    if (!match) return str;
    const dept = match[1];
    const num = match[2].padStart(3, '0');
    const suffix = match[3];
    return `${dept}${num}${suffix}`;
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!turnstileToken) throw new Error('No Turnstile token');
      const normalizedForm = { ...form, crn: normalizeCrn(form.crn), turnstileToken };
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedForm),
      });
      if (res.ok) {
        setForm({ crn: '', title: '', instructor: '', rating: 10, comment: '' });
        setSubmitted(true);
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.bigTitle}>Review Class</h1>
        {submitted ? (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <h2>Thank you for your review!</h2>
            <button className={styles.bigLeaveReviewButton} onClick={() => setSubmitted(false)}>
              Leave Another Review
            </button>
          </div>
        ) : (
          <form className={styles.bigReviewForm} onSubmit={handleFormSubmit}>
            <div>
              <label className={styles.bigLabel}>Class CRN:</label>
              <input
                name="crn"
                value={form.crn}
                onChange={handleFormChange}
                required
                className={styles.bigInput}
                placeholder="e.g. NAS001"
                maxLength={20}
              />
            </div>
            <div>
              <label className={styles.bigLabel}>Class Title:</label>
              <input
                name="title"
                value={form.title}
                onChange={handleFormChange}
                required
                className={styles.bigInput}
                placeholder="e.g. Calculus I"
                maxLength={100}
              />
            </div>
            <div>
              <label className={styles.bigLabel}>Instructor:</label>
              <input
                name="instructor"
                value={form.instructor}
                onChange={handleFormChange}
                required
                className={styles.bigInput}
                placeholder="Enter instructor's name"
                maxLength={50}
              />
            </div>
            <div>
              <label className={styles.bigLabel}>Rating:</label>
              <select
                name="rating"
                value={form.rating}
                onChange={handleFormChange}
                className={styles.bigInput}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.bigLabel}>Comment:</label>
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleFormChange}
                required
                className={styles.bigInput}
                rows={4}
                maxLength={500}
              />
            </div>
            <Turnstile
              siteKey={TURNSTILE_SITE_KEY}
              onSuccess={setTurnstileToken}
              style={{ marginBottom: 16 }}
            />
            <button type="submit" className={styles.bigSubmitButton} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
} 