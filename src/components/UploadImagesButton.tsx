import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { uploadSchoolImagesToSupabase } from '@/utils/uploadSchoolImages'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

export const UploadImagesButton: React.FC = () => {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [uploadResults, setUploadResults] = useState<any>(null)

  const handleUpload = async () => {
    try {
      setUploading(true)
      setUploadStatus('idle')
      setUploadResults(null)

      const results = await uploadSchoolImagesToSupabase()
      
      setUploadResults(results)
      setUploadStatus('success')
      
      console.log('Upload results:', results)
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadStatus('error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleUpload}
        disabled={uploading}
        className="flex items-center gap-2"
      >
        {uploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Subiendo imágenes...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Subir imágenes a Supabase
          </>
        )}
      </Button>

      {uploadStatus === 'success' && uploadResults && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">¡Subida completada!</span>
          </div>
          <div className="text-sm text-green-600">
            <p>Total: {uploadResults.summary.total} imágenes</p>
            <p>Exitosas: {uploadResults.summary.success}</p>
            <p>Errores: {uploadResults.summary.errors}</p>
          </div>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error al subir imágenes</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            Revisa la consola para más detalles.
          </p>
        </div>
      )}
    </div>
  )
}