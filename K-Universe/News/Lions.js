const lionsOptions = {
	url: "https://hirsau.lions.de/edition-nagold",
	data: [],
	num: null,
};

function clear_cl_Lions() {
	resetInput("idVin_lionsInput", "1234");
	dbID("idLbl_lionsOutput").innerHTML = `Suche nach<br>deiner Kalendernummer`;
	lionsOptions.data = {};
	if (Object.keys(lionsOptions.data).length === 0) {
		lionsRequestData();
	}
}

function lionsRequestNumber() {
	const infoLbl = dbID("idLbl_lionsOutput");
	const inputDIV = dbID("idVin_lionsInput").value.trim();
	if (inputDIV == "" || isNaN(inputDIV) || inputDIV.length != 4) {
		infoLbl.textContent = `...`;
		return;
	}
	lionsOptions.num = inputDIV;
	let id = null;
	for (const [key, value] of Object.entries(lionsOptions.data)) {
		if (value[1].includes(lionsOptions.num)) {
			id = key;
			break;
		}
	}
	if (id == null) {
		infoLbl.innerHTML = `- ${lionsOptions.num} -<br>leider kein Gewinn`;
		infoLbl.classList.remove("cl_highlighted");
		return;
	}
	infoLbl.innerHTML = `${lionsOptions.num} hat gewonnen<br>am ${lionsOptions.data[id]["0"]}`;
	infoLbl.classList.add("cl_highlighted");
	dbID(idTabBody_Lions).rows[id].scrollIntoView({
		behavior: "smooth",
		block: "center",
	});
}

function lionsRequestData() {
	utilsSocketPost("Lions", null);
}

function lionsReturn(data) {
	if (data.error) {
		console.error(data.error);
		return;
	}
	lionsOptions.data = data;
	createLionsTable();
}

function createLionsTable() {
	//header
	clearTable("idTabHeader_Lions");
	const rowTh = insertTableRow("idTabHeader_Lions");
	tableAddCellHeader(rowTh, {
		names: ["lionsHeader", "Date"],
		type: "Lbl",
		text: "Datum",
		cellStyle: {
			textAlign: "left",
		},
	});
	tableAddCellHeader(rowTh, {
		names: ["lionsHeader", "Winner"],
		type: "Lbl",
		text: "Gewinner",
		cellStyle: {
			textAlign: "left",
		},
	});
	tableAddCellHeader(rowTh, {
		names: ["lionsHeader", "Price"],
		type: "Lbl",
		text: "Preis",
		cellStyle: {
			textAlign: "left",
		},
	});

	clearTable("idTabBody_Lions");
	for (const [index, value] of lionsOptions.data.entries()) {
		const row = insertTableRow("idTabBody_Lions");
		tableAddCell(row, {
			names: ["lions", "date", index],
			type: "Lbl",
			text: value["0"],
			cellStyle: {
				textAlign: "left",
			},
		});
		tableAddCell(row, {
			names: ["lions", "winner", index],
			type: "Lbl",
			text: value["1"],
			cellStyle: {
				textAlign: "left",
			},
		});
		tableAddCell(row, {
			names: ["lions", "price", index],
			type: "Lbl",
			text: `${value["4"]}<br>(${value["2"]})`,
			onclick: () => {
				window.open(lionsOptions.url);
			},
			cellStyle: {
				textAlign: "left",
			},
		});
	}
}
