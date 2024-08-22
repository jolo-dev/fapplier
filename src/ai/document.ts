import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { GoogleVertexAIEmbeddings } from '@langchain/community/embeddings/googlevertexai';
import type { Document } from '@langchain/core/documents';
import type { VectorStoreRetriever } from '@langchain/core/vectorstores';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

export async function readPdf(filePath: string): Promise<Document[]> {
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();
  return docs;
}

export async function splitAndEmbed(
  docs: Document[],
): Promise<VectorStoreRetriever<MemoryVectorStore>> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splits = await textSplitter.splitDocuments(docs);
  const vectorStore = await MemoryVectorStore.fromDocuments(splits, new GoogleVertexAIEmbeddings());
  return vectorStore.asRetriever();
}
