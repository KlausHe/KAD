const globalValues = {
	mediaSizes: {
		get size() {
			return KadUtils.CSS.getRoot("UIHeight1", true, true);
		},
		get fontSize() {
			return KadUtils.CSS.getRoot("fontSize", true, true);
		},
		get radius() {
			return KadUtils.CSS.getRoot("UIRadius", true, true);
		},
		get divGridMinWidth() {
			return Math.floor(this.size * KadUtils.CSS.getRoot("divGridMinWidthFactor", true));
		},
		get gridMarginSide() {
			return Math.floor(this.size * KadUtils.CSS.getRoot("gridMarginSide", true));
		},
		get imgSize() {
			return KadUtils.CSS.getRoot("imgSize", true, true);
		},
		get canvasSize() {
			const val = KadUtils.CSS.getRoot("gridWidthGameCanvas", true, true);
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
	get copySeparatorLocation() {
		return this.settings.copySeparator ? "de-DE" : "en-EN";
	},
	fontSizeArray: [6, 8, 10, 11, 12, 14, 16, 18, 20, 24, 26, 32],
	decimalsArray: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	get hostDebug() {
		return ["local", "127.0.0.1"].some((s) => window.location.hostname.includes(s));
	},
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
				return [...KadUtils.Color.stateAsArray(globalValues.colors.mode.Background, "HSL")];
			},
			get textNavbar() {
				return [...KadUtils.Color.stateAsArray(globalValues.colors.mode.Background, "HSL")];
			},
			get line() {
				return [...KadUtils.Color.stateAsArray(globalValues.colors.mode.Background, "HSL")];
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
				const obj = KadUtils.dbID(id);
				obj.value = globalValues.globalInput.value;
				obj.dispatchEvent(new Event("input"));
			}
		},
	},
};

function clear_cl_GeneralSettings() {
	settingsCopySeparator();
	for (let i = 0; i < globalValues.fontSizeArray.length; i++) {
		KadUtils.dbID("idSel_settingsFontsize").options[i] = new Option(globalValues.fontSizeArray[i], globalValues.fontSizeArray[i]);
	}
	KadUtils.dbID("idSel_settingsFontsize").options[4].selected = "true";
	for (let i = 0; i < globalValues.decimalsArray.length; i++) {
		KadUtils.dbID("idSel_settingsDecimals").options[i] = new Option(globalValues.decimalsArray[i], globalValues.decimalsArray[i]);
	}
	KadUtils.dbID("idSel_settingsDecimals").options[4].selected = "true";
}

function settingsCopyClick(obj = null) {
	if (obj === null) {
		KadUtils.dbID("idCb_settingsCopyClick").checked = globalValues.settings.copyClick; //set CB when loaded
	} else {
		globalValues.settings.copyClick = obj.checked;
	}
	KadUtils.DOM.enableBtn("idCb_settingsCopySeparator", globalValues.settings.copyClick); //disabel button, because it is not needed when you can not copy
}

function settingsCopySeparator(obj = null) {
	if (obj === null) {
		KadUtils.dbID("idCb_settingsCopySeparator").checked = globalValues.settings.copySeparator; //set CB when loaded
	} else {
		globalValues.settings.copySeparator = obj.checked;
	}
	KadUtils.dbID("idLbl_settingsCopySeparator").innerHTML = `Nummernformat: ' ${globalValues.copySeparatorSign} '`;
}

function settingsFontsize(obj = null) {
	if (obj === null) {
		const opt = globalValues.fontSizeArray.indexOf(Number(globalValues.settings.fontSize));
		KadUtils.dbID("idSel_settingsFontsize").options[opt].selected = true; //set FS when loaded
	} else {
		globalValues.settings.fontSize = obj.value;
	}
	KadUtils.CSS.setRoot("fontSize", globalValues.settings.fontSize, "px");
	colorUpdateCanvascolors(true);
	layoutResizeGrid();
}

function settingsDecimals(obj = null) {
	if (obj === null) {
		const opt = globalValues.decimalsArray.indexOf(Number(globalValues.settings.decimals));
		KadUtils.dbID("idSel_settingsDecimals").options[opt].selected = true; //set CB when loaded
	} else {
		globalValues.settings.decimals = obj.value;
		alert("Änderung wird erst bei Neuberechnung übernommen!");
	}
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------

function clear_cl_ColorSettings() {
	globalValues.colors.lightmode = KadUtils.deepClone(globalValues.colors.colorSettingsOrig.lightmode);
	globalValues.colors.darkmode = KadUtils.deepClone(globalValues.colors.colorSettingsOrig.darkmode);
	displayColorSystem();
	populateColorSelector();
}

const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
darkModeMediaQuery.addEventListener("change", (e) => {
	globalValues.colors.darkmodeOn = e.matches;
	displayColorSystem();
});

function displayColorSystem() {
	// let theme = globalValues.colors.modeName;
	for (let theme of ["light", "dark"]) {
		for (let [name, col] of Object.entries(globalValues.colors[`${theme}mode`])) {
			const selID = `idLbl_colorSetting_${theme}_${name}`;
			KadUtils.dbIDStyle(selID).background = KadUtils.Color.formatAsCSS(col, "HSL");
			KadUtils.dbIDStyle(selID).color = KadUtils.Color.stateAsCSS(col, "HSL");
			if (globalValues.colors.modeName == theme) {
				KadUtils.CSS.setRoot(`bgc${name}`, KadUtils.Color.formatAsString(col, "HSL"));
				KadUtils.CSS.setRoot(`txt${name}`, KadUtils.Color.stateAsString(col, "HSL"));
				KadUtils.CSS.setRoot(`inv${name}`, KadUtils.Color.stateAsBool(col, "HSL"));
			}
		}
	}
	colToggleColormode();
	setTimeout(() => {
		colorUpdateCanvascolors(true);
	}, KadUtils.CSS.getRoot("transitionTimeName", true) * 1000);
}

function populateColorSelector() {
	for (let theme of ["light", "dark"]) {
		for (const [name, col] of Object.entries(globalValues.colors[`${theme}mode`])) {
			KadUtils.dbID(`idLbl_colorSetting_${theme}_${name}`).textContent = name;
			KadUtils.dbID(`idVin_colorSetting_${theme}_${name}`).value = KadUtils.Color.colAsString(col, "HSL", "HEX");
		}
	}
}

function colorChange(obj) {
	const theme = obj.dataset.theme;
	const name = obj.dataset.name;
	globalValues.colors[`${theme}mode`][name] = KadUtils.Color.colAsArray(obj.value, "HEX", "HSL");
	const col = globalValues.colors[`${theme}mode`][name];
	KadUtils.CSS.setRoot(`bgc${name}`, KadUtils.Color.formatAsString(col, "HSL"));
	KadUtils.CSS.setRoot(`txt${name}`, KadUtils.Color.stateAsString(col, "HSL"));
	KadUtils.CSS.setRoot(`inv${name}`, KadUtils.Color.stateAsBool(col, "HSL"));

	KadUtils.dbIDStyle(`idLbl_colorSetting_${theme}_${name}`).background = KadUtils.Color.formatAsCSS(col, "HSL");
	KadUtils.dbIDStyle(`idLbl_colorSetting_${theme}_${name}`).color = KadUtils.Color.stateAsCSS(col, "HSL");
	KadUtils.dbID(`idVin_colorSetting_${theme}_${name}`).value = obj.value;
	colorUpdateCanvascolors(true);
}

function colorUpdateCanvascolors(change = null) {
	if (change != null) {
		redrawCanvases();
	}
}

function colToggleColormode(btn = null) {
	if (btn === null) {
		KadUtils.dbID("idImg_userNav_colormode").src = KadUtils.DOM.getImgPath(globalValues.colors.darkmodeOn ? "sun" : "moon");
		return;
	}
	globalValues.colors.darkmodeOn = !globalValues.colors.darkmodeOn;
	displayColorSystem();
}
