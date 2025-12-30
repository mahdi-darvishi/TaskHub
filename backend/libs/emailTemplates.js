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

const getWorkspaceInvitationTemplate = ({
  inviterName,
  workspaceName,
  role,
  inviteLink,
}) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #000000; padding: 20px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 20px;">TaskHub Invitation</h2>
      </div>
      
      <div style="padding: 30px; color: #333333; line-height: 1.6;">
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">
          <strong>${inviterName}</strong> has invited you to join the <strong>"${workspaceName}"</strong> workspace as a <strong style="text-transform: capitalize;">${role}</strong>.
        </p>
        
        <p style="margin-top: 20px;">Click the button below to accept the invitation and start collaborating:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteLink}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">Join Workspace</a>
        </div>
        
        <p style="font-size: 14px; color: #666666; margin-top: 30px;">
          Or copy and paste this link into your browser:
        </p>
        <p style="background-color: #f8fafc; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px; color: #475569; word-break: break-all; border: 1px solid #cbd5e1;">
          ${inviteLink}
        </p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e0e0e0;">
        <p>&copy; ${new Date().getFullYear()} TaskHub. All rights reserved.</p>
      </div>
    </div>
  `;
};

const getTwoFACodeTemplate = (otpCode) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Two-Factor Authentication</h2>
      <p style="color: #555; font-size: 16px;">Hello,</p>
      <p style="color: #555; font-size: 16px;">You are trying to log in. Please use the following code to complete your authentication:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; background: #f3f4f6; padding: 10px 20px; border-radius: 5px;">${otpCode}</span>
      </div>
      <p style="color: #555; font-size: 14px;">This code is valid for <strong>10 minutes</strong>.</p>
      <p style="color: #999; font-size: 12px; margin-top: 20px; text-align: center;">If you didn't try to login, please change your password immediately.</p>
    </div>
  `;
};
export {
  getVerificationEmailTemplate,
  getResendVerificationEmailTemplate,
  getPasswordResetTemplate,
  getWorkspaceInvitationTemplate,
  getTwoFACodeTemplate,
};
