import { body } from "express-validator";
import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
    console.log("Options",options);
    console.log("Options mailgenContent",options.mailgenContent);
    
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Project Manager',
            link: 'https://mailgen.js/',

        }
    });

    const emailWithPlainText = mailGenerator.generatePlaintext(options.mailgenContent);

    const emailwithHtml = mailGenerator.generate(options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASSWORD,
        },
    });

    const mail = {
        from: 'mail.psm.team@support.com', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: emailWithPlainText, // plain text body
        html: emailwithHtml, // html body
    }

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.log(`Error while sending a email ${error}.`);        
    }
    
}

const emailVerificationMailgenContent = (username, verificationURL) => {
    return {
        body : {
            name : username,
            intro : "Welcome to PMS! We\'re very excited to have you on board.",
            action: {
                instructions: 'To get started with PMS, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Verify your account',
                    link: verificationURL,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        },
    };
}

const forgotPasswordMailgenContent = (username, passwordResetURL) => {
    return {
        body : {
            name : username,
            intro : "We got a request to reset your password.",
            action: {
                instructions: 'To change your password click the button.',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset Password',
                    link: passwordResetURL,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        },
    };
}

export {
    sendMail,
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
}

