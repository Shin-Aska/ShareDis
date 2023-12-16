function getFormat() {
    return [
        {
            "type": "title",
            "value": null
        },
        {
            "type": "string",
            "value": " - "
        },
        {
            "type": "url",
            "value": null
        }
    ]
}

function fillFormatStructure(url, title, format) {
    for (let i = 0; i < format.length; i++) {
        let structure = format[i];
        if (format[i].type === "title") {
            format[i].value = title;
        }
        else if (format[i].type === "url") {
            format[i].value = url;
        }
    }
    return format;
}

function pasteToClipboard (format) {
    let clipboardText = "";
    for (var i = 0; i < format.length; i++) {
        clipboardText += format[i].value;
    }
    navigator.clipboard.writeText(clipboardText);
}