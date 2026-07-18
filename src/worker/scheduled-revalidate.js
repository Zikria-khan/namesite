export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/revalidate' && request.method === 'POST') {
      try {
        const authHeader = request.headers.get('x-revalidate-secret');
        const secret = env.REVALIDATE_WEBHOOK_SECRET;
        if (!secret || !authHeader || authHeader.length !== secret.length) {
          return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        let result = 0;
        for (let i = 0; i < authHeader.length; i++) {
          result |= authHeader.charCodeAt(i) ^ secret.charCodeAt(i);
        }
        if (result !== 0) {
          return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const body = await request.json().catch(() => ({}));
        const { religion, slug } = body || {};
        if (!religion || !slug) {
          return new Response(JSON.stringify({ success: false, error: 'Missing religion or slug' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app';
        const targetUrl = `${siteUrl}/names/${String(religion).toLowerCase()}/${String(slug).toLowerCase()}`;

        const purgeResponse = await fetch(targetUrl, {
          method: 'PURGE',
          headers: { 'x-purge-secret': secret },
        });

        const revalidateTag = `name:${String(religion).toLowerCase()}:${String(slug).toLowerCase()}`;
        if (typeof env !== 'undefined' && env.WORKER_SELF_REFERENCE) {
          try {
            await env.WORKER_SELF_REFERENCE.fetch(`${siteUrl}/api/revalidate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-revalidate-secret': secret,
              },
              body: JSON.stringify({ religion, slug }),
            });
          } catch {
            // best-effort
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            revalidated: true,
            religion: String(religion).toLowerCase(),
            slug: String(slug).toLowerCase(),
            timestamp: Date.now(),
            purgeStatus: purgeResponse.status,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message || 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
}
