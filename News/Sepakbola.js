// Übetragagungen
// https://www.dazn.com/de-DE/news/fu%C3%9Fball/tv-plan-em-2024-europameisterschaft-fernsehen-ard-zdf-rtl-1f7dv60hqs0yn171aggxq9o1lb
import { userLoggedIn } from "../General/Account.js";
import { KadArray, KadDate, KadTable, dbID, deepClone, hostDebug, initEL, log } from "../KadUtils/KadUtils.js";
import { globalValues } from "../Settings/General.js";

// Spanien:
// Italien:
const betMatchdays = [
	{
		Deutschland: [[1.25, 6.0, 9.0], "München", "ZDF"],
		Ungarn: [[3.3, 3.3, 2.25], "Köln", "MagentaTV"],
		Spanien: [[1.87, 3.4, 4.33], "Berlin", "ARD"],
		Italien: [[1.37, 4.5, 8.5], "Dortmund", "ARD"],
		Polen: [[5.75, 4.2, 1.52], "Hamburg", "RTL"],
		Slowenien: [[5.25, 3.5, 1.69], "Stuttgart", "ZDF"],
		Serbien: [[6.5, 4.75, 1.42], "Gelsenkirchen", "ZDF"],
		Rumänien: [[3.75, 3.5, 2.0], "München", "RTL"],
		Belgien: [[1.41, 4.5, 7.0], "Frankfurt", "ZDF"],
		Österreich: [[6.0, 4.5, 1.47], "Düsseldorf", "ARD"],
		Türkei: [[1.72, 3.6, 4.75], "Dortmund", "RTL"],
		Portugal: [[1.47, 4.2, 6.5], "Leipzig", "ARD"],
	},
	{
		Kroatien: [[], "Hamburg", "RTL"],
		Deutschland: [[], "Stuttgart", "ARD"],
		Schottland: [[], "Köln", "ARD"],
		Slowenien: [[], "München", "MagentaTV"],
		Dänemark: [[], "Frankfurt", "ZDF"],
		Spanien: [[], "Gelsenkirchen", "ZDF"],
		Slowakei: [[], "Düsseldorf", "RTL"],
		Polen: [[], "Berlin", "ARD"],
		Niederlande: [[], "Leipzig", "ARD"],
		Georgien: [[], "Hamburg", "RTL"],
		Türkei: [[], "Dortmund", "ZDF"],
		Belgien: [[], "Köln", "ZDF"],
	},
	{
		Schweiz: [[], "Frankfurt", "ARD"],
		Schottland: [[], "Stuttgart", "MagentaTV"],
		Kroatien: [[], "Leipzig", "ZDF"],
		Albanien: [[], "Düsseldorf", "unbekannt"],
		Niederlande: [[], "Berlin", "unbekannt"],
		Frankreich: [[], "Dortmund", "unbekannt"],
		England: [[], "Köln", "unbekannt"],
		Dänemark: [[], "München", "unbekannt"],
		Ukraine: [[], "Stuttgart", "unbekannt"],
		Slowakei: [[], "Frankfurt", "unbekannt"],
		Tschechien: [[], "Hamburg", "unbekannt"],
		Georgien: [[], "Gelsenkirchen", "unbekannt"],
	},
];

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
		ligaIndex: 0,
		season: 0,
		matchday: 0,
	},
	images: {},
	interval: null,
	liga: [
		{
			name: "EM 2024",
			urlName: "em",
			firstSeason: 2024,
			maxDays: 7,
			format(year) {
				return year;
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
	sepakbolaOptions.images = {};
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
	sepakbolaOptions.selected.season = idSel_sepakbolaSeason.value;
	sepakbolaGetData();
}

function sepakbolaMatchdayChange() {
	sepakbolaOptions.selected.matchday = idSel_sepakbolaMatchday.selectedIndex;
	sepakbolaMatchesReturn();
}

async function sepakbolaGetData() {
	let dataTable = null;
	let dataDay = null;
	let dataMatches = null;
	try {
		let response = await fetch(sepakbolaOptions.URLTable);
		dataTable = await response.json();
		response = await fetch(sepakbolaOptions.URLLastday);
		dataDay = await response.json();
		response = await fetch(sepakbolaOptions.URLMatches);
		dataMatches = await response.json();
	} catch (err) {
		console.error(err);
	}
	sepakbolaTableReturn(dataTable);
	sepakbolaLastdayReturn(dataDay);
	sepakbolaMatchesReturn(dataMatches);
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
	dbID("idTabHeader_SepakbolaMatches").innerHTML = `${sepakbolaOptions.selected.matchday + 1}. Spieltag`;
	const seasonSelected = matches[sepakbolaOptions.selected.matchday];
	sepakbolaPushImages("match");
	let prevDay = null;
	KadTable.clear("idTabBody_SepakbolaMatches");
	for (let i = 0; i < seasonSelected.length; i++) {
		let day = new Date(seasonSelected[i].matchDateTimeUTC);
		if (prevDay != day.getTime()) {
			const rowTh = KadTable.insertRow("idTabBody_SepakbolaMatches");
			prevDay = new Date(day.getTime()).getTime();
			KadTable.addHeaderCell(rowTh, {
				names: ["sepakbolaMatchesHeader", i],
				type: "Lbl",
				text: KadDate.getDate(day, { format: "WD - DD.MM. - HH:mm" }),
				colSpan: 3,
				cellStyle: {
					textAlign: "center",
				},
			});
		}

		let row = KadTable.insertRow("idTabBody_SepakbolaMatches");
		//--  VereinsLogo1
		const logo1 = KadTable.addCell(row, {
			names: ["sepakbolaMatchesLogo", "logoT1", i],
			type: "Lbl",
			text: `${seasonSelected[i].team1.shortName || seasonSelected[i].team1.teamName} `,
			title: seasonSelected[i].team1.teamName,
			cellStyle: {
				textAlign: "right",
			},
		});
		logo1.appendChild(sepakbolaOptions.images[seasonSelected[i].team1.teamId].cloneNode());

		//--  GOAL1 : Goal2
		KadTable.addCell(row, {
			names: ["sepakbolaMatchesGoals", i],
			type: "Lbl",
			get text() {
				if (!seasonSelected[i].matchIsFinished) {
					if (!userLoggedIn() && !hostDebug()) {
						return "-:-";
					}
					if (betMatchdays[sepakbolaOptions.selected.matchday][seasonSelected[i].team1.teamName][0].length == 0) {
						return "-:-";
					}

					let score = betMatchdays[sepakbolaOptions.selected.matchday][seasonSelected[i].team1.teamName][0];
					return `${score[0]} - ${score[1]} - ${score[2]}`;
				} else {
					const goalLength = seasonSelected[i].goals.length;
					if (goalLength == 0) {
						return "0:0";
					} else {
						return `${seasonSelected[i].goals[goalLength - 1].scoreTeam1}:${seasonSelected[i].goals[goalLength - 1].scoreTeam2}`;
					}
				}
			},
			title: sepakbolaOptions.selected.ligaIndex != 0 ? "" : `${betMatchdays[sepakbolaOptions.selected.matchday][seasonSelected[i].team1.teamName][1]} / ${betMatchdays[sepakbolaOptions.selected.matchday][seasonSelected[i].team1.teamName][2]}`,
			cellStyle: {
				textAlign: "center",
			},
		});

		//--  VereinsLogo2
		const logo2 = KadTable.addCell(row, {
			names: ["sepakbolaMatchesLogo", "logoT2", i],
			type: "Lbl",
			text: `${seasonSelected[i].team2.shortName || seasonSelected[i].team2.teamName} `,
			title: seasonSelected[i].team2.teamName,
			cellStyle: {
				textAlign: "left",
			},
		});
		logo2.appendChild(sepakbolaOptions.images[seasonSelected[i].team2.teamId].cloneNode());
	}
}

function sepakbolaTableReturn(data) {
	if (data.length == 0) return;
	sepakbolaOptions.selectedLiga.table = data;

	sepakbolaPushImages("table");
	// body
	KadTable.clear("idTabBody_SepakbolaTable");
	for (let i = 0; i < data.length; i++) {
		if (data[i].teamInfoId == 5251) continue;
		let row = KadTable.insertRow("idTabBody_SepakbolaTable");

		//--  Platz
		KadTable.addCell(row, {
			names: ["sepakbolaTable", "place", i],
			type: "Lbl",
			text: i + 1,
			cellStyle: {
				textAlign: "center",
			},
		});

		//--  VereinsLogo
		const logo = KadTable.addCell(row, {
			names: ["sepakbolaTable", "logo", i],
			type: "Lbl",
			text: "",
		});
		logo.appendChild(sepakbolaOptions.images[data[i].teamInfoId]);

		//--  Team Name
		KadTable.addCell(row, {
			names: ["sepakbolaTable", "name", i],
			type: "Lbl",
			text: data[i].shortName != null ? data[i].shortName : data[i].teamName,
			title: data[i].teamName,
			cellStyle: {
				textAlign: "left",
			},
		});

		//--  Spiele
		KadTable.addCell(row, {
			names: ["sepakbolaTable", "matchcount", i],
			type: "Lbl",
			text: `(${data[i].matches})`,

			cellStyle: {
				textAlign: "left",
			},
		});

		//--  Siege
		KadTable.addCell(row, {
			names: ["sepakbolaTable", "siege", i],
			type: "Lbl",
			text: data[i].won,

			cellStyle: {
				textAlign: "right",
			},
		});
		//--  Unentschieden
		KadTable.addCell(row, {
			names: ["sepakbolaTable", "draw", i],
			type: "Lbl",
			text: data[i].draw,

			cellStyle: {
				textAlign: "right",
			},
		});
		//--  Niederlage
		KadTable.addCell(row, {
			names: ["sepakbolaTable", "lost", i],
			type: "Lbl",
			text: data[i].lost,

			cellStyle: {
				textAlign: "right",
			},
		});

		//--  T-Diff
		KadTable.addCell(row, {
			names: ["sepakbolaTable", "goalDiff", i],
			type: "Lbl",
			text: data[i].goalDiff > 0 ? `(+${data[i].goalDiff})` : `(${data[i].goalDiff})`,

			cellStyle: {
				textAlign: "right",
			},
		});

		// points
		KadTable.addCell(row, {
			names: ["sepakbolaTable", "points", i],
			type: "Lbl",
			text: data[i].points,
			cellStyle: {
				textAlign: "right",
			},
		});
	}
}

function sepakbolaPushImages(arr) {
	if (arr == "table") {
		for (const obj of sepakbolaOptions.selectedLiga.table) {
			if (!sepakbolaOptions.images.hasOwnProperty(obj.teamInfoId)) {
				sepakbolaOptions.images[obj.teamInfoId] = sepakbolaCreateImage(obj.teamIconUrl);
			}
		}
	}
	if (arr == "match") {
		for (const objArr of sepakbolaOptions.selectedLiga.matches) {
			for (const obj of objArr) {
				if (!sepakbolaOptions.images.hasOwnProperty(obj.team1.teamId)) {
					sepakbolaOptions.images[obj.team1.teamId] = sepakbolaCreateImage(obj.team1.teamIconUrl);
				}
				if (!sepakbolaOptions.images.hasOwnProperty(obj.team2.teamId)) {
					sepakbolaOptions.images[obj.team2.teamId] = sepakbolaCreateImage(obj.team2.teamIconUrl);
				}
			}
		}
	}
}

function sepakbolaCreateImage(url) {
	const size = globalValues.mediaSizes.imgSize;
	const img = new Image();
	//shrink URL-image-size
	let urlArr = url;
	if (urlArr.includes("px")) {
		urlArr = url.split("px");
		let index = urlArr[0].lastIndexOf("/");
		urlArr[0] = urlArr[0].slice(0, index + 1);
		urlArr = `${urlArr[0]}${size}px${urlArr[1]}`;
	}
	img.src = urlArr;
	img.setAttribute("referrerpolicy", "no-referrer");
	img.setAttribute("uiSize", "img");
	return img;
}
