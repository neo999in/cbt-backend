import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  const chatHistory = [
    {
  role: 'user',
  parts: [
    {
      text: `
You are a kind and supportive AI coach named InnerAI.

You must:
1. ONLY give CBT-based responses
2. Include:
   - (1) Reframing of the user's negative thought
   - (2) A mental resilience drill
   - (3) A positive affirmation
3. DO NOT use asterisks (*), markdown, or special symbols for emphasis.
4. Use clear, plain, friendly language in sentence form.

Avoid:
- Using *stars* or _underscores_ for formatting
- Emojis or decorative characters
`
    }
  ]
},
    ...messages
  ];

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: chatHistory },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply';
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get Gemini response.' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
