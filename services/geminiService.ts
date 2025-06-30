import { GoogleGenAI } from "@google/genai";
import { TimelineData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const languageMap: { [key: string]: string } = {
  en: 'English',
  es: 'Spanish',
  pt: 'Brazilian Portuguese',
};

const getMasterPrompt = (topic: string, lang: string): string => {
  const languageName = languageMap[lang] || 'English';
  return `
You are an expert historian and a JSON data architect. Your sole purpose is to generate a historical timeline about a user-provided topic and output it as a single minified JSON object, with no surrounding text.

The user's topic is: "${topic}".
The response language MUST be ${languageName}.

Your JSON output MUST conform to this exact structure:
{
  "title": "A ${languageName} title for the timeline of ${topic}",
  "summary": "An AI-generated summary in ${languageName} about the topic's history, around 50-70 words.",
  "events": [
    {
      "date": "A precise date for the event (e.g., '1826', 'c. 300 BC', '7 September 1927')",
      "title": "A concise, impactful title for the event in ${languageName}.",
      "description": "A detailed description of the event and its significance in ${languageName}. At least 2-3 sentences.",
      "category": "One of the following English words: 'Invention', 'Conflict', 'Discovery', 'Art'",
      "image_query": "A 3-5 word phrase for an image search API (e.g., 'ancient printing press', 'tyrannosaurus rex fossil'). This query must be in English."
    }
  ]
}

Rules for generation:
1.  Generate between 7 and 12 event objects within the 'events' array.
2.  All text values ('title', 'summary', 'events.title', 'events.description') MUST be in ${languageName}.
3.  The 'category' value MUST be one of the four specified English words.
4.  The 'image_query' MUST be in English.
5.  Do not output anything other than the single, minified JSON object.
`;
};

export const generateTimelineText = async (topic: string, language: string): Promise<TimelineData> => {
  const prompt = getMasterPrompt(topic, language);

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.5,
        }
    });
    
    let jsonStr = response.text.trim();

    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as TimelineData;

    if (!parsedData.title || !parsedData.summary || !parsedData.events) {
      throw new Error("AI response is missing expected structure.");
    }

    return parsedData;
  } catch (error) {
    console.error("Error generating timeline text:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to communicate with AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the timeline.");
  }
};

export const generateImage = async (imageQuery: string): Promise<string> => {
    try {
        const fullPrompt = `Simple oil painting in the style of Claude Monet of ${imageQuery}.`;
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: fullPrompt,
            config: { numberOfImages: 1, outputMimeType: 'image/png' },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("No image was generated.");
        }

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return base64ImageBytes;
    } catch (error) {
        console.error(`Error generating image for query "${imageQuery}":`, error);
        throw new Error(`Failed to generate image.`);
    }
};