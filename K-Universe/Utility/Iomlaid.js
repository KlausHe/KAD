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

function clear_cl_Iomlaid() {
	let dateStart = new Date();
	dateStart.setDate(dateStart.getDate() - 365);
	iomlaidOptions.data = {
		latest: {},
		historic: {},
	};
	iomlaidOptions.options = deepClone(iomlaidOptions.optionsOrig);
	iomlaidOptions.options.date = utilsDate(dateStart, { format: iomlaidOptions.dateFormat });

	for (let [key, value] of currencies) {
		let option1 = document.createElement("option");
		option1.textContent = `${key} (${value})`;
		option1.setAttribute("data-base", key);
		dbID("idSel_IomlaidCur").appendChild(option1);
	}
	dbID("idSel_IomlaidCur").options[8].selected = true;

	utilsResetInput("idVin_IomlaidCur", iomlaidOptions.options.value);
	dbID("idBtn_iomlaidDate").textContent = utilsDate(iomlaidOptions.options.date);
	iomlaidCalculate();
}

function createIomlaidPikaday() {
	iomlaidPicker = new Pikaday({
		field: dbID("idBtn_iomlaidDate"),
		showTime: false,
		i18n: i18nDE,
		minDate: new Date(2000, 1, 1),
		maxDate: new Date(),
		onSelect: function () {
			iomlaidSelDate(iomlaidPicker._d);
		},
	});
}

function iomlaidVinSet(val) {
	iomlaidOptions.options.value = val.value == "" ? iomlaidOptions.optionsOrig.value : Number(val.value);
	if (Object.keys(iomlaidOptions.data.latest).length == 0 || Object.keys(iomlaidOptions.data.historic).length == 0) {
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
	iomlaidOptions.options.date = utilsDate(date, { format: iomlaidOptions.dateFormat });
	dbID("idBtn_iomlaidDate").textContent = utilsDate(date);
	iomlaidCalculate();
}

async function iomlaidCalculate() {
	let date = utilsDate(null, { format: iomlaidOptions.dateFormat });
	try {
		const fetches = [fetch(`${iomlaidOptions.url}/${date}?base=${iomlaidOptions.options.base}`), fetch(`${iomlaidOptions.url}/${iomlaidOptions.options.date}?base=${iomlaidOptions.options.base}`)];

		console.log(`${iomlaidOptions.url}/${date}?base=${iomlaidOptions.options.base}`, `${iomlaidOptions.url}/${iomlaidOptions.options.date}?base=${iomlaidOptions.options.base}`);
		let results = await Promise.all(fetches);
		let data = await Promise.all(results.map((r) => r.json()));
		iomlaidOptions.data.latest = data[0].success == false ? null : data[0];
		iomlaidOptions.data.historic = data[1].success == false ? null : data[1];
		iomlaidTable();
	} catch (err) {
		console.error(err);
	}
}

function iomlaidTable() {
	dbID("idTabHeader_iomlaidRequestedAmount").textContent = `Betrag: ${utilsNumber(iomlaidOptions.options.value, { currency: iomlaidOptions.options.base })}`;
	clearTable("idTabBody_Iomlaid");
	let i = 0;

	for (let [key, value] of currencies) {
		if (key != iomlaidOptions.options.base) {
			let row = insertTableRow("idTabBody_Iomlaid");
			// Währung
			tableAddCell(row, {
				names: ["iomlaidCurrency", i],
				type: "Lbl",
				text: `${key} (${value})`,
				createCellClass: ["clTab_borderThinRight"],
				copy: true,
			});

			//latest Kurs
			tableAddCell(row, {
				names: ["iomlaidLatestChange", i],
				type: "Lbl",
				text: iomlaidOptions.data.latest == null ? "n.d." : utilsNumber(iomlaidOptions.data.latest.rates[key], { decimals: 3 }),
				cellStyle: {
					textAlign: "right",
				},
				copy: true,
			});
			//latest Betrag
			tableAddCell(row, {
				names: ["iomlaidLatestRate", i],
				type: "Lbl",
				text: iomlaidOptions.data.latest == null ? "n.d." : utilsNumber(iomlaidOptions.data.latest.rates[key] * iomlaidOptions.options.value, { currency: key }),
				createCellClass: ["clTab_borderThinRight"],
				cellStyle: {
					textAlign: "right",
				},
				copy: true,
			});

			//historic Kurs
			tableAddCell(row, {
				names: ["iomlaidHistoricChange", i],
				type: "Lbl",
				text: iomlaidOptions.data.historic == null ? "n.d." : utilsNumber(iomlaidOptions.data.historic.rates[key], { decimals: 3 }),
				cellStyle: {
					textAlign: "right",
				},
				copy: true,
			});

			//historic Betrag
			tableAddCell(row, {
				names: ["iomlaidHistoricRate", i],
				type: "Lbl",
				text: iomlaidOptions.data.historic == null ? "n.d." : utilsNumber(iomlaidOptions.data.historic.rates[key] * iomlaidOptions.options.value, { currency: key }),
				cellStyle: {
					textAlign: "right",
				},
				copy: true,
			});
		}
		i++;
	}
}
