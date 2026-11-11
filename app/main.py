from fastapi import FastAPI, HTTPException

from app.config import settings
from app.schemas import ChatRequest, ChatResponse
from app.agent import chat

app = FastAPI(title=f"{settings.agent_name} - AI Customer Support Agent")


@app.get("/health")
def health():
    return {"status": "ok", "agent": settings.agent_name}


@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    try:
        return chat(request.session_id, request.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
