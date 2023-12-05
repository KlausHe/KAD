import { daEL, dbID, KadTable, KadValue, KadDate } from "../General/KadUtils.js";

const kadarOptions = {
	valA: null,
	tableA: "idTabBody_Kadar_Anow",
	valB: null,
	tableB: "idTabBody_Kadar_Bnow",
	diffAB: null,
	tableAB: "idTabBody_Kadar_AB",
	diff: null,
	calc: {
		millis: {
			text: (t) => {
				return t ? "Millisekunde" : "Millisekunden";
			},
			get val() {
				return KadValue.number(kadarOptions.diff);
			},
		},
		seconds: {
			text: (t) => {
				return t ? "Sekunde" : "Sekunden";
			},
			get val() {
				return KadValue.number(kadarOptions.diff / 1000);
			},
		},
		minutes: {
			text: (t) => {
				return t ? "Minute" : "Minuten";
			},
			get val() {
				return KadValue.number(kadarOptions.diff / 60000);
			},
		},
		hours: {
			text: (t) => {
				return t ? "Stunde" : "Stunden";
			},
			get val() {
				return KadValue.number(kadarOptions.diff / 3600000);
			},
		},
		days: {
			text: (t) => {
				return t ? "Tag" : "Tage";
			},
			get val() {
				return KadValue.number(kadarOptions.diff / 86400000);
			},
		},
		weeks: {
			text: (t) => {
				return t ? "Woche" : "Wochen";
			},
			get val() {
				return KadValue.number(kadarOptions.diff / 604800000);
			},
		},
		month: {
			text: (t) => {
				return t ? "Monat" : "Monate";
			},
			get val() {
				return KadValue.number(kadarOptions.diff / 2620800000);
			},
		},
		years: {
			text: (t) => {
				return t ? "Jahr" : "Jahre";
			},
			get val() {
				return KadValue.number(kadarOptions.diff / 31449600000);
			},
		},
	},
};

daEL(idBtn_kadarTrashA, "click", clearKadarTableAnow);
daEL(idBtn_kadarRefresh, "click", kadarCalculate);
daEL(idBtn_kadarTrashB, "click", clearKadarTableBnow);

export function clear_cl_Kadar() {
  // createKadarPikaday("A");
	// createKadarPikaday("B");

	kadarOptions.valA = null;
	kadarOptions.valB = null;
	kadarOptions.valAB = null;
	dbID("idBtn_kadarDateNow").textContent = KadDate.getDate();
	KadTable.clear(kadarOptions.tableA);
	KadTable.clear(kadarOptions.tableB);
	KadTable.clear(kadarOptions.tableAB);
}

function clearKadarTableAnow() {
	KadTable.clear(kadarOptions.tableA);
	kadarOptions.valA = null;
	dbID("idBtn_kadarDateA").textContent = "Start Datum";
	kadarCalculate();
}

function clearKadarTableBnow() {
	KadTable.clear(kadarOptions.tableB);
	kadarOptions.valB = null;
	dbID("idBtn_kadarDateB").textContent = "End Datum";
	kadarCalculate();
}

function createKadarPikaday(loc) {
	new Pikaday({
		field: dbID(`idBtn_kadarDate${loc}`),
		showTime: true,
		firstDay: 1,
		position: "top",
		i18n: Data_i18nDE,
		onSelect: (date) => {
			kadarOptions[`val${loc}`] = date.getTime();
			dbID(`idBtn_kadarDate${loc}`).textContent = KadDate.getDate(date);
			kadarCalculate();
		},
	});
}

function kadarCalculate() {
	//calculate Table A-Now
	if (kadarOptions.valA != null) {
		kadarOptions.diff = Math.abs(kadarOptions.valA - new Date().getTime());
		kadarTable(kadarOptions.tableA);
	}
	if (kadarOptions.valB != null) {
		kadarOptions.diff = Math.abs(kadarOptions.valB - new Date().getTime());
		kadarTable(kadarOptions.tableB);
	}
	if (kadarOptions.valA != null && kadarOptions.valB != null) {
		kadarOptions.diff = Math.abs(kadarOptions.valA - kadarOptions.valB);
		kadarTable(kadarOptions.tableAB);
	} else {
		dbID("idBtn_kadarDateNow").textContent = KadDate.getDate();
		KadTable.clear(kadarOptions.tableAB);
	}
}

function kadarTable(tableID) {
	KadTable.clear(tableID);
	for (let i = 0; i < Object.keys(kadarOptions.calc).length; i++) {
		const time = Object.keys(kadarOptions.calc)[i];
		const row = KadTable.insertRow(tableID);

		// time
		KadTable.addCell(row, {
			names: ["kadarTime", i],
			type: "Lbl",
			text: kadarOptions.calc[time].val,
			cellStyle: {
				textAlign: "right",
			},
			copy: true,
		});

		//  Unit
		KadTable.addCell(row, {
			names: ["kadarTime", i],
			type: "Lbl",
			text: kadarOptions.calc[time].text(Math.abs(kadarOptions.calc[time].val) == 1),
		});
	}
}
