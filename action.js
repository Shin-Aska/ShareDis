function copyTitleAndURLToClipboard() {
    // Get the page title and URL
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs);
        let tab = tabs[0];
        const pageTitle = tab.title;
        const pageURL = tab.url;

        pasteToClipboard(fillFormatStructure(pageURL, pageTitle, getFormat()))
    });

}

tagify = new Tagify (document.getElementById("format-controller"));
var dragsort = new DragSort(tagify.DOM.scope, {
    selector: '.'+tagify.settings.classNames.tag,
    callbacks: {
        dragEnd: onDragEnd
    }
});
tagify.addTags(["banana", "orange", "apple"]);


// must update Tagify's value according to the re-ordered nodes in the DOM
function onDragEnd(elm){
    tagify.updateValueByDOMTags()
}
