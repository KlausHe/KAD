const sepakbolaOptions = {
  https: (kind, liga, season = null) => {
    const types = {
      table: "getbltable/", // Array mit 18 einträgen, jedes Team einzeln mit teamstatistik  -- einzeln
      matches: "getmatchdata/", // Array mit 305 einträgen, jedes Match einzeln mit Team und Statistik
      days: "getcurrentgroup/", // Object mit "GroupOrderID": 10--> 10 ist der aktuelle Spieltag   -- erst diesen, dann den nächsten
    }
    if (kind == "days") {
      return `https://www.openligadb.de/api/${types[kind]}${liga}` //https://www.openligadb.de/api/getbltable/bl1/2018
    }
    return `https://www.openligadb.de/api/${types[kind]}${liga}/${season}`
  },
  selected: {},
  selectedOrig: {
    matchday: 1,
    ligaIndex: 0,
    seasonIndex: 0
  },
  images: {},
  interval: null,
  liga: [{
      name: "1. Bundesliga",
      seasons: [],
      table: [],
      matches: [],
      urlName: "bl1",
      maxSeasons: 8,
      maxDays: 34,
      set setSeasonsText(offset) {
        let timeNow = new Date();
        let yearNow = (timeNow.getFullYear() - offset) + ((timeNow.getMonth() < 7) ? -1 : 0);
        this.seasons.push({
          urlText: yearNow,
          dropdownText: `${yearNow}\/${yearNow+1}`
        })
      },
    },
    {
      name: "2. Bundesliga",
      seasons: [],
      table: [],
      matches: [],
      urlName: "bl2",
      maxSeasons: 3,
      maxDays: 34,
      set setSeasonsText(offset) {
        let timeNow = new Date();
        let yearNow = (timeNow.getFullYear() - offset) + ((timeNow.getMonth() < 7) ? -1 : 0);
        this.seasons.push({
          urlText: yearNow,
          dropdownText: `${yearNow}\/${yearNow+1}`
        })
      },
    },
    {
      name: "3. Bundesliga",
      seasons: [],
      table: [],
      matches: [],
      urlName: "bl3",
      maxSeasons: 5,
      maxDays: 34,
      set setSeasonsText(offset) {
        let timeNow = new Date();
        let yearNow = (timeNow.getFullYear() - offset) + ((timeNow.getMonth() < 7) ? -1 : 0);
        this.seasons.push({
          urlText: yearNow,
          dropdownText: `${yearNow}\/${yearNow+1}`
        })
      },
    },
    {
      name: "WM 2022",
      seasons: [],
      table: [],
      matches: [],
      urlName: "WM2022",
      maxSeasons: 1,
      maxDays: 34,
      set setSeasonsText(offset) {
        let timeNow = new Date();
        let yearNow = (timeNow.getFullYear() - offset) + ((timeNow.getMonth() < 7) ? -1 : 0);
        this.seasons.push({
          urlText: yearNow,
          dropdownText: `${yearNow}\/${yearNow+1}`
        })
      },
    }
  ]
};

function clear_cl_Sepakbola() {
  sepakbolaOptions.selected = deepClone(sepakbolaOptions.selectedOrig);
  sepakbolaOptions.images = {};
  sepakbolaCreateDropdownLiga();
  sepakbolaCreateDropdownSeasons();
  sepakbolaCreateDropdownDays();
  clearInterval(sepakbolaOptions.interval);
  sepakbolaOptions.interval = setInterval(sepakbolaRequest, globalValues.intervalJSON);
  sepakbolaRequest();
};

function sepakbolaCreateDropdownLiga() { //generate Liga Dropdown
  let ligaSelect = dbID("idSel_sepakbolaLiga");
  clearFirstChild("idSel_sepakbolaLiga");
  for (let i = 0; i < sepakbolaOptions.liga.length; i++) {
    const liga = sepakbolaOptions.liga[i];
    let option = document.createElement("option");
    option.textContent = liga.name;
    ligaSelect.appendChild(option);
    liga.seasons = [];
    for (let j = 0; j < liga.maxSeasons; j++) {
      liga.setSeasonsText = j;
    };
  };
};

function sepakbolaCreateDropdownSeasons() {
  const selLiga = sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex];
  const seasonSel = dbID("idSel_sepakbolaSeason");
  clearFirstChild("idSel_sepakbolaSeason");
  for (let i = 0; i < selLiga.seasons.length; i++) {
    let option = document.createElement("option");
    option.textContent = selLiga.seasons[i].dropdownText;
    option.value = selLiga.seasons[i].urlText;
    seasonSel.appendChild(option);
  };
  sepakbolaOptions.selected.season = selLiga.seasons[0].urlText;
};

function sepakbolaCreateDropdownDays() {
  for (let i = 0; i < sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].maxDays; i++) {
    dbID("idSel_sepakbolaMatchday").options[i] = new Option(i + 1);
  };
  dbID("idSel_sepakbolaMatchday").options[0].selected = true;
};

function sepakbolaLigaChange(obj) {
  sepakbolaOptions.selected.ligaIndex = obj.selectedIndex
  sepakbolaCreateDropdownSeasons();
  sepakbolaCreateDropdownDays();
  sepakbolaRequest();
}

function sepakbolaSeasonChange(obj) {
  sepakbolaOptions.selected.seasonIndex = obj.selectedIndex
  sepakbolaOptions.selected.season = obj.value
  sepakbolaRequest();
}

function sepakbolaMatchdayChange(obj) {
  sepakbolaOptions.selected.matchday = obj.selectedIndex + 1; //index starts at 0, i need 1!
  sepakbolaMatchesReturn();
};

async function sepakbolaRequest() {
  const liga = sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex];
  //load table 
  const URLTable = sepakbolaOptions.https("table", liga.urlName, sepakbolaOptions.selected.season);
  globalP5.loadJSON(URLTable, sepakbolaTableReturn, 'json');

  const URLMatches = sepakbolaOptions.https("matches", liga.urlName, sepakbolaOptions.selected.season);
  globalP5.loadJSON(URLMatches, sepakbolaMatchesReturn, 'json');

  const URLLastday = sepakbolaOptions.https("days", liga.urlName);
  globalP5.loadJSON(URLLastday, sepakbolaLastdayReturn, 'json');

};

function sepakbolaLastdayReturn(data) {
  sepakbolaOptions.selected.matchday = data.GroupOrderID
  dbID("idSel_sepakbolaMatchday").options[data.GroupOrderID - 1].selected = true;
}

function sepakbolaMatchesReturn(data = null) {
  if (data) {
    sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].matches = [];
    let matchList = sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].matches;
    for (let i = 0; i < data.length; i++) {
      if (matchList[data[i].Group.GroupOrderID - 1] === undefined) {
        matchList[data[i].Group.GroupOrderID - 1] = []
      };
      matchList[data[i].Group.GroupOrderID - 1].push(data[i]);
    };
  }
  let matches = sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].matches;
  dbID("idTabHeader_SepakbolaMatches").innerHTML = `${sepakbolaOptions.selected.matchday}. Spieltag`;
  const seasonSelected = matches[sepakbolaOptions.selected.matchday - 1];
  sepakbolaPushImages("match");
  let prevDay = null;
  clearTable("idTabBody_SepakbolaMatches");
  for (let i = 0; i < seasonSelected.length; i++) {
    let day = new Date(seasonSelected[i].MatchDateTimeUTC);
    if (prevDay != day.getTime()) {
      const rowTh = insertTableRow("idTabBody_SepakbolaMatches");
      prevDay = new Date(day.getTime()).getTime();
      let min = day.getMinutes();
      min = (min < 10) ? "0" + min : min;
      tableAddCellHeader(rowTh, {
        names: ["sepakbolaMatchesHeader", i],
        type: "Lbl",
        text: day.toLocaleString('default', {
          weekday: "short",
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/,/g, " -"),
        colSpan: 4,
        cellStyle: {
          textAlign: "center"
        }
      });
    };

    let row = insertTableRow("idTabBody_SepakbolaMatches");
    //--  VereinsLogo1
    const logo1 = tableAddCell(row, {
      names: ["sepakbolaMatchesLogo", "logoT1", i],
      type: "Lbl",
      text: `${seasonSelected[i].Team1.ShortName ||  seasonSelected[i].Team1.TeamName} `,
      cellStyle: {
        textAlign: "right"
      }
    });
    logo1.appendChild(sepakbolaOptions.images[seasonSelected[i].Team1.TeamId].cloneNode());

    //--  GOAL1 : Goal2
    tableAddCell(row, {
      names: ["sepakbolaMatchesGoals", i],
      type: "Lbl",
      get text() {
        if (!seasonSelected[i].MatchIsFinished) {
          return "-:-";
        } else {
          let goalLength = seasonSelected[i].Goals.length;
          if (goalLength == 0) {
            return "0:0";
          } else {
            return `${seasonSelected[i].Goals[goalLength - 1].ScoreTeam1}:${seasonSelected[i].Goals[goalLength - 1].ScoreTeam2}`;
          };
        };
      },
      cellStyle: {
        textAlign: "center"
      }
    });

    //--  VereinsLogo2
    const logo2 = tableAddCell(row, {
      names: ["sepakbolaMatchesLogo", "logoT2", i],
      type: "Lbl",
      text: `${seasonSelected[i].Team2.ShortName ||  seasonSelected[i].Team2.TeamName} `,
      cellStyle: {
        textAlign: "left"
      }
    });
    logo2.appendChild(sepakbolaOptions.images[seasonSelected[i].Team2.TeamId].cloneNode());
  };
};

function sepakbolaTableReturn(data) {
  sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].table = data;
  const table = sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].table
  sepakbolaPushImages("table");
  //header
  clearTable("idTabHeader_SepakbolaTable");
  const rowTh = insertTableRow("idTabHeader_SepakbolaTable");
  tableAddCellHeader(rowTh, {
    names: ["sepakbolaTableHeader", "season"],
    type: "Lbl",
    text: "",
    colSpan: 3,
    cellStyle: {
      textAlign: "left"
    }
  });
  tableAddCellHeader(rowTh, {
    names: ["sepakbolaTableHeader", "Spiele"],
    type: "Lbl",
    text: "Sp"
  });
  tableAddCellHeader(rowTh, {
    names: ["sepakbolaTableHeader", "Sieg"],
    type: "Lbl",
    text: "S"
  });
  tableAddCellHeader(rowTh, {
    names: ["sepakbolaTableHeader", "Unentschieden"],
    type: "Lbl",
    text: "U"
  });
  tableAddCellHeader(rowTh, {
    names: ["sepakbolaTableHeader", "Niederlage"],
    type: "Lbl",
    text: "N"
  });
  tableAddCellHeader(rowTh, {
    names: ["sepakbolaTableHeader", "Diff"],
    type: "Lbl",
    text: "TD"
  });
  tableAddCellHeader(rowTh, {
    names: ["sepakbolaTableHeader", "Points"],
    type: "Lbl",
    text: "P"
  });

  // body
  clearTable("idTabBody_SepakbolaTable");
  for (let i = 0; i < table.length; i++) {
    let row = insertTableRow("idTabBody_SepakbolaTable");

    //--  Platz
    tableAddCell(row, {
      names: ["sepakbolaTable", "place", i],
      type: "Lbl",
      text: i + 1,
      cellStyle: {
        textAlign: "center"
      }
    });

    //--  VereinsLogo
    const logo = tableAddCell(row, {
      names: ["sepakbolaTable", "logo", i],
      type: "Lbl",
      text: "",
    });
    logo.appendChild(sepakbolaOptions.images[table[i].TeamInfoId]);

    //--  Team Name
    tableAddCell(row, {
      names: ["sepakbolaTable", "name", i],
      type: "Lbl",
      text: (table[i].ShortName != null) ? table[i].ShortName : table[i].TeamName,
      cellStyle: {
        textAlign: "left"
      },
      copy: true
    });

    //--  Spiele
    tableAddCell(row, {
      names: ["sepakbolaTable", "matchcount", i],
      type: "Lbl",
      text: `(${table[i].Matches})`,

      cellStyle: {
        textAlign: "left"
      }
    });

    //--  Siege
    tableAddCell(row, {
      names: ["sepakbolaTable", "siege", i],
      type: "Lbl",
      text: table[i].Won,

      cellStyle: {
        textAlign: "right"
      }
    });
    //--  Unentschieden
    tableAddCell(row, {
      names: ["sepakbolaTable", "draw", i],
      type: "Lbl",
      text: table[i].Draw,

      cellStyle: {
        textAlign: "right"
      }
    });
    //--  Niederlage
    tableAddCell(row, {
      names: ["sepakbolaTable", "lost", i],
      type: "Lbl",
      text: table[i].Lost,

      cellStyle: {
        textAlign: "right"
      }
    });

    //--  T-Diff
    tableAddCell(row, {
      names: ["sepakbolaTable", "goalDiff", i],
      type: "Lbl",
      text: (table[i].GoalDiff > 0) ? `(+${table[i].GoalDiff})` : `(${table[i].GoalDiff})`,

      cellStyle: {
        textAlign: "right"
      }
    });

    // points
    tableAddCell(row, {
      names: ["sepakbolaTable", "points", i],
      type: "Lbl",
      text: table[i].Points,
      cellStyle: {
        textAlign: "right"
      }
    });
  };
};

function sepakbolaPushImages(arr) {
  if (arr == "table") {
    for (const obj of sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].table) {
      if (!sepakbolaOptions.images.hasOwnProperty(obj.TeamInfoId)) {
        sepakbolaOptions.images[obj.TeamInfoId] = sepakbolaCreateImage(obj.TeamIconUrl)
      }
    }
  }
  if (arr == "match") {
    for (const objArr of sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].matches) {
      for (const obj of objArr) {
        if (!sepakbolaOptions.images.hasOwnProperty(obj.Team1.TeamId)) {
          sepakbolaOptions.images[obj.Team1.TeamId] = sepakbolaCreateImage(obj.Team1.TeamIconUrl)
        }
        if (!sepakbolaOptions.images.hasOwnProperty(obj.Team2.TeamId)) {
          sepakbolaOptions.images[obj.Team2.TeamId] = sepakbolaCreateImage(obj.Team2.TeamIconUrl)
        }
      }
    }
  }
}

function sepakbolaCreateImage(url) {
  const size = getCssRoot("imgSize", true, true);
  const img = new Image();
  //shrink URL-image-size
  let urlArr = url;
  if (urlArr.includes("px")) {
    urlArr = url.split("px");
    let index = urlArr[0].lastIndexOf("/");
    urlArr[0] = urlArr[0].slice(0, index + 1);
    urlArr = `${urlArr[0]}${size}px${urlArr[1]}`
  }
  img.src = urlArr;
  img.setAttribute("referrerpolicy", "no-referrer");
  img.setAttribute("uiSize", "img");
  return img
}