import nodemailer from 'nodemailer';

export type EmailOptions = {
    to: string | string[];
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
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
    });
}

export const emailService = {
    sendRenewalReminder: (to: string | string[], companyId: string, renewalDate: string) => {
        const formatted = new Date(renewalDate).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric',
        });
        return sendEmail({
            to,
            subject: 'Subscription renewal in 7 days',
            html: `
                <p>Hello,</p>
                <p>Your EnerJobs Premium subscription (company ID: <b>${companyId}</b>) is set to renew on <b>${formatted}</b>.</p>
                <p>To avoid any interruption to your service, please ensure your payment details are up to date.</p>
                <p>Thank you for being a Premium member.</p>
                <p>— The EnerJobs Team</p>
            `.trim(),
        });
    },

    sendExpiryNotification: (to: string | string[], companyId: string) =>
        sendEmail({
            to,
            subject: 'Subscription expired — downgraded to Free',
            html: `
                <p>Hello,</p>
                <p>Your EnerJobs Premium subscription (company ID: <b>${companyId}</b>) has expired and your account has been downgraded to the Free plan.</p>
                <p>You can renew your subscription at any time to regain access to Premium features.</p>
                <p>— The EnerJobs Team</p>
            `.trim(),
        }),
};
