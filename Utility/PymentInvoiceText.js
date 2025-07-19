export const paymenInvoiceText = (transaction) => {
  const {
    name,
    email,
    phoneNumber,
    address,
    serviceNeeded,
    amount,
    serviceCharge,
    duration,
    paymentStatus,
    razorpayOrderId,
    razorpayPaymentId,
    status,
    created_at,
    card_type,
    card_network,
    bank,
    planDetails,
    vpa,
    _id
  } = transaction;

       const date = new Date(created_at * 1000).toLocaleDateString('en-IN', {
       timeZone: 'Asia/Kolkata'
     });

   const time = new Date(created_at * 1000).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
       hour: '2-digit',
       minute: '2-digit',
      second: '2-digit'
      });


   const planName = transaction.planDetails?.planName || "N/A";// Extract plan name from planDetails

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Payment Invoice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #fff;
      color: #333;
      padding: 20px;
    }

    .container {
      max-width: 700px;
      margin: auto;
      border: 1px solid #ddd;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo img {
      width: 140px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h2 {
      margin: 0;
      color: #0a1d3d;
      border-bottom: 2px solid #0a1d3d;
      display: inline-block;
      padding-bottom: 5px;
    }

    .info p {
      margin: 6px 0;
      line-height: 1.6;
    }

    .details {
      margin-top: 30px;
      border: 1px solid #eee;
      border-radius: 6px;
      overflow: hidden;
    }

    .details-row {
      display: flex;
      padding: 10px 15px;
    }

    .details-row:nth-child(even) {
      background-color: #f0f8ff; /* light blue */
    }

    .details-row:nth-child(odd) {
      background-color: #ffffff; /* white */
    }

    .details-row span {
      flex: 1;
      font-weight: bold;
      color: #0a1d3d;
    }

    .details-row div {
      flex: 2;
    }

    .footer {
      text-align: center;
      font-size: 14px;
      color: #555;
      border-top: 1px solid #eee;
      padding-top: 15px;
      margin-top: 30px;
    }

    @media print {
      body {
        padding: 0;
      }
      .container {
        box-shadow: none;
        border: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://airwire.in/wp-content/uploads/2025/03/cropped-air-logo.png" alt="Airwire Logo">
    </div>

    <div class="header">
      <h2>Payment Invoice</h2>
    </div>

    <div class="info">
      <p><strong>Customer Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Transaction ID:</strong> ${_id}</p>
    </div>

    <div class="details">
      <div class="details-row"><span>Plan:</span><div>${planName}</div></div>
      <div class="details-row"><span>Service:</span><div>${serviceNeeded}</div></div>
      <div class="details-row"><span>Address:</span><div>${address}</div></div>
       <div class="details-row"><span>Plan Price (₹):</span><div>${amount - serviceCharge}</div></div>
       <div class="details-row"><span>Service Charge (₹):</span><div>${serviceCharge}</div></div>
      <div class="details-row"><span>Amount Paid (₹):</span><div>${amount}</div></div>
      <div class="details-row"><span> Plan Duretion :</span><div>${duration} days</div></div>
      <div class="details-row"><span>Payment Method:</span><div>${transaction.method || 'Not Available'}</div></div>
      <div class="details-row"><span>Payment Status:</span><div>${paymentStatus}</div></div>
      <div class="details-row"><span>Razorpay Order ID:</span><div>${razorpayOrderId}</div></div>
      <div class="details-row"><span>Razorpay Payment ID:</span><div>${razorpayPaymentId || 'N/A'}</div></div>
      <div class="details-row"><span>Captured:</span><div>${transaction.captured ? 'Yes' : 'No'}</div></div>
      <div class="details-row"><span>UPI / VPA:</span><div>${vpa || 'N/A'}</div></div>
    </div>

    <div class="footer">
      <p>Thank you for choosing <strong>Airwire</strong>.<br>
      For support, contact us at <a href="mailto:support@airwire.in">support@airwire.in</a></p>
    </div>
  </div>
</body>
</html>`;
};

export const paymenInvoiceFailedText = (transaction) => {
  const {
    name,
    email,
    phoneNumber,
    address,
    serviceNeeded,
    amount,
    paymentStatus,
    razorpayOrderId,
    razorpayPaymentId,
    planDetails,
    created_at,
    vpa,
    _id
  } = transaction;

     const date = new Date(created_at * 1000).toLocaleDateString('en-IN', {
       timeZone: 'Asia/Kolkata'
     });

   const time = new Date(created_at * 1000).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
       hour: '2-digit',
       minute: '2-digit',
      second: '2-digit'
      });


     const planName = transaction.planDetails?.planName|| "N/A";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Payment Failed Invoice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #fff;
      color: #333;
      padding: 20px;
    }

    .container {
      max-width: 700px;
      margin: auto;
      border: 1px solid #ddd;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }

    .logo {
      text-align: center;
      margin-bottom: 20px;
    }

    .logo img {
      width: 140px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h2 {
      margin: 0;
      color: #c0392b;
      border-bottom: 2px solid #c0392b;
      display: inline-block;
      padding-bottom: 5px;
    }

    .info p {
      margin: 6px 0;
      line-height: 1.6;
    }

    .details {
      margin-top: 30px;
      border: 1px solid #eee;
      border-radius: 6px;
      overflow: hidden;
    }

    .details-row {
      display: flex;
      padding: 10px 15px;
    }

    .details-row:nth-child(even) {
      background-color: #fef2f2;
    }

    .details-row:nth-child(odd) {
      background-color: #ffffff;
    }

    .details-row span {
      flex: 1;
      font-weight: bold;
      color: #a94442;
    }

    .details-row div {
      flex: 2;
    }

    .footer {
      text-align: center;
      font-size: 14px;
      color: #777;
      border-top: 1px solid #eee;
      padding-top: 15px;
      margin-top: 30px;
    }

    @media print {
      body {
        padding: 0;
      }
      .container {
        box-shadow: none;
        border: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://airwire.in/wp-content/uploads/2025/03/cropped-air-logo.png" alt="Airwire Logo">
    </div>

    <div class="header">
      <h2>Payment Failed</h2>
    </div>

    <div class="info">
      <p><strong>Customer Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone Number:</strong> ${phoneNumber}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p><strong>Transaction ID:</strong> ${_id}</p>
    </div>

    <div class="details">
      <div class="details-row"><span>Plan:</span><div>${planName}</div></div>
      <div class="details-row"><span>Service:</span><div>${serviceNeeded}</div></div>
      <div class="details-row"><span>Address:</span><div>${address}</div></div>
      <div class="details-row"><span>Attempted Amount (₹):</span><div>${amount}</div></div>
      <div class="details-row"><span>Payment Method:</span><div>${transaction.method || 'Not Available'}</div></div>
      <div class="details-row"><span>Payment Status:</span><div>${paymentStatus || 'Failed'}</div></div>
      <div class="details-row"><span>Razorpay Order ID:</span><div>${razorpayOrderId || 'N/A'}</div></div>
      <div class="details-row"><span>Razorpay Payment ID:</span><div>${razorpayPaymentId || 'N/A'}</div></div>
      <div class="details-row"><span>Captured:</span><div>${transaction.captured ? 'Yes' : 'No'}</div></div>
      <div class="details-row"><span>UPI / VPA:</span><div>${vpa || 'N/A'}</div></div>
    </div>

    <div class="footer">
      <p>We regret that your payment attempt was unsuccessful.<br>
      If you need assistance, contact us at <a href="mailto:support@airwire.in">support@airwire.in</a></p>
    </div>
  </div>
</body>
</html>`;
};
