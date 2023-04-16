/**
 * This file contains JS for popup.html
 */

// Upon loading of popup.html DOM load
document.addEventListener('DOMContentLoaded', function() {

    // Function for saving the checkbox state in the synchronized storage
    const saveCheckboxChange = function() {

        // Container for the state of the checkbox
        const mapping = {};
        mapping[this.name] = this.checked;

        // Save the state to the synchronized storage
        chrome.storage.sync.set(mapping);

        // Reload all the tabs with YT subscriptions open
        chrome.tabs.query({url : "https://www.youtube.com/feed/subscriptions*"}, (tabs) => {
            for (const t of tabs) {
                chrome.tabs.reload(t.id);
            }
        });
    }

    // For every checkbox in popup.html
    for (const e of document.querySelectorAll('input')) {

        // Retrieve the state of the checkbox from the synchronized storage
        chrome.storage.sync.get(e.name, function(result) {

            // Update the state of the checkbox in the DOM
            e.checked = result[e.name] === true || result[e.name] === undefined;
        });

        // Attach the saveCheckboxChange function to the change event
        e.addEventListener('change', saveCheckboxChange, false)
    }

}, false);
