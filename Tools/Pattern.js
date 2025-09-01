import { dbID, initEL, KadInteraction, KadValue } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";
import { globalValues } from "../Settings/General.js";
const patternOptions = {
  get margin() {
    return globalValues.mediaSizes.canvasSize.w * 0.02;
  },
  get canvas() {
    return { w: globalValues.mediaSizes.canvasSize.w, h: globalValues.mediaSizes.canvasSize.h / 4 };
  },
  names: ["Gesamtlänge", "Seitenversatz", "Asymetrie", "Löcher", "Vorschlag"],
  // valOrig: [300, 0, 0, 3, 3],
  size: 0,
  side: 0,
  asym: 0,
  holes: 0,
  propHoles: 0,
  holeDistanceMultiplier: 2,
  absArr: [],
  style: {
    bodyStroke: 3,
    circleDiameter: 10,
  },
};

initEL({ id: dbID("idVin_patternLength"), fn: patternSize, resetValue: 300 });
initEL({ id: dbID("idVin_patternSides"), fn: patternSide, resetValue: 20 });
initEL({ id: dbID("idVin_patternAsymetry"), fn: patternAsym, resetValue: 0 });
initEL({ id: dbID("idVin_patternHoleCount"), fn: patternHoles, resetValue: 3, domOpts: { min: 2 } });

initEL({ id: dbID("idBtn_patternProposedHoleCount"), fn: patternProp });

initEL({ id: dbID("idLbl_patternLength"), resetValue: patternOptions.names[0] });
initEL({ id: dbID("idLbl_patternSides"), resetValue: patternOptions.names[1] });
initEL({ id: dbID("idLbl_patternAsymetry"), resetValue: patternOptions.names[2] });
initEL({ id: dbID("idLbl_patternHoleCount"), resetValue: patternOptions.names[3] });
initEL({ id: dbID("idLbl_patternProposedHoleCount"), resetValue: patternOptions.names[4] });

export function clear_cl_Pattern() {
  KadInteraction.removeContextmenu(dbID("idCanv_pattern"));
  patternOptions.size = dbID("idVin_patternLength").KadReset();
  patternOptions.side = dbID("idVin_patternSides").KadReset();
  patternOptions.asym = dbID("idVin_patternAsymetry").KadReset();
  patternOptions.holes = dbID("idVin_patternHoleCount").KadReset();

  calcPattern();
}

const caPA = new p5((c) => {
  c.setup = function () {
    c.canv = c.createCanvas(patternOptions.canvas.w, patternOptions.canvas.h);
    c.canv.id("canvasPattern");
    c.canv.parent("#idCanv_pattern");
    c.colorMode(c.HSL);
    c.noLoop();
  };
  c.draw = function () {
    caPA.clear();
    caPA.translate(patternOptions.margin, patternOptions.margin);
    const w = patternOptions.canvas.w - 2 * patternOptions.margin;
    const h = patternOptions.canvas.h - 2 * patternOptions.margin;
    const offsetLineTop = 0.15;
    const offsetContur = offsetLineTop + 0.15;
    const offsetPoint = offsetContur + 0.2;
    const offsetLineInc = offsetPoint + 0.2;
    const offsetTextInc = offsetLineInc + 0.1;
    const offsetLineAbs = offsetTextInc + 0.1;
    const offsetTextAbs = offsetLineAbs + 0.05;

    //Maincontur
    patternLine([0, h * offsetContur], [w, h * offsetContur], patternOptions.style.bodyStroke);
    patternLine([0, h * offsetContur], [0, h], patternOptions.style.bodyStroke);
    patternLine([w, h * offsetContur], [w, h], patternOptions.style.bodyStroke);

    //text Length top
    patternText(KadValue.number(patternOptions.size, { decimals: 3 }), [w / 2, 0]);
    patternArrowLine([0, h * offsetLineTop], [w, h * offsetLineTop]);
    patternLine([0, 0], [0, h * offsetContur]);
    patternLine([w, 0], [w, h * offsetContur]);

    let prevX;
    for (let i = 1; i < patternOptions.absArr.length; i++) {
      const currX = (patternOptions.absArr[i] / patternOptions.size) * w;
      prevX = (patternOptions.absArr[i - 1] / patternOptions.size) * w;

      if (i < patternOptions.absArr.length - 1) {
        patternPoint([currX, h * offsetPoint], patternOptions.style.bodyStroke, patternOptions.style.circleDiameter);
        patternLine([currX, h * offsetPoint], [currX, h * offsetLineAbs]);
        patternText(KadValue.number(patternOptions.absArr[i], { decimals: 3 }), [currX, h * offsetTextAbs]);
      }
      patternArrowLine([prevX, h * offsetLineInc], [currX, h * offsetLineInc]);
      patternText(KadValue.number(patternOptions.absArr[i] - patternOptions.absArr[i - 1], { decimals: 3 }), [(prevX + currX) * 0.5, h * offsetTextInc]);
    }
  };
}, "#idCanv_pattern");

export function canvas_cl_Pattern() {
  caPA.resizeCanvas(patternOptions.canvas.w, patternOptions.canvas.h);
  caPA.redraw();
}

function patternSize() {
  patternOptions.size = dbID("idVin_patternLength").KadGet();
  calcPattern();
}
function patternSide() {
  patternOptions.side = dbID("idVin_patternSides").KadGet();
  calcPattern();
}
function patternAsym() {
  patternOptions.asym = dbID("idVin_patternAsymetry").KadGet();
  calcPattern();
}
function patternHoles() {
  patternOptions.holes = dbID("idVin_patternHoleCount").KadGet();
  calcPattern();
}
function patternProp() {
  patternOptions.holes = patternOptions.propHoles;
  dbID("idVin_patternHoleCount").KadSetValue(patternOptions.propHoles);
  calcPattern();
}

function calcPattern() {
  if (patternOptions.size == 0) return;
  let side = patternOptions.side;
  const sizeToSmallForSides = patternOptions.size <= 2 * patternOptions.side;
  dbID("idVin_patternSides").KadEnable(!sizeToSmallForSides);
  if (sizeToSmallForSides) {
    side = 0;
  }

  const correctedSize = patternOptions.size - 2 * side;
  //calculate spaces between holes
  // --> without Asym when "patternOptions.holes" is uneven
  // --> with Asym when "patternOptions.holes" is even
  let asymetryinfluence = 0;
  if (patternOptions.holes % 2 == 0) {
    asymetryinfluence = patternOptions.asym;
  }
  let holeDistance = (correctedSize - asymetryinfluence) / (patternOptions.holes - 1);

  // calculate the positions
  patternOptions.absArr = [];
  for (let i = 0; i < patternOptions.holes; i++) {
    let asymAdd = 0;
    if (i >= patternOptions.holes * 0.5) {
      asymAdd = asymetryinfluence;
    }
    patternOptions.absArr[i] = side + i * holeDistance + asymAdd;
  }
  patternOptions.absArr.unshift(0);
  patternOptions.absArr.push(patternOptions.size);

  // calculate porposedHoleCount
  const orderOfPower = Math.floor(patternOptions.size).toString().length; // faster than calculate with log(n)? https://math.stackexchange.com/questions/1604448/how-to-find-out-if-a-number-is-a-hundred-or-thousand
  const holeDisatanceProposed = 10 ** (orderOfPower - 1) * patternOptions.holeDistanceMultiplier;
  patternOptions.propHoles = 1 + Math.ceil((correctedSize - asymetryinfluence) / holeDisatanceProposed);

  // redraw / show porposed holeCount
  caPA.redraw();
  dbID("idBtn_patternProposedHoleCount").KadSetText(`${patternOptions.propHoles} Punkte`);
}

function patternPoint(pos, weight, diameter) {
  caPA.stroke(globalColors.elements.line);
  caPA.strokeWeight(weight);
  caPA.noFill();
  caPA.circle(...pos, diameter);
}

function patternLine(start, end, weight = 1) {
  caPA.stroke(globalColors.elements.line);
  caPA.strokeWeight(weight);
  caPA.line(...start, ...end);
}

function patternArrowLine(start, end, weight = 1) {
  const arrowSizeX = 6;
  patternLine(start, end, weight);
  const sx = start[0];
  const sy = start[1];
  const ex = end[0];
  const ey = end[1];
  const arrowSizeY = arrowSizeX / 3;
  caPA.triangle(...start, sx + arrowSizeX, sy - arrowSizeY, sx + arrowSizeX, sy + arrowSizeY);
  caPA.triangle(...end, ex - arrowSizeX, ey - arrowSizeY, ex - arrowSizeX, ey + arrowSizeY);
}

function patternText(text, posVector) {
  caPA.textSize(globalValues.mediaSizes.fontSize);
  caPA.textAlign(caPA.CENTER, caPA.TOP);
  caPA.noStroke();
  caPA.fill(globalColors.elements.line);
  caPA.strokeWeight(1);
  caPA.text(text, ...posVector);
}
