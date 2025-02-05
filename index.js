const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const axios = require('axios'); // Import axios to make HTTP requests to Dialogflow

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Replace with your Dialogflow webhook URL
const DIALOGFLOW_WEBHOOK_URL = 'https://your-vercel-project.vercel.app/whatsapp';

// Endpoint to handle WhatsApp messages
app.post('/whatsapp', async (req, res) => {
    const message = req.body.Body;
    const from = req.body.From;

    // Send the incoming message to Dialogflow for processing
    try {
        const dialogflowResponse = await axios.post(DIALOGFLOW_WEBHOOK_URL, {
            text: message,
            sessionId: from,  // Use the phone number as a unique session ID
        });

        const replyMessage = dialogflowResponse.data.fulfillmentText || "Sorry, I didn't understand that.";

        // Respond back to WhatsApp using Twilio
        const twiml = new twilio.twiml.MessagingResponse();
        twiml.message(replyMessage);
        res.type('text/xml').send(twiml.toString());
    } catch (error) {
        console.error('Dialogflow request failed', error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));