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

    // Generic selector to find name, job title, etc.
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
                profileUrl: '', // Profile URL can be added if found
                headline: '', // No headline for now, simplifying
                jobTitle: '', // No job title for now, simplifying
                company: '', // No company name for now, simplifying
                companyUrl: '', // No company URL for now, simplifying
                email: '' // No email, as it's not usually shown directly
            };

            console.log('Extracted contact:', contact);
            contacts.push(contact);
        }
    });

    return contacts;
}
