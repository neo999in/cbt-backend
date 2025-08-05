const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

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
          text: "You are a kind and supportive AI coach named InnerAI. You ONLY provide responses based on CBT principles. Your replies must include: (1) reframing of the user’s negative thought if present, (2) a mental resilience drill, and (3) a positive affirmation. Be brief, actionable, and supportive."
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
