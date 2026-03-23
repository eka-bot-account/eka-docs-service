/**
 * Cloudflare Worker: Contact Form Handler for docs-for-oss.com
 * 
 * Receives form submissions from the landing page and forwards them
 * to hello@stratachecks.com via email.
 */

interface Env {
  EMAIL_API_KEY: string;
}

interface ContactFormData {
  name: string;
  email: string;
  project: string;
  message: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const formData = await request.formData();
      const data: ContactFormData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        project: formData.get('project') as string,
        message: formData.get('message') as string,
      };

      // Validate required fields
      if (!data.name || !data.email || !data.message) {
        return new Response('Missing required fields', { status: 400 });
      }

      // Forward to email via Resend API
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.EMAIL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'hello@stratachecks.com',
          to: 'hello@stratachecks.com',
          subject: `Docs-for-OSS Contact: ${data.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Project:</strong> ${escapeHtml(data.project || 'Not specified')}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
          `,
          reply_to: data.email,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Email API error:', await emailResponse.text());
        return new Response('Failed to send email', { status: 500 });
      }

      // Return success with CORS headers
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Contact form error:', error);
      return new Response('Internal server error', { status: 500 });
    }
  },
};

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
