const lionsOptions = {
	data: [],
	num: null,
};

function clear_cl_Lions() {
	KadUtils.DOM.resetInput("idVin_lionsInput", "1234");
	KadUtils.dbID("idLbl_lionsOutput").innerHTML = `Suche nach<br>deiner Kalendernummer`;
	lionsOptions.data = [];
	if (Object.keys(lionsOptions.data).length === 0) {
		lionsRequestData();
	}
}

function lionsRequestNumber() {
	const infoLbl = KadUtils.dbID("idLbl_lionsOutput");
	lionsOptions.num = KadUtils.dbID("idVin_lionsInput").value.trim();
	if (lionsOptions.num == "" || isNaN(lionsOptions.num) || lionsOptions.num.length != 4) {
		infoLbl.textContent = `...`;
		infoLbl.classList.remove("cl_highlighted");
		return;
	}
	let index = null;
	for (const [i, obj] of lionsOptions.data.entries()) {
		if (obj.num.includes(lionsOptions.num)) {
			index = i;
			break;
		}
	}
	if (index == null) {
		infoLbl.innerHTML = `- ${lionsOptions.num} -<br>leider kein Gewinn`;
		infoLbl.classList.remove("cl_highlighted");
		return;
	}
	infoLbl.innerHTML = `${lionsOptions.num} hat gewonnen<br>am ${lionsOptions.data[index].date}`;
	infoLbl.classList.add("cl_highlighted");
	KadUtils.dbID("idTabBody_Lions").rows[index].scrollIntoView({
		behavior: "smooth",
		block: "center",
	});
}

function lionsRequestData() {
	KadUtils.socketPost("Lions", null);
}

function lionsReturn(data) {
	if (data.error) {
		console.error(data.error);
		return;
	}
	lionsOptions.data = [];
	for (let i = 1; i < data.length; i++) {
		const obj = data[i];
		const date = obj["Datum"];
		let num = obj["Los-Nr."];
		num = num.padStart(4, 0);
		// let save = 0;
		// while (num.length < 4 || save > 4) {
		// 	num = "0" + num;
		// 	save++;
		// }

		const price = `${obj["Spende/Gutschein-Beschreibung"]}<br>${obj["Sponsor"]}`;

		const index = lionsOptions.data.findIndex((obj) => obj.date == date && obj.price == price);
		if (index < 0) {
			lionsOptions.data.push({
				date,
				price,
				num: [num],
			});
		} else {
			lionsOptions.data[index].num.push(num);
		}
	}
	createLionsTable();
}

function createLionsTable() {
	//header
	KadUtils.Table.clear("idTabHeader_Lions");
	const rowTh = KadUtils.Table.insertRow("idTabHeader_Lions");
	KadUtils.Table.addHeaderCell(rowTh, {
		names: ["lionsHeader", "Date"],
		type: "Lbl",
		text: "Datum",
		cellStyle: {
			textAlign: "left",
		},
	});
	KadUtils.Table.addHeaderCell(rowTh, {
		names: ["lionsHeader", "Winner"],
		type: "Lbl",
		text: "Gewinner",
		cellStyle: {
			textAlign: "left",
		},
	});
	KadUtils.Table.addHeaderCell(rowTh, {
		names: ["lionsHeader", "Price"],
		type: "Lbl",
		text: "Preis",
		cellStyle: {
			textAlign: "left",
		},
	});

	KadUtils.Table.clear("idTabBody_Lions");
	for (const [index, obj] of lionsOptions.data.entries()) {
		const row = KadUtils.Table.insertRow("idTabBody_Lions");
		KadUtils.Table.addCell(row, {
			names: ["lions", "date", index],
			type: "Lbl",
			text: obj.date,
			cellStyle: {
				textAlign: "left",
			},
		});
		KadUtils.Table.addCell(row, {
			names: ["lions", "winner", index],
			type: "Lbl",
			text: obj.num.join(", "),
			cellStyle: {
				textAlign: "left",
			},
		});
		KadUtils.Table.addCell(row, {
			names: ["lions", "price", index],
			type: "Lbl",
			text: obj.price,
			onclick: () => {
				window.open(lionsOptions.url);
			},
			cellStyle: {
				textAlign: "left",
			},
		});
	}
}
