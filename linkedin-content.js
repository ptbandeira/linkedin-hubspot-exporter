chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractContacts') {
        try {
            const contacts = extractLinkedInContacts();
            console.log('Extracted Contacts:', contacts); // Log extracted contacts
            sendResponse(contacts);
        } catch (error) {
            console.error("Error extracting contacts:", error);
            sendResponse([]); // Send an empty array in case of error
        }
    }
    return true; // Indicate asynchronous response
});

function extractLinkedInContacts() {
    const contacts = [];

    // Assuming the LinkedIn page has multiple profiles that we want to extract
    const contactCards = document.querySelectorAll('div._current-role-item_th0xau, div.entity-result__content');

    console.log('Number of contact cards found:', contactCards.length);

    contactCards.forEach(card => {
        // Extracting the name from the <h1> tag
        const nameElement = card.querySelector('h1[data-anonymize="person-name"]');
        const profileLinkElement = card.querySelector('a[href*="/in/"]'); // Profile link
        const headlineElement = card.querySelector('span[data-anonymize="headline"]');
        const jobTitleElement = card.querySelector('span[data-anonymize="job-title"]');
        const companyElement = card.querySelector('a[data-anonymize="company-name"]');
        const companyLogoElement = card.querySelector('img[data-anonymize="company-logo"]');

        // Verifying all elements to ensure we can extract them without null errors
        if (nameElement) {
            const fullName = nameElement.textContent.trim().split(' ');

            const contact = {
                firstName: fullName[0],
                lastName: fullName.slice(1).join(' '),
                profileUrl: profileLinkElement ? profileLinkElement.href : '',
                headline: headlineElement ? headlineElement.textContent.trim() : '',
                jobTitle: jobTitleElement ? jobTitleElement.textContent.trim() : '',
                company: companyElement ? companyElement.textContent.trim() : '',
                companyUrl: companyElement ? companyElement.href : '',
                companyLogoUrl: companyLogoElement ? companyLogoElement.src : '',
                email: '' // LinkedIn does not typically show email addresses directly
            };

            // Logging the extracted contact to verify the output
            console.log('Extracted contact:', contact);
            contacts.push(contact);
        } else {
            console.warn('Could not extract contact details from card:', card);
        }
    });

    return contacts;
}
