const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use(express.static('public'));

app.post('/api/game', async (req, res) => {
  const { message, history } = req.body;

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    systemInstruction: `You are a fantasy text adventure game master. 
    Keep responses short (2-3 sentences). Describe what happens based on 
    the player's action and always end with what the player sees or can do next.`
  });

  const chat = model.startChat({ history });

  const result = await chat.sendMessage(message);
  res.json({ response: result.response.text() });
});

app.listen(3000, () => console.log('Game running on port 3000'));