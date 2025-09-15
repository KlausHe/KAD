import { dbID, initEL, KadArray, KadInteraction, KadRandom } from "../KadUtils/KadUtils.js";
import { timeoutCanvasFinished } from "../Main.js";
import { globalValues } from "../Settings/General.js";

const sweeperOptions = {
  get canvas() {
    return { w: globalValues.mediaSizes.canvasSize.w, h: globalValues.mediaSizes.canvasSize.h };
  },
  gridSize: 0,
  gridSizeOrig: 10,
  sweepCells: 0,
  sweepCellsOrig: 10,
  finished: false,
  cells: [],
};

const Btn_startSweeper = initEL({ id: "idBtn_startSweeper", fn: sweeperStart });
const Vin_sweeperGrid = initEL({ id: "idVin_sweeperGrid", fn: sweeperGridChange, resetValue: sweeperOptions.gridSizeOrig });
const Vin_sweeperSweeps = initEL({ id: "idVin_sweeperSweeps", fn: sweeperCellsChange, resetValue: sweeperOptions.sweepCellsOrig });

export function clear_cl_Sweeper() {
  KadInteraction.removeContextmenu("idCanv_sweeper");
  sweeperOptions.cells = [];
  sweeperOptions.gridSize = Vin_sweeperGrid.KadReset();
  sweeperOptions.sweepCells = Vin_sweeperSweeps.KadReset();
  sweeperStartOver();
}
export function canvas_cl_Sweeper() {
  caSW.resizeCanvas(sweeperOptions.canvas.w, sweeperOptions.canvas.h);
  caSW.redraw();
}

function sweeperStartOver() {
  sweeperOptions.cells = [];
  sweeperStart();
}

function sweeperGridChange(obj) {
  sweeperOptions.gridSize = obj.target.KadGet();
  sweeperStartOver();
}

function sweeperCellsChange(obj) {
  sweeperOptions.sweepCells = obj.target.KadGet();
  sweeperStartOver();
}

function sweeperStart() {
  sweeperOptions.cells = [];
  let cellW = Math.floor(sweeperOptions.canvas.w / sweeperOptions.gridSize);
  for (let i = 0; i < sweeperOptions.gridSize; i++) {
    sweeperOptions.cells[i] = [];
    for (let j = 0; j < sweeperOptions.gridSize; j++) {
      sweeperOptions.cells[i][j] = new SweeperCell(i, j, cellW);
    }
  }
  sweeperCreateSweeps();
  sweeperCountNeighbors();
  sweeperOptions.finished = false;
  caSW.redraw();
}

function sweeperCreateSweeps() {
  let arr = KadArray.createIndexedArray(sweeperOptions.gridSize, sweeperOptions.gridSize);
  const subset = KadRandom.randomSubset(arr, sweeperOptions.sweepCells);
  for (let opt of subset) {
    sweeperOptions.cells[opt[0]][opt[1]].sweep = true;
  }
}

function sweeperCountNeighbors() {
  for (let i = 0; i < sweeperOptions.gridSize; i++) {
    for (let j = 0; j < sweeperOptions.gridSize; j++) {
      sweeperOptions.cells[i][j].countNeighbors();
    }
  }
}
function sweeperCheckFinished() {
  let revealCount = 0;
  for (let i = 0; i < sweeperOptions.gridSize; i++) {
    for (let j = 0; j < sweeperOptions.gridSize; j++) {
      revealCount += sweeperOptions.cells[i][j].revealed && !sweeperOptions.cells[i][j].flagged && !sweeperOptions.cells[i][j].sweep ? 1 : 0;
    }
  }
  if (revealCount + sweeperOptions.sweepCells == sweeperOptions.gridSize * sweeperOptions.gridSize) {
    sweeperFinished(true);
  }
}

function sweeperRevealSweeps() {
  for (let i = 0; i < sweeperOptions.gridSize; i++) {
    for (let j = 0; j < sweeperOptions.gridSize; j++) {
      const cell = sweeperOptions.cells[i][j];
      if (cell.sweep) {
        cell.revealed = true;
        cell.drawReveal();
        cell.drawSweep();
      }
    }
  }
}

function sweeperMousePushed(event) {
  if (sweeperOptions.finished) {
    sweeperStart();
    return;
  }
  let cellW = Math.floor(sweeperOptions.canvas.w / sweeperOptions.gridSize);
  let i = Math.floor(caSW.mouseX / cellW);
  let j = Math.floor(caSW.mouseY / cellW);
  if (event.button == 0) {
    sweeperOptions.cells[i][j].clicked();
  } else if (event.button == 2) {
    sweeperOptions.cells[i][j].flag();
  }
  caSW.redraw();
}

const caSW = new p5((c) => {
  c.setup = function () {
    c.canv = c.createCanvas(sweeperOptions.canvas.w, sweeperOptions.canvas.h);
    c.canv.id(dbID("canvasSweeper"));
    c.canv.parent("#idCanv_sweeper");
    c.canv.mousePressed(sweeperMousePushed);
    c.colorMode(c.HSL);
    c.noLoop();
    c.clear();
    c.redraw();
  };
  c.draw = function () {
    c.clear();
    if (sweeperOptions.cells.length > 0) {
      for (let i = 0; i < sweeperOptions.gridSize; i++) {
        for (let j = 0; j < sweeperOptions.gridSize; j++) {
          sweeperOptions.cells[i][j].show();
        }
      }
    }
  };
}, "#idCanv_sweeper");

function sweeperFinished(won) {
  sweeperOptions.finished = true;
  if (!won) {
    sweeperRevealSweeps();
  }
  timeoutCanvasFinished(caSW, {
    textBottom: won ? "You won!" : "You lost!",
  });
}

// CELL CLASS----------------------------
class SweeperCell {
  constructor(i, j, w) {
    this.i = i;
    this.j = j;
    this.w = w;
    this.x = i * w + 1;
    this.y = j * w + 1;
    this.r = this.w * 0.6;
    this.revealed = false;
    this.sweep = false;
    this.num = 0;
    this.flagged = false;
  }

  show() {
    caSW.strokeWeight(1);
    caSW.stroke(0);
    if (!this.revealed) {
      this.drawUnreveal();
      if (this.flagged) {
        this.drawFlag();
      }
    } else {
      this.drawReveal();
      if (this.sweep) {
        this.drawSweep();
      } else if (this.num != null) {
        this.drawNum();
      }
    }
  }

  drawUnreveal() {
    caSW.fill(0, 0, 60);
    caSW.square(this.x, this.y, this.w);
  }

  drawReveal() {
    caSW.fill(0, 0, 80);
    caSW.square(this.x, this.y, this.w);
  }

  drawNum() {
    caSW.textAlign(caSW.CENTER, caSW.CENTER);
    caSW.noStroke();
    caSW.fill(0, 0, 0);
    caSW.textSize(this.r);
    caSW.text(this.num, this.x + this.w / 2, this.y + this.w / 2);
  }

  drawSweep() {
    caSW.ellipseMode(caSW.CENTER, caSW.CENTER);
    caSW.fill(0, 100, 60);
    caSW.circle(this.x + this.w / 2, this.y + this.w / 2, this.r);
  }

  drawFlag() {
    const x = this.x + this.w / 2;
    const y = this.y + this.w / 2;
    const hr = this.r / 2;
    const qr = this.r / 4;
    const er = this.r / 8;
    const sr = this.r / 16;
    caSW.noStroke();
    caSW.fill(0, 0, 0);
    caSW.rectMode(caSW.CENTER);
    caSW.rect(x, y, er, this.r);
    caSW.rect(x, y + qr + er, hr, er);
    caSW.rect(x, y + hr, this.r, er);
    caSW.fill(255, 100, 50);
    caSW.triangle(x + sr, y - hr - er, x + sr, y, x - qr - er, y - qr - sr);
    //reset
    caSW.rectMode(caSW.CORNER);
    caSW.stroke(0);
  }

  clicked() {
    if (this.flagged) {
      this.flagged = false;
      return;
    }
    this.revealed = true;
    if (sweeperCheckFinished()) {
      return;
    }
    if (this.sweep) {
      sweeperFinished(false);
      return;
    }
    if (this.num === null && !this.sweep) {
      // floodFill
      for (let iOff = -1; iOff <= 1; iOff++) {
        for (let jOff = -1; jOff <= 1; jOff++) {
          let i = this.i + iOff;
          let j = this.j + jOff;
          if (i > -1 && i < sweeperOptions.gridSize && j > -1 && j < sweeperOptions.gridSize) {
            const cell = sweeperOptions.cells[i][j];
            if (!cell.sweep && !cell.revealed && !cell.flagged) {
              sweeperOptions.cells[i][j].clicked();
            }
          }
        }
      }
    }
  }

  flag() {
    if (this.revealed) return;
    this.flagged = !this.flagged;
    if (sweeperCheckFinished()) {
      return;
    }
  }

  countNeighbors() {
    this.num = null;
    if (this.sweep) return;
    for (let iOff = -1; iOff <= 1; iOff++) {
      for (let jOff = -1; jOff <= 1; jOff++) {
        let i = this.i + iOff;
        let j = this.j + jOff;
        if (i > -1 && i < sweeperOptions.gridSize && j > -1 && j < sweeperOptions.gridSize) {
          if (sweeperOptions.cells[i][j].sweep) {
            this.num++;
          }
        }
      }
    }
  }
}
