// utils/together.js
import { Together } from "together-ai";
import dotenv from "dotenv";

dotenv.config();

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
});

const getDeepSeekResponse = async (message) => {
  try {
    const response = await together.chat.completions.create({
      messages: [
        { role: "user", content: message }
      ],
      model: "deepseek-ai/DeepSeek-V3",
      stream: false  // or true if you implement streaming
    });

    return response.choices[0]?.message?.content || "No response";
  } catch (err) {
    console.error("Together API error:", err);
    throw new Error("Internal Server Error");
  }
};

export default getDeepSeekResponse;
