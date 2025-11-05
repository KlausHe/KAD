import { dbID, initEL, KadTable } from "../KadUtils/KadUtils.js";

const kolidOptions = {
  measureIndex: 2,
  listInputState: false,
  imgPath: "/Tools/AssetsKolid/Kolid.png",
  measures: {
    headerData: ["d1 über-bis", "b", "h", "Welle t1", "Nabe t2", "Längen l von-bis"],
    bodyData: [
      ["6 - 8", 2, 2, 1, 2, "6 - 20"],
      ["8 - 10", 3, 3, 1.8, 1.4, "6 - 36"],
      ["10 - 12", 4, 4, 2.5, 1.8, "8 - 45"],
      ["12 - 17", 5, 5, 3, 2.3, "10 - 56"],
      ["17 - 22", 6, 6, 3.5, 2.8, "14 - 70"],
      ["22 - 30", 8, 7, 4, 3.3, "18 - 90"],
      ["30 - 38", 10, 8, 5, 3.3, "20 - 110"],
      ["38 - 44", 12, 8, 5, 3.3, "28 - 140"],
      ["44 - 50", 14, 9, 5.5, 3.8, "36 - 160"],
      ["50 - 58", 16, 10, 6, 4.3, "45 - 180"],
      ["58 - 65", 18, 11, 7, 4.4, "50 - 200"],
      ["65 - 75", 20, 12, 7.5, 4.9, "56 - 220"],
      ["75 - 85", 22, 14, 9, 5.4, "63 - 250"],
      ["85 - 95", 25, 14, 9, 5.4, "70 - 280"],
      ["95 - 110", 28, 16, 10, 6.4, "80 - 320"],
      ["110 - 130", 32, 18, 11, 7.4, "90 - 360"],
    ],
  },
  tolerances: {
    bodyData: [
      ["Breite der Wellennut", "fest: P9", "leicht: N9", ""],
      ["Breite der Nabennut", "fest: P9", "leicht: JS9", ""],
      ["Tiefe der Nut", "d≤22: +0,1", "d≤130: +0,2", "d>130:+0,3"],
      ["Länge der Feder", "6 - 28: -0,2", "32 - 80: -0,3", "90 - 400: -0,3"],
      ["Länge der Nut", "6 - 28: +0,2", "32 - 80: +0,3", "90 - 400: +0,3"],
    ],
  },
};

const Vin_kolidInput = initEL({ id: "idVin_kolidInput", fn: kolidSingleInput, resetValue: 13, settings: { min: 6, step: 1, max: 130 } });
initEL({ id: "idLbl_kolidInput", resetValue: "d1" });
initEL({ id: "idBtn_kolidToggleListVew", fn: kolidToggleListView, resetValue: "Toggle List" });

export function clear_cl_Kolid() {
  Vin_kolidInput.KadReset();
  kolidOptions.listInputState = false;
  dbID("idImg_Kolid").src = kolidOptions.imgPath;
  kolidCreateTableMeasures();
  kolidCreateTableTolerances();
}

function kolidSingleInput() {
  let input = Vin_kolidInput.KadGet();
  let maxDia = kolidOptions.measures.bodyData.map((item) => Number(item[0].split(" - ")[1]));
  kolidOptions.measureIndex = maxDia.findIndex((item) => item >= input);
}

function kolidToggleListView() {
  kolidOptions.listInputState = !kolidOptions.listInputState;
  kolidCreateTableMeasures();
}

function kolidCreateTableMeasures() {
  const header = kolidOptions.measures.headerData.map((head) => ({ data: head }));
  let body = [];
  if (!kolidOptions.listInputState) {
    for (let i = 0; i < kolidOptions.measures.headerData.length; i++) {
      body.push({ data: kolidOptions.measures.bodyData.map((item) => item[i]) });
    }
  } else {
    for (let i = 0; i < kolidOptions.measures.headerData.length; i++) {
      body.push({ data: [kolidOptions.measures.bodyData[kolidOptions.measureIndex][i]] });
    }
  }
  KadTable.createHTMLGrid({ id: "idTab_kolidTableMeasures", header, body });
}

function kolidCreateTableTolerances() {
  const header = [{ data: "Passfedernuten-Toleranzen", colSpan: 4, settings: { align: "center" } }];
  const body = [];
  for (let i = 0; i < kolidOptions.tolerances.bodyData[0].length; i++) {
    body.push({ data: kolidOptions.tolerances.bodyData.map((item) => item[i]) });
  }
  KadTable.createHTMLGrid({ id: "idTab_kolidTableTolerances", header, body });
}
