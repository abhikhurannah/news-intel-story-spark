const PRIVATE_HOSTS = new Set(["localhost", "0.0.0.0", "::1"]);

export function validateArticleUrl(value: string): string | null {
  if (value.length > 2_048) return "URLs must be 2,048 characters or fewer.";

  let url: URL;
  try { url = new URL(value.trim()); } catch { return "Enter a complete http or https article URL."; }

  if (!["http:", "https:"].includes(url.protocol)) return "Only http and https URLs are supported.";
  if (url.username || url.password) return "URLs containing credentials are not supported.";
  const host = url.hostname.toLowerCase();
  if (PRIVATE_HOSTS.has(host) || host.endsWith(".local") || /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)) {
    return "Local and private network URLs are not supported.";
  }
  return null;
}
