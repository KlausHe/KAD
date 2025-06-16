import { createNewNuncDiscipuli } from "./General/Account.js";
import { bgaClearBackground } from "./General/BackgroundAnimation.js";
import { contentCheckActive, contentLayout, createContentlayoutList, createFooter, createNavbar, createSubgrid, navClick, resizeGrid } from "./General/Layout.js";
import { contentGroupsMaincontent } from "./General/MainContent.js";
import { KadDOM, KadDate, dbCL, dbCLStyle, hostDebug, initEL } from "./KadUtils/KadUtils.js";
import * as Clear from "./MainModulesClear.js";
import { colToggleColormode } from "./Settings/Color.js";
import { globalValues } from "./Settings/General.js";

window.onload = mainSetup;
function mainSetup() {
  if (hostDebug()) {
    dbCLStyle("cl_Loading").display = "none";
    console.clear();
  }
  contentLayout.createContentData();
  createContentlayoutList(); // First: create the LayoutLists
  KadDOM.htmlSetVinChange();
  KadDOM.htmlSetButtonType();
  createNewNuncDiscipuli();

  createNavbar();
  createFooter();
  createSubgrid();
  contentLayout.prevNavContent = contentLayout.defaultPage;
  clearAllTiles();
  resizeGrid();
  navClick();
  updateMasterSelect();
  idLbl_navBar_KW.KadSetText(`KW ${KadDate.getWeekNumber()}`);
  setTimeout(() => {
    hideLoadingscreen();
  }, 500);
}

// Navbar
initEL({ id: idDiv_navBar_Trash, fn: resetAll });
initEL({ id: idSel_globalValue, fn: globalValueChanged });
initEL({ id: idDiv_navBar_GlobalSettings, fn: () => navClick("GlobalSettings") });
initEL({ id: idDiv_navBar_Colormode, fn: colToggleColormode });
initEL({ id: idDiv_clearBackground, fn: bgaClearBackground });
initEL({ id: idLbl_navBar_KW });

export function resetAll() {
  createNewNuncDiscipuli();
  clearAllTiles();
  navClick();
}

function clearAllTiles() {
  for (const clearFunction of Object.values(Clear)) {
    const name = clearFunction.name.replace("clear_", "");
    if (clearFunction != undefined && contentCheckActive(name)) clearFunction();
  }
}

function hideLoadingscreen() {
  dbCL("cl_Loading").classList.add("cl_LoadingFinished");
}

export function timeoutCanvasFinished(canv, txt = { textTop: "", textBottom: "" }) {
  canv.noLoop();
  setTimeout(() => {
    canv.stroke(255, 0, 0);
    canv.strokeWeight(2);
    canv.textSize(globalValues.mediaSizes.fontSize * 3);
    canv.fill(0);
    canv.textAlign(canv.CENTER, canv.BOTTOM);
    canv.text(txt.textTop, canv.width / 2, canv.height / 2);
    canv.textAlign(canv.CENTER, canv.TOP);
    canv.text(txt.textBottom, canv.width / 2, canv.height / 2);
  }, 200);
}

export function updateMasterSelect() {
  idSel_globalValue.KadReset({ selStartValue: "Benkyou", selGroup: { Groups: contentGroupsMaincontent, ...contentLayout.namelistContent } });
}

function globalValueChanged() {
  navClick(idSel_globalValue.KadGet());
}

/*
function test() {
  let obj = [];
  for (let country of all) {
    obj.push({
      nameDE: country.translations.deu.official,
      nameDECommon: country.translations.deu.common,
      nameEN: country.name.official,
      nameENCommon: country.name.common,
      altSpellings: country.altSpellings,
      flagSvgURL: country.flags.svg,
      flagEmoji: country.flag,
      population: country.population,
      area: country.area,
      borders: country.borders,
      phone: Object.keys(country.idd).length == 0 ? null : country.idd.suffixes.map((suf) => Number(`${country.idd.root.replace("+", "")}${suf}`)),
      languages: country.languages == undefined ? null : Object.values(country.languages),
      countryLatLng: country.latlng,
      capital: country.capital,
      capitalLatLng: country.capitalInfo.latlng,
      timezones: country.timezones,
      continents: country.continents,
      region: country.region,
      subregion: country.subregion,
      currencyCode: country.currencies == undefined ? null : Object.keys(country.currencies),
      currencyName: country.currencies == undefined ? null : Object.values(country.currencies).map((v) => v.name),
      currencySymbol: country.currencies == undefined ? null : Object.values(country.currencies).map((v) => v.symbol),
      cca2: country.cca2,
      cca3: country.cca3,
      ccn3: Number(country.ccn3),
      cioc: country.cioc,
      fifa: country.fifa,
      carSigns: country.car.signs,
      carSide: country.car.side,
      independent: country.independent,
      landlocked: country.landlocked,
      unStatus: country.status,
      unMember: country.unMember,
      tld: country.tld,
    });
  }
  KadFile.downloadFile(obj, "json");
}
*/
