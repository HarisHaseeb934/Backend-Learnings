import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });
    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
