import { useEffect, useRef, useState, useCallback } from "react";
import { Uploader } from "@designbycode/uploader-core";
import type { UploadFile, UploaderOptions } from "@designbycode/uploader-core";

export function useUploader(options: UploaderOptions = {}) {
  const uploaderRef = useRef<Uploader | null>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);

  if (!uploaderRef.current) {
    uploaderRef.current = new Uploader(options);
  }

  useEffect(() => {
    const uploader = uploaderRef.current!;

    const onAdd = (file: UploadFile) => {
      setFiles((prev) => [...prev, file]);
    };

    const onProgress = (file: UploadFile) => {
      setFiles((prev) => prev.map((f) => (f.id === file.id ? file : f)));
    };

    const onSuccess = (file: UploadFile) => {
      setFiles((prev) => prev.map((f) => (f.id === file.id ? file : f)));
    };

    const onError = (file: UploadFile) => {
      setFiles((prev) => prev.map((f) => (f.id === file.id ? file : f)));
    };

    const onRemove = (file: UploadFile) => {
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    };

    const onRetry = ({ file }: { file: UploadFile; attempt: number }) => {
      setFiles((prev) => prev.map((f) => (f.id === file.id ? file : f)));
    };

    uploader.on("add", onAdd);
    uploader.on("progress", onProgress);
    uploader.on("success", onSuccess);
    uploader.on("error", onError);
    uploader.on("remove", onRemove);
    uploader.on("retry", onRetry);

    return () => {
      uploader.off("add", onAdd);
      uploader.off("progress", onProgress);
      uploader.off("success", onSuccess);
      uploader.off("error", onError);
      uploader.off("remove", onRemove);
      uploader.off("retry", onRetry);
    };
  }, []);

  const addFiles = useCallback(async (fileList: File[]) => {
    return uploaderRef.current?.addFiles(fileList) ?? [];
  }, []);

  const uploadAll = useCallback(() => {
    uploaderRef.current?.uploadAll();
  }, []);

  const uploadFile = useCallback((id: string) => {
    uploaderRef.current?.uploadFile(id);
  }, []);

  const removeFile = useCallback(async (id: string) => {
    await uploaderRef.current?.removeFile(id);
  }, []);

  const cancelFile = useCallback((id: string) => {
    uploaderRef.current?.cancelFile(id);
  }, []);

  const cancelAll = useCallback(() => {
    uploaderRef.current?.cancelAll();
  }, []);

  const clear = useCallback(() => {
    uploaderRef.current?.clear();
    setFiles([]);
  }, []);

  const getFile = useCallback((id: string) => {
    return uploaderRef.current?.getFile(id);
  }, []);

  const getFileByServerId = useCallback((serverId: string) => {
    return uploaderRef.current?.getFileByServerId(serverId);
  }, []);

  const totalProgress =
    files.length === 0
      ? 0
      : Math.round(
          files.reduce((acc, f) => acc + f.progress, 0) / files.length,
        );

  const queuedCount = files.filter((f) => f.status === "queued").length;
  const uploadingCount = files.filter((f) => f.status === "uploading").length;
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return {
    files,
    addFiles,
    uploadAll,
    uploadFile,
    removeFile,
    cancelFile,
    cancelAll,
    clear,
    getFile,
    getFileByServerId,
    totalProgress,
    queuedCount,
    uploadingCount,
    successCount,
    errorCount,
  };
}
