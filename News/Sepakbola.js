import * as KadUtils from "../General/KadUtils.js";
import { globalValues } from "../Settings/Basics.js";
import { globalP5 } from "../Main.js";

const sepakbolaOptions = {
	get URLTable() {
		return `https://www.openligadb.de/api/getbltable/${sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].urlName}/${sepakbolaOptions.selected.season}`;
	},
	get URLMatches() {
		return `https://www.openligadb.de/api/getmatchdata/${sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].urlName}/${sepakbolaOptions.selected.season}`;
	},
	get URLLastday() {
		return `https://www.openligadb.de/api/getcurrentgroup/${sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].urlName}`;
	},
	selected: {},
	selectedOrig: {
		matchday: 1,
		ligaIndex: 0,
		seasonIndex: 0,
	},
	images: {},
	interval: null,
	liga: [
		{
			name: "1. Bundesliga",
			seasons: [],
			table: [],
			matches: [],
			urlName: "bl1",
			maxSeasons: 8,
			maxDays: 34,
			set setSeasonsText(offset) {
				let timeNow = new Date();
				let yearNow = timeNow.getFullYear() - offset + (timeNow.getMonth() < 7 ? -1 : 0);
				this.seasons.push({
					urlText: yearNow,
					dropdownText: `${yearNow}\/${yearNow + 1}`,
				});
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
				let yearNow = timeNow.getFullYear() - offset + (timeNow.getMonth() < 7 ? -1 : 0);
				this.seasons.push({
					urlText: yearNow,
					dropdownText: `${yearNow}\/${yearNow + 1}`,
				});
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
				let yearNow = timeNow.getFullYear() - offset + (timeNow.getMonth() < 7 ? -1 : 0);
				this.seasons.push({
					urlText: yearNow,
					dropdownText: `${yearNow}\/${yearNow + 1}`,
				});
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
				let yearNow = timeNow.getFullYear() - offset + (timeNow.getMonth() < 7 ? -1 : 0);
				this.seasons.push({
					urlText: yearNow,
					dropdownText: `${yearNow}\/${yearNow + 1}`,
				});
			},
		},
	],
};

KadUtils.daEL(idSel_sepakbolaLiga, "change", () => sepakbolaLigaChange(idSel_sepakbolaLiga));
KadUtils.daEL(idSel_sepakbolaSeason, "change", () => sepakbolaSeasonChange(idSel_sepakbolaSeason));
KadUtils.daEL(idSel_sepakbolaMatchday, "change", () => sepakbolaMatchdayChange(idSel_sepakbolaMatchday));

export function clear_cl_Sepakbola() {
	sepakbolaOptions.selected = KadUtils.deepClone(sepakbolaOptions.selectedOrig);
	sepakbolaOptions.images = {};
	sepakbolaCreateDropdownLiga();
	sepakbolaCreateDropdownSeasons();
	sepakbolaCreateDropdownDays();
	clearInterval(sepakbolaOptions.interval);
	sepakbolaOptions.interval = setInterval(sepakbolaRequest, globalValues.intervalJSON);
	sepakbolaRequest();
}

function sepakbolaCreateDropdownLiga() {
	//generate Liga Dropdown
	let ligaSelect = KadUtils.dbID("idSel_sepakbolaLiga");
	KadUtils.KadDOM.clearFirstChild("idSel_sepakbolaLiga");
	for (let i = 0; i < sepakbolaOptions.liga.length; i++) {
		const liga = sepakbolaOptions.liga[i];
		let option = document.createElement("option");
		option.textContent = liga.name;
		ligaSelect.appendChild(option);
		liga.seasons = [];
		for (let j = 0; j < liga.maxSeasons; j++) {
			liga.setSeasonsText = j;
		}
	}
	ligaSelect.selectedIndex = sepakbolaOptions.selected.ligaIndex;
}

function sepakbolaCreateDropdownSeasons() {
	const selLiga = sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex];
	const seasonSel = KadUtils.dbID("idSel_sepakbolaSeason");
	KadUtils.KadDOM.clearFirstChild("idSel_sepakbolaSeason");
	for (let i = 0; i < selLiga.seasons.length; i++) {
		let option = document.createElement("option");
		option.textContent = selLiga.seasons[i].dropdownText;
		option.value = selLiga.seasons[i].urlText;
		seasonSel.appendChild(option);
	}
	sepakbolaOptions.selected.season = selLiga.seasons[0].urlText;
}

function sepakbolaCreateDropdownDays() {
	for (let i = 0; i < sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].maxDays; i++) {
		KadUtils.dbID("idSel_sepakbolaMatchday").options[i] = new Option(i + 1);
	}
	KadUtils.dbID("idSel_sepakbolaMatchday").options[0].selected = true;
}

function sepakbolaLigaChange(obj) {
	sepakbolaOptions.selected.ligaIndex = obj.selectedIndex;
	sepakbolaCreateDropdownSeasons();
	sepakbolaCreateDropdownDays();
	sepakbolaRequest();
}

function sepakbolaSeasonChange(obj) {
	sepakbolaOptions.selected.seasonIndex = obj.selectedIndex;
	sepakbolaOptions.selected.season = obj.value;
	sepakbolaRequest();
}

function sepakbolaMatchdayChange(obj) {
	sepakbolaOptions.selected.matchday = obj.selectedIndex + 1; //index starts at 0, i need 1!
	sepakbolaMatchesReturn();
}

function sepakbolaRequest() {
	// sepakbolaGetData();
	// globalP5.loadJSON(sepakbolaOptions.URLTable, sepakbolaTableReturn, "jsonp");
	// globalP5.loadJSON(sepakbolaOptions.URLTable, "json", sepakbolaTableReturn, sepakbolaReturnError);
	// globalP5.loadJSON(sepakbolaOptions.URLMatches, sepakbolaMatchesReturn, "jsonp");
	// globalP5.loadJSON(sepakbolaOptions.URLLastday, sepakbolaLastdayReturn, "jsonp");
}

function sepakbolaReturnError(error) {
	KadUtils.error("Sepakbola could not receive data:", error);
}

// async function sepakbolaGetData() {
//   try {
//     let response = await fetch(sepakbolaOptions.URLTable);
// 		const data = await response.json();
// 		sepakbolaTableReturn(data);
// 	} catch (err) {
// 		console.log(err);
// 	}
// }

function sepakbolaLastdayReturn(data) {
	sepakbolaOptions.selected.matchday = data.GroupOrderID;
	KadUtils.dbID("idSel_sepakbolaMatchday").options[data.GroupOrderID - 1].selected = true;
}

function sepakbolaMatchesReturn(data = null) {
	if (data) {
		sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].matches = [];
		let matchList = sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].matches;
		for (let i = 0; i < data.length; i++) {
			if (matchList[data[i].Group.GroupOrderID - 1] === undefined) {
				matchList[data[i].Group.GroupOrderID - 1] = [];
			}
			matchList[data[i].Group.GroupOrderID - 1].push(data[i]);
		}
	}
	let matches = sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].matches;
	KadUtils.dbID("idTabHeader_SepakbolaMatches").innerHTML = `${sepakbolaOptions.selected.matchday}. Spieltag`;
	const seasonSelected = matches[sepakbolaOptions.selected.matchday - 1];
	sepakbolaPushImages("match");
	let prevDay = null;
	KadUtils.KadTable.clear("idTabBody_SepakbolaMatches");
	for (let i = 0; i < seasonSelected.length; i++) {
		let day = new Date(seasonSelected[i].MatchDateTimeUTC);
		if (prevDay != day.getTime()) {
			const rowTh = KadUtils.KadTable.insertRow("idTabBody_SepakbolaMatches");
			prevDay = new Date(day.getTime()).getTime();
			KadUtils.KadTable.addHeaderCell(rowTh, {
				names: ["sepakbolaMatchesHeader", i],
				type: "Lbl",
				text: KadUtils.KadDate.getDate(day, { format: "WD - DD.MM. - HH:mm" }),
				colSpan: 4,
				cellStyle: {
					textAlign: "center",
				},
			});
		}

		let row = KadUtils.KadTable.insertRow("idTabBody_SepakbolaMatches");
		//--  VereinsLogo1
		const logo1 = KadUtils.KadTable.addCell(row, {
			names: ["sepakbolaMatchesLogo", "logoT1", i],
			type: "Lbl",
			text: `${seasonSelected[i].Team1.ShortName || seasonSelected[i].Team1.TeamName} `,
			cellStyle: {
				textAlign: "right",
			},
		});
		logo1.appendChild(sepakbolaOptions.images[seasonSelected[i].Team1.TeamId].cloneNode());

		//--  GOAL1 : Goal2
		KadUtils.KadTable.addCell(row, {
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
					}
				}
			},
			cellStyle: {
				textAlign: "center",
			},
		});

		//--  VereinsLogo2
		const logo2 = KadUtils.KadTable.addCell(row, {
			names: ["sepakbolaMatchesLogo", "logoT2", i],
			type: "Lbl",
			text: `${seasonSelected[i].Team2.ShortName || seasonSelected[i].Team2.TeamName} `,
			cellStyle: {
				textAlign: "left",
			},
		});
		logo2.appendChild(sepakbolaOptions.images[seasonSelected[i].Team2.TeamId].cloneNode());
	}
}

function sepakbolaTableReturn(data) {
	sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].table = data;
	const table = sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].table;
	sepakbolaPushImages("table");
	//header
	KadUtils.KadTable.clear("idTabHeader_SepakbolaTable");
	const rowTh = KadUtils.KadTable.insertRow("idTabHeader_SepakbolaTable");
	KadUtils.KadTable.addHeaderCell(rowTh, {
		names: ["sepakbolaTableHeader", "season"],
		type: "Lbl",
		text: "",
		colSpan: 3,
		cellStyle: {
			textAlign: "left",
		},
	});
	KadUtils.KadTable.addHeaderCell(rowTh, {
		names: ["sepakbolaTableHeader", "Spiele"],
		type: "Lbl",
		text: "Sp",
	});
	KadUtils.KadTable.addHeaderCell(rowTh, {
		names: ["sepakbolaTableHeader", "Sieg"],
		type: "Lbl",
		text: "S",
	});
	KadUtils.KadTable.addHeaderCell(rowTh, {
		names: ["sepakbolaTableHeader", "Unentschieden"],
		type: "Lbl",
		text: "U",
	});
	KadUtils.KadTable.addHeaderCell(rowTh, {
		names: ["sepakbolaTableHeader", "Niederlage"],
		type: "Lbl",
		text: "N",
	});
	KadUtils.KadTable.addHeaderCell(rowTh, {
		names: ["sepakbolaTableHeader", "Diff"],
		type: "Lbl",
		text: "TD",
	});
	KadUtils.KadTable.addHeaderCell(rowTh, {
		names: ["sepakbolaTableHeader", "Points"],
		type: "Lbl",
		text: "P",
	});

	// body
	KadUtils.KadTable.clear("idTabBody_SepakbolaTable");
	for (let i = 0; i < table.length; i++) {
		let row = KadUtils.KadTable.insertRow("idTabBody_SepakbolaTable");

		//--  Platz
		KadUtils.KadTable.addCell(row, {
			names: ["sepakbolaTable", "place", i],
			type: "Lbl",
			text: i + 1,
			cellStyle: {
				textAlign: "center",
			},
		});

		//--  VereinsLogo
		const logo = KadUtils.KadTable.addCell(row, {
			names: ["sepakbolaTable", "logo", i],
			type: "Lbl",
			text: "",
		});
		logo.appendChild(sepakbolaOptions.images[table[i].TeamInfoId]);

		//--  Team Name
		KadUtils.KadTable.addCell(row, {
			names: ["sepakbolaTable", "name", i],
			type: "Lbl",
			text: table[i].ShortName != null ? table[i].ShortName : table[i].TeamName,
			cellStyle: {
				textAlign: "left",
			},
			copy: true,
		});

		//--  Spiele
		KadUtils.KadTable.addCell(row, {
			names: ["sepakbolaTable", "matchcount", i],
			type: "Lbl",
			text: `(${table[i].Matches})`,

			cellStyle: {
				textAlign: "left",
			},
		});

		//--  Siege
		KadUtils.KadTable.addCell(row, {
			names: ["sepakbolaTable", "siege", i],
			type: "Lbl",
			text: table[i].Won,

			cellStyle: {
				textAlign: "right",
			},
		});
		//--  Unentschieden
		KadUtils.KadTable.addCell(row, {
			names: ["sepakbolaTable", "draw", i],
			type: "Lbl",
			text: table[i].Draw,

			cellStyle: {
				textAlign: "right",
			},
		});
		//--  Niederlage
		KadUtils.KadTable.addCell(row, {
			names: ["sepakbolaTable", "lost", i],
			type: "Lbl",
			text: table[i].Lost,

			cellStyle: {
				textAlign: "right",
			},
		});

		//--  T-Diff
		KadUtils.KadTable.addCell(row, {
			names: ["sepakbolaTable", "goalDiff", i],
			type: "Lbl",
			text: table[i].GoalDiff > 0 ? `(+${table[i].GoalDiff})` : `(${table[i].GoalDiff})`,

			cellStyle: {
				textAlign: "right",
			},
		});

		// points
		KadUtils.KadTable.addCell(row, {
			names: ["sepakbolaTable", "points", i],
			type: "Lbl",
			text: table[i].Points,
			cellStyle: {
				textAlign: "right",
			},
		});
	}
}

function sepakbolaPushImages(arr) {
	if (arr == "table") {
		for (const obj of sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].table) {
			if (!sepakbolaOptions.images.hasOwnProperty(obj.TeamInfoId)) {
				sepakbolaOptions.images[obj.TeamInfoId] = sepakbolaCreateImage(obj.TeamIconUrl);
			}
		}
	}
	if (arr == "match") {
		for (const objArr of sepakbolaOptions.liga[sepakbolaOptions.selected.ligaIndex].matches) {
			for (const obj of objArr) {
				if (!sepakbolaOptions.images.hasOwnProperty(obj.Team1.TeamId)) {
					sepakbolaOptions.images[obj.Team1.TeamId] = sepakbolaCreateImage(obj.Team1.TeamIconUrl);
				}
				if (!sepakbolaOptions.images.hasOwnProperty(obj.Team2.TeamId)) {
					sepakbolaOptions.images[obj.Team2.TeamId] = sepakbolaCreateImage(obj.Team2.TeamIconUrl);
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
