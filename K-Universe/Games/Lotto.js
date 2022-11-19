const lottoOptions = {
  url: "https://JohannesFriedrich.github.io/LottoNumberArchive/Lottonumbers_complete.json",
  width: 320,
  height: 400,
  getGameTimer: null,
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
        star: []
      },
      loadedSets: {},
      savedSet: {}
    },
    "Eurojackpot": {
      cols: 9,
      rows: 6,
      tipLength: 50, //1 - 50
      tipStart: 1,
      tipMax: 5,
      starLength: 12, // 1-10
      starStart: 1,
      starMax: 2,
      draw: {
        drawID: null,
        tips: [],
        star: []
      },
      loadedSets: {},
      savedSet: {}
    }
  }
};

function clear_cl_Lotto() {
  // for (let i = 0; i < Object.keys(lottoOptions.games).length; i++) {
  for (let i = 0; i < 1; i++) {
    dbID("idSel_lottoGame").options[i] = new Option(Object.keys(lottoOptions.games)[i]);
  }
  resetInput("idVin_lottoNumberOfGames", lottoOptions.numberOfLatestGamesOrig)
  lottoOptions.selGame = Object.keys(lottoOptions.games)[0]
  lottoOptions.randomiziation = 0;

  clearTimeout(lottoOptions.randomTimeout);
  createLotto(true);
  dbID("idLbl_lottoOverview").textContent = `...`;

  enableBtn("idBtn_lottoShowSaved", nuncDiscipuli.checkLogin);
  dbID("idBtn_lottoShowSaved").textContent = "...";
  lottoGetGames();
};

// UserSaves----------------------------------------------------------------------------------------------------------------------

function lottoShowSaved() {
  console.log("show saved");
};

function lottoUpdateSavegames() {
  console.log("update");
  enableBtn("idBtn_lottoShowSaved", nuncDiscipuli.checkLogin);
  if ((lottoOptions.games[lottoOptions.selGame].savedSet.length > 0) && lottoOptions.games[lottoOptions.selGame].savedSet.date != null) {
    dbID("idBtn_lottoShowSaved").textContent = convertDate(lottoOptions.games[lottoOptions.selGame].savedSet.date);
  } else {
    dbID("idBtn_lottoShowSaved").textContent = "Nichts gespeichert";
  }
}

function lottoRandom() {
  lottoOptions.randomiziation = 10;

  function printRandom() {
    createLotto(true);
    let tipArr = [...Array(lottoOptions.games[lottoOptions.selGame].tipLength).keys()];
    for (let i = 0; i < lottoOptions.games[lottoOptions.selGame].tipMax; i++) {
      const randIndex = randomIndex(tipArr);
      const id = tipArr.splice(randIndex, 1)[0];
      lottoOptions.games[lottoOptions.selGame].savedSet.tips.push(id);
    }
    let starArr = [...Array(lottoOptions.games[lottoOptions.selGame].starLength).keys()];
    for (let i = 0; i < lottoOptions.games[lottoOptions.selGame].starMax; i++) {
      const randIndex = randomIndex(starArr)
      const id = starArr.splice(randIndex, 1)[0];
      lottoOptions.games[lottoOptions.selGame].savedSet.star.push(id);
    }
    lottoOptions.randomiziation--;
    caLO.redraw();
    if (lottoOptions.randomiziation > 0) {
      lottoOptions.randomTimeout = setTimeout(printRandom, 20 * (20 - lottoOptions.randomiziation));
    } else {
      lottoOptions.randomiziation = 0;
      clearTimeout(lottoOptions.randomTimeout);
      caLO.redraw();
    };
  };
  printRandom();
};

function lottoReset() {
  lottoOptions.randomiziation = 0;
  clearTimeout(lottoOptions.randomTimeout);
  createLotto(true);
}

function lottoGameSelect() {
  lottoOptions.selGame = idSel_lottoGame.value;
  lottoGetGames();
};

function createLotto(clear = false) {
  //Clear on Start
  if (clear === true) {
    lottoOptions.games[lottoOptions.selGame].draw.drawID = null;
    lottoOptions.games[lottoOptions.selGame].draw.tips = [];
    lottoOptions.games[lottoOptions.selGame].draw.star = [];
    lottoOptions.games[lottoOptions.selGame].savedSet.tips = [];
    lottoOptions.games[lottoOptions.selGame].savedSet.star = [];
    lottoOptions.games[lottoOptions.selGame].savedSet.date = null;
  };
  lottoOptions.cells = [];
  const cols = lottoOptions.games[lottoOptions.selGame].cols;
  const rows = lottoOptions.games[lottoOptions.selGame].rows;
  const wCell = Math.floor(lottoOptions.width / cols);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const index = i + j * cols;
      if (index < lottoOptions.games[lottoOptions.selGame].tipLength) {
        lottoOptions.cells.push(new LottoCell(index + lottoOptions.games[lottoOptions.selGame].tipStart, i, j, wCell, "tips"));
      };
    };
  };

  const colsStar = lottoOptions.games[lottoOptions.selGame].starLength;
  const wStar = Math.floor(lottoOptions.width / colsStar);
  for (let i = 0; i < colsStar; i++) {
    lottoOptions.cells.push(new LottoCell(i + lottoOptions.games[lottoOptions.selGame].starStart, i, rows, wStar, "star", wCell));
  }
  // dbID("idBtn_lottoShowSaved").textContent = `Latest: ${convertDate(lottoOptions.games[lottoOptions.selGame].savedSet.date)}`;
  caLO.redraw();
};

async function lottoGetGames() {
  if (lottoOptions.getGameTimer != null) {
    clearTimeout(lottoOptions.getGameTimer);
    lottoOptions.getGameTimer = null;
  };
  lottoOptions.getGameTimer = setTimeout(() => {
    lottoOptions.numberOfLatestGames = numberFromInput("idVin_lottoNumberOfGames", lottoOptions.numberOfLatestGamesOrig);
    globalP5.loadJSON(lottoOptions.url, lottoReturn, 'json');
    lottoOptions.getGameTimer = null;
  }, 800);
}

function lottoReturn(d) {
  lottoOptions.games[lottoOptions.selGame].loadedSets = {};
  clearTable("idTabHeader_Lotto");
  clearTable("idTabBody_Lotto");

  if (d.length == 0) {
    const rowTh = insertTableRow("idTabHeader_Lotto");
    tableAddCellHeader(rowTh, {
      names: ["lottoTableHeader", "date"],
      type: "Lbl",
      text: `Keine Daten für ${lottoOptions.selGame} gefunden.`,
      colSpan: 4,
      cellStyle: {
        textAlign: "center"
      }
    });
    return
  }

  const data = d.data.reverse();
  for (let i = 0; i < lottoOptions.numberOfLatestGames; i++) {
    let dateArr = data[i].date.split(".")
    const date = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
    lottoOptions.games[lottoOptions.selGame].loadedSets[i] = {
      drawDate: date,
      mainTable: data[i].Lottozahl,
      starTable: [data[i].Superzahl],
      winner: "-",
      drawID: data[i].id
    }
  };

  //header
  const rowTh = insertTableRow("idTabHeader_Lotto");
  tableAddCellHeader(rowTh, {
    names: ["lottoTableHeader", "date"],
    type: "Lbl",
    text: "Date",
    cellStyle: {
      textAlign: "left"
    }
  });
  tableAddCellHeader(rowTh, {
    names: ["lottoTableHeader", "numbers"],
    type: "Lbl",
    text: "Numbers"
  });
  tableAddCellHeader(rowTh, {
    names: ["lottoTableHeader", "star"],
    type: "Lbl",
    text: "Star"
  });
  tableAddCellHeader(rowTh, {
    names: ["lottoTableHeader", "winner"],
    type: "Lbl",
    text: "Winner"
  });
  // body
  for (const [i, entry] of Object.entries(lottoOptions.games[lottoOptions.selGame].loadedSets)) {
    let row = insertTableRow("idTabBody_Lotto");
    //--  date
    tableAddCell(row, {
      names: ["lottoTable", "date", i],
      type: "Lbl",
      text: convertDate(entry.drawDate),

      cellStyle: {
        textAlign: "right"
      },
      onclick: () => {
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
    });
    //--  numbers
    tableAddCell(row, {
      names: ["lottoTable", "numbers", i],
      type: "Lbl",
      text: `${entry.mainTable.join(", ")}`,
      copy: true,
      cellStyle: {
        textAlign: "center"
      }
    });
    //--  star
    tableAddCell(row, {
      names: ["lottoTable", "star", i],
      type: "Lbl",
      text: `${entry.starTable.join(", ")}`,
      copy: true,
      cellStyle: {
        textAlign: "center"
      }
    });
    //--  winners
    tableAddCell(row, {
      names: ["lottoTable", "winners", i],
      type: "Lbl",
      text: entry.winner,

      cellStyle: {
        textAlign: "center"
      }
    });
  }
}
// CANVAS----------------------------------------------------------------------------------------------------------------------

const caLO = new p5((c) => {
  c.setup = function () {
    c.canv = c.createCanvas(lottoOptions.width + 4, lottoOptions.height + 4);
    c.canv.id("canvasLotto");
    c.canv.parent('#idCanv_lotto');
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
    };
  };
}, '#idCanv_lotto');

function mousePushedLotto() {
  for (let cell of lottoOptions.cells) {
    cell.clicked(Math.floor(caLO.mouseX), Math.floor(caLO.mouseY));
  }
  lottoCheckCorrect();
  caLO.redraw();
};

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
    star: 0
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
    this.y = (type === "star") ? j * offStars + w / 2 : j * w;
  };

  selected() {
    return ((lottoOptions.games[lottoOptions.selGame].savedSet.tips.includes(this.num) && this.type === "tips") || (lottoOptions.games[lottoOptions.selGame].savedSet.star.includes(this.num) && this.type === "star"));
  };

  drawed() {
    return ((lottoOptions.games[lottoOptions.selGame].draw.tips.includes(this.num) && this.type === "tips") || (lottoOptions.games[lottoOptions.selGame].draw.star.includes(this.num) && this.type === "star"));
  };

  show() {
    caLO.push();
    caLO.translate(this.x + this.w / 2, this.y + this.w / 2);
    caLO.strokeWeight(1);
    let col;
    if (this.selected() && this.drawed()) {
      col = globalValues.colors.elements.btnPositive;
    } else if (this.selected()) {
      col = globalValues.colors.elements.baseColor;
    } else if (this.drawed()) {
      col = globalValues.colors.elements.btnNegative;
    } else {
      col = globalValues.colors.elements.btn
    };
    let color = caLO.color(col);
    if (lottoOptions.randomiziation > 0 && this.selected()) {
      color.setAlpha(0.5);
    }
    caLO.fill(color);
    caLO.stroke(colStateToHSL(col));
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
    caLO.fill(colStateToHSL(col));
    caLO.textSize(getCssRoot("textSize", true));
    caLO.text(this.num, 0, 2);
    caLO.pop();
  };

  clicked(mx, my) {
    const d = caLO.dist(this.x + this.w / 2, this.y + this.w / 2, mx, my);
    if (d < this.w * 0.8 / 2) {
      if (!this.selected()) {
        if ((this.type === "tips") && (lottoOptions.games[lottoOptions.selGame].savedSet.tips.length < lottoOptions.games[lottoOptions.selGame].tipMax)) {
          lottoOptions.games[lottoOptions.selGame].savedSet.tips.push(this.num);
          lottoOptions.games[lottoOptions.selGame].savedSet.date = new Date();
        } else if ((this.type === "star") && (lottoOptions.games[lottoOptions.selGame].savedSet.star.length < lottoOptions.games[lottoOptions.selGame].starMax)) {
          lottoOptions.games[lottoOptions.selGame].savedSet.star.push(this.num);
          lottoOptions.games[lottoOptions.selGame].savedSet.date = new Date();
        }
        return
      }
      if (this.type === "tips") {
        lottoOptions.games[lottoOptions.selGame].savedSet.tips.splice(lottoOptions.games[lottoOptions.selGame].savedSet.tips.indexOf(this.num), 1);
        return
      }
      if (this.type === "star") {
        lottoOptions.games[lottoOptions.selGame].savedSet.star.splice(lottoOptions.games[lottoOptions.selGame].savedSet.star.indexOf(this.num), 1);
        return
      }
    }
  };
};