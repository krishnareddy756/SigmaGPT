// utils/pinecone.js - Now using FREE FAISS Vector Store
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import fs from 'fs';
import path from 'path';

let vectorStore = null;
const VECTOR_STORE_PATH = './vector_store';

// Free local embedding model (no API key needed!)
const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: "Xenova/all-MiniLM-L6-v2", // Free local model, ~25MB download
});

export const initializePinecone = async () => {
  try {
    console.log('🚀 Initializing FREE vector store with FAISS...');
    
    // Check if existing vector store exists
    if (fs.existsSync(VECTOR_STORE_PATH)) {
      console.log('📂 Loading existing vector store...');
      try {
        vectorStore = await FaissStore.load(VECTOR_STORE_PATH, embeddings);
        console.log('✅ Existing vector store loaded successfully');
      } catch (error) {
        console.log('⚠️ Could not load existing store, creating new one...');
        await createNewVectorStore();
      }
    } else {
      console.log('🆕 Creating new vector store...');
      await createNewVectorStore();
    }
    
    console.log('🎉 FREE vector store initialized successfully!');
    return vectorStore;
  } catch (error) {
    console.error('❌ Error initializing vector store:', error);
    console.log('Continuing without vector store...');
    return null;
  }
};

const createNewVectorStore = async () => {
  // Create new vector store with initial document
  vectorStore = await FaissStore.fromTexts(
    ["Welcome to SigmaGPT! This is your AI assistant with memory capabilities."],
    [{ 
      id: "init", 
      timestamp: new Date().toISOString(),
      type: "welcome"
    }],
    embeddings
  );
  
  // Save to disk
  await vectorStore.save(VECTOR_STORE_PATH);
  console.log('💾 New vector store created and saved');
};

export const addDocumentToVector = async (text, metadata = {}) => {
  try {
    if (!vectorStore) {
      console.log('⚠️ Vector store not initialized, skipping document addition');
      return;
    }

    console.log('📝 Adding document to FREE vector store...');
    
    // Add document to vector store
    await vectorStore.addDocuments([{
      pageContent: text,
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata
      }
    }]);

    // Save to disk (persist changes)
    await vectorStore.save(VECTOR_STORE_PATH);
    console.log('✅ Document added and saved to FREE vector store');
  } catch (error) {
    console.error('❌ Error adding document to vector store:', error);
  }
};

export const searchSimilarDocuments = async (query, k = 3) => {
  try {
    if (!vectorStore) {
      console.log('⚠️ Vector store not initialized, returning empty results');
      return [];
    }

    console.log(`🔍 Searching FREE vector store for: "${query}"`);
    
    // Perform similarity search
    const results = await vectorStore.similaritySearch(query, k);
    
    console.log(`📊 Found ${results.length} similar documents in FREE vector store`);
    
    // Log results for debugging
    results.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.pageContent.substring(0, 100)}...`);
      console.log(`   Metadata:`, doc.metadata);
    });
    
    return results;
  } catch (error) {
    console.error('❌ Error searching vector store:', error);
    return [];
  }
};

export { vectorStore };