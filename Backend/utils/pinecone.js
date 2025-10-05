// utils/pinecone.js - Now using FREE MemoryVectorStore (no dependencies!)
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';

let vectorStore = null;

// Free local embedding model (no API key needed!)
const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: "Xenova/all-MiniLM-L6-v2", // Free local model, ~25MB download
});

export const initializePinecone = async () => {
  try {
    console.log('🚀 Initializing FREE in-memory vector store...');
    
    // Create new in-memory vector store with initial document
    vectorStore = await MemoryVectorStore.fromTexts(
      ["Welcome to SigmaGPT! This is your AI assistant with memory capabilities."],
      [{ 
        id: "init", 
        timestamp: new Date().toISOString(),
        type: "welcome"
      }],
      embeddings
    );
    
    console.log('🎉 FREE in-memory vector store initialized successfully!');
    return vectorStore;
  } catch (error) {
    console.error('❌ Error initializing vector store:', error);
    console.log('Continuing without vector store...');
    return null;
  }
};

export const addDocumentToVector = async (text, metadata = {}) => {
  try {
    if (!vectorStore) {
      console.log('⚠️ Vector store not initialized, skipping document addition');
      return;
    }

    console.log('📝 Adding document to FREE in-memory vector store...');
    
    // Add document to vector store
    await vectorStore.addDocuments([{
      pageContent: text,
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata
      }
    }]);

    console.log('✅ Document added to FREE in-memory vector store');
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

    console.log(`🔍 Searching FREE in-memory vector store for: "${query}"`);
    
    // Perform similarity search
    const results = await vectorStore.similaritySearch(query, k);
    
    console.log(`📊 Found ${results.length} similar documents in FREE in-memory vector store`);
    
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