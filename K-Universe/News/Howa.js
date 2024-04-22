// API-Call: https://open-meteo.com/en/docs#current=temperature_2m,is_day,precipitation,rain,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=14
// https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,is_day,precipitation,rain,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto&forecast_days=14
// GeoLocation
// "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
//geoCoding
// https://geocoding-api.open-meteo.com/v1/search?name=Berlin&count=3&language=de&format=json

// Imags weather_code from openweathermap
// https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c

import * as KadUtils from "../General/KadUtils.js";
import { Data_Country_GermanDistrics, Data_Nummernschild } from "../General/MainData.js";
import { globalValues } from "../Settings/Basics.js";

const noDWD = false;
const weatherMaps = {
	shown: false,
	country: null,
	criteria: null,
	get dwdURL() {
		return `https://www.dwd.de/DWD/warnungen/warnapp_gemeinden/json/warnungen_gemeinde_map_${this.country}_${this.criteria}.png`;
	},
	criteriaList: [
		// url, Name
		["gewitter", "Gewitter"],
		["regen", "Stark- oder Dauerregen"],
		["schnee", "Schneefall"],
		["sturm", "Wind (Sturm, Orkan)"],
		["nebel", "Nebel"],
		["frost", "Frost"],
		["glatteis", "Glätte, Glatteis"],
		["tauwetter", "Tauwetter"],
		["hitze", "Hitze"],
		["uv", "UV-Strahlung"],
	],
};

let howaOptions = {
	get canvas() {
		return { w: globalValues.mediaSizes.canvasSize.w * 0.75, h: globalValues.mediaSizes.canvasSize.h };
	},
	bgcCanvas: "skyblue",
	data: { current: null, forecast: null },
	graphData: null,
	latOrig: 48.5328,
	lonOrig: 8.7166,
	latitude: 0,
	longitude: 0,
	city: null,
	forecastDays: 14,
	get urlGeoCoding() {
		return `https://geocoding-api.open-meteo.com/v1/search?name=${this.city}&count=3&language=de&format=json`;
	},
	get urlCurrent() {
		return `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`;
	},
	get urlDaily() {
		return `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&daily=temperature_2m_min,temperature_2m_max,weather_code,precipitation_sum,wind_speed_10m_min,wind_speed_10m_max&timezone=auto&forecast_days=${this.forecastDays}`;
	},
};

KadUtils.daEL(idVin_howaEntry, "change", howaGetLocation);
KadUtils.daEL(idVin_howaEntry, "focus", () => howaPopulateDatalist(idVin_howaEntry));
KadUtils.daEL(idBtn_getGeoLocation, "click", howaGetCoordinates);
KadUtils.daEL(idBtn_howaGetLocation, "click", howaGetLocation);
KadUtils.daEL(idSel_howaMapsCriteria, "change", howaChangeMap);
KadUtils.daEL(idSel_howaMapsCountry, "change", howaChangeMap);

export function clear_cl_Howa() {
	KadUtils.KadDOM.resetInput("idVin_howaEntry", "Ort");
	howaOptions.latitude = howaOptions.latOrig;
	howaOptions.longitude = howaOptions.lonOrig;
	howaOptions.city = null;

	// populate MapSelectCountry
	KadUtils.dbID("idSel_howaMapsCountry").options[0] = new Option("Deutschland");
	for (let [index, land] of Data_Country_GermanDistrics.entries()) {
		KadUtils.dbID("idSel_howaMapsCountry").options[index + 1] = new Option(land.LandDE);
	}

	// populate MapSelectCriteria
	for (let i = 0; i < weatherMaps.criteriaList.length; i++) {
		KadUtils.dbID("idSel_howaMapsCriteria").options[i] = new Option(weatherMaps.criteriaList[i][1]);
	}
	KadUtils.dbID("idSel_howaMapsCriteria").options[1].selected = true;

	caHO.noLoop();
	caHO.background(globalValues.colors.elements.background);

	howaChangeMap();
	howaGetCoordinates();
}

export const storage_cl_Howa = {
	dbName: "Howa",
	contentName: "cl_Howa",
	clear() {
		this.data = "Berlin";
	},
	get data() {
		return howaOptions.city;
	},
	set data(data) {
		KadUtils.dbID("idVin_howaEntry").value = data;
		// howaGetLocation();
	},
};

export function canvas_cl_Howa() {
	caHO.resizeCanvas(howaOptions.canvas.w, howaOptions.canvas.h);
	caHO.redraw();
}

function howaPopulateDatalist() {
	if (KadUtils.dbID("idDlist_howaPlaces").childNodes.length > 1) return;
	for (const city of Data_Nummernschild.values()) {
		const opt = document.createElement("OPTION");
		opt.textContent = city;
		KadUtils.dbID("idDlist_howaPlaces").appendChild(opt);
	}
}

// DWD stuff
function howaChangeMap() {
	if (noDWD) return;
	const indexCountry = KadUtils.dbID("idSel_howaMapsCountry").options.selectedIndex;
	const indexCriteria = KadUtils.dbID("idSel_howaMapsCriteria").options.selectedIndex;
	weatherMaps.country = indexCountry == 0 ? "de" : Data_Country_GermanDistrics[indexCountry].dwd;
	weatherMaps.criteria = weatherMaps.criteriaList[indexCriteria][0];
	KadUtils.dbID("idImg_howaMapsImg").src = weatherMaps.dwdURL;
}

// Forecast stuff

function howaGetCoordinates() {
	if ("geolocation" in navigator) {
		howaOptions.city = null;
		KadUtils.dbID("idVin_howaEntry").value = "";
		KadUtils.dbIDStyle("idBtn_getGeoLocation").display = "initial";
		navigator.geolocation.getCurrentPosition(howaNavigatorPosition, howaNavigatorError);
	} else {
		howaNavigatorError();
		KadUtils.dbIDStyle("idBtn_getGeoLocation").display = "none";
	}
}

function howaNavigatorPosition(data) {
	howaOptions.latitude = data.coords.latitude || howaOptions.latOrig;
	howaOptions.longitude = data.coords.longitude || howaOptions.lonOrig;
	howaReqestData();
}

function howaNavigatorError() {
	KadUtils.dbID("idLbl_howaNow").textContent = "No Geolocation";
	howaOptions.latitude = howaOptions.latOrig;
	howaOptions.longitude = howaOptions.lonOrig;
	howaReqestData();
}

async function howaGetLocation() {
	let input = KadUtils.dbID("idVin_howaEntry").value.trim();
	if (input == "") return;
	howaOptions.city = input;
	const err = await howaGeocodingCity();
	if (err) return;
	howaReqestData();
}

async function howaGeocodingCity() {
	if (howaOptions.city == null) return;
	let response = await fetch(howaOptions.urlGeoCoding);
	let data = await response.json();
	if (!data.results) {
		KadUtils.dbID("idLbl_howaNow").textContent = "Stadt nicht gefunden";
		return true;
	}
	howaOptions.latitude = data.results[0].latitude;
	howaOptions.longitude = data.results[0].longitude;
	return false;
}

async function howaReqestData() {
	let responseCurrent = await fetch(howaOptions.urlCurrent);
	howaOptions.data.current = await responseCurrent.json();
	let responseForecast = await fetch(howaOptions.urlDaily);
	howaOptions.data.forecast = await responseForecast.json();
	KadUtils.dbID("idLbl_howaNow").textContent = `${howaOptions.city}: ${howaOptions.data.current.current.temperature_2m}°C`;
	// howaOptions.data.current.weather_code: 85
	// disabled: weather-icons.min.css
	// const iconS = document.createElement("i");
	// KadUtils.dbID("idLbl_howaNow").appendChild(iconS);
	// iconS.id = "idI_howaIconNow";
	// iconS.classList.remove(...iconS.classList);
	// iconS.classList.add("wi");
	// const dayTime = howaOptions.data.current.is_day? "day" : "night"
	// iconS.classList.add(`wi-owm-${dayTime}-${howaOptions.data[0].weather[0].id}`);

	//refresh Graph-data
	howaUpdateGraphData();
}

function howaUpdateGraphData() {
	let data = [];
	let point = howaOptions.data.forecast.daily;
	for (let i = 0; i < howaOptions.forecastDays; i++) {
		data.push([point.temperature_2m_min[i], point.temperature_2m_max[i]]);
	}
	howaOptions.graphData = {
		labels: point.time,
		weatherCode: point.weather_code,
		data: data,
		min: range(point.temperature_2m_min, 0),
		max: range(point.temperature_2m_max, 1),
	};
	howaDrawData();

	function range(arr, dir) {
		const round = 1;
		if (dir == 0) {
			return Math.floor((Math.min(...arr) - 1) / round) * round;
		} else {
			return Math.ceil((Math.max(...arr) + 1) / round) * round;
		}
	}
}

const caHO = new p5((c) => {
	c.setup = function () {
		c.canv = c.createCanvas(howaOptions.canvas.w, howaOptions.canvas.h);
		c.canv.id("canvasHowa");
		c.canv.parent("#idCanv_howa");
		c.colorMode(c.HSL);
		c.textAlign(c.CENTER, c.CENTER);
		c.noLoop();
		c.redraw();
	};
	c.draw = function () {
		howaDrawData();
	};
}, "#idCanv_howa");

function howaDrawData() {
	caHO.background(howaOptions.bgcCanvas);
	const graph = howaOptions.graphData;
	if (graph == null) return;
	const len = KadUtils.objectLength(graph.data);
	const rowHeight = howaOptions.canvas.h / len;
	const offsetTop = rowHeight * padding;
	const barHeight = rowHeight - 2 * offsetTop;
	const dayWidth = howaOptions.canvas.w * 0.08;
	const tempWidth = howaOptions.canvas.w * 0.1;
	const imgWidth = howaOptions.canvas.w * 0.1;

	for (let i = 0; i < len; i++) {
		const point = graph.data[i];

		const y = offsetTop + rowHeight * i;

		caHO.line(dayWidth, 0, dayWidth, howaOptions.canvas.h);
		caHO.line(dayWidth + tempWidth, 0, dayWidth + tempWidth, howaOptions.canvas.h);
		caHO.line(dayWidth + tempWidth + imgWidth, 0, dayWidth + tempWidth + imgWidth, howaOptions.canvas.h);
		caHO.line(howaOptions.canvas.w - tempWidth, 0, howaOptions.canvas.w - tempWidth, howaOptions.canvas.h);

		caHO.fill(globalValues.colors.elements.line);
		caHO.textSize(globalValues.mediaSizes.fontSize);
		caHO.text(KadUtils.KadDate.getDate(graph.labels[i], { format: "WD" }), dayWidth / 2, y + rowHeight / 2);
		caHO.text(graph.weatherCode[i], dayWidth + tempWidth / 2, y + rowHeight / 2);
		caHO.text(`${point[0]}°`, dayWidth + tempWidth + tempWidth / 2, y + rowHeight / 2);
		caHO.text(`${point[1]}°`, howaOptions.canvas.w - tempWidth / 2, y + rowHeight / 2);

		const x = howaMap(point[0]);
		const barWidth = howaMap(point[1]);
		caHO.fill("orange");
		caHO.rect(x, y, barWidth - x, barHeight, 10);
	}

	function howaMap(p) {
		return KadUtils.KadValue.mapping(p, graph.min, graph.max, dayWidth + tempWidth + imgWidth, howaOptions.canvas.w - tempWidth);
	}
}

const padding = 0.1;
