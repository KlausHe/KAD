import { createNewNuncDiscipuli } from "./General/Account.js";
import { bgaClearBackground } from "./General/BackgroundAnimation.js";
import { contentGrid, contentLayout, createContentlayoutList, createFooter, createNavbar, createSubgrid, navClick, resizeGrid, toggelFullscreen } from "./General/Layout.js";
import { KadDOM, KadDate, KadFile, dbCL, dbCLStyle, dbID, hostDebug, initEL, log } from "./KadUtils/KadUtils.js";
import * as Clear from "./MainModulesClear.js";
import { colToggleColormode } from "./Settings/Color.js";
import { globalValues } from "./Settings/General.js";

window.onload = mainSetup;

function mainSetup() {
	if (hostDebug()) dbCLStyle("cl_Loading").display = "none";
	contentLayout.createContentGrid();

	createContentlayoutList(); // First: create the LayoutLists
	KadDOM.htmlSetVinChange();
	KadDOM.htmlSetButtonType();
	// globalColors.darkmodeOn = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
	createNewNuncDiscipuli();

	createNavbar();
	createFooter();
	createSubgrid();
	contentLayout.prevNavContent = contentLayout.defaultPage;

	clearAllTiles();
	resizeGrid();
	navClick();
	globalValues.globalInput.generateSpreadLists();
	KadDOM.resetInput(idVin_globalValue, "Mastervalue");
	dbID("idLbl_navBar_KW").textContent = `KW ${KadDate.getWeekNumber()}`;
	clearGlobalValue();
	setTimeout(() => {
		hideLoadingscreen();
	}, 500);
}

// no rightclicking anywhere!
// document.oncontextmenu = function () {
// 	return false;
// };
// Navbar
initEL({ id: idDiv_navBar_Trash, fn: resetAll });
initEL({ id: idVin_globalValue, fn: globalValueChanged, dbList: contentLayout.nameList });
initEL({ id: idDiv_navBar_GlobalSettings, fn: () => navClick("GlobalSettings") });
initEL({ id: idDiv_navBar_Colormode, fn: colToggleColormode });
initEL({ id: idDiv_clearBackground, fn: bgaClearBackground });

export function resetAll() {
	createNewNuncDiscipuli();
	clearAllTiles();
	clearGlobalValue();
	navClick();
}

function clearAllTiles() {
	for (const clearFunction of Object.values(Clear)) {
		if (clearFunction != undefined) clearFunction();
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

function clearGlobalValue() {
	globalValues.globalInput.value = "";
	const obj = dbID("idVin_globalValue");
	obj.value = "";
	obj.addEventListener(
		"keyup",
		(event) => {
			if (event.keyCode === 13) {
				globalValueChanged(true);
			}
		},
		{ once: true }
	);
}

function globalValueChanged(enter = null) {
	const obj = dbID("idVin_globalValue");
	obj.classList.remove("cl_highlighted");
	globalValues.globalInput.value = obj.value;
	const arr = contentLayout.nameList;
	if (arr.includes(obj.value)) {
		obj.classList.add("cl_highlighted");
		if (enter === true) {
			let key = Object.entries(contentGrid).filter((arr) => arr[1].name == obj.value)[0][0];
			toggelFullscreen(key);
		}
	}
}
