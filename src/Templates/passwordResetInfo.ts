import { TemplateParams } from "@/utils/types";

export const passResetInfoTemplate = ({
  name,
  companyName = "cutit",
  currentYear,
  supportLink = "#",
  loginLink = "/login",
}: TemplateParams) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Successful</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
        }
        
        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
          background: rgba(255, 255, 255, 0.1);
          padding: 40px 40px 20px 40px;
          text-align: center;
          backdrop-filter: blur(10px);
        }
        
        .email-header h1 {
          color: white;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .email-header .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          font-weight: 400;
        }
        
        .success-icon {
          background: rgba(255, 255, 255, 0.2);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          backdrop-filter: blur(10px);
        }
        
        .success-icon svg {
          width: 40px;
          height: 40px;
          fill: white;
        }
        
        .email-body {
          background: white;
          padding: 40px;
        }
        
        .greeting {
          font-size: 18px;
          color: #2d3748;
          margin-bottom: 24px;
          font-weight: 500;
        }
        
        .message {
          font-size: 16px;
          color: #4a5568;
          line-height: 1.7;
          margin-bottom: 32px;
        }
        
        .success-message {
          background: #f0fff4;
          border: 1px solid #9ae6b4;
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
          text-align: center;
        }
        
        .success-message .checkmark {
          font-size: 48px;
          color: #48bb78;
          margin-bottom: 12px;
          display: block;
        }
        
        .success-message h3 {
          color: #2f855a;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .success-message p {
          color: #276749;
          font-size: 14px;
          margin: 0;
        }
        
        .login-button-container {
          text-align: center;
          margin: 40px 0;
        }
        
        .login-button {
          display: inline-block;
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white !important;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(72, 187, 120, 0.3);
          border: none;
        }
        
        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(72, 187, 120, 0.4);
        }
        
        .security-tips {
          background: #edf2f7;
          border-left: 4px solid #48bb78;
          padding: 20px;
          margin: 32px 0;
          border-radius: 0 8px 8px 0;
        }
        
        .security-tips h4 {
          color: #2d3748;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }
        
        .security-tips h4::before {
          content: "🔒";
          margin-right: 8px;
          font-size: 18px;
        }
        
        .security-tips ul {
          list-style: none;
          padding: 0;
        }
        
        .security-tips li {
          color: #4a5568;
          font-size: 14px;
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
        }
        
        .security-tips li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #48bb78;
          font-weight: bold;
        }
        
        .info-box {
          background: #ebf8ff;
          border: 1px solid #90cdf4;
          border-radius: 8px;
          padding: 16px 20px;
          margin: 24px 0;
        }
        
        .info-box p {
          color: #2c5282;
          font-size: 14px;
          margin: 0;
          display: flex;
          align-items: center;
        }
        
        .info-box p::before {
          content: "ℹ️";
          margin-right: 8px;
          font-size: 16px;
        }
        
        .email-footer {
          background: #f8fafc;
          padding: 32px 40px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }
        
        .company-info {
          color: #718096;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .company-name {
          font-weight: 600;
          color: #2d3748;
        }
        
        .support-link {
          color: #48bb78;
          text-decoration: none;
          font-weight: 500;
        }
        
        .support-link:hover {
          text-decoration: underline;
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
          margin: 32px 0;
        }
        
        @media (max-width: 640px) {
          .email-container {
            margin: 20px;
            border-radius: 12px;
          }
          
          .email-header {
            padding: 30px 24px 15px 24px;
          }
          
          .email-header h1 {
            font-size: 24px;
          }
          
          .success-icon {
            width: 60px;
            height: 60px;
          }
          
          .success-icon svg {
            width: 30px;
            height: 30px;
          }
          
          .email-body {
            padding: 30px 24px;
          }
          
          .login-button {
            padding: 14px 28px;
            font-size: 15px;
          }
          
          .email-footer {
            padding: 24px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <div class="success-icon">
            <svg viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <img src="/images/cut-it.svg" alt="${companyName} Logo" style="width: 120px; margin-bottom: 16px;" />
          <h1>✅ Password Updated!</h1>
          <p class="subtitle">Your password has been successfully reset</p>
        </div>
        
        <div class="email-body">
          <p class="greeting">Hello ${name},</p>
          
          <p class="message">
            Great news! Your password has been successfully reset for your ${companyName} account. 
            Your account is now secure with your new password, and you can continue using all our services without any interruption.
          </p>
          
          <div class="success-message">
            <span class="checkmark">✅</span>
            <h3>Password Reset Complete</h3>
            <p>Your new password is now active and ready to use</p>
          </div>
          
          <div class="login-button-container">
            <a href="${loginLink}" class="login-button">Sign In to Your Account</a>
          </div>
          
          <div class="security-tips">
            <h4>Security Tips for Your Account</h4>
            <ul>
              <li>Use a strong, unique password that you don't use elsewhere</li>
              <li>Enable two-factor authentication for extra security</li>
              <li>Never share your login credentials with anyone</li>
              <li>Log out of your account when using shared devices</li>
              <li>Regularly update your password (every 3-6 months)</li>
            </ul>
          </div>
          
          <div class="info-box">
            <p>If you didn't make this change or have any security concerns, please contact our support team immediately.</p>
          </div>
          
          <div class="divider"></div>
          
          <p style="color: #718096; font-size: 14px; text-align: center;">
            Questions or need help? <a href="${supportLink}" class="support-link">Contact our support team</a> – we're here to assist you 24/7.
          </p>
        </div>
        
        <div class="email-footer">
          <div class="company-info">
            <p>Best regards,</p>
            <p class="company-name">${companyName} Security Team</p>
            <p style="margin-top: 16px; font-size: 12px; color: #a0aec0;">
              © ${currentYear} ${companyName}. All rights reserved.
            </p>
            <p style="margin-top: 8px; font-size: 11px; color: #cbd5e0;">
              This email was sent to confirm your password reset. For security reasons, this notification cannot be disabled.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
