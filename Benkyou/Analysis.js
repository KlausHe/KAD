import { dbID, daEL, objectLength, KadDOM, KadTable } from "../General/KadUtils.js";
// import { newsData } from "../News/News.js";
import { storage_cl_WikiSearch } from "./WikiSearch.js";
import { globalP5 } from "../Main.js";

const analysisOptions = {
	data: null,
	searchInput: "",
	results: {},
};
daEL(idVin_analysisEntry, "input", analysisInput);
// daEL(idBtn_analyseNews, "click", analysisNews);
daEL(idBtn_analyseWiki, "click", analysisWiki);

export function clear_cl_Analysis() {
	KadDOM.resetInput("idVin_analysisEntry", "Type text to analyze");
	dbID("idLbl_analysisResult").textContent = "~Average score~";
	KadTable.clear("idTabBody_analysisResult");
}

// function analysisNews() {
// 	dbID("idVin_analysisEntry").value = newsData.articles[newsData.currIndex].description;
// 	analysisInput(newsData.articles[newsData.currIndex].description);
// }

function analysisWiki() {
	const data = storage_cl_WikiSearch.data;
	if (data.content != null) {
		let pagesID = Object.keys(data.content);
		dbID("idVin_analysisEntry").value = data.content[pagesID].extract;
		analysisInput();
	}
}

async function analysisInput() {
	analysisOptions.searchInput = KadDOM.stringFromInput(idVin_analysisEntry);
	if (analysisOptions.searchInput == "") {
		dbID("idLbl_analysisResult").textContent = "~Average score~";
		KadTable.clear("idTabBody_analysisResult");
		return;
	}
	analysisOptions.results = analysisAnalyze();
	if (analysisOptions.results != null) {
		analysisCreateOutput();
		analysisCreateTable();
	}
}

function analysisLoadData(data) {
	analysisOptions.data = data;
  analysisInput()
}

function analysisAnalyze() {
	if (analysisOptions.data === null) {
		globalP5.loadJSON("./Data/DataLists/AnalysisGerman.json", analysisLoadData, "json");
		return null;
	}
	let results = {
		totalScore: 0,
		singleScores: 0,
		wordCount: 0,
		analysedWords: {},
	};
	const regexSplit = new RegExp(/[0-9_\:\.\-\s\\\/\,\?\!]+/);
	const regexClean = new RegExp(/[$-/:-?{-~!"^_`\ [\]] /);
	let words = analysisOptions.searchInput.split(regexSplit);
	words = words.filter((word) => {
		return !((!regexClean.test(word) && word === "") || word === undefined || word === "-" || word === "…");
	});
	for (let j = words.length - 1; j >= 0; j--) {
		let word = words[j];
		word = word.toString().toLowerCase();
		if (analysisOptions.data.hasOwnProperty(word)) {
			const wordScore = Number(analysisOptions.data[word]);
			results.wordCount++;
			results.singleScores += wordScore;
			if (!results.analysedWords.hasOwnProperty(word)) {
				results.analysedWords[word] = {
					score: wordScore,
					occurence: 1,
				};
			} else {
				results.analysedWords[word].occurence += 1;
			}
		}
	}
	results.totalScore = results.singleScores == 0 ? null : results.singleScores / results.wordCount;
	return results;
}

function analysisCreateOutput() {
	if (analysisOptions.results.totalScore === null) {
		dbID("idLbl_analysisResult").textContent = "~~~~~~~";
		dbID("idProg_analysisProgress").setAttribute("value", 100);
		KadTable.clear("idTabBody_analysisResult");
		KadTable.clear("idTabBody_analysisResult");
	} else {
		const score = convertScore(analysisOptions.results.totalScore);
		const plural = analysisOptions.results.wordCount == 1 ? "Wort" : "Wörter";
		const count = `(${analysisOptions.results.wordCount} ${plural})`;
		dbID("idLbl_analysisResult").textContent = `Ø${score} ${count}`;
		dbID("idProg_analysisProgress").setAttribute("value", score + 100);
		analysisCreateTable();
	}
}

function analysisCreateTable() {
	KadTable.clear("idTabBody_analysisResult");
	const data = analysisOptions.results.analysedWords; //alias
	const dataSorted = Object.keys(data).sort((a, b) => {
		return data[b].score - data[a].score;
	});
	for (let i = dataSorted.length - 1; i >= 0; i--) {
		if (dataSorted.length > 0) {
			let row = KadTable.insertRow("idTabBody_analysisResult");
			let foundPos = null;
			for (let n = 0; n < dataSorted.length; n++) {
				if (data[dataSorted[n]].score >= 0) {
					foundPos = dataSorted.splice(n, 1);
					break;
				}
			}
			KadTable.addCell(row, {
				names: ["analysisPosWord", i],
				type: "Lbl",
				text: foundPos != null ? (data[foundPos].occurence > 1 ? `${foundPos} (${data[foundPos].occurence})` : foundPos) : "",
				cellStyle: {
					textAlign: "right",
				},
				copy: foundPos != null ? true : false,
			});
			KadTable.addCell(row, {
				names: ["analysisPosScore", i],
				type: "Lbl",
				text: foundPos != null ? convertScore(data[foundPos].score) : "",
				createCellClass: [objectLength(data) > 1 ? "clTab_borderThinRight" : null],
				cellStyle: {
					textAlign: "right",
				},
				copy: foundPos != null ? true : false,
			});

			let foundNeg = null;
			for (let n = 0; n < dataSorted.length; n++) {
				if (data[dataSorted[n]].score < 0) {
					foundNeg = dataSorted.splice(n, 1);
					break;
				}
			}
			KadTable.addCell(row, {
				names: ["analysisNegWord", i],
				type: "Lbl",
				// text: (foundNeg != null) ? foundNeg : "",
				text: foundNeg != null ? (data[foundNeg].occurence > 1 ? `${foundNeg} (${data[foundNeg].occurence})` : foundNeg) : "",
				cellStyle: {
					textAlign: "right",
				},
				copy: foundNeg != null ? true : false,
			});
			KadTable.addCell(row, {
				names: ["analysisNegScore", i],
				type: "Lbl",
				text: foundNeg != null ? convertScore(data[foundNeg].score) : "",
				cellStyle: {
					textAlign: "right",
				},
				copy: foundNeg != null ? true : false,
			});
		}
	}
}

function convertScore(score) {
	return Math.floor(score * 1000) / 10;
}
