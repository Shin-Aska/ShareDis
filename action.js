function copyTitleAndURLToClipboard() {
    // Get the page title and URL
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs);
        let tab = tabs[0];
        const pageTitle = tab.title;
        const pageURL = tab.url;

        // Create the text to be copied to the clipboard
        const clipboardText = `${pageTitle} - ${pageURL}`;

        // Create a temporary textarea element to copy text to the clipboard
        navigator.clipboard.writeText(clipboardText);
    });

}

copyTitleAndURLToClipboard();
