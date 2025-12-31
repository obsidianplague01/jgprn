// api/payments/submit-manual.js
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@jgpnr.ng';
const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP || '+2348012345678';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

export const config = {
  api: {
    bodyParser: false,
  },
};

const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 100);
};

const validateFile = (file) => {
  if (!file || !file.size || !file.mimetype) {
    throw new Error('Invalid file');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPG, PNG, and PDF allowed');
  }
};

const sendEmail = async (orderData, receiptPath) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const mailOptions = {
    from: SMTP_USER,
    to: ADMIN_EMAIL,
    subject: `New Payment Submission - ₦${orderData.grandTotal.toLocaleString()}`,
    text: orderData.summary,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">New Payment Notification</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Summary</h3>
          <p><strong>Total Amount:</strong> ₦${orderData.grandTotal.toLocaleString()}</p>
          <p><strong>Total Tickets:</strong> ${orderData.orderDetails.reduce((sum, item) => sum + item.tickets, 0)}</p>
        </div>
        <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h3>Customer Details</h3>
          ${orderData.orderDetails.map((item, i) => `
            <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
              <h4>Ticket ${i + 1}</h4>
              <p><strong>Name:</strong> ${item.firstName} ${item.lastName}</p>
              <p><strong>Email:</strong> ${item.email}</p>
              <p><strong>Phone:</strong> ${item.phone}</p>
              <p><strong>Location:</strong> ${item.location}</p>
              <p><strong>WhatsApp:</strong> ${item.whatsapp}</p>
              <p><strong>Tickets:</strong> ${item.tickets}</p>
              <p><strong>Amount:</strong> ₦${item.totalPrice.toLocaleString()}</p>
            </div>
          `).join('')}
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Receipt is attached to this email.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: path.basename(receiptPath),
        path: receiptPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

const sendWhatsAppNotification = async (orderData, receiptUrl) => {
  if (!WHATSAPP_API_KEY || !WHATSAPP_API_URL) {
    console.warn('WhatsApp API not configured');
    return;
  }

  const message = `
🔔 *New Payment Submission*

💰 *Amount:* ₦${orderData.grandTotal.toLocaleString()}
🎫 *Tickets:* ${orderData.orderDetails.reduce((sum, item) => sum + item.tickets, 0)}

👤 *Customer:* ${orderData.orderDetails[0]?.firstName} ${orderData.orderDetails[0]?.lastName}
📧 *Email:* ${orderData.orderDetails[0]?.email}
📱 *Phone:* ${orderData.orderDetails[0]?.phone}

Receipt attached.
  `.trim();

  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: ADMIN_WHATSAPP,
        message: message,
        media_url: receiptUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('WhatsApp notification failed:', error);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({
    maxFileSize: MAX_FILE_SIZE,
    uploadDir: '/tmp',
    keepExtensions: true,
  });

  try {
    const [fields, files] = await form.parse(req);

    const receiptFile = files.receipt?.[0];
    if (!receiptFile) {
      return res.status(400).json({ error: 'Receipt file is required' });
    }

    validateFile(receiptFile);

    const orderDetails = JSON.parse(fields.orderDetails?.[0] || '[]');
    const grandTotal = parseFloat(fields.grandTotal?.[0] || '0');
    const summary = fields.summary?.[0] || '';

    if (!orderDetails.length || !grandTotal) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    const timestamp = Date.now();
    const safeFilename = sanitizeFilename(receiptFile.originalFilename || 'receipt');
    const storagePath = path.join(process.cwd(), 'public', 'receipts', `${timestamp}_${safeFilename}`);
    
    await fs.mkdir(path.dirname(storagePath), { recursive: true });
    await fs.copyFile(receiptFile.filepath, storagePath);
    await fs.unlink(receiptFile.filepath);

    const receiptUrl = `/receipts/${timestamp}_${safeFilename}`;

    const orderData = {
      orderDetails,
      grandTotal,
      summary,
      receiptUrl,
      submittedAt: new Date().toISOString(),
    };

    await Promise.allSettled([
      sendEmail(orderData, storagePath),
      sendWhatsAppNotification(orderData, `${process.env.NEXT_PUBLIC_BASE_URL}${receiptUrl}`),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Payment submitted successfully',
    });

  } catch (error) {
    console.error('Payment submission error:', error);
    return res.status(500).json({
      error: error.message || 'Payment submission failed',
    });
  }
}