import { daEL, dbID, deepClone, error, objectLength, KadDOM, KadTable, KadDate, KadValue } from "../General/KadUtils.js";
import { Data_Currencies } from "../General/MainData.js";

const iomlaidOptions = {
	url: "https://api.exchangerate.host",
	data: {},
	options: {},
	optionsOrig: {
		base: "EUR",
		value: 10,
		date: null,
	},
	dateFormat: "YYYY-MM-DD",
};
let iomlaidPicker;

daEL(idVin_IomlaidCur, "input", () => iomlaidVinSet(idVin_IomlaidCur));
daEL(idSel_IomlaidCur, "change", () => iomlaidSelSet(idSel_IomlaidCur));

export function clear_cl_Iomlaid() {
	let dateStart = new Date();
	dateStart.setDate(dateStart.getDate() - 365);
	iomlaidOptions.data = {
		latest: {},
		historic: {},
	};
	iomlaidOptions.options = deepClone(iomlaidOptions.optionsOrig);
	iomlaidOptions.options.date = KadDate.getDate(dateStart, { format: iomlaidOptions.dateFormat });

	for (let [key, value] of Data_Currencies) {
		let option1 = document.createElement("option");
		option1.textContent = `${key} (${value})`;
		option1.setAttribute("data-base", key);
		dbID("idSel_IomlaidCur").appendChild(option1);
	}
	dbID("idSel_IomlaidCur").options[8].selected = true;

	KadDOM.resetInput("idVin_IomlaidCur", iomlaidOptions.options.value);
	dbID("idBtn_iomlaidDate").textContent = KadDate.getDate(iomlaidOptions.options.date);
	iomlaidCalculate();
}

export function createIomlaidPikaday() {
	iomlaidPicker = new Pikaday({
		field: dbID("idBtn_iomlaidDate"),
		showTime: false,
		i18n: Data_i18nDE,
		minDate: new Date(2000, 1, 1),
		maxDate: new Date(),
		onSelect: function () {
			iomlaidSelDate(iomlaidPicker._d);
		},
	});
}

function iomlaidVinSet(val) {
	iomlaidOptions.options.value = val.value == "" ? iomlaidOptions.optionsOrig.value : Number(val.value);
	if (objectLength(iomlaidOptions.data.latest) == 0 || objectLength(iomlaidOptions.data.historic) == 0) {
		iomlaidCalculate();
	} else {
		iomlaidTable();
	}
}

function iomlaidSelSet(sel) {
	iomlaidOptions.options.base = sel.options[sel.selectedIndex].dataset.base;
	iomlaidCalculate();
}

function iomlaidSelDate(date) {
	iomlaidOptions.options.date = KadDate.getDate(date, { format: iomlaidOptions.dateFormat });
	dbID("idBtn_iomlaidDate").textContent = KadDate.getDate(date);
	iomlaidCalculate();
}

async function iomlaidCalculate() {
	let date = KadDate.getDate(null, { format: iomlaidOptions.dateFormat });
	try {
		const fetches = [fetch(`${iomlaidOptions.url}/${date}?base=${iomlaidOptions.options.base}`), fetch(`${iomlaidOptions.url}/${iomlaidOptions.options.date}?base=${iomlaidOptions.options.base}`)];
		// console.log(`${iomlaidOptions.url}/${date}?base=${iomlaidOptions.options.base}`, `${iomlaidOptions.url}/${iomlaidOptions.options.date}?base=${iomlaidOptions.options.base}`);
		let results = await Promise.all(fetches);
		let data = await Promise.all(results.map((r) => r.json()));
		iomlaidOptions.data.latest = data[0].success == false ? null : data[0];
		iomlaidOptions.data.historic = data[1].success == false ? null : data[1];
		iomlaidTable();
	} catch (err) {
		error("Could not receive data for", "'Iomlaid'", err);
	}
}

function iomlaidTable() {
	dbID("idTabHeader_iomlaidRequestedAmount").textContent = `Betrag: ${KadValue.number(iomlaidOptions.options.value, { currency: iomlaidOptions.options.base })}`;
	KadTable.clear("idTabBody_Iomlaid");
	let i = 0;

	for (let [key, value] of Data_Currencies) {
		if (key != iomlaidOptions.options.base) {
			let row = KadTable.insertRow("idTabBody_Iomlaid");
			// Währung
			KadTable.addCell(row, {
				names: ["iomlaidCurrency", i],
				type: "Lbl",
				text: `${key} (${value})`,
				createCellClass: ["clTab_borderThinRight"],
				copy: true,
			});

			//latest Kurs
			KadTable.addCell(row, {
				names: ["iomlaidLatestChange", i],
				type: "Lbl",
				text: iomlaidOptions.data.latest == null ? "n.d." : KadValue.number(iomlaidOptions.data.latest.rates[key], { decimals: 3 }),
				cellStyle: {
					textAlign: "right",
				},
				copy: true,
			});
			//latest Betrag
			KadTable.addCell(row, {
				names: ["iomlaidLatestRate", i],
				type: "Lbl",
				text: iomlaidOptions.data.latest == null ? "n.d." : KadValue.number(iomlaidOptions.data.latest.rates[key] * iomlaidOptions.options.value, { currency: key }),
				createCellClass: ["clTab_borderThinRight"],
				cellStyle: {
					textAlign: "right",
				},
				copy: true,
			});

			//historic Kurs
			KadTable.addCell(row, {
				names: ["iomlaidHistoricChange", i],
				type: "Lbl",
				text: iomlaidOptions.data.historic == null ? "n.d." : KadValue.number(iomlaidOptions.data.historic.rates[key], { decimals: 3 }),
				cellStyle: {
					textAlign: "right",
				},
				copy: true,
			});

			//historic Betrag
			KadTable.addCell(row, {
				names: ["iomlaidHistoricRate", i],
				type: "Lbl",
				text: iomlaidOptions.data.historic == null ? "n.d." : KadValue.number(iomlaidOptions.data.historic.rates[key] * iomlaidOptions.options.value, { currency: key }),
				cellStyle: {
					textAlign: "right",
				},
				copy: true,
			});
		}
		i++;
	}
}
