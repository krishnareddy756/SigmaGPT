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

  async _call(query) {
    try {
      const response = await getJson({
        engine: "google",
        q: query,
        api_key: process.env.SERPAPI_API_KEY,
        num: 5 // Limit to 5 results
      });

      if (response.organic_results && response.organic_results.length > 0) {
        const results = response.organic_results.slice(0, 3).map(result => ({
          title: result.title,
          snippet: result.snippet,
          link: result.link
        }));

        return JSON.stringify(results, null, 2);
      } else {
        return "No search results found.";
      }
    } catch (error) {
      console.error('SerpAPI error:', error);
      return `Search error: ${error.message}`;
    }
  }
}

export const serpAPITool = new SerpAPITool();