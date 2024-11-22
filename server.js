const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Allow all origins to access the proxy server
app.use(cors()); // Allow cross-origin requests from your extension

app.use(express.json()); // For parsing application/json

// Replace this with your actual HubSpot API Key
const HUBSPOT_API_KEY = 'pat-eu1-6c7f31d6-1485-4852-a40b-a7ff0cd87b03';

app.post('/hubspot-contact', async (req, res) => {
    const { contacts } = req.body;

    try {
        const responses = await Promise.all(
            contacts.map((contact) => {
                return axios.post(
                    'https://api.hubapi.com/contacts/v1/contact/',
                    {
                        properties: [
                            { property: 'firstname', value: contact.fullName.split(' ')[0] },
                            { property: 'lastname', value: contact.fullName.split(' ').slice(1).join(' ') },
                            { property: 'jobtitle', value: contact.headline },
                            { property: 'company', value: contact.company },
                            { property: 'email', value: contact.email }
                        ]
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            })
        );

        // Set the CORS header for the response to your extension's origin
        res.header('Access-Control-Allow-Origin', '*'); // Allow CORS from any origin
        res.status(200).json({ success: true, responses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = 5001; // You can change this to 5000 if you'd prefer
app.listen(PORT, () => {
    console.log(`Proxy server is running at http://localhost:${PORT}`);
});
