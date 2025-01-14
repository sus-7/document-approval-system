const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

class MailOptions {
    constructor(from, to, subject, htmlBody) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.html = htmlBody;
    }
}

module.exports = {
    transporter,
    MailOptions,
};
