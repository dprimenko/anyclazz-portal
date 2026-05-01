const LOGO_URL = 'https://anyclazz.b-cdn.net/resources/anyclazz_logo.png';

/**
 * Wraps content in the AnyClazz transactional email layout.
 * Mirrors the EmailLayout from the email-renderer service, without the unsubscribe footer.
 */
export function buildEmailHtml(preview: string, bodyContent: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(preview)}</title>
</head>
<body style="background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;margin:0;padding:0;">
  <div style="background-color:#ffffff;border-radius:8px;margin:40px auto;max-width:600px;padding:0;overflow:hidden;">
    <!-- Logo header -->
    <div style="padding:24px 32px;background-color:#ffffff;">
      <img src="${LOGO_URL}" alt="Anyclazz" width="139" style="display:block;" />
    </div>

    <!-- Body -->
    ${bodyContent}

    <!-- Footer -->
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 32px;" />
    <div style="padding:24px 32px 32px;">
      <img src="${LOGO_URL}" alt="Anyclazz" width="104" style="display:block;margin-bottom:12px;" />
      <p style="color:#9ca3af;font-size:11px;margin:0;">© ${new Date().getFullYear()} Anyclazz, All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function buildContactEmailBody(fields: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message: string;
}): string {
    const { firstName, lastName, email, phone, message } = fields;

    const row = (label: string, value: string) =>
        `<tr>
          <td style="padding:8px 0;color:#9ca3af;font-size:14px;font-weight:600;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#535862;font-size:14px;line-height:22px;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>`;

    const body = `
    <div style="padding:8px 32px 32px;">
      <h1 style="color:#181D27;font-size:24px;font-weight:700;line-height:1.3;margin:0 0 8px;">New contact message</h1>
      <p style="color:#535862;font-size:16px;line-height:26px;margin:0 0 24px;">
        Someone filled out the contact form on <strong>anyclazz.com</strong>.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tbody>
          ${row('Name', `${firstName} ${lastName}`)}
          ${row('Email', email)}
          ${phone ? row('Phone', phone) : ''}
        </tbody>
      </table>
      <div style="background-color:#f9fafb;border-radius:8px;padding:16px 20px;">
        <p style="color:#9ca3af;font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;margin:0 0 8px;">Message</p>
        <p style="color:#535862;font-size:15px;line-height:24px;margin:0;white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
    </div>`;

    return buildEmailHtml(`New contact message from ${firstName} ${lastName}`, body);
}
