import { resizeGrid } from "../General/Layout.js";
import { dbID, initEL, KadCSS } from "../KadUtils/KadUtils.js";
import { colorUpdateCanvascolors } from "./Color.js";

export const globalValues = {
  mediaSizes: {
    get size() {
      return KadCSS.getRoot({ value: "UIHeight1", RemToPx: true });
    },
    get fontSize() {
      return KadCSS.getRoot({ value: "fontSize", RemToPx: true });
    },
    get radius() {
      return KadCSS.getRoot({ value: "UIRadius", RemToPx: true });
    },
    get divGridMinWidth() {
      const factor = KadCSS.getRoot({ value: "divGridMinWidthFactor" });
      return Math.floor(this.size * factor);
    },
    get gridMarginSide() {
      const factor = KadCSS.getRoot({ value: "gridMarginSide" });
      return Math.floor(this.size * factor);
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
};

initEL({ id: dbID("idSel_settingsFontsize"), fn: settingsFontsize, selList: globalValues.fontSizeArray });
initEL({ id: dbID("idSel_settingsDecimals"), fn: settingsDecimals, selStartIndex: 4, selList: globalValues.decimalsArray });

export function clear_cl_GeneralSettings() {
  dbID("idSel_settingsFontsize").KadReset();
  dbID("idSel_settingsDecimals").KadReset();
}

export const storage_cl_GeneralSettings = {
  dbName: "GeneralSettings",
  contentName: "cl_GeneralSettings",
  clear() {
    this.data = {
      decimals: 4,
      fontSize: 12,
    };
  },
  getData() {
    return globalValues.settings;
  },
  saveData(data) {
    for (const key of Object.keys(globalValues.settings)) {
      if (key == "clear") continue;
      globalValues.settings[key] = data[key];
    }
  },
  activateData() {
    settingsFontsize();
    settingsDecimals();
  },
};

function settingsFontsize(obj = null) {
  if (obj != null) {
    globalValues.settings.fontSize = obj.target.value;
  } else {
    dbID("idSel_settingsFontsize").KadReset({ selStartValue: globalValues.settings.fontSize });
  }
  KadCSS.setRoot({ variable: "fontSize", value: globalValues.settings.fontSize, dim: "px" });
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
