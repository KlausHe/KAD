import { dbID, dbIDStyle, initEL, KadRandom, KadValue } from "../KadUtils/KadUtils.js";

const pormulaOptions = {
  valuesOrig: [2, 4, 6],
  formulaResult: "",
  messages: [],
  reg: null,
  data: {
    userPoints: [],
    uniquePoints: [],
    uniqueX: [],
    resultPoints: [[], [], []],
    curvePoints: [],
    xRange: [0, 1],
    size: 3,
    minSize: 2,
    maxSize: 8,
  },
  selType: null,
  regOptionsOrig: {
    order: 2,
    precision: 4,
  },
  regOptions: {
    order: 2,
    precision: 4,
  },
  types: {
    Linear: {
      calc() {
        pormulaOptions.reg = regression.linear(pormulaOptions.data.userPoints, pormulaOptions.regOptions);
      },
      result(d) {
        let a = d[0] == 0 ? "" : d[0] == 1 ? "x" : `${d[0]}x`;
        let b = d[1] == 0 ? "" : d[1] < 0 ? `${d[1]}` : `+${d[1]}`;
        return `y=${a}${b}`;
      },
      cleaning() {
        if (pormulaOptions.data.uniquePoints.length < 2) {
          pormulaOptions.messages.push(`Zu wenig eindeutige Datenpunkte!`);
          return true;
        }
      },
    },
    Exponential: {
      calc() {
        pormulaOptions.reg = regression.exponential(pormulaOptions.data.userPoints, pormulaOptions.regOptions);
      },
      result(d) {
        let a = d[0] == 1 ? "" : `${d[0]}`;
        let b = d[1] == 0 ? "" : d[1] < 0 ? `${d[1]}x` : `${d[1]}x`;
        return `y=${a}e<sup>${b}</sup>`;
      },
      cleaning() {
        if (pormulaOptions.data.uniquePoints.length < 2) {
          pormulaOptions.messages.push(`Zu wenig eindeutige Datenpunkte!`);
          return true;
        }
      },
    },
    Logarithmus: {
      calc() {
        pormulaOptions.reg = regression.logarithmic(pormulaOptions.data.userPoints, pormulaOptions.regOptions);
      },
      result(d) {
        let p = d[1] < 0 ? "" : "+";

        let a = d[0] == 0 ? "" : `${d[0]}`;
        let b = d[1] == 0 ? "" : d[1] == 1 ? `ln(x)` : `${p}${d[1]}ln(x)`;
        return `y=${a}${b}`;
      },
      cleaning() {
        if (pormulaOptions.data.uniquePoints.length < 2) {
          pormulaOptions.messages.push(`Zu wenig eindeutige Datenpunkte!`);
          return true;
        }
        if (pormulaOptions.data.uniqueX.includes(0)) {
          pormulaOptions.messages.push(`Funktion bei x=0 nicht definiert!`);
          return true;
        }
      },
    },
    Potenz: {
      calc() {
        pormulaOptions.reg = regression.power(pormulaOptions.data.userPoints, pormulaOptions.regOptions);
      },
      result(d) {
        let a = d[0] == 0 ? "" : `${d[0]}`;
        let b = d[1] == 0 ? "" : d[1] == 1 ? "x" : `x<sup>${d[1]}</sup>`;
        return `y=${a}${b}`;
      },
      cleaning() {
        if (pormulaOptions.data.uniquePoints.length < 2) {
          pormulaOptions.messages.push(`Zu wenig eindeutige Datenpunkte!`);
          return true;
        }
        if (pormulaOptions.data.uniqueX.includes(0)) {
          pormulaOptions.messages.push(`Funktion bei x=0 nicht definiert!`);
          return true;
        }
      },
    },
    Polynom: {
      calc() {
        pormulaOptions.reg = regression.polynomial(pormulaOptions.data.userPoints, pormulaOptions.regOptions);
      },
      result(d) {
        d.reverse();
        let text = "";
        for (let i = d.length - 1; i >= 0; i--) {
          let p = text.length == 0 || d[i] < 0 ? "" : "+";
          if (i == 0) {
            text += d[i] == 0 ? "" : `${p}${d[i]}`;
          } else if (i == 1) {
            text += d[i] == 0 ? "" : d[i] == 1 ? `${p}x` : `${p}${d[i]}x`;
          } else {
            text += d[i] == 0 ? "" : d[i] == 1 ? `${p}x<sup>${i}</sup>` : `${p}${d[i]}x<sup>${i}</sup>`;
          }
        }
        return `y=${text}`;
      },
      cleaning() {
        if (pormulaOptions.data.uniquePoints.length < pormulaOptions.regOptions.order) {
          pormulaOptions.messages.push(`Zu wenig eindeutige Datenpunkte!`);
          return true;
        }
        let orderMin = Math.min(pormulaOptions.regOptions.order, pormulaOptions.data.uniquePoints.length);
        if (orderMin < pormulaOptions.regOptions.order) {
          Vin_pormulaOrder.value = orderMin;
          pormulaOptions.regOptions.order = orderMin;
          pormulaOptions.messages.push(`Order wurde geändert!`);
          return;
        }
      },
    },
  },
};

const pormulaChart = {
  config: {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Startpunkte",
          data: pormulaOptions.data.uniquePoints,
          backgroundColor: "rgb(5, 117, 3)",
          borderColor: "rgb(5, 117, 3)",
        },
        {
          label: "Ergebniss A",
          data: [{ x: pormulaOptions.data.resultPoints[0][0], y: pormulaOptions.data.resultPoints[0][1] }],
          backgroundColor: "rgb(255, 11, 11)",
          borderColor: "rgb(255, 11, 11)",
        },
        {
          label: "Ergebniss B",
          data: [{ x: pormulaOptions.data.resultPoints[1][0], y: pormulaOptions.data.resultPoints[1][1] }],
          backgroundColor: "rgb(255, 11, 11)",
          borderColor: "rgb(255, 11, 11)",
        },
        {
          label: "Ergebniss C",
          data: [{ x: pormulaOptions.data.resultPoints[2][0], y: pormulaOptions.data.resultPoints[2][1] }],
          backgroundColor: "rgb(255, 11, 11)",
          borderColor: "rgb(255, 11, 11)",
        },
        {
          label: "Kurve",
          data: pormulaOptions.data.resultPoints.map((points) => ({ x: points[0], y: points[1] })),
          showLine: true,
          tension: 0.2,
          pointStyle: false,
          borderColor: "rgb(89, 0, 255)",
          backgroundColor: "rgb(89, 0, 255)",
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          min: pormulaOptions.data.xRange[0],
          max: pormulaOptions.data.xRange.length - 1,
        },
      },
    },
  },
  canvas: null,
};

const Btn_pormulaTypeSelectLinear = initEL({ id: "idBtn_pormulaTypeSelectLinear", fn: () => pormulaGetType(0, "Linear"), resetValue: "Linear", dataset: ["radio", "pormulaType"] });
const Btn_pormulaTypeSelectExponential = initEL({ id: "idBtn_pormulaTypeSelectExponential", fn: () => pormulaGetType(1, "Exponential"), resetValue: "Exponential", dataset: ["radio", "pormulaType"] });
const Btn_pormulaTypeSelectLogarithmus = initEL({ id: "idBtn_pormulaTypeSelectLogarithmus", fn: () => pormulaGetType(2, "Logarithmus"), resetValue: "Logarithmus", dataset: ["radio", "pormulaType"] });
const Btn_pormulaTypeSelectPotenz = initEL({ id: "idBtn_pormulaTypeSelectPotenz", fn: () => pormulaGetType(3, "Potenz"), resetValue: "Potenz", dataset: ["radio", "pormulaType"] });
const Btn_pormulaTypeSelectPolynom = initEL({ id: "idBtn_pormulaTypeSelectPolynom", fn: () => pormulaGetType(4, "Polynom"), resetValue: "Polynom", dataset: ["radio", "pormulaType"] });
const Btn_pormulaTypeSelects = [Btn_pormulaTypeSelectLinear, Btn_pormulaTypeSelectExponential, Btn_pormulaTypeSelectLogarithmus, Btn_pormulaTypeSelectPotenz, Btn_pormulaTypeSelectPolynom];
initEL({ id: "idBtn_pormulaBestFit", fn: pormulaBestFit, resetValue: "Fit Best" });
initEL({ id: "idBtn_pormulaPolyFit", fn: pormulaPolyFit, resetValue: "Fit Polynom" });
const Vin_pormulaPrecision = initEL({ id: "idVin_pormulaPrecision", fn: pormulaCalculate, resetValue: pormulaOptions.regOptionsOrig.precision });
const Vin_pormulaOrder = initEL({ id: "idVin_pormulaOrder", fn: pormulaCalculate, resetValue: pormulaOptions.regOptionsOrig.order });
initEL({ id: "idBtn_pormulaSubInput", fn: pormulaSubInput });
initEL({ id: "idBtn_pormulaAddInput", fn: pormulaAddInput });
const Vin_Pormula_x0 = initEL({ id: "idVin_Pormula_x0", fn: pormulaCalculate, resetValue: 9 }); //
const Vin_Pormula_y0 = initEL({ id: "idVin_Pormula_y0", fn: pormulaCalculate, resetValue: 8 }); //
const Vin_Pormula_x1 = initEL({ id: "idVin_Pormula_x1", fn: pormulaCalculate, resetValue: 2 }); //
const Vin_Pormula_y1 = initEL({ id: "idVin_Pormula_y1", fn: pormulaCalculate, resetValue: 2 }); //
const Vin_Pormula_x2 = initEL({ id: "idVin_Pormula_x2", fn: pormulaCalculate, resetValue: 3 }); //
const Vin_Pormula_y2 = initEL({ id: "idVin_Pormula_y2", fn: pormulaCalculate, resetValue: 3 }); //
const Vin_Pormula_x3 = initEL({ id: "idVin_Pormula_x3", fn: pormulaCalculate, resetValue: 4 }); //
const Vin_Pormula_y3 = initEL({ id: "idVin_Pormula_y3", fn: pormulaCalculate, resetValue: 4 }); //
const Vin_Pormula_x4 = initEL({ id: "idVin_Pormula_x4", fn: pormulaCalculate, resetValue: 5 }); //
const Vin_Pormula_y4 = initEL({ id: "idVin_Pormula_y4", fn: pormulaCalculate, resetValue: 5 }); //
const Vin_Pormula_x5 = initEL({ id: "idVin_Pormula_x5", fn: pormulaCalculate, resetValue: 6 }); //
const Vin_Pormula_y5 = initEL({ id: "idVin_Pormula_y5", fn: pormulaCalculate, resetValue: 6 }); //
const Vin_Pormula_x6 = initEL({ id: "idVin_Pormula_x6", fn: pormulaCalculate, resetValue: 7 }); //
const Vin_Pormula_y6 = initEL({ id: "idVin_Pormula_y6", fn: pormulaCalculate, resetValue: 7 }); //
const Vin_Pormula_x7 = initEL({ id: "idVin_Pormula_x7", fn: pormulaCalculate, resetValue: 8 }); //
const Vin_Pormula_y7 = initEL({ id: "idVin_Pormula_y7", fn: pormulaCalculate, resetValue: 8 }); //
const Vin_Pormula_xs = [Vin_Pormula_x0, Vin_Pormula_x1, Vin_Pormula_x2, Vin_Pormula_x3, Vin_Pormula_x4, Vin_Pormula_x5, Vin_Pormula_x6, Vin_Pormula_x7];
const Vin_Pormula_ys = [Vin_Pormula_y0, Vin_Pormula_y1, Vin_Pormula_y2, Vin_Pormula_y3, Vin_Pormula_y4, Vin_Pormula_y5, Vin_Pormula_y6, Vin_Pormula_y7];

const Lbl_pormulaAccuracy = initEL({ id: "idLbl_pormulaAccuracy" });

const Cb_pormulaPointEnableA = initEL({ id: "idCb_pormulaPointEnableA", fn: pormulaEnablePointResult, resetValue: true });
const Cb_pormulaPointEnableB = initEL({ id: "idCb_pormulaPointEnableB", fn: pormulaEnablePointResult, resetValue: false });
const Cb_pormulaPointEnableC = initEL({ id: "idCb_pormulaPointEnableC", fn: pormulaEnablePointResult, resetValue: false });
const Vin_pormulaPointEntryA = initEL({ id: "idVin_pormulaPointEntryA", fn: pormulaCalculate, resetValue: pormulaOptions.valuesOrig[0] });
const Vin_pormulaPointEntryB = initEL({ id: "idVin_pormulaPointEntryB", fn: pormulaCalculate, resetValue: pormulaOptions.valuesOrig[1] });
const Vin_pormulaPointEntryC = initEL({ id: "idVin_pormulaPointEntryC", fn: pormulaCalculate, resetValue: pormulaOptions.valuesOrig[2] });
const Lbl_pormulaPointResultA = initEL({ id: "idLbl_pormulaPointResultA", resetValue: 2 });
const Lbl_pormulaPointResultB = initEL({ id: "idLbl_pormulaPointResultB", resetValue: 4 });
const Lbl_pormulaPointResultC = initEL({ id: "idLbl_pormulaPointResultC", resetValue: 6 });
const Cb_pormulaPointEnable = [Cb_pormulaPointEnableA, Cb_pormulaPointEnableB, Cb_pormulaPointEnableC];
const Vin_pormulaPointEntry = [Vin_pormulaPointEntryA, Vin_pormulaPointEntryB, Vin_pormulaPointEntryC];
const Lbl_pormulaPointResult = [Lbl_pormulaPointResultA, Lbl_pormulaPointResultB, Lbl_pormulaPointResultC];

export function clear_cl_Pormula() {
  pormulaOptions.selType = Object.keys(pormulaOptions.types)[0];
  pormulaOptions.regOptions.order = Vin_pormulaOrder.KadReset();
  pormulaOptions.regOptions.precision = Vin_pormulaPrecision.KadReset();
  pormulaOptions.data.size = pormulaOptions.valuesOrig.length;

  let expNum = KadRandom.randomInt(6, 1);
  let exp = KadRandom.randomBool(0.3) ? 1 / expNum : expNum;

  for (let i = 0; i < Vin_Pormula_xs.length; i++) {
    Vin_Pormula_xs[i].KadReset({ resetValue: i + 1 });
    Vin_Pormula_ys[i].KadReset({ resetValue: (i + 1) ** exp });
  }

  for (let resultPointVin of Vin_pormulaPointEntry) {
    resultPointVin.KadReset();
  }
  for (let resultPointLbl of Lbl_pormulaPointResult) {
    resultPointLbl.KadReset();
  }
  if (pormulaChart.canvas != null) {
    pormulaChart.canvas.destroy();
  }
  pormulaChart.canvas = new Chart(idCanv_promula, pormulaChart.config);
  pormulaDirInput(0); // initiate hiding/showing of input rows
  pormulaCalculate();
  pormulaBestFit();
}

function pormulaSubInput() {
  pormulaDirInput(-1);
  pormulaCalculate();
}
function pormulaAddInput() {
  pormulaDirInput(1);
  pormulaCalculate();
}
function pormulaDirInput(dir) {
  pormulaOptions.data.size += dir;
  pormulaOptions.data.size = KadValue.constrain(pormulaOptions.data.size, pormulaOptions.data.minSize, pormulaOptions.data.maxSize);
  for (let i = 0; i < Vin_Pormula_xs.length; i++) {
    const state = i < pormulaOptions.data.size;
    Vin_Pormula_xs[i].KadEnable(state);
    Vin_Pormula_ys[i].KadEnable(state);
  }
}

function pormulaGetType(index, type) {
  Btn_pormulaTypeSelects[index].KadRadioColor();
  pormulaOptions.selType = type;
  pormulaCalculate();
}

function pormulaReadInputs() {
  pormulaOptions.regOptions.order = Vin_pormulaOrder.KadGet();
  pormulaOptions.regOptions.precision = Vin_pormulaPrecision.KadGet();
  pormulaOptions.data.userPoints = [];
  pormulaOptions.data.uniquePoints = [];
  pormulaOptions.data.uniqueX = [];
  for (let i = 0; i < pormulaOptions.data.size; i++) {
    const x = Vin_Pormula_xs[i].KadGet();
    const y = Vin_Pormula_ys[i].KadGet();
    if (x != null && y != null) {
      pormulaOptions.data.userPoints.push([x, y]);
      const unique = !pormulaOptions.data.uniqueX.includes(x);
      if (unique) {
        pormulaOptions.data.uniqueX.push(x);
        pormulaOptions.data.uniquePoints.push({ x, y });
      }
      Vin_Pormula_ys[i].KadEnable(unique);
    }
  }
}

function pormulaCalculate() {
  pormulaOptions.messages = [];
  pormulaReadInputs();
  const critic = pormulaOptions.types[pormulaOptions.selType].cleaning();
  pormulaInfo();
  if (critic == true) {
    pormulaError();
    return;
  }
  pormulaRegression();
}

function pormulaRegression() {
  const regType = pormulaOptions.types[pormulaOptions.selType];
  regType.calc();
  pormulaResultPoint();
  pormulaOptions.formulaResult = regType.result(pormulaOptions.reg.equation);
  dbID("idP_pormulaResult").innerHTML = pormulaOptions.formulaResult;
  Lbl_pormulaAccuracy.KadSetText(`${(pormulaOptions.reg.r2 * 100).toFixed(2)}%`);
  pormulaUpdateChart();
}

function pormulaError() {
  dbID("idP_pormulaResult").innerHTML = "---";
  Lbl_pormulaAccuracy.KadSetText("0%");
}

function pormulaBestFit() {
  let types = Object.keys(pormulaOptions.types);
  const index = types.indexOf("Polynom");
  types.splice(index, 1);
  let bestType = null;
  let bestIndex = 0;
  let bestR = 0;
  types.forEach((t, i) => {
    pormulaOptions.types[t].calc();
    const cur = pormulaOptions.reg.r2;
    if (bestR < cur) {
      bestR = cur;
      bestType = t;
      bestIndex = i;
    }
  });
  if (bestType != null) {
    pormulaGetType(bestIndex, bestType);
  }
}

function pormulaPolyFit() {
  let prevR = null;
  for (let i = 0; i < pormulaOptions.data.uniquePoints.length; i++) {
    const reg = regression.polynomial(pormulaOptions.data.userPoints, {
      order: i,
      precision: pormulaOptions.regOptions.precision,
    });
    const newR = reg.r2;
    if (i == pormulaOptions.data.uniquePoints.length - 1 || newR == 1) {
      pormulaOptions.regOptions.order = i;
      break;
    }
    if (prevR != null && prevR >= newR) {
      pormulaOptions.regOptions.order = i;
      break;
    }
    prevR = newR;
  }
  pormulaOptions.regOptions.order = Vin_pormulaOrder.KadReset();
  pormulaGetType(4, "Polynom");
}

function pormulaResultPoint() {
  pormulaOptions.data.resultPoints = [];
  for (let i = 0; i < Vin_pormulaPointEntry.length; i++) {
    const state = Cb_pormulaPointEnable[i].KadGet();
    const p = Vin_pormulaPointEntry[i].KadGet();
    pormulaOptions.data.resultPoints[i] = pormulaOptions.reg.predict(p);
    pormulaOptions.data.resultPoints[i][2] = state;
    Lbl_pormulaPointResult[i].KadSetText(pormulaOptions.data.resultPoints[i][1]);
    Vin_pormulaPointEntry[i].KadEnable(state);
    Lbl_pormulaPointResult[i].KadEnable(state);
  }
}

function pormulaEnablePointResult() {
  pormulaResultPoint();
  pormulaUpdateChart();
}

function pormulaInfo() {
  if (pormulaOptions.messages.length == 0) {
    dbIDStyle("idDiv_pormulaInfo").display = "none";
  } else {
    let text = "";
    pormulaOptions.messages.forEach((t, i) => {
      if (i > 0) text += "<br>";
      text += t;
    });
    dbID("idLbl_pormulaInfo").innerHTML = text;
    dbIDStyle("idDiv_pormulaInfo").display = "initial";
  }
}

function pormulaUpdateChart() {
  if (pormulaChart.canvas == null) return;
  pormulaOptions.data.xRange = [...pormulaOptions.data.uniquePoints.map((item) => item.x), ...pormulaOptions.data.resultPoints.map((points) => points[0])];
  let min = Math.floor(Math.min(...pormulaOptions.data.xRange));
  let max = Math.ceil(Math.max(...pormulaOptions.data.xRange));

  const resolution = 30;
  const step = (max - min) / resolution;
  min = Math.floor(min - 2 * step);
  max = Math.ceil(max + 2 * step);

  pormulaChart.canvas.options.scales.x.min = min;
  pormulaChart.canvas.options.scales.x.max = max;
  pormulaOptions.data.curvePoints = [];
  for (let x = min; x <= max + step; x += step) {
    pormulaOptions.data.curvePoints.push({ x, y: pormulaOptions.reg.predict(x)[1] });
  }

  pormulaChart.config.data.datasets[0].data = pormulaOptions.data.uniquePoints;
  pormulaChart.config.data.datasets[1].data = [{ x: pormulaOptions.data.resultPoints[0][0], y: pormulaOptions.data.resultPoints[0][1] }];
  pormulaChart.config.data.datasets[2].data = [{ x: pormulaOptions.data.resultPoints[1][0], y: pormulaOptions.data.resultPoints[1][1] }];
  pormulaChart.config.data.datasets[3].data = [{ x: pormulaOptions.data.resultPoints[2][0], y: pormulaOptions.data.resultPoints[2][1] }];
  pormulaChart.config.data.datasets[4].data = pormulaOptions.data.curvePoints;

  pormulaChart.canvas.update();
}
