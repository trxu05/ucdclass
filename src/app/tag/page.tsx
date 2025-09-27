"use client";
import { Suspense } from 'react';
import TagPageContent from './TagPageContent';

export default function TagPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TagPageContent />
    </Suspense>
  );
} 