// https://github.com/fawazahmed0/exchange-api?tab=readme-ov-file
import { daEL, dbID, error, KadDOM, KadTable, KadDate, KadValue } from "../General/KadUtils.js";
import { Data_Currencies } from "../General/MainData.js";

const iomlaidOptions = {
	get URLnow() {
		return `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${iomlaidOptions.baseCurrency.toLowerCase()}.min.json`;

		// return `https://api.exchangerate.host${date}?base=${iomlaidOptions.baseCurrency}`;
		// return `https://api.exchangerate.host${date}?base=${iomlaidOptions.baseCurrency}`;
	},
	get URLhistoric() {
		return `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${this.date}/v1/currencies/${iomlaidOptions.baseCurrency.toLowerCase()}.min.json`;
		// return `https://api.exchangerate.host${this.date}?base=${iomlaidOptions.baseCurrency}`;
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
	dateFormat: "YYYY-MM-DD",
};

daEL(idSel_IomlaidCur, "change", iomlaidCurrencyChange);
daEL(idVin_IomlaidDate, "input", iomlaidDateChange);
daEL(idVin_IomlaidCur, "input", iomlaidValueChange);

export function clear_cl_Iomlaid() {
	iomlaidOptions.dataReceived = false;
	iomlaidOptions.latest = {};
	iomlaidOptions.historic = {};
	iomlaidOptions.baseCurrency = iomlaidOptions.optionsOrig.baseCurrency;

	let dateStart = new Date();
	dateStart.setDate(dateStart.getDate() - 365);
	iomlaidOptions.optionsOrig.date = KadDate.getDate(dateStart, { format: iomlaidOptions.dateFormat });
	iomlaidOptions.date = KadDOM.resetInput("idVin_IomlaidDate", iomlaidOptions.optionsOrig.date, { min: "2024-03-01" });
	for (let currency of Data_Currencies) {
		let option = document.createElement("option");
		option.textContent = `${currency.cc} (${currency.name})`;
		option.value = currency.cc;
		if (currency.cc == "EUR") {
			option.selected = true;
		}
		dbID("idSel_IomlaidCur").appendChild(option);
	}

	iomlaidOptions.value = KadDOM.resetInput("idVin_IomlaidCur", iomlaidOptions.optionsOrig.value);
	iomlaidGetData();
}

function iomlaidCurrencyChange() {
	iomlaidOptions.baseCurrency = dbID(idSel_IomlaidCur).value;
	iomlaidGetData();
}
function iomlaidDateChange() {
	iomlaidOptions.date = KadDate.dateFromInput(idVin_IomlaidDate, iomlaidOptions.dateFormat);
	iomlaidGetData();
}

function iomlaidValueChange() {
	iomlaidOptions.value = KadDOM.numberFromInput(idVin_IomlaidCur, iomlaidOptions.optionsOrig.value);
	iomlaidTable();
}

async function iomlaidGetData() {
	iomlaidOptions.dataReceived = false;
	try {
		let results = await Promise.all([fetch(iomlaidOptions.URLnow), fetch(iomlaidOptions.URLhistoric)]);
		let data = await Promise.all(results.map((r) => r.json()));
		iomlaidOptions.dataReceived = true;
		iomlaidOptions.latest = data[0][iomlaidOptions.baseCurrency.toLowerCase()];
		iomlaidOptions.historic = data[1][iomlaidOptions.baseCurrency.toLowerCase()];
		dbID(idTabHeader_iomlaidDatedDate).textContent = data[1].date;
		iomlaidOptions.date = KadDOM.resetInput("idVin_IomlaidDate", data[1].date);

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
