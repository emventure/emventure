require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { Resend } = require('resend');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static website files
app.use(express.static(__dirname));

const resend = new Resend(process.env.RESEND_API_KEY);

const FOUNDER_EMAIL =
  process.env.FOUNDER_EMAIL || 'allan@emventures.in';

app.post('/api/contact', async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      service,
      message
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    await resend.emails.send({
      from: 'EM Ventures <noreply@emventures.in>',
      to: FOUNDER_EMAIL,
      replyTo: email,
      subject: `New Inquiry from ${name}`,
      text: `
New Contact Form Submission

Name: ${name}

Company: ${company || "-"}

Email: ${email}

Phone: ${phone || "-"}

Service: ${service || "-"}

Message:

${message}
`
    });

    return res.json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Failed to send email"
    });

  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
