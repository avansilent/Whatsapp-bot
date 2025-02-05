const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ New Route for Homepage
app.get("/", (req, res) => {
    res.send("WhatsApp Bot is Running!");
});

app.post('/whatsapp', (req, res) => {
    const message = req.body.Body;
    const from = req.body.From;

    let replyMessage = "I am your WhatsApp bot!";
    if (message.toLowerCase().includes('hello')) {
        replyMessage = "Hello! How can I help you today?";
    }

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(replyMessage);
    res.type('text/xml').send(twiml.toString());
});

app.listen(3000, () => console.log("Server running on port 3000"));
