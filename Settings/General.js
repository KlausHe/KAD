import { dbID, initEL, KadCSS } from "../KadUtils/KadUtils.js";
import { contentGrid, resizeGrid } from "../General/Layout.js";
import { colorUpdateCanvascolors } from "./Color.js";

export const globalValues = {
	mediaSizes: {
		get size() {
			return KadCSS.getRoot(  { value: "UIHeight1", RemToPx: true });
		},
		get fontSize() {
			return KadCSS.getRoot({ value: "fontSize", RemToPx: true });
		},
		get radius() {
			return KadCSS.getRoot({ value: "UIRadius", RemToPx: true });
		},
		get divGridMinWidth() {
			return Math.floor(this.size * KadCSS.getRoot({ value: "divGridMinWidthFactor" }));
		},
		get gridMarginSide() {
			return Math.floor(this.size * KadCSS.getRoot({ value: "gridMarginSide" }));
		},
		get imgSize() {
			return KadCSS.getRoot({ value: "imgSize", RemToPx: true });
		},
		get canvasSize() {
			const val = KadCSS.getRoot({ value: "gridWidthGameCanvas", RemToPx: true });
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

initEL({ id: idSel_settingsFontsize, fn: settingsFontsize, selList: globalValues.fontSizeArray });
initEL({ id: idSel_settingsDecimals, fn: settingsDecimals, selStartIndex: 4, selList: globalValues.decimalsArray });

export function clear_cl_GeneralSettings() {
	idSel_settingsFontsize.KadReset();
	idSel_settingsDecimals.KadReset();
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
	if (obj != null) {
		globalValues.settings.fontSize = obj.target.value;
	} else {
		idSel_settingsFontsize.KadReset({ selStartValue: globalValues.settings.fontSize });
	}
	KadCSS.setRoot("fontSize", `${globalValues.settings.fontSize}px`);
	colorUpdateCanvascolors();
	resizeGrid();
}

function settingsDecimals(obj = null) {
	if (obj === null) {
		const opt = globalValues.decimalsArray.indexOf(Number(globalValues.settings.decimals));
		dbID("idSel_settingsDecimals").options[opt].selected = true; //set CB when loaded
	} else {
		globalValues.settings.decimals = obj.target.value;
		alert("Änderung wird erst bei Neuberechnung übernommen!");
	}
}
