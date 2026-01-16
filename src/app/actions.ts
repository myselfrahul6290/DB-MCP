'use server';


import type { Message } from '@/lib/types';

export async function getAiResponse(
  conversationHistory: Message[]
): Promise<string> {
  const userMessage = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;

  if (!userMessage || userMessage.role !== 'user') {
    return "I can't seem to find your message. Could you please send it again?";
  }
  console.log("userMessage",userMessage.content)

  try {
    
    const response=await fetch("http://localhost:3000/chat",{
      method:"POST",
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage.content
      })
    })
 
    
    if (!response) {
      throw new Error('AI failed to generate a response.');
    }
    const aiResponse=await response.json()
    
    console.log(aiResponse?.res)
    return  aiResponse?.res;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return 'Sorry, I encountered an error while trying to respond. Please try again.';
  }
}
