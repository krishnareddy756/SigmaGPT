// tools/serpapi.js
import { getJson } from 'serpapi';
import { Tool } from '@langchain/core/tools';
import { z } from 'zod';

export class SerpAPITool extends Tool {
  name = "search";
  description = "Useful for searching the internet for current information. Input should be a search query.";
  
  schema = z.object({
    input: z.string().describe("A search query to find current information")
  });

  async _call(input) {
    // Extract the actual query string from the input
    const query = typeof input === 'string' ? input : (input.input || input.query || String(input));
    
    try {
      // Check if API key is available
      if (!process.env.SERPAPI_API_KEY || process.env.SERPAPI_API_KEY === 'your_serpapi_key_here') {
        return `I cannot search the web right now as the search service is not configured. However, I can provide information based on my training data. Please note this information might not be current.`;
      }

      if (!query || query.trim().length === 0) {
        return "Please provide a search query.";
      }

      console.log(`🔍 SerpAPI searching for: "${query}"`);

      const response = await getJson({
        engine: "google",
        q: query.trim(),
        api_key: process.env.SERPAPI_API_KEY,
        num: 5 // Limit to 5 results
      });

      if (response.organic_results && response.organic_results.length > 0) {
        const results = response.organic_results.slice(0, 3).map(result => ({
          title: result.title,
          snippet: result.snippet,
          link: result.link
        }));

        return `Search results for "${query}":\n\n` + results.map((result, i) => 
          `${i + 1}. **${result.title}**\n   ${result.snippet}\n   Source: ${result.link}`
        ).join('\n\n');
      } else {
        return "No search results found for this query.";
      }
    } catch (error) {
      console.error('SerpAPI error:', error);
      return `I cannot search the web right now due to a technical issue. I'll provide information based on my training data instead.`;
    }
  }
}

export const serpAPITool = new SerpAPITool();