require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serves index.html, about.html, services.html, contact.html, script.js automatically
app.use(express.static(path.join(__dirname, 'public')));

// ---- CONFIGURE THESE via environment variables (set in Render dashboard, or a local .env file) ----
const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL || 'allan@emventures.in';
const SMTP_USER = process.env.SMTP_USER; // account used to send (can differ from founder email)
const SMTP_PASS = process.env.SMTP_PASS;
// --------------------------------------------------------------------------------------------------

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});

app.post('/api/contact', async (req, res) => {
  const { name, company, email, phone, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const mailOptions = {
    from: SMTP_USER,
    to: FOUNDER_EMAIL,
    replyTo: email,
    subject: `New Inquiry from ${name} (${company || 'No company provided'})`,
    text: `
New contact form submission:

Name: ${name}
Company: ${company || '-'}
Email: ${email}
Phone: ${phone || '-'}
Service Required: ${service || '-'}

Message:
${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
