export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string | null;
  source: string;
  url: string;
  image_url: string | null;
  published_at: string;
  category: string;
}

export class NewsProvider {
  private apiKey: string;
  private baseUrl = 'https://eventregistry.org/api/v1'; // NewsAPI.ai (EventRegistry)

  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || '';
  }

  async fetchTopNewsByCategories(categories: string[]): Promise<NewsArticle[]> {
    if (!this.apiKey) {
      throw new Error('NewsAPI.ai key is not configured.');
    }

    try {
      // NewsAPI.ai uses category URIs or keywords. For simplicity, we search by concept/keyword
      const articles: NewsArticle[] = [];

      for (const category of categories) {
        // Simple search query using NewsAPI.ai article endpoint
        const response = await fetch(`${this.baseUrl}/article/getArticles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keyword: category,
            keywordOper: 'or',
            lang: 'eng',
            articlesPage: 1,
            articlesCount: 5,
            articlesSortBy: 'date',
            apiKey: this.apiKey,
          }),
        });

        if (!response.ok) {
          console.error(`NewsAPI.ai returned ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        if (data.articles && data.articles.results) {
          const results = data.articles.results.map((article: { uri?: string, title: string, body?: string, source?: { title: string }, url: string, image?: string, dateTimePub?: string }) => ({
            id: article.uri || crypto.randomUUID(),
            title: article.title,
            description: article.body?.substring(0, 200) || '', // They often don't provide summary, use body start
            content: article.body || null,
            source: article.source?.title || 'Unknown Source',
            url: article.url,
            image_url: article.image || null,
            published_at: article.dateTimePub || new Date().toISOString(),
            category: category,
          }));
          articles.push(...results);
        }
      }

      // De-duplicate and sort by date
      const uniqueArticles = Array.from(new Map(articles.map(a => [a.title, a])).values());
      return uniqueArticles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    } catch (error) {
      console.error('NewsProvider error:', error);
      throw new Error('Failed to fetch news from NewsAPI.ai');
    }
  }
}
