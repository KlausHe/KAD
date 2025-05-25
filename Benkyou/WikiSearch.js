import { Data_Country_CodesIso639 } from "../KadData/KadData.js";
import { dbID, dbIDStyle, initEL, KadFile, KadTable } from "../KadUtils/KadUtils.js";

const wikiOptions = {
  get searchUrl() {
    return `https://${this.search.language}.wikipedia.org/w/api.php?action=opensearch&limit=30&format=json&origin=*&search=`;
  },
  get contentUrl() {
    return `https://${this.search.language}.wikipedia.org/w/api.php?action=query&prop=extracts&rvprop=content&rvsection=0&exintro&explaintext&redirects=1&format=json&origin=*&titles=`;
  },
  get imageUrl() {
    return `https://${this.search.language}.wikipedia.org/w/api.php?action=query&prop=pageimages&redirects=1&format=json&origin=*&pithumbsize=100&titles=`;
  },
  get openUrl() {
    return `https://${this.search.language}.wikipedia.org/wiki/`;
  },
  inputTimer: null,
  resultTerms: null,
  search: {
    tab: null,
    content: null,
    language: null,
    image: null,
  },
};

export const WikiSearchData = {
  get data() {
    return wikiOptions.search;
  },
};

initEL({ id: idVin_wikiInput, fn: wikiSearchInput, resetValue: "Search on Wiki" });
initEL({ id: idBtn_wikiInput, fn: wikiSearchInput });
initEL({ id: idSel_wikiLanguage, fn: wikiSearchLanguage, selStartValue: "German", selList: Array.from(Data_Country_CodesIso639).map((item) => [item[1], item[0]]) });

export function clear_cl_WikiSearch() {
  idVin_wikiInput.KadReset();
  idSel_wikiLanguage.KadReset();
  dbID("idDiv_wiki_Title").textContent = "";
  dbID("idDiv_wiki_Text").textContent = "";
  dbID("idImg_Wiki_Image").src = "";
  dbIDStyle("idImg_Wiki_Image").display = "none";
  wikiOptions.search = { tab: null, content: null, language: idSel_wikiLanguage.KadGet(), img: null };
}

function wikiSearchInput() {
  wikiOptions.search.tab = idVin_wikiInput.KadGet().replace(/\s+/g, "_");
  if (wikiOptions.inputTimer != null) {
    clearTimeout(wikiOptions.inputTimer);
    wikiOptions.inputTimer = null;
  }
  wikiOptions.inputTimer = setTimeout(wikiSearchGetData, 400);
}

function wikiSearchGetData() {
  if (wikiOptions.search.tab != null && wikiOptions.search.tab != "") {
    KadFile.loadUrlToJSON({ variable: "data", url: `${wikiOptions.searchUrl}${wikiOptions.search.tab}`, callback: wikiCreateTable });
    dbID("idDiv_wiki_Title").textContent = "Artikel wählen";
    dbID("idDiv_wiki_Title").onclick = null;
    dbID("idDiv_wiki_Text").textContent = "";
    dbID("idImg_Wiki_Image").src = "";
    dbIDStyle("idImg_Wiki_Image").display = "none";
  }
}

function wikiSearchLanguage() {
  wikiOptions.search.language = idSel_wikiLanguage.KadGet();
  if (!wikiOptions.search.tab) return;
  wikiSearchInput();
}

function showWiki(index) {
  KadFile.loadUrlToJSON({ variable: "data", url: `${wikiOptions.contentUrl}${wikiOptions.resultTerms[index]}`, callback: wikiShowSelectedText });
  KadFile.loadUrlToJSON({ variable: "data", url: `${wikiOptions.imageUrl}${wikiOptions.resultTerms[index]}`, callback: wikiShowSelectedImage });
  dbID("idDiv_wiki_Title").textContent = "searching...";
  dbID("idDiv_wiki_Title").onclick = null;
}

function wikiCreateTable(data) {
  wikiOptions.resultTerms = data.data[1];
  const body = [
    {
      type: "KADImg",
      data: "right",
      settings: { onclick: showWiki },
    },
    {
      data: wikiOptions.resultTerms,
      settings: { onclick: showWiki },
    },
  ];
  KadTable.createHTMLGrid({ id: idTab_wikiTable, body });
}

function wikiShowSelectedText(data) {
  wikiOptions.search.content = data.data.query.pages;
  let pagesID = Object.keys(wikiOptions.search.content);
  const title = wikiOptions.search.content[pagesID].title;
  dbID("idDiv_wiki_Title").textContent = title;
  dbID("idDiv_wiki_Title").onclick = () => {
    const urlTitle = title.replace(/\s+/g, "_");
    window.open(`${wikiOptions.openUrl}${urlTitle}`);
  };
  dbID("idDiv_wiki_Text").textContent = wikiOptions.search.content[pagesID].extract;
}

function wikiShowSelectedImage(data) {
  wikiOptions.search.image = data.data.query.pages;
  let pagesID = Object.keys(wikiOptions.search.image);

  let src = "";
  let display = "none";
  if (wikiOptions.search.image[pagesID].thumbnail) {
    src = wikiOptions.search.image[pagesID].thumbnail.source;
    display = "initial";
  }
  dbID("idImg_Wiki_Image").src = src;
  dbIDStyle("idImg_Wiki_Image").display = display;
}
