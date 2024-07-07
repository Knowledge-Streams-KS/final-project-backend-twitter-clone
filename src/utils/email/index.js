import nodemailer from "nodemailer";

const sendEmail = (token) => {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    secure: false, // use SSL
    auth: {
      user: process.env.DEMO_USER,
      pass: process.env.DEMO_PASS,
    },
  });

  // Configure the mailoptions object
  const mailOptions = {
    from: process.env.DEMO_EMAIL,
    to: process.env.DEV_EMAIL,
    subject: "Token not found",
    text: `${token} not found in database , need to take immediate action`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error.message);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};

export default sendEmail;
