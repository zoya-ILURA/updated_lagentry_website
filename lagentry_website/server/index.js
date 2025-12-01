const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3001;

// ElevenLabs configuration
const ELEVENLABS_API_KEY = 'sk_e80154af3364e59ac77e6395da1a8d39c462a8751a205a5b';
const VOICE_ID = 'jqcCZkN6Knx8BJ5TBdYR';

app.use(cors());
app.use(express.json());

// Store active conversations
const activeConversations = new Map();

// Start voice call endpoint
app.post('/api/start-voice-call', async (req, res) => {
  try {
    const { prompt, voiceId, userName, userEmail, userPhone, agentType } = req.body;

    console.log('Starting voice call for:', userName, 'Agent type:', agentType);

    // Create conversation ID
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store conversation data
    activeConversations.set(conversationId, {
      prompt,
      voiceId: voiceId || VOICE_ID,
      userName,
      userEmail,
      userPhone,
      agentType,
      startTime: new Date(),
      messages: []
    });

    // Generate initial greeting message
    const greetingMessage = generateGreeting(agentType, userName);
    
    // Convert text to speech using ElevenLabs
    const audioBuffer = await textToSpeech(greetingMessage, voiceId || VOICE_ID);

    // In a real implementation, you would:
    // 1. Set up WebRTC connection for real-time audio
    // 2. Stream the audio to the user
    // 3. Listen for user responses
    // 4. Process speech-to-text
    // 5. Generate AI responses
    // 6. Convert responses back to speech

    res.json({
      success: true,
      conversationId,
      message: 'Voice call initiated successfully',
      greeting: greetingMessage,
      // In production, you'd return WebRTC connection details or audio stream URL
      audioUrl: `/api/audio/${conversationId}/greeting`
    });

  } catch (error) {
    console.error('Error starting voice call:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start voice call'
    });
  }
});

// Generate greeting based on agent type
function generateGreeting(agentType, userName) {
  const greetings = {
    'lead-qualification': `Hello ${userName}! I'm your AI Lead Qualification specialist from Lagentry. I'm here to understand your business needs and see how our AI automation platform can help you. How are you doing today?`,
    'customer-support': `Hi ${userName}! Welcome to our restaurant. I'm your AI customer support assistant powered by Lagentry. I can help you with reservations, menu questions, or any other inquiries. What can I assist you with today?`,
    'healthcare': `Good day ${userName}! I'm your AI healthcare receptionist from Lagentry. I'm here to help you with appointment scheduling or answer any questions about our services. How may I assist you today?`
  };

  return greetings[agentType] || `Hello ${userName}! I'm your AI assistant from Lagentry. How can I help you today?`;
}

// Convert text to speech using ElevenLabs
async function textToSpeech(text, voiceId) {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return await response.buffer();
  } catch (error) {
    console.error('Text-to-speech error:', error);
    throw error;
  }
}

// Serve audio files
app.get('/api/audio/:conversationId/:type', async (req, res) => {
  try {
    const { conversationId, type } = req.params;
    const conversation = activeConversations.get(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (type === 'greeting') {
      const greetingMessage = generateGreeting(conversation.agentType, conversation.userName);
      const audioBuffer = await textToSpeech(greetingMessage, conversation.voiceId);
      
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length
      });
      
      res.send(audioBuffer);
    } else {
      res.status(404).json({ error: 'Audio type not found' });
    }
  } catch (error) {
    console.error('Error serving audio:', error);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
});

// End conversation endpoint
app.post('/api/end-conversation/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  
  if (activeConversations.has(conversationId)) {
    activeConversations.delete(conversationId);
    res.json({ success: true, message: 'Conversation ended' });
  } else {
    res.status(404).json({ error: 'Conversation not found' });
  }
});

// WebSocket for real-time communication (for future enhancement)
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'audio_chunk') {
        // Handle incoming audio from user
        // Process speech-to-text, generate AI response, convert to speech
        // This would be implemented with real-time AI conversation logic
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Voice call API available at http://localhost:${PORT}/api/start-voice-call`);
});

module.exports = app;