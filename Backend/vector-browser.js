// Vector Database Browser - Web Interface
import express from 'express';
import { searchSimilarDocuments } from './utils/pinecone.js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('public'));

// Serve HTML interface
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>SigmaGPT Vector Database Browser</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
            .search-box { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
            .result { background: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; }
            .metadata { background: #e9ecef; padding: 8px; margin: 5px 0; font-size: 0.9em; }
            button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background: #0056b3; }
            .stats { background: #d4edda; padding: 10px; border-radius: 4px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔍 SigmaGPT Vector Database Browser</h1>
            
            <div class="stats" id="stats">
                <h3>📊 Database Statistics</h3>
                <p>Loading statistics...</p>
            </div>
            
            <h3>🔍 Search Vector Database</h3>
            <input type="text" id="searchQuery" class="search-box" placeholder="Enter search query..." value="vice president India">
            <button onclick="searchVectorDB()">Search</button>
            <button onclick="loadStats()">Refresh Stats</button>
            
            <div id="results"></div>
        </div>
        
        <script>
            async function searchVectorDB() {
                const query = document.getElementById('searchQuery').value;
                const response = await fetch('/search', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({query})
                });
                const data = await response.json();
                displayResults(data);
            }
            
            async function loadStats() {
                const response = await fetch('/stats');
                const data = await response.json();
                document.getElementById('stats').innerHTML = \`
                    <h3>📊 Database Statistics</h3>
                    <p><strong>Vector Store Path:</strong> \${data.path}</p>
                    <p><strong>Files:</strong> \${data.files.join(', ')}</p>
                    <p><strong>Total Size:</strong> \${data.totalSize} KB</p>
                    <p><strong>Status:</strong> \${data.status}</p>
                \`;
            }
            
            function displayResults(data) {
                const resultsDiv = document.getElementById('results');
                if (data.results && data.results.length > 0) {
                    resultsDiv.innerHTML = \`
                        <h3>📚 Search Results (\${data.results.length} found)</h3>
                        \${data.results.map((result, i) => \`
                            <div class="result">
                                <h4>Result \${i + 1}</h4>
                                <p><strong>Content:</strong> \${result.pageContent}</p>
                                <div class="metadata">
                                    <strong>Metadata:</strong> \${JSON.stringify(result.metadata, null, 2)}
                                </div>
                            </div>
                        \`).join('')}
                    \`;
                } else {
                    resultsDiv.innerHTML = '<p>No results found.</p>';
                }
            }
            
            // Load stats on page load
            loadStats();
        </script>
    </body>
    </html>
  `);
});

// API endpoint for search
app.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    const results = await searchSimilarDocuments(query, 10);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint for stats
app.get('/stats', (req, res) => {
  try {
    const vectorStorePath = './vector_store';
    if (fs.existsSync(vectorStorePath)) {
      const files = fs.readdirSync(vectorStorePath);
      let totalSize = 0;
      
      files.forEach(file => {
        const filePath = path.join(vectorStorePath, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      });
      
      res.json({
        path: vectorStorePath,
        files,
        totalSize: (totalSize / 1024).toFixed(2),
        status: 'Active'
      });
    } else {
      res.json({
        path: vectorStorePath,
        files: [],
        totalSize: 0,
        status: 'Not Found'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Vector Database Browser running at http://localhost:${PORT}`);
  console.log('📊 You can now browse your vector database in your web browser!');
});

export default app;