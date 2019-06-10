const sgMail = require("@sendgrid/mail");

const sendGridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendGridApiKey)

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to:email,
        from:"bhaggi007@gmail.com",
        subject: "Thanks for joining in!",
        text: `Welcome to the app ${name}. Let me know how you get along with the app.`
    })

}

const sendCancellationEmail = (email,name) => {
    sgMail.send({
        to:email,
        from:"bhaggi007@gmail.com",
        subject: "Sad to see you go!",
        text: `Hi, ${name} sad to see you go. Please let us know what we could have done to serve you better. We hope to see you back soon`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}