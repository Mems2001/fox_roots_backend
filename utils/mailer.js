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

/**
 * Sends an email with a verification link.
 * @param {*} receiverEmail The email address where to send the email.
 * @param {*} token A token for verification.
 * @param {*} user_id  UUID like string for user id.
 * @param {integer} type The type of verification requested being: 0 -> password reset, 1-> email verification, 2 -> phone verification.
 */
async function sendEmail(receiverEmail, token, user_id, type){
  let typeAlt
  let subject
  let title
  let p1
  let p2
  switch (type) {
    case 0:
      typeAlt = 'password-reset'
      subject = 'Password reset token'
      title = 'Cambia tu contraseña'
      p1 = 'Gracias por ser parte de'
      p2 = 'Para cambiar tu contraseña'
      break
    case 1: 
      typeAlt = 'verify-email'
      subject =  'Email verification token'
      title = 'Verifica tu correo electrónico'
      p1 = 'Gracias por unirte a'
      p2 = 'Para completar tu registro'
      break
    case 2:
      typeAlt = ''
  }

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
    subject: `${subject}`,  
    text: 'This is the plain text body',        
    html: `
    <!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
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
      <h1>${title}</h1>
      <p>
        ${p1} <span class="highlight">Fox Roots</span>.<br />
        ${p2} haz clic en el botón a continuación.
      </p>
      <a href='${process.env.NODE_ENV === 'development'? 'http://localhost:8000' : 'https://fox-roots-backend-exq8.onrender.com'}/api/v1/auth/${typeAlt}/${token}/${user_id}' class="btn">${title}</a>
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