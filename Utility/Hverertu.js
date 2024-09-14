import { Data_Country_CodesIso3166 } from "../General/MainData.js";
import { dbID, initEL, KadFile, KadTable, log } from "../KadUtils/KadUtils.js";

const hverertuOptions = {
	input: "",
	dataCount: 0,
	data: {
		Alter: {
			value: null,
			description: "Alter (geschätzt)",
			get data() {
				KadFile.loadUrlToJSON({ variable: "data", url: `https://api.agify.io/?name=${hverertuOptions.input}`, callback: hverertuAlter });
			},
		},
		Gender: {
			value: null,
			description: "Geschlecht",
			get data() {
				KadFile.loadUrlToJSON({ variable: "data", url: `https://api.genderize.io?name=${hverertuOptions.input}`, callback: hverertuGender });
			},
		},
		Herkunft: {
			value: null,
			description: "Herkunft (nach Wahrscheinlichkeit)",
			get data() {
				KadFile.loadUrlToJSON({ variable: "data", url: `https://api.nationalize.io?name=${hverertuOptions.input}`, callback: hverertuHerkunft });
			},
		},
	},
};
initEL({ id: idVin_hverertuEntry, fn: hverertuGetData, resetValue: "Enter a Name" });
initEL({ id: idBtn_hverertuEntry, fn: hverertuGetData });

export function clear_cl_Hverertu() {
	idVin_hverertuEntry.KadReset();
	hverertuOptions.input = "";
	createHverertuTable();
}

function hverertuGetData() {
	hverertuOptions.input = idVin_hverertuEntry.KadGet();
	if (hverertuOptions.input == "") return;
	for (let obj in hverertuOptions.data) {
		hverertuOptions.data[obj].data;
	}
}

function hverertuPassValue(id) {
	dbID(`idLbl_child_hverertu_value_${id}`).innerHTML = hverertuOptions.data[id].value;
}

function hverertuAlter({ data }) {
	hverertuOptions.data.Alter.value = data.age == null ? "keine Daten gefunden" : data.age;
	hverertuPassValue("Alter");
	idLbl_child_hverertuHeader_Value.innerHTML = data.name;
}

function hverertuHerkunft({ data }) {
	log(data);
	if (data.country.length == 0) {
		hverertuOptions.data.Herkunft.value = "keine Daten gefunden";
	} else {
		hverertuOptions.data.Herkunft.value = data.country.map((obj) => {
			for (let item of Data_Country_CodesIso3166) {
				if (item.alpha2 == obj.country_id) return item.name;
			}
		});
		log(hverertuOptions.data.Herkunft.value);
	}
	hverertuOptions.data.Herkunft.value = `${hverertuOptions.data.Herkunft.value}`.replace(/,/g, ", ");
	hverertuPassValue("Herkunft");
}

function hverertuGender({ data }) {
	if (data.gender == null) {
		hverertuOptions.data.Gender.value = "keine Daten gefunden";
	} else {
		const gender = data.gender == "male" ? "männlich" : "weiblich";
		hverertuOptions.data.Gender.value = `${gender} (${data.probability * 100}%)`;
	}
	hverertuPassValue("Gender");
}

function createHverertuTable() {
	KadTable.clear("idTabHeader_Hverertu");
	const rowTh = KadTable.createRow("idTabHeader_Hverertu");
	KadTable.addHeaderCell(rowTh, {
		names: ["hverertuHeader", "Description"],
		type: "Lbl",
		text: "Name",
		cellStyle: {
			textAlign: "left",
		},
	});
	KadTable.addHeaderCell(rowTh, {
		names: ["hverertuHeader", "Value"],
		type: "Lbl",
		text: "...",
		cellStyle: {
			textAlign: "left",
		},
	});

	KadTable.clear("idTabBody_Hverertu");
	for (const objName in hverertuOptions.data) {
		const row = KadTable.createRow("idTabBody_Hverertu");
		KadTable.addCell(row, {
			names: ["hverertu", "description", objName],
			type: "Lbl",
			text: hverertuOptions.data[objName].description,
			cellStyle: {
				textAlign: "left",
			},
		});
		KadTable.addCell(row, {
			names: ["hverertu", "value", objName],
			type: "Lbl",
			text: "...",
			cellStyle: {
				textAlign: "left",
			},
		});
	}
}
