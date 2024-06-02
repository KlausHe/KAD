import { dbID, dbIDStyle, daEL, deepClone, KadDOM, KadCSS, KadColor } from "../General/KadUtils.js";
import * as Canvas from "../MainModulesCanvas.js";

export const globalColors = {
	darkmodeOn: false,
	get modeName() {
		return this.darkmodeOn ? "dark" : "light";
	},
	get mode() {
		return this.darkmodeOn ? this.darkmode : this.lightmode;
	},
	array: [
		[0, 0, 100],
		[0, 0, 90],
		[0, 0, 82],
		[0, 0, 66],
		[0, 0, 58],
		[180, 25, 24],
		[223, 11, 18],
		[0, 100, 0],
		[0, 61, 15],
		[100, 5, 89],
		[240, 52, 54],
		[240, 100, 80],
		[41, 100, 50],
		[195, 100, 50],
		[60, 100, 58],
		[52, 53, 70],
		[0, 29, 49],
		[275, 52, 54],
	],
	modesOrig: {
		lightmode: {
			Navbar: [240, 52, 54],
			Gridtitle: [240, 52, 54],
			Background: [100, 5, 89], //[52, 53, 70]
		},
		darkmode: {
			Navbar: [223, 11, 18],
			Gridtitle: [180, 25, 24],
			Background: [180, 25, 24],
		},
	},
	lightmode: {
		Navbar: [240, 52, 54],
		Gridtitle: [240, 52, 54],
		Background: [100, 5, 89], //[52, 53, 70]
	},
	darkmode: {
		Navbar: [223, 11, 18],
		Gridtitle: [180, 25, 24],
		Background: [180, 25, 24],
	},
	elements: {
		get background() {
			return [...globalColors.mode.Background];
		},
		get baseColor() {
			return [...globalColors.mode.Navbar];
		},
		get text() {
			return [...KadColor.stateAsArray(globalColors.mode.Background, "HSL")];
		},
		get textNavbar() {
			return [...KadColor.stateAsArray(globalColors.mode.Background, "HSL")];
		},
		get line() {
			return [...KadColor.stateAsArray(globalColors.mode.Background, "HSL")];
		},
		get btn() {
			return [0, 0, 100];
		},
		get btnPositive() {
			return [120, 100, 50];
		},
		get btnNegative() {
			return [0, 100, 45];
		},
		get btnPositiveText() {
			return [0, 0, 0];
		},
		get btnNegativeText() {
			return [0, 0, 100];
		},
	},
};

daEL(idVin_colorSetting_light_Navbar, "change", () => colorChange(idVin_colorSetting_light_Navbar));
daEL(idVin_colorSetting_light_Gridtitle, "change", () => colorChange(idVin_colorSetting_light_Gridtitle));
daEL(idVin_colorSetting_light_Background, "change", () => colorChange(idVin_colorSetting_light_Background));
daEL(idVin_colorSetting_dark_Navbar, "change", () => colorChange(idVin_colorSetting_dark_Navbar));
daEL(idVin_colorSetting_dark_Gridtitle, "change", () => colorChange(idVin_colorSetting_dark_Gridtitle));
daEL(idVin_colorSetting_dark_Background, "change", () => colorChange(idVin_colorSetting_dark_Background));

export function clear_cl_ColorSettings() {
	globalColors.lightmode = deepClone(globalColors.modesOrig.lightmode);
	globalColors.darkmode = deepClone(globalColors.modesOrig.darkmode);
	displayColorSystem();
	populateColorSelector();
}

export const storage_cl_ColorSettings = {
	dbName: "ColorSettings",
	contentName: "cl_ColorSettings",
	clear() {
		this.data = null;
	},
	get data() {
		return {
			lightmode: deepClone(globalColors.lightmode),
			darkmode: deepClone(globalColors.darkmode),
		};
	},
	set data(data) {
		if (data == null) {
			globalColors.lightmode = deepClone(globalColors.modesOrig.lightmode);
			globalColors.darkmode = deepClone(globalColors.modesOrig.darkmode);
			return;
		}
		globalColors.lightmode = deepClone(data.lightmode);
		globalColors.darkmode = deepClone(data.darkmode);
		displayColorSystem();
		populateColorSelector();
	},
};

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
darkModeMediaQuery.addEventListener("change", (e) => {
	globalColors.darkmodeOn = e.matches;
	displayColorSystem();
});

export function displayColorSystem() {
	// let theme = globalColors.modeName;
	for (let theme of ["light", "dark"]) {
		for (let [name, col] of Object.entries(globalColors[`${theme}mode`])) {
			const selID = `idLbl_colorSetting_${theme}_${name}`;
			dbIDStyle(selID).background = KadColor.formatAsCSS(col, "HSL");
			dbIDStyle(selID).color = KadColor.stateAsCSS(col, "HSL");
			if (globalColors.modeName == theme) {
				KadCSS.setRoot(`bgc${name}`, KadColor.formatAsString(col, "HSL"));
				KadCSS.setRoot(`txt${name}`, KadColor.stateAsString(col, "HSL"));
				KadCSS.setRoot(`inv${name}`, KadColor.stateAsBool(col, "HSL"));
			}
		}
	}
	colToggleColormode();
	setTimeout(() => {
		colorUpdateCanvascolors();
	}, KadCSS.getRoot("transitionTimeName", true) * 1000);
}

export function colToggleColormode(btn = null) {
	if (btn === null) {
		dbID("idImg_userNav_colormode").src = KadDOM.getImgPath(globalColors.darkmodeOn ? "sun" : "moon");
		return;
	}
	globalColors.darkmodeOn = !globalColors.darkmodeOn;
	displayColorSystem();
}

function populateColorSelector() {
	for (let theme of ["light", "dark"]) {
		for (const [name, col] of Object.entries(globalColors[`${theme}mode`])) {
			dbID(`idLbl_colorSetting_${theme}_${name}`).textContent = name;
			dbID(`idVin_colorSetting_${theme}_${name}`).value = KadColor.colAsString(col, "HSL", "HEX");
		}
	}
}

function colorChange(obj) {
	const theme = obj.dataset.theme;
	const name = obj.dataset.name;
	globalColor[`${theme}mode`][name] = KadColor.colAsArray(obj.value, "HEX", "HSL");
	const col = globalColor[`${theme}mode`][name];
	KadCSS.setRoot(`bgc${name}`, KadColor.formatAsString(col, "HSL"));
	KadCSS.setRoot(`txt${name}`, KadColor.stateAsString(col, "HSL"));
	KadCSS.setRoot(`inv${name}`, KadColor.stateAsBool(col, "HSL"));
	dbIDStyle(`idLbl_colorSetting_${theme}_${name}`).background = KadColor.formatAsCSS(col, "HSL");
	dbIDStyle(`idLbl_colorSetting_${theme}_${name}`).color = KadColor.stateAsCSS(col, "HSL");
	dbID(`idVin_colorSetting_${theme}_${name}`).value = obj.value;
	colorUpdateCanvascolors();
}

function colorUpdateCanvascolors() {
	for (const canvasFunction of Object.values(Canvas)) {
		canvasFunction();
	}
}
