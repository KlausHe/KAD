import { dbID, dbIDStyle, deepClone, initEL, KadColor, KadCSS, KadDOM, KadString } from "../KadUtils/KadUtils.js";
import * as Canvas from "../MainModulesCanvas.js";

const colorSettingsOptions = {
  modeNames: ["light", "dark"],
  colorAreas: ["Navbar", "Gridtitle", "Background"],
  defaultMode: ["automatic", "light", "dark"],
  selectedDefaultModeIndex: 0,
  get currentMode() {
    return globalColors.darkmodeOn ? colorSettingsOptions.modeNames[1] : colorSettingsOptions.modeNames[0];
  },
  get mode() {
    return globalColors.darkmodeOn ? this.dark : this.light;
  },
  light: {
    Navbar: [240, 52, 54],
    Gridtitle: [240, 52, 54],
    Background: [100, 5, 89], //[52, 53, 70]
  },
  dark: {
    Navbar: [223, 11, 18],
    Gridtitle: [180, 25, 24],
    Background: [180, 25, 24],
  },
  modesOrig: {
    light: {
      Navbar: [240, 52, 54],
      Gridtitle: [240, 52, 54],
      Background: [100, 5, 89], //[52, 53, 70]
    },
    dark: {
      Navbar: [223, 11, 18],
      Gridtitle: [180, 25, 24],
      Background: [180, 25, 24],
    },
  },
};

export const globalColors = {
  darkmodeOn: false,
  elements: {
    get background() {
      return [...colorSettingsOptions.mode.Background];
    },
    get baseColor() {
      return [...colorSettingsOptions.mode.Navbar];
    },
    get text() {
      return [...KadColor.stateAsArray({ colorArray: colorSettingsOptions.mode.Background, type: "HSL" })];
    },
    get textNavbar() {
      return [...KadColor.stateAsArray({ colorArray: colorSettingsOptions.mode.Background, type: "HSL" })];
    },
    get line() {
      return [...KadColor.stateAsArray({ colorArray: colorSettingsOptions.mode.Background, type: "HSL" })];
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
  colorOptionsFull: [
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
  get colorOptions() {
    return globalColors.colorOptionsFull.slice(5);
  },
};

initEL({ id: idSel_colorSettingsDefault, fn: colorDefaultMode, selList: colorSettingsOptions.defaultMode.map((l) => [KadString.firstLetterCap(l), l]) });
for (let area of colorSettingsOptions.colorAreas) {
  for (let mode of colorSettingsOptions.modeNames) {
    initEL({
      id: dbID(`idVin_colorSetting_${mode}_${area}`),
      action: "input",
      fn: colorChange,
      dataset: [
        ["mode", mode],
        ["area", area],
      ],
      resetValue: KadColor.colAsString({ colorArray: colorSettingsOptions.modesOrig[mode][area], from: "HSL", to: "HEX" }),
    });
    initEL({
      id: dbID(`idLbl_colorSetting_${mode}_${area}`),
      action: "input",
      fn: colorChange,
      dataset: [
        ["mode", mode],
        ["area", area],
      ],
      resetValue: KadColor.colAsString({ colorArray: colorSettingsOptions.modesOrig[mode][area], from: "HSL", to: "HEX" }),
    });
  }
}

if (window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: darkmode)").addEventListener("change", (event) => {
    colorDefaultMode();
  });
}

export function clear_cl_ColorSettings() {
  colorSettingsOptions.light = deepClone(colorSettingsOptions.modesOrig.light);
  colorSettingsOptions.dark = deepClone(colorSettingsOptions.modesOrig.dark);
  colorSettingsOptions.selectedDefaultModeIndex = 0;
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
    //#A9C7C6
    return {
      lightmode: deepClone(colorSettingsOptions.light),
      darkmode: deepClone(colorSettingsOptions.dark),
      selectedDefaultModeIndex: idSel_colorSettingsDefault.KadGet({ index: true }),
    };
  },
  set data(data) {
    if (data == null) {
      colorSettingsOptions.light = deepClone(colorSettingsOptions.modesOrig.light);
      colorSettingsOptions.dark = deepClone(colorSettingsOptions.modesOrig.dark);
      colorSettingsOptions.selectedDefaultModeIndex = 0;
      return;
    }
    colorSettingsOptions.light = deepClone(data.lightmode);
    colorSettingsOptions.dark = deepClone(data.darkmode);
    idSel_colorSettingsDefault.KadReset({ selStartIndex: data.selectedDefaultModeIndex });
    colorDefaultMode();
    populateColorSelector();
  },
};

export function colorThemeChanged() {
  idImg_userNav_colormode.src = KadDOM.getImgPath(globalColors.darkmodeOn ? "sun" : "moon");
  for (let theme of colorSettingsOptions.modeNames) {
    for (let [name, col] of Object.entries(colorSettingsOptions[theme])) {
      const selID = `idLbl_colorSetting_${theme}_${name}`;
      dbIDStyle(selID).background = KadColor.formatAsCSS({ colorArray: col, type: "HSL" });
      dbIDStyle(selID).color = KadColor.stateAsCSS({ colorArray: col, type: "HSL" });
      if (colorSettingsOptions.currentMode == theme) {
        KadCSS.setRoot({ variable: `bgc${name}`, value: KadColor.formatAsString({ colorArray: col, type: "HSL" }) });
        KadCSS.setRoot({ variable: `txt${name}`, value: KadColor.stateAsString({ colorArray: col, type: "HSL" }) });
        KadCSS.setRoot({ variable: `inv${name}`, value: KadColor.stateAsBool({ colorArray: col, type: "HSL" }) });
      }
    }
  }
  setTimeout(() => {
    colorUpdateCanvascolors();
  }, KadCSS.getRoot({ value: "transitionTimeName" }) * 500);
}
function colorDefaultMode() {
  colorSettingsOptions.selectedDefaultModeIndex = idSel_colorSettingsDefault.KadGet({ index: true });
  if (colorSettingsOptions.selectedDefaultModeIndex == 0) {
    globalColors.darkmodeOn = window.matchMedia("(prefers-color-scheme:dark)").matches;
  } else {
    globalColors.darkmodeOn = !!(colorSettingsOptions.selectedDefaultModeIndex - 1);
  }
  colorThemeChanged();
}
export function colToggleColormode() {
  globalColors.darkmodeOn = !globalColors.darkmodeOn;
  colorThemeChanged();
}

function populateColorSelector() {
  const optionStrings = globalColors.colorOptionsFull.map((c) => KadColor.colAsString({ colorArray: c, from: "HSL", to: "HEX" }));
  for (let area of colorSettingsOptions.colorAreas) {
    for (let mode of colorSettingsOptions.modeNames) {
      const color = KadColor.colAsString({ colorArray: colorSettingsOptions[mode][area], from: "HSL", to: "HEX" });
      dbID(`idVin_colorSetting_${mode}_${area}`).KadReset({ resetValue: color, dbList: optionStrings });
      dbID(`idLbl_colorSetting_${mode}_${area}`).KadSetText(`${area} (${color})`);
    }
  }
}

function colorChange(obj) {
  const mode = obj.target.dataset.mode;
  const area = obj.target.dataset.area;
  const hexColor = obj.target.value.toUpperCase();

  colorSettingsOptions[mode][area] = KadColor.colAsArray({ colorArray: hexColor, from: "HEX", to: "HSL" });
  const col = colorSettingsOptions[mode][area];
  dbIDStyle(`idLbl_colorSetting_${mode}_${area}`).background = KadColor.formatAsCSS({ colorArray: col, type: "HSL" });
  dbIDStyle(`idLbl_colorSetting_${mode}_${area}`).color = KadColor.stateAsCSS({ colorArray: col, type: "HSL" });
  dbID(`idLbl_colorSetting_${mode}_${area}`).KadSetText(`${area} (${hexColor})`);

  if (mode == colorSettingsOptions.currentMode) {
    KadCSS.setRoot({ variable: `bgc${area}`, value: KadColor.formatAsString({ colorArray: col, type: "HSL" }) });
    KadCSS.setRoot({ variable: `txt${area}`, value: KadColor.stateAsString({ colorArray: col, type: "HSL" }) });
    KadCSS.setRoot({ variable: `inv${area}`, value: KadColor.stateAsBool({ colorArray: col, type: "HSL" }) });
    colorUpdateCanvascolors();
  }
}

export function colorUpdateCanvascolors() {
  for (const canvasFunction of Object.values(Canvas)) {
    canvasFunction();
  }
}
