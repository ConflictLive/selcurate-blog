import type { APIRoute } from 'astro';

export const prerender = false;

const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', '10minutemail.com', 'yopmail.com',
  'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'dispostable.com', 'trashmail.com', 'fakeinbox.com',
  'temp-mail.org', 'tempail.com', 'mohmal.com',
];

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString()?.trim()?.toLowerCase();

    // Basic validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers,
      });
    }

    // Block disposable email domains
    const domain = email.split('@')[1];
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      return new Response(JSON.stringify({ error: 'Please use a permanent email' }), {
        status: 400,
        headers,
      });
    }

    // Honeypot field — bots fill this, humans don't see it
    const honeypot = formData.get('website');
    if (honeypot) {
      // Bot detected — return fake success
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers,
      });
    }

    // Forward to Buttondown
    const apiKey = import.meta.env.BUTTONDOWN_API_KEY;
    if (!apiKey) {
      console.error('BUTTONDOWN_API_KEY not set');
      return new Response(JSON.stringify({ error: 'Newsletter service unavailable' }), {
        status: 500,
        headers,
      });
    }

    const res = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, type: 'regular' }),
    });

    if (res.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers,
      });
    }

    // Buttondown returns 400 for duplicate emails — treat as success
    if (res.status === 400) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers,
      });
    }

    return new Response(JSON.stringify({ error: 'Please try again later' }), {
      status: 500,
      headers,
    });
  } catch (err) {
    console.error('Subscribe error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers,
    });
  }
};
