const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

async function sendTestEmail(receiverEmail) {
  // 1. Create a test account
  const testAccount = await nodemailer.createTestAccount();

  // 2. Create a transporter using the test SMTP account
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass  // generated ethereal password
    }
  });

  // 3. Send a test email
  const info = await transporter.sendMail({
    from: '"Test App 👻" <test@example.com>',
    to: receiverEmail,
    subject: 'Hello from Ethereal',
    text: 'This is a test email using Ethereal!',
    html: '<b>This is a test email using Ethereal!</b>',
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

async function sendEmail(receiverEmail, token){
     // Set up transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILER_EMAIL,         // Your Gmail address
      pass: process.env.MAILER_PASS,       // App password from Google
    },
  });

  // Send the email
  const info = await transporter.sendMail({
    from: process.env.MAILER_EMAIL, 
    to: receiverEmail,                 
    subject: 'Email verification token',  
    text: 'This is the plain text body',        
    html: `
    <!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Verifica tu correo</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #ffffff;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 420px;
        margin: 40px auto;
        padding: 30px 20px;
        text-align: center;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
      }
      h1 {
        font-size: 22px;
        color: #000000;
        margin-bottom: 15px;
      }
      p {
        font-size: 15px;
        color: rgb(128, 128, 128);
        margin-bottom: 25px;
      }
      .btn {
        display: inline-block;
        background-color: #000000;
        color: #ffffff;
        text-decoration: none;
        padding: 12px 24px;
        font-size: 16px;
        border-radius: 6px;
        margin-top: 10px;
      }
      .highlight {
        color: red;
        font-weight: bold;
      }
      .footer {
        font-size: 12px;
        color: rgb(128, 128, 128);
        margin-top: 30px;
      }
      a.link {
        color: blue;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Verifica tu correo electrónico</h1>
      <p>
        Gracias por unirte a <span class="highlight">Fox Roots</span>.<br />
        Para completar tu registro, haz clic en el botón a continuación.
      </p>
      <a href='https://fox-roots-backend-exq8.onrender.com/api/v1/auth/verify-email/${token}' class="btn">Verificar cuenta</a>
      <p class="footer">
        Si no solicitaste esta verificación, puedes ignorar este correo o
        <a href='http://localhost:4200' class="link">contactar soporte</a>.
      </p>
    </div>
  </body>
</html>
    `,      
  });

  console.log('Message sent:', info.messageId);
}

module.exports = {
    sendTestEmail,
    sendEmail
}