// import puppeteer from 'puppeteer';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Fix __dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const generatePDF = async (htmlContent) => {
//   // Absolute path to Invoice folder
//   const invoiceDir = path.join(__dirname, '../Invoice'); // adjust path if needed

//   // Create folder if it doesn't exist
//   if (!fs.existsSync(invoiceDir)) {
//     fs.mkdirSync(invoiceDir, { recursive: true });
//   }

//   // Create filename with timestamp
//   const fileName = `invoice_${Date.now()}.pdf`;
//   const filePath = path.join(invoiceDir, fileName);

//   // Launch Puppeteer
//   const browser = await puppeteer.launch({
//     headless: 'new', // required for newer puppeteer versions
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });

//   const page = await browser.newPage();

//   await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

//   await page.pdf({
//     path: filePath,
//     format: 'A4',
//     printBackground: true,
//     margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
//   });

//   await browser.close();
//   return filePath; // return the generated path to attach in mail
// };
// 

// generatePDF.js
import pdf from 'html-pdf-node';

export const generatePDF = async (htmlContent) => {
  const file = { content: htmlContent };
  const options = {
    format: 'A4',
    printBackground: true
  };
  return await pdf.generatePdf(file, options);
};






