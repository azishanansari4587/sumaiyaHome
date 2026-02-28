import nodemailer from "nodemailer";


const sendEmail = async (to, subject, text) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });
  
      await transporter.sendMail({
        from: `"Profoelctron Solutions" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
      });
  
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  };
  
export default sendEmail;

