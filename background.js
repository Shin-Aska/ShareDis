browser.pageAction.onClicked.addListener(async (tab) => {
    const pageTitle = tab.title;
    const pageURL = tab.url;
    pasteToClipboard(await fillFormatStructure(pageURL, pageTitle, await getFormats()))
});

browser.contextMenus.removeAll().then(() => {
    browser.contextMenus.create({
        id: "share-dis-copy-page",
        title: "Copy page URL as formatted link to clipboard",
        contexts: ["page", "selection", "link"]
    });
    browser.contextMenus.create({
        id: "share-dis-copy-selection",
        title: "Quote selected text in page as formatted link to clipboard",
        contexts: ["selection"]
    });
    browser.contextMenus.create({
        id: "share-dis-copy-link",
        title: "Copy highlighted link in page as formatted link to clipboard",
        contexts: ["link"]
    });
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
    let pageTitle = tab.title;
    let pageURL = tab.url;
    let method = 'default';
    if (info.menuItemId === "share-dis-copy-link" && info.linkUrl) {
        pageURL = info.linkUrl;
    }
    else if (info.menuItemId === "share-dis-copy-selection" && info.selectionText) {
        pageTitle = `‟${info.selectionText}”`;
        method = 'quote';
    }
    pasteToClipboard(await fillFormatStructure(pageURL, pageTitle, await getFormats(method)));
});