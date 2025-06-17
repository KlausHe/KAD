import { dbID, dbIDStyle, initEL, KadColor, KadInteraction, KadRandom, KadTable } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";
import { globalValues } from "../Settings/General.js";
import { netsaonaOptions } from "./Netsaona.js";

const kaihangaOptions = {
  get canvas() {
    return { w: globalValues.mediaSizes.canvasSize.w * 0.5, h: globalValues.mediaSizes.canvasSize.h * 0.5 };
  },
  maxLength: 12,
  entries: [],
  wheel: null,
  spinning: false,
  colStart: 0,
};

initEL({ id: idVin_kaihangaEntry, action: "change", fn: kaihangaEntrySubmit, resetValue: "Enter Options" });
initEL({ id: idBtn_kaihangaEntry, fn: kaihangaEntrySubmit });

export function clear_cl_Kaihanga() {
  KadInteraction.removeContextmenu(idCanv_kaihanga);
  kaihangaOptions.colStart = KadRandom.randomIndex(globalColors.colorOptions);
  kaihangaOptions.entries = [];
  kaihangaOptions.spinning = false;
  kaihangaOptions.wheel = null;
  KadTable.clear("idTabBody_Kaihanga");
  caKA.noLoop();
  caKA.clear();
  kaihangaCreateRandomSet();
  kaihangaUpdate();
  idVin_kaihangaEntry.KadReset();
  dbID("idLbl_kaihangaResult").textContent = "Gewinner: ...";
  dbIDStyle("idLbl_kaihangaResult").backgroundColor = "";
  dbIDStyle("idCanv_kaihanga").cursor = "pointer";
}

export function canvas_cl_Kaihanga() {
  caKA.resizeCanvas(kaihangaOptions.canvas.w, kaihangaOptions.canvas.h);
  clear_cl_Kaihanga();
}

function kaihangaResult(winner) {
  kaihangaOptions.spinning = false;
  dbID("idLbl_kaihangaResult").textContent = "Gewinner: " + winner.text;
}

function kaihangaClearRow(index) {
  kaihangaOptions.entries.splice(index, 1);
  kaihangaUpdate();
}

function kaihangaEntrySubmit() {
  const value = idVin_kaihangaEntry.KadGet();
  if (value == "") return;
  kaihangaAddOption(value);
}

function kaihangaAddOption(value) {
  if (kaihangaOptions.spinning) return;
  kaihangaOptions.entries.push(value);
  idVin_kaihangaEntry.value = "";
  kaihangaUpdate();
}

function kaihangaCreateRandomSet() {
  if (kaihangaOptions.entries.length != 0) return;
  const rand = caKA.floor(caKA.random(3, 8));
  for (let i = 0; i < rand; i++) {
    kaihangaAddOption(kaihangaCreateRandomOption());
  }
}

function kaihangaCreateRandomOption() {
  let opt = netsaonaOptions.data.RandomWord.filter((w) => w.length <= kaihangaOptions.maxLength);
  return KadRandom.randomObject(opt);
}

function kaihangaWheelUpdate() {
  let segOptions = [];
  for (let i = 0; i < kaihangaOptions.entries.length; i++) {
    const col = globalColors.colorOptions[(i + kaihangaOptions.colStart) % globalColors.colorOptions.length];
    segOptions.push({
      fillStyle: col,
      strokeStyle: KadColor.stateAsArray({ colorArray: col, type: "HSL" }),
      text: kaihangaOptions.entries[i],
      num: i,
    });
  }
  kaihangaOptions.wheel = new KaihangaWheel({
    innerR: (kaihangaOptions.canvas.w * 0.1) / 2,
    outerR: (kaihangaOptions.canvas.w * 0.8) / 2,
    textFontSize: globalValues.mediaSizes.fontSize,
    segments: segOptions,
    lineWeigth: 1,
    animation: {
      duration: 2,
      spins: 4,
      callbackFinished: kaihangaResult,
      backgroundColor: globalColors.elements.background,
    },
  });
  kaihangaOptions.wheel.draw();
}

function kaihangaStart() {
  if (kaihangaOptions.spinning == true) return;
  kaihangaOptions.spinning = true;
  kaihangaCreateRandomSet();
  kaihangaUpdate();
  kaihangaOptions.wheel.animation.spins = 5;
  kaihangaOptions.wheel.animation.duration = 1 / (5 * 10);
  kaihangaOptions.wheel.startAnimation();
}

function kaihangaUpdate() {
  if (kaihangaOptions.spinning) return;
  dbID("idLbl_kaihangaResult").innerHTML = "Gewinner: ...";
  dbIDStyle("idLbl_kaihangaResult").backgroundColor = "";
  dbIDStyle("idLbl_kaihangaResult").color = "";
  kaihangaWheelUpdate();

  // const body = [
  //
  // kaihangaOptions.entries.map(item => ({type: "Colorbox", data: item. }))
  // kaihangaOptions.entries.map(item => ({data: item }))
  // ]

  // KadTable.createHTMLGrid({ id: idTab_kaihangaTable,  body });

  // return;
  KadTable.clear("idTabBody_Kaihanga");
  for (let i = 0; i < kaihangaOptions.entries.length; i++) {
    let row = KadTable.createRow("idTabBody_Kaihanga");
    row.id = `idRow_kaihanga_${i}`;
    KadTable.addCell(row, {
      names: ["kaihanga", i],
      type: "Btn",
      subGroup: "subgrid",
      img: "trash",
      ui: {
        uiSize: "width1",
        uiType: "transparent",
      },
      cellStyle: {
        textAlign: "center",
        cursor: "pointer",
      },
      cellOnclick: function () {
        kaihangaClearRow(i);
      },
    });
    KadTable.addCell(row, {
      names: ["kaihanga", i],
      type: "Colbox",
      color: kaihangaOptions.wheel.segments[i].fillStyle,
      ui: {
        uiSize: "width1",
      },
      style: {
        textAlign: "center",
      },
    });
    KadTable.addCell(row, {
      names: ["kaihanga", i],
      type: "Lbl",
      text: kaihangaOptions.entries[i],
      ui: {
        uiSize: "width12",
      },
      copy: true,
    });
  }
}

const caKA = new p5((c) => {
  c.setup = function () {
    c.canv = c.createCanvas(kaihangaOptions.canvas.w, kaihangaOptions.canvas.h);
    c.canv.id("canvasKaihanga");
    c.canv.parent("#idCanv_kaihanga");
    c.canv.mousePressed(mousePushedKaihanga);
    c.colorMode(c.HSL);
    c.angleMode(c.DEGREES);
    c.noLoop();
  };

  c.draw = function () {
    if (kaihangaOptions.entries.length > 0) {
      kaihangaOptions.wheel.update();
      kaihangaOptions.wheel.draw();
    }
  };
}, "#idCanv_kaihanga");

function mousePushedKaihanga() {
  // let speed = caKA.floor(caKA.map(caKA.mouseX, 0, kaihangaOptions.canvas.w, 1, 18));
  kaihangaStart();
}

class KaihangaWheel {
  constructor(options) {
    this.segments = options.segments;
    this.innerR = options.innerR;
    this.outerR = options.outerR;
    this.middleR = (this.outerR + this.innerR) / 2;
    this.angle = 0;
    this.pi = Math.PI / 8;
    this.animation = options.animation;
    this.lineWeight = options.lineWeigth;
    this.background = options.animation.backgroundColor;
    this.winner;
    this.winnerAngle = 0;
  }

  startAnimation() {
    this.angle = this.winnerAngle / 360;
    this.winnerAngle = caKA.random(0, 360);
    this.winner = caKA.floor((this.winnerAngle * this.segments.length) / 360);
    caKA.loop();
  }

  update() {
    if (this.pi < Math.PI) {
      const factor = Math.cos(this.pi + Math.PI) + 1;
      this.angle = factor * 360 * this.animation.spins + this.winnerAngle;
      this.pi += 0.01;
      this.draw();
    } else {
      caKA.noLoop();
      kaihangaResult(this.segments[this.winner]);
    }
  }

  draw() {
    caKA.clear();
    caKA.push();
    caKA.translate(kaihangaOptions.canvas.w / 2, kaihangaOptions.canvas.h / 2);
    caKA.rotate((this.angle + 90) * -1);
    caKA.noFill();
    caKA.stroke(globalColors.elements.line);
    caKA.strokeWeight(this.lineWeight);
    //Segments
    let seg = 360 / this.segments.length;
    for (let i = 0; i < this.segments.length; i++) {
      let a = seg * i;
      let b = seg * (i + 1);
      let xi = caKA.cos(a) * this.innerR;
      let yi = caKA.sin(a) * this.innerR;
      let xa = caKA.cos(a) * this.outerR;
      let ya = caKA.sin(a) * this.outerR;
      caKA.fill(this.segments[i].fillStyle);
      caKA.arc(0, 0, this.outerR * 2, this.outerR * 2, a, b);
      caKA.line(xi, yi, xa, ya);
      caKA.fill(this.background);
      caKA.arc(0, 0, this.innerR * 2, this.innerR * 2, a, b);
      //text
      caKA.push();
      caKA.noStroke();
      caKA.fill(this.segments[i].strokeStyle);
      caKA.textAlign(caKA.CENTER, caKA.CENTER);
      caKA.rotate(b - seg / 2);
      caKA.translate(this.middleR, 0);
      caKA.text(this.segments[i].text, 0, 0);
      caKA.pop();
    }
    if (kaihangaOptions.entries.length > 0) {
      caKA.fill(this.background);
      caKA.circle(0, 0, this.innerR * 2);
    }
    caKA.pop();
    if (kaihangaOptions.entries.length > 0) {
      caKA.push();
      let cx = 1.5;
      let cy = this.innerR * 1.5;
      caKA.translate(kaihangaOptions.canvas.w * 0.5, kaihangaOptions.canvas.h * 0.5 - this.outerR - this.lineWeight);
      caKA.noStroke();
      caKA.fill(globalColors.elements.line);
      caKA.push();
      caKA.rotate(135);
      caKA.rect(-cx, -cx, 2 * cx, cy, cx);
      caKA.pop();
      caKA.push();
      caKA.rotate(225);
      caKA.rect(-cx, -cx, 2 * cx, cy, cx);
      caKA.pop();
      caKA.pop();
    }
  }
}

// cos between 0 an 1 based on t[0,1]
// f = (1 - Math.cos(t * Math.PI)) / 2;
function kaihangaUdate() {
  if (this.pi > Math.PI) {
    caKA.noLoop();
    kaihangaResult(this.segments[this.winner]);

    return;
  }
  const factor = Math.cos(this.pi + Math.PI) + 1;
  this.angle = factor * 360 * this.animation.spins + this.winnerAngle;
  this.pi += 0.01;
  this.draw();
}

function kaihangaDraw() {
  caKA.clear();
  caKA.push();
  caKA.translate(kaihangaOptions.canvas.w / 2, kaihangaOptions.canvas.h / 2);
  caKA.rotate((this.angle + 90) * -1);
  caKA.noFill();
  caKA.stroke(globalColors.elements.line);
  caKA.strokeWeight(this.lineWeight);
  //Segments
  let seg = 360 / this.segments.length;
  for (let i = 0; i < this.segments.length; i++) {
    let a = seg * i;
    let b = seg * (i + 1);
    let xi = caKA.cos(a) * this.innerR;
    let yi = caKA.sin(a) * this.innerR;
    let xa = caKA.cos(a) * this.outerR;
    let ya = caKA.sin(a) * this.outerR;
    caKA.fill(this.segments[i].fillStyle);
    caKA.arc(0, 0, this.outerR * 2, this.outerR * 2, a, b);
    caKA.line(xi, yi, xa, ya);
    caKA.fill(this.background);
    caKA.arc(0, 0, this.innerR * 2, this.innerR * 2, a, b);
    //text
    caKA.push();
    caKA.noStroke();
    caKA.fill(this.segments[i].strokeStyle);
    caKA.textAlign(caKA.CENTER, caKA.CENTER);
    caKA.rotate(b - seg / 2);
    caKA.translate(this.middleR, 0);
    caKA.text(this.segments[i].text, 0, 0);
    caKA.pop();
  }
  if (kaihangaOptions.entries.length > 0) {
    caKA.fill(this.background);
    caKA.circle(0, 0, this.innerR * 2);
  }
  caKA.pop();
  if (kaihangaOptions.entries.length > 0) {
    caKA.push();
    let cx = 1.5;
    let cy = this.innerR * 1.5;
    caKA.translate(kaihangaOptions.canvas.w * 0.5, kaihangaOptions.canvas.h * 0.5 - this.outerR - this.lineWeight);
    caKA.noStroke();
    caKA.fill(globalColors.elements.line);
    caKA.push();
    caKA.rotate(135);
    caKA.rect(-cx, -cx, 2 * cx, cy, cx);
    caKA.pop();
    caKA.push();
    caKA.rotate(225);
    caKA.rect(-cx, -cx, 2 * cx, cy, cx);
    caKA.pop();
    caKA.pop();
  }
}
