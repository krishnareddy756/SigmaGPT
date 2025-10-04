// Script to create Pinecone index for SigmaGPT
import { Pinecone } from '@pinecone-database/pinecone';
import 'dotenv/config';

const createPineconeIndex = async () => {
  try {
    console.log('🚀 Creating Pinecone index...');
    
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const indexName = process.env.PINECONE_INDEX_NAME || 'sigmagpt-index';
    
    // Check if index already exists
    const existingIndexes = await pinecone.listIndexes();
    const indexExists = existingIndexes.indexes?.some(index => index.name === indexName);
    
    if (indexExists) {
      console.log(`✅ Index "${indexName}" already exists!`);
      return;
    }

    // Create index with correct dimensions for text-embedding-3-small
    await pinecone.createIndex({
      name: indexName,
      dimension: 1536, // text-embedding-3-small dimensions
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    });

    console.log(`🎉 Successfully created index: ${indexName}`);
    console.log('⏳ Index may take a few minutes to be ready...');
    
    // Wait for index to be ready
    console.log('🔄 Waiting for index to be ready...');
    let isReady = false;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (!isReady && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      try {
        const indexStats = await pinecone.index(indexName).describeIndexStats();
        isReady = true;
        console.log('✅ Index is ready!');
        console.log('📊 Index stats:', indexStats);
      } catch (error) {
        attempts++;
        console.log(`⏳ Still waiting... (${attempts}/${maxAttempts})`);
      }
    }
    
    if (!isReady) {
      console.log('⚠️ Index creation timeout. Check Pinecone dashboard manually.');
    }

  } catch (error) {
    console.error('❌ Error creating Pinecone index:', error);
    
    if (error.message.includes('already exists')) {
      console.log('✅ Index already exists, proceeding...');
    } else {
      throw error;
    }
  }
};

// Run the script
createPineconeIndex()
  .then(() => {
    console.log('🏁 Pinecone setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });