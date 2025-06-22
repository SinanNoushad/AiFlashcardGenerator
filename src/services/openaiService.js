import { OPENAI_API_KEY } from '../utils/constants';

export class OpenAIService {
  static async generateFlashcards(text) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that creates educational flashcards. 
                Generate 5-10 high-quality flashcards from the provided text. 
                Format each flashcard as "Q: [question]? A: [answer]" on separate lines.
                Make questions clear and answers concise but complete.
                Focus on key concepts, definitions, facts, and important details.`,
            },
            {
              role: 'user',
              content: `Create flashcards from this text: ${text}`,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate flashcards');
      }

      const content = data.choices[0]?.message?.content;
      return this.parseFlashcards(content);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

 static parseFlashcards(content) {
  const flashcards = [];
  const lines = content.split('\n').filter(line => line.trim());
  
  let currentQuestion = '';
  let currentAnswer = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('Q:')) {
      // Save previous flashcard if exists
      if (currentQuestion && currentAnswer) {
        flashcards.push({
          question: currentQuestion,
          answer: currentAnswer,
          // Add Firebase required fields
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReview: new Date(),
          lastReviewed: null,
          // Timestamps will be added in databaseService
        });
      }
      currentQuestion = trimmedLine.substring(2).trim();
      currentAnswer = '';
    } else if (trimmedLine.startsWith('A:')) {
      currentAnswer = trimmedLine.substring(2).trim();
    } else if (currentAnswer && trimmedLine) {
      // Continue answer on next line
      currentAnswer += ' ' + trimmedLine;
    }
  }
  
  // Save last flashcard
  if (currentQuestion && currentAnswer) {
    flashcards.push({
      question: currentQuestion,
      answer: currentAnswer,
      // Add Firebase required fields
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: new Date(),
      lastReviewed: null,
    });
  }
  
  return flashcards;
}
}