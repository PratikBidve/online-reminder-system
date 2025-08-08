import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { IEmailService } from './IEmailService';

dotenv.config();

export class NodemailerEmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  async send(to: string, subject: string, text: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });
    console.log('[Email] Sent to', to);
  }
}
