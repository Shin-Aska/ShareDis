browser.pageAction.onClicked.addListener((tab) => {
        const pageTitle = tab.title;
        const pageURL = tab.url;
        // Create the text to be copied to the clipboard
        const clipboardText = `${pageTitle} - ${pageURL}`;
        // Create a temporary textarea element to copy text to the clipboard
        navigator.clipboard.writeText(clipboardText);
});