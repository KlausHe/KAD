import { dbID, dbIDStyle, daEL, deepClone, KadDOM, KadCSS, KadColor } from "../General/KadUtils.js";
import { contentGrid, resizeGrid } from "../General/Layout.js";
import * as Canvas from "../MainModulesCanvas.js";

export const globalValues = {
	mediaSizes: {
		get size() {
			return KadCSS.getRoot("UIHeight1", true, true);
		},
		get fontSize() {
			return KadCSS.getRoot("fontSize", true, true);
		},
		get radius() {
			return KadCSS.getRoot("UIRadius", true, true);
		},
		get divGridMinWidth() {
			return Math.floor(this.size * KadCSS.getRoot("divGridMinWidthFactor", true));
		},
		get gridMarginSide() {
			return Math.floor(this.size * KadCSS.getRoot("gridMarginSide", true));
		},
		get imgSize() {
			return KadCSS.getRoot("imgSize", true, true);
		},
		get canvasSize() {
			const val = KadCSS.getRoot("gridWidthGameCanvas", true, true);
			return { w: val, h: val };
		},
	},
	settings: {
		copyClick: true,
		copySeparator: true,
		decimals: 4,
		fontSize: 12,
	},
	get copySeparatorSign() {
		return this.settings.copySeparator ? "," : ".";
	},
	fontSizeArray: [6, 8, 10, 11, 12, 14, 16, 18, 20, 24, 26, 32],
	decimalsArray: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	intervalJSON: 1000 * 60 * 60 * 1, // 1000 millis * 60 sec * 60 minutes * 2 hours
	colors: {
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
		colorSettingsOrig: {
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
				return [...globalValues.colors.mode.Background];
			},
			get baseColor() {
				return [...globalValues.colors.mode.Navbar];
			},
			get text() {
				return [...KadColor.stateAsArray(globalValues.colors.mode.Background, "HSL")];
			},
			get textNavbar() {
				return [...KadColor.stateAsArray(globalValues.colors.mode.Background, "HSL")];
			},
			get line() {
				return [...KadColor.stateAsArray(globalValues.colors.mode.Background, "HSL")];
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
	},
	globalInput: {
		generateSpreadLists() {
			// globalValues.globalInput.generateSpreadLists();
			this.globalValString = [];
			this.globalValNumber = [];
			for (let obj in contentGrid) {
				if (contentGrid[obj].hasOwnProperty("globalValString")) this.globalValString.push(contentGrid[obj].globalValString);
				if (contentGrid[obj].hasOwnProperty("globalValNumber")) this.globalValNumber.push(contentGrid[obj].globalValNumber);
			}
		},
		globalValString: [],
		globalValNumber: [],
		input: null,
		get value() {
			return this.input;
		},
		set value(v) {
			let val = v.trim();
			this.input = val == "" ? "" : isNaN(val) ? val : Number(val);
			this.spreadVal();
		},
		spreadVal() {
			let arr = isNaN(this.value) ? globalValues.globalInput.globalValString : globalValues.globalInput.globalValNumber;
			for (const id of arr) {
				const obj = dbID(id);
				obj.value = globalValues.globalInput.value;
				obj.dispatchEvent(new Event("input"));
			}
		},
	},
};

//------------------GeneralSettings-------------------------------------------------------------------------------------------------------------------------------------------
daEL(idCb_settingsCopyClick, "click", () => settingsCopyClick(idCb_settingsCopyClick));
daEL(idCb_settingsCopySeparator, "click", () => settingsCopySeparator(idCb_settingsCopySeparator));
daEL(idSel_settingsFontsize, "change", () => settingsFontsize(idSel_settingsFontsize));
daEL(idSel_settingsDecimals, "change", () => settingsDecimals(idSel_settingsDecimals));

export function clear_cl_GeneralSettings() {
	settingsCopySeparator();
	for (let i = 0; i < globalValues.fontSizeArray.length; i++) {
		dbID("idSel_settingsFontsize").options[i] = new Option(globalValues.fontSizeArray[i], globalValues.fontSizeArray[i]);
	}
	dbID("idSel_settingsFontsize").options[4].selected = "true";
	for (let i = 0; i < globalValues.decimalsArray.length; i++) {
		dbID("idSel_settingsDecimals").options[i] = new Option(globalValues.decimalsArray[i], globalValues.decimalsArray[i]);
	}
	dbID("idSel_settingsDecimals").options[4].selected = "true";
}

export const storage_cl_GeneralSettings = {
  dbName: "GeneralSettings",
	contentName: "cl_GeneralSettings",
	clear() {
		this.data = {
			copyClick: true,
			copySeparator: true,
			decimals: 4,
			fontSize: 12,
			clear: true,
		};
	},
	get data() {
		return globalValues.settings;
	},
	set data(data) {
		const clear = data.hasOwnProperty("clear");
		for (const key of Object.keys(globalValues.settings)) {
			if (key == "clear") continue;
			globalValues.settings[key] = data[key];
		}
		//call functions without arg to toggle secific functionality
		if (!clear) {
			settingsCopyClick();
			settingsCopySeparator();
			settingsFontsize();
			settingsDecimals();
		}
	},
};
function settingsCopyClick(obj = null) {
	if (obj === null) {
		dbID("idCb_settingsCopyClick").checked = globalValues.settings.copyClick; //set CB when loaded
	} else {
		globalValues.settings.copyClick = obj.checked;
	}
	KadDOM.enableBtn("idCb_settingsCopySeparator", globalValues.settings.copyClick); //disabel button, because it is not needed when you can not copy
}

function settingsCopySeparator(obj = null) {
	if (obj === null) {
		dbID("idCb_settingsCopySeparator").checked = globalValues.settings.copySeparator; //set CB when loaded
	} else {
		globalValues.settings.copySeparator = obj.checked;
	}
	dbID("idLbl_settingsCopySeparator").innerHTML = `Nummernformat: ' ${globalValues.copySeparatorSign} '`;
}

function settingsFontsize(obj = null) {
	if (obj === null) {
		const opt = globalValues.fontSizeArray.indexOf(Number(globalValues.settings.fontSize));
		dbID("idSel_settingsFontsize").options[opt].selected = true; //set FS when loaded
	} else {
		globalValues.settings.fontSize = obj.value;
	}
	KadCSS.setRoot("fontSize", globalValues.settings.fontSize, "px");
	colorUpdateCanvascolors();
	resizeGrid();
}

function settingsDecimals(obj = null) {
	if (obj === null) {
		const opt = globalValues.decimalsArray.indexOf(Number(globalValues.settings.decimals));
		dbID("idSel_settingsDecimals").options[opt].selected = true; //set CB when loaded
	} else {
		globalValues.settings.decimals = obj.value;
		alert("Änderung wird erst bei Neuberechnung übernommen!");
	}
}

//------------------ColorSettings-------------------------------------------------------------------------------------------------------------------------------------------
daEL(idVin_colorSetting_light_Navbar, "change", () => colorChange(idVin_colorSetting_light_Navbar));
daEL(idVin_colorSetting_light_Gridtitle, "change", () => colorChange(idVin_colorSetting_light_Gridtitle));
daEL(idVin_colorSetting_light_Background, "change", () => colorChange(idVin_colorSetting_light_Background));
daEL(idVin_colorSetting_dark_Navbar, "change", () => colorChange(idVin_colorSetting_dark_Navbar));
daEL(idVin_colorSetting_dark_Gridtitle, "change", () => colorChange(idVin_colorSetting_dark_Gridtitle));
daEL(idVin_colorSetting_dark_Background, "change", () => colorChange(idVin_colorSetting_dark_Background));

export function clear_cl_ColorSettings() {
	globalValues.colors.lightmode = deepClone(globalValues.colors.colorSettingsOrig.lightmode);
	globalValues.colors.darkmode = deepClone(globalValues.colors.colorSettingsOrig.darkmode);
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
			lightmode: deepClone(globalValues.colors.lightmode),
			darkmode: deepClone(globalValues.colors.darkmode),
		};
	},
	set data(data) {
		if (data == null) {
			globalValues.colors.lightmode = deepClone(globalValues.colors.colorSettingsOrig.lightmode);
			globalValues.colors.darkmode = deepClone(globalValues.colors.colorSettingsOrig.darkmode);
			return;
		}
		globalValues.colors.lightmode = deepClone(data.lightmode);
		globalValues.colors.darkmode = deepClone(data.darkmode);
		displayColorSystem();
		populateColorSelector();
	},
};

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
darkModeMediaQuery.addEventListener("change", (e) => {
	globalValues.colors.darkmodeOn = e.matches;
	displayColorSystem();
});

export function displayColorSystem() {
	// let theme = globalValues.colors.modeName;
	for (let theme of ["light", "dark"]) {
		for (let [name, col] of Object.entries(globalValues.colors[`${theme}mode`])) {
			const selID = `idLbl_colorSetting_${theme}_${name}`;
			dbIDStyle(selID).background = KadColor.formatAsCSS(col, "HSL");
			dbIDStyle(selID).color = KadColor.stateAsCSS(col, "HSL");
			if (globalValues.colors.modeName == theme) {
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
		dbID("idImg_userNav_colormode").src = KadDOM.getImgPath(globalValues.colors.darkmodeOn ? "sun" : "moon");
		return;
	}
	globalValues.colors.darkmodeOn = !globalValues.colors.darkmodeOn;
	displayColorSystem();
}

function populateColorSelector() {
	for (let theme of ["light", "dark"]) {
		for (const [name, col] of Object.entries(globalValues.colors[`${theme}mode`])) {
			dbID(`idLbl_colorSetting_${theme}_${name}`).textContent = name;
			dbID(`idVin_colorSetting_${theme}_${name}`).value = KadColor.colAsString(col, "HSL", "HEX");
		}
	}
}

function colorChange(obj) {
	const theme = obj.dataset.theme;
	const name = obj.dataset.name;
	globalValues.colors[`${theme}mode`][name] = KadColor.colAsArray(obj.value, "HEX", "HSL");
	const col = globalValues.colors[`${theme}mode`][name];
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
