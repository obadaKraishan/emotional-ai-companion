import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateResponse(userMessage, sentiment) {
  try {
    const gptResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `User: ${userMessage}\nAI:`,
      max_tokens: 150,
    });

    if (gptResponse.data.choices && gptResponse.data.choices.length > 0) {
      return gptResponse.data.choices[0].text.trim();
    } else {
      throw new Error('No valid response from OpenAI API');
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate response from AI');
  }
}
