const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Enable CORS for all incoming requests (to allow requests from the Chrome extension)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// POST route to receive contacts and send them to HubSpot
app.post('/hubspot-contact', async (req, res) => {
  try {
    const { contacts, apiKey } = req.body;

    // Prepare the data for HubSpot API
    const hubSpotData = {
      properties: contacts.map(contact => ({
        property: 'firstname',
        value: contact.firstname
      }))
    };

    // Make a request to HubSpot API
    const response = await axios.post('https://api.hubapi.com/contacts/v1/contact/', hubSpotData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // If successful, respond with success message
    res.json({ success: true, message: 'Contacts added successfully.' });

  } catch (error) {
    console.error('Error while sending data to HubSpot:', error);

    // If there's an error, send the error message as response
    res.json({ success: false, message: error.message });
  }
});

// Start the server and listen on port 5001
app.listen(5001, () => {
  console.log('Proxy server running on port 5001');
});
