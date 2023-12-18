import {Resend} from "resend";
import dotenv from "dotenv";
const resend = new Resend(process.env.RESEND_API_SECRET);
export async function sendEmail(email: string, name: string,html:string) {
    // Send email
    resend.emails.send({
        from: 'info@aegis.org',
        to: email,
        subject: `Welcome to Aegis! ${name}`,
        html: html
      });
}