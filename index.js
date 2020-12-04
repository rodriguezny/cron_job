const cron = require('node-cron');
const express = require('express');
const nodeMailer = require('nodemailer');
const SMTPTransport = require('nodemailer/lib/smtp-transport');

const app = express();

let testAccount = nodeMailer.createTestAccount((err) => {
        if(err) {
            console.error('Failed to create test account. ' + err.message)
            return process.exit(1);
        }
        console.log('Credentials obtained, sending message...')
    });
cron.schedule("* * * * *", async () => {
    console.log('Running cron job');
    
    let transporter = nodeMailer.createTransport(new SMTPTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.spass // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        },
        sendMail : true
    }));

    const mailOptions = {
        from: '"John Doe" <john.doe@example.com>', // sender address
        to: 'jane.doe@example.com', // list of receivers
        subject: 'Hello there!', // Subject line
        // text: 'A Message from Node Cron App', // plain text body
        html: '<b>A Message from Node Cron App</b>' // html body
        };
        transporter.sendMail(mailOptions).then(info => {
            console.log(info.id);
            console.log(nodeMailer.getTestMessageUrl);
        }).catch(error => console.log(error));
});

let port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server run on port::${port}`));