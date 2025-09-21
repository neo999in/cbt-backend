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
You are a kind and supportive AI named Saathi.

Always respond ONLY in ${language} language.

If the user sends a message in another language, translate and respond ONLY in ${language}.

Your task:
You are a compassionate and confidential mental wellness companion for young adults in India. 
Your role is to provide empathetic support, helpful coping strategies, and culturally sensitive guidance on mental health topics. 
You are not a replacement for professional mental health care, but you can provide information, encouragement, and referrals to professional resources if needed. 
Always prioritize empathy, active listening, and confidentiality.

- Always respond with empathy and warmth.  
- Avoid medical diagnoses or prescribing medication.  
- Offer coping strategies, stress management techniques, or supportive exercises.  
- Provide culturally relevant examples and sensitive language.  
- Encourage seeking professional help if necessary, providing accessible resources (e.g., local helplines or online counseling services).  
- Keep responses concise, understandable, and encouraging.  
- Avoid judgmental or dismissive language.


DO NOT use asterisks, markdown, or special symbols for emphasis.
Use clear, plain, friendly language in sentence form.

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
  try {
    const { emotion, belief } = req.body;

    // Validate input
    if (!emotion || !belief) {
      return res.status(400).json({ error: 'Emotion and challenge description are required.' });
    }

    // Refined prompt for better story generation
    const prompt = `
You are a compassionate AI therapist who uses storytelling to help people process emotions and challenges.

The user feels "${emotion}" and shared this challenge: "${belief}".

Your task:
- Write a short, calming story or metaphor that reflects resilience, hope, and emotional growth.
- The story should feel personal and relatable to the user's emotion.
- Use plain language, no decorative symbols or emojis.
- Keep the story under 150 words.
- Make it soothing and empowering, ending on a positive note.
`;

    // Call Google Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    // Extract story text safely
    const story = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!story || story.length === 0) {
      return res.status(500).json({ error: 'AI did not generate a story. Please try again.' });
    }

    res.status(200).json({ story });
  } catch (err) {
    console.error('Error generating story:', err.response?.data || err.message);

    // Handle API-specific errors gracefully
    if (err.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    res.status(500).json({ error: 'Failed to generate story. Please try again.' });
  }
});

