import { layoutCheckCORSandDisableModule } from "../General/Layout.js";
import { KadArray, KadDate, KadFile, KadTable, deepClone, initEL, objectLength } from "../KadUtils/KadUtils.js";
import { globalValues } from "../Settings/General.js";

const sepakbolaOptions = {
  get URLTable() {
    return `https://www.openligadb.de/api/getbltable/${sepakbolaOptions.selectedLiga.urlName}/${sepakbolaOptions.selected.season}`;
  },
  get URLMatches() {
    return `https://www.openligadb.de/api/getmatchdata/${sepakbolaOptions.selectedLiga.urlName}/${sepakbolaOptions.selected.season}`;
  },
  get URLLastday() {
    return `https://www.openligadb.de/api/getcurrentgroup/${sepakbolaOptions.selectedLiga.urlName}`;
  },
  get selectedLiga() {
    return this.liga[this.selected.ligaIndex];
  },
  selected: {
    ligaIndex: 0,
    season: 0,
    matchday: 0,
  },
  selectedOrig: {
    ligaIndex: 1,
    season: 0,
    matchday: 0,
  },
  interval: null,
  liga: [
    // {
    // 	name: "EM 2024",
    // 	urlName: "em",
    // 	firstSeason: 2024,
    // 	maxDays: 7,
    // 	format(year) {
    // 		return year;
    // 	},
    // 	get currentSeason() {
    // 		return new Date().getFullYear();
    // 	},
    // 	seasons: [],
    // 	table: [],
    // 	matches: [],
    // },
    {
      name: "DFB-Pokal 2024",
      urlName: "dfb",
      firstSeason: 2023,
      maxDays: 6,
      format(year) {
        return `${year}\/${year + 1}`;
      },
      get currentSeason() {
        return new Date().getFullYear();
      },
      seasons: [],
      table: [],
      matches: [],
    },
    {
      name: "1. Bundesliga",
      urlName: "bl1",
      firstSeason: 2001, // 2001/2002
      maxDays: 34,
      format(year) {
        return `${year}\/${year + 1}`;
      },
      get currentSeason() {
        return new Date().getFullYear() + (new Date().getMonth() < 7 ? -1 : 0);
      },
      seasons: [],
      table: [],
      matches: [],
    },
    {
      name: "2. Bundesliga",
      urlName: "bl2",
      firstSeason: 2006, // 2006/2007
      maxDays: 34,
      format(year) {
        return `${year}\/${year + 1}`;
      },
      get currentSeason() {
        return new Date().getFullYear() + (new Date().getMonth() < 7 ? -1 : 0);
      },
      seasons: [],
      table: [],
      matches: [],
    },
    {
      name: "3. Bundesliga",
      urlName: "bl3",
      firstSeason: 2008, // 2008/2009
      maxDays: 38,
      format(year) {
        return `${year}\/${year + 1}`;
      },
      get currentSeason() {
        return new Date().getFullYear() + (new Date().getMonth() < 7 ? -1 : 0);
      },
      seasons: [],
      table: [],
      matches: [],
    },
  ],
};

initEL({ id: idSel_sepakbolaLiga, fn: sepakbolaLigaChange, selStartIndex: sepakbolaOptions.selectedOrig.ligaIndex, selList: Object.values(sepakbolaOptions.liga).map((v) => v.name) });
initEL({ id: idSel_sepakbolaSeason, fn: sepakbolaSeasonChange, selStartIndex: 0 });
initEL({ id: idSel_sepakbolaMatchday, fn: sepakbolaMatchdayChange, selStartIndex: 0 });

export function clear_cl_Sepakbola() {
  sepakbolaOptions.selected = deepClone(sepakbolaOptions.selectedOrig);
  sepakbolaOptions.selected.ligaIndex = idSel_sepakbolaLiga.KadReset();
  sepakbolaOptions.selected.season = sepakbolaDropdownSeasons();
  sepakbolaDropdownMatchdays();
  sepakbolaGetData();
}

function sepakbolaDropdownSeasons() {
  let seasons = [];
  const yearNow = sepakbolaOptions.selectedLiga.currentSeason;
  for (let j = yearNow; j - sepakbolaOptions.selectedLiga.firstSeason >= 0; j--) {
    seasons.push([sepakbolaOptions.selectedLiga.format(j), j]);
  }
  idSel_sepakbolaSeason.KadReset({ selList: seasons });
  return yearNow;
}
function sepakbolaDropdownMatchdays() {
  let list = KadArray.arrayFromNumber(sepakbolaOptions.selectedLiga.maxDays).map((d) => d + 1);
  sepakbolaOptions.selected.matchday = idSel_sepakbolaMatchday.KadReset({ selList: list });
}

function sepakbolaLigaChange() {
  sepakbolaOptions.selected.ligaIndex = idSel_sepakbolaLiga.selectedIndex;
  sepakbolaOptions.selected.season = sepakbolaDropdownSeasons();
  sepakbolaDropdownMatchdays();
  sepakbolaGetData();
}

function sepakbolaSeasonChange() {
  sepakbolaOptions.selected.season = idSel_sepakbolaSeason.KadGet();
  sepakbolaGetData();
}

function sepakbolaMatchdayChange() {
  sepakbolaOptions.selected.matchday = idSel_sepakbolaMatchday.selectedIndex;
  sepakbolaMatchesReturn();
}

async function sepakbolaGetData() {
  const { dataTable, dataDay, dataMatches, error } = await KadFile.loadUrlToJSON({
    variableArray: ["dataTable", "dataDay", "dataMatches"],
    urlArray: [sepakbolaOptions.URLTable, sepakbolaOptions.URLLastday, sepakbolaOptions.URLMatches],
  });
  if (layoutCheckCORSandDisableModule(error, "Sepakbola")) return;
  if (dataTable != null) sepakbolaTableReturn(dataTable);
  if (dataDay != null) sepakbolaLastdayReturn(dataDay);
  if (dataMatches != null) sepakbolaMatchesReturn(dataMatches);
}

function sepakbolaLastdayReturn(data) {
  sepakbolaOptions.selected.matchday = data.groupOrderID - 1;
  idSel_sepakbolaMatchday.selectedIndex = sepakbolaOptions.selected.matchday;
}

function sepakbolaMatchesReturn(data = null) {
  if (data) {
    sepakbolaOptions.selectedLiga.matches = [];
    let matchList = sepakbolaOptions.selectedLiga.matches;
    for (let i = 0; i < data.length; i++) {
      if (matchList[data[i].group.groupOrderID - 1] === undefined) {
        matchList[data[i].group.groupOrderID - 1] = [];
      }
      matchList[data[i].group.groupOrderID - 1].push(data[i]);
    }
  }
  let matches = sepakbolaOptions.selectedLiga.matches;
  const seasonSelected = matches[sepakbolaOptions.selected.matchday];

  const body = [
    {
      data: seasonSelected.map((item) => (item.team1.shortName != null ? item.team1.shortName : item.team1.teamName)),
      settings: { description: "team1", title: seasonSelected.map((item) => item.team1.teamName), align: "right", noBorder: "right" },
    },
    {
      type: "URLImg",
      data: seasonSelected.map((item) => sepakbolaImageURL(item.team1.teamIconUrl)),
      settings: { description: "logo1", title: seasonSelected.map((item) => item.team1.teamName), align: "center", noBorder: "right", imgSize: "olympiaImg" },
    },
    {
      data: seasonSelected.map((item) => {
        if (!item.matchIsFinished) return "-:-";
        if (item.goals.length <= 0) return "0:0";
        return `${item.goals[item.goals.length - 1].scoreTeam1}:${item.goals[item.goals.length - 1].scoreTeam2}`;
      }),
      settings: { description: "goals", align: "center", noBorder: "right" },
    },
    {
      type: "URLImg",
      data: seasonSelected.map((item) => sepakbolaImageURL(item.team2.teamIconUrl)),
      settings: { description: "logo2", title: seasonSelected.map((item) => item.team2.teamName), align: "center", noBorder: "right", imgSize: "olympiaImg" },
    },
    {
      data: seasonSelected.map((item) => (item.team2.shortName != null ? item.team2.shortName : item.team2.teamName)),
      settings: { description: "team2", title: seasonSelected.map((item) => item.team2.teamName), align: "left", noBorder: "left" },
    },
  ];

  let header = { 0: [{ data: `${sepakbolaOptions.selected.matchday + 1}. Spieltag`, colSpan: body.length, settings: { thickBorder: "bottom", align: "center" } }] };

  let prevDay = null;
  for (let i = 0; i < seasonSelected.length; i++) {
    const day = new Date(seasonSelected[i].matchDateTimeUTC);
    if (prevDay != day.getTime()) {
      prevDay = new Date(day.getTime()).getTime();
      header[i + objectLength(header)] = [
        {
          data: KadDate.getDate(day, { format: "WD - DD.MM. - HH:mm" }),
          colSpan: body.length,
          settings: { align: "center", thickBorder: "bottom", noBorder: "right" },
        },
      ];
    }
  }
  KadTable.createHTMLGrid({ id: idTab_SepakbolaMatches, header, body });
}

function sepakbolaTableReturn(data) {
  if (data.length == 0) return;
  sepakbolaOptions.selectedLiga.table = data;
  const header = [
    { data: "SP", colSpan: 4, settings: { align: "right", noBorder: "right" } },
    { data: "S", settings: { align: "right", noBorder: "right" } },
    { data: "U", settings: { align: "right", noBorder: "right" } },
    { data: "N", settings: { align: "right", noBorder: "right" } },
    { data: "TD", settings: { align: "right", noBorder: "right" } },
    { data: "P", settings: { align: "right", noBorder: "right" } },
  ];
  const body = [
    {
      data: KadArray.arrayFromNumber(data.length).map((n) => n + 1),
      settings: { description: "place", align: "right", noBorder: "right" },
    },
    {
      type: "URLImg",

      data: data.map((item) => sepakbolaImageURL(item.teamIconUrl)),
      settings: { description: "Logo", title: data.map((item) => item.teamName), align: "center", noBorder: "right", imgSize: "olympiaImg" },
    },
    {
      data: data.map((item) => (item.shortName != null ? item.shortName : item.teamName)),
      settings: { description: "teamName", title: data.map((item) => item.teamName), noBorder: "right" },
    },
    {
      data: data.map((item) => item.matches),
      settings: { description: "matches", noBorder: "right" },
    },
    {
      data: data.map((item) => item.won),
      settings: { description: "won", align: "right", noBorder: "right" },
    },
    {
      data: data.map((item) => item.draw),
      settings: { description: "draw", align: "right", noBorder: "right" },
    },
    {
      data: data.map((item) => item.lost),
      settings: { description: "lost", align: "right", noBorder: "right" },
    },
    {
      data: data.map((item) => (item.goalDiff > 0 ? `(+${item.goalDiff})` : `(${item.goalDiff})`)),
      settings: { description: "diff", align: "right", noBorder: "right" },
    },
    {
      data: data.map((item) => item.points),
      settings: { description: "points" },
    },
  ];

  KadTable.createHTMLGrid({ id: idTab_SepakbolaTable, header, body });
}

function sepakbolaImageURL(url) {
  if (url == null) return;
  const size = globalValues.mediaSizes.imgSize; //shrink URL-image-size
  let urlArr = url;
  if (urlArr.includes("px")) {
    urlArr = url.split("px");
    let index = urlArr[0].lastIndexOf("/");
    urlArr[0] = urlArr[0].slice(0, index + 1);
    urlArr = `${urlArr[0]}${size}px${urlArr[1]}`;
  }
  return urlArr;
}
