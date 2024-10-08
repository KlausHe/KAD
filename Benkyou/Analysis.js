import { KadFile, KadTable, dbID, errorChecked, initEL, objectLength } from "../KadUtils/KadUtils.js";
import { storage_cl_WikiSearch } from "./WikiSearch.js";

const analysisOptions = {
	data: null,
	searchInput: "",
	results: {},
};

initEL({ id: idVin_analysisEntry, fn: analysisInput, resetValue: "Type text to analyze" });
initEL({ id: idBtn_analyseWiki, fn: analysisWiki });
initEL({ id: idLbl_analysisResult, resetValue: "~Average score~" });

export function clear_cl_Analysis() {
	idVin_analysisEntry.KadReset();
	idLbl_analysisResult.KadReset();
	KadTable.clear("idTabBody_analysisResult");
}

function analysisWiki() {
	const data = storage_cl_WikiSearch.data;
	if (data.content != null) {
		let pagesID = Object.keys(data.content);
		idVin_analysisEntry.KadReset({ resetValue: data.content[pagesID].extract });
		analysisInput();
	}
}

async function analysisInput() {
	analysisOptions.searchInput = idVin_analysisEntry.KadGet();
	if (analysisOptions.searchInput == "") {
		idLbl_analysisResult.KadReset();
		KadTable.clear("idTabBody_analysisResult");
		return;
	}
	if (analysisOptions.data === null) {
		const { analyseData, error } = await KadFile.loadUrlToJSON({ variable: "analyseData", url: "../Data/DataLists/SentimentListGerman.json" });
		if (errorChecked(error, "Coult not receive data fpr 'Analysis'", error)) return;
		analysisOptions.data = analyseData;
	}
	analysisOptions.results = analysisAnalyze();
	if (analysisOptions.results != null) {
		analysisCreateOutput();
		analysisCreateTable();
	}
}

function analysisAnalyze() {
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
		if (analysisOptions.data[word]) {
			const wordScore = analysisOptions.data[word];
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
		idLbl_analysisResult.KadSetText("~~~~~~~");
		dbID("idProg_analysisProgress").setAttribute("value", 100);
		KadTable.clear("idTabBody_analysisResult");
		KadTable.clear("idTabBody_analysisResult");
	} else {
		const score = convertScore(analysisOptions.results.totalScore);
		const plural = analysisOptions.results.wordCount == 1 ? "Wort" : "Wörter";
		const count = `(${analysisOptions.results.wordCount} ${plural})`;
		idLbl_analysisResult.KadSetText(`Ø${score} ${count}`);
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
			let row = KadTable.createRow("idTabBody_analysisResult");
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
				createCellClass: [objectLength(data) > 1 ? "clTab_UIBorderThinRight" : null],
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
