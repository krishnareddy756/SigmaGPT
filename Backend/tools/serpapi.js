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
    try {
      // Extract the query from the input object if it's an object, otherwise use as string
      const query = typeof input === 'object' ? input.input || input.query || input : input;
      
      console.log('SerpAPI tool called with:', query);
      
      if (!query || query.trim() === '') {
        throw new Error('Query parameter is required');
      }

      if (!process.env.SERPAPI_API_KEY) {
        throw new Error('SERPAPI_API_KEY is not configured');
      }

      const response = await getJson({
        engine: "google",
        q: query,
        api_key: process.env.SERPAPI_API_KEY,
        num: 5 // Limit to 5 results
      });

      console.log('SerpAPI response received');

      if (response.error) {
        throw new Error(`SerpAPI error: ${response.error}`);
      }

      if (response.organic_results && response.organic_results.length > 0) {
        const results = response.organic_results.slice(0, 3).map(result => ({
          title: result.title,
          snippet: result.snippet,
          link: result.link
        }));

        // Return a formatted string instead of JSON
        return `Search results for "${query}":\n\n` + 
               results.map((result, index) => 
                 `${index + 1}. **${result.title}**\n   ${result.snippet}\n   Source: ${result.link}\n`
               ).join('\n');
      } else {
        return `No search results found for "${query}".`;
      }
    } catch (error) {
      console.error('SerpAPI error:', error.message || error);
      return `Search error: ${error.message || 'Failed to search'}`;
    }
  }
}

export const serpAPITool = new SerpAPITool();