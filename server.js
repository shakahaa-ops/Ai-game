const express = require('express');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json());
app.use(express.static('public'));

app.post('/api/game', async (req, res) => {
  const { message, history } = req.body;

  const messages = [
    { role: 'system', content: `You are a fantasy text adventure game master. 
    Keep responses short (2-3 sentences). Describe what happens based on 
    the player's action and always end with what the player sees or can do next.` },
    ...history,
    { role: 'user', content: message }
  ];

  const result = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages
  });

  res.json({ response: result.choices[0].message.content });
});

app.listen(3000, () => console.log('Game running on port 3000'));