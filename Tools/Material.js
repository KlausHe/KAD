import { initEL, dbID, dbIDStyle,  KadTable } from "../KadUtils/KadUtils.js";
import { Data_Materials } from "../General/MainData.js";
import { materialFilterOptions, storage_cl_MaterialFilterSettings } from "../Settings/MaterialFilterSettings.js";
import { geoUpdateMassDependency } from "./Geometrie.js";
import { expansionUpdateMassDependecy } from "./Expansion.js";

export const materialOptions = {
	matListOrig: ["S275JR", "AlSi5Cu3", "X5CrNi18-10"],
	matList: [],
	filterList: [],
	get headerList() {
		return dbID("idCb_materialListFilter").checked ? [...storage_cl_MaterialFilterSettings.data] : Object.keys(Data_Materials.metadata);
	},
	optGroup: null,
	selMatGroup: "all",
};

initEL({ id: idCb_materialListFilter, fn: materialPropertyfilter, resetValue: true });
initEL({ id: idVin_materialFilter, fn: materialSearchInput, resetValue: "Material suchen" });
initEL({
	id: idSel_materialFilter,
	fn: materialSearchSelectChange,
});
initEL({ id: idBtn_materialSelectClose, fn: materialCloseMaterialSelect });

export function clear_cl_Material() {
	materialOptions.matList = materialOptions.matListOrig;
	materialOptions.filterList = Object.keys(Data_Materials.Materials);
	materialFilterOptions.select = [...materialFilterOptions.listOrig];
	idSel_materialFilter.KadReset({
		selGroup: {
			"Alle Werkstoffe": [["Alle Werkstoffe", "all"], ...Array.from(new Set(Object.values(Data_Materials.Materials).map((mat) => mat.matGroup))).map((mat) => [mat, mat])],
		},
		selStartIndex: 0,
	});
	idVin_materialFilter.KadReset();
	idCb_materialListFilter.KadReset();

	materialSelectedTable();
	// closeMaterialSearch();
	materialToggleSearch();
}

export const storage_cl_Material = {
	dbName: "Material",
	contentName: "cl_Material",
	clear() {
		this.data = [...materialOptions.matListOrig];
	},
	get data() {
		return [...materialOptions.matList];
	},
	set data(data) {
		materialOptions.matList = data;
		materialSelectedTable();
	},
};

function materialPropertyfilter() {
	materialSelectedTable();
	materialSearchTable();
}

//Hauptliste mit Werkstoffdaten ersetllen!!!
export function materialSelectedTable() {
	if (materialOptions.matList.length === 0) {
		materialOptions.matList = materialOptions.matListOrig;
	}
	materialOptions.matList = [...new Set(materialOptions.matList)].sort(); // delete duplicates
	KadTable.clear("idTabHeader_Materiallisted");
	const headerRow = KadTable.insertRow("idTabHeader_Materiallisted");
	KadTable.addHeaderCell(headerRow, {
		names: ["materialHeaderEdge"],
		type: "Lbl",
		text: "Eigenschaften",
		colSpan: 3,
		cellStyle: {
			textAlign: "center",
		},
	});

	for (let a = 0; a < materialOptions.matList.length; a++) {
		KadTable.addHeaderCell(headerRow, {
			names: ["materialHeaderTrash", a],
			type: "Btn",
			subGroup: "subgrid",
			img: "trash",
			ui: {
				uiSize: "size1",
				uiType: "transparent",
			},
			cellStyle: {
				textAlign: "center",
				cursor: "pointer",
			},
			onclick: function () {
				materialOptions.matList.splice(materialOptions.matList.indexOf(materialOptions.matList[a]), 1);
				materialSelectedTable();
			},
		});
	}

	KadTable.addHeaderCell(headerRow, {
		names: ["materialHeaderAdd"],
		type: "Btn",
		subGroup: "subgrid",
		img: "oAdd",
		ui: {
			uiSize: "size1",
			uiType: "transparent",
		},
		cellStyle: {
			textAlign: "center",
			cursor: "pointer",
		},
		onclick: function () {
			// openMaterialSearch();
			materialToggleSearch(true);
			materialOpenMaterialSelect();
		},
	});

	//clear list
	KadTable.clear("idTabBody_Materiallisted");

	for (let i = 0; i < materialOptions.headerList.length; i++) {
		let row = KadTable.insertRow("idTabBody_Materiallisted");
		const listItem = materialOptions.headerList[i];
		const dataItem = Data_Materials.metadata[listItem];
		KadTable.addCell(row, {
			names: ["material", "bez", i],
			type: "Lbl",
			text: dataItem.Bezeichnung,
			style: {
				maxWidth: "10rem",
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			},
		});
		KadTable.addCell(row, {
			names: ["material", "abbr", i],
			type: "Lbl",
			text: dataItem.abbr ? `[${dataItem.abbr}]` : "",
			style: {
				whiteSpace: "nowrap",
			},
		});
		KadTable.addCell(row, {
			names: ["material", "unit", i],
			type: "Lbl",
			text: dataItem.Unit ? `[${dataItem.Unit}]` : "",
		});

		for (let n = 0; n < materialOptions.matList.length; n++) {
			const item = Data_Materials.Materials[materialOptions.matList[n]];
			const value = item[listItem];
			KadTable.addCell(row, {
				names: ["material", "value", i, n],
				type: "Lbl",
				get text() {
					if (listItem == "matSort" || listItem == "matZustand") {
						return value != undefined ? `${value}*` : "-";
					}
					if (typeof value == "object" && value != null) {
						return Object.values(value)[0];
					}
					return value || "-";
				},
				cellStyle: {
					textAlign: "right",
				},
				get ui() {
					if (listItem == "matSort")
						return {
							title: Data_Materials.matSortList[value],
						};
					if (listItem == "matZustand") {
						return {
							title: Data_Materials.matZustandList[value],
						};
					}
					return "";
				},
				get copy() {
					return !(listItem == "matSort" || listItem == "matZustand");
				},
			});
		}
	}
	geoUpdateMassDependencies();
}

function geoUpdateMassDependencies() {
	geoUpdateMassDependency();
	expansionUpdateMassDependecy();
}

function materialSearchSelectChange() {
	materialOptions.selMatGroup = dbID(idSel_materialFilter).value;
	materialSearchInput();
}

function materialSearchInput() {
	materialOptions.filterList = [];
	let val = idVin_materialFilter.KadGet().toLowerCase();
	let search = val.split(/[*^\s]/g);
	for (const [key, value] of Object.entries(Data_Materials.Materials)) {
		if (materialOptions.selMatGroup == "all" || value.matGroup == materialOptions.selMatGroup) {
			if (search.length == 0) {
				materialOptions.filterList.push(key);
			} else if (search.every((sub) => key.toLowerCase().includes(sub))) {
				materialOptions.filterList.push(key);
			}
		}
	}
	materialSearchTable();
}

function materialSearchTable() {
	KadTable.clear("idTabHeader_MaterialSearchList");
	const headerRow0 = KadTable.insertRow("idTabHeader_MaterialSearchList");
	const headerRow1 = KadTable.insertRow("idTabHeader_MaterialSearchList");
	const headerRow2 = KadTable.insertRow("idTabHeader_MaterialSearchList");
	for (let i = 0; i < materialOptions.headerList.length; i++) {
		KadTable.addHeaderCell(headerRow0, {
			names: ["materialSearch", "bez", i],
			type: "Lbl",
			text: Data_Materials.metadata[materialOptions.headerList[i]].Bezeichnung,
			createCellClass: [i == materialOptions.headerList.length - 1 ? "" : "clTab_UIBorderThinRight"],
			createClass: ["clTab_vertical"],
			cellStyle: {
				textAlign: "center",
			},
			copy: true,
		});
		KadTable.addHeaderCell(headerRow1, {
			names: ["materialSearch", "abbr", i],
			type: "Lbl",
			createCellClass: [i == materialOptions.headerList.length - 1 ? "" : "clTab_UIBorderThinRight"],
			text: Data_Materials.metadata[materialOptions.headerList[i]].abbr ? `[${Data_Materials.metadata[materialOptions.headerList[i]].abbr}]` : "",
			cellStyle: {
				textAlign: "center",
			},
			style: {
				whiteSpace: "nowrap",
			},
		});
		KadTable.addHeaderCell(headerRow2, {
			names: ["materialSearch", "units", i],
			type: "Lbl",
			createCellClass: [i == materialOptions.headerList.length - 1 ? "" : "clTab_UIBorderThinRight"],
			text: Data_Materials.metadata[materialOptions.headerList[i]].Unit ? `[${Data_Materials.metadata[materialOptions.headerList[i]].Unit}]` : "",
			cellStyle: {
				textAlign: "center",
			},
		});
	}

	KadTable.clear("idTabBody_MaterialSearchList");
	for (let i = 0; i < materialOptions.filterList.length; i++) {
		let row = KadTable.insertRow("idTabBody_MaterialSearchList");
		row.style.cursor = "pointer";
		row.onclick = function () {
			materialOptions.matList.push(materialOptions.filterList[i]);
			materialSelectedTable();
		};
		for (let j = 0; j < materialOptions.headerList.length; j++) {
			const value = Data_Materials.Materials[materialOptions.filterList[i]][materialOptions.headerList[j]];
			const listItem = materialOptions.headerList[j];
			KadTable.addCell(row, {
				names: ["materialSearch", "value", i, j],
				type: "Lbl",
				createCellClass: [j == materialOptions.headerList.length - 1 ? "" : "clTab_UIBorderThinRight"],
				get text() {
					if (listItem == "matSort" || listItem == "matZustand") {
						return value != undefined ? `${value}*` : "-";
					}
					if (typeof value == "object" && value != null) {
						return Object.values(value)[0];
					}
					return value || "-";
				},
				get ui() {
					if (listItem == "matSort")
						return {
							title: Data_Materials.matSortList[value],
						};
					if (listItem == "matZustand")
						return {
							title: Data_Materials.matZustandList[value],
						};
					return "";
				},
				cellStyle: {
					textAlign: "right",
					whiteSpace: "nowrap",
				},
			});
		}
	}
	let row = KadTable.insertRow("idTabBody_MaterialSearchList");
	row.insertCell(0);
}

function materialToggleSearch(state = false) {
	const t = state ? "block" : "none";
	dbIDStyle("idDiv_MaterialSearchOptions").display = t;
	dbIDStyle("idDiv_MaterialSearchList").display = t;
	if (state) materialSearchTable();
}

function materialOpenMaterialSelect() {
	idDia_materialSelect.showModal();
}
function materialCloseMaterialSelect() {
	materialToggleSearch();
	idDia_materialSelect.close();
}
