const nodemailer = require("nodemailer");

const sendEmail = async (Options) =>{

    const transporter= nodemailer.createTransport({
        host: "smtp.gmail.com",  
        port: 465,   
        service:"gmail",
        secure:false,
        auth:{
            user:process.env.SMTP_EMAIL ,
            pass: process.env.SMPT_PASSWORD
        }
    })

    const mailOptions= {
        from :process.env.SMTP_EMAIL,
        to : Options.email,
        subject: Options.subject,
        text: Options.message
    }
    await transporter.sendMail(mailOptions)

}

module.exports= sendEmail;
