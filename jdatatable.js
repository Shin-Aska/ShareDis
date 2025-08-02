async function edit(hostname) {
	setOverwrittenHost(hostname);
    await updateTransformerInput(hostname);
    document.getElementById("pills-url-tab").click();
}

async function remove(hostname) {
    let updated_transformers = await removeTransformer(hostname);
    browser.storage.local.set({transformers: JSON.stringify(updated_transformers)}, async () => {
    	await loadDataTable();
        showModal(`Transformer removed`, [`The transformer for ${hostname} has been ` +
                `removed.`], `success`);
    });
}

browser._datatable = null;

async function loadDataTable() {
	if (browser._datatable !== null) {
		browser._datatable.destroy()
		browser._datatable = null;
	}

	let transformers = await getTransformers();
	let hostnames = Object.keys(transformers);
	let htmlContent = ``;
	for (let idx in hostnames) {
		let hostname = hostnames[idx];
		let transformer = transformers[hostname];
		htmlContent += `<tr>
							<td>
								${hostname}
							</td>
							<td>
								<input class="btn btn-primary center" type="button" value="Edit">
                            	<input class="btn btn-primary center" type="button" value="Remove">
							</td>
						</tr>`;
	}
	document.getElementById(`transformer-body`).innerHTML = htmlContent;

	const tableBody = document.getElementById('transformer-body');
    for (const row of tableBody.rows) {
        const hostname = row.cells[0].innerText.trim();
        const editButton = row.querySelector('input[value="Edit"]');
        const removeButton = row.querySelector('input[value="Remove"]');

        if (editButton) {
            editButton.onclick = () => edit(hostname);
        }
        if (removeButton) {
            removeButton.onclick = () => remove(hostname);
        }
    }

	browser._datatable = new DataTable(`#transformer-table`);
}

loadDataTable();