// https://github.com/samayo/country-json?tab=readme-ov-file
// //https://d-d-r.de/ddr-bevoelkerung.html

import { Data_Country_CodesIso3166 } from "../KadData/KadData_Countries.js";
import { Data_Olympia } from "../KadData/KadData_Olympiadaten.js";
import { KadArray, KadDOM, KadTable, KadValue, initEL } from "../KadUtils/KadUtils.js";

const olympiaOptions = {
  baseData: new Map(Data_Olympia),
  countryData: null,
  data: null,
  specific: false,
  medalNames: ["Gold", "Silber", "Bronze", "Gesamt"],
  sortTotal: false,
  sortMedals: false,
  origEventArray: [
    ["Sommerspiele", 2024],
    ["Winterspiele", 2022],
    ["Sommerspiele", 2020],
    ["Winterspiele", 2018],
    ["Sommerspiele", 2016],
    ["Winterspiele", 2014],
    ["Sommerspiele", 2012],
    ["Winterspiele", 2010],
    ["Sommerspiele", 2008],
    ["Winterspiele", 2006],
    ["Sommerspiele", 2004],
    ["Winterspiele", 2002],
    ["Sommerspiele", 2000],
    ["Winterspiele", 1998],
    ["Sommerspiele", 1996],
    ["Winterspiele", 1994],
    ["Sommerspiele", 1992],
    ["Sommerspiele", 1988],
    ["Winterspiele", 1992],
    ["Winterspiele", 1988],
    ["Sommerspiele", 1984],
    ["Winterspiele", 1984],
    ["Sommerspiele", 1980],
    ["Winterspiele", 1980],
    ["Sommerspiele", 1976],
    ["Winterspiele", 1976],
    ["Sommerspiele", 1972],
    ["Winterspiele", 1972],
    ["Sommerspiele", 1968],
    ["Winterspiele", 1968],
    ["Sommerspiele", 1964],
    ["Winterspiele", 1964],
    ["Sommerspiele", 1960],
    ["Winterspiele", 1960],
    ["Sommerspiele", 1956],
    ["Winterspiele", 1956],
    ["Sommerspiele", 1952],
    ["Winterspiele", 1952],
    ["Sommerspiele", 1948],
    ["Winterspiele", 1948],
    ["Sommerspiele", 1936],
    ["Winterspiele", 1936],
    ["Sommerspiele", 1932],
    ["Winterspiele", 1932],
    ["Sommerspiele", 1928],
    ["Winterspiele", 1928],
    ["Sommerspiele", 1924],
    ["Sommerspiele", 1912],
    ["Winterspiele", 1924],
    ["Sommerspiele", 1920],
    ["Sommerspiele", 1908],
    ["Sommerspiele", 1904],
    ["Sommerspiele", 1900],
    ["Sommerspiele", 1896],
  ],
  get events() {
    return olympiaOptions.origEventArray;
  },
};

initEL({
  id: idSel_olympiaEvent,
  fn: olympiaUpdate,
  selStartIndex: 51,
  selList: olympiaOptions.events.map((v) => [`${v[0]} ${v[1]}`, v[1]]),
});
initEL({ id: idBtn_olympiaSpecific, fn: olympiaSpecific });
initEL({ id: idBtn_olympiaSortMedals, fn: olympiaSortByMedals });
initEL({ id: idBtn_olympiaSortTotal, fn: olympiaSortByTotal });

export function clear_cl_Olympia() {
  olympiaOptions.countryData = {};
  for (let obj of Data_Country_CodesIso3166) {
    olympiaOptions.countryData[obj.cioc] = { cioc: obj.cioc, flag: obj.flagSvgURL, population: obj.population };
  }
  idSel_olympiaEvent.KadReset();
  olympiaUpdate();
}

function olympiaUpdate() {
  const eventname = idSel_olympiaEvent.KadGet({ textContent: true });
  const eventData = olympiaOptions.baseData.get(eventname);

  olympiaOptions.data = [];
  for (let row of eventData) {
    let dataObj = {};
    dataObj.Platz = row[0];
    dataObj.name = row[1].trim();
    const cioc = row[2];
    dataObj.cioc = cioc;
    dataObj.flag = olympiaOptions.countryData[cioc] ? olympiaOptions.countryData[cioc].flag : null;
    dataObj.population = olympiaOptions.countryData[cioc] ? olympiaOptions.countryData[cioc].population : null;
    dataObj.medals = {};
    dataObj.specific = {};
    for (let i = 0; i < olympiaOptions.medalNames.length; i++) {
      const headName = olympiaOptions.medalNames[i];
      dataObj.medals[headName] = row[3 + i];
      if (dataObj.population == 0 || isNaN(row[3 + i])) {
        dataObj.specific[headName] = 0;
      } else {
        dataObj.specific[headName] = (row[3 + i] / dataObj.population) * 1000000;
      }
    }
    olympiaOptions.data.push(dataObj);
  }

  olympiaTableReturn();
}

function olympiaSpecific() {
  olympiaOptions.specific = !olympiaOptions.specific;
  KadDOM.btnColor(idBtn_olympiaSpecific, olympiaOptions.specific ? "positive" : null);
  olympiaTableReturn();
}

function olympiaSortByTotal() {
  olympiaOptions.sortTotal = !olympiaOptions.sortTotal;
  const dataset = olympiaOptions.specific ? "specific" : "medals";
  olympiaOptions.data = KadArray.sortArrayByKey({ array: olympiaOptions.data, keys: [dataset, "Gesamt"], inverse: olympiaOptions.sortTotal });
  olympiaTableReturn();
}

function olympiaSortByMedals() {
  olympiaOptions.sortMedals = !olympiaOptions.sortMedals;
  const dataset = olympiaOptions.specific ? "specific" : "medals";
  for (let type of ["Bronze", "Silber", "Gold"]) {
    olympiaOptions.data = KadArray.sortArrayByKey({ array: olympiaOptions.data, keys: [dataset, type], inverse: olympiaOptions.sortMedals });
  }
  olympiaTableReturn();
}

function olympiaTableReturn() {
  if (olympiaOptions.data.length == 0) return;
  // KadLog.log(olympiaOptions.data);

  //prettier-ignore
  const header = [
    { data: "Rang" }, 
    { data: "Land", colSpan: 2, settings: { align: "center" } }, 
    ...olympiaOptions.medalNames.map((item) => ({ data: olympiaOptions.specific ? `${item}<br>/Einwohner` : item })), 
    { data: "Einwohner", settings: { align: "left" } }];

  const body = [
    {
      data: KadArray.arrayFromNumber(olympiaOptions.data.length).map((n) => n + 1),
      settings: { description: "place", align: "right" },
    },
    {
      type: "URLImg",
      data: olympiaOptions.data.map((item) => item.flag),
      settings: { description: "flag", noBorder: "right", align: "center", imgSize: "olympiaImg" },
    },
    {
      data: olympiaOptions.data.map((item) => `${item.name} (${item.Platz})`),
      settings: { description: "country", title: olympiaOptions.data.map((item) => item.name) },
    },
    ...olympiaOptions.medalNames.map((head) => ({
      data: olympiaOptions.data.map((item) => (olympiaOptions.specific ? KadValue.number(item.specific[head], { decimals: 3 }) : item.medals[head])),
      settings: { description: head, align: "center" },
    })),
    {
      data: olympiaOptions.data.map((item) => KadValue.number(item.population, { indicator: true })),
      settings: { description: "population", align: "right" },
    },
  ];
  KadTable.createHTMLGrid({ id: idTab_OlympiaTable, header, body });
}
