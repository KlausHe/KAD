import * as KadUtils from "./General/KadUtils.js";
import { createNewNuncDiscipuli } from "./General/Account.js";
import * as Layout from "./General/Layout.js";
import { globalValues } from "./Settings/General.js";
import { displayColorSystem, colToggleColormode, globalColors } from "./Settings/Color.js";
import { bgaClearBackground, bgaToggleReset } from "./General/BackgroundAnimation.js";
import * as Clear from "./MainModulesClear.js";

// p5-Setup in Soundlibrary only!  Use Instance "globalP5" for general functionality
export const globalP5 = new p5((c) => {
	c.setup = function () {
		c.noCanvas();
		c.noLoop();
	};
});

window.onload = mainSetup;

function mainSetup() {
	if (KadUtils.hostDebug()) KadUtils.dbCLStyle("cl_Loading").display = "none";
	Layout.contentLayout.createContentGrid();
	htmlSetVinChange();
	globalColors.darkmodeOn = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
	createNewNuncDiscipuli();

	Layout.createContentlayoutList(); // First: create the LayoutLists
	Layout.createNavbar();
	Layout.createFooter();
	Layout.createSubgrid();
	Layout.contentLayout.prevNavContent = Layout.contentLayout.defaultPage;
	//create Pikadays
	// createIomlaidPikaday();
	// createKadarPikaday("A");
	// createKadarPikaday("B");

	clearAllTiles();
	Layout.resizeGrid();
	Layout.navClick();
	globalValues.globalInput.generateSpreadLists();
	KadUtils.KadDOM.resetInput(idVin_globalValue, "Mastervalue");
	KadUtils.dbID("idLbl_navBar_KW").textContent = `KW ${KadUtils.KadDate.getWeekNumber()}`;
	clearGlobalValue();
	setTimeout(() => {
		hideLoadingscreen();
	}, 500);
}

// no rightclicking anywhere!
document.oncontextmenu = function () {
	return false;
};
// Navbar
KadUtils.initEL({ id: idDiv_navBar_Trash, fn: resetAll });
KadUtils.initEL({ id: idVin_globalValue, fn: globalValueChanged, dbList: Layout.contentLayout.nameList });

KadUtils.initEL({ id: idDiv_navBar_GlobalSettings, fn: () => Layout.navClick("GlobalSettings") });
KadUtils.initEL({ id: idDiv_navBar_Colormode, fn: colToggleColormode });
// Footer
KadUtils.initEL({ id: idDiv_clearBackground, fn: bgaClearBackground });
KadUtils.initEL({ id: idCb_bgaReset, fn: () => bgaToggleReset(idCb_bgaReset) });

export function resetAll() {
	createNewNuncDiscipuli();
	displayColorSystem();
	clearAllTiles();
	clearGlobalValue();
	Layout.navClick();
}

function clearAllTiles() {
	for (const clearFunction of Object.values(Clear)) {
		if (clearFunction != undefined) clearFunction();
	}
}

function htmlSetVinChange() {
	const dirName = ["oSub", "trash", "oAdd"];
	envoked("vinChangeSub", -1);
	envoked("vinChangeTrash", 0);
	envoked("vinChangeAdd", 1);

	function envoked(name, dir) {
		const obj = KadUtils.dbCL(`${name}`, null);
		for (let btn of obj) {
			btn.onclick = () => {
				return KadUtils.KadDOM.vinChange(btn, dir);
			};
			const name = dirName[dir + 1];
			const img = document.createElement("img");
			img.classList.add(`img_${name}`);
			img.setAttribute("alt", `${name}.svg`);
			btn.appendChild(img);
		}
	}
}

function hideLoadingscreen() {
	KadUtils.dbCL("cl_Loading").classList.add("cl_LoadingFinished");
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
	const obj = KadUtils.dbID("idVin_globalValue");
	obj.value = "";
	obj.addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			globalValueChanged(true);
		}
	});
}

function globalValueChanged(enter = null) {
	const obj = KadUtils.dbID("idVin_globalValue");
	obj.classList.remove("cl_highlighted");
	const arr = Layout.contentLayout.nameList;
	globalValues.globalInput.value = obj.value;
	if (arr.includes(obj.value)) {
		obj.classList.add("cl_highlighted");
		if (enter === true) {
			let key = Object.entries(Layout.contentGrid).filter((arr) => arr[1].name == obj.value)[0][0];
			Layout.toggelFullscreen(key);
		}
	}
}
