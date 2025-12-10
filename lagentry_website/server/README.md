# Lagentry Backend Server

Express.js backend server for Lagentry voice call features.

## Local Development

```bash
npm install
npm start
# or
npm run dev  # with nodemon for auto-reload
```

Server runs on `http://localhost:5001`

## Environment Variables

Set these in your hosting platform (Vercel, Railway, etc.):

- `VAPI_API_KEY` - VAPI private API key
- `VAPI_PUBLIC_KEY` - VAPI public API key  
- `VAPI_BASE_URL` - VAPI API base URL (default: https://api.vapi.ai)
- `VAPI_PHONE_NUMBER_ID` - VAPI phone number ID
- `ELEVENLABS_API_KEY` - ElevenLabs API key
- `PORT` - Server port (optional, defaults to 5001)
- `FRONTEND_URL` - Frontend URL for CORS (optional)
- `NETLIFY_URL` - Netlify URL for CORS (optional)

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/start-voice-call` - Start a voice call with VAPI
- `POST /api/update-agent-prompt` - Update agent prompt
- `POST /api/end-conversation/:conversationId` - End a conversation

## Deployment

See `../BACKEND_DEPLOYMENT.md` for detailed deployment instructions.

### Quick Deploy to Vercel

```bash
cd server
vercel
```

Make sure to set all environment variables in Vercel dashboard.
