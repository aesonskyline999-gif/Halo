export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: 'Pesan tidak boleh kosong.' });
    }

    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ reply: 'Error: API Key belum disetting di Vercel!' });
    }

    const apiResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Kamu adalah asisten AI yang ramah." },
          { role: "user", content: message }
        ],
        stream: false
      })
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error('DeepSeek Error Details:', data);
      return res.status(500).json({ reply: `Gagal dari DeepSeek: ${data.error?.message || 'Kesalahan sistem'}` });
    }

    const reply = data.choices?.[0]?.message?.content || "Maaf, bot tidak memberikan respons.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Serverless Exception:', error);
    return res.status(500).json({ reply: 'Terjadi kesalahan internal pada server.' });
  }
}
