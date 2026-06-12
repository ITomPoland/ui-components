import { Resend } from 'resend';

// The RESEND_API_KEY must be set in your Vercel Environment Variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Only accept POST requests from Sanity Webhooks
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { contactEmail, title, url } = req.body;

    if (!contactEmail) {
      return res.status(400).json({ error: 'No contactEmail provided in webhook payload' });
    }

    const { data, error } = await resend.emails.send({
      // For testing without a custom domain, you can use onboarding@resend.dev
      // For production, change this to your verified domain e.g., 'ITOM UI <hello@itom-ui.com>'
      from: 'ITOM UI Showcase <onboarding@resend.dev>',
      to: [contactEmail],
      subject: `🎉 Twój projekt "${title}" został opublikowany na ITOM UI!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <h2 style="color: #000;">Gratulacje! 🚀</h2>
          <p>Cześć!</p>
          <p>Z przyjemnością informujemy, że po naszej weryfikacji, Twój projekt <strong>${title}</strong> został oficjalnie zatwierdzony i opublikowany w zakładce Showcase na naszej stronie!</p>
          <p>Zobacz go tutaj: <a href="https://itom-ui-components.vercel.app/" style="color: #0066cc; font-weight: bold;">ITOM UI Components Showcase</a></p>
          <p>Będzie nam niezmiernie miło, jeśli pochwalisz się tym na swoim LinkedInie lub X (Twitterze) i oznaczysz nasz profil!</p>
          <br/>
          <p>Pozdrawiamy,</p>
          <p><strong>Zespół ITOM UI</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return res.status(500).json({ error });
    }

    res.status(200).json({ message: 'Email sent successfully', data });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
