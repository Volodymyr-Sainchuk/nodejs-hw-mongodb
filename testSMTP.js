import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testSMTP() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // для порту 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // <--- дозволяє self-signed сертифікати
    },
  });

  try {
    // перевірка з’єднання
    await transporter.verify();
    console.log('SMTP connection is OK');

    // відправка тестового листа
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'твій_емейл@example.com', // сюди можна вставити свій email
      subject: 'Test email from Node.js',
      text: 'Якщо ти бачиш цей лист, SMTP працює!',
    });

    console.log('Test email sent successfully');
  } catch (err) {
    console.error('SMTP error:', err);
  }
}

testSMTP();
