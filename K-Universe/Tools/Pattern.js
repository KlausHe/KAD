const patternOptions = {
  margin: 10,
  width: 360,
  height: 100,
  length: { //0
    val: null,
    oVal: 330,
    name: "Gesamtlänge"
  },
  side: { //1
    val: null,
    oVal: 20,
    name: "Seitenversatz"
  },
  numHoles: { //4
    val: null,
    oVal: 2,
    name: "Punkte"
  },
  asym: { //3
    val: null,
    oVal: 0,
    name: "Asymetrie"
  },
  propHoles: {
    val: null,
    oVal: 3,
    name: "Vorschlag"
  },
  holeDist: 200,
  absArr: [],
  incArr: []
};

const caPA = new p5((c) => {
  c.setup = function() {
    c.canv = c.createCanvas(patternOptions.width + 2 * patternOptions.margin, patternOptions.height + 2 * patternOptions.margin);
    c.canv.id("canvasPattern");
    c.canv.parent('#idCanv_pattern');
    c.colorMode(c.HSL);
    c.textAlign(c.CENTER, c.BOTTOM);
    c.noLoop();
  };
  c.draw = function() {
    caPA.translate(patternOptions.margin, patternOptions.margin);
  };
}, '#idCanv_pattern');

function patternResize() {
	caPA.resizeCanvas(patternOptions.width + 2 * patternOptions.margin, patternOptions.height + 2 * patternOptions.margin);
}

function clear_cl_Pattern() {
  resetInput("idVin_Pattern0", patternOptions.length.oVal)
  resetInput("idVin_Pattern1", patternOptions.side.oVal)
  resetInput("idVin_Pattern2", patternOptions.asym.oVal)
  resetInput("idVin_Pattern3", patternOptions.numHoles.oVal)

  dbID('idLbl_Pattern0').textContent = patternOptions.length.name; //gesamltänge
  dbID('idLbl_Pattern1').textContent = patternOptions.side.name; //Seitenversatz
  dbID('idLbl_Pattern2').textContent = patternOptions.asym.name; //Asymmetrie
  dbID('idLbl_Pattern3').textContent = patternOptions.numHoles.name; //Punkte
  calcPattern();
};

function calcPattern() {
  patternOptions.length.val = numberFromInput("idVin_Pattern0", patternOptions.length.oVal);
  patternOptions.side.val = numberFromInput("idVin_Pattern1", patternOptions.side.oVal);
  patternOptions.asym.val = numberFromInput("idVin_Pattern2", patternOptions.asym.oVal);
  patternOptions.numHoles.val = numberFromInput("idVin_Pattern3", patternOptions.numHoles.oVal);

  //correct based on Length
  patternOptions.side.val = (patternOptions.length.val <= 2 * patternOptions.side.val) ? 0 : patternOptions.side.val;

  let minAbstand = patternOptions.length.val - 2 * patternOptions.side.val;
  if (minAbstand > patternOptions.holeDist) {
    patternOptions.propHoles.val = 1 + Math.ceil(minAbstand / patternOptions.holeDist);
  } else {
    patternOptions.propHoles.val = 2;
  };
  dbID('idVin_Pattern4').textContent = `${patternOptions.propHoles.val} Punkte`;

  //Array
  let incBasis = (patternOptions.length.val - 2 * patternOptions.side.val - patternOptions.asym.val) / (patternOptions.numHoles.val - 1);
  patternOptions.incArr = [patternOptions.side.val];
  patternOptions.absArr = [patternOptions.side.val];
  for (let i = 1; i < patternOptions.numHoles.val; i++) {
    if (patternOptions.numHoles.val % 2 !== 0) {
      if (i == Math.floor(patternOptions.numHoles.val / 2) || i == Math.floor(patternOptions.numHoles.val / 2 + 1)) {
        patternOptions.incArr.push(incBasis + patternOptions.asym.val / 2);
      } else {
        patternOptions.incArr.push(incBasis);
      };
    } else {
      if (i == Math.floor((patternOptions.numHoles.val) / 2)) {
        patternOptions.incArr.push(incBasis + patternOptions.asym.val);
      } else {
        patternOptions.incArr.push(incBasis);
      };
    };
    patternOptions.absArr.push(patternOptions.incArr[i] + patternOptions.absArr[i - 1]);
  };
  patternOptions.incArr.push(patternOptions.side.val);
  patternOptions.absArr.push(patternOptions.incArr[patternOptions.numHoles.val] + patternOptions.absArr[patternOptions.numHoles.val - 1]);
  patternOptions.incArr[patternOptions.numHoles.val] = patternOptions.incArr[patternOptions.numHoles.val];
  patternOptions.absArr[patternOptions.numHoles.val] = patternOptions.absArr[patternOptions.numHoles.val];
  drawPattern();
  // tabPattern();
}

function patternProp() {
  dbID('idVin_Pattern3').value = patternOptions.propHoles.val;
  calcPattern();
}

function tabPattern() {
  clearTable("idTabBody_Pattern");
  for (let i = 0; i < patternOptions.numHoles.val; i++) {
    const row = insertTableRow("idTabBody_Pattern");
    row.id = "rowID_" + i;

    tableAddCell(row, {
      names: ["pattern", "increment", i],
      type: "Lbl",
      text: checkExponential(patternOptions.incArr[i], {
        decimals: 4
      }),
      cellStyle: {
        textAlign: "right"
      },
      copy: true
    });

    tableAddCell(row, {
      names: ["pattern", "absolut", i],
      type: "Lbl",
      text: checkExponential(patternOptions.absArr[i], {
        decimals: 4
      }),
      cellStyle: {
        textAlign: "right"
      },
      copy: true
    });
  };
};

function drawPattern() {
  caPA.clear();
  const w = patternOptions.width;
  const h = patternOptions.height - patternOptions.margin;

  //text Length top
  caPA.textSize(12);
  caPA.noStroke();
  caPA.fill(globalValues.colors.elements.line);
  caPA.strokeWeight(1);
  caPA.text(checkExponential(patternOptions.length.val, {
    decimals: 3
  }), w / 2, 10);
  //Maincontur
  caPA.stroke(globalValues.colors.elements.line);
  caPA.strokeWeight(2);
  caPA.line(0, 20, 0, h);
  caPA.line(w, 20, w, h);
  caPA.line(0, 20, w, 20);

  //measure at top
  caPA.strokeWeight(1);
  caPA.line(0, 5, 0, 20);
  caPA.line(w, 5, w, 20);
  caPA.line(0, 12, w, 12);
  //measure horizontal at bottom
  caPA.line(0, h - 20, w, h - 20);

  //draw points and measurements in kleiner schrift
  let absPos;
  let incPos;
  // caPA.textAlign(caPA.CENTER, caPA.BOTTOM);
  for (let i = 0; i < patternOptions.numHoles.val; i++) {
    absPos = (w / patternOptions.length.val) * patternOptions.absArr[i];
    incPos = (w / patternOptions.length.val) * patternOptions.incArr[i];
    caPA.strokeWeight(1);
    caPA.noFill();
    caPA.stroke(globalValues.colors.elements.line);
    //draw line and circle
    caPA.ellipse(absPos, h / 2, 5, 5);
    caPA.line(absPos, h / 2, absPos, h - 15);
    caPA.fill(globalValues.colors.elements.line);
    caPA.noStroke();
    if (incPos !== 0 && incPos != w) {
      caPA.text(checkExponential(patternOptions.incArr[i], {
        decimals: 3
      }), absPos - (incPos / 2), h - 22);
    };
    if (absPos !== 0 && absPos != w) {
      caPA.text(checkExponential(patternOptions.absArr[i], {
        decimals: 3
      }), absPos, h);
    };
  };
  caPA.fill(globalValues.colors.elements.line);
  caPA.noStroke();
  incPos = (w / patternOptions.length.val) * patternOptions.incArr[patternOptions.numHoles.val];
  if (incPos !== 0) {
    caPA.text(checkExponential(patternOptions.incArr[patternOptions.numHoles.val], {
      decimals: 2
    }), absPos + (incPos / 2), h - 25);
  };
};
