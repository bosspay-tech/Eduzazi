import crypto from 'crypto';

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const brandName = "EDUCAZIONE STUDY ABROAD PRIVATE LIMITED";
  const frontendUrl = process.env.NEXTAUTH_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
  const verifyLink = `${frontendUrl}/verify-email?token=${token}`;

  const subject = `Verify your email address - ${brandName}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
          }
        }
      </style>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9FF; margin: 0; padding: 0; color: #475569;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9FF; padding: 40px 0; min-height: 100%;">
        <tr>
          <td align="center" valign="top">
            <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #DDD6FE; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.05);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%); padding: 40px 20px;">
                  <h1 style="color: #FFFFFF; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Verify Your Email</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 40px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: left;">
                  <p style="font-size: 18px; font-weight: 600; color: #0F172A; margin-top: 0; margin-bottom: 12px;">Hi ${name || 'there'},</p>
                  <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 32px;">
                    Thanks for creating an account with us. Please verify your email address to activate your account and explore our high-quality solutions.
                  </p>
                  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 8px; font-weight: 600; text-align: center; color: #0F172A;">
                    Your Verification OTP Code:
                  </p>
                  <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; text-align: center; background: #F3E8FF; padding: 16px; border-radius: 12px; color: #7C3AED; margin: 24px auto; border: 1px dashed #7C3AED; max-width: 200px;">
                    ${token}
                  </div>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                    <tr>
                      <td align="center">
                        <a href="${verifyLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%); color: #FFFFFF !important; font-weight: 600; font-size: 16px; padding: 14px 32px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);">Verify Email Address</a>
                      </td>
                    </tr>
                  </table>
                  <p style="font-size: 14px; line-height: 1.6; color: #64748B; margin-bottom: 8px;">
                    If you have trouble clicking the button, copy and paste the link below into your web browser:
                  </p>
                  <div style="font-size: 14px; color: #7C3AED; background: #F3E8FF; padding: 16px; border-radius: 8px; word-break: break-all; margin-bottom: 32px;">
                    <a href="${verifyLink}" target="_blank" style="color: #7C3AED; text-decoration: none; word-break: break-all;">${verifyLink}</a>
                  </div>
                  <div style="height: 1px; background-color: #DDD6FE; margin-bottom: 24px;"></div>
                  <p style="font-size: 12px; color: #64748B; margin: 0; line-height: 1.5;">
                    This code is valid for 24 hours. If you did not request this email, you can safely ignore it.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 30px; background: #F3E8FF; border-top: 1px solid #DDD6FE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #64748B;">
                  <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
                  <p style="margin: 0;">Support Office: <a href="mailto:support@educazi.com" style="color: #7C3AED; text-decoration: none;">support@educazi.com</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL;
  if (!senderEmail) {
    throw new Error("SENDER_EMAIL is not set in environment variables");
  }
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set in environment variables");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: brandName,
        email: senderEmail,
      },
      to: [{ email, name }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Brevo API Error details:', errorData);
    throw new Error(errorData?.message || `Failed to send email: ${response.statusText}`);
  }

  return response;
}

export async function sendContactEmailToOwner(name: string, email: string, subject: string, message: string) {
  const brandName = "EDUCAZIONE STUDY ABROAD PRIVATE LIMITED";
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set in environment variables");
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
          }
        }
      </style>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9FF; margin: 0; padding: 0; color: #475569;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9FF; padding: 40px 0; min-height: 100%;">
        <tr>
          <td align="center" valign="top">
            <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #DDD6FE; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.05);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%); padding: 40px 20px;">
                  <div style="font-size: 40px; margin-bottom: 10px;">📬</div>
                  <h1 style="color: #FFFFFF; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">New Contact Submission</h1>
                  <p style="margin: 10px 0 0 0; color: #FFFFFF; opacity: 0.9; font-size: 14px;">
                    ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 40px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: left;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding-bottom: 24px;">
                        <div style="color: #7C3AED; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; font-weight: 600;">👤 Full Name</div>
                        <div style="font-size: 16px; color: #0F172A; font-weight: 500;">${name}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 24px;">
                        <div style="color: #7C3AED; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; font-weight: 600;">📧 Email Address</div>
                        <div style="font-size: 16px; color: #0F172A; font-weight: 500;"><a href="mailto:${email}" style="color: #7C3AED; text-decoration: none; font-weight: 600;">${email}</a></div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 24px;">
                        <div style="color: #7C3AED; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; font-weight: 600;">📝 Subject</div>
                        <div style="font-size: 16px; color: #0F172A; font-weight: 500;">${subject}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 8px;">
                        <div style="color: #7C3AED; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; font-weight: 600;">💬 Message</div>
                        <div style="background: #F3E8FF; padding: 20px; border-radius: 8px; border-left: 4px solid #7C3AED; color: #475569; line-height: 1.8; font-size: 15px; margin-top: 6px;">
                          ${message.replace(/\n/g, "<br>")}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 30px; background: #F3E8FF; border-top: 1px solid #DDD6FE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #64748B;">
                  <p style="margin: 0 0 5px 0;"><strong style="color: #0F172A;">${brandName}</strong></p>
                  <p style="margin: 0;">This email was sent from your website contact form</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: brandName,
        email: "devsingh98011@gmail.com",
      },
      to: [{ email: "devsingh98011@gmail.com", name: brandName }],
      subject: `✨ New Contact: ${subject}`,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Brevo API Error details (contact to owner):', errorData);
    throw new Error(errorData?.message || `Failed to send email to owner: ${response.statusText}`);
  }

  return response;
}

export async function sendContactEmailToCustomer(name: string, email: string, subject: string, message: string) {
  const brandName = "EDUCAZIONE STUDY ABROAD PRIVATE LIMITED";
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set in environment variables");
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Contacting Us</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
          }
        }
      </style>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9FF; margin: 0; padding: 0; color: #475569;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9FF; padding: 40px 0; min-height: 100%;">
        <tr>
          <td align="center" valign="top">
            <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #DDD6FE; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.05);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%); padding: 40px 20px;">
                  <div style="font-size: 48px; margin-bottom: 10px;">🎓</div>
                  <h1 style="color: #FFFFFF; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Thank You, ${name}!</h1>
                  <p style="margin: 10px 0 0 0; color: #FFFFFF; opacity: 0.9; font-size: 14px;">
                    We've received your message and can't wait to connect
                  </p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 40px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: left;">
                  <p style="font-size: 16px; color: #0F172A; margin-top: 0; margin-bottom: 15px;">Dear <strong>${name}</strong>,</p>
                  <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 15px;">
                    Thank you for reaching out to <strong style="color: #7C3AED;">${brandName}</strong>! We appreciate you taking the time to contact us.
                  </p>
                  <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 25px;">
                    Our team has received your inquiry regarding "<strong>${subject}</strong>" and we'll get back to you within <strong style="color: #7C3AED;">24 hours</strong>.
                  </p>
                  
                  <!-- Office Hours Table -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #F3E8FF; border: 1px solid #DDD6FE; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-collapse: collapse;">
                    <tr>
                      <td colspan="2" style="padding-bottom: 12px;">
                        <h3 style="color: #7C3AED; margin: 0; font-size: 16px; font-weight: 700;">⏰ Our Office Hours</h3>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #DDD6FE; color: #475569; font-size: 14px;">Monday - Friday</td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #DDD6FE; text-align: right; font-weight: 500; color: #0F172A; font-size: 14px;">10:00 AM - 7:00 PM</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #DDD6FE; color: #475569; font-size: 14px;">Saturday</td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #DDD6FE; text-align: right; font-weight: 500; color: #0F172A; font-size: 14px;">10:00 AM - 5:00 PM</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0 0 0; color: #475569; font-size: 14px;">Sunday</td>
                      <td style="padding: 8px 0 0 0; text-align: right; font-weight: 500; color: #0F172A; font-size: 14px;">Closed</td>
                    </tr>
                  </table>

                  <p style="font-size: 15px; font-weight: 600; color: #0F172A; margin-bottom: 10px;">Here's a copy of your message:</p>
                  <div style="background: #F3E8FF; padding: 20px; border-radius: 8px; border-left: 4px solid #7C3AED; color: #475569; line-height: 1.8; font-size: 15px; margin-bottom: 25px;">
                    ${message.replace(/\n/g, "<br>")}
                  </div>

                  <!-- Contact Info Table -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #FFFFFF; border: 1px solid #DDD6FE; padding: 20px; border-radius: 8px; margin-bottom: 10px;">
                    <tr>
                      <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        <p style="font-weight: 600; color: #0F172A; margin: 0 0 12px 0; font-size: 15px;">Need immediate assistance?</p>
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569;">📞 Phone: <a href="tel:+918129870556" style="color: #7C3AED; text-decoration: none; font-weight: 600;">+91 8129870556</a></p>
                        <p style="margin: 0; font-size: 14px; color: #475569;">📧 Email: <a href="mailto:support@educazi.com" style="color: #7C3AED; text-decoration: none; font-weight: 600;">support@educazi.com</a></p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 30px; background: #F3E8FF; border-top: 1px solid #DDD6FE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #64748B;">
                  <p style="margin: 0 0 5px 0;"><strong style="color: #0F172A; font-size: 15px;">${brandName}</strong></p>
                  <p style="margin: 0 0 15px 0;">Empowering your global education journey</p>
                  <p style="margin: 0;">&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: brandName,
        email: "devsingh98011@gmail.com",
      },
      to: [{ email, name }],
      subject: "Thank you for reaching out! 🎓",
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Brevo API Error details (contact auto-reply):', errorData);
    throw new Error(errorData?.message || `Failed to send auto-reply to customer: ${response.statusText}`);
  }

  return response;
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const brandName = "EDUCAZIONE STUDY ABROAD PRIVATE LIMITED";
  const frontendUrl = process.env.NEXTAUTH_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;

  const subject = `Reset your password - ${brandName}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
          }
        }
      </style>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9FF; margin: 0; padding: 0; color: #475569;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9FF; padding: 40px 0; min-height: 100%;">
        <tr>
          <td align="center" valign="top">
            <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #DDD6FE; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.05);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%); padding: 40px 20px;">
                  <h1 style="color: #FFFFFF; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Reset Your Password</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 40px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: left;">
                  <p style="font-size: 18px; font-weight: 600; color: #0F172A; margin-top: 0; margin-bottom: 12px;">Hi ${name || 'there'},</p>
                  <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 32px;">
                    We received a request to reset your account password. Please use the verification OTP code below to reset it, or click the button below.
                  </p>
                  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 8px; font-weight: 600; text-align: center; color: #0F172A;">
                    Your Password Reset OTP Code:
                  </p>
                  <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; text-align: center; background: #F3E8FF; padding: 16px; border-radius: 12px; color: #7C3AED; margin: 24px auto; border: 1px dashed #7C3AED; max-width: 200px;">
                    ${token}
                  </div>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                    <tr>
                      <td align="center">
                        <a href="${resetLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%); color: #FFFFFF !important; font-weight: 600; font-size: 16px; padding: 14px 32px; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);">Reset Password</a>
                      </td>
                    </tr>
                  </table>
                  <p style="font-size: 14px; line-height: 1.6; color: #64748B; margin-bottom: 8px;">
                    If you have trouble clicking the button, copy and paste the link below into your web browser:
                  </p>
                  <div style="font-size: 14px; color: #7C3AED; background: #F3E8FF; padding: 16px; border-radius: 8px; word-break: break-all; margin-bottom: 32px;">
                    <a href="${resetLink}" target="_blank" style="color: #7C3AED; text-decoration: none; word-break: break-all;">${resetLink}</a>
                  </div>
                  <div style="height: 1px; background-color: #DDD6FE; margin-bottom: 24px;"></div>
                  <p style="font-size: 12px; color: #64748B; margin: 0; line-height: 1.5;">
                    This code is valid for 1 hour. If you did not request a password reset, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 30px; background: #F3E8FF; border-top: 1px solid #DDD6FE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #64748B;">
                  <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
                  <p style="margin: 0;">Support Office: <a href="mailto:support@educazi.com" style="color: #7C3AED; text-decoration: none;">support@educazi.com</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set in environment variables");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: brandName,
        email: "devsingh98011@gmail.com",
      },
      to: [{ email, name }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Brevo API Error details (password reset):', errorData);
    throw new Error(errorData?.message || `Failed to send password reset email: ${response.statusText}`);
  }

  return response;
}

export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderId: string,
  items: { name: string; price: number; quantity: number; pdfUrl?: string; downloadLink?: string }[]
) {
  const brandName = "EDUCAZIONE STUDY ABROAD PRIVATE LIMITED";
  const supportEmail = "support@educazi.com";
  const subject = `Your Course Materials & Enrollment Confirmation - Order ${orderId}`;

  let coursesListHtml = "";
  for (const item of items) {
    coursesListHtml += `
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9FF; border: 1px solid #DDD6FE; border-radius: 12px; margin-bottom: 16px; border-collapse: collapse;">
        <tr>
          <td style="padding: 20px; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <h3 style="margin: 0 0 6px 0; color: #0F172A; font-size: 17px; font-weight: 700;">${item.name}</h3>
            <p style="margin: 0 0 16px 0; color: #64748B; font-size: 14px;">Quantity: ${item.quantity} • Price: ₹${item.price}</p>
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td>
                  ${item.pdfUrl ? `<a href="${item.pdfUrl}" target="_blank" style="display: inline-block; background-color: #7C3AED; color: #FFFFFF !important; text-decoration: none; font-weight: 600; font-size: 13px; padding: 10px 18px; border-radius: 6px; margin-right: 10px; margin-bottom: 8px;">Download Syllabus PDF</a>` : ''}
                  ${item.downloadLink ? `<a href="${item.downloadLink}" target="_blank" style="display: inline-block; background-color: #4F46E5; color: #FFFFFF !important; text-decoration: none; font-weight: 600; font-size: 13px; padding: 10px 18px; border-radius: 6px; margin-bottom: 8px;">Download Study Materials</a>` : ''}
                </td>
              </tr>
            </table>
            ${(!item.pdfUrl && !item.downloadLink) ? `<p style="margin: 8px 0 0 0; color: #EF4444; font-size: 13px; font-style: italic;">No digital materials attached to this course. Contact support if you believe this is an error.</p>` : ''}
          </td>
        </tr>
      </table>
    `;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Course Materials</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
          }
        }
      </style>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9FF; margin: 0; padding: 0; color: #475569;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9FF; padding: 40px 0; min-height: 100%;">
        <tr>
          <td align="center" valign="top">
            <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #DDD6FE; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.05);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%); padding: 40px 20px;">
                  <div style="font-size: 40px; margin-bottom: 10px;">🛍️</div>
                  <h1 style="color: #FFFFFF; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Enrollment Confirmed!</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 40px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: left;">
                  <p style="font-size: 18px; font-weight: 600; color: #0F172A; margin-top: 0; margin-bottom: 12px;">Hi ${name},</p>
                  <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                    Thank you for enrolling with <strong>${brandName}</strong>. Your payment/registration has been processed successfully under Order ID: <strong>${orderId}</strong>.
                  </p>
                  <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                    You can access your course syllabus PDFs and download your study materials below:
                  </p>
                  
                  <div style="margin-top: 24px; margin-bottom: 24px;">
                    ${coursesListHtml}
                  </div>
                  
                  <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                    If you have any questions regarding your courses, study materials, or study abroad programs, please don't hesitate to reach out to our admissions office.
                  </p>
                  
                  <div style="height: 1px; background-color: #DDD6FE; margin: 32px 0 24px 0;"></div>
                  <p style="font-size: 12px; color: #64748B; margin: 0; line-height: 1.5;">
                    Registered Office: Bhageeratha Square, First floor, No C 021 67/1717 (old no 41/3197), Banerji Road, Kacheripady, Cochin-682018.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 30px; background: #F3E8FF; border-top: 1px solid #DDD6FE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #64748B;">
                  <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
                  <p style="margin: 0;">Support Office: <a href="mailto:${supportEmail}" style="color: #7C3AED; text-decoration: none;">${supportEmail}</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set in environment variables");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: brandName,
        email: "devsingh98011@gmail.com",
      },
      to: [{ email, name }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Brevo API Error details (order confirmation):', errorData);
    throw new Error(errorData?.message || `Failed to send order confirmation email: ${response.statusText}`);
  }

  return response;
}

export async function sendCounselingConfirmationEmail(
  email: string,
  name: string,
  applicationId: string,
  serviceName: string,
  feeAmount: number,
  additionalDetails: {
    phone: string;
    dob: string;
    highestQualification: string;
    gpaOrPercentage: string;
    preferredCountry?: string;
    preferredCourse?: string;
  }
) {
  const brandName = "EDUCAZIONE STUDY ABROAD PRIVATE LIMITED";
  const supportEmail = "support@educazi.com";
  const subject = `Your Counseling Registration Confirmed - Application ${applicationId}`;

  const formattedDOB = new Date(additionalDetails.dob).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Counseling Registration Confirmed</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container {
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
          }
        }
        @media only screen and (max-width: 480px) {
          .responsive-table td {
            display: block !important;
            width: 100% !important;
            text-align: left !important;
            box-sizing: border-box;
          }
          .responsive-table td.detail-label {
            padding-top: 10px !important;
            padding-bottom: 2px !important;
            border-bottom: none !important;
            color: #7C3AED !important;
            font-size: 11px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }
          .responsive-table td.detail-value {
            padding-top: 2px !important;
            padding-bottom: 10px !important;
            border-bottom: 1px solid #E2E8F0 !important;
            text-align: left !important;
            font-size: 15px !important;
          }
          .responsive-table tr:last-child td.detail-value {
            border-bottom: none !important;
          }
        }
      </style>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9FF; margin: 0; padding: 0; color: #475569;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9FF; padding: 40px 0; min-height: 100%;">
        <tr>
          <td align="center" valign="top">
            <table class="container" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #DDD6FE; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.05);">
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%); padding: 40px 20px;">
                  <h1 style="color: #FFFFFF; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Registration Confirmed!</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 40px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: left;">
                  <p style="font-size: 18px; font-weight: 600; color: #0F172A; margin-top: 0; margin-bottom: 12px;">Hi ${name},</p>
                  <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                    Thank you for registering for our premium counseling services at <strong>${brandName}</strong>. Your application has been successfully submitted and your fee payment of <strong>₹${feeAmount}</strong> is complete.
                  </p>
                  
                  <div style="background-color: #FAF9FF; border: 1px solid #DDD6FE; border-radius: 12px; padding: 24px; margin: 24px 0;">
                    <h3 style="margin-top: 0; margin-bottom: 16px; color: #7C3AED; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Application Summary</h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" class="responsive-table" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td class="detail-label" style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #64748B; font-weight: 500; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          Application ID
                        </td>
                        <td class="detail-value" style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #0F172A; font-weight: 600; text-align: right; word-break: break-all; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          ${applicationId}
                        </td>
                      </tr>
                      <tr>
                        <td class="detail-label" style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #64748B; font-weight: 500; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          Service Type
                        </td>
                        <td class="detail-value" style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #0F172A; font-weight: 600; text-align: right; word-break: break-word; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          ${serviceName}
                        </td>
                      </tr>
                      <tr>
                        <td class="detail-label" style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #64748B; font-weight: 500; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          Candidate Name
                        </td>
                        <td class="detail-value" style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #0F172A; font-weight: 600; text-align: right; word-break: break-word; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          ${name}
                        </td>
                      </tr>
                      <tr>
                        <td class="detail-label" style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #64748B; font-weight: 500; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          Phone Number
                        </td>
                        <td class="detail-value" style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #0F172A; font-weight: 600; text-align: right; word-break: break-word; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          ${additionalDetails.phone}
                        </td>
                      </tr>
                      <tr>
                        <td class="detail-label" style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #64748B; font-weight: 500; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          Date of Birth
                        </td>
                        <td class="detail-value" style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #0F172A; font-weight: 600; text-align: right; word-break: break-word; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          ${formattedDOB}
                        </td>
                      </tr>
                      <tr>
                        <td class="detail-label" style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #64748B; font-weight: 500; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          Highest Qualification
                        </td>
                        <td class="detail-value" style="padding: 10px 0; border-bottom: 1px solid #E2E8F0; font-size: 14px; color: #0F172A; font-weight: 600; text-align: right; word-break: break-word; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          ${additionalDetails.highestQualification}
                        </td>
                      </tr>
                      <tr>
                        <td class="detail-label" style="padding: 10px 0; border-bottom: ${additionalDetails.preferredCountry || additionalDetails.preferredCourse ? '1px solid #E2E8F0' : 'none'}; font-size: 14px; color: #64748B; font-weight: 500; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          GPA / Percentage
                        </td>
                        <td class="detail-value" style="padding: 10px 0; border-bottom: ${additionalDetails.preferredCountry || additionalDetails.preferredCourse ? '1px solid #E2E8F0' : 'none'}; font-size: 14px; color: #0F172A; font-weight: 600; text-align: right; word-break: break-word; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          ${additionalDetails.gpaOrPercentage}
                        </td>
                      </tr>
                      ${additionalDetails.preferredCountry ? `
                      <tr>
                        <td class="detail-label" style="padding: 10px 0; border-bottom: ${additionalDetails.preferredCourse ? '1px solid #E2E8F0' : 'none'}; font-size: 14px; color: #64748B; font-weight: 500; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          Target Destination
                        </td>
                        <td class="detail-value" style="padding: 10px 0; border-bottom: ${additionalDetails.preferredCourse ? '1px solid #E2E8F0' : 'none'}; font-size: 14px; color: #0F172A; font-weight: 600; text-align: right; word-break: break-word; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          ${additionalDetails.preferredCountry}
                        </td>
                      </tr>` : ''}
                      ${additionalDetails.preferredCourse ? `
                      <tr>
                        <td class="detail-label" style="padding: 10px 0; border-bottom: none; font-size: 14px; color: #64748B; font-weight: 500; text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          Target Course
                        </td>
                        <td class="detail-value" style="padding: 10px 0; border-bottom: none; font-size: 14px; color: #0F172A; font-weight: 600; text-align: right; word-break: break-word; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                          ${additionalDetails.preferredCourse}
                        </td>
                      </tr>` : ''}
                    </table>
                  </div>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F5F3FF; border: 1px solid #E9D5FF; border-radius: 12px; margin-top: 28px; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 20px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        <h4 style="margin: 0 0 8px 0; color: #5B21B6; font-size: 15px; font-weight: 700;">📅 Next Steps: Book Your Counseling Slot</h4>
                        <p style="font-size: 13px; color: #6D28D9; margin: 0 0 16px 0; line-height: 1.5;">An admissions coordinator will review your profile details and reach out within 24 hours. You can also directly schedule a call using the link below.</p>
                        <a href="mailto:${supportEmail}?subject=Schedule Counseling Call - ${applicationId}" style="display: inline-block; background: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%); color: #FFFFFF !important; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);">Request Consultation Schedule</a>
                      </td>
                    </tr>
                  </table>

                  <div style="height: 1px; background-color: #DDD6FE; margin: 32px 0 24px 0;"></div>
                  <p style="font-size: 12px; color: #64748B; margin: 0; line-height: 1.5;">
                    Registered Office: Bhageeratha Square, First floor, No C 021 67/1717 (old no 41/3197), Banerji Road, Kacheripady, Cochin-682018.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 30px; background: #F3E8FF; border-top: 1px solid #DDD6FE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #64748B;">
                  <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
                  <p style="margin: 0;">Support Office: <a href="mailto:${supportEmail}" style="color: #7C3AED; text-decoration: none;">${supportEmail}</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set in environment variables");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: brandName,
        email: "devsingh98011@gmail.com",
      },
      to: [{ email, name }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Brevo API Error details (counseling application):', errorData);
    throw new Error(errorData?.message || `Failed to send counseling confirmation email: ${response.statusText}`);
  }

  return response;
}
