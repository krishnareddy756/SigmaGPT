// Test MongoDB Atlas Connection
import mongoose from 'mongoose';
import 'dotenv/config';

const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB Atlas connection...');
    
    // Use the connection string from environment
    const MONGODB_URL = process.env.MONGODB_URL;
    console.log('📍 Connecting to:', MONGODB_URL.replace(/\/\/.*@/, '//***:***@'));
    
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test basic operations
    const testSchema = new mongoose.Schema({ 
      name: String, 
      date: Date,
      test: Boolean 
    });
    const TestModel = mongoose.model('ConnectionTest', testSchema);
    
    // Create test document
    const test = new TestModel({ 
      name: 'SigmaGPT Connection Test', 
      date: new Date(),
      test: true 
    });
    await test.save();
    console.log('✅ Test document saved successfully!');
    
    // Read test document
    const found = await TestModel.findOne({ name: 'SigmaGPT Connection Test' });
    console.log('✅ Test document retrieved:', found.name);
    
    // Clean up
    await TestModel.deleteMany({ name: 'SigmaGPT Connection Test' });
    console.log('✅ Test document cleaned up!');
    
    // Show database info
    const admin = mongoose.connection.db.admin();
    const result = await admin.listDatabases();
    console.log('📚 Available databases:', result.databases.map(db => db.name));
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    console.log('🚀 Your MongoDB Atlas is ready for production!');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('💡 Check your username and password in the connection string');
    } else if (error.message.includes('timeout')) {
      console.error('💡 Check your network access settings in MongoDB Atlas');
    } else {
      console.error('💡 Full error:', error);
    }
  }
};

testConnection();