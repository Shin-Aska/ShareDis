async function getFormat() {
    return new Promise((resolve, reject) => {
        browser.storage.local.get([`format`], (r) => {
            if (`format` in r) {
                resolve(JSON.parse(r.format));
            }
            else {
                resolve([
                    {
                        type: `title`,
                        value: null
                    },
                    {
                        type: `string`,
                        value: ` - `
                    },
                    {
                        type: `url`,
                        value: null
                    }
                ]);
            }
        })
    })
}

function convertFormatToTagify(format) {
    let result = ``;
    for (var i = 0; i < format.length; i++) {
        if (format[i].type === `url`) {
            result += `[[{"value":"url","text":"URL","title":"Page URL","prefix":"@"}]]`;
        }
        else if (format[i].type === `title`) {
            result += `[[{"value":"title","text":"TITLE","title":"Page Title","prefix":"@"}]]`;
        }
        else {
            result += format[i].value;
        }
    }
    return result;
}

function validateFormat(format) {
    var hasTitle = false;
    var hasURL = false;
    for (let i = 0; i < format.length; i++) {
        if (format[i].type === `title`) {
            hasTitle = true;
        }
        else if (format[i].type === `url`) {
            hasURL = true;
        }
    }
    console.log([hasTitle, hasURL, format]);
    return hasTitle && hasURL;
}

function fillFormatStructure(url, title, format) {
    for (let i = 0; i < format.length; i++) {
        let structure = format[i];
        if (format[i].type === `title`) {
            format[i].value = title;
        }
        else if (format[i].type === `url`) {
            format[i].value = url;
        }
    }
    return format;
}

function pasteToClipboard (format) {
    let clipboardText = ``;
    for (var i = 0; i < format.length; i++) {
        clipboardText += format[i].value;
    }
    navigator.clipboard.writeText(clipboardText);
}