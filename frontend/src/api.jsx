// Talks to the FastAPI backend
export async function sendMessage(sessionId, message) {
  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message: message }),
  });

  // read as text first, because the body can be empty
  const raw = await res.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }

  if (!res.ok || !data) {
    const detail = data && data.detail ? JSON.stringify(data.detail) : "empty response";
    throw new Error("Server answered " + res.status + " (" + detail + ")");
  }
  return data;
}
