function getURLFromFormat(format) {
    for (var i = 0; i < format.length; i++) {
        if (format[i].type === `url`) {
            return format[i].value;
        }
    }
    return `null`;
}

getFormatOutput().then((format) => {
    new QRious({
        element: document.getElementById(`qr`),
        value: getURLFromFormat(format),
        padding: 25,
        size: 300
    });
})

document.getElementById(`copyQRImageToClipboardBtn`).onclick = async () => {
    document.getElementById(`qr`).toBlob(async (blob) => {
        browser.clipboard.setImageData(await new Response(blob).arrayBuffer(), `png`);
    })
}