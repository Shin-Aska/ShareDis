browser.pageAction.onClicked.addListener(async (tab) => {
        const pageTitle = tab.title;
        const pageURL = tab.url;
        pasteToClipboard(await fillFormatStructure(pageURL, pageTitle, await getFormats()))
});