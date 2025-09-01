import { Data_SentimentListGerman } from "../KadData/KadData_SentimentListGerman.js";
import { KadTable, dbID, initEL } from "../KadUtils/KadUtils.js";
import { WikiSearchData } from "./WikiSearch.js";

const analysisOptions = {
  data: new Map(Data_SentimentListGerman),
  searchInput: "",
  results: {},
  header: [
    { data: "Positiv", colSpan: 2 },
    { data: "Negativ", colSpan: 2 },
  ],
};

initEL({ id: dbID("idVin_analysisEntry"), fn: analysisInput, resetValue: "Type text to analyze" });
initEL({ id: dbID("idBtn_analyseWiki"), fn: analysisWiki });
initEL({ id: dbID("idLbl_analysisResult"), resetValue: "~Average score~" });

export function clear_cl_Analysis() {
  dbID("idVin_analysisEntry").KadReset();
  dbID("idLbl_analysisResult").KadReset();
  KadTable.createHTMLGrid({ id: dbID("idTab_analysisTable"), header: analysisOptions.header });
}

function analysisWiki() {
  const data = WikiSearchData.data;
  if (data.content == null) return;
  let pagesID = Object.keys(data.content);
  dbID("idVin_analysisEntry").KadReset({ resetValue: data.content[pagesID].extract });
  analysisInput();
}

function analysisInput() {
  analysisOptions.searchInput = dbID("idVin_analysisEntry").KadGet();
  if (analysisOptions.searchInput == "") {
    dbID("idLbl_analysisResult").KadReset();
    KadTable.createHTMLGrid({ id: dbID("idTab_analysisTable"), header: analysisOptions.header });
    return;
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
    const wordScore = analysisOptions.data.get(word);
    if (wordScore) {
      results.wordCount++;
      results.singleScores += wordScore;
      if (!results.analysedWords.hasOwnProperty(word)) {
        results.analysedWords[word] = {
          word,
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
    dbID("idLbl_analysisResult").KadSetText("~~~~~~~");
    dbID("idProg_analysisProgress").setAttribute("value", 100);
    KadTable.createHTMLGrid({ id: dbID("idTab_analysisTable"), header: analysisOptions.header });
  } else {
    const score = convertScore(analysisOptions.results.totalScore);
    const plural = analysisOptions.results.wordCount == 1 ? "Wort" : "Wörter";
    const count = `(${analysisOptions.results.wordCount} ${plural})`;
    dbID("idLbl_analysisResult").KadSetText(`Ø${score} ${count}`);
    dbID("idProg_analysisProgress").setAttribute("value", score + 100);
    analysisCreateTable();
  }
}

function analysisCreateTable() {
  const data = analysisOptions.results.analysedWords;
  const keysSorted = Object.keys(data).sort((a, b) => {
    return data[b].score - data[a].score;
  });

  let positiveData = [];
  let negativeData = [];
  for (let key of keysSorted) {
    if (data[key].score >= 0) {
      positiveData.push(data[key]);
    } else {
      negativeData.push(data[key]);
    }
  }
  const body = [
    { data: positiveData.map((item) => (item.occurence > 1 ? `${item.word} (${item.occurence})` : item.word)), settings: { noBorder: "right" } },
    { data: positiveData.map((item) => convertScore(item.score)) },
    { data: negativeData.map((item) => (item.occurence > 1 ? `${item.word} (${item.occurence})` : item.word)), settings: { noBorder: "right" } },
    { data: negativeData.map((item) => convertScore(item.score)) },
  ];
  KadTable.createHTMLGrid({ id: dbID("idTab_analysisTable"), header: analysisOptions.header, body });
}

function convertScore(score) {
  return Math.floor(score * 1000) / 10;
}
