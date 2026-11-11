import json
import uuid
from pathlib import Path

from langchain_core.tools import tool
from app.vectorstore import get_vectorstore

store = get_vectorstore()
DATA = Path("data")


@tool
def search_knowledge_base(question: str) -> str:
    """Search the help center articles. Use for any product, plan, billing, usage or how-to question."""
    docs = store.similarity_search(question, k=4)
    if not docs:
        return "No articles found."
    parts = []
    for d in docs:
        source = d.metadata.get("source", "unknown")
        parts.append(f"SOURCE: {source}\n{d.page_content}")
    return "\n\n---\n\n".join(parts)


@tool
def check_subscription(email: str) -> str:
    """Look up a customer's plan and billing status using their email."""
    customers = json.loads((DATA / "customers.json").read_text())
    for c in customers:
        if c["email"].lower() == email.lower():
            return json.dumps(c)
    return "No customer found with that email."


@tool
def create_ticket(email: str, issue: str) -> str:
    """Create a ticket so a human support agent can follow up."""
    path = DATA / "tickets.json"
    tickets = json.loads(path.read_text()) if path.exists() else []
    ticket_id = "TCK-" + uuid.uuid4().hex[:6].upper()
    tickets.append({"id": ticket_id, "email": email, "issue": issue})
    path.write_text(json.dumps(tickets, indent=2))
    return f"Ticket {ticket_id} created. A human agent will contact the customer."


tools = [search_knowledge_base, check_subscription, create_ticket]
