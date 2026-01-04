import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private genAI: GoogleGenAI | null = null;
  // This is a placeholder for the API key.
  // In a real-world scenario, this should be handled securely.
  private readonly apiKey = process.env.API_KEY;

  constructor() {
    if (this.apiKey) {
      this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
    } else {
      console.error('API Key for Gemini is missing.');
    }
  }

  async generateDedication(keywords: string): Promise<string> {
    if (!this.genAI) {
      return Promise.resolve('Il servizio AI non è al momento disponibile.');
    }

    const model = 'gemini-2.5-flash';
    const prompt = `Sei un invitato a un matrimonio, eloquente e poetico. Scrivi una breve e sentita dedica per il matrimonio di Camilla e Riccardo. Basala su questi sentimenti/parole chiave di un altro invitato: "${keywords}". Mantieni un tono elegante, affettuoso e non superare le 70 parole. Scrivi in italiano.`;

    try {
      const response = await this.genAI.models.generateContent({
        model: model,
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('Error generating dedication with Gemini:', error);
      return 'Siamo spiacenti, si è verificato un errore durante la generazione della dedica. Riprova.';
    }
  }
}
