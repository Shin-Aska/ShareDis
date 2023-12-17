class TransformerNotFound extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
    this.message = message + " was not found in the transformer list";
  }
}

async function getFormats() {
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

async function getTransformers() {
    return new Promise((resolve, reject) => {
        browser.storage.local.get([`transformers`], (r) => {
            if (`transformers` in r) {
                let result = JSON.parse(r.transformers);
                Object.keys(result).forEach((domain) => {
                    try {
                        result[domain].regex = new RegExp(result[domain].regex);
                    }
                    catch (ex) {
                        console.warn(`Exception occured while fetching RegExp ` + ex);
                    }
                });
                resolve(result);
            }
            else {
                resolve({
                    "www.youtube.com": {regex: /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^\/?]+)$/i, output: "https://www.youtube.com/watch?v=$1"},
                    "m.youtube.com": {regex: /^(?:https?:\/\/)?(?:m\.)?youtube\.com\/shorts\/([^\/?]+)$/i, output: "https://www.youtube.com/watch?v=$1"}
                });
            }
        })
    })
}

async function getTransformer(hostname) {
    return new Promise(async (resolve, reject) => {
        let transformers = await getTransformers();
        if (hostname in transformers) {
            resolve(transformers[hostname]);
        }
        reject(new TransformerNotFound(hostname))
    });
}

async function updateTransformer(hostname, regex, output) {
    return new Promise(async (resolve, reject) => {
        let transformers = await getTransformers();
        transformers[hostname].regex = regex;
        transformers[hostname].output = output;

        Object.keys(transformers).forEach((host) => {
            transformers[host].regex = transformers[host].regex.source;
        })
        resolve(transformers);
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
            let transformers = await getTransformers();
            if (hostname in transformers) {
                let regex = transformers[hostname].regex;
                let output = transformers[hostname].output;
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

function RegExpFromStr(patternString) {
  // Remove leading and trailing slashes
  let trimmedPattern = patternString.replace(/^\/|\/$/g, '');

  // Extract flags from the end of the string
  const flagsMatch = trimmedPattern.match(/([gimy]+)$/);
  let flags = flagsMatch ? flagsMatch[1] : '';

  // Remove flags from the pattern
  trimmedPattern = trimmedPattern.replace(/\/?[gimy]+$/, '');

  // Create and return the RegExp object
  return new RegExp(trimmedPattern, flags);
}