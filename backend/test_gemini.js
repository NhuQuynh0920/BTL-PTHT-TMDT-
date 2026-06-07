import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from './services/ai/prompts.js';
import { tools } from './services/ai/functionCalling.js';

async function runTest() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Using API Key:", apiKey ? "Key exists" : "No key");
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      tools: tools
    });

    const chat = model.startChat({
      history: []
    });

    console.log("Sending 'hello' to Gemini...");
    const result = await chat.sendMessageStream("hello");
    
    for await (const chunk of result.stream) {
      console.log("Chunk:", chunk.text());
    }
    console.log("Stream done!");
  } catch (error) {
    console.error("Test Error Details:", error);
  }
}

runTest();
