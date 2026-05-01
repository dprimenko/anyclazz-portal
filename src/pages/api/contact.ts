import type { APIRoute } from 'astro';
import nodemailer, { type Transporter } from 'nodemailer';
import { buildContactEmailBody } from '@/services/email/emailLayout';

// Singleton transporter — reuses the TLS connection across requests
let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
    const mailerDsn = import.meta.env.MAILER_DSN;
    if (!mailerDsn) throw new Error('MAILER_DSN is not set');

    if (!_transporter) {
        _transporter = nodemailer.createTransport(mailerDsn, { pool: true });
    }
    return _transporter;
}

export const POST: APIRoute = async ({ request }) => {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return json({ error: 'Invalid request body' }, 400);
    }

    const { firstName, lastName, email, phone, message, privacyPolicy } = body as Record<string, string>;

    if (!firstName || !lastName || !email || !message || !privacyPolicy) {
        return json({ error: 'Missing required fields' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json({ error: 'Invalid email address' }, 400);
    }

    const emailFrom = import.meta.env.EMAIL_FROM ?? 'AnyClazz <dev@anyclazz.com>';
    const emailTo = import.meta.env.EMAIL_CONTACT_TO ?? 'info@anyclazz.com';

    try {
        const transporter = getTransporter();
        const html = buildContactEmailBody({ firstName, lastName, email, phone, message });

        const mailOptions = {
            from: emailFrom,
            to: emailTo,
            replyTo: `${firstName} ${lastName} <${email}>`,
            subject: `New contact message from ${firstName} ${lastName}`,
            html,
        };

        // Respond immediately — send in background
        void transporter.sendMail(mailOptions).catch((error) => {
            console.error('[contact] Failed to send email:', error);
        });

        return json({ success: true }, 200);
    } catch (error) {
        console.error('[contact] Failed to send email:', error);
        return json({ error: 'Failed to send message. Please try again later.' }, 500);
    }
};

function json(data: unknown, status: number) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}
