import { useState, useCallback, useEffect } from "react";

type UseFilePreviewOptions = {
  autoPreview?: boolean;
};

type UseFilePreviewReturn = {
  preview: string | null;
  generatePreview: () => void;
  revokePreview: () => void;
  isGenerating: boolean;
  isImage: boolean;
};

const isBrowser = typeof window !== "undefined";

export function useFilePreview(
  file: File,
  options: UseFilePreviewOptions = {},
): UseFilePreviewReturn {
  const { autoPreview = false } = options;

  const [preview, setPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const isImage = file.type.startsWith("image/");

  const generatePreview = useCallback(() => {
    if (!isBrowser || !isImage || preview) return;

    setIsGenerating(true);
    const url = URL.createObjectURL(file);
    setPreview(url);
    setIsGenerating(false);
  }, [file, isImage, preview]);

  const revokePreview = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }, [preview]);

  useEffect(() => {
    if (autoPreview && isImage) {
      generatePreview();
    }

    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, []);

  return {
    preview,
    generatePreview,
    revokePreview,
    isGenerating,
    isImage,
  };
}
