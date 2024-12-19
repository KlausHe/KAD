import { nuncDiscipuli } from "../General/Account.js";
import { dbCL, dbID, initEL, KadArray, KadColor, KadCSS, KadDOM, KadInteraction, KadRandom, KadTable } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";

const numberyOptions = {
  maxPlayerCount: 5,
  playerID: 0,
  players: [],
  get player() {
    return this.players[this.playerID];
  },
  colStart: 0,
  pairs: null,
  pairsIndex: 3,
  cells: [],
  cellCurrSel: [],
  isPlaying: false,
  cathegoryIndex: 0,
  cathegories: [
    ["Amazon", 30],
    ["Camping", 26],
    ["Furniture", 42],
    ["Sport", 46],
    ["SeaAnimals", 20],
    ["Zoo", 29],
  ],
  delay: 0,
  get availiablePairs() {
    const array = [2, 3, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 27, 28, 30, 32, 35, 36, 39, 40, 41, 42, 45, 48, 50, 52, 54, 56, 59, 60];
    return array.filter((a) => a <= this.imgCount);
  },
  get imgCount() {
    return this.cathegories[this.cathegoryIndex][1];
  },
  get cathegory() {
    return this.cathegories[this.cathegoryIndex][0];
  },
  img(id) {
    return `Data/Images/Numbery/${this.cathegory}/numbery_${this.cathegory}_${id}.svg`;
  },
};

initEL({
  id: idVin_numberyPlayer,
  fn: numberyPlayerChange,
  resetValue: 2,
  domOpts: { min: 2, max: numberyOptions.maxPlayerCount },
});
initEL({
  id: idSel_numberCategory,
  fn: numberyCathegorySelect,
  selList: numberyOptions.cathegories.map((c) => c[0]),
  selStartIndex: KadRandom.randomObject(numberyOptions.cathegories.length),
});
initEL({
  id: idSel_numberyPairs,
  fn: numberyPairsChange,
  selList: numberyOptions.availiablePairs,
  selStartIndex: KadRandom.randomObject(numberyOptions.availiablePairs.length),
});
initEL({ id: idBtn_startNumbery, fn: numberyToggleStart });

export function clear_cl_Numbery() {
  KadInteraction.removeContextmenu(idDiv_numberyImages);
  numberyOptions.colStart = KadRandom.randomIndex(globalColors.colorOptions);
  idVin_numberyPlayer.KadReset();
  numberyOptions.cathegoryIndex = idSel_numberCategory.KadReset({ index: true });
  numberyOptions.pairs = numberyOptions.availiablePairs[idSel_numberyPairs.KadReset()];
  numberyOptions.delay = KadCSS.getRoot({ value: "transitionTimeHide" }) * 1000;
  dbID("idLbl_numberyResult").textContent = "...";
  numberyMakePlayers(2);
  numberyOptions.isPlaying = false;
  let inputImg = dbCL("cl_NumberyImages");
  KadDOM.clearFirstChild(inputImg);
  numberyDisableInputs(true);
}

function numberyDisableInputs() {
  KadDOM.enableBtn("idSel_numberyPairs", !numberyOptions.isPlaying);
  KadDOM.enableBtn("idVin_numberyPlayer", !numberyOptions.isPlaying);
  KadDOM.enableBtn("idSel_numberCategory", !numberyOptions.isPlaying);
  dbID("idBtn_startNumbery").textContent = numberyOptions.isPlaying ? "Stop" : "Start";
}

function numberyLayout() {
  let result = [];
  const value = Number(numberyOptions.pairs) * 2;
  for (let i = 2; i <= Number(numberyOptions.pairs); i++) {
    if (value % i === 0) {
      result.push([i, Math.floor(value / i)]);
    }
  }
  if (result.length % 2 == 0) {
    return result[result.length / 2 - 1];
  } else {
    return result[Math.floor(result.length / 2)];
  }
}

function numberyPlayerChange() {
  let numPlayer = idVin_numberyPlayer.KadGet({ failSafe: numberyOptions.maxPlayerCount });
  numberyMakePlayers(numPlayer);
  numberyScoreBoard();
}

function numberyCathegorySelect() {
  numberyOptions.cathegoryIndex = idSel_numberCategory.KadGet({ index: true });
  const index = Math.min(numberyOptions.pairsIndex, numberyOptions.availiablePairs.length - 1);
  numberyOptions.pairsIndex = idSel_numberyPairs.KadReset({
    selList: numberyOptions.availiablePairs,
    selStartIndex: index,
  });
  numberyPairsChange();
}

function numberyPairsChange() {
  numberyOptions.pairsIndex = idSel_numberyPairs.KadGet({ index: true });
  numberyOptions.pairs = idSel_numberyPairs.KadGet();
  startNumbery();
}

function numberyToggleStart() {
  if (numberyOptions.isPlaying) {
    numberyOptions.isPlaying = false;
    dbID("idLbl_numberyResult").textContent = "...";
  } else {
    numberyOptions.isPlaying = true;
    numberyRestart();
    startNumbery();
  }
  numberyDisableInputs();
}
function numberyRestart() {
  numberyOptions.cells = [];
  numberyOptions.cellCurrSel = [];
  const result = dbID("idLbl_numberyResult");
  result.textContent = `${numberyOptions.player.name}`;
  result.style.removeProperty("--bgcNavbar");
  result.style.removeProperty("--txtNavbar");
}

function startNumbery() {
  let imgIDArr = Array.from(Array(numberyOptions.imgCount).keys());
  imgIDArr = KadRandom.shuffleData(imgIDArr);
  imgIDArr = imgIDArr.slice(0, numberyOptions.pairs); // Get sub-array of first n elements after shuffled
  imgIDArr = KadRandom.shuffleData([...imgIDArr, ...imgIDArr]); // double the images and shuffle them

  //generate Cells
  let inputImg = dbCL("cl_NumberyImages");
  KadDOM.clearFirstChild(inputImg);
  const layout = numberyLayout();
  for (let i = 0; i < layout[0]; i++) {
    const baseParent = document.createElement("div");
    baseParent.setAttribute("uiFlex", "horizontal");
    for (let j = 0; j < layout[1]; j++) {
      const index = i * layout[1] + j;
      const div = document.createElement("div");
      div.id = `idImg_numberyOptions_${index}`;
      div.setAttribute("data-ID", index);
      div.classList.add("cl_numberyDiv");
      div.onclick = () => {
        numberyCellClicked(index);
      };
      const svg = document.createElement("img");
      svg.src = numberyOptions.img(imgIDArr[index]);
      svg.setAttribute("imgSize", "numbery");
      svg.dataset.imgID = imgIDArr[index];
      svg.classList.add("numbery_imgHidden");
      div.appendChild(svg);
      numberyOptions.cells.push({ div, svg, free: true });
      baseParent.appendChild(div);
    }
    inputImg.appendChild(baseParent);
  }
  numberyScoreBoard();
}

function numberyCellClicked(index) {
  if (numberyOptions.isPlaying) {
    const cell = numberyOptions.cells[index];
    if (!cell.free) return;
    if (numberyOptions.cellCurrSel.includes[index]) return;
    if (numberyOptions.cellCurrSel.length >= 2) return;
    numberyOptions.cellCurrSel.push(index);
    cell.svg.classList.remove("numbery_imgHidden");
    cell.free = false;
    if (numberyOptions.cellCurrSel.length == 2) {
      setTimeout(() => {
        numberyCheckTwo();
      }, numberyOptions.delay);
    }
    numberyScoreBoard();
  }
}

function numberyCheckTwo() {
  const cells = [numberyOptions.cells[numberyOptions.cellCurrSel[0]], numberyOptions.cells[numberyOptions.cellCurrSel[1]]];
  if (cells[0].svg.dataset.imgID == cells[1].svg.dataset.imgID) {
    numberyOptions.player.scored();
    const c = KadColor.stateAsBool({ colorArray: numberyOptions.player.col, type: "HSL" });
    for (let cell of cells) {
      cell.div.classList.add("numbery_Div");
      cell.svg.classList.add("numbery_Svg");
      cell.div.style.setProperty("--col", KadColor.formatAsString({ colorArray: numberyOptions.player.col, type: "HSL" }));
      cell.svg.style.setProperty("--inv", c);
    }
  } else {
    cells[0].svg.classList.add("numbery_imgHidden");
    cells[1].svg.classList.add("numbery_imgHidden");
    cells[0].free = true;
    cells[1].free = true;
    numberyNextPlayer();
  }
  numberyOptions.cellCurrSel = [];
  numberyCheckFinished();
}

function numberyNextPlayer() {
  numberyOptions.playerID = (numberyOptions.playerID + 1) % numberyOptions.players.length;
  dbID("idLbl_numberyResult").textContent = `${numberyOptions.player.name}`;
}

function numberyCheckFinished() {
  for (const cell of Object.values(numberyOptions.cells)) {
    if (cell.free) return false;
  }
  numberyToggleStart();
  const result = dbID("idLbl_numberyResult");
  let maxScored = KadArray.sortArrayByKey({ array: numberyOptions.players, keys: "score", inverse: true });
  if (maxScored[0].score == maxScored[1].score) {
    result.textContent = `Unentschieden mit ${maxScored[0].score} Punkten`;
  } else {
    result.textContent = `Gewinner: ${maxScored[0].name}!`;
    result.style.setProperty("--bgcNavbar", KadColor.formatAsString({ colorArray: maxScored[0].col, type: "HSL" }));
    result.style.setProperty("--txtNavbar", KadColor.stateAsString({ colorArray: maxScored[0].col, type: "HSL" }));
  }
  return true;
}

function numberyScoreBoard() {
  const header = [{ data: "Player" }, { data: "Points" }];
  const body = [
    { data: numberyOptions.players.map((item) => item.name), settings: { noBorder: "right", backgroundColor: numberyOptions.players.map((item) => item.col) } },
    { data: numberyOptions.players.map((item) => item.score), settings: { align: "center", names: ["numberyScore"], backgroundColor: numberyOptions.players.map((item) => item.col) } },
  ];

  KadTable.createHTMLGrid({ id: "idTab_numberyTable", header, body });
}

function numberyMakePlayers(numPlayer) {
  numberyOptions.players = [];
  numberyOptions.playerID = 0;

  for (let i = 0; i < numPlayer; i++) {
    const color = globalColors.colorOptions[(i + numberyOptions.colStart) % globalColors.colorOptions.length];
    numberyOptions.players.push(new NumberyPlayer(i, color));
  }
}

class NumberyPlayer {
  constructor(i, color) {
    this.id = i;
    this.name = this.id == 0 ? nuncDiscipuli.short || `Player 1` : (this.name = `Player ${this.id + 1}`);
    this.col = color;
    this.score = 0;
  }
  scored() {
    this.score++;
    dbID(`idLbl_numberyScore_${this.id}`).textContent = this.score;
  }
}
