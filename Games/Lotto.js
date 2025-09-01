import { dbCLStyle, dbID, initEL, KadColor, KadDate, KadFile, KadRandom, KadTable } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";
import { globalValues } from "../Settings/General.js";

const lottoOptions = {
  url: "https://JohannesFriedrich.github.io/LottoNumberArchive/Lottonumbers_complete.json",
  get canvas() {
    return { w: (globalValues.mediaSizes.canvasSize.w * 3) / 4, h: globalValues.mediaSizes.canvasSize.h };
  },
  inputTimer: null,
  cells: [],
  selGame: "6aus49",
  randomiziation: 0,
  numberOfLatestGames: 4,
  numberOfLatestGamesOrig: 4,
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
      loadedSets: {},
      savedSet: {},
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
    // 	loadedSets: {},
    // 	savedSet: {},
    // },
  },
};

initEL({ id: dbID("idBtn_lottoReset"), fn: lottoReset });
initEL({ id: dbID("idBtn_lottoRandom"), fn: lottoRandom });
initEL({ id: dbID("idSel_lottoGame"), fn: lottoGameSelect, selList: Object.keys(lottoOptions.games), selStartValue: "6aus49" });
initEL({ id: dbID("idVin_lottoNumberOfGames"), fn: lottoGetGames, resetValue: lottoOptions.numberOfLatestGamesOrig });
initEL({ id: dbID("idLbl_lottoOverview"), resetValue: `...` });

export function clear_cl_Lotto() {
  dbID("idVin_lottoNumberOfGames").KadReset();
  lottoOptions.selGame = dbID("idSel_lottoGame").KadReset();
  lottoOptions.randomiziation = 0;
  clearTimeout(lottoOptions.randomTimeout);
  createLotto(true);
  dbID("idLbl_lottoOverview").KadReset();
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
  if (lottoOptions.games[lottoOptions.selGame].savedSet.date == null) {
    dbID("idLbl_lottoShowSaved").textContent = "Nichts gespeichert";
  } else {
    dbID("idLbl_lottoShowSaved").textContent = KadDate.getDate(lottoOptions.games[lottoOptions.selGame].savedSet.date);
  }
}

function lottoRandom() {
  lottoOptions.randomiziation = 10;
  function printRandom() {
    createLotto(true);
    let tipArr = [...Array(lottoOptions.games[lottoOptions.selGame].tipLength).keys()];
    lottoOptions.games[lottoOptions.selGame].savedSet.tips = KadRandom.randomSubset(tipArr, lottoOptions.games[lottoOptions.selGame].tipMax);
    let starArr = [...Array(lottoOptions.games[lottoOptions.selGame].starLength).keys()];
    lottoOptions.games[lottoOptions.selGame].savedSet.star = KadRandom.randomSubset(starArr, lottoOptions.games[lottoOptions.selGame].starMax);

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
  lottoOptions.selGame = dbID("idSel_lottoGame").KadGet();
  lottoGetGames();
}

function createLotto(clear = false) {
  //Clear on Start
  if (clear === true) {
    lottoOptions.games[lottoOptions.selGame].draw.drawID = null;
    lottoOptions.games[lottoOptions.selGame].draw.tips = [];
    lottoOptions.games[lottoOptions.selGame].draw.star = [];
    lottoOptions.games[lottoOptions.selGame].savedSet.tips = [];
    lottoOptions.games[lottoOptions.selGame].savedSet.star = [];
    lottoOptions.games[lottoOptions.selGame].savedSet.date = null;
  }
  lottoOptions.cells = [];
  const cols = lottoOptions.games[lottoOptions.selGame].cols;
  const rows = lottoOptions.games[lottoOptions.selGame].rows;
  const wCell = Math.floor(lottoOptions.canvas.w / cols);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const index = i + j * cols;
      if (index < lottoOptions.games[lottoOptions.selGame].tipLength) {
        lottoOptions.cells.push(new LottoCell(index + lottoOptions.games[lottoOptions.selGame].tipStart, i, j, wCell, "tips"));
      }
    }
  }

  const colsStar = lottoOptions.games[lottoOptions.selGame].starLength;
  const wStar = Math.floor(lottoOptions.canvas.w / colsStar);
  for (let i = 0; i < colsStar; i++) {
    lottoOptions.cells.push(new LottoCell(i + lottoOptions.games[lottoOptions.selGame].starStart, i, rows, wStar, "star", wCell));
  }
  caLO.redraw();
}

async function lottoGetGames() {
  lottoOptions.numberOfLatestGames = dbID("idVin_lottoNumberOfGames").KadGet({ failSafe: lottoOptions.numberOfLatestGamesOrig });
  if (lottoOptions.inputTimer != null) {
    clearTimeout(lottoOptions.inputTimer);
    lottoOptions.inputTimer = null;
  }
  lottoOptions.inputTimer = setTimeout(() => {
    lottoOptions.inputTimer = null;
    KadFile.loadUrlToJSON({ variable: "data", url: lottoOptions.url, callback: lottoReturn });
  }, 800);
}

function lottoReturn(d) {
  // KadLog.log(d.data.data);
  lottoOptions.games[lottoOptions.selGame].loadedSets = {};
  KadTable.clear("idTabHeader_Lotto");
  KadTable.clear("idTabBody_Lotto");
  const lottoData = d.data;
  if (lottoData.length == 0) {
    const rowTh = KadTable.createRow("idTabHeader_Lotto");
    KadTable.addHeaderCell(rowTh, {
      names: ["lottoTableHeader", "date"],
      type: "Lbl",
      text: `Keine Daten für ${lottoOptions.selGame} gefunden.`,
      colSpan: 4,
      cellStyle: {
        textAlign: "center",
      },
    });
    return;
  }

  const data = lottoData.data.reverse();
  for (let i = 0; i < lottoOptions.numberOfLatestGames; i++) {
    let dateArr = data[i].date.split(".");
    const date = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
    lottoOptions.games[lottoOptions.selGame].loadedSets[i] = {
      drawDate: date,
      mainTable: data[i].Lottozahl,
      starTable: [data[i].Superzahl],
      winner: "-",
      drawID: data[i].id,
    };
  }

  //header
  const rowTh = KadTable.createRow("idTabHeader_Lotto");
  KadTable.addHeaderCell(rowTh, {
    names: ["lottoTableHeader", "date"],
    type: "Lbl",
    text: "Date",
    cellStyle: {
      textAlign: "left",
    },
  });
  KadTable.addHeaderCell(rowTh, {
    names: ["lottoTableHeader", "numbers"],
    type: "Lbl",
    text: "Numbers",
  });
  KadTable.addHeaderCell(rowTh, {
    names: ["lottoTableHeader", "star"],
    type: "Lbl",
    text: "Star",
  });
  KadTable.addHeaderCell(rowTh, {
    names: ["lottoTableHeader", "winner"],
    type: "Lbl",
    text: "Winner",
  });
  // body
  for (const [i, entry] of Object.entries(lottoOptions.games[lottoOptions.selGame].loadedSets)) {
    let row = KadTable.createRow("idTabBody_Lotto");
    //--  date
    KadTable.addCell(row, {
      names: ["lottoTable", "date", i],
      type: "Lbl",
      text: KadDate.getDate(entry.drawDate),
      cellStyle: {
        textAlign: "right",
      },
      onclick: () => {
        lottoDrawDrawnData(entry);
      },
    });
    //--  numbers
    KadTable.addCell(row, {
      names: ["lottoTable", "numbers", i],
      type: "Lbl",
      text: `${entry.mainTable.join(", ")}`,
      cellStyle: {
        textAlign: "center",
      },
      onclick: () => {
        lottoDrawDrawnData(entry);
      },
    });
    //--  star
    KadTable.addCell(row, {
      names: ["lottoTable", "star", i],
      type: "Lbl",
      text: `${entry.starTable.join(", ")}`,
      copy: true,
      cellStyle: {
        textAlign: "center",
      },
      onclick: () => {
        lottoDrawDrawnData(entry);
      },
    });
    //--  winners
    KadTable.addCell(row, {
      names: ["lottoTable", "winners", i],
      type: "Lbl",
      text: entry.winner,
      cellStyle: {
        textAlign: "center",
      },
    });
  }
}

function lottoDrawDrawnData(entry) {
  if (lottoOptions.games[lottoOptions.selGame].draw.drawID != entry.drawID) {
    lottoOptions.games[lottoOptions.selGame].draw.drawID = entry.drawID;
    lottoOptions.games[lottoOptions.selGame].draw.tips = entry.mainTable;
    lottoOptions.games[lottoOptions.selGame].draw.star = entry.starTable;
    caLO.redraw();
  } else {
    lottoOptions.games[lottoOptions.selGame].draw.drawID = null;
    lottoOptions.games[lottoOptions.selGame].draw.tips = [];
    lottoOptions.games[lottoOptions.selGame].draw.star = [];
    caLO.redraw();
  }
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
  dbID("idLbl_lottoOverview").innerHTML = `Tips: ${output.tips} | Star: ${output.star}`;
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
    return (lottoOptions.games[lottoOptions.selGame].savedSet.tips.includes(this.num) && this.type === "tips") || (lottoOptions.games[lottoOptions.selGame].savedSet.star.includes(this.num) && this.type === "star");
  }

  drawed() {
    return (lottoOptions.games[lottoOptions.selGame].draw.tips.includes(this.num) && this.type === "tips") || (lottoOptions.games[lottoOptions.selGame].draw.star.includes(this.num) && this.type === "star");
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
        if (this.type === "tips" && lottoOptions.games[lottoOptions.selGame].savedSet.tips.length < lottoOptions.games[lottoOptions.selGame].tipMax) {
          lottoOptions.games[lottoOptions.selGame].savedSet.tips.push(this.num);
          lottoOptions.games[lottoOptions.selGame].savedSet.date = new Date();
        } else if (this.type === "star" && lottoOptions.games[lottoOptions.selGame].savedSet.star.length < lottoOptions.games[lottoOptions.selGame].starMax) {
          lottoOptions.games[lottoOptions.selGame].savedSet.star.push(this.num);
          lottoOptions.games[lottoOptions.selGame].savedSet.date = new Date();
        }
        return;
      }
      if (this.type === "tips") {
        lottoOptions.games[lottoOptions.selGame].savedSet.tips.splice(lottoOptions.games[lottoOptions.selGame].savedSet.tips.indexOf(this.num), 1);
        return;
      }
      if (this.type === "star") {
        lottoOptions.games[lottoOptions.selGame].savedSet.star.splice(lottoOptions.games[lottoOptions.selGame].savedSet.star.indexOf(this.num), 1);
        return;
      }
    }
  }
}
