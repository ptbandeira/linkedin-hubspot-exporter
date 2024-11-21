{
  "manifest_version": 2,
  "name": "LinkedIn to HubSpot Contact Exporter",
  "version": "1.0",
  "description": "Export LinkedIn contacts directly to HubSpot",
  "permissions": [
    "activeTab",
    "https://www.linkedin.com/*",
    "https://app.hubspot.com/*",
    "storage"
  ],
  "browser_action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "images/icon16.png",
      "48": "images/icon48.png",
      "128": "images/icon128.png"
    }
  },
  "background": {
    "scripts": ["background.js"],
    "persistent": false
  },
  "content_scripts": [
    {
      "matches": ["https://www.linkedin.com/*"],
      "js": ["linkedin-content.js"]
    }
  ],
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  }
}
