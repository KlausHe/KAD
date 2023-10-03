const materialOptions = {
	matListOrig: ["S275JR", "AlSi5Cu3", "X5CrNi18-10"],
	matList: [],
	filterList: [],
	get headerList() {
		return dbID("idCb_materialListFilter").checked ? [...nuncDiscipuli.getData("MaterialFilterSettings")] : Object.keys(Data_Material.metadata);
	},
	optGroup: null,
	selMatGroup: null,
};

function mat() {
	Data_Material_BU;

	Data_Material_BU.matSortList = new Set(
		Object.entries(Data_Material_BU.Materials).map((arr) => {
			return arr[1].matSort;
		})
	);
	Data_Material_BU.matSortList = [...Data_Material_BU.matSortList].sort();
	Data_Material_BU.matZustandList = new Set(
		Object.entries(Data_Material_BU.Materials).map((arr) => {
			return arr[1].matZustand;
		})
	);
	Data_Material_BU.matZustandList.delete(undefined);
	Data_Material_BU.matZustandList = [...Data_Material_BU.matZustandList].sort();

	globalP5.saveJSON(Data_Material_BU, "newList.json");
	for (const [k, data] of Object.entries(Data_Material.Materials)) {
		for (const [key, value] of Object.entries(data)) {
			if (value == null) delete data[key];
			if (key == "matSort") data[key] = [...Data_Material.matSortList].indexOf(value);
			if (key == "matZustand") data[key] = [...Data_Material.matZustandList].indexOf(value);
		}
	}
}
function clear_cl_Material() {
	utilsResetInput("idVin_materialFilter", "Material suchen");
	dbID("idCb_materialListFilter").checked = true;

	let opt = document.createElement("option");
	opt.textContent = "Alle Werkstoffe";
	opt.value = null;
	dbID("idSel_materialFilter").appendChild(opt);
	let matKeyList = [];
	for (const matKeys of Object.keys(Data_Material.Materials)) {
		let matKey = Data_Material.Materials[matKeys].matGroup;
		if (!matKeyList.includes(matKey)) {
			matKeyList.push(matKey);
			let option = document.createElement("option");
			option.textContent = matKey;
			option.value = matKey;
			dbID("idSel_materialFilter").appendChild(option);
		}
	}
	materialOptions.filterList = Object.keys(Data_Material.Materials);
	materialFilterOptions.select = [...materialFilterOptions.listOrig];
	materialOptions.matList = materialOptions.matListOrig;
	materialSelectedTable();
	// closeMaterialSearch();
	toggleMaterialSearch(false);
}

function materialPropertyfilter() {
	materialSelectedTable();
	materialSearchTable();
}

//Hauptliste mit Werkstoffdaten ersetllen!!!
function materialSelectedTable() {
	if (materialOptions.matList.length === 0) {
		materialOptions.matList = materialOptions.matListOrig;
	}
	materialOptions.matList = [...new Set(materialOptions.matList)].sort(); // delete duplicates

	clearTable("idTabHeader_Materiallisted");
	const headerRow = insertTableRow("idTabHeader_Materiallisted");
	tableAddCellHeader(headerRow, {
		names: ["materialHeaderEdge"],
		type: "Lbl",
		text: "Eigenschaften",
		colSpan: 3,
		cellStyle: {
			textAlign: "center",
		},
	});

	for (let a = 0; a < materialOptions.matList.length; a++) {
		tableAddCellHeader(headerRow, {
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

	tableAddCellHeader(headerRow, {
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
			toggleMaterialSearch(true);
		},
	});

	//clear list
	clearTable("idTabBody_Materiallisted");

	for (let i = 0; i < materialOptions.headerList.length; i++) {
		let row = insertTableRow("idTabBody_Materiallisted");
		const listItem = materialOptions.headerList[i];
		const dataItem = Data_Material.metadata[listItem];
		tableAddCell(row, {
			names: ["material", "bez", i],
			type: "Lbl",
			text: dataItem.Bezeichnung,
			style: {
				maxWidth: "10rem",
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
			},
			copy: true,
		});
		tableAddCell(row, {
			names: ["material", "abbr", i],
			type: "Lbl",
			text: dataItem.abbr ? `[${dataItem.abbr}]` : "",
			style: {
				whiteSpace: "nowrap",
			},
			copy: true,
		});
		tableAddCell(row, {
			names: ["material", "unit", i],
			type: "Lbl",
			text: dataItem.Unit ? `[${dataItem.Unit}]` : "",
			copy: true,
		});

		for (let n = 0; n < materialOptions.matList.length; n++) {
			const item = Data_Material.Materials[materialOptions.matList[n]];
			const value = item[listItem];
			tableAddCell(row, {
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
							title: Data_Material.matSortList[value],
						};
					if (listItem == "matZustand") {
						return {
							title: Data_Material.matZustandList[value],
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
	geoUpdateMasse();
	geoResultTable();
}

function materialSearchSelectChange(obj) {
	materialOptions.selMatGroup = utilsNumberFromInput(obj);
	materialSearchInput();
}

function materialSearchInput() {
	materialOptions.filterList = [];
	let val = dbID("idVin_materialFilter").value.toLowerCase();
	let search =
		val == ""
			? ""
			: val
					.toLowerCase()
					.trim()
					.split(/[*^\s]/g);
	for (const [key, value] of Object.entries(Data_Material.Materials)) {
		if (materialOptions.selMatGroup == null || value.matGroup == materialOptions.selMatGroup) {
			if (val == "") {
				materialOptions.filterList.push(key);
			} else {
				const objKey = key.toLowerCase();
				for (const sub of search) {
					if (objKey.includes(sub)) {
						materialOptions.filterList.push(key);
						break;
					}
				}
			}
		}
	}
	materialSearchTable();
}

function materialSearchTable() {
	clearTable("idTabHeader_MaterialSearchList");
	const headerRow0 = insertTableRow("idTabHeader_MaterialSearchList");
	const headerRow1 = insertTableRow("idTabHeader_MaterialSearchList");
	const headerRow2 = insertTableRow("idTabHeader_MaterialSearchList");
	for (let i = 0; i < materialOptions.headerList.length; i++) {
		tableAddCellHeader(headerRow0, {
			names: ["materialSearch", "bez", i],
			type: "Lbl",
			text: Data_Material.metadata[materialOptions.headerList[i]].Bezeichnung,
			createCellClass: [i == materialOptions.headerList.length - 1 ? "" : "clTab_borderThinRight"],
			createClass: ["clTab_vertical"],
			cellStyle: {
				textAlign: "center",
			},
			copy: true,
		});
		tableAddCellHeader(headerRow1, {
			names: ["materialSearch", "abbr", i],
			type: "Lbl",
			createCellClass: [i == materialOptions.headerList.length - 1 ? "" : "clTab_borderThinRight"],
			text: Data_Material.metadata[materialOptions.headerList[i]].abbr ? `[${Data_Material.metadata[materialOptions.headerList[i]].abbr}]` : "",
			cellStyle: {
				textAlign: "center",
			},
			style: {
				whiteSpace: "nowrap",
			},
		});
		tableAddCellHeader(headerRow2, {
			names: ["materialSearch", "units", i],
			type: "Lbl",
			createCellClass: [i == materialOptions.headerList.length - 1 ? "" : "clTab_borderThinRight"],
			text: Data_Material.metadata[materialOptions.headerList[i]].Unit ? `[${Data_Material.metadata[materialOptions.headerList[i]].Unit}]` : "",
			cellStyle: {
				textAlign: "center",
			},
		});
	}

	clearTable("idTabBody_MaterialSearchList");
	for (let i = 0; i < materialOptions.filterList.length; i++) {
		let row = insertTableRow("idTabBody_MaterialSearchList");
		row.style.cursor = "pointer";
		row.onclick = function () {
			materialOptions.matList.push(materialOptions.filterList[i]);
			materialSelectedTable();
		};
		for (let j = 0; j < materialOptions.headerList.length; j++) {
			const value = Data_Material.Materials[materialOptions.filterList[i]][materialOptions.headerList[j]];
			const listItem = materialOptions.headerList[j];
			tableAddCell(row, {
				names: ["materialSearch", "value", i, j],
				type: "Lbl",
				createCellClass: [j == materialOptions.headerList.length - 1 ? "" : "clTab_borderThinRight"],
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
							title: Data_Material.matSortList[value],
						};
					if (listItem == "matZustand")
						return {
							title: Data_Material.matZustandList[value],
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
	let row = insertTableRow("idTabBody_MaterialSearchList");
	let cell = row.insertCell(0);
}

function toggleMaterialSearch(state) {
	const t = state ? "block" : "none";
	dbIDStyle("idDiv_MaterialSearchOptions").display = t;
	dbIDStyle("idDiv_MaterialSearchList").display = t;
	if (state) materialSearchTable();
}
