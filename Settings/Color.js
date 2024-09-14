import { dbIDStyle, deepClone, initEL, KadColor, KadCSS, KadDOM } from "../KadUtils/KadUtils.js";
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

initEL({ id: idVin_colorSetting_light_Navbar, action: "input", fn: colorChange, resetValue: KadColor.colAsString(globalColors.modesOrig.lightmode.Navbar, "HSL", "HEX") });
initEL({ id: idVin_colorSetting_light_Gridtitle, action: "input", fn: colorChange, resetValue: KadColor.colAsString(globalColors.modesOrig.lightmode.Gridtitle, "HSL", "HEX") });
initEL({ id: idVin_colorSetting_light_Background, action: "input", fn: colorChange, resetValue: KadColor.colAsString(globalColors.modesOrig.lightmode.Background, "HSL", "HEX") });
initEL({ id: idVin_colorSetting_dark_Navbar, action: "input", fn: colorChange, resetValue: KadColor.colAsString(globalColors.modesOrig.darkmode.Navbar, "HSL", "HEX") });
initEL({ id: idVin_colorSetting_dark_Gridtitle, action: "input", fn: colorChange, resetValue: KadColor.colAsString(globalColors.modesOrig.darkmode.Gridtitle, "HSL", "HEX") });
initEL({ id: idVin_colorSetting_dark_Background, action: "input", fn: colorChange, resetValue: KadColor.colAsString(globalColors.modesOrig.darkmode.Background, "HSL", "HEX") });

if (window.matchMedia) {
	window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
		globalColors.darkmodeOn = event.matches;
		colorThemeChanged();
	});
}

export function clear_cl_ColorSettings() {
	globalColors.lightmode = deepClone(globalColors.modesOrig.lightmode);
	globalColors.darkmode = deepClone(globalColors.modesOrig.darkmode);
	colorThemeChanged();
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
		colorThemeChanged();
		populateColorSelector();
	},
};

export function colorThemeChanged() {
	idImg_userNav_colormode.src = KadDOM.getImgPath(globalColors.darkmodeOn ? "sun" : "moon");
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
	setTimeout(() => {
		colorUpdateCanvascolors();
	}, KadCSS.getRoot({ value: "transitionTimeName" }) * 1000);
}

export function colToggleColormode() {
	globalColors.darkmodeOn = !globalColors.darkmodeOn;
	colorThemeChanged();
}

function populateColorSelector() {
	idVin_colorSetting_light_Navbar.KadReset({ resetValue: KadColor.colAsString(globalColors.lightmode.Navbar, "HSL", "HEX") });
	idLbl_colorSetting_light_Navbar.textContent = `Navbar (${KadColor.colAsString(globalColors.lightmode.Navbar, "HSL", "HEX")})`;
	idVin_colorSetting_light_Gridtitle.KadReset({ resetValue: KadColor.colAsString(globalColors.lightmode.Gridtitle, "HSL", "HEX") });
	idLbl_colorSetting_light_Gridtitle.textContent = `Gridtitle (${KadColor.colAsString(globalColors.lightmode.Gridtitle, "HSL", "HEX")})`;
	idVin_colorSetting_light_Background.KadReset({ resetValue: KadColor.colAsString(globalColors.lightmode.Background, "HSL", "HEX") });
	idLbl_colorSetting_light_Background.textContent = `Background (${KadColor.colAsString(globalColors.lightmode.Background, "HSL", "HEX")})`;
	idVin_colorSetting_dark_Navbar.KadReset({ resetValue: KadColor.colAsString(globalColors.darkmode.Navbar, "HSL", "HEX") });
	idLbl_colorSetting_dark_Navbar.textContent = `Navbar (${KadColor.colAsString(globalColors.lightmode.Navbar, "HSL", "HEX")})`;
	idVin_colorSetting_dark_Gridtitle.KadReset({ resetValue: KadColor.colAsString(globalColors.darkmode.Gridtitle, "HSL", "HEX") });
	idLbl_colorSetting_dark_Gridtitle.textContent = `Gridtitle (${KadColor.colAsString(globalColors.lightmode.Gridtitle, "HSL", "HEX")})`;
	idVin_colorSetting_dark_Background.KadReset({ resetValue: KadColor.colAsString(globalColors.darkmode.Background, "HSL", "HEX") });
	idLbl_colorSetting_dark_Background.textContent = `Background (${KadColor.colAsString(globalColors.lightmode.Background, "HSL", "HEX")})`;
}

function colorChange(obj) {
	const theme = obj.target.dataset.theme;
	const name = obj.target.dataset.name;
	const value = obj.target.value;
	globalColors[`${theme}mode`][name] = KadColor.colAsArray(value, "HEX", "HSL");
	const col = globalColors[`${theme}mode`][name];
	dbIDStyle(`idLbl_colorSetting_${theme}_${name}`).background = KadColor.formatAsCSS(col, "HSL");
	dbIDStyle(`idLbl_colorSetting_${theme}_${name}`).color = KadColor.stateAsCSS(col, "HSL");

	if (theme == globalColors.modeName) {
		KadCSS.setRoot(`bgc${name}`, KadColor.formatAsString(col, "HSL"));
		KadCSS.setRoot(`txt${name}`, KadColor.stateAsString(col, "HSL"));
		KadCSS.setRoot(`inv${name}`, KadColor.stateAsBool(col, "HSL"));
		colorUpdateCanvascolors();
	}
}

export function colorUpdateCanvascolors() {
	for (const canvasFunction of Object.values(Canvas)) {
		canvasFunction();
	}
}
