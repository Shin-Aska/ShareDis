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

async function getTransformer() {
    return new Promise((resolve, reject) => {
        browser.storage.local.get([`transformers`], (r) => {
            if (`transformers` in r) {
                let result = JSON.parse(r.format);
                Object.keys(result).forEach((domain) => {
                    try {
                        result[domain].regex = new RegExp(result[domain].regex);
                    }
                    catch (ex) {
                        console.warn("Exception occured while fetching RegExp " + ex);
                    }
                });
                resolve(result);
            }
            else {
                resolve({
                    "www.youtube.com": {"regex": /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^\/?]+)$/i, "output": "https://www.youtube.com/watch?v=$1"},
                    "m.youtube.com": {"regex": /^(?:https?:\/\/)?(?:m\.)?youtube\.com\/shorts\/([^\/?]+)$/i, "output": "https://www.youtube.com/watch?v=$1"}
                });
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

function getHostOfURL(url) {
    let anchor = document.createElement('a');
    anchor.href = url;
    return anchor.hostname;
}

async function fillFormatStructure(url, title, format) {
    for (let i = 0; i < format.length; i++) {
        let structure = format[i];
        if (format[i].type === `title`) {
            format[i].value = title;
        }
        else if (format[i].type === `url`) {
            let hostname = getHostOfURL(url);
            let transformers = await getTransformer();
            if (hostname in transformers) {
                let regex = transformers[hostname].regex;
                let output = transformers[hostname].output;
                console.log(transformers[hostname]);
                format[i].value = url.replace(regex, output);
            }
            else {
                format[i].value = url;
            }
        }
    }
    return format;
}

function formatAsString (format) {
    let clipboardText = ``;
    for (var i = 0; i < format.length; i++) {
        clipboardText += format[i].value;
    }
    return clipboardText;
}

function pasteToClipboard (format) {
    let clipboardText = ``;
    for (var i = 0; i < format.length; i++) {
        clipboardText += format[i].value;
    }
    navigator.clipboard.writeText(clipboardText);
}