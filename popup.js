document.getElementById('exportContacts').addEventListener('click', async () => {
    // Clear previous messages
    document.getElementById('status').textContent = '';
    document.getElementById('error').textContent = '';

    // Disable button while export is running
    const exportButton = document.getElementById('exportContacts');
    exportButton.disabled = true;

    try {
        // Send message to content script to extract contacts
        const contacts = await chrome.tabs.sendMessage(
            await getCurrentTabId(), 
            { action: 'extractContacts' }
        );

        // Ensure contacts is an array
        if (!Array.isArray(contacts)) {
            throw new Error("Extracted contacts are not in the correct format");
        }

        // Send contacts to HubSpot
        await exportToHubSpot(contacts);

        document.getElementById('status').textContent = 
            `Exported ${contacts.length} contacts to HubSpot`;
    } catch (error) {
        document.getElementById('error').textContent = 
            `Export failed: ${error.message}`;
    } finally {
        // Enable button after export is complete
        exportButton.disabled = false;
    }
});

document.getElementById('configureHubSpot').addEventListener('click', () => {
    chrome.storage.sync.get(['hubspotApiKey'], (result) => {
        const apiKey = prompt('Enter your HubSpot API Key:', result.hubspotApiKey || '');

        if (apiKey && apiKey.length > 10) { // Simplified validation for API key
            chrome.storage.sync.set({ hubspotApiKey: apiKey }, () => {
                document.getElementById('status').textContent = 'HubSpot API Key saved successfully';
            });
        } else {
            document.getElementById('error').textContent = 'Invalid API key entered';
        }
    });
});

async function getCurrentTabId() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) {
                throw new Error("No active tab found");
            }
            resolve(tabs[0].id);
        });
    });
}

async function exportToHubSpot(contacts) {
    const apiKey = await getHubSpotApiKey();

    // Ensure contacts is an array before proceeding
    if (!Array.isArray(contacts)) {
        throw new Error("Contacts is not an array");
    }

    // Create an array of fetch promises for all contacts
    const promises = contacts.map(contact => 
        fetch('https://api.hubapi.com/contacts/v1/contact/', {
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
        }).catch(err => {
            console.error(`Failed to export contact ${contact.email || 'unknown'}:`, err);
        })
    );

    // Wait for all requests to complete
    await Promise.all(promises);
}

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
