import { initEL, objectLength, KadTable, KadValue, KadDate, log } from "../KadUtils/KadUtils.js";

const kadarOptions = {
	valA: null,
	tableA: "idTabBody_Kadar_Anow",
	valB: null,
	tableB: "idTabBody_Kadar_Bnow",
	diffAB: null,
	tableAB: "idTabBody_Kadar_AB",
	diff: null,
	format: "YYYY-MM-DDTHH:mm",
	dateOrig(days) {
return KadDate.getDate(new Date(new Date().getTime() + days * 86400000), { format: this.format });
	},
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

initEL({ id: idVin_kadarDateA, fn: kadarDateSelectedA, resetValue: kadarOptions.dateOrig(-7), dateOpts: { format: kadarOptions.format, dateObject: true } });
initEL({ id: idVin_kadarDateB, fn: kadarDateSelectedB, resetValue: kadarOptions.dateOrig(7), dateOpts: { format: kadarOptions.format, dateObject: true } });
initEL({ id: idBtn_kadarTrashA, fn: clearKadarTableAnow });
initEL({ id: idBtn_kadarRefresh, fn: kadarCalculate });
initEL({ id: idBtn_kadarTrashB, fn: clearKadarTableBnow });

export function clear_cl_Kadar() {
	kadarOptions.valA = idVin_kadarDateA.KadReset(); 
	kadarOptions.valB = idVin_kadarDateB.KadReset(); 
	kadarOptions.valAB = null;
	idLbl_kadarDateNow.textContent = KadDate.getDate();
	kadarCalculate();
}

function kadarDateSelectedA() {
	kadarOptions.valA = idVin_kadarDateA.KadGet();
  log(kadarOptions.valA)
	kadarCalculate();
}
function kadarDateSelectedB() {
	kadarOptions.valB = idVin_kadarDateB.KadGet();
	kadarCalculate();
}

function clearKadarTableAnow() {
	KadTable.clear(kadarOptions.tableA);
	kadarOptions.valA = null;
	kadarCalculate();
}

function clearKadarTableBnow() {
	KadTable.clear(kadarOptions.tableB);
	kadarOptions.valB = null;
	kadarCalculate();
}

function kadarCalculate() {
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
		idLbl_kadarDateNow.textContent = KadDate.getDate();
		KadTable.clear(kadarOptions.tableAB);
	}
}

function kadarTable(tableID) {
	KadTable.clear(tableID);
	for (let i = 0; i < objectLength(kadarOptions.calc); i++) {
		const time = Object.keys(kadarOptions.calc)[i];
		const row = KadTable.createRow(tableID);

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
