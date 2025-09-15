import { Data_Sudoku } from "../KadData/KadData_Sudoku.js";
import { dbID, initEL, KadArray, KadDate, KadInteraction, KadRandom } from "../KadUtils/KadUtils.js";
import { timeoutCanvasFinished } from "../Main.js";
import { globalColors } from "../Settings/Color.js";
import { globalValues } from "../Settings/General.js";

const sudokuOptions = {
  get canvas() {
    return { w: globalValues.mediaSizes.canvasSize.w, h: globalValues.mediaSizes.canvasSize.h };
  },
  cells: [],
  data: Data_Sudoku,
  nums: KadArray.createIndexedArray(Data_Sudoku.length),
  usedNums: [],
  get availiableNums() {
    return this.nums.filter((obj) => {
      return !this.usedNums.includes(obj);
    });
  },
  curIndex: null,
  get board() {
    return this.data[this.curIndex];
  },
  selCells: [{ i: 0, j: 0 }],
  cellWidth: 10,
  timerInstance: null,
  timerStart: null,
  timerStop: null,
  curHighlight: null,
  mode: 1,
  errorChecked: false,
  pencilErase: false,
};

const Btn_sudokuPuzzle = initEL({ id: "idBtn_sudokuPuzzle", fn: sudokuRequest });
const Btn_sudokuClear = initEL({ id: "idBtn_sudokuClear", fn: sudokuClear });
const Btn_sudokuTimer = initEL({ id: "idBtn_sudokuTimer", fn: sudokuStopTimer });
const Btn_sudokuWrite = initEL({ id: "idBtn_sudokuWrite", fn: sudokuInputOptionChange, dataset: ["radio", "sudokuPencil"] });
const Btn_sudokuPencil = initEL({ id: "idBtn_sudokuPencil", fn: sudokuInputOptionChange, dataset: ["radio", "sudokuPencil"] });
const Btn_sudokuValidate = initEL({ id: "idBtn_sudokuValidate", fn: sudokuValidate });
const Btn_sudokuHint = initEL({ id: "idBtn_sudokuHint", fn: sudokuHint });
const Cb_sudokuAutoCheck = initEL({ id: "idCb_sudokuAutoCheck", fn: sudokuOptionChange, resetValue: sudokuOptions.errorChecked });
const Cb_sudokuErasePencils = initEL({ id: "idCb_sudokuErasePencils", fn: sudokuOptionChange, resetValue: sudokuOptions.pencilErase });
const Btn_sudokuNumOverview_1 = initEL({ id: "idBtn_sudokuNumOverview_1", fn: sudokuGroupHighlight });
const Btn_sudokuNumOverview_2 = initEL({ id: "idBtn_sudokuNumOverview_2", fn: sudokuGroupHighlight });
const Btn_sudokuNumOverview_3 = initEL({ id: "idBtn_sudokuNumOverview_3", fn: sudokuGroupHighlight });
const Btn_sudokuNumOverview_4 = initEL({ id: "idBtn_sudokuNumOverview_4", fn: sudokuGroupHighlight });
const Btn_sudokuNumOverview_5 = initEL({ id: "idBtn_sudokuNumOverview_5", fn: sudokuGroupHighlight });
const Btn_sudokuNumOverview_6 = initEL({ id: "idBtn_sudokuNumOverview_6", fn: sudokuGroupHighlight });
const Btn_sudokuNumOverview_7 = initEL({ id: "idBtn_sudokuNumOverview_7", fn: sudokuGroupHighlight });
const Btn_sudokuNumOverview_8 = initEL({ id: "idBtn_sudokuNumOverview_8", fn: sudokuGroupHighlight });
const Btn_sudokuNumOverview_9 = initEL({ id: "idBtn_sudokuNumOverview_9", fn: sudokuGroupHighlight });
const Canv_sudoku = initEL({ id: "idCanv_sudoku", action: "keydown", fn: sudokuKeyPressed });

export function clear_cl_Sudoku() {
  KadInteraction.removeContextmenu("idCanv_sudoku");
  sudokuOptions.curHighlight = null;
  sudokuOptions.usedNums = [];
  sudokuOptions.cells = [];
  sudokuOptions.cellWidth = Math.floor(sudokuOptions.canvas.w / 9);
  sudokuOptions.selCells = [{ i: 0, j: 0 }];
  Cb_sudokuAutoCheck.KadReset();
  Cb_sudokuErasePencils.KadReset();
  //print empty cells
  for (let i = 0; i < 9; i++) {
    sudokuOptions.cells[i] = [];
    for (let j = 0; j < 9; j++) {
      sudokuOptions.cells[i][j] = new SudokuCell(i, j, sudokuOptions.cellWidth, "", "");
    }
  }
  sudokuSetDoneNumbers();
  sudokuStartTimer(false);
  sudokuOptions.mode = 0;
  caSU.clear();
  sudokuInputOptionChange();
  sudokuOptionChange();
  KadInteraction.focus("idCanv_sudoku", caSU);
}

export function canvas_cl_Sudoku() {
  caSU.resizeCanvas(sudokuOptions.canvas.w, sudokuOptions.canvas.h);
  caSU.redraw();
}

function sudokuClear() {
  for (let n = 0; n < 9 * 9; n++) {
    const { i, j } = KadArray.indexTo2DxyPosition(n, 9);
    if (sudokuOptions.cells[i][j].solution === false) {
      sudokuOptions.cells[i][j].clearCell();
      sudokuOptions.cells[i][j].clearPencils();
    }
  }
  sudokuOptions.curHighlight = null;
  sudokuStartTimer(false);
  caSU.redraw();
}

function sudokuRequest() {
  sudokuOptions.curIndex = KadRandom.randomObject(sudokuOptions.availiableNums);
  sudokuOptions.usedNums.push(sudokuOptions.curIndex);
  for (let index = 0; index < 9 * 9; index++) {
    const { i, j } = KadArray.indexTo2DxyPosition(index, 9);
    const puzzle = sudokuOptions.board[0][index];
    const solution = sudokuOptions.board[1][index];
    sudokuOptions.cells[i][j] = new SudokuCell(i, j, sudokuOptions.cellWidth, puzzle, solution);
  }
  sudokuStartTimer(true);
  sudokuSetDoneNumbers();
  KadInteraction.focus("idCanv_sudoku", caSU);
}

function sudokuInputOptionChange() {
  sudokuOptions.mode = !sudokuOptions.mode;
  sudokuSetBtnColor();
  KadInteraction.focus("idCanv_sudoku", caSU);
}

function sudokuOptionChange() {
  sudokuOptions.errorChecked = Cb_sudokuAutoCheck.checked;
  sudokuOptions.pencilErase = Cb_sudokuErasePencils.checked;
  if (!sudokuOptions.errorChecked) {
    for (let index = 0; index < 9 * 9; index++) {
      const { i, j } = KadArray.indexTo2DxyPosition(index, 9);
      sudokuOptions.cells[i][j].error = false;
    }
  } else {
    sudokuErrors();
  }
  KadInteraction.focus("idCanv_sudoku", caSU);
}

function sudokuValidate() {
  let errFlag = false;
  for (let index = 0; index < 9 * 9; index++) {
    const { i, j } = KadArray.indexTo2DxyPosition(index, 9);
    if (sudokuOptions.cells[i][j].solved && sudokuOptions.cells[i][j].num != sudokuOptions.cells[i][j].solutionNum) {
      sudokuOptions.cells[i][j].error = true;
      errFlag = true;
    }
  }
  if (!errFlag) {
    alert("Everything looks good!");
  } else {
    Cb_sudokuAutoCheck.checked = true;
    sudokuOptions.errorChecked = true;
  }
  KadInteraction.focus("idCanv_sudoku", caSU);
}

function sudokuHint() {
  if (!sudokuCheckFinished()) {
    let possibilitiesA = [];
    let possibilitiesB = [];
    let possibilitiesC = [];
    for (let index = 0; index < 9 * 9; index++) {
      const { i, j } = KadArray.indexTo2DxyPosition(index, 9);
      if (!sudokuOptions.cells[i][j].solution && sudokuOptions.cells[i][j].num == "") {
        possibilitiesC.push([i, j]);
        let pencilCount = 0;
        for (let n = 0; n < sudokuOptions.cells[i][j].pencils.length; n++) {
          if (sudokuOptions.cells[i][j].pencils[n].selected) {
            pencilCount++;
          }
        }
        if (pencilCount === 3) {
          possibilitiesA.push([i, j]);
        } else if (pencilCount > 0) {
          possibilitiesB.push([i, j]);
        }
      }
    }
    let pt;
    if (possibilitiesA.length > 0) {
      // choose from Array A
      pt = caSU.random(possibilitiesA);
    } else if (possibilitiesB.length > 0) {
      // choose from Array B
      pt = caSU.random(possibilitiesB);
    } else {
      // choose a random one, that is not solved!
      pt = caSU.random(possibilitiesC);
    }
    let cell = sudokuOptions.cells[pt[0]][pt[1]];
    cell.num = cell.solutionNum;
    cell.mode = 1;
    cell.correct = true;
    cell.solution = true;
    cell.colNum.drawn = cell.colNum.hinted;
  }
  KadInteraction.focus("idCanv_sudoku", caSU);
}

function sudokuKeyPressed(event) {
  event.preventDefault(); //prevent keyinput from comming thout to the window!
  let keyInput = event.keyCode; //|| window.event
  if (keyInput == 32) {
    sudokuInputOptionChange();
  } else if (keyInput == 8) {
    //delete
    for (let n = 0; n < sudokuOptions.selCells.length; n++) {
      sudokuOptions.cells[sudokuOptions.selCells[n].i][sudokuOptions.selCells[n].j].clearCell();
    }
    sudokuSetDoneNumbers();
  } else if (keyInput == 37 || keyInput == 38 || keyInput == 39 || keyInput == 40) {
    //left arrow
    const x = keyInput == 37 || keyInput == 39 ? keyInput - 38 : 0;
    const y = keyInput == 38 || keyInput == 40 ? keyInput - 39 : 0;
    sudokuOptions.selCells.unshift({
      i: (sudokuOptions.selCells[0].i + 9 + x) % 9,
      j: (sudokuOptions.selCells[0].j + 9 + y) % 9,
    });
    sudokuShiftPressed();
  } else {
    let key = event.keyCode;
    if (key >= 97 && key <= 105) {
      key = key - 48;
    }
    key = Number(String.fromCharCode(key));
    if (key > 0 && key <= 9) {
      // loop here over all the Array ofthe "current Cells"
      for (let n = 0; n < sudokuOptions.selCells.length; n++) {
        let cell = sudokuOptions.selCells[n];
        sudokuOptions.cells[cell.i][cell.j].writeSudCell(key);
      }
      sudokuSetDoneNumbers();
    }
  }
  caSU.redraw();
}

function sudokuMousePressed() {
  sudokuOptions.selCells.unshift({
    i: Math.floor(caSU.mouseX / (sudokuOptions.canvas.w / 9)),
    j: Math.floor(caSU.mouseY / (sudokuOptions.canvas.h / 9)),
  });
  sudokuShiftPressed();
  caSU.redraw();
}

function sudokuShiftPressed() {
  if (!window.event.shiftKey) {
    sudokuOptions.selCells.splice(1);
    return;
  }

  const x = sudokuOptions.selCells[0].i;
  const y = sudokuOptions.selCells[0].j;
  if (sudokuOptions.selCells.length > 2) {
    for (let i = sudokuOptions.selCells.length - 1; i > 0; i--) {
      if (sudokuOptions.selCells[i].i == x && sudokuOptions.selCells[i].j == y) {
        sudokuOptions.selCells.splice(i, 1);
        sudokuOptions.selCells.splice(0, 1);
        return;
      }
    }
  }
}

function sudokuGroupHighlight(obj) {
  sudokuOptions.curHighlight = obj.value;
  caSU.redraw();
  KadInteraction.focus("idCanv_sudoku", caSU);
}

function sudokuSetBtnColor() {
  if (sudokuOptions.mode == 1) {
    Btn_sudokuWrite.KadRadioColor();
  } else {
    Btn_sudokuPencil.KadRadioColor();
  }
}

function sudokuSetDoneNumbers() {
  let numCount = {};
  for (let i = 1; i <= 9; i++) {
    numCount[i] = 0;
  }
  for (let index = 0; index < 9 * 9; index++) {
    const { i, j } = KadArray.indexTo2DxyPosition(index, 9);
    if (sudokuOptions.cells[i][j].num != "" && sudokuOptions.cells[i][j].mode == 1) {
      numCount[sudokuOptions.cells[i][j].num]++;
    }
  }
  for (let i = 1; i <= 9; i++) {
    let btnObj = dbID(`idBtn_sudokuNumOverview_${i}`);
    let col = null;
    if (numCount[i] == 9) col = "positive";
    if (numCount[i] > 9) col = "negative";
    btnObj.KadButtonColor(col);
    btnObj.innerHTML = i + "<sup>" + numCount[i] + "</sup>";
  }
}
const caSU = new p5((c) => {
  c.setup = function () {
    c.canv = c.createCanvas(sudokuOptions.canvas.w, sudokuOptions.canvas.h);
    c.canv.id("canvasSudoku");
    c.canv.parent("#idCanv_sudoku");
    c.canv.mousePressed(sudokuMousePressed);
    c.colorMode(c.HSL);
    c.noLoop();
    c.background(globalColors.elements.background);
  };
  c.draw = function () {
    if (sudokuOptions.cells.length > 0) {
      for (let index = 0; index < 9 * 9; index++) {
        const { i, j } = KadArray.indexTo2DxyPosition(index, 9);
        sudokuOptions.cells[i][j].show();
      }
    }
    //draw Quadrants
    let quadSud = sudokuOptions.cellWidth * 3;
    caSU.noFill();
    caSU.stroke(0);
    caSU.strokeWeight(3);
    for (let index = 0; index < 3 * 3; index++) {
      const { i, j } = KadArray.indexTo2DxyPosition(index, 3);
      caSU.square(i * quadSud, j * quadSud, quadSud);
    }
  };
}, "#idCanv_sudoku");

function sudokuCheckFinished() {
  for (let index = 0; index < 9 * 9; index++) {
    const { i, j } = KadArray.indexTo2DxyPosition(index, 9);
    if (!sudokuOptions.cells[i][j].correct) {
      return false;
    }
  }
  let time = Btn_sudokuTimer.textContent;
  sudokuStartTimer(false);
  timeoutCanvasFinished(caSU, {
    textTop: "You finished",
    textBottom: `in ${time}!`,
  });
  return true;
}

function sudokuCheckArray(cellArr) {
  let counterObj = {};
  for (let c of cellArr) {
    if (c.num == "") continue;
    if (!counterObj.hasOwnProperty(c.num)) {
      counterObj[c.num] = 1;
      continue;
    }
    counterObj[c.num]++;
  }
  const counterFiltered = Object.entries(counterObj).filter(([key, value]) => value > 1);
  if (counterFiltered.length == 0) return;
  counterObj = Object.fromEntries(counterFiltered);

  for (let cell of cellArr) {
    if (counterObj.hasOwnProperty(cell.num)) {
      sudokuOptions.cells[cell.pos.i][cell.pos.j].error = true;
    }
  }
}

function sudokuErrors() {
  //clear cells
  for (let index = 0; index < 9 * 9; index++) {
    const { i, j } = KadArray.indexTo2DxyPosition(index, 9);
    sudokuOptions.cells[i][j].error = false;
  }
  //check Spalten
  for (let i = 0; i < 9; i++) {
    sudokuCheckArray(sudokuOptions.cells[i]);
  }
  //check Reihe
  for (let j = 0; j < 9; j++) {
    let tempSudRow = [];
    for (let i = 0; i < 9; i++) {
      tempSudRow.push(sudokuOptions.cells[i][j]);
    }
    sudokuCheckArray(tempSudRow);
  }
  //check Quads
  let tempSudQuad = [];
  let x, y;
  for (let index = 0; index < 3 * 3; index++) {
    const { i, j } = KadArray.indexTo2DxyPosition(index, 3);
    tempSudQuad = [];
    for (let n = 0; n < 3; n++) {
      for (let m = 0; m < 3; m++) {
        x = m + i * 3;
        y = n + j * 3;
        tempSudQuad.push(sudokuOptions.cells[x][y]);
      }
    }
    sudokuCheckArray(tempSudQuad);
  }
}

class SudokuCell {
  constructor(i, j, w, quest, sol) {
    this.pos = {
      i: i,
      j: j,
    };
    this.w = w;
    this.x = i * w;
    this.y = j * w;
    this.solution = quest != 0;
    this.solutionNum = sol;
    this.num = quest == 0 ? "" : sol;
    this.selected = false;
    this.solved = false;
    this.mode = 1; //1 ==  big letters, 0 = pencilmarks!
    this.correct = quest != 0;
    this.error = false;
    this.highlighted = false;
    this.colCell = {
      drawn: [0, 0, 100],
      correct: [0, 0, 100],
      get error() {
        return [...globalColors.elements.btnNegative, 0.5];
      },
      selected: [60, 100, 60],
      get highlight() {
        return [...globalColors.elements.baseColor, 0.3];
      },
    };
    this.colNum = {
      drawnCol: null,
      get drawn() {
        return this.drawnCol;
      },
      set drawn(col) {
        this.drawnCol = col;
      },
      solved: [240, 100, 50],
      get solution() {
        return globalColors.elements.baseColor;
      },
      get hinted() {
        return globalColors.elements.btnPositive;
      },
    };
    this.colNum.drawn = quest == 0 ? this.colNum.solved : this.colNum.solution;
    this.createPencils();
  }

  createPencils() {
    this.pencils = [];
    this.clearPencils();
  }
  clearPencils() {
    for (let n = 0; n < 9; n++) {
      this.pencils[n] = new SudokuCell.Pencil(n, caSU.floor(this.w / 3), this.x, this.y);
    }
  }
  show() {
    caSU.fill(255);
    caSU.square(this.x, this.y, this.w);
    caSU.strokeWeight(1);
    caSU.stroke(0);
    this.chooseCellColor();
    caSU.fill(this.colCell.drawn);
    caSU.square(this.x, this.y, this.w);
    caSU.noStroke();
    caSU.textAlign(caSU.CENTER, caSU.CENTER);
    if (this.mode == 1) {
      caSU.fill(this.colNum.drawn);
      caSU.textSize(this.w * 0.7);
      caSU.text(this.num, this.x + this.w / 2, this.y + this.w / 2);
    } else if (this.mode == 0) {
      this.showAllPencils();
    }
  }

  chooseCellColor() {
    if (this.error) {
      this.colCell.drawn = this.colCell.error;
    } else if (this.num == sudokuOptions.curHighlight) {
      this.colCell.drawn = this.colCell.highlight;
    } else {
      this.colCell.drawn = this.colCell.correct;
    }
    if (sudokuOptions.selCells.some((arrObj) => JSON.stringify(arrObj) === JSON.stringify(this.pos))) {
      this.colCell.drawn = this.colCell.selected;
    }
  }

  clearCell() {
    if (!this.solution) {
      this.num = "";
      this.solved = false;
      this.correct = false;
      this.error = false;
      this.colNum.drawn = this.colNum.solved;
      if (this.mode == 0) {
        this.createPencils();
      }
      this.mode = !sudokuOptions.mode;
      //after changing to a cell check for errors!
      if (sudokuOptions.errorChecked) {
        sudokuErrors();
      }
    }
  }

  writeSudCell(val) {
    if (this.solution) return;
    if (this.num === val && sudokuOptions.mode == 1) {
      this.clearCell();
      return;
    }
    if (sudokuOptions.mode == 1) {
      this.mode = sudokuOptions.mode;
      this.solved = true;
      this.num = val;
      this.correct = this.num == this.solutionNum;
    } else if (!this.solved && sudokuOptions.mode == 0) {
      this.mode = sudokuOptions.mode;
      this.pencils[val - 1].selected = !this.pencils[val - 1].selected;
    }
    let finished = sudokuCheckFinished();
    if (!finished && sudokuOptions.errorChecked) {
      sudokuErrors();
    }
    if (sudokuOptions.pencilErase && this.num != "") {
      this.erasePencil();
    }
  }

  showAllPencils() {
    this.pencils.forEach((p) => p.showPencil());
  }
  erasePencil() {
    this.eraseSudokuPencil(sudokuOptions.cells[this.pos.i]);
    let tempSudRow = [];
    for (let i = 0; i < 9; i++) {
      tempSudRow.push(sudokuOptions.cells[i][this.pos.j]);
    }
    this.eraseSudokuPencil(tempSudRow);
    let tempSudQuad = [];
    let i = caSU.floor(this.pos.i / 3);
    let j = caSU.floor(this.pos.j / 3);
    for (let n = 0; n < 3; n++) {
      for (let m = 0; m < 3; m++) {
        let x = m + i * 3;
        let y = n + j * 3;
        tempSudQuad.push(sudokuOptions.cells[x][y]);
      }
    }
    this.eraseSudokuPencil(tempSudQuad);
  }

  eraseSudokuPencil(cellArr) {
    let num = sudokuOptions.cells[this.pos.i][this.pos.j].num;
    for (let c of cellArr) {
      sudokuOptions.cells[c.pos.i][c.pos.j].pencils[num - 1].selected = false;
    }
  }
}

SudokuCell.Pencil = class {
  constructor(id, pw, cx, cy) {
    this.pid = id;
    this.pw = pw;
    this.px = cx + (id % 3) * pw;
    this.py = cy + caSU.floor(id / 3) * pw;
    this.selected = false;
    this.sColNum = [240, 100, 50];
  }

  showPencil() {
    caSU.textSize(this.pw * 0.8);
    if (this.selected) {
      caSU.noStroke();
      caSU.fill(this.sColNum);
      caSU.text(this.pid + 1, this.px + this.pw / 2, this.py + this.pw / 2);
    }
  }
};

function sudokuStopTimer() {
  if (sudokuOptions.timerInstance != null) {
    sudokuOptions.timerStop = new Date();
    clearInterval(sudokuOptions.timerInstance);
    sudokuOptions.timerInstance = null;
  } else {
    const now = new Date();
    sudokuOptions.timerStart = now - (now - sudokuOptions.timerStop);
    sudokuOptions.timerInstance = setInterval(sudokuTimer, 1000);
  }
}

function sudokuStartTimer(start) {
  if (start) {
    clearInterval(sudokuOptions.timerInstance);
    sudokuOptions.timerStart = new Date(Date.now());
    sudokuTimer();
    sudokuOptions.timerInstance = setInterval(sudokuTimer, 1000);
  } else {
    sudokuOptions.timerStop = new Date();
    clearInterval(sudokuOptions.timerInstance);
    sudokuOptions.timerInstance = null;
  }
}

function sudokuTimer() {
  const now = new Date() - sudokuOptions.timerStart;
  const format = "mm:ss";
  const text = KadDate.getDate(now, { format });
  Btn_sudokuTimer.textContent = text;
}
