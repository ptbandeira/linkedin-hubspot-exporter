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

    // Using the specific selectors you provided
    const nameElement = document.querySelector('#profile-card-section > section._header_sqh8tm > div:nth-child(1) > div.rJkHgUAlibrlvxSdOPqapjdnLcxtvFCpmzOw > h1');
    const jobTitleElement = document.querySelector('#profile-card-section > section.RFyhPFugbUnuvokFTmGITzmcvFwPINVwGYEc.wide._inset-padding_sqh8tm > div > div > div.jELqyFWuKDOfbqoXLNVeDZOgmJfLFTStbkM._lockup-content-overflow-hidden_p4eb22 > p._current-role-item_th0xau._headingText_e3b563._default_1i6ulk._sizeSmall_e3b563 > span');
    const companyElement = document.querySelector('#profile-card-section > section.RFyhPFugbUnuvokFTmGITzmcvFwPINVwGYEc.wide._inset-padding_sqh8tm > section > div > address > ul > li > a > span._secondary-link_hqxetg');

    if (nameElement) {
        const fullName = nameElement.textContent.trim().split(' ');

        const contact = {
            firstName: fullName[0] || '',
            lastName: fullName.slice(1).join(' ') || '',
            profileUrl: '', // Since no profile URL was provided in the selectors
            headline: jobTitleElement ? jobTitleElement.textContent.trim() : '',
            jobTitle: jobTitleElement ? jobTitleElement.textContent.trim() : '',
            company: companyElement ? companyElement.textContent.trim() : '',
            companyUrl: '', // Assuming no direct link URL provided from the selectors
            email: '' // LinkedIn does not typically show email addresses directly
        };

        // Logging the extracted contact to verify the output
        console.log('Extracted contact:', contact);
        contacts.push(contact);
    } else {
        console.warn('Could not extract contact details.');
    }

    return contacts;
}
