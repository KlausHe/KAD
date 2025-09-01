import { KadDOM, KadDate, KadFile, KadLog, KadString, KadTable, dbID, dbIDStyle, initEL } from "../KadUtils/KadUtils.js";

export const newsData = {
  get articlesURL() {
    return `https://www.tagesschau.de/api2u/news/?region=${this.region}&ressort=${this.ressort}`;
  },
  requestCount: [],
  currIndex: 0,
  articles: [],
  region: null,
  ressort: null,
  regionList: ["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"],
  ressortList: ["inland", "ausland", "wirtschaft", "sport", "video", "investigativ", "wissen"],
};

initEL({ id: dbID("idDiv_News_Title"), resetValue: "Nachrichtentitel" });
initEL({ id: dbID("idDiv_News_Text"), resetValue: "Nachrichtentext", animatedText: { animate: false, singleLetter: false } });
initEL({
  id: dbID("idSel_newsRegion"),
  fn: newsInputChanged,
  selGroup: { Region: newsData.regionList.map((v, index) => [v, index + 1]) },
});
initEL({
  id: dbID("idSel_newsRessort"),
  fn: newsInputChanged,
  selGroup: { Ressort: newsData.ressortList.map((v) => [KadString.firstLetterCap(v), v]) },
});

export function clear_cl_News() {
  dbID("idDiv_News_Title").KadReset();
  dbID("idDiv_News_Text").KadReset();
  dbID("idSel_newsRegion").KadReset();
  dbID("idSel_newsRessort").KadReset();
  newsData.requestCount = [];
  newsData.currIndex = 0;
  newsInputChanged();
}

function newsInputChanged() {
  newsData.region = dbID("idSel_newsRegion").KadGet();
  newsData.ressort = dbID("idSel_newsRessort").KadGet();
  newsGetData();
}

function newsError(...msg) {
  dbID("idDiv_News_Title").KadSetText(msg.join(" "));
  dbID("idDiv_News_Text").KadSetText("");
}

function newsCheckRequestCount() {
  const requestTime = Number(new Date().getTime());
  let index = newsData.requestCount.findIndex((time) => requestTime > time + 60 * 60 * 1000); // max 60 /stunde
  if (index != -1) newsData.requestCount.splice(index);
  newsData.requestCount.unshift(requestTime);

  if (newsData.requestCount.length > 59) {
    newsError("Maximal 60 Anfragen pro Stunde zulässig");
    return true;
  }
}

async function newsGetData() {
  if (newsCheckRequestCount()) return;
  const { data, error } = await KadFile.loadUrlToJSON({ variable: "data", url: newsData.articlesURL });
  if (KadLog.errorChecked(error, "Could not receive data for 'Overview/ ->News'", error)) return;
  newsData.articles = data.news;
  newsData.articles = newsData.articles.filter((n) => n.type == "story");
  newsData.currIndex = 0;
  newsCreateTable();
  showNews(0);
}

async function showNews(index) {
  newsData.currIndex = index;
  const date = KadDate.getDate(newsData.articles[newsData.currIndex].date, { format: "DD.MM.YY / HH:mm" });
  dbID("idDiv_News_Title").textContent = `${newsData.articles[newsData.currIndex].title} (${date})`;

  if (newsData.articles[newsData.currIndex].teaserImage) {
    dbID("idImg_News_Image").src = newsData.articles[newsData.currIndex].teaserImage.imageVariants["1x1-144"];
    dbIDStyle("idImg_News_Image").display = "initial";
  } else {
    dbIDStyle("idImg_News_Image").display = "none";
  }
  if (newsCheckRequestCount()) return;
  const { data, error } = await KadFile.loadUrlToJSON({ variable: "data", url: newsData.articles[newsData.currIndex].details });
  if (KadLog.errorChecked(error, "Could not receive data for 'Article/News'", error)) return;
  newsData.articles[newsData.currIndex].content = data.content;

  let cleandContent = newsData.articles[newsData.currIndex].content
    .filter((obj) => obj.type == "text")
    .map((obj) => `${obj.value}<br><br>`)
    .join(" ");
  KadDOM.scrollToTop(dbID("idDiv_News_Text"));
  dbID("idDiv_News_Text").KadSetHTML(cleandContent);
}
function newsOpenURL(index) {
  window.open(newsData.articles[index].shareURL);
}

function newsCreateTable() {
  const body = [
    {
      type: "KADImg",
      data: "globe",
      settings: {
        onclick: newsOpenURL,
        cursor: "alias",
      },
    },
    {
      data: newsData.articles.map((item) => item.topline),
      settings: {
        title: newsData.articles.map((item) => `${item.title}\n${item.firstSentence}`),
        description: "newsContent",
        onclick: showNews,
      },
    },
  ];
  KadTable.createHTMLGrid({ id: dbID("idTab_newsTable"), body });
}
