browser._userValues = {
    host: null
}

function setOverwrittenHost(hostname) {
    browser._userValues.host = hostname;
}

function getOverwrittenHost() {
    return browser._userValues.host;
}

async function getHostOfCurrentTab() {
    // Get the page title and URL
    return new Promise((resolve, reject) => {
        browser.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            let tab = tabs[0];
            const pageURL = tab.url;
            resolve(getHostOfURL(pageURL));
        });
    });
}

async function updateTransformerInput(hostname) {
    document.getElementById(`transformer-hostname`).innerHTML = hostname;
    getTransformer(hostname).then((transformer) => {
        document.getElementById(`transformer-controller-regex`).value = transformer.regex.toString();
        document.getElementById(`transformer-controller-output`).value = transformer.output;
    }).catch((err) => {

    })
}

async function loadTransformerInputs() {
    getHostOfCurrentTab().then(async (hostname) => {
        updateTransformerInput(hostname);
    })
}

document.getElementById(`applyTransformerBtn`).onclick = async () => {
    let hostname = getOverwrittenHost() || await getHostOfCurrentTab();
    let regex = RegExpFromStr(document.getElementById(`transformer-controller-regex`).value);
    let output = document.getElementById(`transformer-controller-output`).value;
    let updated_transformers = await updateTransformer(hostname, regex, output);
    browser.storage.local.set({transformers: JSON.stringify(updated_transformers)}, async () => {
        loadTransformerInputs();
        await loadDataTable();
        showModal(`Transformer saved`, [`The transformer you have set for ${hostname} has been ` +
                `applied. The next output for ${hostname} will be transformed.`], `success`);
    });
}

loadTransformerInputs();