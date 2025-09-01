import { Data_Materials } from "../KadData/KadData_Material.js";
import { dbID, initEL, KadArray, KadTable, KadValue } from "../KadUtils/KadUtils.js";
import { materialOptions } from "./Material.js";

const expansionOptions = {
  lengthOrig: [100, 200, 300, 400, 500],
  tempsOrig: [50, 100, 200, 300, 500],
  baseTemp: 20,
  exLength: [],
  exTemperatures: [],
  materials: {
    matAOrig: 0,
    matBOrig: 2,
    matA: null,
    matB: null,
    deltaExpansion: [],
  },
  get expansionPopulateSelection() {
    return {
      "selected Materials": materialOptions.matList.filter((matName) => Data_Materials.Materials[matName].expansion != undefined).map((name) => [name, name]),
      "general Materials": Object.keys(Data_Materials.Materials)
        .filter((matName) => Data_Materials.Materials[matName].expansion != undefined)
        .map((name) => [name, name]),
    };
  },
  compareIndex: 0,
  compareOptions: ["Vergleich", "Berechne A", "Berechne B"],
};

initEL({ id: dbID("idSel_expansionMaterialA"), action: "focus", fn: expansionUpdateOptions }, { once: true });
initEL({ id: dbID("idSel_expansionMaterialB"), action: "focus", fn: expansionUpdateOptions }, { once: true });
initEL({ id: dbID("idSel_expansionMaterialA"), fn: expansionEntryMaterial, selStartIndex: expansionOptions.materials.matAOrig });
initEL({ id: dbID("idSel_expansionMaterialB"), fn: expansionEntryMaterial, selStartIndex: expansionOptions.materials.matBOrig });
initEL({ id: dbID("idBtn_expansionMaterialSwitch"), fn: expansionSwitch });
initEL({ id: dbID("idBtn_expansionLength"), fn: expansionEntryLength });
initEL({ id: dbID("idBtn_expansionBaseTemperature"), fn: expansionEntryBaseTemperature });
initEL({ id: dbID("idBtn_expansionTemperature"), fn: expansionEntryTemperature });
initEL({ id: dbID("idCb_expansionDifference"), fn: expansionDifference });
initEL({ id: dbID("idCb_expansionCoefficient"), fn: expansionCoefficient, resetValue: false });
initEL({ id: dbID("idSel_expansionCompare"), fn: expansionToggelCompare, selList: expansionOptions.compareOptions, selStartIndex: 0 });
initEL({ id: dbID("idVin_expansionLength"), resetValue: expansionOptions.lengthOrig[0] });
initEL({ id: dbID("idVin_expansionTemperature"), resetValue: expansionOptions.tempsOrig[0] });
initEL({ id: dbID("idVin_expansionBaseTemperature"), resetValue: expansionOptions.baseTemp });
initEL({ id: dbID("idLbl_expansionDifference") });
initEL({ id: dbID("idLbl_expansionCoefficient") });

export function clear_cl_Expansion() {
  dbID("idVin_expansionLength").KadReset();
  dbID("idVin_expansionTemperature").KadReset();
  dbID("idVin_expansionBaseTemperature").KadReset();
  dbID("idCb_expansionCoefficient").KadReset();
  dbID("idLbl_expansionDifference").KadReset();
  dbID("idLbl_expansionCoefficient").KadReset();
  dbID("idLbl_expansionDifference").KadSetHTML("Zeige &#x0394;l [mm]");
  dbID("idLbl_expansionCoefficient").KadSetHTML("Zeige &#x03B1;<sub>T</sub> [K<sup>-1</sup>]");
  expansionOptions.exLength = [...expansionOptions.lengthOrig];
  expansionOptions.exTemp = [...expansionOptions.tempsOrig];
}

export function expansionUpdateMassDependecy() {
  expansionUpdateOptions();
}

export function expansionUpdateOptions() {
  dbID("idSel_expansionMaterialA").KadReset({ selGroup: expansionOptions.expansionPopulateSelection });
  dbID("idSel_expansionMaterialB").KadReset({ selGroup: expansionOptions.expansionPopulateSelection });
  expansionEntryMaterial();
}

function expansionSwitch() {
  const tempSelA = dbID("idSel_expansionMaterialA").selectedIndex;
  const tempSelB = dbID("idSel_expansionMaterialB").selectedIndex;
  dbID("idSel_expansionMaterialA").options[tempSelB].selected = true;
  dbID("idSel_expansionMaterialB").options[tempSelA].selected = true;
  expansionEntryMaterial();
}

function expansionEntryMaterial() {
  expansionOptions.materials.matA = dbID("idSel_expansionMaterialA").KadGet();
  expansionOptions.materials.matB = dbID("idSel_expansionMaterialB").KadGet();
  dbID("idSel_expansionCompare")[1].textContent = `Berechne ${expansionOptions.materials.matA}`;
  dbID("idSel_expansionCompare")[2].textContent = `Berechne ${expansionOptions.materials.matB}`;
  expansionCalc();
}

function expansionEntryLength() {
  const val = dbID("idVin_expansionLength").KadGet();
  if (!expansionOptions.exLength.includes(val)) {
    expansionOptions.exLength.push(val);
    expansionOptions.exLength.sort((a, b) => {
      return a - b;
    });
    expansionCalc();
  }
}

function expansionEntryBaseTemperature() {
  expansionOptions.baseTemp = dbID("idVin_expansionBaseTemperature").KadGet();
  expansionCalc();
}

function expansionEntryTemperature() {
  const val = dbID("idVin_expansionTemperature").KadGet();
  if (!expansionOptions.exTemp.includes(val)) {
    expansionOptions.exTemp.push(val);
    expansionOptions.exTemp.sort((a, b) => {
      return a - b;
    });
    expansionCalc();
  }
}

function expansionDifference() {
  expansionCalc();
}

function expansionCoefficient() {
  expansionCalc();
}

function expansionToggelCompare() {
  expansionOptions.compareIndex = dbID("idSel_expansionCompare").KadGet({ index: true });
  expansionCalc();
}

function expansionEnableDelatLength(state) {
  dbID("idCb_expansionDifference").KadEnable(state);
  dbID("idLbl_expansionDifference").KadEnable(state);
}

function expansionCalc() {
  expansionOptions.materials.deltaExpansion = [];
  for (let t = 0; t < expansionOptions.exTemp.length; t++) {
    const dT = expansionOptions.exTemp[t] - expansionOptions.baseTemp;
    expansionOptions.materials.deltaExpansion[t] = [];
    for (let l = 0; l < expansionOptions.exLength.length; l++) {
      const tempA = Object.keys(Data_Materials.Materials[expansionOptions.materials.matA].expansion);
      const selTempA = KadArray.getNearestValueInArray(tempA, expansionOptions.exTemp[t]);
      const alphaA = Number(Data_Materials.Materials[expansionOptions.materials.matA].expansion[selTempA]);
      let dLA = alphaA * dT * expansionOptions.exLength[l] * 0.000001;

      const tempB = Object.keys(Data_Materials.Materials[expansionOptions.materials.matB].expansion);
      const selTempB = KadArray.getNearestValueInArray(tempB, expansionOptions.exTemp[t]);
      const alphaB = Number(Data_Materials.Materials[expansionOptions.materials.matB].expansion[selTempB]);
      let dLB = alphaB * dT * expansionOptions.exLength[l] * 0.000001;

      if (dbID("idCb_expansionDifference").checked) {
        dLA += expansionOptions.exLength[l];
        dLB += expansionOptions.exLength[l];
      }

      let value = 0;
      const showCoefficient = dbID("idCb_expansionCoefficient").checked;
      switch (expansionOptions.compareIndex) {
        case 0:
          expansionEnableDelatLength(false);
          value = showCoefficient ? `${alphaA} / ${alphaB}` : KadValue.number(dLA - dLB, { decimals: 3 });
          break;
        case 1:
          expansionEnableDelatLength(true);
          value = showCoefficient ? KadValue.number(alphaA, { decimals: 1 }) : KadValue.number(dLA, { decimals: 3 });
          break;
        case 2:
          expansionEnableDelatLength(true);
          value = showCoefficient ? KadValue.number(alphaB, { decimals: 1 }) : KadValue.number(dLB, { decimals: 3 });
          break;
      }

      expansionOptions.materials.deltaExpansion[t].push(value);
    }
  }
  build_ExpansionTable();
}

//Hauptliste mit Werkstoffdaten ersetllen!!!
function build_ExpansionTable() {
  if (expansionOptions.exTemp.length === 0) expansionOptions.exTemp = [...expansionOptions.tempsOrig];

  KadTable.clear("idTabHeader_ExpansionList");
  const headerRow = KadTable.createRow("idTabHeader_ExpansionList");

  let headCell = document.createElement("th");
  if (expansionOptions.materials.compare) {
    headCell.innerHTML = `${expansionOptions.materials.matA} / ${expansionOptions.materials.matB}`;
  } else {
    headCell.innerHTML = expansionOptions.materials.matA;
  }
  headerRow.appendChild(headCell);
  //create Header
  for (let n = 0; n < expansionOptions.exTemp.length; n++) {
    KadTable.addHeaderCell(headerRow, {
      names: ["expansionHeaderTemp", n],
      type: "Lbl",
      text: `${expansionOptions.exTemp[n]} C`,
      style: {
        cursor: "not-allowed",
      },
      onclick: () => {
        expansionOptions.exTemp.splice(expansionOptions.exTemp.indexOf(expansionOptions.exTemp[n]), 1);
        expansionCalc();
      },
    });
  }
  //clear list
  KadTable.clear("idTabBody_ExpansionList");
  for (let i = 0; i < expansionOptions.exLength.length; i++) {
    const row = KadTable.createRow("idTabBody_ExpansionList");
    KadTable.addHeaderCell(row, {
      names: ["expansionHeaderLength", i],
      type: "Lbl",
      text: `${expansionOptions.exLength[i]} mm`,
      createCellClass: ["clTab_borderThickRight"],
      style: {
        cursor: "not-allowed",
      },
      onclick: () => {
        expansionOptions.exLength.splice(expansionOptions.exLength.indexOf(expansionOptions.exLength[i]), 1);
        expansionCalc();
      },
    });
    for (let t = 0; t < expansionOptions.exTemp.length; t++) {
      KadTable.addCell(row, {
        names: ["expansionVal", t, i],
        type: "Lbl",
        text: expansionOptions.materials.deltaExpansion[t][i],
        createCellClass: ["clTab_UIBorderThinRight"],
        cellStyle: {
          textAlign: "center",
        },
        copy: true,
      });
    }
  }
}
