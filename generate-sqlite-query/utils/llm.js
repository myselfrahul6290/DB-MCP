import { pipeline } from '@huggingface/transformers';
import { getReleventShema } from './vector_db.js';
import { cleanAndFixSQL } from './db.js';

// Initialize the local text-to-sql model once at module load
const generator = await pipeline(
  'text2text-generation',
  'Xenova/t5-small-awesome-text-to-sql',
  { dtype: 'fp32' }
);

const AskUserToSpecifyPrompt = [
  "I'm not quite sure I follow. Could you try rephrasing that using different words?",
  "I couldn't quite connect your question to our database. To help me out, try being a bit more specific about what you're looking for!",
  "I'm still learning! Could you try making your question a bit more specific?"
];

export async function getSQLFromLLM(userMessage) {
  const schemaPromptText = await getReleventShema(userMessage);

  if (!schemaPromptText) {
    const randomMessage =
      AskUserToSpecifyPrompt[Math.floor(Math.random() * AskUserToSpecifyPrompt.length)];
    return { message: randomMessage, status: false };
  }

  // Format schema + question for t5-small-awesome-text-to-sql
  const input = `tables:\n${schemaPromptText}\nquery for: ${userMessage}`;

  const output = await generator(input, {
    max_new_tokens: 120
  });

  const rawSQL = output[0]?.generated_text || "";
  const cleanedSQL = cleanAndFixSQL(rawSQL);

  return { message: cleanedSQL, status: true };


  // use large llm 
  // const prompt = `
  // You are a SQLite SQL generator.
  
  // Rules:
  // - Output ONLY valid SQLite SQL
  // - No markdown
  // - No explanation
  // - Only SELECT queries allowed
  
  // Database schema:
  // ${schemaPromtText}
  // User request:
  // "${userMessage}"
  // `;
  
  
  // // const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  // const ai = new GoogleGenAI({apiKey: 'YOUR_GEMEINI_API_KEY'});
  
  // const response = await ai.models.generateContent({
  //   model: 'gemini-2.5-flash',
  //   contents: prompt,
  // });
  // // console.log(response.text);
  // return {"message":response.text,"status":true};
}






