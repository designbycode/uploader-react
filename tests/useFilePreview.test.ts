import { describe, it, expect } from "vitest";
import { useFilePreview } from "../src/useFilePreview";

describe("useFilePreview", () => {
  it("should export the useFilePreview hook", () => {
    expect(useFilePreview).toBeDefined();
    expect(typeof useFilePreview).toBe("function");
  });

  it("should be a valid React hook signature", () => {
    expect(useFilePreview.length).toBe(1);
  });
});
