document.getElementById('exportContacts').addEventListener('click', async () => {
    // Clear previous messages
    document.getElementById('status').textContent = '';
    document.getElementById('error').textContent = '';

    // Disable button while export is running
    const exportButton = document.getElementById('exportContacts');
    exportButton.disabled = true;

    try {
        // Get the current active tab
        const currentTabId = await getCurrentTabId();
        
        // Send message to content script to extract contacts
        const contacts = await chrome.tabs.sendMessage(currentTabId, { action: 'extractContacts' });

        // Check if contacts were extracted
        if (!Array.isArray(contacts) || contacts.length === 0) {
            throw new Error('No contacts found to export. Make sure you are on the correct LinkedIn page.');
        }

        // Send contacts to HubSpot
        await exportToHubSpot(contacts);

        // Update status with the number of exported contacts
        document.getElementById('status').textContent = `Exported ${contacts.length} contacts to HubSpot`;
    } catch (error) {
        // Display any errors encountered during export
        document.getElementById('error').textContent = `Export failed: ${error.message}`;
    } finally {
        // Enable button after export is complete
        exportButton.disabled = false;
    }
});

document.getElementById('configureHubSpot').addEventListener('click', () => {
    chrome.storage.sync.get(['hubspotApiKey'], (result) => {
        const apiKey = prompt('Enter your HubSpot API Key:', result.hubspotApiKey || '');

        if (apiKey && apiKey.length > 10) { // Basic validation for API key length
            chrome.storage.sync.set({ hubspotApiKey: apiKey }, () => {
                document.getElementById('status').textContent = 'HubSpot API Key saved successfully';
            });
        } else {
            document.getElementById('error').textContent = 'Invalid API key entered';
        }
    });
});

// Function to get the current active tab ID
async function getCurrentTabId() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                resolve(tabs[0].id);
            } else {
                reject(new Error('No active tab found.'));
            }
        });
    });
}

// Function to export contacts to HubSpot
async function exportToHubSpot(contacts) {
    const apiKey = await getHubSpotApiKey();

    if (!apiKey) {
        throw new Error('HubSpot API Key is not configured. Please configure it first.');
    }

    // Ensure contacts is an array before proceeding
    if (!Array.isArray(contacts)) {
        throw new Error("Contacts is not an array");
    }

    // Create an array of fetch promises for all contacts
    const promises = contacts.map(async (contact) => {
        try {
            const response = await fetch('https://api.hubapi.com/contacts/v1/contact/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    properties: [
                        { property: 'firstname', value: contact.firstName },
                        { property: 'lastname', value: contact.lastName },
                        { property: 'email', value: contact.email },
                        { property: 'linkedin_profile', value: contact.profileUrl }
                    ]
                })
            });

            if (!response.ok) {
                console.error(`Failed to export contact ${contact.firstName} ${contact.lastName}: ${response.statusText}`);
            } else {
                console.log(`Successfully exported contact: ${contact.firstName} ${contact.lastName}`);
            }
        } catch (error) {
            console.error(`Error exporting contact ${contact.firstName} ${contact.lastName}:`, error);
        }
    });

    // Wait for all requests to complete
    await Promise.all(promises);
}

// Function to get HubSpot API Key from Chrome storage
async function getHubSpotApiKey() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['hubspotApiKey'], (result) => {
            if (result.hubspotApiKey) {
                resolve(result.hubspotApiKey);
            } else {
                reject(new Error('HubSpot API Key not configured'));
            }
        });
    });
}
