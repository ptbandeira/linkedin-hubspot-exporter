// linkedin-content.js

// Log to confirm the content script is loaded
console.log("LinkedIn content script loaded");

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContacts') {
    try {
      const contacts = extractLinkedInContacts();
      console.log('Extracted Contacts:', contacts);
      sendResponse({ contacts });
    } catch (error) {
      console.error("Error extracting contacts:", error);
      sendResponse({ contacts: [] });
    }
  }
  return true; // Indicates asynchronous response
});

// Function to extract contacts from LinkedIn
function extractLinkedInContacts() {
  const contacts = [];

  // Select all profile cards on the page
  const profileCards = document.querySelectorAll('.entity-result__item');

  profileCards.forEach(card => {
    const nameElement = card.querySelector('.entity-result__title-text a span span');
    const occupationElement = card.querySelector('.entity-result__primary-subtitle');
    const locationElement = card.querySelector('.entity-result__secondary-subtitle');

    if (nameElement && occupationElement && locationElement) {
      const fullName = nameElement.textContent.trim().split(' ');
      const firstName = fullName[0] || '';
      const lastName = fullName.slice(1).join(' ') || '';
      const occupation = occupationElement.textContent.trim();
      const location = locationElement.textContent.trim();
      const profileUrl = card.querySelector('.entity-result__title-text a').href;

      const contact = {
        firstName,
        lastName,
        occupation,
        location,
        profileUrl
      };

      contacts.push(contact);
    }
  });

  return contacts;
}
