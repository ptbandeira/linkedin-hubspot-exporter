document.getElementById('exportContacts').addEventListener('click', async () => {
    try {
        // Attempt to send a message to content script to extract contacts
        let attempts = 0;
        const maxAttempts = 5;
        let contacts = null;

        // Retry logic to account for timing issues when content script is not immediately ready
        while (attempts < maxAttempts) {
            try {
                contacts = await sendMessageToContentScript({ action: 'extractContacts' });
                if (contacts) break; // Exit loop if successful
            } catch (error) {
                console.warn(`Attempt ${attempts + 1} failed. Retrying...`);
                attempts++;
                await new Promise(res => setTimeout(res, 500)); // Wait for half a second before retrying
            }
        }

        if (!contacts || contacts.length === 0) {
            throw new Error("No contacts found to export. Make sure you are on the correct LinkedIn page.");
        }

        document.getElementById('status').textContent = `Exported ${contacts.length} contacts to HubSpot`;
    } catch (error) {
        document.getElementById('error').textContent = `Export failed: ${error.message}`;
    }
});

document.getElementById('configureHubSpot').addEventListener('click', () => {
    chrome.storage.sync.get(['hubspotApiKey'], (result) => {
        const apiKey = prompt('Enter your HubSpot API Key:', result.hubspotApiKey || '');

        if (apiKey) {
            chrome.storage.sync.set({ hubspotApiKey: apiKey }, () => {
                alert('HubSpot API Key saved successfully');
            });
        }
    });
});

// Function to send a message to the content script
async function sendMessageToContentScript(message) {
    const tabId = await getCurrentTabId();
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, (response) => {
            if (chrome.runtime.lastError || !response) {
                return reject(chrome.runtime.lastError);
            }
            resolve(response);
        });
    });
}

// Function to get the current active tab's ID
async function getCurrentTabId() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0].id);
        });
    });
}
