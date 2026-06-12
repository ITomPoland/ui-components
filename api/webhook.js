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
      subject: `🎉 Your project "${title}" is now live on ITOM UI!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <h2 style="color: #000;">Congratulations! 🚀</h2>
          <p>Hi there,</p>
          <p>We are thrilled to let you know that after reviewing your submission, <strong>${title}</strong> has been officially approved and published in the Showcase section of our website!</p>
          <p>Check it out here: <a href="https://itom-ui-components.vercel.app/" style="color: #0066cc; font-weight: bold;">ITOM UI Components Showcase</a></p>
          <p>We would absolutely love it if you shared this milestone on LinkedIn or X (Twitter) and tagged our profile!</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>The ITOM UI Team</strong></p>
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
