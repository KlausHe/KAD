import { Data_Country_CodesIso639 } from "../KadData/KadData_Countries.js";
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

const Vin_wikiInput = initEL({ id: "idVin_wikiInput", fn: wikiSearchInput, resetValue: "Search on Wiki" });
const Btn_wikiInput = initEL({ id: "idBtn_wikiInput", fn: wikiSearchInput });
const Div_wiki_Title = initEL({ id: "idDiv_wiki_Title" });
const Div_wiki_Text = initEL({ id: "idDiv_wiki_Text" });
const Sel_wikiLanguage = initEL({ id: "idSel_wikiLanguage", fn: wikiSearchLanguage, selStartValue: "German", selList: Array.from(Data_Country_CodesIso639).map((item) => [item[1], item[0]]) });

export function clear_cl_WikiSearch() {
  Vin_wikiInput.KadReset();
  Sel_wikiLanguage.KadReset();
  Div_wiki_Title.KadSetText("");
  Div_wiki_Text.KadSetText("");
  dbID("idImg_Wiki_Image").src = "";
  dbIDStyle("idImg_Wiki_Image").display = "none";
  wikiOptions.search = { tab: null, content: null, language: Sel_wikiLanguage.KadGet(), img: null };
}
function wikiSearchLanguage() {
  wikiOptions.search.language = Sel_wikiLanguage.KadGet();
  if (!wikiOptions.search.tab) return;
  wikiSearchInput();
}

function wikiSearchInput() {
  wikiOptions.search.tab = Vin_wikiInput.KadGet().replace(/\s+/g, "_");
  if (wikiOptions.search.tab == null && wikiOptions.search.tab == "") return;
  Div_wiki_Title.KadSetText("Artikel wählen");
  Div_wiki_Title.onclick = null;
  Div_wiki_Text.KadSetText("");
  dbID("idImg_Wiki_Image").src = "";
  dbIDStyle("idImg_Wiki_Image").display = "none";
  KadFile.loadUrlToJSON({ variable: "data", url: `${wikiOptions.searchUrl}${wikiOptions.search.tab}`, callback: wikiCreateTable, errorCallback: wikiSearchErrorData });
}

function showWiki(index) {
  KadFile.loadUrlToJSON({ variable: "data", url: `${wikiOptions.contentUrl}${wikiOptions.resultTerms[index]}`, callback: wikiShowSelectedText, errorCallback: wikiSearchErrorData });
  KadFile.loadUrlToJSON({ variable: "data", url: `${wikiOptions.imageUrl}${wikiOptions.resultTerms[index]}`, callback: wikiShowSelectedImage, errorCallback: wikiSearchErrorData });
  Div_wiki_Title.KadSetText("searching...");
  Div_wiki_Title.onclick = null;
}

function wikiSearchErrorData({ error }) {
  console.error("Error  loading data for Wiki", error);
}

function wikiCreateTable(data) {
  wikiOptions.resultTerms = data.data[1];
  const body = [
    { type: "KADImg", data: "right", settings: { onclick: showWiki } },
    { data: wikiOptions.resultTerms, settings: { onclick: showWiki } },
  ];
  KadTable.createHTMLGrid({ id: "idTab_wikiTable", body });
}

function wikiShowSelectedText(data) {
  wikiOptions.search.content = data.data.query.pages;
  let pagesID = Object.keys(wikiOptions.search.content);
  const title = wikiOptions.search.content[pagesID].title;
  Div_wiki_Title.KadSetText(title);
  Div_wiki_Title.onclick = () => {
    const urlTitle = title.replace(/\s+/g, "_");
    window.open(`${wikiOptions.openUrl}${urlTitle}`);
  };
  Div_wiki_Text.KadSetText(wikiOptions.search.content[pagesID].extract);
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
