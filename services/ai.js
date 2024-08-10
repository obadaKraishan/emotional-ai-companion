import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: '#',
});

export async function generateResponse(userMessage) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating AI response:', error);
        throw new Error('Failed to generate AI response');
    }
}
