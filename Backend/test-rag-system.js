// Test RAG (Retrieval-Augmented Generation) System
import { searchSimilarDocuments, addDocumentToVector, initializePinecone } from './utils/pinecone.js';
import 'dotenv/config';

const testRAG = async () => {
  console.log('🧪 Testing RAG System...\n');
  
  // Initialize the vector store first
  console.log('0. Initializing vector store...');
  await initializePinecone();
  
  // Test 1: Add a test document
  console.log('\n1. Adding test document to vector store...');
  await addDocumentToVector(
    "SigmaGPT is an AI assistant built with React and Node.js. It uses OpenAI's GPT models and includes features like conversation memory, web search, and mathematical calculations.",
    { 
      type: 'documentation', 
      topic: 'SigmaGPT features',
      timestamp: new Date().toISOString()
    }
  );
  
  // Test 2: Search for similar documents
  console.log('\n2. Testing similarity search...');
  const queries = [
    'What is SigmaGPT?',
    'AI assistant features',
    'React Node.js application',
    'current vice president India',
    'mathematical calculations'
  ];
  
  for (const query of queries) {
    console.log(`\n🔍 Query: "${query}"`);
    const results = await searchSimilarDocuments(query, 3);
    
    if (results.length > 0) {
      console.log(`✅ Found ${results.length} similar documents:`);
      results.forEach((doc, i) => {
        console.log(`   ${i + 1}. ${doc.pageContent.substring(0, 100)}...`);
        console.log(`      Metadata:`, doc.metadata);
      });
    } else {
      console.log('❌ No similar documents found');
    }
  }
  
  // Test 3: Check conversation history
  console.log('\n3. Checking conversation history in vector store...');
  const historyResults = await searchSimilarDocuments('vice president conversation', 5);
  console.log(`📚 Found ${historyResults.length} conversation entries`);
  
  console.log('\n🎉 RAG System Test Complete!');
};

testRAG().catch(console.error);