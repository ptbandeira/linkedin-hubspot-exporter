// This is the entire background.js file

chrome.runtime.onInstalled.addListener(() => {
    console.log('LinkedIn to HubSpot Contact Exporter installed');
});

// No reference to an options page - simple background initialization
