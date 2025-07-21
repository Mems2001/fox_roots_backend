const nodemailer = require('nodemailer');

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
      user: 'mems2001code@gmail.com',         // Your Gmail address
      pass: 'firj begm fczp zucj',       // App password from Google
    },
  });

  // Send the email
  const info = await transporter.sendMail({
    from: 'mems2001code@gmail.com', 
    to: receiverEmail,                 
    subject: 'Email verification token',  
    text: 'This is the plain text body',        
    html: `<b>This your link for email verification:</b> <a href='http://localhost:8000/api/v1/auth/verify-email/${token}'>Verify</a>`,      
  });

  console.log('Message sent:', info.messageId);
}

module.exports = {
    sendTestEmail,
    sendEmail
}