const synonymOptions = {
  urlP1: "https://www.openthesaurus.de/synonyme/search?q=",
  urlP2: "&format=application/json&similar=true&baseform=true",
  input: "",
  data: {}
}

function clear_cl_Synonym() {
  resetInput("idVin_synonymEntry", "Search for synonyms")
  clearTable("idTabHeader_synonym_baseform");
  clearTable("idTabHeader_synonym1");
  clearTable("idTabHeader_synonym2");
  clearTable("idTabBody_synonym1");
  clearTable("idTabBody_synonym2");
};

function newSynonym() {
  synonymOptions.input = dbID('idVin_synonymEntry').value.toString().trim();
  if (synonymOptions.input) {
    dbID('idVin_synonymEntry').value = "";
    synonymGetData();
  };
};

async function synonymGetData() {
  try {
    let response = await fetch(`${synonymOptions.urlP1}${synonymOptions.input}${synonymOptions.urlP2}`);
    synonymOptions.data = await response.json();
    dbID("idLbl_synonymSearchWord").textContent = synonymOptions.input;
    synonymCreateTable();
  } catch (err) {
    dbID("idLbl_synonymSearchWord").textContent = "---";
    console.error(err);
  }
};

function synonymCreateTable() {
  clearTable("idTabHeader_synonym_baseform");
  clearTable("idTabHeader_synonym1");
  clearTable("idTabHeader_synonym2");
  clearTable("idTabBody_synonym1");
  clearTable("idTabBody_synonym2");


  if (synonymOptions.data.hasOwnProperty("baseforms")) {
    let row = insertTableRow("idTabHeader_synonym_baseform");
    tableAddCellHeader(row, {
      names: ["synonym", "BaseformTitle"],
      type: "Lbl",
      text: "Grundform",
      cellStyle: {
        textAlign: "left"
      }
    });
    tableAddCellHeader(row, {
      names: ["synonym", "BaseformWord"],
      type: "Lbl",
      text: synonymOptions.data.baseforms[0],
      colSpan: 2,
      cellStyle: {
        textAlign: "left"
      }
    });
  };
  let sets = [];
  for (let i = 0; i < Object.keys(synonymOptions.data.synsets).length; i++) {
    sets = [...sets, ...synonymOptions.data.synsets[i].terms.map(index => index.term)];
  };
  if (sets.length > 0) {
    row = insertTableRow("idTabHeader_synonym1");
    tableAddCellHeader(row, {
      names: ["synonym", "synonymTitle"],
      type: "Lbl",
      text: "Synonyme",
      colSpan: 3,
      cellStyle: {
        textAlign: "left"
      }
    });
    for (let i = 0; i < sets.length; i++) {
      row = insertTableRow("idTabBody_synonym1");
      tableAddCell(row, {
        names: ["synonym", "synset", i],
        type: "Lbl",
        text: sets[i],
        cellStyle: {
          textAlign: "left"
        },
        copy: true
      });
      if (i < sets.length - 1) {
        i++;
        tableAddCell(row, {
          names: ["synonym", "synset", i],
          type: "Lbl",
          text: sets[i],
          cellStyle: {
            textAlign: "left"
          },
          copy: true
        });
      };
      if (i < sets.length - 1) {
        i++;
        tableAddCell(row, {
          names: ["synonym", "synset", i],
          type: "Lbl",
          text: sets[i],
          cellStyle: {
            textAlign: "left"
          },
          copy: true
        });
      };
    };
  };


  if (synonymOptions.data.hasOwnProperty("similarterms")) {
    row = insertTableRow("idTabHeader_synonym2");
    tableAddCellHeader(row, {
      names: ["synonym", "similar", "title"],
      type: "Lbl",
      text: `Ähnliche Befriffe:`,
      colSpan: 3,
      cellStyle: {
        textAlign: "left"
      }
    });
    for (let i = 0; i < Object.keys(synonymOptions.data.similarterms).length; i++) {
      row = insertTableRow("idTabBody_synonym2");
      tableAddCell(row, {
        names: ["synonym", "similarterms", i],
        type: "Lbl",
        text: synonymOptions.data.similarterms[i].term,
        cellStyle: {
          textAlign: "left"
        },
        alias: true,
        cellOnclick: () => {
          synonymOptions.input = synonymOptions.data.similarterms[i].term;
          synonymGetData();
        }
      });
      if (i < Object.keys(synonymOptions.data.similarterms).length - 1) {
        i++;
        tableAddCell(row, {
          names: ["synonym", "similarterms", i],
          type: "Lbl",
          text: synonymOptions.data.similarterms[i].term,
          cellStyle: {
            textAlign: "left"
          },
          alias: true,
          cellOnclick: () => {
            synonymOptions.input = synonymOptions.data.similarterms[i].term;
            synonymGetData();
          }
        });
      };
      if (i < Object.keys(synonymOptions.data.similarterms).length - 1) {
        i++;
        tableAddCell(row, {
          names: ["synonym", "similarterms", i],
          type: "Lbl",
          text: synonymOptions.data.similarterms[i].term,
          cellStyle: {
            textAlign: "left"
          },
          alias: true,
          cellOnclick: () => {
            synonymOptions.input = synonymOptions.data.similarterms[i].term;
            synonymGetData();
          }
        });
      };
    };
  };
};