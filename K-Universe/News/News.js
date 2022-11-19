//News
const newsData = {
  intervalTimeTicker: 1000 * 20, //20 sec
  intervalTicker: null,
  currIndex: 0,
  articles: [],
  searchOpt: {},
  categories: {
    category: "Kategorie",
    general: "Allgemeines",
    business: "Business",
    entertainment: "Unterhaltung",
    health: "Gesundheit",
    science: "Wissenschaft",
    sports: "Sport",
    technology: "Technologie"
  }
}

function clear_cl_News() {
  newsData.currIndex = 0;
  newsData.searchOpt = {
    q: "",
    category: "",
    language: "de",
    country: "de"
  };
  resetInput("idVin_newsKeyword", "Search")
  for (let i = 0; i < Object.keys(newsData.categories).length; i++) {
    dbID("idSel_newsCategory").options[i] = new Option(Object.values(newsData.categories)[i]);
  };
  dbID("idSel_newsCountry").options[0] = new Option("Land");
  for (let i = 0; i < Data_NewsCountries.length; i++) {
    dbID("idSel_newsCountry").options[i + 1] = new Option(Data_Country_CodesIso3166.get(Data_NewsCountries[i].toUpperCase()));
  };
  dbID("idBtn_tickerNewsToggle").textContent = "Start Ticker";
  btnColor("idBtn_tickerNewsToggle")
  newsRequestNewsset();
};

function newsUpdateOptions() {
  let categoryIndex = dbID("idSel_newsCategory").selectedIndex;
  let countryIndex = dbID("idSel_newsCountry").selectedIndex - 1;
  newsData.searchOpt = {
    q: dbID("idVin_newsKeyword").value.trim(),
    category: (categoryIndex > 0) ? Object.keys(newsData.categories)[categoryIndex] : "",
    language: "de",
    country: (countryIndex > 0) ? Data_NewsCountries[countryIndex] : "de"
  };
  newsRequestNewsset();
};

function newsRequestNewsset() {
  utilsSocketPost("News", newsData.searchOpt);
};

function newsError(errMsg) {
  newsData.articles = [];
  newsData.articles[0] = {};
  newsData.articles[0].title = errMsg;
  newsData.articles[0].description = "";
  newsData.articles[0].dateInfo = "  &#x1F61E  ";
  newsData.articles[0].error = true;
  clearTable("idTabBody_newsTitleTable");
  newsStopTicker();
  newsData.currIndex = 0;
}

function newsReturn(data) {
  if (data.err !== undefined) {
    console.log(data.err);
    newsError(data.err);
  } else if (data.status != "ok" || data.articles.length == 0) {
    newsError("No NEWS found for this Topic!");
  } else {
    newsData.articles = data.articles;
    for (let i = newsData.articles.length - 1; i >= 0; i--) {
      let title = newsData.articles[i].title;
      let desc = newsData.articles[i].description;
      if (desc == "" || desc === null || title == "" || title === null) {
        data.articles.splice(i, 1);
      } else {
        newsData.articles[i].dateInfo = new Date(newsData.articles[i].publishedAt).toLocaleString("default", {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/, /, "/");
      };
    };
    newsCreateTable();
    newsData.currIndex = 0;
  };
  showNews();
  resetInput("idVin_newsKeyword", newsData.searchOpt.q || "Search News")
};

function showNews() {
  if (newsData.articles.length > 0) {
    dbID("idDiv_News_Title").innerHTML = `${newsData.articles[newsData.currIndex].title} (${newsData.articles[newsData.currIndex].dateInfo})`;
    dbID("idDiv_News_Text").innerHTML = newsData.articles[newsData.currIndex].description;
    dbID("idImg_News_Image").src = newsData.articles[newsData.currIndex].urlToImage;
    dbID("idImg_News_Image").setAttribute("imgSize", "gfyPrev");
    newsUpdateTableIcons();
  };
};

function newsCreateTable() {
  clearTable("idTabBody_newsTitleTable");
  for (let i = 0; i < newsData.articles.length; i++) {
    const row = insertTableRow("idTabBody_newsTitleTable");
    row.id = `idRow_NewsTitle_${i}`;

    // arrow
    tableAddCell(row, {
      names: ["newsContent", i],
      type: "Img",
      subGroup: "subgrid",
      img: (i == 0) ? "search" : "right",
      datasets: {
        shown: (i == 0)
      },
      cellOnclick: () => {
        newsData.currIndex = i;
        newsStopTicker();
        news_URL();
      },
      onmouseover: () => {
        dbID("idTabBody_newsTitleTable").rows[i].cells[0].childNodes[0].src = imgPath("globe");
      },
      onmouseleave: () => {
        if (dbID("idTabBody_newsTitleTable").rows[i].cells[0].childNodes[0].dataset.shown == "true") {
          dbID("idTabBody_newsTitleTable").rows[i].cells[0].childNodes[0].src = imgPath("search");
        } else {
          dbID("idTabBody_newsTitleTable").rows[i].cells[0].childNodes[0].src = imgPath("right");
        };
      }
    });

    //--  Title Label
    tableAddCell(row, {
      names: ["newsSource", i],
      type: "Lbl",
      text: newsData.articles[i].source.name,
      cellStyle: {
        maxWidth: "8.333rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        textAlign: "left"
      },
      cellOnclick: () => {
        newsData.currIndex = i;
        newsStopTicker();
        showNews();
      }
    });
  };
};

function newsUpdateTableIcons() {
  if (!newsData.articles[0].hasOwnProperty("error")) {
    let activeImg = document.querySelectorAll('[data-shown="true"]')[0];
    activeImg.src = imgPath("right");
    activeImg.setAttribute('data-shown', false);
    let nextActiveImg = dbID("idTabBody_newsTitleTable").rows[newsData.currIndex].cells[0].childNodes[0];
    nextActiveImg.src = imgPath("search");
    nextActiveImg.setAttribute('data-shown', true);
  };
};

function news_URL() {
  newsStopTicker();
  window.open(newsData.articles[newsData.currIndex].url);
};

function newsShowNext() {
  let step = (newsData.intervalTicker === null) ? 1 : 0;
  newsStopTicker();
  newsData.currIndex = (newsData.currIndex + step + newsData.articles.length) % newsData.articles.length;
  showNews();
};

function newsToggleTicker() {
  if (newsData.intervalTicker === null) {
    newsData.intervalTicker = setInterval(newsAutoTicker, newsData.intervalTimeTicker);
    dbID("idBtn_tickerNewsToggle").textContent = "Stop Ticker";
    btnColor("idBtn_tickerNewsToggle", "negative")
  } else {
    newsStopTicker();
  };
};

function newsAutoTicker() {
  newsData.currIndex++;
  if (newsData.currIndex == newsData.articles.length) {
    newsData.currIndex = 0;
    newsStopTicker();
  };
  showNews();
};

function newsStopTicker() {
  if (newsData.intervalTicker != null) {
    dbID("idBtn_tickerNewsToggle").textContent = "Start Ticker";
    btnColor("idBtn_tickerNewsToggle")
    clearInterval(newsData.intervalTicker);
    newsData.intervalTicker = null;
  };
};