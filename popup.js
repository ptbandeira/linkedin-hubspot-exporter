document.addEventListener('DOMContentLoaded', () => {
  const exportButton = document.getElementById('exportContacts');
  const statusElement = document.getElementById('status');

  exportButton.addEventListener('click', () => {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      // Send a message to the content script to extract contacts
      chrome.tabs.sendMessage(activeTab.id, { action: 'extractContacts' }, (response) => {
        if (chrome.runtime.lastError) {
          statusElement.textContent = 'Error: ' + chrome.runtime.lastError.message;
        } else if (response && response.contacts && response.contacts.length > 0) {
          // Process the extracted contacts
          const contacts = response.contacts;
          statusElement.textContent = `Found ${contacts.length} contact(s).`;

          // Here you can add code to export contacts to HubSpot
          // For example, send contacts to your server or directly to HubSpot API
        } else {
          statusElement.textContent = 'No contacts found to export. Make sure you are on the correct LinkedIn page.';
        }
      });
    });
  });
});
