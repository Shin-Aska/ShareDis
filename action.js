function copyTitleAndURLToClipboard() {
    // Get the page title and URL
    browser.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        console.log(tabs);
        let tab = tabs[0];
        const pageTitle = tab.title;
        const pageURL = tab.url;

        pasteToClipboard(fillFormatStructure(pageURL, pageTitle, await getFormat()))
    });
}

async function fill() {
    document.getElementById(`format-controller`).value = convertFormatToTagify(await getFormat());
}

fill().then(function() {
    var page_elements = [
        { value: `title`, text: `TITLE`, title: `Page Title` },
        { value: `url`, text: `URL`, title: `Page URL` }
    ]

    tagify = new Tagify (document.getElementById(`format-controller`), {
        mode: `mix`,
        pattern: /@|#/,
        tagTextProp: `text`,
        whitelist: page_elements,
        enforceWhitelist: true,
        dropdown : {
            enabled: 1,
            position: `text`,
            mapValueTo: `text`,
            highlightFirst: true
        },
    });
});

document.getElementById(`applyFormatBtn`).onclick = () => {
        var result = [];
        var tags = document.querySelector(`.tagify__input`).childNodes;

        for (let i = 0; i < tags.length; i++) {
            // If NodeType is Text
            if (tags[i].nodeType === 3) {
                if (tags[i].textContent !== `` && tags[i].textContent !== `​`) {
                    result.push({
                        type: `string`,
                        value: tags[i].textContent
                    })
                }
            }
            // If NodeType is Tag Element
            else if (tags[i].nodeType === 1) {
                if (tags[i].textContent === `TITLE`) {
                    result.push({
                        type: `title`,
                        value: null
                    })
                }
                else if (tags[i].textContent === `URL`) {
                    result.push({
                        type: `url`,
                        value: null
                    })
                }
            }
        }

        browser.storage.local.set({format: JSON.stringify(result)}, () => {
            alert(`Success`);
        });
    }

document.getElementById(`undoFormatBtn`).onclick = async () => {
    document.getElementById(`format-controller`).value = convertFormatToTagify(await getFormat());
}