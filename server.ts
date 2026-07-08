import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt, systemInstruction, modelName } = req.body;
    
    if (!ai) {
      return res.status(500).json({ 
        error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in the Secrets panel.' 
      });
    }

    const model = modelName || 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error?.message || 'An error occurred during content generation' });
  }
});

async function start() {
  const isProd = process.env.NODE_ENV === 'production';
  
  if (!isProd) {
    console.log('Running in DEVELOPMENT mode with Vite middleware');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Running in PRODUCTION mode');
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
