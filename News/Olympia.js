
import { KadArray, KadDOM, KadFile, KadTable, KadValue, dbID, errorChecked, initEL } from "../KadUtils/KadUtils.js";

const olympiaOptions = {
	URLMedals: `https://api.olympics.kevle.xyz/medals`,
	URLParalympics: `https://api.olympics.kevle.xyz/paralympics/medals`,
	URLFlags: `https://restcountries.com/v3.1/all?fields=cca3,flags,population`,
	data: null,
	specific: false,
	headerNames: ["Gold", "Silver", "Bronze", "Total"],
	sortTotal: false,
	sortMedals: false,
	events: ["Paralympics", "Olympia"],
};

initEL({
	id: idSel_olympiaEvent,
	fn: olympiaUpdate,
	selStartIndex: 0,
	selList: olympiaOptions.events.map((v) => [v, v]),
});
initEL({ id: idBtn_olympiaSpecific, fn: olympiaSpecific });
initEL({ id: idBtn_olympiaSortMedals, fn: olympiaSortByMedals });
initEL({ id: idBtn_olympiaSortTotal, fn: olympiaSortByTotal });

export function clear_cl_Olympia() {
	idSel_olympiaEvent.KadReset();
	olympiaUpdate();
}

async function olympiaUpdate() {
	olympiaOptions.data = null;
	const url = idSel_olympiaEvent.KadGet({ index: true }) == 0 ? olympiaOptions.URLParalympics : olympiaOptions.URLMedals;
	const { dataTable, dataCountries, error } = await KadFile.loadUrlToJSON({ variableArray: ["dataTable", "dataCountries"], urlArray: [url, olympiaOptions.URLFlags] });
	if (errorChecked(error)) return;
	dataTable.results.splice(
		dataTable.results.findIndex((item) => {
			return item.country.code == "EOR" || item.country.code == "RPT";
		}),
		1
	);
	let countrieObj = {};
	for (let obj of dataCountries) {
		countrieObj[obj.cca3] = { flag: obj.flags.svg, population: obj.population };
	}
	for (let rang of dataTable.results) {
		if (rang.country.iso_alpha_3 === undefined) continue;
		rang.flag = countrieObj[rang.country.iso_alpha_3].flag;
		rang.population = countrieObj[rang.country.iso_alpha_3].population;
		rang.specific = {};
		for (let name of olympiaOptions.headerNames) {
			rang.specific[name.toLowerCase()] = (rang.medals[name.toLowerCase()] / rang.population) * 1000000;
		}
	}
	olympiaOptions.data = dataTable.results;
	olympiaTableReturn();
}

function olympiaSpecific() {
	olympiaOptions.specific = !olympiaOptions.specific;
	KadDOM.btnColor(idBtn_olympiaSpecific, olympiaOptions.specific ? "positive" : null);
	olympiaTableReturn();
}

function olympiaSortByTotal() {
	olympiaOptions.sortTotal = !olympiaOptions.sortTotal;
	const dataset = olympiaOptions.specific ? "specific" : "medals";
	olympiaOptions.data = KadArray.sortArrayByKey(olympiaOptions.data, [dataset, "total"], olympiaOptions.sortTotal);
	olympiaTableReturn();
}

function olympiaSortByMedals() {
	olympiaOptions.sortMedals = !olympiaOptions.sortMedals;
	const dataset = olympiaOptions.specific ? "specific" : "medals";
	for (let type of ["bronze", "silver", "gold"]) {
		olympiaOptions.data = KadArray.sortArrayByKey(olympiaOptions.data, [dataset, type], olympiaOptions.sortMedals);
	}
	olympiaTableReturn();
}

function olympiaTableReturn() {
	if (olympiaOptions.data.length == 0) return;
	const data = olympiaOptions.data;
	KadTable.clear("idTabBody_OlympiaTable");

	for (let name of olympiaOptions.headerNames) {
		const text = olympiaOptions.specific ? `${name}<br>/Einwohner` : name;
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
			text: `${data[i].country.name} (${data[i].rank})`,
			title: data[i].country.name,
			cellStyle: {
				textAlign: "left",
			},
		});
		// --Medals
		for (let name of olympiaOptions.headerNames) {
			KadTable.addCell(row, {
				names: ["olympia", name, i],
				type: "Lbl",
				text: olympiaOptions.specific ? KadValue.number(data[i].specific[name.toLowerCase()], { decimals: 3 }) : data[i].medals[name.toLowerCase()],
				cellStyle: {
					textAlign: "center",
				},
			});
		}

		// --Population
		KadTable.addCell(row, {
			names: ["olympia", "population", i],
			type: "Lbl",
			text: KadValue.number(data[i].population, { indicator: true }),
			cellStyle: {
				textAlign: "right",
			},
		});
	}
}
