
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    groq_api_key: str
    model_name: str = "openai/gpt-oss-120b"
    agent_name: str = "Edith"
    company_name: str = "Claude (Anthropic)"
    chroma_dir: str = "chroma_db"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"

    class Config:
        env_file = ".env"


settings = Settings()
