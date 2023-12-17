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


function showModal(title, messages, type) {
    document.getElementById(`modal-title`).innerHTML = title;
    document.getElementById(`modal-message`).innerHTML = ``;
    for (let i = 0; i < messages.length; i++) {
        document.getElementById(`modal-message`).innerHTML += `<p>${messages[i]}</p>`;
    }

    if (type === `success`) {
        document.getElementById(`modal-title`).className = `modal-title text-success`;
        document.getElementById(`modal-ok-btn`).className = `btn btn-success`
    }
    else if (type === `danger`) {
        document.getElementById(`modal-title`).className = `modal-title text-danger`;
        document.getElementById(`modal-ok-btn`).className = `btn btn-danger`
    }
    var modalBox = new bootstrap.Modal(document.getElementById('modalBox'));
    modalBox.show();
}

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
                } else if (tags[i].textContent === `URL`) {
                    result.push({
                        type: `url`,
                        value: null
                    })
                }
            }
        }

        if (validateFormat(result)) {
            browser.storage.local.set({format: JSON.stringify(result)}, () => {
                showModal("Format saved", ["The format you have set has been saved"], "success");
            });
        }
        else {
            showModal("Format failed to save", ["The format you provided was not saved. Please check" +
            " if your format has both the TITLE and URL tag provided."], "danger");
        }
    }

document.getElementById(`undoFormatBtn`).onclick = async () => {
    document.getElementById(`format-controller`).value = convertFormatToTagify(await getFormat());
}