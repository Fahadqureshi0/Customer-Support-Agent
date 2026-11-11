# Concept: Pydantic models - define the shape of data going in and out
from typing import List, Literal
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    session_id: str = Field(..., description="Same id = same conversation")
    message: str = Field(..., min_length=1, max_length=2000)


class SupportReply(BaseModel):
    """What the LLM must return (structured output)."""
    answer: str = Field(description="The reply to the customer")
    category: Literal["billing", "account", "usage", "technical", "other"]
    needs_human: bool = Field(description="True if a human agent should take over")


class ChatResponse(SupportReply):
    """What the API returns = the LLM reply + agent name + sources."""
    agent: str
    sources: List[str] = []
