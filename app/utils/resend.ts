import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_SECRET);
export async function sendEmail(email: string, name: string) {
    // Send email
    await resend.emails.send({
      from: 'support@aiaegis.org',
      to: email,
      subject: 'Welcome to Aegis AI',
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome Email</title>
      </head>
      <body style="background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <table width="600" border="0" cellpadding="0" cellspacing="0" align="center" class="email-container" style="background: #ffffff; margin: auto; padding-bottom: 30px;">
              <tr>
                  <td style="background: url('https://i.ibb.co/Z14PzWq/bg-image.png'), rgb(25, 29, 54); background-size: auto; background-position: center; color: white; padding: 20px; text-align: left; padding-left: 5%;">
                      <img src="https://app.aiaegis.org/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcirclelogo.ff1e8937.png&w=256&q=75" alt="Aegis AI Logo" width="50" height="50" style="display: block;">
                      <h1>Welcome to Aegis AI</h1>
                      <p>Thanks for signing up</p>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 7px 5%;">
                      <p>Hey</p>
                      <p>We're glad to have you onboard! You're on your way to making the best trading decisions using our top-tier AI powered tool.</p>
                      <p>If there's anything you need, we'll be here for every step of the way.</p>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 7px 5%;">
                      <p><a href="https://twitter.com/aegisaisecurity" style="color: #2563EB;">Follow us on X</a></p>
                      <p>Stay up-to-date with our latest announcements and updates.</p>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 7px 5%;">
                      <p>Thanks for signing up. If you have any questions, send us a message at <a href="mailto:info@aiaegis.org" style="color: #2563EB;">info@aegisiai.org</a> or on <a href="https://t.me/AegisAiSecurity" style="color: #2563EB;">Telegram</a>. We'd love to hear from you.</p>
                      <p>- The team</p>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 7px 5%;">
                      <a href="https://app.aiaegis.org" class="button" style="background-color: #0E76FD; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Get started</a>
                  </td>
              </tr>
          </table>
      </body>
      </html>`
    });
}
