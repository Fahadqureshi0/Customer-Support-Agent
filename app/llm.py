# Concept: the LLM (Groq). Low temperature = steady, factual answers.
from langchain_groq import ChatGroq
from app.config import settings

llm = ChatGroq(
    api_key=settings.groq_api_key,
    model=settings.model_name,
    temperature=0.2,
)

# Same model, but it must answer with valid JSON (used for the final reply)
json_llm = ChatGroq(
    api_key=settings.groq_api_key,
    model=settings.model_name,
    temperature=0.2,
    model_kwargs={"response_format": {"type": "json_object"}},
)
