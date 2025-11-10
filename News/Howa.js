// Imags weather_code from openweathermap
// https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c

// https://docs.maptiler.com/sdk-js/examples/weather-layer-switcher/
const reverseGeocoder = new BDCReverseGeocode();
import { Data_Nummernschild } from "../KadData/KadData.js";
import { Data_Country_GermanDistrics } from "../KadData/KadData_Countries.js";
import { dbID, dbIDStyle, initEL, KadColor, KadDate, KadFile, KadInteraction, KadLog, KadValue, objectLength } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";
import { globalValues } from "../Settings/General.js";

const weatherMaps = {
  shown: false,
  district: null,
  criteria: null,
  get dwdURL() {
    let dist = Data_Country_GermanDistrics.filter((obj) => obj.abbr == this.district);
    if (dist.length != 0) this.district = dist[0].dwd;
    return `https://www.dwd.de/DWD/warnungen/warnapp_gemeinden/json/warnungen_gemeinde_map_${this.district}_${this.criteria}.png`;
  },
  criteriaList: [
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
    return { w: globalValues.mediaSizes.canvasSize.w * 0.75, h: globalValues.mediaSizes.canvasSize.h * 0.8 };
  },
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

const Vin_howaEntry = initEL({ id: "idVin_howaEntry", action: "change", fn: howaGetLocation, resetValue: "Search", dbList: Data_Nummernschild.map((item) => item[1]).sort() });
const Btn_getGeoLocation = initEL({ id: "idBtn_getGeoLocation", fn: howaGetCoordinates });
const Btn_howaGetLocation = initEL({ id: "idBtn_howaGetLocation", fn: howaGetLocation });
const Sel_howaMapsDistrict = initEL({
  id: "idSel_howaMapsDistrict",
  fn: howaChangeMap,
  selStartIndex: 0,
  selList: [["Deutschland", "de"], ...Data_Country_GermanDistrics.map((d) => [d.LandDE, d.abbr])],
});
const Sel_howaMapsCriteria = initEL({ id: "idSel_howaMapsCriteria", fn: howaChangeMap, selList: weatherMaps.criteriaList.map((d) => [d[1], d[0]]) });

export function clear_cl_Howa() {
  KadInteraction.removeContextmenu("idCanv_howa");
  Vin_howaEntry.KadReset();
  howaOptions.latitude = howaOptions.latOrig;
  howaOptions.longitude = howaOptions.lonOrig;
  howaOptions.city = null;
  reverseGeocoder.localityLanguage = "de";
  caHO.noLoop();
  howaChangeMap();
  howaGetCoordinates();
}

export const storage_cl_Howa = {
  dbName: "Howa",
  contentName: "cl_Howa",
  clear() {
    howaOptions.city = "Berlin";
  },
  getData() {
    return howaOptions.city;
  },
  saveData(data) {
    Vin_howaEntry.KadReset({ resetValue: data });
  },
  activateData() {
    return;
  },
};

export function canvas_cl_Howa() {
  caHO.resizeCanvas(howaOptions.canvas.w, howaOptions.canvas.h);
  caHO.redraw();
}

// DWD stuff
function howaChangeMap() {
  weatherMaps.district = Sel_howaMapsDistrict.KadGet();
  weatherMaps.criteria = Sel_howaMapsCriteria.KadGet();
  dbID("idImg_howaMapsImg").src = weatherMaps.dwdURL;
}

// Forecast stuff
function howaGetCoordinates() {
  if ("geolocation" in navigator) {
    howaOptions.city = null;
    Vin_howaEntry.KadReset({ resetValue: "Device-location used!" });
    dbIDStyle("idBtn_getGeoLocation").display = "initial";
    navigator.geolocation.getCurrentPosition(howaNavigatorPosition, howaNavigatorError);
  } else {
    howaNavigatorError();
    dbIDStyle("idBtn_getGeoLocation").display = "none";
  }
}

function howaNavigatorPosition(data) {
  howaOptions.latitude = data.coords.latitude || howaOptions.latOrig;
  howaOptions.longitude = data.coords.longitude || howaOptions.lonOrig;
  howaCleanLocation();
}

function howaNavigatorError() {
  dbID("idP_howaCurrentText").textContent = "No Geolocation";
  howaOptions.latitude = howaOptions.latOrig;
  howaOptions.longitude = howaOptions.lonOrig;
  howaCleanLocation();
}

async function howaGetLocation() {
  let input = Vin_howaEntry.KadGet();
  if (input == "") return;
  howaOptions.city = input;
  KadFile.loadUrlToJSON({ variable: "data", url: howaOptions.urlGeoCoding, callback: howaGeocodingCity, errorCallback: howaErrorCallback });
}
function howaErrorCallback(error) {
  KadLog.error("Could not load Geocoding!", error);
}

function howaGeocodingCity({ data }) {
  let dataSorted = data.results.filter((d) => (d.country = "Deutschland"));
  if (!dataSorted) {
    dbID("idP_howaCurrentText").textContent = "Stadt nicht gefunden";
    return;
  }
  howaOptions.latitude = dataSorted[0].latitude;
  howaOptions.longitude = dataSorted[0].longitude;
  howaCleanLocation();
}

function howaCleanLocation() {
  reverseGeocoder.getClientLocation({ latitude: howaOptions.latitude, longitude: howaOptions.longitude }, (result) => {
    howaOptions.city = result.city;
    if (result.principalSubdivisionCode) {
      weatherMaps.district = result.principalSubdivisionCode.split("-")[1].toLowerCase();
      if (!Data_Country_GermanDistrics.map((d) => d.abbr).includes(weatherMaps.district)) weatherMaps.district = "de";
    } else {
      weatherMaps.district = "de";
    }
    for (let node of Sel_howaMapsDistrict.HTML.options) {
      if (node.value == weatherMaps.district) {
        node.selected = true;
        break;
      }
    }
    dbID("idImg_howaMapsImg").src = weatherMaps.dwdURL;

    KadFile.loadUrlToJSON({
      variableArray: ["responseCurrent", "responseForecast"],
      urlArray: [howaOptions.urlCurrent, howaOptions.urlDaily],
      callback: howaGetData,
      errorCallback: howaErrorCallback,
    });
  });
}

function howaGetData({ responseCurrent, responseForecast }) {
  howaOptions.data.current = responseCurrent;
  howaOptions.data.forecast = responseForecast;
  dbID("idP_howaCurrentText").textContent = `${howaOptions.city}: ${howaOptions.data.current.current.temperature_2m}°C`;
  dbID("idImg_howaCurrentImage").src = `./News/AssetsHowa/${howaWeatherIcons.data[howaOptions.data.current.current.weather_code]}.png`;
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
  caHO.redraw();
}
function range(arr, dir) {
  const round = 1;
  if (dir == 0) {
    return Math.floor((Math.min(...arr) - 1) / round) * round;
  } else {
    return Math.ceil((Math.max(...arr) + 1) / round) * round;
  }
}

const caHO = new p5((c) => {
  c.preload = function () {
    for (let value of Object.values(howaWeatherIcons.data)) {
      if (howaWeatherIcons.images.hasOwnProperty(value)) continue;
      howaWeatherIcons.images[value] = c.loadImage(`./News/AssetsHowa/${value}.png`);
    }
  };
  c.setup = function () {
    c.canv = c.createCanvas(howaOptions.canvas.w, howaOptions.canvas.h);
    c.canv.id("canvasHowa");
    c.canv.parent("#idCanv_howa");
    c.colorMode(c.HSL);
    c.textAlign(c.CENTER, c.BOTTOM);
    c.imageMode(c.CENTER);
    c.noLoop();
    c.redraw();
  };
  c.draw = function () {
    howaDrawData();
  };
}, "#idCanv_howa");

function howaDrawData() {
  caHO.clear();
  const graph = howaOptions.graphData;
  if (graph == null) return;
  const len = objectLength(graph.data);
  const rowHeight = howaOptions.canvas.h / len;
  const offsetTop = rowHeight * 0.25;
  const barHeight = rowHeight - 2 * offsetTop;
  const dayWidth = howaOptions.canvas.w * 0.22;
  const tempWidth = howaOptions.canvas.w * 0.1;
  const imgWidth = howaOptions.canvas.w * 0.1;

  const canvasContext = caHO.drawingContext;
  let gradient = canvasContext.createLinearGradient(dayWidth + tempWidth + imgWidth, 0, howaOptions.canvas.w - tempWidth, 0);
  const temperatureMin = Math.min(...graph.data.map((item) => item[0]));
  const temperatureMax = Math.max(...graph.data.map((item) => item[1]));
  const hueMin = Math.round(cappedColorRange(temperatureMin));
  const hueMid = Math.round(cappedColorRange((temperatureMin + temperatureMax) / 2));
  const hueMax = Math.round(cappedColorRange(temperatureMax));

  gradient.addColorStop(0, KadColor.formatAsCSS({ colorArray: [hueMin, 100, 60], type: "HSL" }));
  gradient.addColorStop(0.5, KadColor.formatAsCSS({ colorArray: [hueMid, 100, 60], type: "HSL" }));
  gradient.addColorStop(1, KadColor.formatAsCSS({ colorArray: [hueMax, 100, 60], type: "HSL" }));
  for (let i = 0; i < len; i++) {
    const point = graph.data[i];
    const y = offsetTop + rowHeight * i;
    //  //  debug lines
    // caHO.line(dayWidth, 0, dayWidth, howaOptions.canvas.h);
    // caHO.line(dayWidth + tempWidth, 0, dayWidth + tempWidth, howaOptions.canvas.h);
    // caHO.line(dayWidth + tempWidth + imgWidth, 0, dayWidth + tempWidth + imgWidth, howaOptions.canvas.h);
    // caHO.line(howaOptions.canvas.w - tempWidth, 0, howaOptions.canvas.w - tempWidth, howaOptions.canvas.h);
    caHO.fill(globalColors.elements.line);
    caHO.textSize(globalValues.mediaSizes.fontSize);
    caHO.text(KadDate.getDate(graph.labels[i], { format: "WD DD.MM" }), dayWidth / 2, y + rowHeight / 2);
    caHO.image(howaWeatherIcons.imageFromCode(graph.weatherCode[i]), dayWidth + tempWidth / 2, y + rowHeight / 4, rowHeight / 2, rowHeight / 2);
    caHO.text(`${point[0]}°`, dayWidth + tempWidth + tempWidth / 2, y + rowHeight / 2);
    caHO.text(`${point[1]}°`, howaOptions.canvas.w - tempWidth / 2, y + rowHeight / 2);

    const x = howaMap(point[0]);
    const barWidth = howaMap(point[1]);
    canvasContext.fillStyle = gradient;
    caHO.rect(x, y, barWidth - x, barHeight, 10);
  }
  function howaMap(p) {
    return KadValue.mapping(p, graph.min, graph.max, dayWidth + tempWidth + imgWidth, howaOptions.canvas.w - tempWidth);
  }
}

function cappedColorRange(temp) {
  return KadValue.mapping(temp, 5, 30, 250, 0, true);
}
const howaWeatherIcons = {
  imageFromCode(code) {
    const name = howaWeatherIcons.data[code];
    return howaWeatherIcons.images[name];
  },
  images: {},
  data: {
    0: "clear",
    1: "clear",
    2: "clear",
    3: "cloud",
    45: "clear",
    48: "fog",
    51: "drizzle",
    53: "drizzle",
    55: "drizzle",
    56: "drizzle",
    57: "drizzle",
    61: "rain",
    63: "rain",
    65: "rain",
    66: "rain",
    67: "rain",
    71: "snow",
    73: "snow",
    75: "snow",
    77: "snow",
    80: "rain",
    81: "rain",
    82: "rain",
    85: "snow",
    86: "snow",
    95: "lightning",
    96: "lightning",
    99: "lightning",
  },
};
