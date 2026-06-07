import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL, // Đặt email của bạn vào biến môi trường này
      pass: process.env.SMTP_PASSWORD, // Đặt mật khẩu ứng dụng Gmail vào biến này
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `"MoRa Tea" <${process.env.SMTP_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body fallback
    html: options.html, // html body
  };

  // 3. Send email with nodemailer
  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
