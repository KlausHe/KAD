import { daEL, deepClone, dbID, objectLength, KadArray, KadDOM, KadTable } from "../General/KadUtils.js";

let tugasOptions = {};

daEL(idArea_tugasEntry, "change", newTugas);
daEL(idBtn_tugasEntry, "click", newTugas);

export function clear_cl_Tugas() {
	tugasOptions = {};
	createTugas();
	KadDOM.resetInput("idArea_tugasEntry", "Paste to Tugas");
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
		createTugas();
	},
};

function clearRowTugas(name) {
	delete tugasOptions[name];
	createTugas();
}

function editRowTugas(name) {
	delete tugasOptions[name];
	dbID("idArea_tugasEntry").value = name;
}

function newTugas() {
	const value = dbID("idArea_tugasEntry").value.toString().trim();
	if (value == "") return;

	tugasOptions[value] = false;
	dbID("idArea_tugasEntry").value = "";
	createTugas();
	saveDiscipuli("Tugas");
}

function createTugas() {
	//clear list
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
			onclick: () => {
				clearRowTugas(entryValue);
			},
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
				editRowTugas(entryValue);
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
