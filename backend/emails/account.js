
const sgMail = require('@sendgrid/mail');
const sendGridAPIKey = "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";


sgMail.setApiKey(sendGridAPIKey);


const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
      to : email,
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

