import { NewsArticle } from './news';

export interface SummarizedStory {
  headline: string;
  summary: string;
  key_points: string[];
  entities: string[];
  category: string;
  original_article_id: string;
}

export interface BriefingGenerationResult {
  stories: SummarizedStory[];
  briefing_script: string;
}

export class LLMProvider {
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor() {
    this.baseUrl = process.env.SCALERMAX_BASE_URL || 'https://api.scalermax.com/v1';
    this.apiKey = process.env.SCALERMAX_API_KEY || '';
    this.model = process.env.SCALERMAX_MODEL || 'gpt-4o-mini'; // fallback to standard naming if needed
  }

  async generateBriefing(articles: NewsArticle[], lengthPreference: 'quick' | 'standard' | 'deep'): Promise<BriefingGenerationResult> {
    if (!this.apiKey) {
      throw new Error('ScalerMax API key is not configured.');
    }

    // Limit articles depending on preference to save tokens and fit the context
    let maxArticles = 10;
    if (lengthPreference === 'quick') maxArticles = 5;
    if (lengthPreference === 'deep') maxArticles = 15;

    const selectedArticles = articles.slice(0, maxArticles);

    const systemPrompt = `You are a professional news editor. You are given a list of raw news articles.
Your task is to summarize them and generate a cohesive audio briefing script.
The briefing should sound like a premium daily news podcast.
Output valid JSON only with the following schema:
{
  "stories": [
    {
      "original_article_id": "string",
      "headline": "string",
      "summary": "string",
      "key_points": ["string"],
      "entities": ["string"],
      "category": "string"
    }
  ],
  "briefing_script": "string"
}`;

    const userPrompt = `Here are the articles:
${JSON.stringify(selectedArticles.map(a => ({
  id: a.id,
  title: a.title,
  content: a.content || a.description,
  category: a.category
})), null, 2)}`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ScalerMax error:', errorText);
        throw new Error(`LLM provider returned ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      // Clean markdown formatting if present
      if (content.startsWith('```json')) {
        content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (content.startsWith('```')) {
        content = content.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      
      const parsed = JSON.parse(content) as BriefingGenerationResult;
      return parsed;
    } catch (error) {
      console.error('LLMProvider error:', error);
      throw new Error('Failed to generate summaries from ScalerMax');
    }
  }
}
