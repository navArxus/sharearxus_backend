const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service:"gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "sharearxus@gmail.com",
        pass: process.env.NODE_MAILER_PASS,
    },
})

const sendMail = async(to , subject , content) => {

    try {
        const info = await transporter.sendMail({
            from:{
                name:"Share arxus verification",
                address:"sharearxus@gmail.com"
            },
            to:to,
            subject:subject,
            text:content,   
        })
        // alert("message Sent to  "+info.envelope.to[0])
        console.log(`Message Sent Successfully ${info.messageId}`)
        return info;
    } catch(err) {
        console.log(err)
    }
}

module.exports = sendMail