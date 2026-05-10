import { Router } from 'express';
import { translateText } from '../services/translateService.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and targetLanguage are required' });
    }

    const translated = await translateText(text, targetLanguage);
    res.json({ translated });
  } catch (error) {
    console.error('Translate route error:', error);
    res.status(500).json({ error: 'Failed to translate' });
  }
});

export default router;
