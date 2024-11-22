// This code is the entire linkedin-content.js file

// Log message to confirm the content script is loaded
console.log("LinkedIn content script loaded");

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractContacts') {
        try {
            const contacts = extractLinkedInContacts();
            console.log('Extracted Contacts:', contacts); // Log the contacts we found
            sendResponse(contacts);
        } catch (error) {
            console.error("Error extracting contacts:", error);
            sendResponse([]); // Send an empty array if there's an error
        }
    }
    return true; // Indicates asynchronous response
});

// Function to extract contacts from LinkedIn
function extractLinkedInContacts() {
    const contacts = [];

    // Find the contact card elements
    const contactCards = document.querySelectorAll('div');

    console.log('Number of div elements found:', contactCards.length);

    contactCards.forEach(card => {
        const nameElement = card.querySelector('h1') ||
                            card.querySelector('span[data-anonymize="person-name"]');

        if (nameElement) {
            const fullName = nameElement.textContent.trim().split(' ');

            const contact = {
                firstName: fullName[0] || '',
                lastName: fullName.slice(1).join(' ') || '',
                profileUrl: '', // Optional - Add profile URL logic if needed
                headline: '', // Simplified - no headline extraction for now
                jobTitle: '', // Simplified - no job title extraction for now
                company: '', // Simplified - no company extraction for now
                companyUrl: '', // Optional - Add company URL logic if needed
                email: '' // LinkedIn does not show email addresses directly
            };

            console.log('Extracted contact:', contact);
            contacts.push(contact);
        }
    });

    return contacts;
}
