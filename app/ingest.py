# Run once:  python -m app.ingest
import os
import re
from pathlib import Path

from langchain_community.document_loaders import WebBaseLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.vectorstore import get_vectorstore

os.environ.setdefault("USER_AGENT", "customer-support-agent")


def load_documents():
    docs = []

    # 1) web pages listed in data/urls.txt
    urls_file = Path("data/urls.txt")
    if urls_file.exists():
        lines = urls_file.read_text().splitlines()
        urls = [x.strip() for x in lines if x.strip() and not x.startswith("#")]
        if urls:
            docs += WebBaseLoader(urls).load()

    # 2) your own .md files in data/articles/
    for file in Path("data/articles").glob("*.md"):
        docs += TextLoader(str(file), encoding="utf-8").load()

    return docs


def main():
    docs = load_documents()
    if not docs:
        print("No documents found. Add URLs to data/urls.txt")
        return

    # clean extra blank lines
    for d in docs:
        d.page_content = re.sub(r"\n{3,}", "\n\n", d.page_content).strip()

    # split into small chunks (small pieces search better)
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks = splitter.split_documents(docs)

    store = get_vectorstore()
    store.reset_collection()          # start fresh, no duplicates
    store.add_documents(chunks)
    print(f"Done: {len(docs)} documents -> {len(chunks)} chunks stored")


if __name__ == "__main__":
    main()
