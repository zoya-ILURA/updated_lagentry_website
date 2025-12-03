# Lagentry Voice Server

Backend server for handling voice calls with ElevenLabs integration.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on port 3001.

## Features

- **Voice Call Initiation**: `/api/start-voice-call` - Starts a voice conversation with AI agents
- **Audio Generation**: Uses ElevenLabs API to convert text to natural speech
- **Agent Prompts**: Pre-configured prompts for different agent types (Lead Qualification, Customer Support, Healthcare)
- **Real-time Audio**: Serves generated audio files for immediate playback

## API Endpoints

### POST `/api/start-voice-call`
Initiates a voice call with an AI agent.

**Request Body:**
```json
{
  "prompt": "Agent conversation prompt",
  "voiceId": "ElevenLabs voice ID",
  "userName": "User's name",
  "userEmail": "user@example.com",
  "userPhone": "+1234567890",
  "agentType": "lead-qualification"
}
```

**Response:**
```json
{
  "success": true,
  "conversationId": "conv_123456789",
  "message": "Voice call initiated successfully",
  "greeting": "Hello John! I'm your AI assistant...",
  "audioUrl": "/api/audio/conv_123456789/greeting"
}
```

### GET `/api/audio/:conversationId/:type`
Serves generated audio files.

## Configuration

The server uses the following ElevenLabs configuration:
- **API Key**: `sk_e80154af3364e59ac77e6395da1a8d39c462a8751a205a5b`
- **Voice ID**: `jqcCZkN6Knx8BJ5TBdYR`

## Agent Types

1. **Lead Qualification** (`lead-qualification`)
   - Qualifies potential customers
   - Understands business needs
   - Recommends Lagentry solutions

2. **Customer Support** (`customer-support`)
   - Restaurant customer service
   - Handles reservations and inquiries
   - Demonstrates natural conversation

3. **Healthcare** (`healthcare`)
   - Healthcare receptionist
   - Appointment scheduling
   - Professional medical communication

## Running with Frontend

To run both frontend and backend together:
```bash
npm run dev
```

This will start:
- React frontend on port 3000
- Express backend on port 3001



