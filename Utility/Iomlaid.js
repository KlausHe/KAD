// https://github.com/fawazahmed0/exchange-api?tab=readme-ov-file
import { initEL, dbID, error, KadDOM, KadTable, KadDate, KadValue, log } from "../General/KadUtils.js";
import { Data_Currencies } from "../General/MainData.js";

const iomlaidOptions = {
	get URLnow() {
		return `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${iomlaidOptions.baseCurrency.toLowerCase()}.min.json`;
	},
	get URLhistoric() {
		return `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${this.date}/v1/currencies/${iomlaidOptions.baseCurrency.toLowerCase()}.min.json`;
	},
	latest: null,
	historic: null,
	dataReceived: false,
	baseCurrency: null,
	optionsOrig: {
		baseCurrency: "EUR",
		value: 10,
		date: null,
	},
	value: 10,
	date: null,
	dateDatabase: "2024-03-03",
	dateFormat: "YYYY-MM-DD",
	get minDate() {
		let past = KadDate.getDate(new Date().setFullYear(new Date().getFullYear() - 1), { format: iomlaidOptions.dateFormat });
		return past < this.dateDatabase ? this.dateDatabase : past;
	},
};

initEL({
	id: idSel_IomlaidCur,
	fn: iomlaidCurrencyChange,
	selStartValue: iomlaidOptions.optionsOrig.baseCurrency,
	selList: Data_Currencies.map((currency) => [`${currency.cc} (${currency.name})`, currency.cc]),
});
initEL({
	id: idVin_IomlaidDate,
	fn: iomlaidDateChange,
	resetValue: iomlaidOptions.minDate,
	domOpts: { min: iomlaidOptions.dateDatabase },
});
initEL({ id: idVin_IomlaidCur, fn: iomlaidValueChange, resetValue: iomlaidOptions.optionsOrig.value });

export function clear_cl_Iomlaid() {
	iomlaidOptions.dataReceived = false;
	iomlaidOptions.latest = {};
	iomlaidOptions.historic = {};
	iomlaidOptions.baseCurrency = iomlaidOptions.optionsOrig.baseCurrency;
	iomlaidOptions.date = idVin_IomlaidDate.KadReset();
	iomlaidOptions.value = idVin_IomlaidCur.KadReset();
	idSel_IomlaidCur.KadReset();
	iomlaidGetData();
}

function iomlaidCurrencyChange() {
	iomlaidOptions.baseCurrency = idSel_IomlaidCur.KadGet();
	iomlaidGetData();
}
function iomlaidDateChange() {
	iomlaidOptions.date = KadDate.dateFromInput(idVin_IomlaidDate, iomlaidOptions.dateFormat);
	iomlaidGetData();
}

function iomlaidValueChange() {
	iomlaidOptions.value = idVin_IomlaidCur.KadGet();
	iomlaidTable();
}

async function iomlaidGetData() {
	iomlaidOptions.dataReceived = false;
	idTabHeader_iomlaidDatedDate.textContent = "searching...";
	try {
		let resultNow = await fetch(iomlaidOptions.URLnow);
		let dataNow = await resultNow.json();
		let resultHistory = await fetch(iomlaidOptions.URLhistoric);
		let dataHistory = await resultHistory.json();
		iomlaidOptions.dataReceived = true;
		iomlaidOptions.latest = dataNow[iomlaidOptions.baseCurrency.toLowerCase()];
		iomlaidOptions.historic = dataHistory[iomlaidOptions.baseCurrency.toLowerCase()];
		idTabHeader_iomlaidDatedDate.textContent = `Kurs vom ${dataHistory.date}`;
		iomlaidOptions.date = idVin_IomlaidDate.KadReset({ resetValue: dataHistory.date });
		iomlaidTable();
	} catch (err) {
		error("Could not receive data for", "'Iomlaid'", err);
	}
}

function iomlaidTable() {
	if (!iomlaidOptions.dataReceived) return;
	dbID("idTabHeader_iomlaidRequestedAmount").textContent = `Betrag: ${KadValue.number(iomlaidOptions.value, { currency: iomlaidOptions.baseCurrency })}`;
	KadTable.clear("idTabBody_Iomlaid");
	let i = 0;
	for (let currency of Data_Currencies) {
		const key = currency.cc;
		const symbol = currency.symbol;
		let row = KadTable.insertRow("idTabBody_Iomlaid");
		// Währung
		KadTable.addCell(row, {
			names: ["iomlaidCurrency", i],
			type: "Lbl",
			text: `${currency.name} (${key})`,
			createCellClass: ["clTab_UIBorderThinRight"],
			cellStyle: {
				textAlign: "right",
			},
			copy: false,
		});

		//latest Kurs
		KadTable.addCell(row, {
			names: ["iomlaidLatestChange", i],
			type: "Lbl",
			text: iomlaidOptions.latest == null ? "n.d." : KadValue.number(iomlaidOptions.latest[key.toLowerCase()], { decimals: 3 }),
			cellStyle: {
				textAlign: "right",
			},
			copy: true,
		});
		//latest Betrag
		KadTable.addCell(row, {
			names: ["iomlaidLatestRate", i],
			type: "Lbl",
			text: iomlaidOptions.latest == null ? "n.d." : `${KadValue.number(iomlaidOptions.latest[key.toLowerCase()] * iomlaidOptions.value)} ${symbol}`,
			createCellClass: ["clTab_UIBorderThinRight"],
			cellStyle: {
				textAlign: "right",
			},
			copy: true,
		});

		//historic Kurs
		KadTable.addCell(row, {
			names: ["iomlaidHistoricChange", i],
			type: "Lbl",
			text: iomlaidOptions.historic == null ? "n.d." : KadValue.number(iomlaidOptions.historic[key.toLowerCase()], { decimals: 3 }),
			cellStyle: {
				textAlign: "right",
			},
			copy: true,
		});

		//historic Betrag
		KadTable.addCell(row, {
			names: ["iomlaidHistoricRate", i],
			type: "Lbl",
			text: iomlaidOptions.historic == null ? "n.d." : `${KadValue.number(iomlaidOptions.historic[key.toLowerCase()] * iomlaidOptions.value)} ${symbol}`,
			cellStyle: {
				textAlign: "right",
			},
			copy: true,
		});
	}
	i++;
}
