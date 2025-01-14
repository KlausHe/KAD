import { dbID, initEL, KadArray, KadInteraction, KadValue } from "../KadUtils/KadUtils.js";
import { timeoutCanvasFinished } from "../Main.js";
import { globalColors } from "../Settings/Color.js";
import { globalValues } from "../Settings/General.js";
//Vier gewinnt  empat kemenangan
const empatOptions = {
  get canvas() {
    return { w: globalValues.mediaSizes.canvasSize.w, h: globalValues.mediaSizes.canvasSize.h };
  },
  playing: false,
  won: false,
  cols: 7,
  rows: 6,
  size: null,
  speed: 1,
  moveEnabled: true,
  turns: 0,
  winCells: [],
  cells: [], // 2d-array with null and cell objects!
  curPlayer: 0,
  playersOrig: [
    ["Yellow", "#ffff00", false], //3:bot=true
    ["Red", "#ff0000", true],
  ],
  lastMove: 3,
  players: [],
};

initEL({ id: idBtn_empatStart, fn: empatStart, resetValue: "Start" });
initEL({ id: idCanv_empat, fn: empatKeyPushed });

export function clear_cl_Empat() {
  KadInteraction.removeContextmenu(idCanv_empat);
  empatOptions.cells = [];
  empatOptions.winCells = [];
  empatOptions.curPlayer = 0;
  empatOptions.players = [];
  empatOptions.turns = 0;
  //create empty cells
  empatOptions.size = Math.floor(empatOptions.canvas.w / empatOptions.cols);
  for (let i = 0; i < empatOptions.playersOrig.length; i++) {
    empatOptions.players.push(new EmpatPlayer(i));
  }
  for (let i = 0; i < empatOptions.cols; i++) {
    empatOptions.cells[i] = [];
    for (let j = 0; j < empatOptions.rows; j++) {
      empatOptions.cells[i][j] = new EmpatCell(i, j, empatOptions.size);
    }
  }
  KadInteraction.unfocus(idCanv_empat, caEM);
}
export function canvas_cl_Empat() {
  caEM.resizeCanvas(empatOptions.canvas.w, empatOptions.canvas.h);
  caEM.redraw();
}

function empatStart() {
  clear_cl_Empat();
  empatOptions.playing = !empatOptions.playing;
  if (empatOptions.playing) {
    dbID("idBtn_empatStart").textContent = "Reset";
    empatOptions.won = false;
    caEM.loop();
    KadInteraction.focus(idCanv_empat);
  } else {
    dbID("idBtn_empatStart").textContent = "Start";
    empatOptions.won = false;
    KadInteraction.unfocus(idCanv_empat, caEM);
  }
}

const caEM = new p5((c) => {
  c.setup = function () {
    c.canv_empat = c.createCanvas(empatOptions.canvas.w, empatOptions.canvas.h);
    c.canv_empat.id("canvasEmpat");
    c.canv_empat.parent("#idCanv_empat");
    c.canv_empat.mouseMoved(mouseHoverEmpat);
    c.canv_empat.mousePressed(mousePressedEmpat);
    c.frameRate(30);
    c.colorMode(c.HSL);
    c.clear();
    empatOptions.speed = 0.2;
    c.noLoop();
  };
  c.draw = function () {
    if (empatOptions.cells.length > 0) {
      c.clear();
      empatOptions.players[empatOptions.curPlayer].update();
      empatOptions.players[empatOptions.curPlayer].show();
      //draw grid
      for (let i = 0; i < empatOptions.cols; i++) {
        for (let j = 0; j < empatOptions.rows; j++) {
          empatOptions.cells[i][j].show();
        }
      }
    }
  };
}, "#idCanv_empat");

function empatCheckWinner(cell) {
  //check cols |||||
  if (emaptCheckArray(empatOptions.cells[cell.i])) return true;
  //check rows ----
  let tempRow = [];
  for (let i = 0; i < empatOptions.cols; i++) {
    tempRow.push(empatOptions.cells[i][cell.j]);
  }
  if (emaptCheckArray(tempRow)) return true;

  //check Diagonal\\\\\
  for (let i = 0; i < empatOptions.cols - 3; i++) {
    //from left to right
    for (let j = 0; j < empatOptions.rows - 3; j++) {
      //from top to bottom
      let tempArr = [];
      for (let n = 0; n < 4; n++) {
        tempArr.push(empatOptions.cells[i + n][j + n]);
      }
      if (emaptCheckArray(tempArr)) return true;
    }
  }
  //check Diagonal ////
  for (let i = 0; i < empatOptions.cols - 3; i++) {
    //from left to right
    for (let j = empatOptions.rows - 1; j >= 3; j--) {
      //from top to bottom
      let tempArr = [];
      for (let n = 0; n < 4; n++) {
        tempArr.push(empatOptions.cells[i + n][j - n]);
      }
      if (emaptCheckArray(tempArr)) return true;
    }
  }
  return false;
}

function emaptCheckArray(cellArr) {
  let counter = 0;
  let testingPlayerID = null;
  for (let i = 0; i < cellArr.length; i++) {
    if (cellArr[i].playerID == null || cellArr[i].playerID != testingPlayerID) {
      testingPlayerID = cellArr[i].playerID;
      counter = 0;
    } else {
      counter++;
      if (counter == 3) {
        empatOptions.winCells = [cellArr[i - 3], cellArr[i]];
        return true;
      }
    }
  }
  return false;
}

function empatFinished() {
  caEM.noLoop();
  // noLoop kicks in after the next cycle, so we need to wait a bit
  setTimeout(() => {
    caEM.strokeWeight(12);
    caEM.stroke(0);
    caEM.line(empatOptions.winCells[0].x, empatOptions.winCells[0].y, empatOptions.winCells[1].x, empatOptions.winCells[1].y);
    caEM.strokeWeight(4);
    caEM.stroke(empatOptions.players[empatOptions.curPlayer].color);
    caEM.line(empatOptions.winCells[0].x, empatOptions.winCells[0].y, empatOptions.winCells[1].x, empatOptions.winCells[1].y);
  }, 50);
  KadInteraction.unfocus(idCanv_empat);
  timeoutCanvasFinished(caEM, {
    textTop: `Player \"${empatOptions.players[empatOptions.curPlayer].name}\" won`,
    textBottom: `in round ${Math.floor(empatOptions.turns / 2) + 1}!`,
  });
}

function mouseHoverEmpat() {
  if (empatOptions.playing) {
    if (!empatOptions.players[empatOptions.curPlayer].dropped && !empatOptions.players[empatOptions.curPlayer].bot) {
      empatOptions.players[empatOptions.curPlayer].setPosition(Math.floor(caEM.mouseX / empatOptions.size));
    }
  }
}

function mousePressedEmpat() {
  if (empatOptions.playing) {
    if (!empatOptions.players[empatOptions.curPlayer].dropped && !empatOptions.players[empatOptions.curPlayer].bot) {
      empatOptions.players[empatOptions.curPlayer].drop();
    }
  }
}

function empatKeyPushed(event) {
  event.preventDefault();
  let keyInput = event.keyCode;
  if (!empatOptions.players[empatOptions.curPlayer].bot) {
    if (keyInput == 13 || keyInput == 32 || keyInput == 40) {
      empatOptions.players[empatOptions.curPlayer].drop();
    } else if (keyInput == 37 || keyInput == 39) {
      const dir = keyInput - 38;
      const curIndex = Math.floor(empatOptions.players[empatOptions.curPlayer].targetPos[0] / empatOptions.size);
      const newPos = (curIndex + empatOptions.cols + dir) % empatOptions.cols;
      empatOptions.players[empatOptions.curPlayer].setPosition(newPos);
    } else {
      const newPos = Number(String.fromCharCode(event.keyCode));
      if (!isNaN(newPos) && newPos !== 0 && newPos <= empatOptions.cols) {
        empatOptions.players[empatOptions.curPlayer].setPosition(newPos - 1);
      }
    }
  }
}

function empatBotOptions() {
  let opts = {
    cells: [],
    arr: [],
  };
  for (const cellCol of empatOptions.cells) {
    for (let i = cellCol.length - 1; i >= 0; i--) {
      if (cellCol[i].player === null) {
        opts.cells.push(cellCol[i]);
        opts.arr.push(cellCol[i].i);
        break;
      }
    }
  }
  return opts;
}

function botLogic() {
  const opts = empatBotOptions();
  let nextPos = null;
  for (let i = 0; i < opts.cells.length; i++) {
    for (let p = 0; p < empatOptions.players.length; p++) {
      opts.cells[i].playerID = p;
      if (empatCheckWinner(opts.cells[i])) {
        nextPos = opts.arr[i];
        break;
      }
    }
    opts.cells[i].playerID = null;
  }
  if (nextPos == null) {
    const randPos = Math.floor(KadValue.constrain(caEM.randomGaussian() + empatOptions.lastMove, 0, empatOptions.cols - 1));
    nextPos = KadArray.getNearestValueInArray(opts.arr, randPos);
  }
  empatOptions.players[empatOptions.curPlayer].setPosition(nextPos);
  setTimeout(() => {
    empatOptions.players[empatOptions.curPlayer].drop();
  }, 800);
}

class EmpatPlayer {
  constructor(i) {
    this.name = empatOptions.playersOrig[i][0];
    this.bot = empatOptions.playersOrig[i][2];
    this.color = empatOptions.playersOrig[i][1];
    this.id = i;
    this.w = empatOptions.size;
    this.wh = this.w / 2;
    this.r = Math.floor(this.w * 0.8);
    this.sliding;
    this.dropping;
    this.dropped;
    this.copycell;
    this.targetPos = [];
    this.curPos = []; // used in lerp and show
    this.reset(true);
  }
  show() {
    caEM.fill(this.color);
    caEM.noStroke();
    caEM.circle(this.curPos[0], this.curPos[1], this.r);
    let c = caEM.color(0);
    c.setAlpha(0.3);
    caEM.fill(c);
    caEM.stroke(0);
    caEM.strokeWeight(1);
    caEM.circle(this.curPos[0], this.curPos[1], this.r);
    caEM.fill(this.color);
    caEM.noStroke();
    caEM.circle(this.curPos[0], this.curPos[1], this.r * 0.8);
  }

  update() {
    this.moving(); //lerping only!
    // check if sliding is finished and if is dropped (separat)
    if (this.checkLerpFinished(0) && this.dropped) {
      //sliding is finished and dropped is pressed
      this.sliding = false;
      this.dropping = true;
    }
    if (this.checkLerpFinished(1) && !this.sliding && this.dropped) {
      //sliding is finished
      this.dropping = false;
    }

    if (!this.sliding && !this.dropping && this.dropped) {
      //link cell to player
      this.copycell.setPlayer(this);
      //check if gameEnd
      empatOptions.won = empatCheckWinner(this.copycell);
      if (empatOptions.won) {
        empatFinished();
        return;
      }
      // reset player
      this.reset();
      // get next player
      empatOptions.curPlayer = (empatOptions.curPlayer + 1) % empatOptions.players.length;
      empatOptions.turns += 1;
      if (empatOptions.players[empatOptions.curPlayer].bot) {
        setTimeout(botLogic, 1000);
      }
    }
  }

  setPosition(pos = null) {
    if (this.dropped) return;
    if (pos === null) {
      this.targetPos[0] = 0;
    }
    this.targetPos[0] = pos * this.w + this.wh;
  }

  getPosXIndex(pixPos) {
    return Math.floor(pixPos / empatOptions.size);
  }

  moving() {
    if (this.sliding && !this.dropping) {
      // lerp in x direction
      this.curPos[0] = Math.floor(caEM.lerp(this.curPos[0], this.targetPos[0], empatOptions.speed)); // (start, finish, speed)
    } else if (!this.sliding && this.dropping) {
      // lerp in y direction
      this.curPos[1] = Math.floor(caEM.lerp(this.curPos[1], this.targetPos[1], empatOptions.speed)); // (start, finish, speed)
    }
  }

  drop() {
    if (!this.dropped) {
      let i = this.getPosXIndex(this.targetPos[0]);
      for (let j = empatOptions.rows - 1; j >= 0; j--) {
        const cell = empatOptions.cells[i][j];
        if (cell.player === null) {
          this.targetPos[1] = cell.y;
          this.dropped = true;
          this.copycell = cell;
          empatOptions.lastMove = i; //used in botlogic
          return true;
        }
      }
    }
    return false;
  }

  checkLerpFinished(xyIndex) {
    if (Math.abs(this.curPos[xyIndex] - this.targetPos[xyIndex]) < 5) {
      this.curPos[xyIndex] = this.targetPos[xyIndex];
      return true;
    }
    return false;
  }

  reset(newRound = false) {
    this.sliding = true;
    this.dropping = false;
    this.dropped = false;
    this.copycell = null;
    this.curPos[1] = this.wh;
    this.targetPos[1] = this.wh;
    if (newRound) {
      this.curPos[0] = this.id * (empatOptions.canvas.w - this.w) + this.wh;
      this.targetPos[0] = this.id * (empatOptions.canvas.w - this.w) + this.wh;
    }
  }
}

class EmpatCell {
  constructor(i, j, w) {
    this.player = null;
    this.playerID = null;
    this.w = w;
    this.halfW = w / 2;
    this.r = Math.floor(w * 0.8);
    this.halfR = this.r / 2;
    this.x = i * w + w / 2;
    this.y = j * w + w / 2 + w; //CAREFULL!
    this.i = i;
    this.j = j;
    this.backgroundShape = [];
    this.createHoledField();
  }

  setPlayer(player) {
    this.player = player;
    this.playerID = player.id;
  }

  show() {
    caEM.fill(globalColors.elements.baseColor);
    caEM.noStroke();
    caEM.beginShape();
    for (let i = 0; i < this.backgroundShape.length; i++) {
      caEM.vertex(this.backgroundShape[i][0], this.backgroundShape[i][1]);
    }
    caEM.endShape();
    caEM.noFill();
    caEM.stroke(globalColors.elements.line);
    // caEM.stroke(0, 80);
    caEM.strokeWeight(1);
    caEM.ellipseMode(caEM.CENTER);
    caEM.ellipse(this.x, this.y, this.r, this.r);
    if (this.j == 0) {
      caEM.line(this.x - this.wh, this.y - this.wh, this.x + this.wh, this.y - this.wh);
    }
    if (this.j == empatOptions.rows - 1) {
      caEM.line(this.x - this.wh, this.y + this.wh, this.x + this.wh, this.y + this.wh);
    }
    caEM.line(this.x - this.wh, this.y - this.wh, this.x - this.wh, this.y + this.wh);
    caEM.line(this.x + this.wh, this.y - this.wh, this.x + this.wh, this.y + this.wh);
    if (false) {
      // debug cell
      caEM.noStroke();
      caEM.fill(globalColors.elements.line);
      caEM.textAlign(caEM.CENTER, caEM.CENTER);
      caEM.textSize(globalValues.mediaSizes.fontSize * 1.5);
      caEM.text(`${this.i},${this.j}`, this.x, this.y);
    }
    //draw Player
    if (this.player != null) {
      caEM.fill(this.player.color);
      caEM.strokeWeight(2);
      caEM.ellipse(this.x, this.y, this.r, this.r);
    }
  }

  createHoledField() {
    caEM.angleMode(caEM.DEGREES);
    this.backgroundShape.push([this.x - this.halfW, this.y - this.halfW]);
    this.backgroundShape.push([this.x - this.halfW, this.y + this.halfW]);
    this.backgroundShape.push([this.x + this.halfW, this.y + this.halfW]);
    this.backgroundShape.push([this.x + this.halfW, this.y]);
    for (let a = 0; a <= 360; a += 10) {
      let x = this.x + this.halfR * caEM.cos(a);
      let y = this.y + this.halfR * caEM.sin(a);
      this.backgroundShape.push([x, y]);
    }
    this.backgroundShape.push([this.x + this.halfW, this.y]);
    this.backgroundShape.push([this.x + this.halfW, this.y - this.halfW]);
    this.backgroundShape.push([this.x - this.halfW, this.y - this.halfW]);
  }
}
