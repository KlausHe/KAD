const sweeperOptions = {
  width: 402,
  height: 402,
  gridSize: 10,
  sweepCells: 10,
  finished: false,
  cells: []
}

function sweeperGridChange(obj) {
  sweeperOptions.gridSize = Number(obj.value);
  clear_cl_Sweeper();
};

function sweeperCellsChange(obj) {
  sweeperOptions.sweepCells = Number(obj.value);
  clear_cl_Sweeper();
};

function clear_cl_Sweeper() {
  //Clear on Start
  sweeperOptions.cells = [];
  let sweCellOptions = [];
  resetInput("idVin_sweeperGrid", sweeperOptions.gridSize)
  resetInput("idVin_sweeperSweeps", sweeperOptions.sweepCells)
  startSweeper();
  caSW.noLoop();
  unfocusSweeper();
};

function startSweeper() {
  sweeperOptions.cells = [];
  let sweCellOptions = [];
  let cellW = Math.floor(sweeperOptions.width / sweeperOptions.gridSize);
  for (let i = 0; i < sweeperOptions.gridSize; i++) {
    sweeperOptions.cells[i] = [];
    for (let j = 0; j < sweeperOptions.gridSize; j++) {
      sweeperOptions.cells[i][j] = new SweeperCell(i, j, cellW);
      sweCellOptions.push([i, j]);
    };
  };
  for (let n = 0; n < sweeperOptions.sweepCells; n++) {
    const index = randomIndex(sweCellOptions)
    const position = sweCellOptions[index];
    sweeperOptions.cells[position[0]][position[1]].sweep = true;
    sweCellOptions.splice(index, 1);
  };
  for (let i = 0; i < sweeperOptions.gridSize; i++) {
    for (let j = 0; j < sweeperOptions.gridSize; j++) {
      sweeperOptions.cells[i][j].countNeighbors();
    };
  };
  sweeperOptions.finished = false;
  caSW.redraw();
};

function sweeperCheckFinished() {
  let revealCount = 0;
  for (let i = 0; i < sweeperOptions.gridSize; i++) {
    for (let j = 0; j < sweeperOptions.gridSize; j++) {
      revealCount += (sweeperOptions.cells[i][j].revealed && !sweeperOptions.cells[i][j].flagged && !sweeperOptions.cells[i][j].sweep) ? 1 : 0;
    };
  };
  if ((revealCount + sweeperOptions.sweepCells) == sweeperOptions.gridSize * sweeperOptions.gridSize) {
    sweeperFinished(true);
  };
}

function sweeperRevealSweeps() {
  for (let i = 0; i < sweeperOptions.gridSize; i++) {
    for (let j = 0; j < sweeperOptions.gridSize; j++) {
      const cell = sweeperOptions.cells[i][j];
      if (cell.sweep) {
        cell.revealed = true
        cell.drawReveal()
        cell.drawSweep();
      }
    };
  };
}

function mousePushedSweeper() {
  if (sweeperOptions.finished) {
    startSweeper();
    return
  };
  let cellW = Math.floor(sweeperOptions.width / sweeperOptions.gridSize);
  let i = Math.floor(caSW.mouseX / cellW);
  let j = Math.floor(caSW.mouseY / cellW);
  if (window.event.shiftKey) {
    sweeperOptions.cells[i][j].flag();
  } else {
    sweeperOptions.cells[i][j].clicked();
  };
  caSW.redraw();
};

function focusSweeper() {
  dbID("idCanv_sweeper").focus();
  caSW.redraw();
}

function unfocusSweeper() {
  dbID("idCanv_sweeper").blur();
  caSW.noLoop();
}

const caSW = new p5((c) => {
  c.setup = function() {
    c.canv = c.createCanvas(sweeperOptions.width + 4, sweeperOptions.height + 4);
    c.canv.id("canvasSweeper");
    c.canv.parent('#idCanv_sweeper');
    c.canv.mousePressed(mousePushedSweeper);
    c.colorMode(c.HSL);
    c.noLoop();
    c.clear();
    c.redraw();
  };
  c.draw = function() {
    c.clear();
    if (sweeperOptions.cells.length > 0) {
      for (let i = 0; i < sweeperOptions.gridSize; i++) {
        for (let j = 0; j < sweeperOptions.gridSize; j++) {
          sweeperOptions.cells[i][j].show();
        };
      };
    };
  };
}, '#idCanv_sweeper');

function sweeperFinished(won) {
  sweeperOptions.finished = true;
  if (!won) {
    sweeperRevealSweeps();
  }
  let msgText = won ? "You won!" : "You lost!";
  timeoutCanvasFinished(caSW, {
    text2: msgText
  })
  unfocusSweeper();
};

// CELL CLASS----------------------------------------------------------------------------------------------------------------------
class SweeperCell {
  constructor(i, j, w) {
    this.i = i;
    this.j = j;
    this.w = w;
    this.x = i * w +1;
    this.y = j * w +1;
    this.r = this.w * 0.6;
    this.revealed = false;
    this.sweep = false;
    this.num = 0;
    this.flagged = false;
  };

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
      };
    };
  };

  drawUnreveal() {
    caSW.fill(0, 0, 60);
    caSW.square(this.x, this.y, this.w, this.w * 0.08);
  }

  drawReveal() {
    caSW.fill(0, 0, 80);
    caSW.square(this.x, this.y, this.w, this.w * 0.08);
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
    caSW.rect(x, y, er, this.r)
    caSW.rect(x, y + qr + er, hr, er)
    caSW.rect(x, y + hr, this.r, er)
    caSW.fill(255, 100, 50);
    caSW.triangle(x + sr, y - hr - er, x + sr, y, x - qr - er, y - qr - sr)
    //reset
    caSW.rectMode(caSW.CORNER);
    caSW.stroke(0);
  }

  clicked() {
    if (this.flagged) {
      this.flagged = false;
      return
    }
    this.revealed = true;
    if (sweeperCheckFinished()) {
      return
    }
    if (this.sweep) {
      sweeperFinished(false);
      return
    }
    if (this.num === null && !this.sweep) {
      // floodFill
      for (let iOff = -1; iOff <= 1; iOff++) {
        for (let jOff = -1; jOff <= 1; jOff++) {
          let i = this.i + iOff
          let j = this.j + jOff;
          if (i > -1 && i < sweeperOptions.gridSize && j > -1 && j < sweeperOptions.gridSize) {
            const cell = sweeperOptions.cells[i][j];
            if (!cell.sweep && !cell.revealed && !cell.flagged) {
              sweeperOptions.cells[i][j].clicked();
            };
          };
        };
      };
    };
  };

  flag() {
    if (!this.revealed) {
      this.flagged = !this.flagged;
      if (sweeperCheckFinished()) {
        return
      }
    }
  }

  countNeighbors() {
    this.num = null;
    if (this.sweep) {
      this.num = null;
    } else {
      for (let iOff = -1; iOff <= 1; iOff++) {
        for (let jOff = -1; jOff <= 1; jOff++) {
          let i = this.i + iOff
          let j = this.j + jOff;
          if (i > -1 && i < sweeperOptions.gridSize && j > -1 && j < sweeperOptions.gridSize) {
            if (sweeperOptions.cells[i][j].sweep) {
              this.num++;
            };
          };
        };
      };
    };
  };
};
