import { dbCLStyle, dbID, initEL, KadColor, KadDate, KadFile, KadRandom, KadTable } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";
import { globalValues } from "../Settings/General.js";

const lottoOptions = {
  url: "https://JohannesFriedrich.github.io/LottoNumberArchive/Lottonumbers_complete.json",
  get canvas() {
    return { w: (globalValues.mediaSizes.canvasSize.w * 3) / 4, h: globalValues.mediaSizes.canvasSize.h };
  },
  cells: [],
  selGame: "6aus49",
  randomiziation: 0,
  numberOfLatestGames: 4,
  numberOfLatestGamesOrig: 4,
  get getGame() {
    return lottoOptions.games[lottoOptions.selGame];
  },
  games: {
    "6aus49": {
      cols: 7,
      rows: 7,
      tipLength: 49, // 1 - 49
      tipStart: 1,
      tipMax: 6,
      starLength: 10, // 0 - 9
      starStart: 0,
      starMax: 1,
      draw: {
        drawID: null,
        tips: [],
        star: [],
      },
      savedSet: {},
      loadedSets: [],
    },
    // Eurojackpot: {
    // 	cols: 9,
    // 	rows: 6,
    // 	tipLength: 50, //1 - 50
    // 	tipStart: 1,
    // 	tipMax: 5,
    // 	starLength: 12, // 1-10
    // 	starStart: 1,
    // 	starMax: 2,
    // 	draw: {
    // 		drawID: null,
    // 		tips: [],
    // 		star: [],
    // 	},
    // 	savedSet: {},
    // 	loadedSets: [],
    // },
  },
};

initEL({ id: "idBtn_lottoReset", fn: lottoReset });
initEL({ id: "idBtn_lottoRandom", fn: lottoRandom });
const Sel_lottoGame = initEL({ id: "idSel_lottoGame", fn: lottoGameSelect, selList: Object.keys(lottoOptions.games), selStartValue: "6aus49" });
const Vin_lottoNumberOfGames = initEL({ id: "idVin_lottoNumberOfGames", fn: lottoGetGames, resetValue: lottoOptions.numberOfLatestGamesOrig });
const Lbl_lottoOverview = initEL({ id: "idLbl_lottoOverview", resetValue: `...` });
const Lbl_lottoShowSaved = initEL({ id: "idLbl_lottoShowSaved", resetValue: `...` });

export function clear_cl_Lotto() {
  Vin_lottoNumberOfGames.KadReset();
  lottoOptions.selGame = Sel_lottoGame.KadReset();
  lottoOptions.randomiziation = 0;
  clearTimeout(lottoOptions.randomTimeout);
  createLotto(true);
  Lbl_lottoOverview.KadReset();
  lottoUpdateSavegames();
  lottoGetGames();
}

export function canvas_cl_Lotto() {
  caLO.resizeCanvas(lottoOptions.canvas.w, lottoOptions.canvas.h);
  caLO.redraw();
}

export const storage_cl_Lotto = {
  dbName: "Lotto",
  contentName: "cl_Lotto",
  clear() {
    this.data = {
      Eurojackpot: {
        tips: [],
        star: [],
        date: null,
      },
      "6aus49": {
        tips: [],
        star: [],
        date: null,
      },
    };
  },
  getData() {
    let retData = {};
    for (const [key, values] of Object.entries(lottoOptions.games)) {
      retData[key] = {};
      retData[key]["tips"] = values.savedSet.tips;
      retData[key]["star"] = values.savedSet.star;
      retData[key]["date"] = values.savedSet.date;
    }
    return retData;
  },
  saveData(data) {
    dbCLStyle("cl_LottoSavedGame").display = "initial";
    for (const [key, values] of Object.entries(lottoOptions.games)) {
      if (data[key] != null && data[key] != "") {
        lottoOptions.games[key].savedSet["tips"] = data[key].date != null ? [...data[key].tips] : [];
        lottoOptions.games[key].savedSet["star"] = data[key].date != null ? [...data[key].star] : [];
        lottoOptions.games[key].savedSet["date"] = data[key].date != null ? data[key].date : null;
      }
    }
  },
  activateData() {
    lottoUpdateSavegames();
    lottoOptions.randomiziation = 0;
    clearTimeout(lottoOptions.randomTimeout);
    createLotto(false);
  },
};

// UserSaves----------------------------------------------------------------------------------------------------------------------

function lottoUpdateSavegames() {
  if (lottoOptions.getGame.savedSet.date == null) {
    Lbl_lottoShowSaved.textContent = "Nichts gespeichert";
  } else {
    Lbl_lottoShowSaved.textContent = KadDate.getDate(lottoOptions.getGame.savedSet.date);
  }
}

function lottoRandom() {
  lottoOptions.randomiziation = 10;
  function printRandom() {
    createLotto(true);
    let tipArr = [...Array(lottoOptions.getGame.tipLength).keys()];
    lottoOptions.getGame.savedSet.tips = KadRandom.randomSubset(tipArr, lottoOptions.getGame.tipMax);
    let starArr = [...Array(lottoOptions.getGame.starLength).keys()];
    lottoOptions.getGame.savedSet.star = KadRandom.randomSubset(starArr, lottoOptions.getGame.starMax);

    lottoOptions.randomiziation--;
    caLO.redraw();
    if (lottoOptions.randomiziation > 0) {
      lottoOptions.randomTimeout = setTimeout(printRandom, 20 * (20 - lottoOptions.randomiziation));
    } else {
      lottoOptions.randomiziation = 0;
      clearTimeout(lottoOptions.randomTimeout);
      caLO.redraw();
    }
  }
  printRandom();
}

function lottoReset() {
  lottoOptions.randomiziation = 0;
  clearTimeout(lottoOptions.randomTimeout);
  createLotto(true);
  lottoUpdateSavegames();
}

function lottoGameSelect() {
  lottoOptions.selGame = Sel_lottoGame.KadGet();
  lottoGetGames();
}

function createLotto(clear = false) {
  //Clear on Start
  if (clear === true) {
    lottoOptions.getGame.draw.drawID = null;
    lottoOptions.getGame.draw.tips = [];
    lottoOptions.getGame.draw.star = [];
    lottoOptions.getGame.savedSet.tips = [];
    lottoOptions.getGame.savedSet.star = [];
    lottoOptions.getGame.savedSet.date = null;
  }
  lottoOptions.cells = [];
  const cols = lottoOptions.getGame.cols;
  const rows = lottoOptions.getGame.rows;
  const wCell = Math.floor(lottoOptions.canvas.w / cols);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const index = i + j * cols;
      if (index < lottoOptions.getGame.tipLength) {
        lottoOptions.cells.push(new LottoCell(index + lottoOptions.getGame.tipStart, i, j, wCell, "tips"));
      }
    }
  }

  const colsStar = lottoOptions.getGame.starLength;
  const wStar = Math.floor(lottoOptions.canvas.w / colsStar);
  for (let i = 0; i < colsStar; i++) {
    lottoOptions.cells.push(new LottoCell(i + lottoOptions.getGame.starStart, i, rows, wStar, "star", wCell));
  }
  caLO.redraw();
}

async function lottoGetGames() {
  lottoOptions.numberOfLatestGames = Vin_lottoNumberOfGames.KadGet({ failSafe: lottoOptions.numberOfLatestGamesOrig });
  KadFile.loadUrlToJSON({ variable: "data", url: lottoOptions.url, callback: lottoReturn });
}

function lottoReturn(d) {
  if (d.data.length == 0) {
    const header = { data: "Keine Daten vorhanden!", multiColumn: 4 };
    KadTable.createHTMLGrid({ id: "idTab_lottoTable", header });
    return;
  }
  const lottoData = d.data.data;
  lottoOptions.getGame.loadedSets = [];

  const data = lottoData.reverse();
  for (let i = 0; i < lottoOptions.numberOfLatestGames; i++) {
    let dateArr = data[i].date.split(".");
    const date = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
    lottoOptions.getGame.loadedSets.push({
      drawDate: date,
      mainTable: data[i].Lottozahl,
      starTable: [data[i].Superzahl],
      winner: "-",
      drawID: data[i].id,
    });
  }

  const shortData = lottoOptions.getGame.loadedSets;
  let header = [{ data: "Datum" }, { data: "Nummern" }, { data: "Stars" }, { data: "Gewinner" }];
  let body = [
    //
    { data: shortData.map((item) => KadDate.getDate(item.drawDate)), settings: { onclick: lottoDrawDrawnData } },
    { data: shortData.map((item) => `${item.mainTable.join(", ")}`), settings: { onclick: lottoDrawDrawnData } },
    { data: shortData.map((item) => `${item.starTable.join(", ")}`), settings: { onclick: lottoDrawDrawnData } },
    { data: shortData.map((item) => item.winner), settings: { onclick: lottoDrawDrawnData } },
  ];

  KadTable.createHTMLGrid({ id: "idTab_lottoTable", header, body });
}

function lottoDrawDrawnData(index) {
  const entry = lottoOptions.getGame.loadedSets[index];

  if (lottoOptions.getGame.draw.drawID != entry.drawID) {
    lottoOptions.getGame.draw.drawID = entry.drawID;
    lottoOptions.getGame.draw.tips = entry.mainTable;
    lottoOptions.getGame.draw.star = entry.starTable;
  } else {
    lottoOptions.getGame.draw.drawID = null;
    lottoOptions.getGame.draw.tips = [];
    lottoOptions.getGame.draw.star = [];
  }
  caLO.redraw();
  lottoCheckCorrect();
}
// CANVAS----------------------------------------------------------------------------------------------------------------------

const caLO = new p5((c) => {
  c.setup = function () {
    c.canv = c.createCanvas(lottoOptions.canvas.w, lottoOptions.canvas.h);
    c.canv.id("canvasLotto");
    c.canv.parent("#idCanv_lotto");
    c.canv.mousePressed(mousePushedLotto);
    c.noLoop();
    c.colorMode(c.HSL);
    c.clear();
    c.redraw();
  };
  c.draw = function () {
    c.clear();
    for (let i = 0; i < lottoOptions.cells.length; i++) {
      lottoOptions.cells[i].show();
    }
  };
}, "#idCanv_lotto");

function mousePushedLotto() {
  for (let cell of lottoOptions.cells) {
    cell.clicked(Math.floor(caLO.mouseX), Math.floor(caLO.mouseY));
  }
  lottoCheckCorrect();
  caLO.redraw();
}

function focusLotto() {
  dbID("idCanv_lotto").focus();
  caLO.redraw();
}

function unfocusLotto() {
  dbID("idCanv_lotto").blur();
}

function lottoCheckCorrect() {
  let output = {
    tips: 0,
    star: 0,
  };
  for (let cell of lottoOptions.cells) {
    if (cell.selected() && cell.drawed()) {
      output[cell.type]++;
    }
  }
  Lbl_lottoOverview.innerHTML = `Tips: ${output.tips} | Star: ${output.star}`;
}

// CELL CLASS----------------------------------------------------------------------------------------------------------------------
class LottoCell {
  constructor(num, i, j, w, type, offStars = 0) {
    this.num = num;
    this.type = type;
    this.i = i;
    this.j = j;
    this.w = w;
    this.x = i * w;
    this.y = type === "star" ? j * offStars + w / 2 : j * w;
  }

  selected() {
    return (lottoOptions.getGame.savedSet.tips.includes(this.num) && this.type === "tips") || (lottoOptions.getGame.savedSet.star.includes(this.num) && this.type === "star");
  }

  drawed() {
    return (lottoOptions.getGame.draw.tips.includes(this.num) && this.type === "tips") || (lottoOptions.getGame.draw.star.includes(this.num) && this.type === "star");
  }

  show() {
    caLO.push();
    caLO.translate(this.x + this.w / 2, this.y + this.w / 2);
    caLO.strokeWeight(1);
    let col;
    if (this.selected() && this.drawed()) {
      col = globalColors.elements.btnPositive;
    } else if (this.selected()) {
      col = globalColors.elements.baseColor;
    } else if (this.drawed()) {
      col = globalColors.elements.btnNegative;
    } else {
      col = globalColors.elements.btn;
    }
    let color = caLO.color(col);
    if (lottoOptions.randomiziation > 0 && this.selected()) {
      color.setAlpha(0.5);
    }
    caLO.fill(color);
    caLO.stroke(KadColor.stateAsArray({ colorArray: col, type: "HSL" }));
    if (this.type === "tips") {
      caLO.circle(0, 0, this.w * 0.8);
      caLO.noFill();
      caLO.arc(0, 0, this.w * 0.7, this.w * 0.7, 0.2, caLO.HALF_PI);
    } else {
      let angle = caLO.TWO_PI / 5;
      let halfAngle = angle / 2.0;
      caLO.beginShape();
      for (let a = caLO.HALF_PI; a < caLO.TWO_PI + caLO.HALF_PI; a += angle) {
        let sx = Math.cos(a) * this.w * 0.25;
        let sy = Math.sin(a) * this.w * 0.25;
        caLO.vertex(sx, sy);
        sx = Math.cos(a + halfAngle) * this.w * 0.45;
        sy = Math.sin(a + halfAngle) * this.w * 0.45;
        caLO.vertex(sx, sy);
      }
      caLO.endShape(caLO.CLOSE);
    }
    caLO.textAlign(caLO.CENTER, caLO.CENTER);
    caLO.noStroke();
    caLO.stroke(KadColor.stateAsArray({ colorArray: col, type: "HSL" }));
    caLO.textSize(globalValues.mediaSizes.fontSize);
    caLO.text(this.num, 0, 2);
    caLO.pop();
  }

  clicked(mx, my) {
    const d = caLO.dist(this.x + this.w / 2, this.y + this.w / 2, mx, my);
    if (d < (this.w * 0.8) / 2) {
      if (!this.selected()) {
        if (this.type === "tips" && lottoOptions.getGame.savedSet.tips.length < lottoOptions.getGame.tipMax) {
          lottoOptions.getGame.savedSet.tips.push(this.num);
          lottoOptions.getGame.savedSet.date = new Date();
        } else if (this.type === "star" && lottoOptions.getGame.savedSet.star.length < lottoOptions.getGame.starMax) {
          lottoOptions.getGame.savedSet.star.push(this.num);
          lottoOptions.getGame.savedSet.date = new Date();
        }
        return;
      }
      if (this.type === "tips") {
        lottoOptions.getGame.savedSet.tips.splice(lottoOptions.getGame.savedSet.tips.indexOf(this.num), 1);
        return;
      }
      if (this.type === "star") {
        lottoOptions.getGame.savedSet.star.splice(lottoOptions.getGame.savedSet.star.indexOf(this.num), 1);
        return;
      }
    }
  }
}
