document.getElementById('exportContacts').addEventListener('click', async () => {
    try {
        // Send message to content script to extract contacts
        const contacts = await chrome.tabs.sendMessage(
            await getCurrentTabId(), 
            { action: 'extractContacts' }
        );
        
        // Send contacts to HubSpot
        await exportToHubSpot(contacts);
        
        document.getElementById('status').textContent = 
            `Exported ${contacts.length} contacts to HubSpot`;
    } catch (error) {
        document.getElementById('error').textContent = 
            `Export failed: ${error.message}`;
    }
});

document.getElementById('configureHubSpot').addEventListener('click', () => {
    chrome.storage.sync.get(['hubspotApiKey'], (result) => {
        const apiKey = prompt('Enter your HubSpot API Key:', 
            result.hubspotApiKey || '');
        
        if (apiKey) {
            chrome.storage.sync.set({ hubspotApiKey: apiKey }, () => {
                alert('HubSpot API Key saved successfully');
            });
        }
    });
});

async function getCurrentTabId() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0].id);
        });
    });
}

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
                    { property: 'firstname', value: contact.firstName },
                    { property: 'lastname', value: contact.lastName },
                    { property: 'email', value: contact.email },
                    { property: 'linkedin_profile', value: contact.profileUrl }
                ]
            })
        });
    }
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
