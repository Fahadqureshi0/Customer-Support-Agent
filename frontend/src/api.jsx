// Talks to the FastAPI backend
export async function sendMessage(sessionId, message) {
  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message: message }),
  });

  const raw = await res.text();
  let data = null;
  try {
    data = JSON.parse(raw);
  } catch {
    data = null;
  }

  if (!res.ok || !data) {
    const type = res.headers.get("content-type") || "no content-type";
    const start = raw.slice(0, 120).replace(/\s+/g, " ");
    throw new Error("Status " + res.status + ", " + type + ", body starts: " + (start || "(empty)"));
  }
  return data;
}
