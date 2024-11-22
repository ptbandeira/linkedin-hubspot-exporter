chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractContacts') {
        try {
            const contacts = extractLinkedInContacts();
            sendResponse(contacts);
        } catch (error) {
            console.error("Failed to extract contacts:", error);
            sendResponse([]); // Return empty array on error
        }
    }
    // Let Chrome know we will send the response asynchronously
    return true; 
});

function extractLinkedInContacts() {
    const contacts = [];
    const contactCards = document.querySelectorAll('.search-result__info');

    if (!contactCards || contactCards.length === 0) {
        console.warn("No contacts found on the current LinkedIn page.");
        return contacts; // Return empty array if no contacts are found
    }

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
        } else {
            console.warn("Unable to find name or profile link for a contact.");
        }
    });

    return contacts;
}
