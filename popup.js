// popup.js

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('exportContacts').addEventListener('click', exportContacts);
  document.getElementById('configureHubSpot').addEventListener('click', configureHubSpot);
});

function exportContacts() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        files: ['linkedin-content.js']
      },
      () => {
        chrome.tabs.sendMessage(activeTab.id, { action: 'extractContacts' }, (response) => {
          if (chrome.runtime.lastError) {
            document.getElementById('status').textContent = `Error: ${chrome.runtime.lastError.message}`;
          } else if (response && response.contacts.length > 0) {
            document.getElementById('status').textContent = `Exported ${response.contacts.length} contacts to HubSpot`;
            // Here, you would add the code to send the contacts to HubSpot
          } else {
            document.getElementById('status').textContent = 'No contacts found to export. Make sure you are on the correct LinkedIn page.';
          }
        });
      }
    );
  });
}

function configureHubSpot() {
  chrome.storage.sync.get(['hubspotApiKey'], (result) => {
    const apiKey = prompt('Enter your HubSpot API Key:', result.hubspotApiKey || '');
    if (apiKey) {
      chrome.storage.sync.set({ hubspotApiKey: apiKey }, () => {
        alert('HubSpot API Key saved successfully');
      });
    }
  });
}
