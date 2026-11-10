import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendMail = async({to, subject, html}) => {
    const {data, error} = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [to],
        subject,
        html
    })
    if(error){
        return console.log(error)
    }

    console.log(data)
}