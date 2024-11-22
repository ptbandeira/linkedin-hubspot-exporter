console.log("LinkedIn content script loaded");

// Function to extract contact information from LinkedIn profiles
function extractContactInfo() {
    const contacts = [];

    // Full Name
    const fullNameElement = document.querySelector('h1[data-anonymize="person-name"]');
    const fullName = fullNameElement ? fullNameElement.innerText.trim() : '';

    // Job Title (Headline)
    const headlineElement = document.querySelector('span[data-anonymize="job-title"]');
    const headline = headlineElement ? headlineElement.innerText.trim() : '';

    // Email Address (sometimes it's present)
    const emailElement = document.querySelector('span[data-anonymize="email"]');
    const email = emailElement ? emailElement.innerText.trim() : '';

    // Company Logo (or company name, or URL)
    const companyElement = document.querySelector('img[data-anonymize="company-logo"]');
    const company = companyElement ? companyElement.alt.trim() : ''; // Using alt attribute as company name

    // Construct the contact object
    const contact = {
        fullName,
        headline,
        email,
        company
    };

    contacts.push(contact);
    return contacts;
}

// Listen for messages from the popup script to trigger contact extraction
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractContacts') {
        const contacts = extractContactInfo();
        sendResponse({ contacts });
    }
});
