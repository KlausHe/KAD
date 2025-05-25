import { Data_Country_CodesIso3166 } from "../KadData/KadData.js";
import { initEL, KadArray, KadFile, KadLog, KadRandom, KadTable, KadValue } from "../KadUtils/KadUtils.js";

initEL({
  id: idSel_pinyCountry,
  fn: pinyGetDataForCountry,
  selStartIndex: 0,
});
initEL({
  id: idSel_pinyField,
  fn: pinyGetDataForField,
  selStartIndex: 0,
});

const pinyOptions = {
  getCountryURL() {
    const alpha2 = Data_Country_CodesIso3166[pinyOptions.countryIndex].alpha2;
    return `https://restcountries.com/v3.1/alpha/${alpha2}`;
  },
  getFieldURL() {
    const field = pinyFieldOptions[pinyOptions.fieldIndex].field;
    return `https://restcountries.com/v3.1/all?fields=translations,${field}`;
  },
  countryIndex: 0,
  fieldIndex: 0,
  arraySeparator: "<br>",
};

export function clear_cl_Piny() {
  idSel_pinyCountry.KadReset({ selList: Data_Country_CodesIso3166.map((obj, index) => [obj.nameDE, index]).sort(), selStartIndex: KadRandom.randomIndex(Data_Country_CodesIso3166) });
  idSel_pinyField.KadReset({ selList: pinyFieldOptions.map((obj, index) => [obj.infoDE, index]) });
  pinyGetDataForCountry();
}

async function pinyGetDataForCountry() {
  pinyOptions.countryIndex = idSel_pinyCountry.KadGet();
  const url = pinyOptions.getCountryURL();
  const { data, error } = await KadFile.loadUrlToJSON({ variable: "data", url });
  if (KadLog.errorChecked(error, "Could not receive data for 'Piny'.", error)) return;
  pinyOptions.countryData = data[0];
  pinyCreateCountryData();
}

async function pinyGetDataForField() {
  pinyOptions.fieldIndex = idSel_pinyField.KadGet();
  const url = pinyOptions.getFieldURL();
  const { data, error } = await KadFile.loadUrlToJSON({ variable: "data", url });
  if (KadLog.errorChecked(error, "Could not receive data for 'Piny'.", error)) return;
  pinyOptions.fieldData = data;
  pinyCreateFieldData();
}

const uiSize = "width10";
function pinyCreateCountryData() {
  const header = [
    { data: "Eigenschaft", settings: { uiSize } },
    { data: "Wert", settings: { uiSize } },
  ];
  const body = [
    { data: pinyFieldOptions.map((item) => item.infoDE), settings: { uiSize } },
    { data: pinyFieldOptions.map((item) => item.data(pinyOptions.countryData)), settings: { uiSize } },
  ];
  KadTable.createHTMLGrid({ id: idTab_pinyTable, header, body });
}

function pinyCreateFieldData() {
  pinyOptions.fieldData = KadArray.sortArrayByKey({ array: pinyOptions.fieldData, keys: ["translations", "deu", "official"], caseSensitive: true });
  const header = [
    { data: "Land", settings: { uiSize } },
    { data: "Wert", settings: { uiSize } },
  ];
  const body = [
    { data: pinyOptions.fieldData.map((item) => item.translations.deu.official), settings: { uiSize } },
    { data: pinyOptions.fieldData.map((item) => pinyFieldOptions[pinyOptions.fieldIndex].data(item)), settings: { uiSize } },
  ];
  KadTable.createHTMLGrid({ id: idTab_pinyTable, header, body });
}

const pinyFieldOptions = [
  {
    field: "name",
    fieldName: "nameOfficial",
    infoDE: "Offizieller Ländername",
    infoEN: "Official country name",
    data(obj) {
      if (!obj.translations.deu.official) return "-";
      return obj.translations.deu.official;
    },
  },
  {
    field: "name",
    fieldName: "nameCommon",
    infoDE: "Gebräuchlicher Ländername",
    infoEN: "Common country name",
    data(obj) {
      if (!obj.translations.deu.common) return "-";
      return obj.translations.deu.common;
    },
  },
  {
    field: "altSpellings",
    fieldName: "altSpellings",
    infoDE: "Alternative Schreibweise(n)",
    infoEN: "Alternate spellings of the country name",
    data(obj) {
      if (!obj.altSpellings || obj.altSpellings.length <= 1) return "-";
      return obj.altSpellings.slice(1).join(pinyOptions.arraySeparator);
    },
  },
  {
    field: "flag",
    fieldName: "flag",
    infoDE: "Flagge",
    infoEN: "Flag emoji",
    data(obj) {
      if (!obj.flag) return "-";
      return obj.flag;
    },
  },
  {
    field: "population",
    fieldName: "population",
    infoDE: "Bevölkerung",
    infoEN: "Country population",
    data(obj) {
      if (!obj.population) return "-";
      return `${KadValue.number(obj.population, { indicator: true })} Einwohner`;
    },
  },
  {
    field: "area",
    fieldName: "area",
    infoDE: "Geografische Größe",
    infoEN: "Geographical size",
    data(obj) {
      if (!obj.area) return "-";
      return `${KadValue.number(obj.area, { indicator: true })} km<sup>2</sup>`;
    },
  },
  {
    field: "borders",
    fieldName: "borders",
    infoDE: "Grenzländer",
    infoEN: "Border countries",
    data(obj) {
      if (!obj.borders) return "-";
      let map = obj.borders.map((border) => Data_Country_CodesIso3166.find((d) => d.alpha3 == border));
      map = map.filter((b) => b != undefined).map((b) => b.nameDE);
      return map.join(pinyOptions.arraySeparator);
    },
  },
  {
    field: "idd",
    fieldName: "idd",
    infoDE: "Internationale Vorwahle(n)",
    infoEN: "International dialing codes",
    data(obj) {
      if (!obj.idd) return "-";
      return obj.idd.suffixes.map((suf) => `${obj.idd.root}${suf}`).join(pinyOptions.arraySeparator);
    },
  },
  {
    field: "languages",
    fieldName: "languages",
    infoDE: "Amtssprache(n)",
    infoEN: "List of official languages",
    data(obj) {
      if (!obj.languages) return "-";
      return Object.values(obj.languages).join(pinyOptions.arraySeparator);
    },
  },
  {
    field: "capital",
    fieldName: "capital",
    infoDE: "Hauptstädte",
    infoEN: "Capital cities",
    data(obj) {
      if (!obj.capital) return "-";
      return obj.capital.join(pinyOptions.arraySeparator);
    },
  },
  {
    field: "timezones",
    fieldName: "timezones",
    infoDE: "Zeitzonen",
    infoEN: "Timezones",
    data(obj) {
      if (!obj.timezones) return "-";
      return obj.timezones.join(pinyOptions.arraySeparator);
    },
  },
  {
    field: "continents",
    fieldName: "continents",
    infoDE: "Kontinent(e)",
    infoEN: "List of continents the country is on",
    data(obj) {
      if (!obj.continents) return "-";
      return obj.continents.join(pinyOptions.arraySeparator);
    },
  },
  {
    field: "region",
    fieldName: "region",
    infoDE: "UN-Bevölkerungsregion(en)",
    infoEN: "UN demographic regions",
    data(obj) {
      if (!obj.region) return "-";
      return obj.region;
    },
  },
  {
    field: "subregion",
    fieldName: "subregion",
    infoDE: "UN-Bevölkerungsunterregion(en)",
    infoEN: "UN demographic subregions",
    data(obj) {
      if (!obj.subregion) return "-";
      return obj.subregion;
    },
  },
  {
    field: "latlng",
    fieldName: "latlng",
    infoDE: "Breiten- und Längengrad (Landeszentrum)",
    infoEN: "Latitude and longitude (country center)",
    data(obj) {
      if (!obj.latlng) return "-";
      return `Latitude: ${obj.latlng[0]}<br>Longitude: ${obj.latlng[1]}`;
    },
  },
  {
    field: "currencies",
    fieldName: "currencies",
    infoDE: "Währung(en)",
    infoEN: "List of all currencies",
    data(obj) {
      if (!obj.currencies) return "-";
      return Object.values(obj.currencies)
        .map((item) => `${item.symbol} (${item.name})`)
        .join(pinyOptions.arraySeparator);
    },
  },
  {
    field: "cca2",
    fieldName: "cca2",
    infoDE: "Alpha-2-Ländercode (ISO 3166-1)",
    infoEN: "ISO 3166-1 alpha-2 two-letter country code",
    data(obj) {
      if (!obj.cca2) return "-";
      return obj.cca2;
    },
  },
  {
    field: "cca3",
    fieldName: "cca3",
    infoDE: "Alpha-3-Ländercode (ISO 3166-1)",
    infoEN: "ISO 3166-1 alpha-3 three-letter country code",
    data(obj) {
      if (!obj.cca3) return "-";
      return obj.cca3;
    },
  },
  {
    field: "ccn3",
    fieldName: "ccn3",
    infoDE: "Numerischer Ländercode (ISO 3166-1)",
    infoEN: "ISO 3166-1 numeric country code",
    data(obj) {
      if (!obj.ccn3) return "-";
      return obj.ccn3;
    },
  },
  {
    field: "cioc",
    fieldName: "cioc",
    infoDE: "IOC-Code",
    infoEN: "Code of the International Olympic Committee",
    data(obj) {
      if (!obj.cioc) return "-";
      return obj.cioc;
    },
  },
  {
    field: "fifa",
    fieldName: "fifa",
    infoDE: "FIFA-Code",
    infoEN: "FIFA code",
    data(obj) {
      if (!obj.fifa) return "-";
      return obj.fifa;
    },
  },
  {
    field: "car",
    fieldName: "carSigns",
    infoDE: "Auto-Unterscheidungszeichen",
    infoEN: "Car distinguised (oval) signs",
    data(obj) {
      if (!obj.car.signs) return "-";
      return obj.car.signs.join(pinyOptions.arraySeparator);
    },
  },
  {
    field: "car",
    fieldName: "carSide",
    infoDE: "Auto-Fahrerseite",
    infoEN: "Car driving side",
    data(obj) {
      if (!obj.car.side) return "-";
      return obj.car.side;
    },
  },
  {
    field: "independent",
    fieldName: "independent",
    infoDE: "Unabhängigkeitsstatus (ISO 3166-1)",
    infoEN: "Independence status (ISO 3166-1 )",
    data(obj) {
      if (!obj.independent) return "-";
      return obj.independent ? "Ja" : "Nein";
    },
  },
  {
    field: "landlocked",
    fieldName: "landlocked",
    infoDE: "Binnenstaat",
    infoEN: "Landlocked country",
    data(obj) {
      if (!obj.landlocked) return "-";
      return obj.landlocked ? "Ja" : "Nein";
    },
  },
  {
    field: "status",
    fieldName: "status",
    infoDE: "Zuweisungsstatus (ISO 3166-1)",
    infoEN: "ISO 3166-1 assignment status",
    data(obj) {
      if (!obj.status) return "-";
      return obj.status;
    },
  },
  {
    field: "unMember",
    fieldName: "unMember",
    infoDE: "UN-Mitgliedsstatus",
    infoEN: "UN Member status",
    data(obj) {
      if (!obj.unMember) return "-";
      return obj.unMember ? "Ja" : "Nein";
    },
  },
  {
    field: "tld",
    fieldName: "tld",
    infoDE: "Top-Level-Domains im Internet",
    infoEN: "Internet top level domains",
    data(obj) {
      if (!obj.tld) return "-";
      return obj.tld.join(pinyOptions.arraySeparator);
    },
  },
  // {  field: "coatOfArms" ,fieldName: "coatOfArms", infoEN: "Links to svg and png images" , data(obj){return obj}},
  // {  field: "demonym" ,fieldName: "demonym", infoEN: "Inhabitants of the country" , data(obj){return obj}},
  // {  field: "demonyms  ,fieldName: "demonyms (m/f)", infoEN: "Genderized inhabitants of the country" , data(obj){return obj}},
  // {  field: "flags" ,fieldName: "flags", infoEN: "Links to svg and png flags" , data(obj){return obj}},
  // {  field: "gini" ,fieldName: "gini", infoEN: "Worldbank index" , data(obj){return `${obj.gini}`}},
  // {  field: "maps" ,fieldName: "maps", infoEN: "Link to Google maps and Open Street maps" , data(obj){return obj}},
  // {  field: "regionalBlocs" ,fieldName: "regionalBlocs", infoEN: "" , data(obj){return obj}},
  // {  field: "startOfWeek" ,fieldName: "startOfWeek", infoEN: "Day of the start of week (Sunday/Monday)" , data(obj){return obj}},
  // {  field: "translations" ,fieldName: "translations", infoEN: "List of country name translations" , data(obj){return obj}},
];
