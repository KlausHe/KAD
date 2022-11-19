const globalValues = {
  mediaSizes: {
    divGridMinWidth: 0,
    canvasScale: 0,
    imgSize: 0
  },
  settings: { //for Start only
    copyClick: true,
    copySeparator: true,
    decimals: 4,
    fontSize: 12
  },
  get copySeparatorText() {
    return (this.settings.copySeparator) ? "." : ","
  },
  fontSizeArray: [6, 8, 10, 11, 12, 14, 16, 18, 20, 24, 26, 32],
  decimalsArray: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  get hostDebug() {
    return ["local", "127.0.0.1"].some(s => window.location.hostname.includes(s))
  },
  intervalJSON: (1000 * 60 * 60 * 1), // 1000 millis * 60 sec * 60 minutes * 2 hours
  colors: {
    darkmodeOn: false,
    get mode() {
      return (this.darkmodeOn) ? this.darkmode : this.lightmode
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
      [275, 52, 54]
    ],
    colorSettingsOrig: { //originalData
      lightmode: {
        Navbar: [240, 52, 54],
        Gridtitle: [240, 52, 54],
        Background: [100, 5, 89] //[52, 53, 70]
      },
      darkmode: {
        Navbar: [223, 11, 18],
        Gridtitle: [180, 25, 24],
        Background: [180, 25, 24]
      }
    },
    lightmode: { //for Start only
      Navbar: [240, 52, 54],
      Gridtitle: [240, 52, 54],
      Background: [100, 5, 89] //[52, 53, 70]
    },
    darkmode: {
      Navbar: [223, 11, 18],
      Gridtitle: [180, 25, 24],
      Background: [180, 25, 24]
    },
    elements: {
      get background() {
        return [...globalValues.colors.mode.Background];
      },
      get baseColor() {
        return [...globalValues.colors.mode.Navbar];
      },
      get text() {
        return [...colStateToHSL(globalValues.colors.mode.Background)];
      },
      get textNavbar() {
        return [...colStateToHSL(globalValues.colors.mode.Background)];
      },
      get line() {
        return [...colStateToHSL(globalValues.colors.mode.Background)];
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
      }
    }
  },
  globalInput: {
    input: null,
    get value() {
      return this.input;
    },
    set value(v) {
      let val = v.trim();
      if (val == "") {
        this.input = "";
      } else {
        this.input = (isNaN(val)) ? val : Number(val);
      }
      this.spreadVal();
    },
    spreadVal() {
      const idArrays = {
        strings: ["idVin_howaEntry", "idArea_tugasEntry", "idVin_newsKeyword", "idVin_wikiInput", "idArea_thiontuInputEntry", "idVin_kaihangaEntry", "idVin_analysisEntry", "idVin_synonymEntry"],
        numerical: ["idVin_IomlaidCur", "idVin_Area_0", "idVin_expansionLength", "idVin_Pattern0", "idVin_luasDiameter", "idVin_middleA", "idVin_Pytho_0", "idVin_quickkmathVal", "idVin_ranjeVal"]
      };
      const val = this.value;
      const idDrivers = {
        get strings() {
          return isNaN(val) //change string inputs
        },
        get numerical() {
          return !isNaN(val) //change numerical inputs
        }
      }
      //fill the used TYPE
      for (const id of idArrays.strings) {
        const obj = dbID(id);
        obj.value = idDrivers.strings ? this.value : "";
        obj.dispatchEvent(new Event("input"));
      };
      for (const id of idArrays.numerical) {
        const obj = dbID(id);
        obj.value = idDrivers.numerical ? this.value : "";
        obj.dispatchEvent(new Event("input"));
      };
    }
  }
}

function clear_cl_GeneralSettings() {
  settingsCopySeparator();
  //populate TextSize Options
  for (let i = 0; i < globalValues.fontSizeArray.length; i++) {
    dbID("idSel_settingsFontsize").options[i] = new Option(globalValues.fontSizeArray[i], globalValues.fontSizeArray[i]);
  };
  dbID("idSel_settingsFontsize").options[4].selected = "true";

  //populate Decimals Options
  for (let i = 0; i < globalValues.decimalsArray.length; i++) {
    dbID("idSel_settingsDecimals").options[i] = new Option(globalValues.decimalsArray[i], globalValues.decimalsArray[i]);
  };
  dbID("idSel_settingsDecimals").options[4].selected = "true";
};

function settingsCopyClick(obj = null) {
  if (obj === null) {
    dbID("idCb_settingsCopyClick").checked = globalValues.settings.copyClick; //set CB when loaded
  } else {
    globalValues.settings.copyClick = obj.checked;
  }
  enableBtn("idCb_settingsCopySeparator", globalValues.settings.copyClick); //disabel button, because it is not needed when you can not copy
};

function settingsCopySeparator(obj = null) {
  if (obj === null) {
    dbID("idCb_settingsCopySeparator").checked = globalValues.settings.copySeparator; //set CB when loaded
  } else {
    globalValues.settings.copySeparator = obj.checked;
  }
  dbID("idLbl_settingsCopySeparator").innerHTML = `Trennzeichen: ' ${globalValues.copySeparatorText} '`;
};

function settingsFontsize(obj = null) {
  if (obj === null) {
    const opt = globalValues.fontSizeArray.indexOf(globalValues.settings.fontSize)
    dbID("idSel_settingsFontsize").options[opt].selected = true; //set CB when loaded
  } else {
    globalValues.settings.fontSize = obj.value;
  };
  setCssRoot("fontSize", globalValues.settings.fontSize, "px");
  colorUpdateCanvascolors(true);
  layoutResizeGrid();
};

function settingsDecimals(obj = null) {
  if (obj === null) {
    const opt = globalValues.decimalsArray.indexOf(globalValues.settings.decimals)
    dbID("idSel_settingsDecimals").options[opt].selected = true; //set CB when loaded
  } else {
    globalValues.settings.decimals = obj.value;
    alert("Änderung wird erst bei Neuberechnung übernommen!")
  };
};

//-------------------------------------------------------------------------------------------------------------------------------------------------------------

function clear_cl_ColorSettings() {
  globalValues.colors.lightmode = deepClone(globalValues.colors.colorSettingsOrig.lightmode);
  globalValues.colors.darkmode = deepClone(globalValues.colors.colorSettingsOrig.darkmode);
  displayColorSystem();
  populateColorSelector();
};

// detect Dark/Light-Mode changes
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addListener((e) => {
  globalValues.colors.darkmodeOn = e.matches;
  displayColorSystem();
});

//colorFuntionality
function displayColorSystem() {
  for (let [name, col] of Object.entries(globalValues.colors.mode)) {
    const selID = `idLbl_colorSetting_${name}`;
    const colString = colorReturnFormat(col, {
      type: "hsl"
    });
    const textString = colorReturnFormat(colStateToHSL(col), {
      type: "hsl"
    });
    dbIDStyle(selID).background = colorReturnFormat(col, {
      type: "hsl",
      text: true
    });;
    dbIDStyle(selID).color = colorReturnFormat(colStateToHSL(col), {
      type: "hsl",
      text: true
    });;
    setCssRoot(`bgc${name}`, colString);
    setCssRoot(`txt${name}`, textString);
    setCssRoot(`inv${name}`, colStateHSL(col));
  };
  colToggleColormode();
  setTimeout(() => {
    colorUpdateCanvascolors(true)
  }, getCssRoot("transitionTimeName", true) * 1000)
};

function populateColorSelector() {
  for (const [name, values] of Object.entries(globalValues.colors.mode)) {
    // set the Buttons Text
    dbID(`idLbl_colorSetting_${name}`).textContent = name;
    const colString = colHSLtoHEX(values, {
      type: "hex"
    });
    dbID(`idVin_colorSetting_${name}`).value = colString;
  };
};

function colorChange(obj) {
  const name = obj.dataset.name;
  const colHEX = obj.value;
  const colHSL = colHEXtoHSL(colHEX);
  const colString = colorReturnFormat(colHSL, {
    type: "hsl",
    text: true
  });
  const textString = colorReturnFormat(colStateToHSL(colHSL), {
    type: "hsl",
    text: true
  });
  const invString = colStateHSL(colHSL);

  setCssRoot(`bgc${name}`, colorReturnFormat(colHSL, {
    type: "hsl"
  }));
  setCssRoot(`txt${name}`, colorReturnFormat(colStateToHSL(colHSL), {
    type: "hsl"
  }));
  setCssRoot(`inv${name}`, invString);

  globalValues.colors.mode[name] = colHSL;

  dbIDStyle(`idLbl_colorSetting_${name}`).background = colString;
  dbIDStyle(`idLbl_colorSetting_${name}`).color = textString;
  dbID(`idVin_colorSetting_${name}`).value = colHEX;
  colorUpdateCanvascolors(true);
};

function colorUpdateCanvascolors(change = null) {
  if (change != null) {
    redrawCanvases();
  };
};

function colToggleColormode(btn = null) {
  if (btn === null) {
    dbID("idImg_userNav_colormode").src = imgPath(globalValues.colors.darkmodeOn ? "sun" : "moon");
    return
  }
  globalValues.colors.darkmodeOn = !globalValues.colors.darkmodeOn;
  displayColorSystem();
}