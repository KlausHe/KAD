import * as KadUtils from "../General/KadUtils.js";
import { Data_Country_GermanDistrics, Data_Nummernschild } from "../General/MainData.js";
import { globalValues } from "../Settings/Basics.js";

let howaData = {
	dwdURL: "https://www.dwd.de/DWD/warnungen/warnapp_gemeinden/json/warnungen_gemeinde_map_",
	data: [],
	latOrig: 48.532815892352254,
	lonOrig: 8.716694050959608,
	pos: {},
	getTimer: null,
};

const weaterMaps = {
	shown: false,
	criteria: [
		//
		{
			url: "gewitter",
			name: "Gewitter",
		},
		{
			url: "regen",
			name: "Stark- oder Dauerregen",
		},
		{
			url: "schnee",
			name: "Schneefall",
		},
		{
			url: "sturm",
			name: "Wind (Sturm, Orkan)",
		},
		{
			url: "nebel",
			name: "Nebel",
		},
		{
			url: "frost",
			name: "Frost",
		},
		{
			url: "glatteis",
			name: "Glätte, Glatteis",
		},
		{
			url: "tauwetter",
			name: "Tauwetter",
		},
		{
			url: "hitze",
			name: "Hitze",
		},
		{
			url: "uv",
			name: "UV-Strahlung",
		},
	],
};

let howaGraph = null;
const howaOptions = {
	zoomed: false,
	maxZoomedData: 9,
	intervalRefresh: null,
	graphTypes: [
		{
			label: "Temperatur",
			yAxis: "temperature",
			dbID: "idCb_howaTemperature",
			checked: true,
			dataPath: ["main", "temp"],
			color: "black",
		},
		{
			label: "Regen",
			yAxis: "rain",
			dbID: "idCb_howaRain",
			checked: true,
			dataPath: ["pop"],
			color: "darkblue",
		},
		{
			label: "Luftfeuchtigkeit",
			yAxis: "humidity",
			dbID: "idCb_howaHumidity",
			checked: false,
			dataPath: ["main", "humidity"],
			color: "DarkMagenta",
		},
		{
			label: "Luftdruck",
			yAxis: "pressure",
			dbID: "idCb_howaPressure",
			checked: false,
			dataPath: ["main", "pressure"],
			color: "red",
		},
		{
			label: "Windgeschwindigkeit",
			yAxis: "windSpeed",
			dbID: "idCb_howaWindSpeed",
			checked: false,
			dataPath: ["wind", "speed"],
			color: "darkblue",
		},
		{
			label: "Windrichtung",
			yAxis: "windDirection",
			dbID: "idCb_howaWindDirection",
			checked: false,
			dataPath: ["wind", "deg"],
			color: "DarkMagenta",
		},
	],
	datasetStyle: {
		xAxisID: "howaDate",
		fill: false,
		pointStyle: "point",
		borderWidth: 2,
		pointRadius: 1,
		showLine: true,
		lineTension: 0.4,
	},
	get ticksStyle() {
		return {
			autoSkip: true,
			fontSize: globalValues.mediaSizes.fontSize * 0.8,
			autoSkipPadding: globalValues.mediaSizes.fontSize,
			beginAtZero: false,
		};
	},
	get gridLinesStyle() {
		return {
			gridLines: {
				drawOnChartArea: true,
				tickMarkLength: 5,
			},
		};
	},
};

KadUtils.daEL(idVin_howaEntry, "change", howaGetLocation);
KadUtils.daEL(idVin_howaEntry, "focus", () => howaPopulateDatalist(idVin_howaEntry));
KadUtils.daEL(idBtn_getGeoLocation, "click", howaGetCoordinates);
KadUtils.daEL(idBtn_howaGetLocation, "click", howaGetLocation);
KadUtils.daEL(idCb_howaTemperature, "click", howaOptionChange);
KadUtils.daEL(idCb_howaPressure, "click", howaOptionChange);
KadUtils.daEL(idCb_howaRain, "click", howaOptionChange);
KadUtils.daEL(idCb_howaWindSpeed, "click", howaOptionChange);
KadUtils.daEL(idCb_howaHumidity, "click", howaOptionChange);
KadUtils.daEL(idCb_howaWindDirection, "click", howaOptionChange);
KadUtils.daEL(idBtn_howaZoom, "click", () => howaZoom(idBtn_howaZoom));
KadUtils.daEL(idBtn_howaMapsExpand, "click", howaMapsExpand);
KadUtils.daEL(idSel_howaMapsCriteria, "change", howaChangeMap);
KadUtils.daEL(idSel_howaMapsCountry, "change", howaChangeMap);

export function clear_cl_Howa() {
  KadUtils.KadDOM.resetInput("idVin_howaEntry", "Ort");


	if (howaOptions.intervalRefresh != null) {
		clearInterval(howaOptions.intervalRefresh);
		howaOptions.intervalRefresh = null;
	}
	howaData.pos = {
		location: null,
		lat: howaData.latOrig,
		lon: howaData.lonOrig,
	};
	//reset CB-Selections
	for (let i = 0; i < howaOptions.graphTypes.length; i++) {
		KadUtils.dbID(howaOptions.graphTypes[i].dbID).checked = howaOptions.graphTypes[i].checked;
	}

	//populate MapSelectCriteria
	for (let i = 0; i < weaterMaps.criteria.length; i++) {
		KadUtils.dbID("idSel_howaMapsCriteria").options[i] = new Option(weaterMaps.criteria[i].name);
	}

	//populate MapSelectCountry
	for (let [index, land] of Data_Country_GermanDistrics.entries()) {
		KadUtils.dbID("idSel_howaMapsCountry").options[index] = new Option(land.LandDE);
	}
	KadUtils.dbIDStyle("idSel_howaMapsCriteria").display = "none";
	KadUtils.dbIDStyle("idSel_howaMapsCountry").display = "none";
	KadUtils.dbIDStyle("idImg_howaMapsImg").display = "none";
	howaGetCoordinates();
}

export const storage_cl_Howa = {
	dbName: "Howa",
	contentName: "cl_Howa",
	clear() {
		this.data = "Berlin";
	},
	get data() {
		return howaData.pos.location;
	},
	set data(data) {
		KadUtils.dbID("idVin_howaEntry").value = data;
		howaGetLocation();
	},
};

export function canvas_cl_Howa() {
	howaRefreshGraph();
	howaColorGraph();
}

function howaPopulateDatalist() {
	if (KadUtils.dbID("idDlist_howaPlaces").childNodes.length > 1) return;
	for (const city of Data_Nummernschild.values()) {
		const opt = document.createElement("OPTION");
		opt.textContent = city;
		KadUtils.dbID("idDlist_howaPlaces").appendChild(opt);
	}
}

function howaGetCoordinates() {
	if ("geolocation" in navigator) {
		howaData.pos.location = null;
		KadUtils.dbID("idVin_howaEntry").value = "";
		KadUtils.dbIDStyle("idBtn_getGeoLocation").display = "initial";
		navigator.geolocation.getCurrentPosition(howaNavigatorPosition, howaNavigatorError);
	} else {
		howaNavigatorError();
		KadUtils.dbIDStyle("idBtn_getGeoLocation").display = "none";
	}
}

function howaNavigatorPosition(data) {
	howaData.pos.lat = data.coords.latitude || howaData.latOrig;
	howaData.pos.lon = data.coords.longitude || howaData.lonOrig;
	howaReqestData();
}

function howaNavigatorError() {
	KadUtils.dbID("idLbl_howaNow").textContent = "No Geolocation";
	howaData.pos.lat = howaData.latOrig;
	howaData.pos.lon = howaData.lonOrig;
	howaReqestData();
}

async function howaGetLocation() {
	let input = KadUtils.dbID("idVin_howaEntry").value.trim();
	if (input == "") return;
	howaData.pos.location = input;
	howaReqestData();
}

function howaReqestData() {
	if (howaData.getTimer != null) {
		clearTimeout(howaData.getTimer);
		howaData.getTimer = null;
	}
	howaData.getTimer = setTimeout(() => {
		KadUtils.socketPost("Howa", howaData.pos, howaReturn);
		howaData.getTimer = null;
	}, 400);
}

function howaReturn(data) {
	if (data.error) {
		KadUtils.dbID("idLbl_howaNow").textContent = "Stadt nicht gefunden";
		return;
	}

	if (data != null) {
		howaData.pos.location = data.currentData.name;
		howaData.data = [data.currentData, ...data.forecastData.list];
	}
	//start Interval
	if (howaOptions.intervalRefresh === null) {
		howaOptions.intervalRefresh = setInterval(howaReqestData, globalValues.intervalJSON);
	}

	KadUtils.dbID("idLbl_howaNow").textContent = `${howaData.pos.location}: ${howaData.data[0].main.temp}°C`;

	/* Get suitable icon for howa */
	const iconS = document.createElement("i");
	KadUtils.dbID("idLbl_howaNow").appendChild(iconS);
	iconS.id = "idI_howaIconNow";
	iconS.classList.remove(...iconS.classList);
	iconS.classList.add("wi");
	const dayTime = KadUtils.KadDate.hourAsNumber() >= KadUtils.KadDate.hourAsNumber(howaData.data[0].sys.sunrise) && KadUtils.KadDate.hourAsNumber() < KadUtils.KadDate.hourAsNumber(howaData.data[0].sys.sunset) ? "day" : "night";
	iconS.classList.add(`wi-owm-${dayTime}-${howaData.data[0].weather[0].id}`);

	//refresh Graph-data
	howaRefreshGraph();
	howaOptionChange();
	howaColorGraph();
}

function howaZoom(obj) {
	howaOptions.zoomed = !howaOptions.zoomed;
	KadUtils.KadDOM.btnColor(obj, howaOptions.zoomed ? "positive" : null);
	howaRefreshGraph();
	howaGraph.update();
}

function howaMapsExpand() {
	KadUtils.KadDOM.btnColor("idBtn_howaMapsExpand", weaterMaps.shown ? null : "positive");
	if (weaterMaps.shown) {
		KadUtils.dbIDStyle("idSel_howaMapsCriteria").display = "none";
		KadUtils.dbIDStyle("idSel_howaMapsCountry").display = "none";
		KadUtils.dbIDStyle("idImg_howaMapsImg").display = "none";
	} else {
		howaChangeMap();
	}
	weaterMaps.shown = !weaterMaps.shown;
}

function howaChangeMap() {
	const indexCountry = KadUtils.dbID("idSel_howaMapsCountry").options.selectedIndex;
	const indexCriteria = KadUtils.dbID("idSel_howaMapsCriteria").options.selectedIndex;

	const country = Data_Country_GermanDistrics[indexCountry].dwd;
	const criteria = weaterMaps.criteria[indexCriteria].url;
	KadUtils.dbID("idImg_howaMapsImg").src = `${howaData.dwdURL}${country}_${criteria}.png`;
	KadUtils.dbIDStyle("idImg_howaMapsImg").display = "initial";
	KadUtils.dbIDStyle("idSel_howaMapsCriteria").display = "initial";
	KadUtils.dbIDStyle("idSel_howaMapsCountry").display = "initial";
}

function howaOptionChange() {
	if (howaGraph != null) {
		for (let i = 0; i < howaOptions.graphTypes.length; i++) {
			const dbIDName = howaOptions.graphTypes[i].dbID;
			const yAxis = howaOptions.graphTypes[i].yAxis;
			howaGraph.data.datasets[i].hidden = !KadUtils.dbID(dbIDName).checked;
			const index = howaGraph.options.scales.yAxes.map((obj) => obj.id).indexOf(yAxis);
			howaGraph.options.scales.yAxes[index].display = KadUtils.dbID(dbIDName).checked;
		}
		howaGraph.update();
	}
}

function howaCreateGraph() {
	const ctx = document.getElementById("idCanv_howaGraph").getContext("2d");
	howaGraph = new Chart(ctx, {
		// The type of chart we want to create
		type: "line",
		// The data for our dataset
		data: {
			labels: howaData.data.map((data) => {
				return KadUtils.KadDate.getDate(new Date(data.dt * 1000), { format: "WD HH h" });
			}),
			datasets: howaOptions.graphTypes.map((d, i) => {
				return {
					label: howaOptions.graphTypes[i].label,
					yAxisID: howaOptions.graphTypes[i].yAxis,
					backgroundColor: howaOptions.graphTypes[i].color,
					borderColor: howaOptions.graphTypes[i].color,
					...howaOptions.datasetStyle,
				};
			}),
		},
		// Configuration options go here
		options: {
			responsive: true,
			maintainAspectRatio: false,
			title: {
				display: false,
			},
			legend: {
				position: "bottom",
				labels: {
					filter: (legendItem, data) => {
						return legendItem.index != 1;
					},
					usePointStyle: false,
					padding: KadUtils.KadCSS.getRoot("padding", true, true),
					boxWidth: globalValues.mediaSizes.size,
				},
				onClick: (e) => {},
			},
			tooltips: {
				mode: "index",
				intersect: true,
				position: "average",
			},
			scales: {
				xAxes: [
					{
						id: "howaDate",
						position: "bottom",
						display: true,
						ticks: {
							autoSkip: true,
							autoSkipPadding: globalValues.mediaSizes.fontSize * 0.8,
							fontSize: globalValues.mediaSizes.fontSize * 0.8,
							beginAtZero: false,
						},
						...howaOptions.gridLinesStyle,
					},
				],
				yAxes: [
					{
						id: "temperature",
						type: "linear",
						position: "left",
						display: true,
						ticks: {
							callback: (value) => {
								return `${value}°C`;
							},
							...howaOptions.ticksStyle,
						},
						...howaOptions.gridLinesStyle,
					},
					{
						id: "rain",
						type: "linear",
						position: "left",
						display: true,
						ticks: {
							callback: (value) => {
								return `${value * 100}%`;
							},
							max: 1,
							...howaOptions.ticksStyle,
						},
						...howaOptions.gridLinesStyle,
					},
					{
						id: "humidity",
						type: "linear",
						position: "left",
						display: false,
						ticks: {
							callback: (value) => {
								return `${value}%`;
							},
							beginAtZero: true,
							max: 100,
							...howaOptions.ticksStyle,
						},
						...howaOptions.gridLinesStyle,
					},
					{
						id: "pressure",
						type: "linear",
						position: "right",
						display: false,
						ticks: {
							callback: (value) => {
								return `${value}hPa`;
							},
							...howaOptions.ticksStyle,
							fontSize: globalValues.mediaSizes.fontSize * 0.6,
						},
						...howaOptions.gridLinesStyle,
					},
					{
						id: "windSpeed",
						type: "linear",
						position: "right",
						display: false,
						ticks: {
							callback: (value) => {
								return `${value}m/s`;
							},
							...howaOptions.ticksStyle,
						},
						...howaOptions.gridLinesStyle,
					},
					{
						id: "windDirection",
						type: "linear",
						position: "right",
						display: false,
						ticks: {
							callback: (value) => {
								const arr = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "W"];
								const corr = value + 22.5;
								for (let i = arr.length - 1; i >= 0; i--) {
									if (corr > i * 45) {
										return arr[i];
									}
								}
							},
							...howaOptions.ticksStyle,
							beginAtZero: true,
							max: 360,
							stepSize: 45,
						},
						...howaOptions.gridLinesStyle,
					},
				],
			},
		},
	});
}

function howaRefreshGraph() {
	if (howaGraph === null) {
		howaCreateGraph();
	}
	howaGraph.data.labels = howaData.data.reduce((result, data, index) => {
		if (howaOptions.zoomed && index >= howaOptions.maxZoomedData) {
			return result;
		}
		result.push(KadUtils.KadDate.getDate(new Date(data.dt * 1000), { format: "WD HH h" }).replace(" h", "h"));
		return result;
	}, []);

	for (let i = 0; i < howaOptions.graphTypes.length; i++) {
		howaGraph.data.datasets[i].data = howaData.data.reduce((result, d, index) => {
			const pathArr = howaOptions.graphTypes[i].dataPath;
			if (pathArr.length == 1) {
				result.push(d[pathArr[0]]);
			} else {
				result.push(d[pathArr[0]][pathArr[1]]);
			}
			return result;
		}, []);
	}
}

function howaColorGraph() {
	const lCol = globalValues.colors.elements.line;
	const tCol = KadUtils.KadColor.formatAsCSS(globalValues.colors.elements.text, "HSL");
	howaGraph.options.legend.labels.fontColor = tCol;
	howaGraph.options.scales.xAxes[0].ticks.fontColor = tCol;
	howaGraph.options.scales.xAxes[0].gridLines.color = KadUtils.KadColor.formatAsCSS([...lCol, 0.2], "HSL");

	for (let i = 0; i < howaOptions.graphTypes.length; i++) {
		const alpha = KadUtils.KadValue.mapping(i, 0, howaOptions.graphTypes.length - 1, 0.8, 0.2, true);
		howaGraph.options.scales.yAxes[i].gridLines.color = KadUtils.KadColor.formatAsCSS([...lCol, alpha], "HSL");
		howaGraph.options.scales.yAxes[i].ticks.fontColor = howaOptions.graphTypes[i].color;
	}
	howaGraph.update();
}
