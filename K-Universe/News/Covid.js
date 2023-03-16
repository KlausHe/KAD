let covidGraph = null;

const covidData = {
	url: "https://pomber.github.io/covid19/timeseries.json",
	data: null,
	dates: {
		datesUTC: [],
		selDateIndex: 0,
	},
};

function clear_cl_Covid() {
	covidDataGenerate();
}

function createCovidPikaday() {
	new Pikaday({
		field: dbID("idBtn_covidGraphDate"),
		showTime: false,
		firstDay: 1,
		position: "top",
		i18n: i18nDE,
		format: "DD-MM-YYYY",
		minDate: new Date(1579647600000),
		maxDate: new Date(),
		onSelect: (date) => {
			covidSetDates(date.getTime());
		},
	});
}

function covidSetDates(utc = null) {
	let btnTime;
	if (utc === null) {
		covidData.date = covidData.dates.datesUTC[0];
		btnTime = "Datum";
	} else {
		covidData.date = utc;
		btnTime = utilsDate(covidData.date);
	}
}
//----------------------------------------------------Data
function covidChangeDay(dir) {
	if (dir == 0) {
		covidData.dates.selDateIndex = covidData.dates.datesUTC.length - 1;
	} else {
		covidData.dates.selDateIndex = (covidData.dates.selDateIndex + Number(dir) + covidData.dates.datesUTC.length) % covidData.dates.datesUTC.length;
	}
	covidShowData();
}

async function covidLoadData(data) {
	covidData.data = data;
	covidDataGenerate();
}

function covidDataGenerate() {
	if (covidData.data == null) {
		globalP5.loadJSON(covidData.url, covidLoadData, "json");
		return;
	}
	covidData.dates.datesUTC = [];
	//create "World", needed for each country
	covidData.data["World"] = [];
	// for each day
	const refCountry = Object.keys(covidData.data)[0];
  covidData.dates.selDateIndex = covidData.data[refCountry].length - 1;
	for (let i = 0; i < covidData.data[refCountry].length; i++) {
		const utc = new Date(covidData.data[refCountry][i].date.replace(/-/g, "/")).getTime(); // dateUTC: 1579647600000
		covidData.dates.datesUTC[i] = utc;
		covidData.data.World[i] = {
			date: covidData.data[refCountry][i].date, // date: "2020-1-22"
			confirmed: 0,
			deaths: 0,
		};
		const world = covidData.data.World[i];
		for (const [key, val] of Object.entries(covidData.data)) {
			const obj = covidData.data[key][i];
			if (key != "World") {
				covidData.data.World[i].confirmed += val[i].confirmed;
				covidData.data.World[i].deaths += val[i].deaths;
			}
			obj.dateUTC = utc;
		}
	}
	covidShowData();
}

function covidShowData() {
	const dateIndex = covidData.dates.selDateIndex;
	dbID("idLbl_covidConfirmedOutput").textContent = `Infiziert: ${utilsNumber(covidData.data.World[dateIndex].confirmed, { indicator: true })}`;
	dbID("idLbl_covidDeathsOutput").textContent = `Todesfälle:  ${utilsNumber(covidData.data.World[dateIndex].deaths, { indicator: true })}`;
	dbID("idLbl_covidDay").textContent = utilsDate(covidData.dates.datesUTC[dateIndex], { leadingDigit: false });
	dataForLabel("idLbl_covidConfirmedOutput", utilsNumber(covidData.data.World[dateIndex].confirmed, { indicator: true }));
	dataForLabel("idLbl_covidDeathsOutput", utilsNumber(covidData.data.World[dateIndex].deaths, { indicator: true }));
}
