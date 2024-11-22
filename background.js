chrome.runtime.onInstalled.addListener(() => {
  console.log('LinkedIn to HubSpot Contact Exporter installed');
});

// Listen for messages to send contacts to HubSpot
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'exportToHubSpot') {
    const contacts = request.contacts;
    const apiKey = request.apiKey; // Make sure the API Key is passed here
    exportContactsToHubSpot(contacts, apiKey)
      .then(() => {
        sendResponse({ status: 'success' });
      })
      .catch((error) => {
        console.error("Error exporting to HubSpot:", error);
        sendResponse({ status: 'error', message: error.message });
      });
    return true; // Keep the message channel open for asynchronous response
  }
});

async function exportContactsToHubSpot(contacts, apiKey) {
  const url = 'https://api.hubapi.com/contacts/v1/contact/';

  for (const contact of contacts) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: [
          { property: 'firstname', value: contact.fullName.split(' ')[0] },
          { property: 'lastname', value: contact.fullName.split(' ').slice(1).join(' ') },
          { property: 'jobtitle', value: contact.headline },
          { property: 'company', value: contact.company },
          { property: 'email', value: contact.email }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to export contact: ${response.statusText}`);
    }
  }
}
