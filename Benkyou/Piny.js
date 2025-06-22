import { Data_Country_CodesIso3166, Data_Country_Descriptions } from "../KadData/KadData_Countries.js";
import { initEL, KadArray, KadLog, KadRandom, KadTable, KadValue } from "../KadUtils/KadUtils.js";

initEL({
  id: idSel_pinyCountry,
  fn: pinyCreateCountryData,
  selList: Data_Country_CodesIso3166.map((obj, index) => [obj.nameDECommon, index]).sort(),
  selStartIndex: KadRandom.randomIndex(Data_Country_CodesIso3166.length),
});
initEL({
  id: idSel_pinyField,
  fn: pinyCreateFieldData,
  selStartIndex: 0,
});

const pinyOptions = {
  countryIndex: 0,
  fieldIndex: 0,
  arraySeparator: "<br>",
};

export function clear_cl_Piny() {
  pinyOptions.countryData = Data_Country_CodesIso3166;
  idSel_pinyCountry.KadReset();
  idSel_pinyField.KadReset({ selList: Object.keys(pinyFieldOptions).map((item) => [Data_Country_Descriptions[item], item]) });
  pinyCreateCountryData();
}

const uiSize = "width10";
function pinyCreateCountryData() {
  const countryIndex = idSel_pinyCountry.KadGet();
  const country = Data_Country_CodesIso3166[countryIndex];
  const header = [
    { data: "Eigenschaft", settings: { uiSize } },
    { data: "Wert", settings: { uiSize } },
  ];
  const body = [
    { data: Object.keys(pinyFieldOptions).map((obj) => Data_Country_Descriptions[obj]), settings: { uiSize } },
    { data: Object.keys(pinyFieldOptions).map((obj) => pinyFieldOptions[obj](country)), settings: { uiSize } },
  ];
  KadTable.createHTMLGrid({ id: idTab_pinyTable, header, body });
}

// async function pinyGetDataForField() {
//   pinyOptions.fieldIndex = idSel_pinyField.KadGet();
//   const url = pinyOptions.getFieldURL();
//   const { data, error } = await KadFile.loadUrlToJSON({ variable: "data", url });
//   if (KadLog.errorChecked(error, "Could not receive data for 'Piny'.", error)) return;
//   pinyOptions.fieldData = data;
//   pinyCreateFieldData();
// }
//
function pinyCreateFieldData() {
  pinyOptions.fieldName = idSel_pinyField.KadGet({ content: true });
  KadLog.log(pinyOptions.fieldName);

  const sortedCountries = KadArray.sortArrayByKey({
    array: Data_Country_CodesIso3166,
    key: "cca2",
    caseSensitive: true,
  });

  KadLog.log(sortedCountries);

  const header = [
    { data: "Land", settings: { uiSize } },
    { data: "Wert", settings: { uiSize } },
  ];
  const body = [
    { data: sortedCountries.map((item) => item.nameDE), settings: { uiSize } },
    { data: sortedCountries.map((item) => pinyFieldOptions[pinyOptions.fieldName](item)), settings: { uiSize } },
  ];
  KadTable.createHTMLGrid({ id: idTab_pinyTable, header, body });
}

// pinyOptions.fieldData = KadArray.sortArrayByKey({ array: pinyOptions.fieldData, keys: ["translations", "deu", "official"], caseSensitive: true });
// const body = [
//   { data: pinyOptions.fieldData.map((item) => item.translations.deu.official), settings: { uiSize } },
//   { data: pinyOptions.fieldData.map((item) => pinyFieldOptions[pinyOptions.fieldIndex].data(item)), settings: { uiSize } },
// ];

const pinyFieldOptions = {
  nameDE(obj) {
    if (!obj.nameDE) return "-";
    return obj.nameDE;
  },
  nameDECommon(obj) {
    if (!obj.nameDECommon) return "-";
    return obj.nameDECommon;
  },
  nameEN(obj) {
    if (!obj.nameEN) return "-";
    return obj.nameEN;
  },
  nameENCommon(obj) {
    if (!obj.nameENCommon) return "-";
    return obj.nameENCommon;
  },
  altSpellings(obj) {
    if (!obj.altSpellings || obj.altSpellings.length <= 1) return "-";
    return obj.altSpellings.slice(1).join(pinyOptions.arraySeparator);
  },
  // flagSvgURL(obj) {  },
  flagEmoji(obj) {
    if (!obj.flagEmoji) return "-";
    return obj.flagEmoji;
  },
  population(obj) {
    if (!obj.population) return "-";
    return `${KadValue.number(obj.population, { indicator: true })} Einwohner`;
  },
  area(obj) {
    if (!obj.area) return "-";
    return `${KadValue.number(obj.area, { indicator: true })} km<sup>2</sup>`;
  },
  borders(obj) {
    if (!obj.borders) return "-";
    let map = obj.borders.map((border) => Data_Country_CodesIso3166.find((d) => d.cca3 == border));
    map = map.filter((b) => b != undefined).map((b) => b.nameDE);
    return map.join(pinyOptions.arraySeparator);
  },
  languages(obj) {
    if (!obj.languages) return "-";
    return Object.values(obj.languages).join(pinyOptions.arraySeparator);
  },
  countryLatLng(obj) {
    if (!obj.countryLatLng) return "-";
    return `Latitude: ${obj.countryLatLng[0]}<br>Longitude: ${obj.countryLatLng[1]}`;
  },
  capital(obj) {
    if (!obj.capital) return "-";
    return obj.capital.join(pinyOptions.arraySeparator);
  },
  capitalLatLng(obj) {
    if (!obj.capitolLatLng) return "-";
    return `Latitude: ${obj.capitolLatLng[0]}<br>Longitude: ${obj.capitolLatLng[1]}`;
  },
  timezones(obj) {
    if (!obj.timezones) return "-";
    return obj.timezones.join(pinyOptions.arraySeparator);
  },
  continents(obj) {
    if (!obj.continents) return "-";
    return obj.continents.join(pinyOptions.arraySeparator);
  },
  region(obj) {
    if (!obj.region) return "-";
    return obj.region;
  },
  subregion(obj) {
    if (!obj.subregion) return "-";
    return obj.subregion;
  },
  currencyName(obj) {
    if (!obj.currencyName || obj.currencyName.length <= 1) return "-";
    return obj.currencyName.join(pinyOptions.arraySeparator);
  },
  currencyCode(obj) {
    if (!obj.currencyCode || obj.currencyCode.length <= 1) return "-";
    return obj.currencyCode.join(pinyOptions.arraySeparator);
  },
  currencySymbol(obj) {
    if (!obj.currencySymbol || obj.currencySymbol.length <= 1) return "-";
    return obj.currencySymbol.join(pinyOptions.arraySeparator);
  },
  phone(obj) {
    if (!obj.phone) return "-";
    return obj.phone.join(pinyOptions.arraySeparator);
  },
  cca2(obj) {
    if (!obj.cca2) return "-";
    return obj.cca2;
  },
  cca3(obj) {
    if (!obj.cca3) return "-";
    return obj.cca3;
  },
  ccn3(obj) {
    if (!obj.ccn3) return "-";
    return obj.ccn3;
  },
  cioc(obj) {
    if (!obj.cioc) return "-";
    return obj.cioc;
  },
  fifa(obj) {
    if (!obj.fifa) return "-";
    return obj.fifa;
  },
  carSigns(obj) {
    if (!obj.carSigns || obj.carSigns.length < 1) return "-";
    return obj.carSigns.join(pinyOptions.arraySeparator);
  },
  carSide(obj) {
    if (!obj.carSide) return "-";
    return obj.carSide;
  },
  independent(obj) {
    if (!obj.hasOwnProperty("independent")) return "-";
    return obj.independent ? "Ja" : "Nein";
  },
  landlocked(obj) {
    if (!obj.hasOwnProperty("landlocked")) return "-";
    return obj.landlocked ? "Ja" : "Nein";
  },
  status(obj) {
    if (!obj.hasOwnProperty("status")) return "-";
    return obj.status;
  },
  unMember(obj) {
    if (!obj.hasOwnProperty("unMember")) return "-";
    return obj.unMember ? "Ja" : "Nein";
  },
  tld(obj) {
    if (!obj.tld || obj.tld.length <= 1) return "-";
    return obj.tld.join(pinyOptions.arraySeparator);
  },
};
