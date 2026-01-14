"use client";

import { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, X, AlertCircle } from 'lucide-react';

export default function FileUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const maxFiles = 6;
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

  const handleFiles = (newFiles: FileList) => {
    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter(f => f.size <= maxSize);

    if (validFiles.length + files.length > maxFiles) {
      setError(`Максимум ${maxFiles} файлов`);
      return;
    }

    if (validFiles.some(f => f.size > maxSize)) {
      setError(`Файл превышает ${maxSizeMB} МБ`);
      return;
    }

    setError(null);
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => inputRef.current?.click();

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => setFiles([]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className='flex flex-col gap-3 w-full'>
      {/* Зона перетаскивания */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick}
        className='relative flex flex-col items-center justify-center min-h-[220px] rounded-xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition cursor-pointer'
      >
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className='hidden'
        />

        <div className='flex flex-col items-center text-center p-4'>
          <div className='mb-2 flex items-center justify-center w-11 h-11 rounded-full border border-border bg-background'>
            <ImageIcon className='w-5 h-5 text-muted-foreground' />
          </div>
          <p className='text-sm font-medium text-foreground'>Перетащите изображения сюда</p>
          <p className='text-xs text-muted-foreground'>SVG, PNG, JPG или GIF (макс. {maxSizeMB} МБ)</p>
          <button
            type='button'
            className='mt-4 inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition'
          >
            <Upload className='w-4 h-4 opacity-60' /> Выбрать изображения
          </button>
        </div>
      </div>

      {error && (
        <div className='flex items-center gap-2 text-sm text-destructive mt-1'>
          <AlertCircle className='w-4 h-4' />
          {error}
        </div>
      )}

      {/* Список файлов */}
      {files.length > 0 && (
        <div className='space-y-2'>
          {files.map((file, i) => (
            <div
              key={i}
              className='flex items-center justify-between rounded-lg border border-border bg-card p-2 pr-3 shadow-sm hover:shadow transition'
            >
              <div className='flex items-center gap-3 overflow-hidden'>
                <div className='w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className='object-cover w-full h-full'
                  />
                </div>
                <div className='min-w-0'>
                  <p className='text-sm font-medium truncate text-foreground'>{file.name}</p>
                  <p className='text-xs text-muted-foreground'>{formatBytes(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(i)}
                className='text-muted-foreground hover:text-destructive transition'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          ))}

          {files.length > 1 && (
            <button
              onClick={clearFiles}
              className='text-sm text-muted-foreground underline hover:text-foreground transition mt-1'
            >
              Удалить все файлы
            </button>
          )}
        </div>
      )}
    </div>
  );
}
