document.addEventListener('DOMContentLoaded', () => {
  const exportButton = document.getElementById('exportContacts');
  const configureButton = document.getElementById('configureHubSpot');
  const statusElement = document.getElementById('status');
  const errorElement = document.getElementById('error');

  // Export Contacts Button
  exportButton.addEventListener('click', async () => {
    try {
      // Get the active tab
      const tabs = await getCurrentTab();
      const activeTab = tabs[0];

      // Send a message to the content script to extract contacts
      const contacts = await sendMessageToContentScript(activeTab.id, { action: 'extractContacts' });

      // Handle the extracted contacts
      if (contacts && contacts.length > 0) {
        statusElement.textContent = `Found ${contacts.length} contact(s). Exporting to HubSpot...`;
        await exportToHubSpot(contacts);
        statusElement.textContent = `Exported ${contacts.length} contact(s) to HubSpot successfully!`;
      } else {
        statusElement.textContent = 'No contacts found to export. Make sure you are on the correct LinkedIn page.';
      }
    } catch (error) {
      errorElement.textContent = `Export failed: ${error.message}`;
    }
  });

  // Configure HubSpot Button
  configureButton.addEventListener('click', () => {
    chrome.storage.sync.get(['hubspotApiKey'], (result) => {
      const apiKey = prompt('Enter your HubSpot API Key:', result.hubspotApiKey || '');

      if (apiKey) {
        chrome.storage.sync.set({ hubspotApiKey: apiKey }, () => {
          alert('HubSpot API Key saved successfully!');
        });
      }
    });
  });
});

// Function to send a message to the content script
async function sendMessageToContentScript(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response.contacts || []);
      }
    });
  });
}

// Function to get the current active tab
async function getCurrentTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs);
    });
  });
}

// Function to export contacts to HubSpot
async function exportToHubSpot(contacts) {
  const apiKey = await getHubSpotApiKey();

  for (const contact of contacts) {
    await fetch('https://api.hubapi.com/contacts/v1/contact/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: [
          { property: 'firstname', value: contact.fullName.split(' ')[0] || '' },
          { property: 'lastname', value: contact.fullName.split(' ').slice(1).join(' ') || '' },
          { property: 'jobtitle', value: contact.jobTitle || '' },
          { property: 'company', value: contact.company || '' }
        ]
      })
    });
  }
}

// Function to get the HubSpot API key from storage
async function getHubSpotApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['hubspotApiKey'], (result) => {
      if (result.hubspotApiKey) {
        resolve(result.hubspotApiKey);
      } else {
        reject(new Error('HubSpot API Key is not configured.'));
      }
    });
  });
}
