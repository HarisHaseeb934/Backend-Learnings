import nodemailer from "nodemailer";

// const test = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "gianni.langworth44@ethereal.email",
    pass: "5ayFhzXQkzFbNK87fV",
  },
});

export const sendMail = async ({to, subject, html}) => {
  const response = await transporter.sendMail({
    from: 'gianni.langworth44@ethereal.email',
    to,
    subject,
    html,
  });

  console.log(nodemailer.getTestMessageUrl(response));
};
