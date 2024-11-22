document.getElementById('saveButton').addEventListener('click', () => {
    const apiKey = document.getElementById('hubspotApiKey').value;
    chrome.storage.sync.set({ hubspotApiKey: apiKey }, () => {
        document.getElementById('status').textContent = 'HubSpot API Key saved successfully';
    });
});

// Load the saved API key if it exists
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['hubspotApiKey'], (result) => {
        if (result.hubspotApiKey) {
            document.getElementById('hubspotApiKey').value = result.hubspotApiKey;
        }
    });
});
