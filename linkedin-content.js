chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractContacts') {
        const contacts = extractLinkedInContacts();
        return Promise.resolve(contacts);
    }
});

function extractLinkedInContacts() {
    const contacts = [];
    
    // This is a sample extraction method. You'll need to adjust based on 
    // the specific LinkedIn page/view you're extracting from
    const contactCards = document.querySelectorAll('.search-result__info');
    
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
        }
    });
    
    return contacts;
}
