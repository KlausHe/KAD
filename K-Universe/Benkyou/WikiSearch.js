const wikiOptions = {
  get searchUrl() {
    return `https://${this.language}.wikipedia.org/w/api.php?action=opensearch&limit=30&format=json&search=`
  },
  get contentUrl() {
    return `https://${this.language}.wikipedia.org/w/api.php?action=query&prop=extracts&rvprop=content&rvsection=0&exintro&explaintext&redirects=1&format=json&titles=`
  },
  get imageUrl() {
    return `https://${this.language}.wikipedia.org/w/api.php?action=query&prop=pageimages&redirects=1&format=json&pithumbsize=100&titles=`
  },
  get openUrl() {
    return `https://${this.language}.wikipedia.org/wiki/`
  },
  get language() {
    return dbID("idSel_wikiLanguage").selectedOptions[0].dataset.code
  },
  random: null,
  resultTerms: null,
  search: {
    tab: null,
    content: null,
    image: null
  }
}

function clear_cl_WikiSearch() {
  wikiOptions.random = null;
  resetInput("idVin_wikiInput", "Search on Wiki")
  dbID("idDiv_wiki_Title").textContent = "";
  dbID("idDiv_wiki_Text").textContent = "";
  dbID("idImg_Wiki_Image").src = "";
  dbID("idImg_Wiki_Image").removeAttribute("imgSize");

  wikiOptions.search = {
    tab: null,
    content: null
  };
  clearTable("idTabBody_wikiTitleTable");
  wikiSearchPopulateLanguage();
};

function wikiSearchPopulateLanguage() {
  let lang = navigator.language.split("-")[0] || "de";
  Data_Country_CodesIso639.forEach((value, key) => {
    let option = document.createElement("option");
    option.textContent = value;
    option.setAttribute("data-code", key);
    if (key == lang) {
      option.selected = true;
    };
    dbID("idSel_wikiLanguage").appendChild(option);
  });
}

function wikiSearchInput(input = null, random = null) {
  wikiOptions.random = random;
  wikiOptions.search.tab = input ? input.trim() : idVin_wikiInput.value.replace(/\s+/g, '_');
  if (wikiOptions.search.tab != null && wikiOptions.search.tab != "") {
    globalP5.loadJSON(`${wikiOptions.searchUrl}${wikiOptions.search.tab}`, wikiCreateTable, 'jsonp');
    dbID("idDiv_wiki_Title").textContent = "Artikel wählen";
    dbID("idDiv_wiki_Title").onclick = null;
    dbID("idDiv_wiki_Text").textContent = "";
    dbID("idImg_Wiki_Image").src = "";
    dbID("idImg_Wiki_Image").removeAttribute("imgSize");
  };
};

function wikiSearchLanguage(obj) {
  wikiSearchInput();
}

function wikiCreateTable(data) {
  wikiOptions.resultTerms = data[1];
  clearTable("idTabBody_wikiTitleTable");
  for (let i = 0; i < wikiOptions.resultTerms.length; i++) {
    let row = insertTableRow("idTabBody_wikiTitleTable");
    // arrow
    const arrow = tableAddCell(row, {
      names: ["wikiContent", i],
      type: "Img",
      subGroup: "subgrid",
      img: "right",
      cellOnclick: () => {
        for (let j = 0; j < wikiOptions.resultTerms.length; j++) {
          dbID("idTabBody_wikiTitleTable").rows[j].cells[0].childNodes[0].src = imgPath("right");
        };
        dbID("idTabBody_wikiTitleTable").rows[i].cells[0].childNodes[0].src = imgPath("search");
        globalP5.loadJSON(wikiOptions.contentUrl + wikiOptions.resultTerms[i], wikiShowSelectedText, 'jsonp');
        dbID("idDiv_wiki_Title").textContent = "searching...";
        dbID("idDiv_wiki_Title").onclick = null;
      }
    });
    //--  Title
    tableAddCell(row, {
      names: ["wikiContent", i],
      type: "Lbl",
      text: wikiOptions.resultTerms[i],
      cellStyle: {
        textAlign: "left"
      },
      cellOnclick: () => {
        for (let j = 0; j < wikiOptions.resultTerms.length; j++) {
          dbID("idTabBody_wikiTitleTable").rows[j].cells[0].childNodes[0].src = imgPath("right");
        };
        dbID("idTabBody_wikiTitleTable").rows[i].cells[0].childNodes[0].src = imgPath("search");
        globalP5.loadJSON(wikiOptions.contentUrl + wikiOptions.resultTerms[i], wikiShowSelectedText, 'jsonp');
        globalP5.loadJSON(wikiOptions.imageUrl + wikiOptions.resultTerms[i], wikiShowSelectedImage, 'jsonp');
        dbID("idDiv_wiki_Title").textContent = "searching...";
        dbID("idDiv_wiki_Title").onclick = null;
      }
    });
  };

  if (wikiOptions.random) {
    wikiOptions.random = null
    wikiQueryRandom()
  }
};

function wikiQueryRandom() {
  const term = randomObject(wikiOptions.resultTerms);
  globalP5.loadJSON(wikiOptions.contentUrl + term, wikiShowSelectedText, 'jsonp');
  globalP5.loadJSON(wikiOptions.imageUrl + term, wikiShowSelectedImage, 'jsonp');
}

function wikiShowSelectedText(data, loaded) {
  wikiOptions.random = null;
  if (loaded) {
    wikiOptions.search.content = data;
  } else {
    wikiOptions.search.content = data.query.pages;
  };
  let pagesID = Object.keys(wikiOptions.search.content);
  const title = wikiOptions.search.content[pagesID].title;
  dbID("idDiv_wiki_Title").textContent = title;
  dbID("idDiv_wiki_Title").onclick = () => {
    const urlTitle = title.replace(/\s+/g, '_');
    window.open(`${wikiOptions.openUrl}${urlTitle}`);
  };
  dbID("idDiv_wiki_Text").textContent = wikiOptions.search.content[pagesID].extract;
};

function wikiShowSelectedImage(data, loaded) {
  if (loaded) {
    wikiOptions.search.image = data;
  } else {
    wikiOptions.search.image = data.query.pages;
  };
  let pagesID = Object.keys(wikiOptions.search.image);
  if (wikiOptions.search.image[pagesID].thumbnail) {
    dbID("idImg_Wiki_Image").src = wikiOptions.search.image[pagesID].thumbnail.source;
    dbID("idImg_Wiki_Image").setAttribute("imgSize", "wiki");
  }
}