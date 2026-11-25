import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY, // Masukkan API Key lengkap (sk-a6...) di Vercel
  baseURL: 'https://api.301.tv/v1', // Wajib diarahkan ke server ini
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ reply: 'Method not allowed' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const message = body?.message;
    if (!message) return res.status(400).json({ reply: 'Pesan tidak boleh kosong.' });

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4-mini", // Harus sesuai nama model yang ada di daftar JSON tadi
      messages: [
        { role: "system", content: "Kamu adalah asisten AI yang ramah untuk PingChatKuy." },
        { role: "user", content: message }
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || "Maaf, bot tidak memberikan respons.";
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ reply: `Error: ${error.message}` });
  }
}
