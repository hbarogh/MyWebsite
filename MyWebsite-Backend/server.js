const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const serverless = require('serverless-http');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/send-email', async (req, res) => {
    const { email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,  // Use environment variables
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.RECIPIENT_EMAIL,  // Set this in Vercel's environment variables
        subject: 'New Message',
        text: message
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.send('Message sent successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending message.');
    }
});

module.exports = app;
module.exports.handler = serverless(app);