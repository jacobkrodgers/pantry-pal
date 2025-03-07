import nodemailer from "nodemailer";

// Configure email sender
const transporter = nodemailer.createTransport({
    service: "Gmail", // Change this based on your email provider
    auth: {
        user: process.env.EMAIL_USER, // Use environment variables for security
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends an email.
 * @param to - Recipient email
 * @param subject - Email subject
 * @param text - Email body
 */
export async function sendEmail(to: string, subject: string, text: string) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        console.log("Email sent to:", to);
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}
