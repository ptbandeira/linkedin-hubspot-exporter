console.log("LinkedIn content script loaded");

// Function to extract contact information from LinkedIn profiles
function extractContactInfo() {
    const contacts = [];

    // Find the main profile section
    const profileSection = document.querySelector('.pv-top-card');

    if (profileSection) {
        // Extract the full name
        const fullNameElement = profileSection.querySelector('h1[data-anonymize="person-name"]');
        const fullName = fullNameElement ? fullNameElement.innerText.trim() : '';

        // Extract the headline (profession or role)
        const headlineElement = profileSection.querySelector('span[data-anonymize="headline"]');
        const headline = headlineElement ? headlineElement.innerText.trim() : '';

        // Extract the current position and company
        const positionElement = profileSection.querySelector('span[data-anonymize="job-title"]');
        const companyElement = profileSection.querySelector('a[data-anonymize="company-name"]');
        const jobTitle = positionElement ? positionElement.innerText.trim() : '';
        const company = companyElement ? companyElement.innerText.trim() : '';

        // Construct the contact object
        const contact = {
            fullName,
            headline,
            jobTitle,
            company
        };

        contacts.push(contact);
    }

    return contacts;
}

// Listen for messages from the popup script to trigger contact extraction
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractContacts') {
        const contacts = extractContactInfo();
        sendResponse({ contacts });
    }
});
