const otpEmailTemplate = ({ name, otp }) => {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #007bff;">Hello ${name},</h2>
            <p>Thank you for using our platform. Use the OTP below to complete your verification:</p>
            <div style="
                font-size: 20px; 
                font-weight: bold; 
                color: #007bff; 
                background-color: #e6f7ff; 
                padding: 10px; 
                text-align: center; 
                border-radius: 5px; 
                margin: 20px 0; 
                letter-spacing: 2px;
                ">
                ${otp}
            </div>
            <p>To make things easier, just select the OTP above and copy it!</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
                Regards,<br>
                The Mukul Website Team
            </p>
        </div>
    `;
};

export default otpEmailTemplate;
