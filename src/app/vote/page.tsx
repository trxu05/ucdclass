"use client";
import React, { useState } from "react";
import styles from "../page.module.css";
import Link from 'next/link';
import { Turnstile } from '@marsidev/react-turnstile';

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const TURNSTILE_SITE_KEY = ".";

const TAGS = [
  "Good Class",
  "Bad Class",
  "Useful Class",
  "Useless Class",
  "Fun Class",
  "Boring Class",
];

function normalizeCrn(input: string) {
  const str = input.replace(/\s+/g, '').toUpperCase();
  const match = str.match(/^([A-Z]{3})(\d{1,3})([A-Z]?)$/);
  if (!match) return str;
  const dept = match[1];
  const num = match[2].padStart(3, '0');
  const suffix = match[3];
  return `${dept}${num}${suffix}`;
}

export default function VotePage() {
  const [crn, setCrn] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [votedTag, setVotedTag] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleVote = async () => {
    if (!crn.trim() || !selectedTag || !turnstileToken) return;
    setSubmitting(true);
    const normalizedCrn = normalizeCrn(crn);
    
    try {
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crn: normalizedCrn, tag: selectedTag, turnstileToken }),
      });
      setVotedTag(selectedTag);
      setDone(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit vote');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.navButton} style={{ marginBottom: 24, display: 'inline-block', textAlign: 'center', width: '100%' }}>
          Go Home
        </Link>
        <h1 className={styles.bigTitle}>Vote for a Class</h1>
        <div className={styles.bigReviewForm}>
          <label className={styles.bigLabel} htmlFor="crn">Class CRN:</label>
          <input
            id="crn"
            className={styles.bigInput}
            value={crn}
            onChange={e => setCrn(e.target.value)}
            placeholder="e.g. ECS120"
            disabled={done}
            maxLength={20}
          />
          <div style={{ margin: "2rem 0", display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                className={styles.bigVoteButton}
                style={{
                  margin: 0,
                  background: selectedTag === tag ? '#003262' : '#ffd700',
                  color: selectedTag === tag ? '#fff' : '#003262',
                  fontSize: '1.2rem',
                  padding: '1rem 2rem',
                  border: selectedTag === tag ? '2px solid #003262' : 'none',
                }}
                onClick={() => setSelectedTag(tag)}
                disabled={submitting || done}
              >
                {tag}
              </button>
            ))}
          </div>
          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={setTurnstileToken}
            style={{ marginBottom: 16 }}
          />
          <button
            type="button"
            className={styles.bigSubmitButton}
            style={{ marginTop: 16, width: '100%' }}
            onClick={handleVote}
            disabled={submitting || done || !selectedTag || !crn.trim()}
          >
            Vote
          </button>
          {done && (
            <>
              <div style={{ color: '#003262', fontWeight: 'bold', fontSize: '1.3rem', marginTop: 16 }}>
                Thank you for voting for <span style={{ textTransform: 'uppercase' }}>{crn}</span> as &quot;{votedTag}&quot;!
              </div>
              <button
                className={styles.navButton}
                style={{ marginTop: 20, display: 'inline-block', textAlign: 'center', width: '100%' }}
                onClick={() => {
                  setCrn('');
                  setSelectedTag(null);
                  setVotedTag(null);
                  setDone(false);
                }}
              >
                Vote Again
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 