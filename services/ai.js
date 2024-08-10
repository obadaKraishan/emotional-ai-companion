const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateResponse(userMessage, sentiment) {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `User: ${userMessage}\nAI:`,
      max_tokens: 150,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
}

module.exports = { generateResponse };
