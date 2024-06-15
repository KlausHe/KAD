import { saveDiscipuli } from "../General/Account.js";
import { initEL, deepClone, dbID, objectLength, KadArray, KadTable } from "../KadUtils/KadUtils.js";

let tugasOptions = {};

initEL({ id: idArea_tugasEntry, action: "change", fn: tugasNewEntry, resetValue: "Paste to Tugas" });
initEL({ id: idBtn_tugasEntry, fn: tugasNewEntry });

export function clear_cl_Tugas() {
	tugasOptions = {};
	idArea_tugasEntry.KadReset();
	tugasCreateTable();
}
export const storage_cl_Tugas = {
	dbName: "Tugas",
	contentName: "cl_Tugas",
	clear() {
		this.data = {};
	},
	get data() {
		return tugasOptions;
	},
	set data(data) {
		tugasOptions = deepClone(data);
		tugasCreateTable();
	},
};

function tugasClearRow(obj) {
	delete tugasOptions[obj.target];
	tugasCreateTable();
}

function tugasEditRow(value) {
	delete tugasOptions[value];
	dbID("idArea_tugasEntry").value = value;
}

function tugasNewEntry() {
	const value = idArea_tugasEntry.KadGet("", true);
	if (value == "") return;
	tugasOptions[value] = false;
	idArea_tugasEntry.value = "";
	tugasCreateTable();
	saveDiscipuli("Tugas");
}

function tugasCreateTable() {
	KadTable.clear(idTabBody_tugas);
	let tempList = [];
	for (let i = 0; i < objectLength(tugasOptions); i++) {
		tempList.push({
			name: Object.keys(tugasOptions)[i],
			state: Object.values(tugasOptions)[i],
		});
	}
	const sortedList = KadArray.sortArrayByKey(tempList, "name", false, true);

	//create list
	for (let i = 0; i < sortedList.length; i++) {
		let row = idTabBody_tugas.insertRow(idTabBody_tugas.rows.length);

		// get the data from the array
		const entryValue = sortedList[i].name;
		const entryState = sortedList[i].state;

		//clearButton
		KadTable.addCell(row, {
			names: ["tugasTrash", i],
			type: "Btn",
			subGroup: "subgrid",
			img: "trash",
			ui: {
				uiSize: "size1",
				uiType: "transparent",
			},
			style: {
				textAlign: "center",
			},
			onclick: tugasClearRow,
		});

		// EDIT
		KadTable.addCell(row, {
			names: ["tugasEdit", i],
			type: "Btn",
			subGroup: "subgrid",
			img: "edit",
			ui: {
				uiSize: "size1",
				uiType: "transparent",
			},
			style: {
				textAlign: "center",
			},
			onclick: () => {
				tugasEditRow(entryValue);
				dbID("idArea_tugasEntry").focus();
			},
		});

		// Check
		KadTable.addCell(row, {
			names: ["tugasCheck", i],
			type: "Vin",
			subGroup: "checkbox",
			pointer: true,
			style: {
				textAlign: "center",
			},
			checked: entryState,
			onclick: () => {
				const curRow = idTabBody_tugas.rows[i];
				let label = curRow.cells[3];
				let entry = curRow.cells[3].textContent;
				if (curRow.cells[2].childNodes[0].checked) {
					label.innerHTML = `<del>${entry}</del>`;
					tugasOptions[entry] = true;
				} else {
					label.textContent = entry;
					tugasOptions[entry] = false;
				}
			},
		});

		// TEXT
		KadTable.addCell(row, {
			names: ["tugas", i],
			type: "Lbl",
			text: entryState ? `<del>${entryValue}</del>` : entryValue,
			style: {
				textAlign: "left",
			},
			copy: true,
		});
	}
}
