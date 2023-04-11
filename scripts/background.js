// Message listener which simply displays the text of the message received as the extension badge.
chrome.runtime.onMessage.addListener(function(message, sender) {
    chrome.action.setBadgeText({text: message});
});
