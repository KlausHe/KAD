import { dbID, daEL, KadCSS } from "../General/KadUtils.js";
import { contentGrid, resizeGrid } from "../General/Layout.js";

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
		decimals: 4,
		fontSize: 12,
	},
	fontSizeArray: [6, 8, 10, 11, 12, 14, 16, 18, 20, 24, 26, 32],
	decimalsArray: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	globalInput: {
		generateSpreadLists() {
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

daEL(idSel_settingsFontsize, "change", () => settingsFontsize(idSel_settingsFontsize));
daEL(idSel_settingsDecimals, "change", () => settingsDecimals(idSel_settingsDecimals));

export function clear_cl_GeneralSettings() {
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
			settingsFontsize();
			settingsDecimals();
		}
	},
};

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
