import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">Name:</strong>
            <span style="margin-left: 10px; color: #333;">${name}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">Email:</strong>
            <a href="mailto:${email}" style="margin-left: 10px; color: #4F46E5; text-decoration: none;">${email}</a>
          </div>
          
          ${phone ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">Phone:</strong>
            <a href="tel:${phone}" style="margin-left: 10px; color: #4F46E5; text-decoration: none;">${phone}</a>
          </div>
          ` : ''}
          
          ${subject ? `
          <div style="margin-bottom: 15px;">
            <strong style="color: #555;">Service:</strong>
            <span style="margin-left: 10px; color: #333;">${subject.replace(/-/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase())}</span>
          </div>
          ` : ''}
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #555;">Message:</strong>
            <div style="margin-top: 10px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #4F46E5; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This message was sent from your portfolio contact form on ${new Date().toLocaleString()}.</p>
            <p>You can reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `Portfolio Contact: ${subject ? subject.replace(/-/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase()) + ' - ' : ''}${name}`,
      text: `
From: ${name} <${email}>
${phone ? `Phone: ${phone}` : ''}
${subject ? `Service: ${subject.replace(/-/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase())}` : ''}

Message:
${message}

---
Sent from portfolio contact form on ${new Date().toLocaleString()}
      `,
      html: htmlContent,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    
    if (err instanceof Error) {
      if (err.message.includes('authentication') || err.message.includes('auth')) {
        return NextResponse.json(
          { success: false, error: "Email configuration error. Please contact support." },
          { status: 500 }
        );
      }
      if (err.message.includes('network') || err.message.includes('timeout')) {
        return NextResponse.json(
          { success: false, error: "Network error. Please try again later." },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}