import { TemplateParams } from "@/utils/types";

export const resetLinkTemplate = ({
  name,
  resetLink,
  companyName,
  currentYear,
}: TemplateParams) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        
        .reset-button-container {
          text-align: center;
          margin: 40px 0;
        }
        
        .reset-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          border: none;
        }
        
        .reset-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
        }
        
        .link-fallback {
          background: #f7fafc;
          border-left: 4px solid #667eea;
          padding: 16px 20px;
          margin: 24px 0;
          border-radius: 0 8px 8px 0;
        }
        
        .link-fallback p {
          margin-bottom: 8px;
          font-size: 14px;
          color: #4a5568;
          font-weight: 500;
        }
        
        .link-fallback code {
          background: #e2e8f0;
          padding: 8px 12px;
          border-radius: 6px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 12px;
          color: #2d3748;
          word-break: break-all;
          display: block;
          margin-top: 8px;
        }
        
        .security-notice {
          background: #fef5e7;
          border: 1px solid #f6e05e;
          border-radius: 8px;
          padding: 16px 20px;
          margin: 24px 0;
        }
        
        .security-notice p {
          color: #744210;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .security-notice .warning {
          font-weight: 600;
          color: #c53030;
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
          
          .email-body {
            padding: 30px 24px;
          }
          
          .reset-button {
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
          <img src="/images/cut-it.svg" alt="${companyName} Logo" style="width: 120px; margin-bottom: 16px;" />
          <h1>🔐 Password Reset</h1>
          <p class="subtitle">Secure your account with a new password</p>
        </div>
        
        <div class="email-body">
          <p class="greeting">Hello ${name},</p>
          
          <p class="message">
            We received a request to reset your password for your ${companyName} account. 
            Don't worry – this happens to the best of us! Click the button below to create a new, secure password.
          </p>
          
          <div class="reset-button-container">
            <a href="${resetLink}" class="reset-button">Reset My Password</a>
          </div>
          
          <div class="link-fallback">
            <p><strong>Button not working?</strong></p>
            <p>Copy and paste this link into your browser:</p>
            <code>${resetLink}</code>
          </div>
          
          <div class="security-notice">
            <p><span class="warning">⚠️ Security Notice:</span></p>
            <p>• This link will expire in 15 minutes for your security</p>
            <p>• If you didn't request this reset, please ignore this email</p>
            <p>• Never share this link with anyone</p>
          </div>
          
          <div class="divider"></div>
          
          <p style="color: #718096; font-size: 14px; text-align: center;">
            Need help? Contact our support team – we're here to assist you.
          </p>
        </div>
        
        <div class="email-footer">
          <div class="company-info">
            <p>Best regards,</p>
            <p class="company-name">${companyName} Team</p>
            <p style="margin-top: 16px; font-size: 12px; color: #a0aec0;">
              © ${currentYear} ${companyName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
