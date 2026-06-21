import nodemailer from 'nodemailer';

export type EmailOptions = {
    to: string;
    subject: string;
    html: string;
};

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

async function sendEmail(options: EmailOptions): Promise<void> {
    const transporter = createTransporter();
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
}

export const emailService = {
    sendRenewalReminder: (to: string, companyId: string, renewalDate: string) =>
        sendEmail({
            to,
            subject: 'Your subscription is renewing soon',
            html: `<p>Hello,</p><p>Your subscription (company: <b>${companyId}</b>) will renew on <b>${renewalDate}</b>.</p><p>Thank you for being with us.</p>`,
        }),

    sendExpiryNotification: (to: string, companyId: string) =>
        sendEmail({
            to,
            subject: 'Your subscription has expired',
            html: `<p>Hello,</p><p>Your subscription (company: <b>${companyId}</b>) has expired. Please renew to continue using our services.</p>`,
        }),
};
