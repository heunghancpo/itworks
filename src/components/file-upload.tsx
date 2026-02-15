'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, File, X, Check } from 'lucide-react';
import { uploadFileWithProgress, validateFileSize, validateFileType } from '@/lib/storage-helpers';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onUploadComplete: (url: string, metadata: { name: string; size: number; type: string }) => void;
  path: string; // Storage 경로 (예: `ideas/${ideaId}/attachments`)
  accept?: string; // 파일 타입 제한 (예: "image/*")
  maxSize?: number; // 최대 파일 크기 (bytes)
  label?: string;
}

export function FileUpload({
  onUploadComplete,
  path,
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB
  label = "파일 업로드"
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 검증
    if (file.size > maxSize) {
      toast.error(`파일 크기는 ${maxSize / 1024 / 1024}MB 이하여야 합니다`);
      return;
    }

    setSelectedFile(file);
    setUploadComplete(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);

    try {
      const fileName = `${Date.now()}_${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const fullPath = `${path}/${fileName}`;

      const url = await uploadFileWithProgress(
        fullPath,
        selectedFile,
        (p) => setProgress(p)
      );

      // 업로드 완료
      setUploadComplete(true);
      toast.success('파일 업로드 완료!');

      // 콜백 호출
      onUploadComplete(url, {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });

      // 초기화
      setTimeout(() => {
        setSelectedFile(null);
        setProgress(0);
        setUploadComplete(false);
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('파일 업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setProgress(0);
    setUploadComplete(false);
  };

  return (
    <div className="space-y-3">
      {!selectedFile ? (
        <div>
          <label className="block text-sm font-medium mb-2">{label}</label>
          <div className="relative">
            <Input
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            최대 파일 크기: {maxSize / 1024 / 1024}MB
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {!uploading && !uploadComplete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {uploadComplete && (
              <Check className="h-5 w-5 text-green-600" />
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground text-center">
                {progress.toFixed(0)}% 업로드 중...
              </p>
            </div>
          )}

          {!uploading && !uploadComplete && (
            <Button
              onClick={handleUpload}
              className="w-full"
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              업로드
            </Button>
          )}

          {uploadComplete && (
            <p className="text-sm text-green-600 text-center">
              ✓ 업로드 완료!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// 사용 예시
// ============================================

/**
 * 아이디어 상세 다이얼로그에서 사용:
 * 
 * <FileUpload
 *   path={`ideas/${ideaId}/attachments`}
 *   accept="image/*,application/pdf"
 *   maxSize={5 * 1024 * 1024} // 5MB
 *   onUploadComplete={(url, metadata) => {
 *     // Firestore에 리소스 추가
 *     addResource(ideaId, {
 *       type: 'file',
 *       title: metadata.name,
 *       url: url,
 *       metadata: {
 *         size: metadata.size,
 *         fileType: metadata.type,
 *       },
 *       uploadedBy: user.uid,
 *       uploadedByName: user.displayName,
 *     });
 *   }}
 * />
 */