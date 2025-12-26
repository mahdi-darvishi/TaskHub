const getVerificationEmailTemplate = (name, verifyUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your email</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 0;">
        <tr>
          <td align="center">
            
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <tr>
                <td style="padding: 30px 40px; background-color: #4F46E5; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 1px;">TaskHub</h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 40px 20px 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Hello, ${name}! 👋</h2>
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Welcome to TaskHub! We're excited to have you on board. To get started and activate your account, please verify your email address by clicking the button below.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 10px 40px 30px 40px;">
                  <a href="${verifyUrl}" style="display: inline-block; background-color: #4F46E5; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; transition: background-color 0.3s;">
                    Verify My Account
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 40px 30px 40px;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                    Or copy and paste this link into your browser:<br>
                    <a href="${verifyUrl}" style="color: #4F46E5; text-decoration: underline; word-break: break-all;">${verifyUrl}</a>
                  </p>
                </td>
              </tr>

              <tr>
                <td style="border-top: 1px solid #e5e7eb;"></td>
              </tr>

              <tr>
                <td style="padding: 30px 40px; background-color: #f9fafb; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px;">
                    This link will expire in 24 hours.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} TaskHub Inc. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
            
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `;
};

// 1. تعریف تمپلیت (می‌تونی کنار تمپلیت قبلی نگه داری)
const getResendVerificationEmailTemplate = (name, verifyUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Verification Link</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 0;">
        <tr>
          <td align="center">
            
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <tr>
                <td style="padding: 30px 40px; background-color: #4F46E5; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 1px;">TaskHub</h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 40px 20px 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 600;">New Verification Link 🔄</h2>
                  <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Hello, ${name}!
                  </p>
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    It looks like your previous verification link has expired. Don't worry! We've generated a fresh link for you.
                  </p>
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Click the button below to verify your email and activate your TaskHub account.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 10px 40px 30px 40px;">
                  <a href="${verifyUrl}" style="display: inline-block; background-color: #4F46E5; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; transition: background-color 0.3s;">
                    Verify Account
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 40px 30px 40px;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                    Or paste this link into your browser:<br>
                    <a href="${verifyUrl}" style="color: #4F46E5; text-decoration: underline; word-break: break-all;">${verifyUrl}</a>
                  </p>
                </td>
              </tr>

              <tr>
                <td style="border-top: 1px solid #e5e7eb;"></td>
              </tr>

              <tr>
                <td style="padding: 30px 40px; background-color: #f9fafb; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px;">
                    This new link is valid for 24 hours.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} TaskHub Inc. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
            
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `;
};

// 1. تعریف تمپلیت
const getPasswordResetTemplate = (resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset your password</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 0;">
        <tr>
          <td align="center">
            
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <tr>
                <td style="padding: 30px 40px; background-color: #4F46E5; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 1px;">TaskHub</h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 40px 20px 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Reset Your Password 🔒</h2>
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Hello,
                  </p>
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    We received a request to reset the password for your TaskHub account. If you made this request, please click the button below to choose a new password.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 10px 40px 30px 40px;">
                  <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; transition: background-color 0.3s;">
                    Reset Password
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding: 0 40px 20px 40px;">
                  <p style="margin: 0; padding: 15px; background-color: #fff1f2; border-radius: 6px; color: #9f1239; font-size: 14px; line-height: 1.5; border: 1px solid #fecdd3;">
                    <strong>Security Notice:</strong> If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 20px 40px 30px 40px;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                    Or paste this link into your browser:<br>
                    <a href="${resetUrl}" style="color: #4F46E5; text-decoration: underline; word-break: break-all;">${resetUrl}</a>
                  </p>
                </td>
              </tr>

              <tr>
                <td style="border-top: 1px solid #e5e7eb;"></td>
              </tr>

              <tr>
                <td style="padding: 30px 40px; background-color: #f9fafb; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px;">
                    This link expires in 15 minutes for your security.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} TaskHub Inc. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
            
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `;
};

const getWorkspaceInvitationTemplate = (
  inviterName,
  workspaceName,
  inviteLink
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">TaskHub</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #111827; margin-top: 0;">You're invited! 📨</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
            <strong>${inviterName}</strong> has invited you to join the <strong>"${workspaceName}"</strong> workspace on TaskHub.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
            Collaborate, manage tasks, and get things done together.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background-color: #4F46E5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Accept Invitation</a>
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            This link will expire in 7 days. If you didn't expect this invitation, you can ignore this email.
          </p>
        </div>
      </div>
    </div>
  `;
};
export {
  getVerificationEmailTemplate,
  getResendVerificationEmailTemplate,
  getPasswordResetTemplate,
  getWorkspaceInvitationTemplate,
};
