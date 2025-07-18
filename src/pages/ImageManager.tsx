import React from 'react';
import { SchoolImageManager } from '@/components/SchoolImageManager';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ImageManager() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">School Image Manager</h1>
        <SchoolImageManager />
      </main>
      <Footer />
    </div>
  );
}