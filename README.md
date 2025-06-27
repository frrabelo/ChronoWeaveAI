# ChronoWeave AI: Conteúdo Histórico Arquitetado por IA para Storyblok

[![Licença: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ChronoWeave AI** é a minha submissão para o **Desafio Storyblok Headless CMS**. Este projeto explora o futuro da criação de conteúdo, onde a Inteligência Artificial transcende o papel de assistente de escrita para se tornar uma verdadeira arquiteta de estruturas de conteúdo complexas.

Com o ChronoWeave, qualquer usuário pode gerar uma linha do tempo histórica rica, detalhada e visualmente apelativa sobre qualquer tópico imaginável. A IA não apenas escreve o conteúdo, mas gera toda a estrutura de dados JSON que é usada para criar programaticamente uma nova página (Story) no Storyblok, completa com componentes aninhados.

- **Link para a Demonstração ao Vivo:** `[INSIRA O LINK DA SUA DEMO NA VERCEL AQUI]`
- **Link para o Artigo no DEV.to:** `[INSIRA O LINK DO SEU ARTIGO AQUI]`

![GIF do ChronoWeave AI em ação](https://placehold.co/800x450/2d3748/edf2f7?text=GIF+da+Aplicação+em+Ação)
*(Recomendado: Substitua este placeholder por um GIF real mostrando o fluxo do app)*

## A Ideia: De Assistente de Conteúdo a Arquiteto de Conteúdo

A maioria das integrações de IA em CMSs trata a IA como uma ferramenta para preencher campos de texto. Eu queria ir além. O objetivo era demonstrar uma integração de "Nível 2":

1.  **Usuário Fornece um Tópico:** Um único campo de entrada para o usuário.
2.  **IA Gera uma Estrutura JSON:** Uma função serverless envia um prompt cuidadosamente engenheirado para a API do Google (Gemini), instruindo-a a retornar um objeto JSON completo que corresponde perfeitamente ao nosso esquema de componentes do Storyblok.
3.  **Criação Programática no Storyblok:** O JSON gerado pela IA é enviado para a API de Gestão do Storyblok, que cria uma nova Story, populando todos os campos e componentes aninhados (`Timeline_Event`) instantaneamente.
4.  **Visualização Imediata:** O usuário é redirecionado para a nova página, renderizada com os dados recém-criados e servidos pela API de Conteúdo do Storyblok.

Este projeto demonstra como o modelo de componentes do Storyblok é o parceiro perfeito para conteúdo estruturado gerado por IA, permitindo a criação de experiências ricas e dinâmicas sob demanda.

## Pilha Tecnológica

- **Framework Frontend:** [Astro](https://astro.build/) - Escolhido pela sua performance incrível (arquitetura de ilhas) e excelente experiência de desenvolvimento para sites focados em conteúdo.
- **CMS:** [Storyblok](https://www.storyblok.com/) - O coração da gestão de conteúdo. Usamos tanto a API de Conteúdo (para ler) quanto a API de Gestão (para escrever).
- **IA Generativa:** [Google AI (Gemini)](https://ai.google.dev/) - O cérebro por trás da geração da estrutura da linha do tempo.
- **Hospedagem & Backend:** [Vercel](https://vercel.com/) - Perfeito para hospedar o site Astro e executar a nossa lógica de backend como uma Função Serverless.
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) - Para um desenvolvimento de UI rápido e consistente.

## Configuração do Projeto

Para executar este projeto localmente, você precisará de algumas chaves de API. Siga os passos abaixo.

### 1. Pré-requisitos

- Node.js (versão 18 ou superior)
- Uma conta no [Storyblok](https://app.storyblok.com/) (o plano gratuito é suficiente)
- Uma chave de API do [Google AI Studio](https://aistudio.google.com/app/apikey)
- Uma conta na [Vercel](https://vercel.com/)

### 2. Configure seu Espaço no Storyblok

A parte mais importante é replicar a estrutura de componentes no seu espaço do Storyblok.

- **Componente `Timeline_Page` (Content Type):**
    - `title` (text)
    - `summary` (textarea)
    - `events_container` (blocks)
        - Nos ajustes do campo `events_container`, permita apenas o componente `Timeline_Event`.
- **Componente `Timeline_Event` (Nestable):**
    - `event_date` (text)
    - `event_title` (text)
    - `description` (rich_text)
    - `category` (single-option: Invenção, Conflito, Descoberta, Arte)
    - `image_query` (text)

### 3. Instalação Local

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU-USUARIO/chronoweave-ai.git](https://github.com/SEU-USUARIO/chronoweave-ai.git)
    cd chronoweave-ai
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes chaves. Você pode usar `.env.example` como um template.

    ```env
    # Chave de acesso à API de Conteúdo do Storyblok (Preview)
    STORYBLOK_ACCESS_TOKEN="SUA_CHAVE_DE_PREVIEW_AQUI"

    # Chave de acesso pessoal à API de Gestão do Storyblok
    # Gere em: Settings > Access Tokens > Personal access tokens
    STORYBLOK_MANAGEMENT_TOKEN="SUA_CHAVE_DE_GESTÃO_AQUI"

    # ID do seu espaço no Storyblok
    # Encontre em: Settings > General > Space ID
    STORYBLOK_SPACE_ID="SEU_ID_DE_ESPAÇO_AQUI"

    # Chave de API do Google AI (Gemini)
    # Gere em: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
    GOOGLE_AI_API_KEY="SUA_CHAVE_GEMINI_AQUI"
    ```

### 4. Executando o Projeto

Para rodar o ambiente de desenvolvimento local (com hot-reloading):
```bash
npm run dev

Abra http://localhost:4321 no seu navegador.

Deploy na Vercel
Faça o fork deste repositório para a sua conta do GitHub.

Crie um novo projeto na Vercel e importe o seu repositório.

A Vercel deve detectar automaticamente que é um projeto Astro.

Vá para as configurações do projeto na Vercel e adicione as mesmas variáveis de ambiente do seu arquivo .env.

Faça o deploy. A sua função serverless em api/generate.js será implantada automaticamente.


Agora, vamos criar os arquivos do projeto, passo a passo. O próximo arquivo é fundamental: o código do backend que irá orquestrar a IA e o Storyblok.


```javascript
// api/generate.js
// Esta é a função serverless que atua como o cérebro do ChronoWeave AI.
// Ela é executada na Vercel e orquestra a comunicação entre o frontend, a IA e o Storyblok.

// Importa o fetch para fazer requisições HTTP em um ambiente Node.js.
import fetch from 'node-fetch';

// Slugify é uma função auxiliar para converter strings em slugs para URLs.
// Ex: "A História da Computação" -> "a-historia-da-computacao"
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')       // Substitui espaços por -
        .replace(/[^\w-]+/g, '')    // Remove caracteres não-palavra
        .replace(/--+/g, '-')       // Substitui múltiplos - por um único -
        .replace(/^-+/, '')         // Remove - do início
        .replace(/-+$/, '');        // Remove - do final
}

// O prompt mestre. Esta é a instrução principal para a IA.
// Usamos placeholders {{USER_TOPIC}} e {{slugified_user_topic}} que serão substituídos dinamicamente.
const MASTER_PROMPT_TEMPLATE = `
Você é um historiador especialista e um arquiteto de dados JSON. O seu único propósito é gerar uma linha do tempo histórica sobre um tópico fornecido pelo usuário e produzi-la como um único objeto JSON minificado, sem nenhum texto ao redor.

O tópico do usuário é: "{{USER_TOPIC}}".

A sua saída JSON DEVE estar em conformidade com esta estrutura exata, que mapeia para componentes de um Headless CMS chamado Storyblok. O array 'events_container' DEVE conter objetos, cada um com um campo "component" com o valor "Timeline_Event".

{
  "story": {
    "name": "Linha do Tempo: {{USER_TOPIC}}",
    "slug": "timeline-{{slugified_user_topic}}",
    "content": {
      "component": "Timeline_Page",
      "title": "A História de {{USER_TOPIC}}",
      "summary": "Um resumo gerado por IA sobre a história do tópico, com cerca de 50-70 palavras.",
      "events_container": [
        {
          "component": "Timeline_Event",
          "event_date": "ANO_OU_DATA_DO_EVENTO",
          "event_title": "TÍTULO_DO_EVENTO",
          "description": "DESCRIÇÃO_DETALHADA_DO_EVENTO",
          "category": "CATEGORIA_RELEVANTE",
          "image_query": "CONSULTA_DE_IMAGEM_CURTA"
        }
      ]
    }
  }
}

Regras para a geração:
1. Gere entre 7 e 12 objetos de evento dentro do array 'events_container'.
2. Para cada evento, o campo 'description' deve ser detalhado, informativo e com pelo menos 2-3 frases.
3. O campo 'category' deve ser uma das seguintes opções: "Invenção", "Conflito", "Descoberta", "Arte".
4. O campo 'image_query' deve ser uma frase curta e descritiva de 3-5 palavras, ideal para uma API de busca de imagens (ex: "antiga prensa de impressão", "fóssil de tiranossauro rex").
5. Não produza NADA além do objeto JSON minificado. Não use blocos de código markdown \`\`\`json.
`;


// A função principal da API (handler).
// A Vercel executa esta função quando o endpoint /api/generate é chamado.
export default async function handler(request, response) {
    // Permite requisições de qualquer origem (CORS). Necessário para o desenvolvimento local.
    // Em produção, você pode restringir isso ao seu domínio.
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Responde a requisições OPTIONS (pre-flight) para CORS.
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    // Só permite requisições POST.
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Método não permitido' });
    }

    try {
        const { topic } = request.body;
        if (!topic) {
            return response.status(400).json({ message: 'O tópico é obrigatório' });
        }

        // --- ETAPA 1: Preparar o prompt para a IA ---
        const slug = slugify(topic);
        const finalPrompt = MASTER_PROMPT_TEMPLATE
            .replace(/{{USER_TOPIC}}/g, topic)
            .replace(/{{slugified_user_topic}}/g, slug);

        // --- ETAPA 2: Chamar a API do Google Gemini ---
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`;
        
        console.log("Enviando prompt para o Gemini...");
        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: finalPrompt }] }]
            })
        });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.text();
            console.error("Erro na API do Gemini:", errorBody);
            throw new Error(`Erro na API do Gemini: ${geminiResponse.statusText}`);
        }
        
        const geminiData = await geminiResponse.json();

        // Extrai e limpa o texto JSON da resposta da IA.
        // A IA às vezes envolve a saída em ```json ... ```, então removemos isso.
        let generatedJsonText = geminiData.candidates[0].content.parts[0].text;
        generatedJsonText = generatedJsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        
        // Converte o texto da IA em um objeto JavaScript.
        const storyPayload = JSON.parse(generatedJsonText);
        
        console.log("JSON recebido e parseado do Gemini com sucesso.");

        // --- ETAPA 3: Chamar a API de Gestão do Storyblok para criar a Story ---
        const storyblokUrl = `https://mapi.storyblok.com/v1/spaces/${process.env.STORYBLOK_SPACE_ID}/stories/`;

        console.log("Enviando payload para a API de Gestão do Storyblok...");
        const storyblokResponse = await fetch(storyblokUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.STORYBLOK_MANAGEMENT_TOKEN
            },
            body: JSON.stringify(storyPayload)
        });

        if (!storyblokResponse.ok) {
            const errorBody = await storyblokResponse.text();
            console.error("Erro na API do Storyblok:", errorBody);
            throw new Error(`Erro na API do Storyblok: ${storyblokResponse.statusText}`);
        }

        const newStoryData = await storyblokResponse.json();
        const newStoryUrl = `/timeline/${newStoryData.story.slug}/`;

        console.log("Story criada com sucesso no Storyblok. URL:", newStoryUrl);

        // --- ETAPA 4: Retornar a URL da nova página para o frontend ---
        return response.status(200).json({ url: newStoryUrl });

    } catch (error) {
        console.error("Erro geral no handler da API:", error);
        return response.status(500).json({ message: 'Ocorreu um erro no servidor.', error: error.message });
    }
}
