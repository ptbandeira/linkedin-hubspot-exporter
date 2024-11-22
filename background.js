chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('LinkedIn to HubSpot Contact Exporter installed');
        chrome.runtime.openOptionsPage(); // Guide user to configure API key on installation
    }

    // Set default HubSpot API key value
    chrome.storage.sync.set({ hubspotApiKey: '' }, () => {
        console.log('Default HubSpot API Key set to empty');
    });
});

// Optional: Centralized listener for various extension events
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'logActivity') {
        console.log('Activity Log:', request.data);
        sendResponse({ status: 'logged' });
    } else if (request.action === 'exportStarted') {
        console.log('Export process started...');
        sendResponse({ status: 'acknowledged' });
    }
    // Return true if the response is sent asynchronously
    return false;
});

// Monitor changes in chrome storage for API key updates
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.hubspotApiKey) {
        console.log('HubSpot API Key has been updated:', changes.hubspotApiKey.newValue);
    }
});
