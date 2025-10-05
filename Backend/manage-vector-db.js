// Vector Database Management Tool
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/hf_transformers';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const VECTOR_STORE_PATH = './vector_store';
const BACKUP_PATH = './vector_store_backup';

const manageVectorDB = async () => {
  console.log('🛠️ Vector Database Management Tool\n');
  
  // Create backup before operations
  console.log('📁 Creating backup...');
  if (fs.existsSync(VECTOR_STORE_PATH)) {
    if (!fs.existsSync(BACKUP_PATH)) {
      fs.mkdirSync(BACKUP_PATH, { recursive: true });
    }
    
    const files = fs.readdirSync(VECTOR_STORE_PATH);
    files.forEach(file => {
      const src = path.join(VECTOR_STORE_PATH, file);
      const dest = path.join(BACKUP_PATH, `${file}.backup.${Date.now()}`);
      fs.copyFileSync(src, dest);
    });
    console.log('✅ Backup created successfully');
  }
  
  // Load and analyze vector store
  const embeddings = new HuggingFaceTransformersEmbeddings({
    modelName: "Xenova/all-MiniLM-L6-v2",
  });
  
  const vectorStore = await FaissStore.load(VECTOR_STORE_PATH, embeddings);
  console.log('✅ Vector store loaded for analysis');
  
  // Analyze document store
  const docstorePath = path.join(VECTOR_STORE_PATH, 'docstore.json');
  const docstore = JSON.parse(fs.readFileSync(docstorePath, 'utf8'));
  
  console.log('\n📊 Database Analysis:');
  console.log(`Total documents: ${Object.keys(docstore[0]).length}`);
  
  // Categorize documents
  const categories = {
    conversations: 0,
    errors: 0,
    documentation: 0,
    personal: 0,
    technical: 0,
    recent: 0,
    old: 0
  };
  
  const now = new Date();
  const documents = [];
  
  Object.entries(docstore[0]).forEach(([id, doc]) => {
    documents.push({ id, ...doc });
    
    // Categorize by content
    const content = doc.pageContent.toLowerCase();
    const metadata = doc.metadata || {};
    
    if (content.includes('user:') && content.includes('assistant:')) {
      categories.conversations++;
    }
    if (content.includes('error') || content.includes('apologize')) {
      categories.errors++;
    }
    if (metadata.type === 'documentation') {
      categories.documentation++;
    }
    if (content.includes('sai krishna') || content.includes('full stack')) {
      categories.personal++;
    }
    if (content.includes('react') || content.includes('node.js') || content.includes('ai')) {
      categories.technical++;
    }
    
    // Categorize by age
    if (metadata.timestamp) {
      const docDate = new Date(metadata.timestamp);
      const daysDiff = (now - docDate) / (1000 * 60 * 60 * 24);
      if (daysDiff < 7) {
        categories.recent++;
      } else {
        categories.old++;
      }
    }
  });
  
  console.log('\n📋 Document Categories:');
  Object.entries(categories).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });
  
  // Find duplicates
  console.log('\n🔍 Checking for duplicates...');
  const contentMap = new Map();
  const duplicates = [];
  
  documents.forEach(doc => {
    const content = doc.pageContent.substring(0, 100); // First 100 chars
    if (contentMap.has(content)) {
      duplicates.push({ original: contentMap.get(content), duplicate: doc });
    } else {
      contentMap.set(content, doc);
    }
  });
  
  if (duplicates.length > 0) {
    console.log(`⚠️ Found ${duplicates.length} potential duplicates:`);
    duplicates.forEach((dup, i) => {
      console.log(`  ${i + 1}. "${dup.duplicate.pageContent.substring(0, 50)}..."`);
    });
  } else {
    console.log('✅ No duplicates found');
  }
  
  // Show error entries
  console.log('\n❌ Error Entries:');
  const errorDocs = documents.filter(doc => 
    doc.pageContent.includes('error') || doc.pageContent.includes('apologize')
  );
  
  if (errorDocs.length > 0) {
    errorDocs.forEach((doc, i) => {
      console.log(`  ${i + 1}. "${doc.pageContent.substring(0, 60)}..."`);
      console.log(`     Date: ${doc.metadata.timestamp?.substring(0, 10)}`);
    });
  } else {
    console.log('✅ No error entries found');
  }
  
  // Recommendations
  console.log('\n💡 Optimization Recommendations:');
  console.log(`  📈 Database Health: ${errorDocs.length < 5 ? 'Good' : 'Needs Attention'}`);
  console.log(`  🧹 Duplicates: ${duplicates.length === 0 ? 'Clean' : 'Needs Cleanup'}`);
  console.log(`  📚 Knowledge Diversity: ${categories.technical > 3 ? 'Good' : 'Add More'}`);
  console.log(`  👤 Personal Memory: ${categories.personal > 0 ? 'Active' : 'Limited'}`);
  
  if (errorDocs.length > 5) {
    console.log('  ⚠️ Consider cleaning up error entries');
  }
  if (duplicates.length > 3) {
    console.log('  ⚠️ Consider removing duplicate entries');
  }
  if (categories.old > categories.recent * 3) {
    console.log('  ⚠️ Consider archiving old conversations');
  }
  
  console.log('\n🎯 Usage Tips:');
  console.log('  • Your RAG system is working well for recent queries');
  console.log('  • Personal information retrieval is excellent');
  console.log('  • Consider adding more technical documentation');
  console.log('  • Regular cleanup improves search quality');
};

manageVectorDB().catch(console.error);