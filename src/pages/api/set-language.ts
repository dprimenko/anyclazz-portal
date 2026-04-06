import type { APIRoute } from 'astro';
import { setLangInAstro } from '@/i18n';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const body = await request.json();
    const { lang } = body;

    // Validar que el idioma sea válido
    if (!lang || (lang !== 'en' && lang !== 'es')) {
      return new Response(JSON.stringify({ error: 'Invalid language' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Establecer la cookie en el servidor
    setLangInAstro(cookies, lang);
    console.log(`🌍 Language set to: ${lang}`);

    return new Response(JSON.stringify({ success: true, lang }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error setting language:', error);
    return new Response(JSON.stringify({ error: 'Failed to set language' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
