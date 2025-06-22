import { Data_Materials } from "../KadData/KadData_Material.js";
import { dbID, KadTable } from "../KadUtils/KadUtils.js";
import { materialSelectedTable } from "../Tools/Material.js";
export const materialFilterOptions = {
  listOrig: ["WName", "WNr", "matGroup", "R_eR_p2", "R_m", "S_b_W", "A"],
  select: [],
};

export function clear_cl_MaterialFilterSettings() {
  materialFilterOptions.select = [...materialFilterOptions.listOrig];
  materialFilterBuildTable();
  materialSelectedTable();
}

export const storage_cl_MaterialFilterSettings = {
  dbName: "MaterialFilterSettings",
  contentName: "cl_MaterialFilterSettings",
  clear() {
    for (const dataPoint of materialFilterOptions.listOrig) {
      materialFilterOptions.select.push(dataPoint);
    }
  },
  getData() {
    return [...materialFilterOptions.select];
  },
  saveData(data) {
    let filteredWrong = [];
    materialFilterOptions.select = [];
    for (const dataPoint of data) {
      if (Object.keys(Data_Materials.metadata).includes(dataPoint)) {
        materialFilterOptions.select.push(dataPoint);
      } else {
        filteredWrong.push(dataPoint);
      }
    }
    if (filteredWrong.length > 0) console.log("The following Filters are no longer supported:", filteredWrong);
  },
  activateData() {
    materialFilterBuildTable();
    materialFilterUpdateCB();
    materialSelectedTable();
  },
};

//Hauptliste mit Werkstoffdaten ersetllen!!!
function materialFilterBuildTable() {
  const header = [{ data: "Verfügbare Materialeigenschaften", colSpan: 3, settings: { align: "center" } }];
  const body = [
    {
      type: "Checkbox",
      data: Object.keys(Data_Materials.metadata).map((item) => materialFilterOptions.select.includes(item)),
      settings: {
        onclick: materialFilterChoices,
        names: ["materialFilter"],
        noBorder: "right",
      },
    },
    { data: Object.keys(Data_Materials.metadata).map((item) => Data_Materials.metadata[item].Bezeichnung), settings: { for: "materialFilter", noBorder: "right" } },
    { data: Object.keys(Data_Materials.metadata).map((item) => Data_Materials.metadata[item].abbr) },
  ];

  KadTable.createHTMLGrid({ id: idTab_materialFilterTable, header, body });
}

function materialFilterUpdateCB() {
  for (let index = 0; index < Object.entries(Data_Materials.metadata).length; index++) {
    const key = Object.keys(Data_Materials.metadata)[index];
    const cb = dbID(`idCheckbox_materialFilter_${index}`);
    cb.checked = materialFilterOptions.select.includes(key);
  }
}

function materialFilterChoices(index) {
  const key = Object.keys(Data_Materials.metadata)[index];
  const cb = dbID(`idCheckbox_materialFilter_${index}`);
  if (cb.checked) {
    materialFilterOptions.select.push(key);
  } else {
    let i = materialFilterOptions.select.indexOf(key);
    materialFilterOptions.select.splice(i, 1);
  }
  materialSelectedTable();
}
