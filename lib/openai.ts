import OpenAI from 'openai';
import { ENV } from '@/config/env';

export const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Enable client-side usage
});

export const generateFlashcards = async (topic: string, count: number = 5) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates flashcards. Return only a JSON array of flashcard objects with 'front' and 'back' properties."
        },
        {
          role: "user",
          content: `Create ${count} flashcards about ${topic}. Make them concise and educational.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('No content in response');
    const response = JSON.parse(content);
    return response.flashcards;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
}; 