// Test FREE FAISS RAG implementation
import { searchSimilarDocuments, addDocumentToVector, initializePinecone } from './utils/pinecone.js';

console.log('=== FREE FAISS RAG Implementation Test ===\n');

const testFreeRAG = async () => {
  try {
    console.log('� Step 1: Initializing FREE vector store...');
    await initializePinecone();
    
    console.log('\n📝 Step 2: Adding test documents...');
    
    // Add various test documents
    await addDocumentToVector(
      'User: What is artificial intelligence?\nAssistant: AI is a field of computer science focused on creating intelligent machines that can think and learn like humans.',
      { topic: 'AI', category: 'definition' }
    );
    
    await addDocumentToVector(
      'User: How does machine learning work?\nAssistant: Machine learning uses algorithms to analyze data, identify patterns, and make predictions without being explicitly programmed.',
      { topic: 'ML', category: 'explanation' }
    );
    
    await addDocumentToVector(
      'User: What programming languages are good for AI?\nAssistant: Python is the most popular for AI development, followed by R, Java, and JavaScript for different AI applications.',
      { topic: 'Programming', category: 'tools' }
    );
    
    await addDocumentToVector(
      'User: Can you help me with math?\nAssistant: Yes! I can help you with calculations, equations, and mathematical problems. Just ask me anything math-related.',
      { topic: 'Math', category: 'capability' }
    );
    
    console.log('\n🔍 Step 3: Testing similarity search...');
    
    // Test various queries
    const testQueries = [
      "Tell me about artificial intelligence",
      "How do I learn machine learning?",
      "What coding languages should I use?",
      "Help me solve a math problem",
      "What is deep learning?"
    ];
    
    for (const query of testQueries) {
      console.log(`\n🔎 Query: "${query}"`);
      const results = await searchSimilarDocuments(query, 2);
      
      if (results.length > 0) {
        console.log(`✅ Found ${results.length} relevant document(s):`);
        results.forEach((doc, i) => {
          console.log(`   ${i + 1}. ${doc.pageContent.substring(0, 80)}...`);
          console.log(`      Topic: ${doc.metadata.topic}, Category: ${doc.metadata.category}`);
        });
      } else {
        console.log('❌ No results found');
      }
    }
    
    console.log('\n🎉 FREE FAISS RAG Test Complete!');
    console.log('\n📊 Summary:');
    console.log('✅ Vector store: FAISS (Local, Free)');
    console.log('✅ Embeddings: HuggingFace Transformers (Local, Free)');
    console.log('✅ Storage: Local file system');
    console.log('✅ Cost: $0.00');
    console.log('✅ Dependencies: No external API keys needed');
    
  } catch (error) {
    console.error('\n❌ FREE RAG test failed:', error.message);
    
    if (error.message.includes('module')) {
      console.log('💡 Make sure you installed: npm install @langchain/community');
    }
  }
};

testFreeRAG();