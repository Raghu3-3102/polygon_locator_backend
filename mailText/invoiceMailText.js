export const sucessfullPayment = (amount, name) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #0a1d3d;
        color: white;
      }
      .email-container {
        max-width: 600px;
        margin: auto;
        background-color: #0a1d3d;
        padding: 20px;
        border-radius: 8px;
        color: white;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        width: 150px;
      }
      .greeting {
        font-size: 18px;
        margin-bottom: 20px;
      }
      .content {
        font-size: 16px;
        line-height: 1.6;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: #ccc;
      }

      @media (prefers-color-scheme: dark) {
        body {
          background-color: #0a1d3d !important;
          color: #ffffff !important;
        }
        .email-container {
          background-color: #0a1d3d !important;
          color: #ffffff !important;
        }
        .footer {
          color: #bbb !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="logo">
        <picture>
          <source srcset="https://airwire.in/wp-content/uploads/2025/03/cropped-air-logo.png" media="(prefers-color-scheme: dark)">
          <img src="https://airwire.in/wp-content/uploads/2025/03/cropped-air-logo.png" alt="Airwire Logo" />
        </picture>
      </div>
      <div class="greeting">Hi ${name},</div>
      <div class="content">
        <p>Thanks for choosing <strong>Airwire</strong>.</p>
        <p>We have successfully received your payment. This email serves as a confirmation of your transaction with Airwire.</p>
        <p>You have paid <strong>₹${amount}</strong> towards your selected service. We appreciate your trust in us.</p>
        <p>This is your official payment invoice. For your reference and record-keeping, we have attached a PDF copy of the invoice to this email.</p>
        <p>If you have any questions or need support, feel free to contact our customer service team.</p>
        <p>Thank you once again for choosing Airwire.</p>
      </div>
      <div class="footer">
        <p>Airwire – Delivering Seamless Internet Experience</p>
      </div>
    </div>
  </body>
</html>`;
};

export const FailedPayment= (name, amount, orderId) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Payment Failed</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #fdfdfd;
      color: #333;
    }

    .email-container {
      max-width: 600px;
      margin: auto;
      padding: 30px;
      border-radius: 10px;
      background-color: #fff;
      border: 1px solid #e5e5e5;
    }

    .header {
      text-align: center;
      margin-bottom: 25px;
    }

    .header img {
      width: 140px;
    }

    .header h2 {
      color: #c0392b;
      font-size: 22px;
      margin-top: 15px;
    }

    .content {
      font-size: 16px;
      line-height: 1.6;
    }

    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 14px;
      color: #777;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background-color: #121212 !important;
        color: #eee !important;
      }
      .email-container {
        background-color: #1e1e1e !important;
        border-color: #333 !important;
      }
      .header h2 {
        color: #ff6b6b !important;
      }
      .footer {
        color: #aaa !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://airwire.in/wp-content/uploads/2025/03/cropped-air-logo.png" alt="Airwire Logo" />
      <h2>Payment Failed</h2>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>We regret to inform you that your payment attempt of <strong>₹${amount}</strong> with Order ID <strong>${orderId}</strong> was unsuccessful.</p>
      <p><strong>No amount was deducted</strong> from your account.</p>
      <p>If this was unexpected or you need help, please reach out to our support team.</p>
      <p>You're welcome to try again at your convenience.</p>
    </div>
    <div class="footer">
      <p>Thank you for choosing <strong>Airwire</strong><br />
      Need help? <a href="mailto:support@airwire.in" style="color:#007bff;">Contact Support</a></p>
    </div>
  </div>
</body>
</html>`;
};

