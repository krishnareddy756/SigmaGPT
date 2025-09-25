import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
import { initializePinecone } from './utils/pinecone.js';
const app=express();
const PORT = 8080;
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173',
  'https://sigma-gpt-43mi.vercel.app'
];


app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
}));

app.use('/api', chatRoutes);
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`); 
  await connectDB();
  await initializePinecone();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Exit the process if connection fails
  }
}
// app.post('/test',async (req, res) => {
//     const options={
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: 'gpt-4o-mini',
//             messages: [
//                 {
//                     role: 'user',
//                     content: req.body.message 
//                 }
//             ]
//         })
//     };
//     try {
//         const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        
//         const data = await response.json();
//         console.log(data);
//         res.send(data.choices[0].message.content);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });  

    

















// import OpenAI from 'openai';
// import dotenv from 'dotenv/config';

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
// });

// const response = await client.responses.create({
//   model: 'gpt-4o-mini',
//   input: 'Are semicolons optional in JavaScript?',
// });

// console.log(response.output_text);
