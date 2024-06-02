import { initEL, KadDOM, KadTable } from "../General/KadUtils.js";
const ranjeOptions = {
	value: 36,
	results: [],
};

initEL({ id: idVin_ranjeVal, fn: ranjeCalc, resetValue: 36 });

export function clear_cl_Ranje() {
	idVin_ranjeVal.KadReset();
	ranjeCalc();
}

function ranjeCalc() {
	ranjeOptions.results = [];
	ranjeOptions.value = KadDOM.numberFromInput(idVin_ranjeVal);
	for (let i = 2; i < ranjeOptions.value; i++) {
		if (ranjeOptions.value % i === 0) {
			ranjeOptions.results.push([i, Math.floor(ranjeOptions.value / i)]);
		}
	}
	if (ranjeOptions.results.length == 0) {
		ranjeOptions.results.push([ranjeOptions.value, 1]);
	}
	tableRanjeCalculate();
}

function tableRanjeCalculate() {
	KadTable.clear("idTabHeader_ranjeList");
	KadTable.clear("idTabBody_ranjeList");
	for (let i = 0; i < ranjeOptions.results.length; i++) {
		const row = KadTable.insertRow("idTabBody_ranjeList");
		KadTable.addCell(row, {
			names: ["ranje", "op", i],
			type: "Lbl",
			text: ranjeOptions.value,
			cellStyle: {
				textAlign: "center",
			},
		});
		KadTable.addCell(row, {
			names: ["ranje", "eq", i],
			type: "Lbl",
			text: "=",
			cellStyle: {
				textAlign: "center",
			},
		});
		KadTable.addCell(row, {
			names: ["ranje", "res", i],
			type: "Lbl",
			text: `${ranjeOptions.results[i][0]} x ${ranjeOptions.results[i][1]}`,
			copy: true,
		});
	}
}
