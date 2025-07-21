import express from 'express';
import Thread from '../models/Thread.js';
import getDeepSeekResponse from "../utils/together.js";
const router = express.Router();

//test route
router.post('/test', async (req, res) => {
    try{
        const thread=new Thread({
            threadId: 'test-thread',
            title: 'Test Thread',
            
        });
        const response=await thread.save();
        res.send(response);
    }
    catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all threads
router.get('/thread', async (req, res) => {
    try {   
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (error) {
        console.error('Error fetching threads:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/thread/:threadId', async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId: threadId });
        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }
        res.json(thread.messages);
    } catch (error) {
        console.error('Error fetching thread:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
});

router.delete('/thread/:threadId', async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId: threadId });
        if (!deletedThread) {
            return res.status(404).json({ error: 'Thread not found' });
        }
        res.json({ message: 'Thread deleted successfully' });
    } catch (error) {
        console.error('Error deleting thread:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/chat',async(req,res)=>{
    const { threadId, message } = req.body;
    if(!threadId || !message) {
        return res.status(400).json({ error: 'Thread ID and message are required' });
    }
    try {
        let thread = await Thread.findOne({ threadId: threadId });
        if (!thread) {
            thread = new Thread({
                threadId: threadId,
                title: message,
                messages: [{role: 'user', content: message}]
            });
        }
        else{
            thread.messages.push({ role: 'user', content: message });
        }
        const assistantResponse = await getDeepSeekResponse(message);

        thread.messages.push({ role: 'assistant', content: assistantResponse });
        const updatedAt = await thread.save();
        res.json({reply:assistantResponse})

       
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

export default router;
