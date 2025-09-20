import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- AI Chat Endpoint --------------------
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, language = 'en' } = req.body; // default to English

    console.log("Language received:", language);

    // Build chat history with strict language instruction
    const chatHistory = [
      {
        role: 'user',
        parts: [
          {
            text: `
You are a kind and supportive AI coach named InnerAI.

Always respond ONLY in ${language} language.

If the user sends a message in another language, translate and respond ONLY in ${language}.

Your task:
1. ONLY give CBT-based responses.
2. Each response MUST include these three sections:
   - Reframe of the user's negative thought.
   - A mental resilience drill.
   - A positive affirmation.
3. DO NOT use asterisks, markdown, or special symbols for emphasis.
4. Use clear, plain, friendly language in sentence form.

Important: NEVER reply in any other language except ${language}.
`
          }
        ]
      },
      ...messages
    ];

    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: chatHistory },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No reply generated.';

    res.json({ reply });
  } catch (err) {
    console.error("AI Chat Error:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get InnerAI response.' });
  }
});
// -------------------- Reframe Generator Endpoint --------------------
app.post('/api/reframe', async (req, res) => {
  const { emotion, belief } = req.body;

  if (!emotion || !belief) {
    return res.status(400).json({ error: 'Emotion and belief are required.' });
  }

  const prompt = `
You are a CBT-based AI coach.

The user feels "${emotion}" because they believe: "${belief}".

Your task:
- Provide ONLY one short, positive reframe of the belief.
- The reframe must be clear, encouraging, and easy to remember.
- Do NOT include drills, affirmations, or extra text.
- Keep it under 25 words.
- No emojis or decorative symbols.
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ role: 'user', parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const reframe = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'No reframe available';
    res.json({ reframe });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate reframe.' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// --------------------Story Generator Endpoint --------------------

app.post('/api/story', async (req, res) => {
  const { challenge } = req.body;

  if (!challenge) {
    return res.status(400).json({ error: 'Challenge description is required.' });
  }

  const prompt = `
You are a supportive AI therapist who uses storytelling to help people reflect on their challenges.

The user has shared this challenge: "${challenge}".

Your task:
- Create a short, calming story or metaphor about resilience and growth.
- The story should help the user feel understood and empowered.
- Keep the story under 150 words.
- Do not use emojis or decorative symbols.
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          { role: 'user', parts: [{ text: prompt }] }
        ]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const story = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'No story generated';
    res.json({ story });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate story.' });
  }
});

