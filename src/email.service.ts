import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.CORREO_GMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
      },
    });
  }

  async sendInvoice(to: string, subject: string, text: string, attachmentPath: string) {
    const mailOptions = {
      from: `${process.env.NOMBRE_REMITENTE} <${process.env.CORREO_GMAIL}>`,
      to,
      subject,
      text,
      attachments: [
        {
          filename: 'factura.pdf',
          path: attachmentPath,
          contentType: 'application/pdf',
        },
      ],
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Correo enviado:', result);
      return result;
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error;
    }
  }
}
