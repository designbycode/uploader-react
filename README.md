# @designbycode/uploader-react

React hooks for file uploads, built on top of [@designbycode/uploader-core](https://github.com/designbycode/uploader-core).

[![npm version](https://img.shields.io/npm/v/@designbycode/uploader-react)](https://npm.npmjs.com/package/@designbycode/uploader-react)
[![license](https://img.shields.io/npm/l/@designbycode/uploader-react)](LICENSE)

## Features

- **useUploader** — Manages upload queue with React state
- **useDropzone** — Drag & drop zone with file filtering
- **useFileItem** — Extracts file item properties with preview support
- **useFilePreview** — Standalone hook for image previews
- **Framework-agnostic** — Built on the core uploader library
- **TypeScript** — Full TypeScript support

## Installation

```bash
# Using bun
bun add @designbycode/uploader-react @designbycode/uploader-core

# Using npm
npm install @designbycode/uploader-react @designbycode/uploader-core

# Using pnpm
pnpm add @designbycode/uploader-react @designbycode/uploader-core
```

## Quick Start

```tsx
"use client";

import {
  useUploader,
  useDropzone,
  useFileItem,
} from "@designbycode/uploader-react";

export function FileUploader() {
  const {
    files,
    addFiles,
    uploadAll,
    removeFile,
    cancelFile,
    totalProgress,
    queuedCount,
    uploadingCount,
    successCount,
    errorCount,
  } = useUploader({
    autoUpload: true,
    maxConcurrent: 2,
    validation: {
      maxSize: 10 * 1024 * 1024,
      acceptedMimeTypes: ["image/png", "image/jpeg"],
    },
    process: async (file, { signal, onProgress }) => {
      const formData = new FormData();
      formData.append("file", file);

      // Upload logic here
      return { serverId: "uploaded-file-id" };
    },
  });

  const { isDragging, getRootProps, getInputProps } = useDropzone({
    onDrop: addFiles,
    acceptedMimeTypes: ["image/png", "image/jpeg"],
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragging ? "Drop files here" : "Click or drag to upload"}
    </div>
  );
}
```

## useUploader

Main hook for managing uploads.

```tsx
const {
  files, // UploadFile[]
  addFiles, // (files: File[]) => Promise<UploadFile[]>
  uploadAll, // () => void
  uploadFile, // (id: string) => void
  removeFile, // (id: string) => Promise<void>
  cancelFile, // (id: string) => void
  cancelAll, // () => void
  clear, // () => void
  getFile, // (id: string) => UploadFile | undefined
  getFileByServerId, // (serverId: string) => UploadFile | undefined
  totalProgress, // number (0-100)
  queuedCount, // number
  uploadingCount, // number
  successCount, // number
  errorCount, // number
} = useUploader(options);
```

### Options

Inherits all options from [uploader-core](https://github.com/designbycode/uploader-core#options).

## useDropzone

Hook for drag & drop file selection.

```tsx
const {
  isDragging,      // boolean
  getRootProps,    // () => div props
  getInputProps,   // () => input props
} = useDropzone({
  onDrop: (files) => void,
  acceptedMimeTypes?: string[],
  maxSize?: number,
  multiple?: boolean,
})
```

### Usage

```tsx
function DropZone({ onFilesSelected }) {
  const { isDragging, getRootProps, getInputProps } = useDropzone({
    onDrop: onFilesSelected,
    acceptedMimeTypes: ["image/*"],
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div {...getRootProps()} className={isDragging ? "dragging" : ""}>
      <input {...getInputProps()} />
      <p>{isDragging ? "Drop here!" : "Click or drag files"}</p>
    </div>
  );
}
```

## useFileItem

Helper hook to extract file item properties with automatic preview generation for images.

```tsx
const {
  id,
  name,
  size,
  type,
  progress,
  status,
  error,
  serverId,
  preview, // string | undefined (blob URL for images)
  isImage, // boolean
  cancel,
  remove,
} = useFileItem({ file, removeFile, cancelFile, generatePreview: true });
```

### Example

```tsx
function FileItem({ file, onRemove, onCancel }) {
  const { name, progress, status, cancel, remove } = useFileItem({
    file,
    removeFile: onRemove,
    cancelFile: onCancel,
  });

  return (
    <div>
      <span>{name}</span>
      {status === "uploading" && (
        <div>
          <progress value={progress} max={100} />
          <button onClick={cancel}>Cancel</button>
        </div>
      )}
      <button onClick={remove}>Remove</button>
    </div>
  );
}
```

## useFilePreview

Standalone hook for generating image previews.

```tsx
const {
  preview, // string | null
  generatePreview, // () => void
  revokePreview, // () => void
  isGenerating, // boolean
  isImage, // boolean
} = useFilePreview(file, { autoPreview: true });
```

### Example

```tsx
function ImagePreview({ file }) {
  const { preview, isImage } = useFilePreview(file, { autoPreview: true });

  if (!isImage) return null;

  return preview ? <img src={preview} alt={file.name} /> : null;
}
```

## Complete Example

```tsx
"use client";

import {
  useUploader,
  useDropzone,
  useFileItem,
} from "@designbycode/uploader-react";

function FileList({ files, onRemove, onCancel }) {
  return (
    <ul>
      {files.map((file) => (
        <li key={file.id}>
          <FileItem file={file} onRemove={onRemove} onCancel={onCancel} />
        </li>
      ))}
    </ul>
  );
}

function FileItem({ file, onRemove, onCancel }) {
  const { name, progress, status, cancel, remove } = useFileItem({
    file,
    removeFile: onRemove,
    cancelFile: onCancel,
  });

  return (
    <div>
      <span>{name}</span>
      {status === "uploading" && (
        <div>
          <span>{progress}%</span>
          <button onClick={cancel}>Cancel</button>
        </div>
      )}
      {status === "success" && <span>Done</span>}
      {status === "error" && <span>Failed</span>}
      <button onClick={remove}>Remove</button>
    </div>
  );
}

export default function Uploader() {
  const uploader = useUploader({
    maxConcurrent: 2,
    process: async (file, { onProgress }) => {
      // Upload logic
      return { serverId: "id" };
    },
  });

  const dropzone = useDropzone({
    onDrop: uploader.addFiles,
  });

  return (
    <div>
      <div {...dropzone.getRootProps()}>
        <input {...dropzone.getInputProps()} />
        <p>{dropzone.isDragging ? "Drop!" : "Click or drag"}</p>
      </div>

      <div>
        <span>Queued: {uploader.queuedCount}</span>
        <span>Uploading: {uploader.uploadingCount}</span>
        <span>Done: {uploader.successCount}</span>
        <span>Failed: {uploader.errorCount}</span>
      </div>

      {uploader.queuedCount > 0 && (
        <button onClick={uploader.uploadAll}>Upload All</button>
      )}

      <FileList
        files={uploader.files}
        onRemove={uploader.removeFile}
        onCancel={uploader.cancelFile}
      />
    </div>
  );
}
```

## License

MIT
