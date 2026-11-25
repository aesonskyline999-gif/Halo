import Groq from "groq-sdk";

// Inisialisasi Groq/DeepSeek SDK menggunakan Environment Variables (AMAN)
const groq = new Groq({ 
  apiKey: process.env.AI_API_KEY 
});

export default async function handler(req, res) {
  // Hanya izinkan method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    // Panggil model AI (sesuaikan nama model, contoh menggunakan deepseek-v4.1 atau llama jika di groq)
    const completion = await groq.chat.completions.create({
      model: "deepseek-chat", // Ganti dengan "deepseek-v4.1-flash" atau "llama3-8b-8192" jika pakai Groq
      messages: [
        { 
          role: "system", 
          content: "Kamu adalah asisten AI yang ramah, asik, dan cerdas untuk aplikasi PingChatKuy." 
        },
        { 
          role: "user", 
          content: message 
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = completion.choices[0]?.message?.content || "Maaf, bot sedang tidak merespons.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Error API AI:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server AI.' });
  }
}
