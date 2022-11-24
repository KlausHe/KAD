//News
const newsData = {
  intervalTimeTicker: 1000 * 20, //20 sec
  intervalTicker: null,
  currIndex: 0,
  articles: [],
  categories: {
    general: "Allgemeines",
    business: "Business",
    entertainment: "Unterhaltung",
    health: "Gesundheit",
    science: "Wissenschaft",
    sports: "Sport",
    technology: "Technologie"
  },
  num: 10,
  default: {
    category: "general",
    country: "de",
    num: 1
  }
}

function clear_cl_News() {
  newsData.currIndex = 0;
  let optGroup = document.createElement("optgroup");
  optGroup.label = "Kategorie";
  for (const [key, value] of Object.entries(newsData.categories)) {
    const option = document.createElement("OPTION");
    option.textContent = value;
    option.value = key;
    if (key == newsData.default.category) {
      option.selected = true;
    }
    optGroup.appendChild(option);
  }
  dbID("idSel_newsCategory").appendChild(optGroup);

  optGroup = document.createElement("optgroup");
  optGroup.label = "Land";
  for (const value of Data_NewsCountries) {
    const option = document.createElement("OPTION");
    option.textContent = Data_Country_CodesIso3166.get(value.toUpperCase());
    option.value = value;
    if (value == newsData.default.country) {
      option.selected = true;
    }
    optGroup.appendChild(option);
  }
  dbID("idSel_newsCountry").appendChild(optGroup);

  optGroup = document.createElement("optgroup");
  optGroup.label = "Anzahl";
  for (let i = 0; i < newsData.num; i++) {
    const option = document.createElement("OPTION");
    option.textContent = (i + 1) * 10;
    option.value = (i + 1) * 10;
    if (i == newsData.default.num) {
      option.selected = true;
    }
    optGroup.appendChild(option);
  }
  dbID("idSel_newsNum").appendChild(optGroup);

  dbID("idBtn_tickerNewsToggle").textContent = "Start Ticker";
  btnColor("idBtn_tickerNewsToggle")
  newsUpdateOptions();
};

function newsUpdateOptions() {
  const searchOpt = {
    category: dbID("idSel_newsCategory").value,
    country: dbID("idSel_newsCountry").value,
    num: Number(dbID("idSel_newsNum").value),
  };
  utilsSocketPost("News", searchOpt);
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
  if (data.error) {
    console.log(data.error);
    newsError(data.error);
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