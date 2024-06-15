import { dbID, KadTable } from "../KadUtils/KadUtils.js";
import { Data_Materials } from "../General/MainData.js";
import { materialSelectedTable } from "../Tools/Material.js";
export const materialFilterOptions = {
	listOrig: ["WName", "WNr", "matGroup", "R_eR_p2", "R_m", "S_b_W", "A"],
	select: [],
};

export function clear_cl_MaterialFilterSettings() {
	materialFilterOptions.select = [...materialFilterOptions.listOrig];
	materialFilterBuildTable();
	materialSelectedTable();
}

export const storage_cl_MaterialFilterSettings = {
	dbName: "MaterialFilterSettings",
	contentName: "cl_MaterialFilterSettings",
	clear() {
		for (const dataPoint of materialFilterOptions.listOrig) {
			materialFilterOptions.select.push(dataPoint);
		}
	},
	get data() {
		return [...materialFilterOptions.select];
	},
	set data(data) {
		let filteredWrong = [];
		materialFilterOptions.select = [];
		for (const dataPoint of data) {
			if (Object.keys(Data_Materials.metadata).includes(dataPoint)) {
				materialFilterOptions.select.push(dataPoint);
			} else {
				filteredWrong.push(dataPoint);
			}
		}
		if (filteredWrong.length > 0) console.log("The following Filters are no longer supported:", filteredWrong);
		materialFilterBuildTable();
		materialFilterUpdateCB();
		materialSelectedTable();
	},
};

//Hauptliste mit Werkstoffdaten ersetllen!!!
function materialFilterBuildTable() {
	KadTable.clear("idTabBody_MaterialFilterTable");
	for (const key of Object.keys(Data_Materials.metadata)) {
		const row = KadTable.insertRow("idTabBody_MaterialFilterTable");
		const cb = KadTable.addCell(row, {
			names: ["settingsMaterialfilter", key],
			type: "Vin",
			idNoChild: true,
			subGroup: "checkbox",
			checked: materialFilterOptions.select.includes(key),
			cellStyle: {
				textAlign: "center",
			},
			onclick: () => {
				materialFilterChoices(key);
			},
		});
		KadTable.addCell(row, {
			names: ["materialFilterName", key],
			type: "Lbl",
			text: Data_Materials.metadata[key].Bezeichnung,
			for: cb.id,
			cellStyle: {
				textAlign: "left",
			},
		});
		KadTable.addCell(row, {
			names: ["materialFilterSign", key],
			type: "Lbl",
			text: Data_Materials.metadata[key].abbr,
			for: cb.id,
			cellStyle: {
				textAlign: "center",
			},
		});
	}
}

function materialFilterUpdateCB() {
	for (const key of Object.keys(Data_Materials.metadata)) {
		const cb = dbID(`idVin_settingsMaterialfilter_${key}`);
		cb.checked = materialFilterOptions.select.includes(key);
	}
}

function materialFilterChoices(key) {
	const cb = dbID(`idVin_settingsMaterialfilter_${key}`);
	if (cb.checked) {
		materialFilterOptions.select.push(key);
	} else {
		let index = materialFilterOptions.select.indexOf(key);
		materialFilterOptions.select.splice(index, 1);
	}
	materialSelectedTable();
}
