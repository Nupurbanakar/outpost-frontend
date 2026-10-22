import { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import api from '@/api/client';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (url: string | null) => void;
  label?: string;
  required?: boolean;
}

export function ProfilePhotoUpload({ 
  currentPhotoUrl, 
  onPhotoChange,
  label = "Profile Photo",
  required = false
}: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<{ url: string }>('/upload/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onPhotoChange(response.data.url);
      setUploadSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error: any) {
      console.error('Photo upload failed:', error);
      setUploadError(
        error.response?.data?.message || 
        error.response?.data?.detail ||
        'Failed to upload photo. Please try again.'
      );
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleRemove = () => {
    onPhotoChange(null);
    setUploadSuccess(false);
    setUploadError(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          {label} {required && '*'}
        </div>
      </label>

      <div className="space-y-3">
        {/* Preview */}
        {currentPhotoUrl && (
          <div className="flex items-center gap-4 p-4 border border-line bg-[#f5f3ed]">
            <img 
              src={currentPhotoUrl} 
              alt="Profile preview"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">Photo uploaded</p>
              <p className="text-xs text-muted-text mt-1">Your profile photo is set</p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              aria-label="Remove photo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Upload Button */}
        {!currentPhotoUrl && (
          <div className="flex items-center gap-3">
            <label
              htmlFor="photo-upload"
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 
                border-2 border-dashed border-line hover:border-ink
                cursor-pointer transition-colors
                ${isUploading ? 'opacity-50 cursor-wait' : ''}
              `}
            >
              <Upload className="w-5 h-5 text-ink" />
              <span className="text-sm font-medium text-ink">
                {isUploading ? 'Uploading...' : 'Upload Photo'}
              </span>
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-800 text-sm">
            <Check className="w-4 h-4" />
            <span>Photo uploaded successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm">
            {uploadError}
          </div>
        )}

        {/* Info Text */}
        {!currentPhotoUrl && (
          <p className="text-xs text-muted-text">
            Upload a professional photo (JPG, PNG). Max size: 5MB. Square images work best.
          </p>
        )}
      </div>
    </div>
  );
}
