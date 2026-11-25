import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY, // Otomatis membaca dari Environment Variables Vercel
});

export default async function handler(req, res) {
  // Atur CORS agar aman diakses dari frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const message = body?.message;

    if (!message) {
      return res.status(400).json({ reply: 'Pesan tidak boleh kosong.' });
    }

    if (!process.env.AI_API_KEY) {
      return res.status(500).json({ reply: 'Error: API Key OpenAI belum disetting di Vercel!' });
    }

    // Memanggil API resmi OpenAI (ChatGPT)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Model cepat, pintar, dan murah dari OpenAI
      messages: [
        { role: "system", content: "Kamu adalah asisten AI yang ramah, asik, dan cerdas untuk aplikasi PingChatKuy." },
        { role: "user", content: message }
      ],
    });

    const reply = completion.choices[0].message.content || "Maaf, bot tidak memberikan respons.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({ reply: `Gagal dari OpenAI: ${error.message || 'Kesalahan sistem'}` });
  }
}
