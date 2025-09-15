import { dbID, dbIDStyle, deepClone, initEL, KadInteraction, KadValue } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";
import { globalValues } from "../Settings/General.js";

const pythoOptions = {
  p5Loaded: false,
  get canvas() {
    return { w: globalValues.mediaSizes.canvasSize.w * 0.5, h: globalValues.mediaSizes.canvasSize.h * 0.5 };
  },
  margin: 20,
  raduisRightAngle: 25,
  greekFont: "Arial",
  greekAlpha: "\u03B1",
  greekBeta: "\u03B2",
  inputState: [0, 1],
  inputStateOrig: [0, 1],
  vals: [],
  valsOrig: [3, 4, null, null, null],
  errorShown: false,
};

const Vin_Pytho_0 = initEL({ id: "idVin_Pytho_0", fn: pythoNewEntry, resetValue: pythoOptions.valsOrig[0] });
const Vin_Pytho_1 = initEL({ id: "idVin_Pytho_1", fn: pythoNewEntry, resetValue: pythoOptions.valsOrig[1] });
const Vin_Pytho_2 = initEL({ id: "idVin_Pytho_2", fn: pythoNewEntry, resetValue: pythoOptions.valsOrig[2] });
const Vin_Pytho_3 = initEL({ id: "idVin_Pytho_3", fn: pythoNewEntry, resetValue: pythoOptions.valsOrig[3] });
const Vin_Pytho_4 = initEL({ id: "idVin_Pytho_4", fn: pythoNewEntry, resetValue: pythoOptions.valsOrig[4] });
const Lbl_pythagorasInfo = initEL({ id: "idLbl_pythagorasInfo" });

export function clear_cl_Pythagoras() {
  KadInteraction.removeContextmenu("idCanv_pytho");
  pythoOptions.inputState = [...pythoOptions.inputStateOrig];
  for (let i = 0; i < 5; i++) {
    pythoOptions.vals[i] = dbID(`idVin_Pytho_${i}`).KadReset();
  }
  pythoShowError();
  pythoCalc();
}

export function canvas_cl_Pythagoras() {
  caPY.resizeCanvas(pythoOptions.canvas.w, pythoOptions.canvas.h);
  pythoCalc();
}

const caPY = new p5((c) => {
  c.setup = function () {
    c.canv = c.createCanvas(pythoOptions.canvas.w, pythoOptions.canvas.h);
    c.canv.id("canvasPytho");
    c.canv.parent("#idCanv_pytho");
    c.noLoop();
    c.colorMode(c.HSL);
    pythoOptions.p5Loaded = true;
  };
}, "#idCanv_pytho");

function pythoTriHypo(a, b) {
  return caPY.sqrt(a ** 2 + b ** 2);
}

function pythoTriLength(c, n) {
  return caPY.sqrt(c ** 2 - n ** 2);
}

function pythoMinusNinety(angle) {
  return caPY.HALF_PI - angle;
}

function pythoShowError(text = null) {
  pythoOptions.errorShown = text === null ? true : false;
  if (pythoOptions.errorShown) {
    dbIDStyle("idDiv_pythagorasInfo").display = "none";
  } else {
    Lbl_pythagorasInfo.KadSetTet(text);
    dbIDStyle("idDiv_pythagorasInfo").display = "initial";
  }
}

function pythoNewEntry(obj) {
  const id = obj.target.id;
  const i = Number(id.slice(-1));
  if (!pythoOptions.inputState.includes(i)) {
    pythoOptions.inputState.unshift(i);
    pythoOptions.inputState.pop();
  }
  pythoCalc();
}

function pythoCalc() {
  pythoShowError();
  pythoOptions.vals = [];
  const A = pythoOptions.inputState[0];
  const B = pythoOptions.inputState[1];
  pythoOptions.vals[A] = dbID(`idVin_Pytho_${A}`).KadGet();
  pythoOptions.vals[B] = dbID(`idVin_Pytho_${B}`).KadGet();

  if (B > 2) pythoOptions.vals[B] *= caPY.PI / 180;
  if (A > 2) pythoOptions.vals[A] *= caPY.PI / 180;
  const arr = deepClone(pythoOptions.inputState).sort();

  let a = pythoOptions.vals[0];
  let b = pythoOptions.vals[1];
  let c = pythoOptions.vals[2];
  let alpha = pythoOptions.vals[3];
  let beta = pythoOptions.vals[4];

  switch (arr.join("")) {
    case "01": //a & b
      c = pythoTriHypo(a, b);
      alpha = caPY.asin(a / c);
      beta = pythoMinusNinety(alpha);
      break;
    case "02": //a & c
      if (c <= a) {
        pythoShowError("Hypotenuse ist zu klein!");
        return;
      }
      b = pythoTriLength(c, a);
      beta = caPY.asin(b / c);
      alpha = pythoMinusNinety(beta);
      break;
    case "12": //b & c
      if (c <= b) {
        pythoShowError("Hypotenuse ist zu klein!");
        return;
      }
      a = pythoTriLength(c, b);
      alpha = Math.asin(b / c);
      beta = pythoMinusNinety(alpha);
      break;

    //Alpha
    case "03": //a & Alpha
      c = a / Math.sin(alpha);
      b = pythoTriLength(c, a);
      beta = pythoMinusNinety(alpha);
      break;
    case "13": //b & Alpha
      c = b / Math.cos(alpha);
      a = pythoTriLength(c, b);
      beta = pythoMinusNinety(alpha);
      break;
    case "23": //c & Alpha
      a = c * Math.sin(alpha);
      b = pythoTriLength(c, a);
      beta = pythoMinusNinety(alpha);
      break;

    //Beta
    case "04": //a & Beta
      c = a / Math.cos(beta);
      b = pythoTriLength(c, a);
      alpha = pythoMinusNinety(beta);
      break;
    case "14": //b & Beta
      c = b / Math.sin(beta);
      a = pythoTriLength(c, b);
      alpha = pythoMinusNinety(beta);
      break;
    case "24": //c & Beta
      a = c * Math.cos(beta);
      b = pythoTriLength(c, a);
      alpha = pythoMinusNinety(beta);
      break;
  }

  pythoOptions.vals[0] = a;
  pythoOptions.vals[1] = b;
  pythoOptions.vals[2] = c;
  pythoOptions.vals[3] = alpha;
  pythoOptions.vals[4] = beta;

  for (let i = 0; i < 5; i++) {
    if (!pythoOptions.inputState.includes(i)) {
      const val = i < 3 ? pythoOptions.vals[i].toFixed(3) : ((pythoOptions.vals[i] * 180) / caPY.PI).toFixed(3);
      dbID(`idVin_Pytho_${i}`).KadReset({ resetValue: val });
    }
  }
  drawPytho();
}

function drawPytho() {
  let drawWidth = pythoOptions.canvas.w;
  let drawHeight = pythoOptions.canvas.h;

  if (pythoOptions.vals[0] / pythoOptions.vals[1] > pythoOptions.canvas.h / pythoOptions.canvas.w) {
    //--> "Y" fixed length, Scale "X"
    drawWidth = KadValue.constrain((pythoOptions.vals[1] / pythoOptions.vals[0]) * pythoOptions.canvas.h, pythoOptions.canvas.w * 0.4, pythoOptions.canvas.w);
  } else if (pythoOptions.vals[0] / pythoOptions.vals[1] < pythoOptions.canvas.h / pythoOptions.canvas.w) {
    //--> "X" fixed length
    drawHeight = KadValue.constrain((pythoOptions.vals[0] / pythoOptions.vals[1]) * pythoOptions.canvas.w, pythoOptions.canvas.h * 0.5, pythoOptions.canvas.h);
  }

  drawWidth = drawWidth - 2 * pythoOptions.margin;
  drawHeight = drawHeight - 2 * pythoOptions.margin;

  const hyp = pythoTriHypo(drawWidth, drawHeight);
  const beta = Math.asin(drawWidth / hyp);
  const alpha = pythoMinusNinety(beta);
  let curColor = null;

  const pythoPoints = [
    { pos: [-drawWidth, 0], cornerText: "A", cornerAlign: [caPY.RIGHT, caPY.TOP], lineText: " a", lineAlign: [caPY.LEFT, caPY.CENTER] },
    { pos: [0, -drawHeight], cornerText: "B", cornerAlign: [caPY.LEFT, caPY.BOTTOM], lineText: " b", lineAlign: [caPY.CENTER, caPY.TOP] },
    { pos: [0, 0], cornerText: "C", cornerAlign: [caPY.LEFT, caPY.TOP], lineText: " c", lineAlign: [caPY.RIGHT, caPY.BOTTOM] },
    { pos: [-drawWidth, 0], angleText: ` ${pythoOptions.greekAlpha}`, angleAign: [caPY.LEFT, caPY.TOP], arcAngle: [caPY.TWO_PI - alpha, caPY.TWO_PI] },
    { pos: [0, -drawHeight], angleText: ` ${pythoOptions.greekBeta}`, angleAign: [caPY.LEFT, caPY.TOP], arcAngle: [caPY.HALF_PI, caPY.HALF_PI + beta] },
  ];

  caPY.clear();

  caPY.push();
  caPY.translate(pythoOptions.canvas.w - pythoOptions.margin, pythoOptions.canvas.h - pythoOptions.margin);
  // Basics
  pythoText(pythoPoints[0].cornerText, pythoPoints[0].pos, pythoPoints[0].cornerAlign);
  pythoText(pythoPoints[1].cornerText, pythoPoints[1].pos, pythoPoints[1].cornerAlign);
  pythoText(pythoPoints[2].cornerText, pythoPoints[2].pos, pythoPoints[2].cornerAlign);
  pythoArc(pythoPoints[2].pos, [caPY.PI, caPY.PI + caPY.HALF_PI]);

  //Colored Stuff
  // line "a"
  curColor = pythoOptions.inputState.includes(0) ? globalColors.elements.baseColor : globalColors.elements.line;
  pythoLine(pythoPoints[1].pos, pythoPoints[2].pos, curColor);
  pythoText(pythoPoints[0].lineText, [pythoPoints[1].pos[0], (pythoPoints[1].pos[1] + pythoPoints[2].pos[1]) / 2], pythoPoints[0].lineAlign, curColor);

  // // line "b"
  curColor = pythoOptions.inputState.includes(1) ? globalColors.elements.baseColor : globalColors.elements.line;
  pythoLine(pythoPoints[0].pos, pythoPoints[2].pos, curColor);
  pythoText(pythoPoints[1].lineText, [(pythoPoints[2].pos[0] + pythoPoints[0].pos[0]) / 2, pythoPoints[2].pos[1] + 5], pythoPoints[1].lineAlign, curColor);

  // // line "c"
  curColor = pythoOptions.inputState.includes(2) ? globalColors.elements.baseColor : globalColors.elements.line;
  pythoLine(pythoPoints[0].pos, pythoPoints[1].pos, curColor);
  pythoText(pythoPoints[2].lineText, [(pythoPoints[0].pos[0] + pythoPoints[1].pos[0]) / 2, (pythoPoints[0].pos[1] + pythoPoints[1].pos[1]) / 2], pythoPoints[2].lineAlign, curColor);

  // //Alpha
  curColor = pythoOptions.inputState.includes(3) ? globalColors.elements.baseColor : globalColors.elements.line;
  pythoArc(pythoPoints[3].pos, pythoPoints[3].arcAngle);
  pythoText(pythoPoints[3].angleText, pythoPoints[3].pos, pythoPoints[3].angleAign, curColor, 0.8, pythoOptions.greekFont);

  // //Beta
  curColor = pythoOptions.inputState.includes(4) ? globalColors.elements.baseColor : globalColors.elements.line;
  pythoArc(pythoPoints[4].pos, pythoPoints[4].arcAngle);
  pythoText(pythoPoints[4].angleText, pythoPoints[4].pos, pythoPoints[4].angleAign, curColor, 0.8, pythoOptions.greekFont);

  caPY.pop();
}

function pythoText(text, posVector, alignText, color = globalColors.elements.line, textSizeFactor = 1, textFont = null) {
  caPY.textSize(globalValues.mediaSizes.fontSize * textSizeFactor);
  caPY.textAlign(...alignText);
  if (textFont != null) caPY.textFont(textFont);
  caPY.noStroke();
  caPY.fill(color);
  caPY.strokeWeight(2);
  caPY.text(text, ...posVector);
}
function pythoLine(start, end, color = globalColors.elements.line) {
  caPY.stroke(color);
  caPY.fill(color);
  caPY.strokeWeight(2);
  caPY.line(...start, ...end);
}
function pythoArc(start, arcAngle, color = globalColors.elements.line) {
  caPY.noFill();
  caPY.stroke(color);
  caPY.strokeWeight(2);
  caPY.arc(...start, pythoOptions.raduisRightAngle, pythoOptions.raduisRightAngle, ...arcAngle); //B top right
}
