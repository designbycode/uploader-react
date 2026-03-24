import { vi } from "vitest";
import type { UploadFile } from "@designbycode/uploader-core";

export type MockUploader = {
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  once: ReturnType<typeof vi.fn>;
  getFiles: ReturnType<typeof vi.fn>;
  addFiles: ReturnType<typeof vi.fn>;
  uploadAll: ReturnType<typeof vi.fn>;
  uploadFile: ReturnType<typeof vi.fn>;
  removeFile: ReturnType<typeof vi.fn>;
  cancelFile: ReturnType<typeof vi.fn>;
  cancelAll: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
  getFile: ReturnType<typeof vi.fn>;
};

export const createMockUploader = (): MockUploader => ({
  on: vi.fn(),
  off: vi.fn(),
  once: vi.fn(),
  getFiles: vi.fn().mockReturnValue([]),
  addFiles: vi.fn().mockResolvedValue([]),
  uploadAll: vi.fn(),
  uploadFile: vi.fn(),
  removeFile: vi.fn().mockResolvedValue(undefined),
  cancelFile: vi.fn(),
  cancelAll: vi.fn(),
  clear: vi.fn(),
  getFile: vi.fn(),
});

export const createMockUploadFile = (
  overrides: Partial<UploadFile> = {},
): UploadFile => ({
  id: "test-id-1",
  file: new File(["content"], "test.txt", { type: "text/plain" }),
  status: "queued",
  progress: 0,
  ...overrides,
});
