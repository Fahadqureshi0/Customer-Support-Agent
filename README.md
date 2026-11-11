# Edith - AI Customer Support Agent

Answers customer questions from real help-center articles (RAG), remembers the chat,
uses tools (subscription lookup, ticket creation), returns structured replies,
and escalates to a human. Unofficial learning project, not affiliated with Anthropic.

Stack: Python, LangChain, Pydantic, FastAPI, Groq, ChromaDB.

## Run it

```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # then paste your GROQ_API_KEY

python -m app.ingest              # 1. load articles into the vector DB (run once)
python chat_cli.py                # 2. chat in the terminal
uvicorn app.main:app --reload     # 3. or start the API -> http://127.0.0.1:8000/docs
```

If the model name fails, pick a current one from Groq's model list and set MODEL_NAME in .env.

## Try these

- "What is the Pro plan and what are the usage limits?"
- "What is the difference between usage limits and length limits?"
- "What's my plan? my email is mona@example.com"  (tool: check_subscription)
- "I want to talk to a human, my email is ali@example.com"  (tool: create_ticket)

## API

POST /chat
{ "session_id": "user-1", "message": "How do I sign up for Pro?" }

## Docker

```bash
python -m app.ingest
docker build -t aria .
docker run --env-file .env -p 8000:8000 -v "$(pwd)/chroma_db:/code/chroma_db" aria
```

## Concept map

| File | Concept |
|---|---|
| app/config.py | Pydantic settings |
| app/schemas.py | Pydantic models, structured output |
| app/llm.py | Groq LLM, temperature |
| app/ingest.py | Loaders, chunking |
| app/vectorstore.py | Embeddings, Chroma |
| app/tools.py | Tools |
| app/agent.py | Agent loop, memory, escalation |
| app/main.py | FastAPI |

## Limits (be honest in interviews)

- Memory is in RAM (use Redis/DB in production).
- check_subscription trusts the email. Real systems need login/auth.
- Customer data is fake. Help articles are public.
