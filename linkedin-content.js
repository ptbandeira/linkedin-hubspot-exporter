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
    
    // Attempting to select all contact cards on LinkedIn
    const contactCards = document.querySelectorAll('.search-result__info');
    
    console.log('Number of contact cards found:', contactCards.length);

    contactCards.forEach(card => {
        const nameElement = card.querySelector('.actor-name');
        const profileLink = card.querySelector('a.search-result__result-link');
        const titleElement = card.querySelector('.subline-level-1');

        if (nameElement && profileLink) {
            const fullName = nameElement.textContent.trim().split(' ');

            contacts.push({
                firstName: fullName[0],
                lastName: fullName.slice(1).join(' '),
                profileUrl: profileLink.href,
                title: titleElement ? titleElement.textContent.trim() : '',
                email: '' // LinkedIn doesn't typically show emails directly
            });

            console.log('Extracted contact:', contacts[contacts.length - 1]); // Log each extracted contact
        } else {
            console.warn('Could not extract contact details from card:', card);
        }
    });

    return contacts;
}
