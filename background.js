browser.pageAction.onClicked.addListener((tab) => {
        const pageTitle = tab.title;
        const pageURL = tab.url;
        // TODO: Add URL transformers, for example change m.youtube.com links to desktop links and vice versa
        // TODO: Find a way to make this modifiable so users can change it to their preference
        const clipboardText = `${pageTitle} - ${pageURL}`;
        // TODO: Find a way to unify this command with action.js
        navigator.clipboard.writeText(clipboardText);
});