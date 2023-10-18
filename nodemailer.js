const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendMail() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true, // true for 465, false for other ports
    port: 465,
    auth: {
        user: 'fabiolabclinico@gmail.com',
        pass: 'lsxw svad pfjx qjdy'
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'fabiolabclinico@gmail.com', // sender address
    to: "jyjavierop@gmail.com, fabian.jovalle1@gmail.com", // list of receivers
    subject: "Inicio Lab clinico", // Subject line
    text: "Este es el primer correo en la historia de este laboratorio clinico", // plain text body
    html: "<b>Este es el primer correo en la historia de este laboratorio clinico</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

sendMail();
