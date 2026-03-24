import { useEffect, useState } from "react";
import type { UploadFile } from "@designbycode/uploader-core";

type FileItemReturn = {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: UploadFile["status"];
  error?: string;
  serverId?: string;
  preview?: string;
  isImage: boolean;
  cancel: () => void;
  remove: () => Promise<void>;
};

type UseFileItemParams = {
  file: UploadFile;
  removeFile: (id: string) => Promise<void>;
  cancelFile: (id: string) => void;
  generatePreview?: boolean;
};

const isBrowser = typeof window !== "undefined";

export function useFileItem({
  file,
  removeFile,
  cancelFile,
  generatePreview = true,
}: UseFileItemParams): FileItemReturn {
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const isImage = file.file.type.startsWith("image/");

  useEffect(() => {
    if (!generatePreview || !isBrowser || !isImage) {
      setPreview(undefined);
      return;
    }

    const url = URL.createObjectURL(file.file);
    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file.file, generatePreview, isImage]);

  return {
    id: file.id,
    name: file.file.name,
    size: file.file.size,
    type: file.file.type,
    progress: file.progress,
    status: file.status,
    error: file.error,
    serverId: file.serverId,
    preview,
    isImage,
    cancel: () => cancelFile(file.id),
    remove: () => removeFile(file.id),
  };
}
