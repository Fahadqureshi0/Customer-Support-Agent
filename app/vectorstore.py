# Concepts: embeddings (text -> numbers) and the vector DB (Chroma)
# Lightweight version: ONNX model, no PyTorch, so it fits in small servers
from langchain_chroma import Chroma
from langchain_core.embeddings import Embeddings
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction

from app.config import settings


class LightEmbeddings(Embeddings):
    """Wraps Chroma's built-in all-MiniLM-L6-v2 (ONNX) so LangChain can use it."""

    def __init__(self):
        self.model = DefaultEmbeddingFunction()

    def embed_documents(self, texts):
        return [[float(x) for x in vector] for vector in self.model(texts)]

    def embed_query(self, text):
        return self.embed_documents([text])[0]


embeddings = LightEmbeddings()


def get_vectorstore():
    return Chroma(
        collection_name="support_docs",
        embedding_function=embeddings,
        persist_directory=settings.chroma_dir,
    )
