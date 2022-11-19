const afinnOptions = {
  data: null,
  searchInput: "",
  results: {}
}

function clear_cl_Afinn() {
  resetInput("idVin_analysisEntry", "Type text to analyze")
  dbID("idLbl_analysisResult").textContent = "~Average score~";
  clearTable("idTabBody_analysisResult");
};

function analysisNews() {
  dbID("idVin_analysisEntry").value = newsData.articles[newsData.currIndex].description;
  afinnInput(newsData.articles[newsData.currIndex].description);
}

function analysisWiki() {
  if (nuncDiscipuli.saves.WikiSearch.content != null) {
    let pagesID = Object.keys(nuncDiscipuli.saves.WikiSearch.content);
    dbID("idVin_analysisEntry").value = nuncDiscipuli.saves.WikiSearch.content[pagesID].extract;
    afinnInput(nuncDiscipuli.saves.WikiSearch.content[pagesID].extract);
  }
}

async function afinnInput(input = null) {
  afinnOptions.searchInput = input;
  if (input === null) {
    afinnOptions.searchInput = dbID("idVin_analysisEntry").value.trim();
  }
  if (afinnOptions.searchInput == "") {
    dbID("idLbl_analysisResult").textContent = "~Average score~";
    clearTable("idTabBody_analysisResult");
    return
  };
  afinnOptions.results = afinnAnalyze();
  if (afinnOptions.results != null) {
    afinnCreateOutput();
    afinnCreateTable();
  }
};

function afinnLoadData(data) {
  afinnOptions.data = data
  afinnAnalyze();
}

function afinnAnalyze() {
  if (afinnOptions.data === null) {
    globalP5.loadJSON("./Data/DataLists/AfinnGerman.json", afinnLoadData, 'json');
    return null
  }
  let results = {
    totalScore: 0,
    singleScores: 0,
    wordCount: 0,
    analysedWords: {},
  };
  const regexSplit = new RegExp(/[0-9_\:\.\-\s\\\/\,\?\!]+/);
  const regexClean = new RegExp(/[$-/:-?{-~!"^_`\ [\]] /);
  let words = afinnOptions.searchInput.split(regexSplit);
  words = words.filter((word) => {
    return !(!regexClean.test(word) && word === "" || word === undefined || word === "-" || word === "…")
  });
  for (let j = words.length - 1; j >= 0; j--) {
    let score = 0;
    let word = words[j];
    word = word.toString().toLowerCase();
    if (afinnOptions.data.hasOwnProperty(word)) {
      const wordScore = Number(afinnOptions.data[word]);
      results.wordCount++;
      results.singleScores += wordScore;
      if (!results.analysedWords.hasOwnProperty(word)) {
        results.analysedWords[word] = {
          score: wordScore,
          occurence: 1
        };
      } else {
        results.analysedWords[word].occurence += 1;
      }
    };
  };
  results.totalScore = (results.singleScores == 0) ? null : results.singleScores / results.wordCount;
  return results
};

function afinnCreateOutput() {
  if (afinnOptions.results.totalScore === null) {
    dbID("idLbl_analysisResult").textContent = "~~~~~~~";
    dbID("idProg_analysisProgress").setAttribute("value", 10);
    clearTable("idTabBody_analysisResult");
    clearTable("idTabBody_analysisResult");
  } else {
    const score = analysisConvertScore(afinnOptions.results.totalScore)
    const plural = (afinnOptions.results.wordCount == 1) ? "Wort" : "Wörter";
    const count = `(${afinnOptions.results.wordCount} ${plural})`;
    dbID("idLbl_analysisResult").textContent = `Ø${score} ${count}`;
    dbID("idProg_analysisProgress").setAttribute("value", score + 10);
    afinnCreateTable();
  }
};

function afinnCreateTable() {
  clearTable("idTabBody_analysisResult");
  const data = afinnOptions.results.analysedWords; //alias
  const dataSorted = Object.keys(data).sort((a, b) => {
    return data[b].score - data[a].score
  })
  for (let i = dataSorted.length - 1; i >= 0; i--) {
    if (dataSorted.length > 0) {
      let row = insertTableRow("idTabBody_analysisResult");
      let foundPos = null;
      for (let n = 0; n < dataSorted.length; n++) {
        if (data[dataSorted[n]].score >= 0) {
          foundPos = dataSorted.splice(n, 1);
          break;
        };
      };
      tableAddCell(row, {
        names: ["analysisPosWord", i],
        type: "Lbl",
        text: (foundPos != null) ? (data[foundPos].occurence > 1) ? `${foundPos} (${data[foundPos].occurence})` : foundPos : "",
        cellStyle: {
          textAlign: "right"
        },
        copy: (foundPos != null) ? true : false
      });
      tableAddCell(row, {
        names: ["analysisPosScore", i],
        type: "Lbl",
        text: (foundPos != null) ? analysisConvertScore(data[foundPos].score) : "",
        createCellClass: [(Object.keys(data).length > 1) ? "clTab_borderThinRight" : null],
        cellStyle: {
          textAlign: "right",
        },
        copy: (foundPos != null) ? true : false
      });

      let foundNeg = null;
      for (let n = 0; n < dataSorted.length; n++) {
        if (data[dataSorted[n]].score < 0) {
          foundNeg = dataSorted.splice(n, 1);
          break;
        };
      };
      tableAddCell(row, {
        names: ["analysisNegWord", i],
        type: "Lbl",
        // text: (foundNeg != null) ? foundNeg : "",
        text: (foundNeg != null) ? (data[foundNeg].occurence > 1) ? `${foundNeg} (${data[foundNeg].occurence})` : foundNeg : "",
        cellStyle: {
          textAlign: "right"
        },
        copy: (foundNeg != null) ? true : false
      });
      tableAddCell(row, {
        names: ["analysisNegScore", i],
        type: "Lbl",
        text: (foundNeg != null) ? analysisConvertScore(data[foundNeg].score) : "",
        cellStyle: {
          textAlign: "right"
        },
        copy: (foundNeg != null) ? true : false
      });
    };
  };
};

function analysisConvertScore(score) {
  return Math.floor(score * 1000) / 100;
}