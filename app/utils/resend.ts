import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_SECRET);
export async function sendEmail(email: string, name: string,html:string) {
    // Send email
    console.log(process.env.RESEND_API_SECRET)
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'sandyagur@gmail.com',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });
}

sendEmail("aslamprdpd@gmail.com", "Aslam", "<h1>hello</h1>")