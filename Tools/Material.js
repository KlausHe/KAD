import { Data_Materials } from "../KadData/KadData_Material.js";
import { dbID, dbIDStyle, initEL, KadTable } from "../KadUtils/KadUtils.js";
import { materialFilterOptions, storage_cl_MaterialFilterSettings } from "../Settings/MaterialFilterSettings.js";
import { expansionUpdateMassDependecy } from "./Expansion.js";
import { geoUpdateMassDependency } from "./Geometrie.js";

export const materialOptions = {
  matListOrig: ["S275JR", "AlSi5Cu3", "X5CrNi18-10"],
  matList: [],
  filterList: [],
  get headerList() {
    return dbID("idCb_materialListFilter").checked ? [...storage_cl_MaterialFilterSettings.getData()] : Object.keys(Data_Materials.metadata);
  },
  optGroup: null,
  selMatGroup: "all",
};

initEL({ id: dbID("idCb_materialListFilter"), fn: materialPropertyfilter, resetValue: true });
initEL({ id: dbID("idVin_materialFilter"), fn: materialSearchInput, resetValue: "Material suchen" });
initEL({
  id: dbID("idSel_materialFilter"),
  fn: materialSearchSelectChange,
});
initEL({ id: dbID("idBtn_materialSelectClose"), fn: materialCloseMaterialSelect });

export function clear_cl_Material() {
  materialOptions.matList = materialOptions.matListOrig;
  materialOptions.filterList = Object.keys(Data_Materials.Materials);
  materialFilterOptions.select = [...materialFilterOptions.listOrig];
  dbID("idSel_materialFilter").KadReset({
    selGroup: {
      "Alle Werkstoffe": [["Alle Werkstoffe", "all"], ...Array.from(new Set(Object.values(Data_Materials.Materials).map((mat) => mat.matGroup))).map((mat) => [mat, mat])],
    },
    selStartIndex: 0,
  });
  dbID("idVin_materialFilter").KadReset();
  dbID("idCb_materialListFilter").KadReset();

  materialSelectedTable();
  materialToggleSearch();
}

export const storage_cl_Material = {
  dbName: "Material",
  contentName: "cl_Material",
  clear() {
    this.data = [...materialOptions.matListOrig];
  },
  getData() {
    return [...materialOptions.matList];
  },
  saveData(data) {
    materialOptions.matList = data;
  },
  activateData() {
    materialSelectedTable();
  },
};

function materialPropertyfilter() {
  materialSelectedTable();
  materialSearchTable();
}

function materialRemoveMaterial(index) {
  materialOptions.matList.splice(index, 1);
  materialSelectedTable();
}

function materialAddMaterial() {
  materialToggleSearch(true);
  materialOpenMaterialSelect();
}

//Hauptliste mit Werkstoffdaten ersetllen!!!
export function materialSelectedTable() {
  if (materialOptions.matList.length === 0) {
    materialOptions.matList = materialOptions.matListOrig;
  }
  materialOptions.matList = [...new Set(materialOptions.matList)].sort(); // delete duplicates
  const settingsLeft = { noBorder: "right", align: "left" };
  const settingsCenter = { noBorder: "right", align: "center" };
  const settingsRight = { noBorder: "right", align: "right" };

  const header = [{ data: "Eigenschaften", colSpan: 3, settings: settingsCenter }, ...materialOptions.matList.map((item, index) => ({ type: "KADImg", data: "trash", settings: { ...settingsCenter, onclick: [materialRemoveMaterial, index] } })), { type: "KADImg", data: "oAdd", settings: { ...settingsCenter, onclick: materialAddMaterial } }];

  const bodyData = [];
  for (let m = 0; m < materialOptions.matList.length; m++) {
    bodyData[m] = [];
    const mat = materialOptions.matList[m];
    for (let i = 0; i < materialOptions.headerList.length; i++) {
      const listItem = materialOptions.headerList[i];
      const value = Data_Materials.Materials[mat][listItem];
      let d = value || "-";
      if (listItem == "matSort" || listItem == "matZustand") d = value != undefined ? `${value}*` : "-";
      if (typeof value == "object" && value != null) d = Object.values(value)[0];
      bodyData[m].push(d);
    }
  }

  const body = [
    { data: materialOptions.headerList.map((head) => Data_Materials.metadata[head].Bezeichnung), settings: { ...settingsLeft } },
    { data: materialOptions.headerList.map((head) => (Data_Materials.metadata[head].abbr ? `[${Data_Materials.metadata[head].abbr}]` : "")), settings: { ...settingsLeft } },
    { data: materialOptions.headerList.map((head) => (Data_Materials.metadata[head].Unit ? `[${Data_Materials.metadata[head].Unit}]` : "")), settings: { ...settingsLeft } },
    ...bodyData.map((item) => ({ data: item.map((mat) => mat), settings: settingsRight })),
    { skip: true, settings: { noBorder: "bottom" } },
  ];
  KadTable.createHTMLGrid({ id: dbID("idTab_materialTable"), header, body });
  geoUpdateMassDependencies();
}

function geoUpdateMassDependencies() {
  geoUpdateMassDependency();
  expansionUpdateMassDependecy();
}

function materialSearchSelectChange() {
  materialOptions.selMatGroup = dbID("idSel_materialFilter").KadGet();
  materialSearchInput();
}

function materialSearchInput() {
  materialOptions.filterList = [];
  let val = dbID("idVin_materialFilter").KadGet().toLowerCase();
  let search = val.split(/[*^\s]/g);
  for (const [key, value] of Object.entries(Data_Materials.Materials)) {
    if (materialOptions.selMatGroup == "all" || value.matGroup == materialOptions.selMatGroup) {
      if (search.length == 0) {
        materialOptions.filterList.push(key);
      } else if (search.every((sub) => key.toLowerCase().includes(sub))) {
        materialOptions.filterList.push(key);
      }
    }
  }
  materialSearchTable();
}

function materialSearchTable() {
  KadTable.clear("idTabHeader_MaterialSearchList");
  const headerRow0 = KadTable.createRow("idTabHeader_MaterialSearchList");
  const headerRow1 = KadTable.createRow("idTabHeader_MaterialSearchList");
  const headerRow2 = KadTable.createRow("idTabHeader_MaterialSearchList");
  for (let i = 0; i < materialOptions.headerList.length; i++) {
    KadTable.addHeaderCell(headerRow0, {
      names: ["materialSearch", "bez", i],
      type: "Lbl",
      text: Data_Materials.metadata[materialOptions.headerList[i]].Bezeichnung,
      createCellClass: [i == materialOptions.headerList.length - 1 ? "" : "clTab_UIBorderThinRight"],
      createClass: ["clTab_vertical"],
      cellStyle: {
        textAlign: "center",
      },
      copy: true,
    });
    KadTable.addHeaderCell(headerRow1, {
      names: ["materialSearch", "abbr", i],
      type: "Lbl",
      createCellClass: [i == materialOptions.headerList.length - 1 ? "" : "clTab_UIBorderThinRight"],
      text: Data_Materials.metadata[materialOptions.headerList[i]].abbr ? `[${Data_Materials.metadata[materialOptions.headerList[i]].abbr}]` : "",
      cellStyle: {
        textAlign: "center",
      },
      style: {
        whiteSpace: "nowrap",
      },
    });
    KadTable.addHeaderCell(headerRow2, {
      names: ["materialSearch", "units", i],
      type: "Lbl",
      createCellClass: [i == materialOptions.headerList.length - 1 ? "" : "clTab_UIBorderThinRight"],
      text: Data_Materials.metadata[materialOptions.headerList[i]].Unit ? `[${Data_Materials.metadata[materialOptions.headerList[i]].Unit}]` : "",
      cellStyle: {
        textAlign: "center",
      },
    });
  }

  KadTable.clear("idTabBody_MaterialSearchList");
  for (let i = 0; i < materialOptions.filterList.length; i++) {
    let row = KadTable.createRow("idTabBody_MaterialSearchList");
    row.style.cursor = "pointer";
    row.onclick = function () {
      materialOptions.matList.push(materialOptions.filterList[i]);
      materialSelectedTable();
    };
    for (let j = 0; j < materialOptions.headerList.length; j++) {
      const value = Data_Materials.Materials[materialOptions.filterList[i]][materialOptions.headerList[j]];
      const listItem = materialOptions.headerList[j];
      KadTable.addCell(row, {
        names: ["materialSearch", "value", i, j],
        type: "Lbl",
        createCellClass: [j == materialOptions.headerList.length - 1 ? "" : "clTab_UIBorderThinRight"],
        get text() {
          if (listItem == "matSort" || listItem == "matZustand") {
            return value != undefined ? `${value}*` : "-";
          }
          if (typeof value == "object" && value != null) {
            return Object.values(value)[0];
          }
          return value || "-";
        },
        get ui() {
          if (listItem == "matSort")
            return {
              title: Data_Materials.matSortList[value],
            };
          if (listItem == "matZustand")
            return {
              title: Data_Materials.matZustandList[value],
            };
          return "";
        },
        cellStyle: {
          textAlign: "right",
          whiteSpace: "nowrap",
        },
      });
    }
  }
  let row = KadTable.createRow("idTabBody_MaterialSearchList");
  row.insertCell(0);
}

function materialToggleSearch(state = false) {
  const t = state ? "block" : "none";
  dbIDStyle("idDiv_MaterialSearchOptions").display = t;
  dbIDStyle("idDiv_MaterialSearchList").display = t;
  if (state) materialSearchTable();
}

function materialOpenMaterialSelect() {
  dbID("idDia_materialSelect").showModal();
}
function materialCloseMaterialSelect() {
  materialToggleSearch();
  dbID("idDia_materialSelect").close();
}
