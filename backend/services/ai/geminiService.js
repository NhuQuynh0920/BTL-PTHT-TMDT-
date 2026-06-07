import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from './prompts.js';
import { tools, executeFunction } from './functionCalling.js';

export const handleChatWithGemini = async (messages, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      tools: tools
    });

    let validMessages = [...messages];

    // Gemini API yêu cầu lịch sử (history) BẮT BUỘC phải bắt đầu bằng tin nhắn của 'user'.
    // Do Frontend mặc định có 1 tin nhắn chào hỏi của Bot đầu tiên, ta cần loại bỏ nó khỏi history gửi cho API.
    while (validMessages.length > 0 && validMessages[0].sender === 'bot') {
      validMessages.shift();
    }

    // Format chat history for Gemini
    const history = validMessages.map(m => ({
      role: m.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    // The last message is the user's new prompt
    const userMessage = history.pop();

    // Start a chat session
    const chat = model.startChat({
      history: history,
    });

    // Send the message and get a stream
    let result = await chat.sendMessageStream(userMessage.parts[0].text);

    // Check if the model decided to call a function
    let call = null;
    let accumulatedText = "";

    for await (const chunk of result.stream) {
      const functionCalls = chunk.functionCalls();
      if (functionCalls && functionCalls.length > 0) {
        call = functionCalls[0];
        break; // Stop streaming if it's a function call
      }

      const chunkText = chunk.text();
      accumulatedText += chunkText;
      // Send chunk to client via SSE
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    // Handle function calling if requested by the model
    if (call) {
      const functionName = call.name;
      const functionArgs = call.args;

      console.log(`[Gemini] Calling function: ${functionName} with args:`, functionArgs);

      // Send indicator to client that bot is fetching data
      res.write(`data: ${JSON.stringify({ isTyping: true, status: 'Đang tra cứu hệ thống...' })}\n\n`);

      // Execute the actual DB function
      const apiResponse = await executeFunction(functionName, functionArgs);

      // Send the function response back to the model
      const secondResult = await chat.sendMessageStream([{
        functionResponse: {
          name: functionName,
          response: { result: apiResponse }
        }
      }]);

      // Stream the final answer back to the client
      for await (const chunk of secondResult.stream) {
        const chunkText = chunk.text();
        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      }
    }

    // End the SSE stream
    res.write(`data: [DONE]\n\n`);
    res.end();

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Xin lỗi, hệ thống AI đang gặp sự cố. Vui lòng thử lại sau.' })}\n\n`);
    res.write(`data: [DONE]\n\n`);
    res.end();
  }
};
