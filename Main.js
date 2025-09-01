import { createNewNuncDiscipuli } from "./General/Account.js";
import { bgaClearBackground } from "./General/BackgroundAnimation.js";
import { contentCheckActive, contentLayout, createContentlayoutList, createFooter, createNavbar, createSubgrid, navClick, resizeGrid } from "./General/Layout.js";
import { contentGroupsMaincontent } from "./General/MainContent.js";
import { KadDOM, KadDate, dbCL, dbCLStyle, dbID, hostDebug, initEL } from "./KadUtils/KadUtils.js";
import * as Clear from "./MainModulesClear.js";
import { colToggleColormode } from "./Settings/Color.js";
import { globalValues } from "./Settings/General.js";

window.onload = mainSetup;
function mainSetup() {
  if (hostDebug()) {
    dbCLStyle("cl_Loading").display = "none";
    // console.clear();
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
  dbID("idLbl_navBar_KW").KadSetText(`KW ${KadDate.getWeekNumber()}`);
  setTimeout(() => {
    hideLoadingscreen();
  }, 500);
}

// Navbar
initEL({ id: dbID("idDiv_navBar_Trash"), fn: resetAll });
initEL({ id: dbID("idSel_globalValue"), fn: globalValueChanged });
initEL({ id: dbID("idDiv_navBar_GlobalSettings"), fn: () => navClick("GlobalSettings") });
initEL({ id: dbID("idDiv_navBar_Colormode"), fn: colToggleColormode });
initEL({ id: dbID("idDiv_clearBackground"), fn: bgaClearBackground });
initEL({ id: dbID("idLbl_navBar_KW") });

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
  dbID("idSel_globalValue").KadReset({ selStartValue: "Benkyou", selGroup: { Groups: contentGroupsMaincontent, ...contentLayout.namelistContent } });
}

function globalValueChanged() {
  navClick(dbID("idSel_globalValue").KadGet());
}
