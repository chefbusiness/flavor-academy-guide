
import React from 'react';
import { SchoolImageManager } from '@/components/SchoolImageManager';
import { UploadImagesButton } from '@/components/UploadImagesButton';
import { UploadNewSchoolImages } from '@/components/UploadNewSchoolImages';
import { UploadAISchoolImages } from '@/components/UploadAISchoolImages';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ImageManager() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">School Image Manager</h1>
        
        <div className="mb-8 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Subir imágenes a Supabase Storage</h2>
          <p className="text-muted-foreground mb-4">
            Sube todas las imágenes de las escuelas al storage de Supabase y actualiza las URLs en la base de datos.
          </p>
          <UploadImagesButton />
        </div>

        <div className="mb-8">
          <UploadAISchoolImages />
        </div>
        
        <div className="mb-8">
          <UploadNewSchoolImages />
        </div>
        
        <SchoolImageManager />
      </main>
      <Footer />
    </div>
  );
}
