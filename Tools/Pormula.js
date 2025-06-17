import { dbCL, dbID, dbIDStyle, initEL, KadDOM, KadValue } from "../KadUtils/KadUtils.js";

const pormulaOptions = {
  valuesOrig: [3, 5, 8],
  formulaResult: "",
  messages: [],
  reg: null,
  data: {
    userPoints: [],
    uniquePoints: [],
    uniqueX: [],
    resultPoints: [],
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
          dbID("idVin_pormulaOrder").value = orderMin;
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
          label: "Ergebnisspunkte",
          data: pormulaOptions.data.resultPoints.map((points) => ({ x: points[0], y: points[1] })),
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

initEL({ id: idBtn_pormulaTypeSelectLinear, fn: () => pormulaGetType("idBtn_pormulaTypeSelectLinear", "Linear"), resetValue: "Linear" });
initEL({ id: idBtn_pormulaTypeSelectExponential, fn: () => pormulaGetType("idBtn_pormulaTypeSelectExponential", "Exponential"), resetValue: "Exponential" });
initEL({ id: idBtn_pormulaTypeSelectLogarithmus, fn: () => pormulaGetType("idBtn_pormulaTypeSelectLogarithmus", "Logarithmus"), resetValue: "Logarithmus" });
initEL({ id: idBtn_pormulaTypeSelectPotenz, fn: () => pormulaGetType("idBtn_pormulaTypeSelectPotenz", "Potenz"), resetValue: "Potenz" });
initEL({ id: idBtn_pormulaBestFit, fn: pormulaBestFit, resetValue: "Fit Best" });
initEL({ id: idBtn_pormulaTypeSelectPolynom, fn: () => pormulaGetType("idBtn_pormulaTypeSelectPolynom", "Polynom"), resetValue: "Polynom" });
initEL({ id: idBtn_pormulaPolyFit, fn: pormulaPolyFit, resetValue: "Fit Polynom" });
initEL({ id: idVin_pormulaPrecision, fn: pormulaCalculate, resetValue: pormulaOptions.regOptionsOrig.precision });
initEL({ id: idVin_pormulaOrder, fn: pormulaCalculate, resetValue: pormulaOptions.regOptionsOrig.order });
initEL({ id: idBtn_pormulaSubInput, fn: pormulaSubInput });
initEL({ id: idBtn_pormulaAddInput, fn: pormulaAddInput });
initEL({ id: idVin_pormulaPointEntryA, fn: pormulaCalculate, resetValue: pormulaOptions.valuesOrig[0] });
initEL({ id: idVin_pormulaPointEntryB, fn: pormulaCalculate, resetValue: pormulaOptions.valuesOrig[1] });
initEL({ id: idVin_pormulaPointEntryC, fn: pormulaCalculate, resetValue: pormulaOptions.valuesOrig[2] });
initEL({ id: idVin_Pormula_x0, fn: pormulaCalculate, resetValue: 1 });
initEL({ id: idVin_Pormula_y0, fn: pormulaCalculate, resetValue: 1 });
initEL({ id: idVin_Pormula_x1, fn: pormulaCalculate, resetValue: 2 });
initEL({ id: idVin_Pormula_y1, fn: pormulaCalculate, resetValue: 2 });
initEL({ id: idVin_Pormula_x2, fn: pormulaCalculate, resetValue: 3 });
initEL({ id: idVin_Pormula_y2, fn: pormulaCalculate, resetValue: 3 });
initEL({ id: idVin_Pormula_x3, fn: pormulaCalculate, resetValue: 4 });
initEL({ id: idVin_Pormula_y3, fn: pormulaCalculate, resetValue: 4 });
initEL({ id: idVin_Pormula_x4, fn: pormulaCalculate, resetValue: 5 });
initEL({ id: idVin_Pormula_y4, fn: pormulaCalculate, resetValue: 5 });
initEL({ id: idVin_Pormula_x5, fn: pormulaCalculate, resetValue: 6 });
initEL({ id: idVin_Pormula_y5, fn: pormulaCalculate, resetValue: 6 });
initEL({ id: idVin_Pormula_x6, fn: pormulaCalculate, resetValue: 7 });
initEL({ id: idVin_Pormula_y6, fn: pormulaCalculate, resetValue: 7 });
initEL({ id: idVin_Pormula_x7, fn: pormulaCalculate, resetValue: 8 });
initEL({ id: idVin_Pormula_y7, fn: pormulaCalculate, resetValue: 8 });

export function clear_cl_Pormula() {
  pormulaGetType();
  pormulaOptions.regOptions.order = idVin_pormulaOrder.KadReset();
  pormulaOptions.regOptions.precision = idVin_pormulaPrecision.KadReset();
  idVin_pormulaPointEntryA.KadReset();
  idVin_pormulaPointEntryB.KadReset();
  idVin_pormulaPointEntryC.KadReset();

  pormulaOptions.data.size = pormulaOptions.valuesOrig.length;
  const inputParent = dbCL("clDiv_pormulaInput", null);
  for (let i = 0; i < inputParent.length; i++) {
    const x = i < pormulaOptions.data.size ? i * 2 + 1 : "";
    const y = i < pormulaOptions.data.size ? pormulaOptions.valuesOrig[i] : "";
    dbID(`idVin_Pormula_x${i}`).KadReset({ resetValue: x });
    dbID(`idVin_Pormula_y${i}`).KadReset({ resetValue: y });
  }

  if (pormulaChart.canvas != null) {
    pormulaChart.canvas.destroy();
  }
  pormulaChart.canvas = new Chart(idCanv_promula, pormulaChart.config);
  pormulaDirInput(0); // initiate hiding/showing of input rows
  pormulaCalculate();
}

function pormulaSubInput() {
  pormulaDirInput(-1);
}
function pormulaAddInput() {
  pormulaDirInput(1);
}
function pormulaDirInput(dir) {
  pormulaOptions.data.size += dir;
  pormulaOptions.data.size = KadValue.constrain(pormulaOptions.data.size, pormulaOptions.data.minSize, pormulaOptions.data.maxSize);
  const parent = dbCL("clDiv_pormulaInput", null);
  parent.forEach((p, i) => {
    p.style.display = i < pormulaOptions.data.size ? "block" : "none";
    if (dir == 1 && i == pormulaOptions.data.size - 1) {
      dbID(`idVin_Pormula_x${i}`).value = dbID(`idVin_Pormula_x${i - 1}`).KadGet() + 1;
      dbID(`idVin_Pormula_y${i}`).value = dbID(`idVin_Pormula_y${i - 1}`).KadGet() + 1;
    }
  });
  pormulaCalculate();
}

function pormulaGetType(id, type) {
  let cl = dbCL("clBtn_pormulaTypeSelect", null);
  for (let i = 0; i < cl.length; i++) {
    KadDOM.btnColor(cl[i]);
  }
  if (id != null) {
    KadDOM.btnColor(id, "positive");
    pormulaOptions.selType = type;
  } else {
    KadDOM.btnColor(cl[0], "positive");
    pormulaOptions.selType = Object.keys(pormulaOptions.types)[0];
  }
  pormulaCalculate();
}

function pormulaReadInputs() {
  pormulaOptions.regOptions.order = idVin_pormulaOrder.KadGet();
  pormulaOptions.regOptions.precision = idVin_pormulaPrecision.KadGet();
  pormulaOptions.data.userPoints = [];
  pormulaOptions.data.uniquePoints = [];
  pormulaOptions.data.uniqueX = [];
  for (let i = 0; i < pormulaOptions.data.size; i++) {
    const x = dbID(`idVin_Pormula_x${i}`).KadGet({ failSafe: i * 2 + 1, noPlaceholder: true });
    const y = dbID(`idVin_Pormula_y${i}`).KadGet({ failSafe: pormulaOptions.valuesOrig[i], noPlaceholder: true });
    if (x != null && y != null) {
      pormulaOptions.data.userPoints.push([x, y]);
      if (!pormulaOptions.data.uniqueX.includes(x)) {
        pormulaOptions.data.uniquePoints.push({ x, y });
        pormulaOptions.data.uniqueX.push(x);
      }
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
  pormulaPoint();
  pormulaOptions.formulaResult = regType.result(pormulaOptions.reg.equation);
  dbID("idP_pormulaResult").innerHTML = pormulaOptions.formulaResult;
  dbID("idLbl_pormulaAccuracy").textContent = `${(pormulaOptions.reg.r2 * 100).toFixed(2)}%`;
  pormulaUpdateChart();
}

function pormulaError() {
  dbID("idP_pormulaResult").innerHTML = "---";
  dbID("idLbl_pormulaAccuracy").textContent = "0%";
}

function pormulaBestFit() {
  let types = Object.keys(pormulaOptions.types);
  const index = types.indexOf("Polynom");
  types.splice(index, 1);
  let bestType = null;
  let bestR = 0;
  types.forEach((t, i) => {
    pormulaOptions.types[t].calc();
    const cur = pormulaOptions.reg.r2;
    if (bestR < cur) {
      bestR = cur;
      bestType = t;
    }
  });
  if (bestType != null) {
    pormulaGetType(`idBtn_pormulaTypeSelect${bestType}`, bestType);
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
  pormulaOptions.regOptions.order = idVin_pormulaOrder.KadReset();
  pormulaGetType(`idBtn_pormulaTypeSelectPolynom`, "Polynom");
}

function pormulaPoint() {
  let p0 = idVin_pormulaPointEntryA.KadGet();
  let p1 = idVin_pormulaPointEntryB.KadGet();
  let p2 = idVin_pormulaPointEntryC.KadGet();
  let r0 = pormulaOptions.reg.predict(p0);
  let r1 = pormulaOptions.reg.predict(p1);
  let r2 = pormulaOptions.reg.predict(p2);
  pormulaOptions.data.resultPoints = [r0, r1, r2];

  dbID("idLbl_pormulaPointResultA").textContent = pormulaOptions.data.resultPoints[0][1];
  dbID("idLbl_pormulaPointResultB").textContent = pormulaOptions.data.resultPoints[1][1];
  dbID("idLbl_pormulaPointResultC").textContent = pormulaOptions.data.resultPoints[2][1];
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
  const resolution = 20;
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
  pormulaChart.config.data.datasets[1].data = pormulaOptions.data.resultPoints.map((points) => ({ x: points[0], y: points[1] }));
  pormulaChart.config.data.datasets[2].data = pormulaOptions.data.curvePoints;

  pormulaChart.canvas.update();
}
