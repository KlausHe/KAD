import { dbID, KadTable } from "../General/KadUtils.js";
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
	KadTable.clear("idTabHeader_MaterialFilterTable");
	KadTable.clear("idTabBody_MaterialFilterTable");
	for (const key of Object.keys(Data_Materials.metadata)) {
		let bodyRow = KadTable.insertRow("idTabBody_MaterialFilterTable");
		let nextCell = 0;
		let cell = bodyRow.insertCell(nextCell);
		let tempCB = document.createElement("input");
		tempCB.type = "checkbox";
		tempCB.id = `idCb_settingsMaterialfilter_${key}`;
		tempCB.value = key;
		tempCB.checked = materialFilterOptions.select.includes(key);
		tempCB.onclick = () => {
			materialFilterChoices(key, tempCB);
		};
		cell.appendChild(tempCB);
		cell.style.textAlign = "center";

		nextCell++;
		cell = bodyRow.insertCell(nextCell);
		let tempLBL = document.createElement("label");
		tempLBL.textContent = Data_Materials.metadata[key].Bezeichnung;
		tempLBL.setAttribute("for", tempCB.id);
		cell.appendChild(tempLBL);
		cell.style.textAlign = "left";
		nextCell++;
		cell = bodyRow.insertCell(nextCell);
		let tempUnit = document.createElement("label");
		tempUnit.innerHTML = Data_Materials.metadata[key].abbr;
		tempUnit.setAttribute("for", tempCB.id);
		cell.appendChild(tempUnit);
		cell.style.textAlign = "left";
	}
}

function materialFilterUpdateCB() {
	for (const key of Object.keys(Data_Materials.metadata)) {
		const cb = dbID(`idCb_settingsMaterialfilter_${key}`);
		cb.checked = materialFilterOptions.select.includes(key);
	}
}

function materialFilterChoices(key, obj) {
	if (obj.checked) {
		materialFilterOptions.select.push(key);
	} else {
		let index = materialFilterOptions.select.indexOf(key);
		materialFilterOptions.select.splice(index, 1);
	}
	materialSelectedTable();
}
