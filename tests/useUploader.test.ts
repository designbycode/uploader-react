import { describe, it, expect, vi, beforeEach } from "vitest";

describe("useUploader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export useUploader from the module", async () => {
    const module = await import("../src/index");
    expect(module.useUploader).toBeDefined();
    expect(typeof module.useUploader).toBe("function");
  });

  it("should export useDropzone from the module", async () => {
    const module = await import("../src/index");
    expect(module.useDropzone).toBeDefined();
    expect(typeof module.useDropzone).toBe("function");
  });

  it("should export useFileItem from the module", async () => {
    const module = await import("../src/index");
    expect(module.useFileItem).toBeDefined();
    expect(typeof module.useFileItem).toBe("function");
  });
});
