import { describe, it, expect } from "vitest";
import { useFileItem } from "../src/useFileItem";

describe("useFileItem", () => {
  it("should export the useFileItem hook", () => {
    expect(useFileItem).toBeDefined();
    expect(typeof useFileItem).toBe("function");
  });

  it("should be a valid React hook signature", () => {
    expect(useFileItem.length).toBe(1);
  });
});
