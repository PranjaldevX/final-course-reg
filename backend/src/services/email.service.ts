import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com';
const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Course Registration';

// Initialize SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log('✅ SendGrid initialized');
} else {
  console.warn('⚠️  SendGrid API key not found. Email sending will be disabled.');
}

export class EmailService {
  /**
   * Send OTP email to user
   */
  static async sendOtpEmail(email: string, otp: string, expiryMinutes: number): Promise<void> {
    if (!SENDGRID_API_KEY) {
      console.log('📧 [DEV MODE] OTP Email would be sent to:', email);
      console.log('🔐 OTP:', otp);
      console.log('⏰ Expires in:', expiryMinutes, 'minutes');
      return;
    }

    const msg = {
      to: email,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: 'Your OTP for Course Registration',
      text: `Your OTP is: ${otp}. It will expire in ${expiryMinutes} minutes.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Course Registration System</h1>
              <p>Aligarh Muslim University</p>
            </div>
            <div class="content">
              <h2>Your One-Time Password (OTP)</h2>
              <p>Hello,</p>
              <p>You have requested to set up your password for the Course Registration Portal. Please use the OTP below to proceed:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important:</strong> This OTP will expire in <strong>${expiryMinutes} minutes</strong>.
              </div>
              
              <p>If you didn't request this OTP, please ignore this email.</p>
              
              <p>Best regards,<br>Course Registration Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} Aligarh Muslim University</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log('✅ OTP email sent to:', email);
    } catch (error: any) {
      console.error('❌ Failed to send OTP email:', error.message);
      throw new Error('Failed to send OTP email. Please try again.');
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string, resetToken: string, expiryMinutes: number): Promise<void> {
    if (!SENDGRID_API_KEY) {
      console.log('📧 [DEV MODE] Password Reset Email would be sent to:', email);
      console.log('🔑 Reset Token:', resetToken);
      console.log('⏰ Expires in:', expiryMinutes, 'minutes');
      return;
    }

    const msg = {
      to: email,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: 'Password Reset Request',
      text: `Your password reset token is: ${resetToken}. It will expire in ${expiryMinutes} minutes.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .token-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .token-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
              <p>Course Registration System</p>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>Hello,</p>
              <p>You have requested to reset your password. Please use the token below:</p>
              
              <div class="token-box">
                <div class="token-code">${resetToken}</div>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important:</strong> This token will expire in <strong>${expiryMinutes} minutes</strong>.
              </div>
              
              <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
              
              <p>Best regards,<br>Course Registration Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} Aligarh Muslim University</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log('✅ Password reset email sent to:', email);
    } catch (error: any) {
      console.error('❌ Failed to send password reset email:', error.message);
      throw new Error('Failed to send password reset email. Please try again.');
    }
  }
}
