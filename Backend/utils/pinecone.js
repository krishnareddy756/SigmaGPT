// utils/pinecone.js
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/community/vectorstores/pinecone';

let pineconeClient = null;
let vectorStore = null;

export const initializePinecone = async () => {
  try {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const index = pineconeClient.Index(process.env.PINECONE_INDEX_NAME);

    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small",
    });

    vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
    });

    console.log('Pinecone initialized successfully');
    return vectorStore;
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
    throw error;
  }
};

export const addDocumentToVector = async (text, metadata = {}) => {
  // Temporarily disabled due to OpenAI quota limit
  console.log('Vector store temporarily disabled - quota exceeded');
  return;
  
  if (!vectorStore) {
    await initializePinecone();
  }

  try {
    await vectorStore.addDocuments([{
      pageContent: text,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    }]);
    console.log('Document added to vector store');
  } catch (error) {
    console.error('Error adding document to vector store:', error);
  }
};

export const searchSimilarDocuments = async (query, k = 3) => {
  // Temporarily disabled due to OpenAI quota limit
  console.log('Vector search temporarily disabled - quota exceeded');
  return [];
  
  if (!vectorStore) {
    await initializePinecone();
  }

  try {
    const results = await vectorStore.similaritySearch(query, k);
    return results;
  } catch (error) {
    console.error('Error searching vector store:', error);
    return [];
  }
};

export { vectorStore };