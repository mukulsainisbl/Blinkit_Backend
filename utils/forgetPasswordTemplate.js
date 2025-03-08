const forgotPasswordTemplate = ({ name, otp }) => {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Password Reset Request</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>You have requested to reset your password. Please use the one-time password (OTP) provided below to complete the process:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="
            display: inline-block;
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            background-color: #4CAF50;
            padding: 10px 20px;
            border-radius: 5px;">
            ${otp}
          </span>
        </div>
        <p>If you did not request this password reset, please ignore this email or contact our support team if you have concerns.</p>
        <p>Thank you,<br> from Mukul Website Team</p>
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">
          If you have any questions, feel free to reply to this email or contact/a>.
        </p>
      </div>
    `;
  };


  export default forgotPasswordTemplate
  