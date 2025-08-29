const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Create a transporter using Outlook
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'ic3.kontakt@outlook.com',
        pass: 'YOUR_PASSWORD' // You'll need to set this in an environment variable
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    }
});

app.post('/send-email', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Email content
        const mailOptions = {
            from: '"IC3 Contact Form" <ic3.kontakt@outlook.com>',
            to: 'ic3.kontakt@outlook.com',
            subject: 'Fråga från IC3 webbplats',
            text: `Namn: ${name}\n\nE-post: ${email}\n\nMeddelande:\n${message}`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: 'E-posten har skickats!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Fel vid skickandet av e-post.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
