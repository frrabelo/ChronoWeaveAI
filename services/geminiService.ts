
import { GoogleGenAI } from "@google/genai";
import { TimelineResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const getMasterPrompt = (topic: string, slug: string): string => {
  return `
Você é um historiador especialista e um arquiteto de dados JSON. O seu único propósito é gerar uma linha do tempo histórica sobre um tópico fornecido pelo usuário e produzi-la como um único objeto JSON minificado, sem nenhum texto ao redor.

O tópico do usuário é: "${topic}".

A sua saída JSON DEVE estar em conformidade com esta estrutura exata, que mapeia para componentes de um Headless CMS chamado Storyblok:
{
  "story": {
    "name": "Linha do Tempo: ${topic}",
    "slug": "timeline-${slug}",
    "content": {
      "component": "Timeline_Page",
      "title": "A História de ${topic}",
      "summary": "Um resumo gerado por IA sobre a história do tópico, com cerca de 50-70 palavras.",
      "events_container": [
        {
            "component": "Timeline_Event",
            "date": "Uma data precisa para o evento (e.g., '1826', 'c. 300 a.C.', '7 de Setembro de 1927')",
            "title": "Um título conciso e impactante para o evento.",
            "description": "Uma descrição detalhada do evento e seu significado. Pelo menos 2-3 frases.",
            "category": "Uma das seguintes: 'Invenção', 'Conflito', 'Descoberta', 'Arte'",
            "image_query": "Uma frase de 3-5 palavras para uma API de busca de imagens (ex: 'ancient printing press', 'tyrannosaurus rex fossil')."
        }
      ]
    }
  }
}

Regras para a geração:
1.  Gere entre 7 e 12 objetos de evento dentro do array 'events_container'.
2.  Para cada evento, o campo 'description' deve ser detalhado, informativo e com pelo menos 2-3 frases.
3.  O campo 'category' deve ser uma das seguintes opções: "Invenção", "Conflito", "Descoberta", "Arte".
4.  O campo 'image_query' deve ser uma frase curta e descritiva de 3-5 palavras, ideal para uma API de busca de imagens (ex: "antiga prensa de impressão", "fóssil de tiranossauro rex").
5.  Não produza nada além do objeto JSON. Responda apenas com o JSON.
`;
};

export const generateTimeline = async (topic: string): Promise<TimelineResponse> => {
  const slug = slugify(topic);
  const prompt = getMasterPrompt(topic, slug);

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

    // Clean potential markdown fences
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as TimelineResponse;

    // Basic validation
    if (!parsedData.story || !parsedData.story.content || !parsedData.story.content.events_container) {
      throw new Error("A resposta da IA não possui a estrutura esperada.");
    }

    return parsedData;
  } catch (error) {
    console.error("Erro ao gerar linha do tempo:", error);
    if (error instanceof Error) {
        throw new Error(`Falha na comunicação com a IA: ${error.message}`);
    }
    throw new Error("Ocorreu um erro desconhecido ao gerar a linha do tempo.");
  }
};
