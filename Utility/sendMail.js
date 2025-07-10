import nodemailer from "nodemailer";

export const sendEmail = async (to, html,EMAIL_USER,EMAIL_PASS,pdfBuffer) => {
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

    const subject = "Payment Received – Your Airwire Invoice is Attached";
    

  const mailOptions = {
    from: `"AirWire" <${EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "Airwire_Invoice.pdf",
        path: pdfBuffer, // ✅ send file path here
        contentType: "application/pdf"
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};

export const sendFailedPaymentEmail = async (to, html,EMAIL_USER,EMAIL_PASS,pdfBuffer) => {
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

    const subject = "Payment Failed – Your Airwire Payment Attempt was Unsuccessful";
    

  const mailOptions = {
    from: `"AirWire" <${EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments: [
      {
        filename: "Airwire_Invoice.pdf",
        path: pdfBuffer, // ✅ send file path here
        contentType: "application/pdf"
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};