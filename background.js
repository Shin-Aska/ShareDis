browser.pageAction.onClicked.addListener((tab) => {
        const pageTitle = tab.title;
        const pageURL = tab.url;
        pasteToClipboard(fillFormatStructure(pageURL, pageTitle, getFormat()))
});