/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";

type Options = {
  onDrop: (files: File[]) => void;
  acceptedMimeTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
};

export function useDropzone({
  onDrop,
  acceptedMimeTypes,
  maxSize,
  multiple = true,
}: Options) {
  const [isDragging, setIsDragging] = useState(false);

  const filterFiles = useCallback(
    (files: File[]): File[] => {
      let valid = [...files];

      if (acceptedMimeTypes?.length) {
        valid = valid.filter((file) => acceptedMimeTypes.includes(file.type));
      }

      if (maxSize !== undefined) {
        valid = valid.filter((file) => file.size <= maxSize);
      }

      if (!multiple) {
        valid = valid.slice(0, 1);
      }

      return valid;
    },
    [acceptedMimeTypes, maxSize, multiple],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const dataTransfer = e.dataTransfer as any;
      if (dataTransfer?.files?.length > 0) {
        const droppedFiles: File[] = Array.from(dataTransfer.files);
        const validFiles = filterFiles(droppedFiles);
        if (validFiles.length > 0) {
          onDrop(validFiles);
        }
      }
    },
    [onDrop, filterFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target as any;
      if (input?.files?.length > 0) {
        const selectedFiles: File[] = Array.from(input.files);
        const validFiles = filterFiles(selectedFiles);
        if (validFiles.length > 0) {
          onDrop(validFiles);
        }
        input.value = "";
      }
    },
    [onDrop, filterFiles],
  );

  const getRootProps = () => ({
    onDrop: handleDrop,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
  });

  const getInputProps = () => ({
    type: "file" as const,
    multiple,
    accept: acceptedMimeTypes?.join(","),
    onChange: handleInputChange,
  });

  return {
    isDragging,
    getRootProps,
    getInputProps,
  };
}
