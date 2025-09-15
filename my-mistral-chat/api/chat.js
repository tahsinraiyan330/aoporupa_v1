// api/chat.js - Your Serverless Function
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    // Call the Mistral API (This is the secure part!)
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}` // Vercel safely injects your key here
      },
      body: JSON.stringify({
        model: 'mistral-tiny', // You can change this to 'mistral-small' or 'mistral-medium' later
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'No response generated';

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error in Mistral API call:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}