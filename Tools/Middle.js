import { initEL, KadInteraction, KadValue } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";
import { globalValues } from "../Settings/General.js";

const middleOptions = {
  get canvas() {
    return { w: globalValues.mediaSizes.canvasSize.w * 0.5, h: globalValues.mediaSizes.canvasSize.h / 12 };
  },
  barA: {},
  barB: {},
  dims: {},
  middle: 0,
};

const caMI = new p5((c) => {
  c.setup = function () {
    c.noLoop();
    middleOptions.dims = {};
    middleOptions.middle = middleOptions.canvas.w * 0.5;
    c.canv = c.createCanvas(middleOptions.canvas.w, middleOptions.canvas.h);
    c.canv.id("canvasMiddle");
    c.canv.parent("#idCanv_middle");
    c.colorMode(c.HSL);
  };
}, "#idCanv_middle");

const Vin_middleA = initEL({ id: "idVin_middleA", fn: calcMiddle, resetValue: 5 });
const Vin_middleB = initEL({ id: "idVin_middleB", fn: calcMiddle, resetValue: 2 });
const Lbl_middleMid = initEL({ id: "idLbl_middleMid" });
const Lbl_middleDiff = initEL({ id: "idLbl_middleDiff" });

export function clear_cl_Middle() {
  KadInteraction.removeContextmenu("idCanv_middle");
  Vin_middleA.KadReset();
  Vin_middleB.KadReset();
  middleOptions.barA = {
    hStart: 0,
    h: middleOptions.canvas.h * 0.5,
    hText: middleOptions.canvas.h * 0.25,
    get fillCol() {
      return globalColors.elements.btnPositive;
    },
    get fillText() {
      return globalColors.elements.btnPositiveText;
    },
  };
  middleOptions.barB = {
    hStart: middleOptions.canvas.h * 0.5,
    h: middleOptions.canvas.h * 0.5,
    hText: middleOptions.canvas.h * 0.75,
    get fillCol() {
      return globalColors.elements.btnNegative;
    },
    get fillText() {
      return globalColors.elements.btnNegativeText;
    },
  };
  calcMiddle();
}

export function canvas_cl_Middle() {
  caMI.resizeCanvas(middleOptions.canvas.w, middleOptions.canvas.h);
  middleShowCanvas();
}

function calcMiddle() {
  const a = Vin_middleA.KadGet();
  const b = Vin_middleB.KadGet();
  middleOptions.barA.val = a;
  middleOptions.barB.val = b;
  middleOptions.barA.text = `a: ${middleOptions.barA.val}`;
  middleOptions.barB.text = `b: ${middleOptions.barB.val}`;
  middleOptions.dims.max = Math.max(Math.abs(a), Math.abs(b));
  middleOptions.dims.mappedMax = Math.ceil((middleOptions.dims.max + 1) / 10) * 10;
  middleOptions.dims.mid = (a + b) * 0.5;
  middleOptions.dims.diff = Math.abs((a - b) * 0.5);
  middleOptions.dims.midText = KadValue.number(middleOptions.dims.mid, { decimals: 3 });
  middleOptions.dims.diffText = KadValue.number(middleOptions.dims.diff, { decimals: 3 });
  Lbl_middleMid.KadSetText(`Mitte: ${middleOptions.dims.midText}`);
  Lbl_middleDiff.KadSetText(`Differenz zur Mitte: ${middleOptions.dims.diffText}`);
  middleOptions.barA.w = caMI.map(middleOptions.barA.val, 0, middleOptions.dims.mappedMax, 0, middleOptions.middle);
  middleOptions.barB.w = caMI.map(middleOptions.barB.val, 0, middleOptions.dims.mappedMax, 0, middleOptions.middle);
  middleOptions.dims.w = caMI.map(middleOptions.dims.mid, 0, middleOptions.dims.mappedMax, 0, middleOptions.middle);
  middleShowCanvas();
}

function middleShowCanvas() {
  caMI.clear();
  caMI.strokeWeight(1);
  middleOptions.fontWidth = globalValues.mediaSizes.fontSize;
  caMI.textSize(middleOptions.fontWidth);
  middleDrawBalken(middleOptions.barA);
  middleDrawBalken(middleOptions.barB);
  //Mittenindikator
  caMI.stroke(globalColors.elements.baseColor);
  caMI.strokeWeight(2);
  caMI.line(middleOptions.middle + middleOptions.dims.w, 0, middleOptions.middle + middleOptions.dims.w, middleOptions.canvas.h);

  //Mittelstrich
  caMI.stroke(globalColors.elements.line);
  caMI.line(middleOptions.middle, 0, middleOptions.middle, middleOptions.canvas.h);
  // outer Rect
  caMI.noFill();
  caMI.rect(0, 0, middleOptions.canvas.w, middleOptions.canvas.h, globalValues.mediaSizes.radius);
}

function middleDrawBalken(bar) {
  caMI.noStroke();
  caMI.fill(bar.fillCol);
  caMI.rect(middleOptions.middle, bar.hStart, bar.w, bar.h, 0, bar.r, bar.r, 0);
  const fitA = bar.text.length * middleOptions.fontWidth < Math.abs(bar.w);
  let offset;
  if (bar.val > 0) {
    if (fitA) {
      offset = -5;
      caMI.textAlign(caMI.RIGHT, caMI.CENTER);
      caMI.fill(bar.fillText);
    } else {
      offset = 5;
      caMI.textAlign(caMI.LEFT, caMI.CENTER);
      caMI.fill(globalColors.elements.text);
    }
  } else {
    if (!fitA) {
      offset = -5;
      caMI.textAlign(caMI.RIGHT, caMI.CENTER);
      caMI.fill(globalColors.elements.text);
    } else {
      offset = 5;
      caMI.textAlign(caMI.LEFT, caMI.CENTER);
      caMI.fill(bar.fillText);
    }
  }
  caMI.text(bar.text, middleOptions.middle + bar.w + offset, bar.hText);
}
