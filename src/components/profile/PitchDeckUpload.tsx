import { useState, useRef } from 'react';
import { Upload, FileText, Trash2, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { foundersApi } from '@/api/endpoints/founders';

interface PitchDeckUploadProps {
  currentDeckUrl?: string;
  onUploadSuccess: (url: string) => void;
  onDeleteSuccess: () => void;
}

export function PitchDeckUpload({ currentDeckUrl, onUploadSuccess, onDeleteSuccess }: PitchDeckUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (file.type !== 'application/pdf') {
      return 'Only PDF files are allowed';
    }
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const handleFileSelect = async (file: File) => {
    setError(null);
    setSuccess(false);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await foundersApi.uploadPitchDeck(file);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(true);
      
      // Pass the URL from upload response
      onUploadSuccess(result.url);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => {
        setSuccess(false);
        setUploadProgress(0);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload pitch deck');
      // Reset file input on error too
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your pitch deck?')) {
      return;
    }

    try {
      setError(null);
      await foundersApi.deletePitchDeck();
      onDeleteSuccess();
      
      // Reset file input after delete
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete pitch deck');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Current Deck */}
      {currentDeckUrl && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-indigo-600" />
              <div>
                <p className="font-medium text-gray-900">Current Pitch Deck</p>
                <p className="text-sm text-gray-600">PDF document</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={currentDeckUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-3">
            <Upload className="mx-auto h-12 w-12 text-indigo-600 animate-pulse" />
            <div>
              <p className="font-medium text-gray-900">Uploading...</p>
              <div className="mt-2 mx-auto w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-1 text-sm text-gray-600">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">
                {currentDeckUrl ? 'Replace pitch deck' : 'Upload pitch deck'}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Drag and drop your PDF here, or{' '}
                <button
                  onClick={handleBrowseClick}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  browse
                </button>
              </p>
              <p className="mt-2 text-xs text-gray-500">PDF only, max 10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>Pitch deck uploaded successfully!</span>
        </div>
      )}
    </div>
  );
}
