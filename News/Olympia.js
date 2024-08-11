// https://api.olympics.kevle.xyz/medals

import { KadDOM, KadFile, KadTable, KadValue, dbID, errorChecked, initEL, log } from "../KadUtils/KadUtils.js";

const olympiaOptions = {
	URLMedals: `https://api.olympics.kevle.xyz/medals`,
	URLFlags: `https://restcountries.com/v3.1/all?fields=cca3,flags,population`,
	data: null,
	specific: false,
};
initEL({ id: idBtn_olympiaUpdate, fn: olympaUpdate });
initEL({ id: idBtn_olympiaSpecific, fn: olympiaSpecific });

export function clear_cl_Olympia() {
	olympaUpdate();
}

async function olympaUpdate() {
	olympiaOptions.data = null;
	const { dataTable, dataCountries, error } = await KadFile.loadUrlToJSON({ variableArray: ["dataTable", "dataCountries"], urlArray: [olympiaOptions.URLMedals, olympiaOptions.URLFlags] });
	if (errorChecked(error)) return;

	let countrieObj = {};
	for (let obj of dataCountries) {
		countrieObj[obj.cca3] = { flag: obj.flags.svg, population: obj.population };
	}
	for (let rang of dataTable.results) {
		if (rang.country.iso_alpha_3 === undefined) continue;
		rang.flag = countrieObj[rang.country.iso_alpha_3].flag;
		rang.population = countrieObj[rang.country.iso_alpha_3].population;
	}
	olympiaOptions.data = dataTable.results;
	olympiaTableReturn();
}

function olympiaSpecific(obj) {
	olympiaOptions.specific = !olympiaOptions.specific;
	KadDOM.btnColor(idBtn_olympiaSpecific, olympiaOptions.specific ? "positive" : null);
	olympiaTableReturn();
}

function olympiaTableReturn() {
	if (olympiaOptions.data.length == 0) return;
	const data = olympiaOptions.data;
	KadTable.clear("idTabBody_OlympiaTable");

	const headerNames = ["Gold", "Silver", "Bronze", "Total"];
	for (let name of headerNames) {
		const text = olympiaOptions.specific ? `${name}<br>/ppm` : name;
		dbID(`idTabHeader_Olympia${name}`).innerHTML = text;
	}

	KadTable.clear("idTabBody_OlympiaTable");
	for (let i = 0; i < data.length; i++) {
		let row = KadTable.createRow("idTabBody_OlympiaTable");

		KadTable.addCell(row, {
			names: ["olympia", "place", i],
			type: "Lbl",
			text: i + 1,
			cellStyle: {
				textAlign: "center",
			},
		});
		// image
		KadTable.addCell(row, {
			names: ["olympia", "flag", i],
			type: "Img",
			subGroup: "url",
			img: data[i].flag,
			ui: {
				uiSize: "olympiaImg",
			},
			cellStyle: {
				textAlign: "center",
			},
		});

		//--  Land
		KadTable.addCell(row, {
			names: ["olympia", "country", i],
			type: "Lbl",
			text: data[i].country.name,
			title: data[i].country.name,
			cellStyle: {
				textAlign: "left",
			},
		});

		//--  Gold
		KadTable.addCell(row, {
			names: ["olympia", "gold", i],
			type: "Lbl",
			text: olympiaFactor(data[i].medals.gold, data[i].population),
			cellStyle: {
				textAlign: "center",
			},
		});
		//--  Silber
		KadTable.addCell(row, {
			names: ["olympia", "silver", i],
			type: "Lbl",
			text: olympiaFactor(data[i].medals.silver, data[i].population),
			cellStyle: {
				textAlign: "center",
			},
		});
		//--  bronce
		KadTable.addCell(row, {
			names: ["olympia", "bronze", i],
			type: "Lbl",
			text: olympiaFactor(data[i].medals.bronze, data[i].population),
			cellStyle: {
				textAlign: "center",
			},
		});
		//--  total
		KadTable.addCell(row, {
			names: ["olympia", "total", i],
			type: "Lbl",
			text: olympiaFactor(data[i].medals.total, data[i].population),
			cellStyle: {
				textAlign: "center",
			},
		});
	}
}

function olympiaFactor(value, population) {
	if (olympiaOptions.specific) {
		return KadValue.number((value / population) * 1000000, { decimals: 3 });
	}
	return value;
}
