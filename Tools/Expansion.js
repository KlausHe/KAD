import { daEL, dbID, KadDOM, KadArray, KadValue, KadTable } from "../General/KadUtils.js";
import { Data_Materials } from "../General/MainData.js";
import { materialOptions } from "./Material.js";

const expansionOptions = {
	lengthOrig: [100, 200, 300, 400, 500],
	tempsOrig: [50, 100, 200, 300, 500],
	baseTemp: 20,
	exLength: [],
	exTemperatures: [],
	materials: {
		matA: null,
		matB: null,
		compare: null,
		deltaExpansion: [],
	},
	get matList() {
		// return ["S275JR", "AlSi5Cu3", "X5CrNi18-10"];
		return materialOptions.matList;
	},
};

daEL(idSel_expansionMaterialA, "change", expansionEntryMaterial);
daEL(idSel_expansionMaterialA, "focus", expansionUpdateOptions);
daEL(idBtn_expansionMaterialSwitch, "click", expansionSwitch);
daEL(idSel_expansionMaterialB, "change", expansionEntryMaterial);
daEL(idSel_expansionMaterialB, "focus", expansionUpdateOptions);
daEL(idBtn_expansionLength, "click", expansionEntryLength);
daEL(idBtn_expansionBaseTemperature, "click", expansionEntryBaseTemperature);
daEL(idBtn_expansionTemperature, "click", expansionEntryTemperature);
daEL(idCb_expansionDifference, "click", expansionDifference);
daEL(idCb_expansionCoefficient, "click", expansionCoefficient);

export function clear_cl_Expansion() {
	KadDOM.resetInput("idVin_expansionLength", expansionOptions.lengthOrig[0]);
	KadDOM.resetInput("idVin_expansionTemperature", expansionOptions.tempsOrig[0]);
	KadDOM.resetInput("idVin_expansionBaseTemperature", expansionOptions.baseTemp);
	dbID("idCb_expansionCoefficient").checked = false;
	expansionOptions.exLength = [...expansionOptions.lengthOrig];
	expansionOptions.exTemp = [...expansionOptions.tempsOrig];
	expansionPopulateSelection();
	expansionEntryMaterial();
}

function expansionPopulateSelection() {
	if (dbID("idSel_expansionMaterialA").options.length > 1) return;
	dbID("idSel_expansionMaterialA").innerHTML = "";
	dbID("idSel_expansionMaterialB").innerHTML = "";
	dbID("idSel_expansionMaterialB").options[0] = new Option("---", 0);
	let selOptGroup = document.createElement("optgroup");
	selOptGroup.id = "idOptGroup_selectedMaterialsA";
	selOptGroup.label = "selected Materials";
	for (let i = 0; i < expansionOptions.matList.length; i++) {
		if (Data_Materials.Materials[expansionOptions.matList[i]].expansion) {
			const opt = document.createElement("OPTION");
			opt.textContent = expansionOptions.matList[i];
			opt.value = expansionOptions.matList[i];
			selOptGroup.appendChild(opt);
		}
	}

	let matOptGroup = document.createElement("optgroup");
	matOptGroup.id = "idOptGroup_generalMaterialsA";
	matOptGroup.label = "general Materials";
	const matKeys = Object.keys(Data_Materials.Materials);
	for (let i = 0; i < matKeys.length; i++) {
		const matName = matKeys[i];
		if (Data_Materials.Materials[matName].expansion) {
			const opt = document.createElement("OPTION");
			opt.textContent = matName;
			opt.value = matName;
			matOptGroup.appendChild(opt);
		}
	}
	const selOptGroup2 = selOptGroup.cloneNode(true);
	selOptGroup2.id = "idOptGroup_selectedMaterialsB";
	const matOptGroup2 = matOptGroup.cloneNode(true);
	matOptGroup2.id = "idOptGroup_generalMaterialsB";
	dbID("idSel_expansionMaterialA").appendChild(selOptGroup);
	dbID("idSel_expansionMaterialA").appendChild(matOptGroup);
	dbID("idSel_expansionMaterialB").appendChild(selOptGroup2);
	dbID("idSel_expansionMaterialB").appendChild(matOptGroup2);
}

function expansionUpdateOptions() {
	const groupA = dbID("idOptGroup_selectedMaterialsA");
	const groupB = dbID("idOptGroup_selectedMaterialsB");
	KadDOM.clearFirstChild("idOptGroup_selectedMaterialsA");
	KadDOM.clearFirstChild("idOptGroup_selectedMaterialsB");
	for (let i = 0; i < expansionOptions.matList.length; i++) {
		if (Data_Materials.Materials[expansionOptions.matList[i]].expansion) {
			const opt1 = document.createElement("OPTION");
			opt1.textContent = expansionOptions.matList[i];
			opt1.value = expansionOptions.matList[i];
			const opt2 = opt1.cloneNode(true);
			groupA.appendChild(opt1);
			groupB.appendChild(opt2);
		}
	}
}

function expansionSwitch() {
	const tempSelB = dbID("idSel_expansionMaterialB").selectedIndex;
	const tempSelA = dbID("idSel_expansionMaterialA").selectedIndex;
	if (tempSelB > 0) {
		dbID("idSel_expansionMaterialA").options[tempSelB - 1].selected = true;
		dbID("idSel_expansionMaterialB").options[tempSelA + 1].selected = true;
	}
	expansionEntryMaterial();
}

function expansionEntryMaterial() {
	expansionOptions.materials.matA = dbID("idSel_expansionMaterialA").value;
	expansionOptions.materials.matB = dbID("idSel_expansionMaterialB").value;
	expansionOptions.materials.compare = expansionOptions.materials.matB == 0 || expansionOptions.materials.matA === expansionOptions.materials.matB ? false : true;
	KadDOM.enableBtn(idCb_expansionDifference, !expansionOptions.materials.compare);

	const cbEntry = dbID("idLbl_expansionDifference").textContent;
	dbID("idLbl_expansionDifference").innerHTML = expansionOptions.materials.compare ? `<del>${cbEntry}</del>` : cbEntry;

	expansionCalc();
}

function expansionEntryLength() {
	const val = Number(dbID("idVin_expansionLength").value);
	if (!expansionOptions.exLength.includes(val)) {
		expansionOptions.exLength.push(val);
		expansionOptions.exLength.sort((a, b) => {
			return a - b;
		});
		expansionCalc();
	}
}

function expansionEntryBaseTemperature() {
	expansionOptions.baseTemp = Number(dbID("idVin_expansionBaseTemperature").value);
	expansionCalc();
}

function expansionEntryTemperature() {
	const val = Number(dbID("idVin_expansionTemperature").value);
	if (!expansionOptions.exTemp.includes(val)) {
		expansionOptions.exTemp.push(val);
		expansionOptions.exTemp.sort((a, b) => {
			return a - b;
		});
		expansionCalc();
	}
}

function expansionDifference() {
	expansionCalc();
}

function expansionCoefficient() {
	expansionCalc();
}

function expansionCalc() {
	const checkedLength = dbID("idCb_expansionDifference").checked;
	const checkedCoeff = dbID("idCb_expansionCoefficient").checked;
	expansionOptions.materials.deltaExpansion = [];
	for (let t = 0; t < expansionOptions.exTemp.length; t++) {
		const dT = expansionOptions.exTemp[t] - expansionOptions.baseTemp;
		expansionOptions.materials.deltaExpansion[t] = [];
		for (let l = 0; l < expansionOptions.exLength.length; l++) {
			const tempA = Object.keys(Data_Materials.Materials[expansionOptions.materials.matA].expansion);
			const selTempA = KadArray.getNearestValueInArray(tempA, expansionOptions.exTemp[t]);
			const alphaA = Number(Data_Materials.Materials[expansionOptions.materials.matA].expansion[selTempA]);
			const addLength = checkedLength ? 0 : expansionOptions.exLength[l];
			const dLA = alphaA * dT * expansionOptions.exLength[l] * 0.000001 + addLength;
			let dLB = 0;
			let alphaB = 0;
			if (expansionOptions.materials.compare) {
				const tempB = Object.keys(Data_Materials.Materials[expansionOptions.materials.matB].expansion);
				const selTempB = KadArray.getNearestValueInArray(tempB, expansionOptions.exTemp[t]);
				alphaB = Number(Data_Materials.Materials[expansionOptions.materials.matB].expansion[selTempB]);
				dLB = alphaB * dT * expansionOptions.exLength[l] * 0.000001 + addLength;
			}
			if (checkedCoeff) {
				if (expansionOptions.materials.compare) {
					expansionOptions.materials.deltaExpansion[t].push(`${alphaA} / ${alphaB}`);
				} else {
					expansionOptions.materials.deltaExpansion[t].push(KadValue.number(alphaA, { decimals: 1 }));
				}
			} else {
				expansionOptions.materials.deltaExpansion[t].push(KadValue.number(dLA - dLB, { decimals: 3 }));
			}
		}
	}
	build_ExpansionTable();
}

//Hauptliste mit Werkstoffdaten ersetllen!!!
function build_ExpansionTable() {
	if (expansionOptions.exTemp.length === 0) expansionOptions.exTemp = [...expansionOptions.tempsOrig];
	// if (expansionOptions.exTemp.length === 0) {
	// 	contentGrid.cl_Expansion.width = 1;
	// 	layoutNavClick();
	// } else if (expansionOptions.exTemp.length > 7 && contentGrid.cl_Expansion.width == 1) {
	// 	contentGrid.cl_Expansion.width = 2;
	// 	layoutNavClick();
	// } else if (expansionOptions.exTemp.length <= 7 && contentGrid.cl_Expansion.width == 2) {
	// 	contentGrid.cl_Expansion.width = 1;
	// 	layoutNavClick();
	// }

	KadTable.clear("idTabHeader_ExpansionList");
	const headerRow = KadTable.insertRow("idTabHeader_ExpansionList");

	let headCell = document.createElement("th");
	if (expansionOptions.materials.compare) {
		headCell.innerHTML = `${expansionOptions.materials.matA} / ${expansionOptions.materials.matB}`;
	} else {
		headCell.innerHTML = expansionOptions.materials.matA;
	}
	headerRow.appendChild(headCell);
	//create Header
	for (let n = 0; n < expansionOptions.exTemp.length; n++) {
		KadTable.addHeaderCell(headerRow, {
			names: ["expansionHeaderTemp", n],
			type: "Lbl",
			text: `${expansionOptions.exTemp[n]} C`,
			style: {
				cursor: "not-allowed",
			},
			onclick: () => {
				expansionOptions.exTemp.splice(expansionOptions.exTemp.indexOf(expansionOptions.exTemp[n]), 1);
				expansionCalc();
			},
		});
	}
	//clear list
	KadTable.clear("idTabBody_ExpansionList");
	for (let i = 0; i < expansionOptions.exLength.length; i++) {
		const row = KadTable.insertRow("idTabBody_ExpansionList");
		KadTable.addHeaderCell(row, {
			names: ["expansionHeaderLength", i],
			type: "Lbl",
			text: `${expansionOptions.exLength[i]} mm`,
			createCellClass: ["clTab_borderThickRight"],
			style: {
				cursor: "not-allowed",
			},
			onclick: () => {
				expansionOptions.exLength.splice(expansionOptions.exLength.indexOf(expansionOptions.exLength[i]), 1);
				expansionCalc();
			},
		});
		for (let t = 0; t < expansionOptions.exTemp.length; t++) {
			KadTable.addCell(row, {
				names: ["expansionVal", t, i],
				type: "Lbl",
				text: expansionOptions.materials.deltaExpansion[t][i],
				createCellClass: ["clTab_borderThinRight"],
				cellStyle: {
					textAlign: "center",
				},
				copy: true,
			});
		}
	}
}
