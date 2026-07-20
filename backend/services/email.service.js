const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.log("Error connecting to email server: ", error)
    } else {
        console.log("Email server is ready to send messages")
    }
})

async function sendEmail(to, subject, text, html) {
    try {
        const info = await transporter.sendMail({
            from: `"GenAi-ResumeChecker" <${process.env.BREVO_SENDER_EMAIL}>`,
            to,
            subject,
            text,
            html
        })
        console.log("Message sent: %s", info.messageId)
    } catch (error) {
        console.log("Error sending email: ", error)
    }
}

module.exports = sendEmail