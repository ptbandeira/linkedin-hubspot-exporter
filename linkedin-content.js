console.log("LinkedIn content script loaded");

// Function to extract contact information
function extractContactInfo() {
    const contacts = [];

    // Find the main profile section or relevant container
    const profileSection = document.querySelector('.pv-top-card');

    if (profileSection) {
        // Extract the full name
        const fullNameElement = profileSection.querySelector('h1[data-anonymize="person-name"], h1');
        const fullName = fullNameElement ? fullNameElement.innerText.trim() : '';

        // Extract the headline
        const headlineElement = profileSection.querySelector('span[data-anonymize="headline"], .text-body-medium');
        const headline = headlineElement ? headlineElement.innerText.trim() : '';

        // Extract the current position and company
        const positionElement = profileSection.querySelector('span[data-anonymize="job-title"], .pv-text-details__left-panel span:first-child');
        const companyElement = profileSection.querySelector('a[data-anonymize="company-name"], .pv-text-details__left-panel span:nth-child(2)');
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
    } else {
        console.warn('Profile section not found');
    }

    return contacts;
}

// Function to wait for an element to be available on the page
function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutations, observerInstance) => {
        if (document.querySelector(selector)) {
            callback();
            observerInstance.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractContacts') {
        // Extract contacts when the popup requests it
        const contacts = extractContactInfo();
        sendResponse({ contacts });
    }
});

// Automatically trigger the extraction when elements are detected
waitForElement('h1[data-anonymize="person-name"], h1', () => {
    console.log("Target elements detected on the page");
    const contacts = extractContactInfo();
    console.log("Extracted contacts:", contacts);
});
