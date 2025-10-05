// Check Vector Database Status
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import fs from 'fs';
import path from 'path';

const VECTOR_STORE_PATH = './vector_store';

const checkVectorDatabase = async () => {
  console.log('🔍 Checking Vector Database Status...');
  
  // Check if vector store directory exists
  if (fs.existsSync(VECTOR_STORE_PATH)) {
    console.log('✅ Vector store directory exists');
    
    // List files in vector store
    const files = fs.readdirSync(VECTOR_STORE_PATH);
    console.log('📁 Vector store files:', files);
    
    // Check file sizes
    files.forEach(file => {
      const filePath = path.join(VECTOR_STORE_PATH, file);
      const stats = fs.statSync(filePath);
      console.log(`   ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
    });
    
    try {
      // Try to load the vector store
      const embeddings = new HuggingFaceTransformersEmbeddings({
        modelName: "Xenova/all-MiniLM-L6-v2",
      });
      
      const vectorStore = await FaissStore.load(VECTOR_STORE_PATH, embeddings);
      console.log('✅ Vector store loaded successfully');
      
      // Get number of documents (if possible)
      console.log('📊 Vector store is operational');
      
    } catch (error) {
      console.log('❌ Error loading vector store:', error.message);
    }
  } else {
    console.log('❌ Vector store directory not found');
  }
};

checkVectorDatabase().catch(console.error);