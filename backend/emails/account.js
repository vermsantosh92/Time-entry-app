
const sgMail = require('@sendgrid/mail');
const sendGridAPIKey = "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";


sgMail.setApiKey(sendGridAPIKey);


const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
      to : "email",
      from : 'santosh.verma.92@outlook.com',
      subject : "Thanks for Joining us, we're excited you're here!!",
      text :

      `Welcome to the App, ${email}
 we are so happy to have you! let's remove some
 busy work from your day....

   Cheers!!

      `
    })
}

module.exports =  sendWelcomeEmail

