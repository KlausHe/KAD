import { Data_Materials } from "../KadData/KadDataMaterial.js";
import { dbID, initEL, KadArray, KadDOM, KadTable, KadValue } from "../KadUtils/KadUtils.js";
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
    compare: null,
    deltaExpansion: [],
  },
  get expansionPopulateSelection() {
    return {
      "selected Materials": materialOptions.matList.filter((matName) => Data_Materials.Materials[matName].expansion).map((name) => [name, name]),
      "general Materials": Object.keys(Data_Materials.Materials)
        .filter((matName) => Data_Materials.Materials[matName].expansion != undefined)
        .map((name) => [name, name]),
    };
  },
};

initEL({
  id: idSel_expansionMaterialA,
  fn: expansionEntryMaterial,
});
initEL({
  id: idSel_expansionMaterialB,
  fn: expansionEntryMaterial,
});
initEL({ id: idSel_expansionMaterialA, action: "focus", fn: expansionUpdateOptions }, { once: true });
initEL({ id: idSel_expansionMaterialB, action: "focus", fn: expansionUpdateOptions }, { once: true });

initEL({ id: idBtn_expansionMaterialSwitch, fn: expansionSwitch });
initEL({ id: idBtn_expansionLength, fn: expansionEntryLength });
initEL({ id: idBtn_expansionBaseTemperature, fn: expansionEntryBaseTemperature });
initEL({ id: idBtn_expansionTemperature, fn: expansionEntryTemperature });
initEL({ id: idCb_expansionDifference, fn: expansionDifference });
initEL({ id: idCb_expansionCoefficient, fn: expansionCoefficient, resetValue: false });

initEL({ id: idVin_expansionLength, resetValue: expansionOptions.lengthOrig[0] });
initEL({ id: idVin_expansionTemperature, resetValue: expansionOptions.tempsOrig[0] });
initEL({ id: idVin_expansionBaseTemperature, resetValue: expansionOptions.baseTemp });

export function clear_cl_Expansion() {
  idVin_expansionLength.KadReset();
  idVin_expansionTemperature.KadReset();
  idVin_expansionBaseTemperature.KadReset();
  idCb_expansionCoefficient.KadReset();
  expansionOptions.exLength = [...expansionOptions.lengthOrig];
  expansionOptions.exTemp = [...expansionOptions.tempsOrig];
  idSel_expansionMaterialA.KadReset({ selGroup: expansionOptions.expansionPopulateSelection, selStartIndex: expansionOptions.materials.matAOrig });
  idSel_expansionMaterialB.KadReset({ selGroup: expansionOptions.expansionPopulateSelection, selStartIndex: expansionOptions.materials.matBOrig });
  expansionEntryMaterial();
}

export function expansionUpdateMassDependecy() {
  expansionUpdateOptions();
}

export function expansionUpdateOptions() {
  const tempSelA = idSel_expansionMaterialA.selectedIndex || 1;
  const tempSelB = idSel_expansionMaterialB.selectedIndex || 2;
  idSel_expansionMaterialA.KadReset({ selGroup: expansionOptions.expansionPopulateSelection, selStartIndex: tempSelA });
  idSel_expansionMaterialB.KadReset({ selGroup: expansionOptions.expansionPopulateSelection, selStartIndex: tempSelB });
}

function expansionSwitch() {
  const tempSelB = idSel_expansionMaterialB.selectedIndex;
  const tempSelA = idSel_expansionMaterialA.selectedIndex;
  if (tempSelB < 0) return;
  idSel_expansionMaterialA.options[tempSelB].selected = true;
  idSel_expansionMaterialB.options[tempSelA].selected = true;
  expansionEntryMaterial();
}

function expansionEntryMaterial() {
  expansionOptions.materials.matA = idSel_expansionMaterialA.KadGet();
  expansionOptions.materials.matB = idSel_expansionMaterialB.KadGet();
  expansionOptions.materials.compare = expansionOptions.materials.matB == 0 || expansionOptions.materials.matA === expansionOptions.materials.matB ? false : true;
  KadDOM.enableBtn(idCb_expansionDifference, !expansionOptions.materials.compare);

  const cbEntry = dbID("idLbl_expansionDifference").textContent;
  dbID("idLbl_expansionDifference").innerHTML = expansionOptions.materials.compare ? `<del>${cbEntry}</del>` : cbEntry;

  expansionCalc();
}

function expansionEntryLength() {
  const val = Number(dbID("idVin_expansionLength").value);
  if (!expansionOptions.exLength.includes(val)) {
    expansionOptions.exLength.push(val);
    expansionOptions.exLength.sort((a, b) => {
      return a - b;
    });
    expansionCalc();
  }
}

function expansionEntryBaseTemperature() {
  expansionOptions.baseTemp = Number(dbID("idVin_expansionBaseTemperature").value);
  expansionCalc();
}

function expansionEntryTemperature() {
  const val = Number(dbID("idVin_expansionTemperature").value);
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

function expansionCalc() {
  const checkedLength = idCb_expansionDifference.checked;
  const checkedCoeff = idCb_expansionCoefficient.checked;
  expansionOptions.materials.deltaExpansion = [];
  for (let t = 0; t < expansionOptions.exTemp.length; t++) {
    const dT = expansionOptions.exTemp[t] - expansionOptions.baseTemp;
    expansionOptions.materials.deltaExpansion[t] = [];
    for (let l = 0; l < expansionOptions.exLength.length; l++) {
      const tempA = Object.keys(Data_Materials.Materials[expansionOptions.materials.matA].expansion);
      const selTempA = KadArray.getNearestValueInArray(tempA, expansionOptions.exTemp[t]);
      const alphaA = Number(Data_Materials.Materials[expansionOptions.materials.matA].expansion[selTempA]);
      const addLength = checkedLength ? 0 : expansionOptions.exLength[l];
      const dLA = alphaA * dT * expansionOptions.exLength[l] * 0.000001 + addLength;
      let dLB = 0;
      let alphaB = 0;
      if (expansionOptions.materials.compare) {
        const tempB = Object.keys(Data_Materials.Materials[expansionOptions.materials.matB].expansion);
        const selTempB = KadArray.getNearestValueInArray(tempB, expansionOptions.exTemp[t]);
        alphaB = Number(Data_Materials.Materials[expansionOptions.materials.matB].expansion[selTempB]);
        dLB = alphaB * dT * expansionOptions.exLength[l] * 0.000001 + addLength;
      }
      if (checkedCoeff) {
        if (expansionOptions.materials.compare) {
          expansionOptions.materials.deltaExpansion[t].push(`${alphaA} / ${alphaB}`);
        } else {
          expansionOptions.materials.deltaExpansion[t].push(KadValue.number(alphaA, { decimals: 1 }));
        }
      } else {
        expansionOptions.materials.deltaExpansion[t].push(KadValue.number(dLA - dLB, { decimals: 3 }));
      }
    }
  }
  build_ExpansionTable();
}

//Hauptliste mit Werkstoffdaten ersetllen!!!
function build_ExpansionTable() {
  if (expansionOptions.exTemp.length === 0) expansionOptions.exTemp = [...expansionOptions.tempsOrig];
  // if (expansionOptions.exTemp.length === 0) {
  // 	contentGrid.cl_Expansion.width = 1;
  // 	layoutNavClick();
  // } else if (expansionOptions.exTemp.length > 7 && contentGrid.cl_Expansion.width == 1) {
  // 	contentGrid.cl_Expansion.width = 2;
  // 	layoutNavClick();
  // } else if (expansionOptions.exTemp.length <= 7 && contentGrid.cl_Expansion.width == 2) {
  // 	contentGrid.cl_Expansion.width = 1;
  // 	layoutNavClick();
  // }

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
