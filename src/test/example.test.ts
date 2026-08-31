import { describe, expect, it } from "vitest";
import { validateArticleUrl } from "@/lib/articleUrl";

describe("validateArticleUrl", () => {
  it("accepts a public HTTPS URL", () => {
    expect(validateArticleUrl("https://www.example.com/news/story")).toBeNull();
  });

  it("rejects malformed, credentialed, and private-network URLs", () => {
    expect(validateArticleUrl("not a url")).toMatch(/complete http or https/i);
    expect(validateArticleUrl("https://name:secret@example.com/article")).toMatch(/credentials/i);
    expect(validateArticleUrl("http://127.0.0.1:3000/article")).toMatch(/private network/i);
  });
});
