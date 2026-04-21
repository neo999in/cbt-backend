# Saathi Backend 

<br><a href="https://github.com/neo999in/Saathi"><img src="https://img.shields.io/badge/Main_App-Repository-1FBCFD?logo=flutter&logoColor=00CCFF" width="250" align="center"></a><br><br>

This is a secure Node.js proxy server designed to handle sensitive AI processing for the **Saathi** mental wellness application. It acts as a secure bridge between the frontend application and Google Gemini.

## 🛠 Features

  - 🔒 **Secure API Proxy**: Keeps Gemini API keys hidden and protected from the client side.
  - 🧠 **AI Mental Wellness Companion**: Multilingual, empathetic chat support customized for young adults.
  - 🔄 **CBT Reframing Engine**: Instantly generates positive cognitive behavioral reframes based on user emotions and limiting beliefs.
  - 📖 **Therapeutic Storytelling**: Creates personalized, calming metaphors and stories to aid in emotional processing.
  - 🚀 **Fast & Lightweight**: Built with Express.js for rapid response times and integrated with Gemini 2.5 Flash Lite.

## 🚀 Getting Started

### 1\. Install Dependencies

```bash
npm install
```

### 2\. Environment Variables

Create a `.env` file in the root directory and add your Google Gemini API key:

```env
PORT=10000
GEMINI_API_KEY=your_api_key_here
```

### 3\. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### `POST /api/chat`

Acts as an empathetic mental wellness companion, responding securely in the user's preferred language.

  - **Body**: `application/json`
  - **Field**: `messages` (array of chat history objects), `language` (string, defaults to 'en')
  - **Response**: JSON object containing the AI's `reply`.

### `POST /api/reframe`

Generates a short, positive CBT reframe to help users shift negative thinking patterns.

  - **Body**: `application/json`
  - **Field**: `emotion` (string), `belief` (string)
  - **Response**: JSON object containing the `reframe` text.

### `POST /api/story`

Extracts emotional context to generate a short, calming story or metaphor reflecting resilience and growth.

  - **Body**: `application/json`
  - **Field**: `emotion` (string), `belief` (string)
  - **Response**: JSON object containing the `story` text.
