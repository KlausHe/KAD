import { dbID, initEL, KadLog, KadTable } from "../KadUtils/KadUtils.js";

const kolidOptions = {
  inputState: [0, 1],
  inputStateOrig: [0, 1],
  diameter: 13,
  diameterIndex: 2,
  length: 10,
  torque: 2,
  anzahl: 1,
  anzahlIndex: 0,
  anzahlList: [1, 2],
  traganteil: 1,
  traganteilList: [1, 0.75],
  grundpresswert: 0,
  grundpresswertList: [
    ["Stahl", 150],
    ["Grauguss", 90],
    ["Temperguss", 110],
    ["Bronze, Messing", 50],
    ["AlCuMg-Leg., ausgehärtet", 100],
    ["AlMg-, AlMn-Leg. ausgehärtet", 90],
    ["AlSi-Gussleg., AlSiMg-Gussleg.", 70],
  ],
  pressfaktor: 0,
  pressfaktorList: [
    ["einseitig ruhend", 0.8],
    ["einseitig, leichte Stöße", 0.7],
    ["einseitig, starke Stöße", 0.6],
    ["wechselnd, leichte Stöße", 0.45],
    ["wechselnd, starke Stöße", 0.25],
  ],
  listInputState: false,
  imgPath: "./Tools/AssetsKolid/Kolid.png",
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
      ["Breite der Wellennut", "fest: P9", "leicht: N9", "gleit: H8"],
      ["Breite der Nabennut", "fest: P9", "leicht: JS9", "gleit: D10"],
      ["Tiefe der Nut d ≤", "22: +0,1", "130: +0,2", "400:+0,3"],
      ["Länge der Feder", "6 - 28: -0,2", "32 - 80: -0,3", "90 - 400: -0,3"],
      ["Länge der Nut", "6 - 28: +0,2", "32 - 80: +0,3", "90 - 400: +0,3"],
    ],
  },
};

const Vin_kolidInputDiameter = initEL({ id: "idVin_kolidInputDiameter", fn: [kolidInput, 0], resetValue: 13, settings: { min: 6, step: 1, max: 130 } });
const Vin_kolidInputLength = initEL({ id: "idVin_kolidInputLength", fn: [kolidInput, 1], resetValue: 10, settings: { min: 1, step: 1, max: 400 } });
const Vin_kolidInputTorque = initEL({ id: "idVin_kolidInputTorque", fn: [kolidInput, 2], resetValue: 2, settings: { min: 0 } });
const Sel_kolidInputAnzahl = initEL({ id: "idSel_kolidInputAnzahl", fn: kolidInputAnzahl, selStartIndex: 0, selList: kolidOptions.anzahlList });
const Sel_kolidInputMaterial = initEL({ id: "idSel_kolidInputMaterial", fn: kolidInputMaterial, selStartIndex: 0, selList: kolidOptions.grundpresswertList });
const Sel_kolidInputLastfall = initEL({ id: "idSel_kolidInputLastfall", fn: kolidInputLastfall, selStartIndex: 0, selList: kolidOptions.pressfaktorList });

const Lbl_kolidInputDiameter = initEL({ id: "idLbl_kolidInputDiameter", resetValue: "d<sub>1</sub>" });
const Lbl_kolidInputLength = initEL({ id: "idLbl_kolidInputLength", resetValue: "l" });
const Lbl_kolidInputTorque = initEL({ id: "idLbl_kolidInputTorque", resetValue: "M<sub>t</sub>" });
const Lbl_kolidResult = initEL({ id: "idLbl_kolidResult", resetValue: "..." });

initEL({ id: "idBtn_kolidToggleListVew", fn: kolidToggleListView, resetValue: "Toggle List" });

export function clear_cl_Kolid() {
  Vin_kolidInputDiameter.KadReset();
  Vin_kolidInputLength.KadReset();
  Vin_kolidInputTorque.KadReset();
  Lbl_kolidInputDiameter.KadReset();
  Lbl_kolidInputLength.KadReset();
  Lbl_kolidInputTorque.KadReset();

  kolidOptions.anzahlIndex = Sel_kolidInputAnzahl.KadReset();
  kolidOptions.anzahl = kolidOptions.anzahlList[kolidOptions.anzahlIndex];
  kolidOptions.traganteil = kolidOptions.traganteilList[kolidOptions.anzahlIndex];
  kolidOptions.grundpresswert = Sel_kolidInputMaterial.KadReset({ textContent: true });
  kolidOptions.pressfaktor = Sel_kolidInputLastfall.KadReset({ textContent: true });

  kolidOptions.inputState = [...kolidOptions.inputStateOrig];
  kolidOptions.listInputState = false;
  dbID("idImg_Kolid").src = kolidOptions.imgPath;
  kolidCreateTableMeasures();
  kolidCreateTableTolerances();
}

function kolidInput(obj) {
  const input = obj.Element.KadGet();
  if (input === "") return;
  const index = obj.data[0];
  if (!kolidOptions.inputState.includes(index)) {
    kolidOptions.inputState.unshift(index);
    kolidOptions.inputState.pop();
  } else {
    if (index != kolidOptions.inputState[0]) {
      kolidOptions.inputState[1] = kolidOptions.inputState[0];
      kolidOptions.inputState[0] = index;
    }
  }
  kolidCalc();
}

function kolidInputAnzahl() {
  kolidOptions.anzahlIndex = Sel_kolidInputAnzahl.KadGet({ index: true });
  kolidOptions.anzahl = kolidOptions.anzahlList[kolidOptions.anzahlIndex];
  kolidOptions.traganteil = kolidOptions.traganteilList[kolidOptions.anzahlIndex];
  kolidCalc();
}
function kolidInputMaterial() {
  KadLog.log(Sel_kolidInputMaterial);

  kolidOptions.grundpresswert = Sel_kolidInputMaterial.KadGet();
  kolidCalc();
}

function kolidInputLastfall() {
  kolidOptions.pressfaktor = Sel_kolidInputLastfall.KadGet();
  kolidCalc();
}

function kolidCalc() {
  const stateBinary = kolidOptions.inputState.toSorted().join("");
  Lbl_kolidInputDiameter.KadEnable(kolidOptions.inputState.includes(0));
  Lbl_kolidInputLength.KadEnable(kolidOptions.inputState.includes(1));
  Lbl_kolidInputTorque.KadEnable(kolidOptions.inputState.includes(2));

  switch (stateBinary) {
    case "01": // d & l  ==> M
      {
        kolidOptions.diameter = Vin_kolidInputDiameter.KadGet();
        kolidOptions.length = Vin_kolidInputLength.KadGet();
        const result = `M = ${kolidCalcTorque(kolidOptions.diameter)}Nm`;
        Lbl_kolidResult.KadSetText(result);
      }
      break;
    case "02": // d & M ==> l
      {
        kolidOptions.diameter = Vin_kolidInputDiameter.KadGet();
        kolidOptions.torque = Vin_kolidInputTorque.KadGet();
        const result = `l = ${kolidCalcLength()}mm`;
        Lbl_kolidResult.KadSetText(result);
      }
      break;
    case "12": // l & M ==> d
      {
        kolidOptions.length = Vin_kolidInputDiameter.KadGet();
        kolidOptions.torque = Vin_kolidInputTorque.KadGet();
        kolidCalcDiameter();
        const result = `d1 = ${kolidOptions.diameter}mm`;
        Lbl_kolidResult.KadSetHTML(result);
      }
      break;
  }

  kolidCreateTableMeasures();
}

function kolidCalcTorque(diameter) {
  const p = kolidOptions.grundpresswert * kolidOptions.pressfaktor;
  const { b, h, t1 } = kolidGetdiameterData(diameter);
  const ltr = kolidOptions.length - b;
  let result = (0.5 * p * diameter * ltr * (h - t1) * kolidOptions.anzahl * kolidOptions.traganteilList[kolidOptions.anzahlIndex]) / 1000;
  return Number(result.toFixed(3));
}

function kolidCalcLength() {
  const p = kolidOptions.grundpresswert * kolidOptions.pressfaktor;
  const { b, h, t1 } = kolidGetdiameterData(kolidOptions.diameter);
  let result = 2 * kolidOptions.torque * 1000;
  result /= p * kolidOptions.diameter * (h - t1) * kolidOptions.anzahl * kolidOptions.traganteilList[kolidOptions.anzahlIndex];
  result += b;
  return Number(result.toFixed(0));
}

function kolidCalcDiameter() {
  let upperDia = kolidOptions.measures.bodyData.map((item) => Number(item[0].split(" - ")[1]));
  const lowerBound = Number(kolidOptions.measures.bodyData[0][0][0]);
  const upperBound = upperDia[kolidOptions.measures.bodyData.length - 1];
  for (let d = lowerBound; d < upperBound; d++) {
    let res = Number(kolidCalcTorque(d));
    if (res > kolidOptions.torque) {
      kolidOptions.diameter = d;
      kolidOptions.diameterIndex = upperDia.findIndex((item) => item >= d);
      return;
    }
  }
}

function kolidToggleListView() {
  kolidOptions.listInputState = !kolidOptions.listInputState;
  kolidCreateTableMeasures();
}

function kolidGetdiameterData(diameter) {
  let maxDia = kolidOptions.measures.bodyData.map((item) => Number(item[0].split(" - ")[1]));
  kolidOptions.diameterIndex = maxDia.findIndex((item) => item >= diameter);
  const b = kolidOptions.measures.bodyData[kolidOptions.diameterIndex][1];
  const h = kolidOptions.measures.bodyData[kolidOptions.diameterIndex][2];
  const t1 = kolidOptions.measures.bodyData[kolidOptions.diameterIndex][3];
  return { b, h, t1 };
}

function kolidCreateTableMeasures() {
  const header = kolidOptions.measures.headerData.map((head) => ({ data: head }));
  let body = [];
  if (!kolidOptions.listInputState) {
    for (let i = 0; i < kolidOptions.measures.headerData.length; i++) {
      body.push({ data: kolidOptions.measures.bodyData.map((item) => item[i]) });
    }
  } else {
    kolidGetdiameterData(kolidOptions.diameter);
    for (let i = 0; i < kolidOptions.measures.headerData.length; i++) {
      body.push({ data: [kolidOptions.measures.bodyData[kolidOptions.diameterIndex][i]] });
    }
  }
  KadTable.createHTMLGrid({ id: "idTab_kolidTableMeasures", header, body });
}

function kolidCreateTableTolerances() {
  const cols = kolidOptions.tolerances.bodyData[0].length;
  const header = [{ data: "Passfedernuten-Toleranzen", colSpan: cols, settings: { align: "center" } }];
  const body = [];
  for (let i = 0; i < cols; i++) {
    body.push({ data: kolidOptions.tolerances.bodyData.map((item) => item[i]) });
  }
  KadTable.createHTMLGrid({ id: "idTab_kolidTableTolerances", header, body });
}
