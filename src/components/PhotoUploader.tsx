import React, { useState, useCallback } from 'react';
import { Upload, X, FileImage, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import toast from 'react-hot-toast';

interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

interface PhotoUploaderProps {
  albumName: string;
  onUploadComplete?: (photos: PhotoFile[]) => void;
}

export function PhotoUploader({ albumName, onUploadComplete }: PhotoUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processFiles = useCallback((files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic');
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      return true;
    });

    const newPhotos: PhotoFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending'
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== id);
    });
  }, []);

  const uploadPhotos = useCallback(async () => {
    if (photos.length === 0) return;

    setIsUploading(true);
    
    // Simulate upload process
    for (const photo of photos) {
      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? { ...p, status: 'uploading' as const } : p
      ));

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setPhotos(prev => prev.map(p => 
          p.id === photo.id ? { ...p, progress } : p
        ));
      }

      setPhotos(prev => prev.map(p => 
        p.id === photo.id ? { ...p, status: 'completed' as const, progress: 100 } : p
      ));
    }

    setIsUploading(false);
    toast.success(`Successfully uploaded ${photos.length} photos to ${albumName}`);
    onUploadComplete?.(photos);
  }, [photos, albumName, onUploadComplete]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <Card 
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className={`p-4 rounded-full mb-4 ${
            isDragOver ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Upload className={`h-8 w-8 ${
              isDragOver ? 'text-blue-600' : 'text-gray-400'
            }`} />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isDragOver ? 'Drop your photos here' : 'Upload photos to album'}
          </h3>
          
          <p className="text-gray-600 mb-4">
            Drag and drop your JPEG, PNG, or HEIC files here, or click to browse
          </p>
          
          <input
            type="file"
            multiple
            accept="image/*,.heic"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          
          <label htmlFor="photo-upload">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <span>
                <FileImage className="h-4 w-4 mr-2" />
                Browse Files
              </span>
            </Button>
          </label>
          
          <p className="text-xs text-gray-500 mt-2">
            Supports JPEG, PNG, HEIC formats • Max 50MB per file
          </p>
        </CardContent>
      </Card>

      {/* Photo Preview List */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              Selected Photos ({photos.length})
            </h4>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setPhotos([])}
                disabled={isUploading}
              >
                Clear All
              </Button>
              <Button 
                onClick={uploadPhotos}
                disabled={isUploading || photos.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {photos.map((photo) => (
              <Card key={photo.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={photo.preview}
                        alt={photo.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {photo.file.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePhoto(photo.id)}
                        disabled={isUploading}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2">
                      {formatFileSize(photo.file.size)}
                    </p>
                    
                    {photo.status === 'uploading' && (
                      <div className="space-y-1">
                        <Progress value={photo.progress} className="h-2" />
                        <p className="text-xs text-gray-500">
                          Uploading... {photo.progress}%
                        </p>
                      </div>
                    )}
                    
                    {photo.status === 'completed' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-xs text-green-600">Upload complete</p>
                      </div>
                    )}
                    
                    {photo.status === 'error' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <p className="text-xs text-red-600">Upload failed</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}