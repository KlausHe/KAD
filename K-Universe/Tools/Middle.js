const middleOptions = {
  width: 360,
  height: 50,
  barA: {},
  barB: {},
  dims: {}
}

const caMI = new p5((c) => {
  c.setup = function() {
    c.noLoop();
    c.canv = c.createCanvas(middleOptions.width, middleOptions.height);
    c.canv.id("canvasMiddle");
    c.canv.parent('#idCanv_middle');
    c.colorMode(c.HSL);
  };
}, '#idCanv_middle');

function clear_cl_Middle() {
  resetInput("idVin_middleA", 5)
  resetInput("idVin_middleB", 2)

  middleOptions.dims = {
    r: getCssRoot("UIRadius", true, true),
    centerW: middleOptions.width * 0.5,
    outerHeight: 10
  };

  middleOptions.barA = {
    offset: 0,
    r: getCssRoot("UIRadius", true, true),
    hStart: 10,
    h: 15,
    hText: 17,
    get fillCol() {
      return globalValues.colors.elements.btnPositive
    },
    get fillText() {
      return globalValues.colors.elements.btnPositiveText
    }
  };
  middleOptions.barB = {
    offset: 0,
    r: getCssRoot("UIRadius", true, true),
    hStart: 25,
    h: 15,
    hText: 32,
    get fillCol() {
      return globalValues.colors.elements.btnNegative
    },
    get fillText() {
      return globalValues.colors.elements.btnNegativeText
    }
  };
  calcMiddle();
};

function calcMiddle() {
  const a = numberFromInput("idVin_middleA");
  const b = numberFromInput("idVin_middleB");
  middleOptions.barA.val = a;
  middleOptions.barB.val = b;
  middleOptions.barA.text = `a: ${middleOptions.barA.val}`;
  middleOptions.barB.text = `b: ${middleOptions.barB.val}`;
  middleOptions.dims.max = Math.max(Math.abs(a), Math.abs(b));
  middleOptions.dims.mappedMax = Math.ceil((middleOptions.dims.max + 1) / 10) * 10;
  middleOptions.dims.mid = (a + b) * 0.5;
  middleOptions.dims.diff = Math.abs((a - b) * 0.5);
  middleOptions.dims.midText = checkExponential(middleOptions.dims.mid, {
    decimals: 4,
    expoThreashold: 7
  });
  middleOptions.dims.diffText = checkExponential(middleOptions.dims.diff, {
    decimals: 4,
    expoThreashold: 7
  });
  dbID('idLbl_middleMid').textContent = `Mitte: ${middleOptions.dims.midText}`;
  dbID('idLbl_middleDiff').textContent = `Differenz zur Mitte: ${middleOptions.dims.diffText}`;
  dataForLabel("idLbl_middleMid", middleOptions.dims.midText);
  dataForLabel("idLbl_middleDiff", middleOptions.dims.diffText);

  middleOptions.barA.w = caMI.map(middleOptions.barA.val, 0, middleOptions.dims.mappedMax, 0, middleOptions.dims.centerW);
  middleOptions.barB.w = caMI.map(middleOptions.barB.val, 0, middleOptions.dims.mappedMax, 0, middleOptions.dims.centerW);
  middleOptions.dims.w = caMI.map(middleOptions.dims.mid, 0, middleOptions.dims.mappedMax, 0, middleOptions.dims.centerW);
  showMiddleCanvas();
};

function showMiddleCanvas() {
  caMI.clear();
  caMI.strokeWeight(1);
  middleOptions.fontWidth = getCssRoot("fontSize", true);
  caMI.textSize(middleOptions.fontWidth);
  middleDrawBalken(middleOptions.barA);
  middleDrawBalken(middleOptions.barB);
  //Mittenindikator
  caMI.stroke(globalValues.colors.elements.baseColor);
  caMI.strokeWeight(2);
  caMI.line(middleOptions.dims.centerW + middleOptions.dims.w, 0, middleOptions.dims.centerW + middleOptions.dims.w, middleOptions.height);

  //Mittelstrich
  caMI.stroke(globalValues.colors.elements.line);
  caMI.line(middleOptions.dims.centerW, 0, middleOptions.dims.centerW, middleOptions.height);
  caMI.noFill();
  caMI.rect(1, middleOptions.dims.outerHeight, middleOptions.width - 2, middleOptions.height - 2 * middleOptions.dims.outerHeight, middleOptions.dims.r, middleOptions.dims.r, middleOptions.dims.r, middleOptions.dims.r);
};

function middleDrawBalken(bar) {
  caMI.noStroke();
  caMI.fill(bar.fillCol);
  caMI.rect(middleOptions.dims.centerW, bar.hStart, bar.w, bar.h, 0, bar.r, bar.r, 0);
  const fitA = (bar.text.length * middleOptions.fontWidth) < Math.abs(bar.w)
  if (bar.val > 0) {
    if (fitA) {
      bar.offset = -5;
      caMI.textAlign(caMI.RIGHT, caMI.CENTER);
      caMI.fill(bar.fillText);
    } else {
      bar.offset = 5;
      caMI.textAlign(caMI.LEFT, caMI.CENTER);
      caMI.fill(globalValues.colors.elements.text);
    };
  } else {
    if (!fitA) {
      bar.offset = -5;
      caMI.textAlign(caMI.RIGHT, caMI.CENTER);
      caMI.fill(globalValues.colors.elements.text);
    } else {
      bar.offset = 5;
      caMI.textAlign(caMI.LEFT, caMI.CENTER);
      caMI.fill(bar.fillText);
    };
  };
  caMI.text(bar.text, middleOptions.dims.centerW + bar.w + bar.offset, bar.hText);
}
