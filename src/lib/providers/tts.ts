export class TTSProvider {
  private apiKey: string;
  private baseUrl = 'https://api.fish.audio/v1/tts';

  constructor() {
    this.apiKey = process.env.FISH_AUDIO_API_KEY || '';
  }

  async generateAudio(text: string): Promise<ArrayBuffer> {
    if (!this.apiKey) {
      throw new Error('Fish Audio API key is not configured.');
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'model': 's2.1-pro-free'
        },
        body: JSON.stringify({
          text,
          format: 'mp3'
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('Fish Audio error:', err);
        throw new Error(`TTS provider returned ${response.status}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('TTSProvider error:', error);
      throw new Error('Failed to generate audio from Fish Audio');
    }
  }
}
