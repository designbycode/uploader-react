import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDropzone } from "../src/useDropzone";

describe("useDropzone", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export the useDropzone hook", () => {
    expect(useDropzone).toBeDefined();
    expect(typeof useDropzone).toBe("function");
  });

  it("should be a valid React hook signature", () => {
    expect(useDropzone.length).toBe(1);
  });
});
