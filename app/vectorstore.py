# Concepts: embeddings (text -> numbers) and the vector DB (Chroma)
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from app.config import settings

embeddings = HuggingFaceEmbeddings(model_name=settings.embedding_model)


def get_vectorstore():
    return Chroma(
        collection_name="support_docs",
        embedding_function=embeddings,
        persist_directory=settings.chroma_dir,
    )
