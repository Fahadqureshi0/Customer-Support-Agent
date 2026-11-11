# Quick test in the terminal:  python chat_cli.py
import uuid
from app.agent import chat

session_id = str(uuid.uuid4())
print("Type 'quit' to exit\n")

while True:
    message = input("You: ")
    if message.lower() == "quit":
        break
    r = chat(session_id, message)
    print(f"\n{r.agent}: {r.answer}")
    print(f"  [category: {r.category} | needs_human: {r.needs_human} | sources: {r.sources}]\n")
