# CBT AI Backend

This is a secure backend to interact with the Gemini Pro model for CBT-based AI coaching.

## 🔧 Setup

```bash
git clone https://github.com/yourusername/cbt-backend.git
cd cbt-backend
npm install
```

Create a `.env` file:
```
GEMINI_API_KEY=your_key_here
```

## 🚀 Run Locally

```bash
npm start
```

## 🌐 API Endpoint

**POST** `/api/chat`

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "parts": [ { "text": "Hi, I feel anxious." } ] }
  ]
}
```

**Response:**
```json
{
  "reply": "I'm here for you. Let's reframe..."
}
```
