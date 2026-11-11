export function newSessionId() {
  return "web-" + Math.random().toString(36).slice(2, 10);
}

// turns a help-article URL into a readable title
export function sourceLabel(url) {
  const last = decodeURIComponent(url.split("?")[0].split("/").pop() || "");
  const words = last.replace(/\.md$/, "").replace(/^\d+-?/, "").replace(/-/g, " ").trim();
  if (words) return words.charAt(0).toUpperCase() + words.slice(1);
  return "Help article " + last;
}