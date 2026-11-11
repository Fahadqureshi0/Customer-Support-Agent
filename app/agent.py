from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage

from app.config import settings
from app.llm import llm
from app.tools import tools
from app.schemas import SupportReply, ChatResponse

tool_map = {t.name: t for t in tools}
llm_with_tools = llm.bind_tools(tools)               # LLM can now call tools
structured_llm = llm.with_structured_output(SupportReply)  # LLM must return SupportReply

SYSTEM_PROMPT = f"""You are {settings.agent_name}, a friendly customer support agent for {settings.company_name}.

Rules:
1. For product, plan, billing, usage or how-to questions, ALWAYS call search_knowledge_base first and answer only from the results.
2. If the customer asks about their own account or plan, ask for their email, then call check_subscription.
3. If you cannot find the answer, or the customer is angry, or asks for a human: ask for their email if you don't have it, call create_ticket, and set needs_human to true.
4. Never make up policies, prices or limits. Keep answers short and clear.
"""

# Memory: session_id -> list of messages (lives in RAM, resets on restart)
sessions = {}


def chat(session_id: str, user_message: str) -> ChatResponse:
    history = sessions.setdefault(session_id, [])
    history.append(HumanMessage(content=user_message))

    messages = [SystemMessage(content=SYSTEM_PROMPT)] + history[-10:]
    sources = []

    # Agent loop: LLM -> maybe call tools -> LLM again (max 5 rounds)
    for _ in range(5):
        ai = llm_with_tools.invoke(messages)
        messages.append(ai)

        if not ai.tool_calls:
            break

        for call in ai.tool_calls:
            tool = tool_map.get(call["name"])
            result = tool.invoke(call["args"]) if tool else "Unknown tool."
            messages.append(ToolMessage(content=str(result), tool_call_id=call["id"]))

            # collect source links from the search tool
            for line in str(result).splitlines():
                if line.startswith("SOURCE: "):
                    link = line.replace("SOURCE: ", "").strip()
                    if link not in sources:
                        sources.append(link)

    # Final step: force a clean, structured reply
    messages.append(HumanMessage(content="Now write your final reply to the customer in the required format."))
    reply = structured_llm.invoke(messages)

    history.append(AIMessage(content=reply.answer))

    return ChatResponse(
        agent=settings.agent_name,
        answer=reply.answer,
        category=reply.category,
        needs_human=reply.needs_human,
        sources=sources,
    )