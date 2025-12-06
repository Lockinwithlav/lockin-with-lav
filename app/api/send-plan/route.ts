import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Lock In With Lav" <${process.env.ETHEREAL_USER}>`,
      to: email,
      subject: "Test Email",
      text: "This is a test email from Lock In With Lav.",
      html: "<h1>This is a test email from Lock In With Lav</h1>",
    });

    console.log("Email sent: ", info.messageId);

    return NextResponse.json({ success: true, info });
  } catch (err) {
    console.error("Email error: ", err);
    return NextResponse.json({ error: "Failed to send email", details: err }, { status: 500 });
  }
}
