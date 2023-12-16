browser.pageAction.onClicked.addListener(async (tab) => {
        const pageTitle = tab.title;
        const pageURL = tab.url;
        pasteToClipboard(fillFormatStructure(pageURL, pageTitle, await getFormat()))
});