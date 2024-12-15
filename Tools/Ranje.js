import { initEL, KadTable } from "../KadUtils/KadUtils.js";
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
	ranjeOptions.value = idVin_ranjeVal.KadGet();
	for (let i = 2; i < ranjeOptions.value; i++) {
		if (ranjeOptions.value % i === 0) {
			ranjeOptions.results.push([i, Math.floor(ranjeOptions.value / i)]);
		}
	}
	if (ranjeOptions.results.length == 0) {
		ranjeOptions.results.push([ranjeOptions.value, 1]);
	}
	ranjeCreateTable();
}

function ranjeCreateTable() {
	const body = [
		//
		{ data: ranjeOptions.value, settings: { align: "right", noBorder: "right" } },
		{ data: "=", settings: { align: "center", noBorder: "right" } },
		{ data: ranjeOptions.results.map((item) => `${item[0]} x ${item[1]}`), settings: { align: "left" } },
	];

	KadTable.createHTMLGrid({ id: idTab_ranjeTable, body });
}
