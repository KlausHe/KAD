import * as KadUtils from "../General/KadUtils.js";

const lionsOptions = {
	data: [],
	num: null,
};

KadUtils.daEL(idVin_lionsInput, "input", () => lionsRequestNumber(idVin_lionsInput));

export function clear_cl_Lions() {
	KadUtils.KadDOM.resetInput("idVin_lionsInput", "1234");
	KadUtils.dbID("idLbl_lionsOutput").innerHTML = `Suche nach<br>deiner Kalendernummer`;
	lionsOptions.data = [];
	if (KadUtils.objectLength(lionsOptions.data) === 0) {
		lionsRequestData();
	}
}

export const storage_cl_Lions = {
	dbName: "Lions",
	contentName: "cl_Lions",
	clear() {
		this.data = 0;
	},
	get data() {
		return lionsOptions.num;
	},
	set data(data) {
		KadUtils.dbID("idVin_lionsInput").value = data;
		setTimeout(() => {
			lionsRequestNumber();
		}, 1000);
	},
};

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
		infoLbl.innerHTML = `kein Gewinn`;
		infoLbl.classList.remove("cl_highlighted");
		return;
	}
	infoLbl.innerHTML = `gewonnen am<br>${lionsOptions.data[index].date}`;
	infoLbl.classList.add("cl_highlighted");
	KadUtils.dbID("idTabBody_Lions").rows[index].scrollIntoView({
		behavior: "smooth",
		block: "center",
	});
}

function lionsRequestData() {
	return;
}

function lionsReturn(data) {
	if (KadUtils.checkedLog(data.error, "Lions could not acces the Winnerlist:", data.error)) return;

	lionsOptions.data = [];
	for (let i = 1; i < data.length; i++) {
		const obj = data[i];
		const date = obj["Datum"];
		let num = obj["Los-Nr."];
		num = num.padStart(4, 0);
		const price = `${obj["Spende/Gutschein"]}<br>${obj["Sponsor"]}`;
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
	KadUtils.KadTable.clear("idTabHeader_Lions");
	const rowTh = KadUtils.KadTable.insertRow("idTabHeader_Lions");
	KadUtils.KadTable.addHeaderCell(rowTh, {
		names: ["lionsHeader", "Date"],
		type: "Lbl",
		text: "Datum",
		cellStyle: {
			textAlign: "left",
		},
	});
	KadUtils.KadTable.addHeaderCell(rowTh, {
		names: ["lionsHeader", "Winner"],
		type: "Lbl",
		text: "Gewinner",
		cellStyle: {
			textAlign: "left",
		},
	});
	KadUtils.KadTable.addHeaderCell(rowTh, {
		names: ["lionsHeader", "Price"],
		type: "Lbl",
		text: "Preis",
		cellStyle: {
			textAlign: "left",
		},
	});

	KadUtils.KadTable.clear("idTabBody_Lions");
	for (const [index, obj] of lionsOptions.data.entries()) {
		const row = KadUtils.KadTable.insertRow("idTabBody_Lions");
		KadUtils.KadTable.addCell(row, {
			names: ["lions", "date", index],
			type: "Lbl",
			text: obj.date,
			cellStyle: {
				textAlign: "left",
			},
		});
		KadUtils.KadTable.addCell(row, {
			names: ["lions", "winner", index],
			type: "Lbl",
			text: obj.num.join(", "),
			cellStyle: {
				textAlign: "left",
			},
		});
		KadUtils.KadTable.addCell(row, {
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
