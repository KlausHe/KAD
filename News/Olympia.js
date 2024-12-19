import { KadArray, KadDOM, KadFile, KadLog, KadTable, KadValue, initEL } from "../KadUtils/KadUtils.js";

const olympiaOptions = {
  URLFlags: `https://restcountries.com/v3.1/all?fields=cca3,flags,population`,
  data: null,
  specific: false,
  headerNames: ["Gold", "Silver", "Bronze", "Total"],
  sortTotal: false,
  sortMedals: false,
  events: [
    ["Olympia", `https://api.olympics.kevle.xyz/medals`],
    ["Paralympics", `https://api.olympics.kevle.xyz/paralympics/medals`, true],
  ],
};

initEL({
  id: idSel_olympiaEvent,
  fn: olympiaUpdate,
  selStartIndex: 0,
  selList: olympiaOptions.events.map((v) => [v[0], v[0], v[2] || null]),
});
initEL({ id: idBtn_olympiaSpecific, fn: olympiaSpecific });
initEL({ id: idBtn_olympiaSortMedals, fn: olympiaSortByMedals });
initEL({ id: idBtn_olympiaSortTotal, fn: olympiaSortByTotal });

export function clear_cl_Olympia() {
  idSel_olympiaEvent.KadReset();
  olympiaUpdate();
}

async function olympiaUpdate() {
  olympiaOptions.data = null;
  const index = idSel_olympiaEvent.KadGet({ index: true });
  const url = olympiaOptions.events[index][1];
  const { dataTable, dataCountries, error } = await KadFile.loadUrlToJSON({ variableArray: ["dataTable", "dataCountries"], urlArray: [url, olympiaOptions.URLFlags] });
  if (KadLog.errorChecked(error, "Could not receive data for 'Olympia'.", error)) return;
  dataTable.results.splice(
    dataTable.results.findIndex((item) => {
      return item.country.code == "EOR" || item.country.code == "RPT";
    }),
    1
  );
  let countrieObj = {};
  for (let obj of dataCountries) {
    countrieObj[obj.cca3] = { flag: obj.flags.svg, population: obj.population };
  }
  for (let rang of dataTable.results) {
    if (rang.country.iso_alpha_3 === undefined) continue;
    rang.flag = countrieObj[rang.country.iso_alpha_3].flag;
    rang.population = countrieObj[rang.country.iso_alpha_3].population;
    rang.specific = {};
    for (let name of olympiaOptions.headerNames) {
      rang.specific[name.toLowerCase()] = (rang.medals[name.toLowerCase()] / rang.population) * 1000000;
    }
  }
  olympiaOptions.data = dataTable.results;
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
  olympiaOptions.data = KadArray.sortArrayByKey({ array: olympiaOptions.data, keys: [dataset, "total"], inverse: olympiaOptions.sortTotal });
  olympiaTableReturn();
}

function olympiaSortByMedals() {
  olympiaOptions.sortMedals = !olympiaOptions.sortMedals;
  const dataset = olympiaOptions.specific ? "specific" : "medals";
  for (let type of ["bronze", "silver", "gold"]) {
    olympiaOptions.data = KadArray.sortArrayByKey({ array: olympiaOptions.data, keys: [dataset, type], inverse: olympiaOptions.sortMedals });
  }
  olympiaTableReturn();
}

function olympiaTableReturn() {
  if (olympiaOptions.data.length == 0) return;

  //prettier-ignore
  const header = [
    { data: "Rang" }, 
    { data: "Land", colSpan: 2, settings: { align: "center" } }, 
    ...olympiaOptions.headerNames.map((item) => ({ data: olympiaOptions.specific ? `${item}<br>/Einwohner` : item })), 
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
      data: olympiaOptions.data.map((item) => `${item.country.name} (${item.rank})`),
      settings: { description: "country", title: olympiaOptions.data.map((item) => item.country.name) },
    },
    ...olympiaOptions.headerNames.map((head) => ({
      data: olympiaOptions.data.map((item) => (olympiaOptions.specific ? KadValue.number(item.specific[head.toLowerCase()], { decimals: 3 }) : item.medals[head.toLowerCase()])),
      settings: { description: head, align: "center" },
    })),
    {
      data: olympiaOptions.data.map((item) => KadValue.number(item.population, { indicator: true })),
      settings: { description: "population", align: "right" },
    },
  ];
  KadTable.createHTMLGrid({ id: idTab_OlympiaTable, header, body });
}
