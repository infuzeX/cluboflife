const nodemailer = require('nodemailer');

const sendMail = async (options) => {
  console.log(options);
  //create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //Define email options
  const mailOptions = {
    from: `WayToStock <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //SEND MAIL
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
