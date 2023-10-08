const newsData = {
	intervalTimeTicker: 1000 * 20, //20 sec
	intervalTicker: null,
	currIndex: 0,
	articles: [],
	categories: {
		top: "Allgemeines",
		business: "Business",
		entertainment: "Unterhaltung",
		health: "Gesundheit",
		science: "Wissenschaft",
		politics: "Politik",
		sports: "Sport",
		technology: "Technologie",
		environment: "Umwelt",
	},
	default: {
		category: "top",
		country: "de",
	},
};

function clear_cl_News() {
	KadUtils.DOM.clearFirstChild("idSel_newsCountry");
	KadUtils.DOM.clearFirstChild("idSel_newsCategory");
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
	KadUtils.dbID("idSel_newsCategory").appendChild(optGroup);

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
	KadUtils.dbID("idSel_newsCountry").appendChild(optGroup);

	KadUtils.dbID("idBtn_tickerNewsToggle").textContent = "Start Ticker";
	KadUtils.DOM.btnColor("idBtn_tickerNewsToggle");
	newsUpdateOptions();
}

function newsUpdateOptions() {
	KadUtils.socketPost("News", {
		category: KadUtils.dbID("idSel_newsCategory").value,
		country: KadUtils.dbID("idSel_newsCountry").value,
	});
}

function newsError(errMsg) {
	newsData.articles = [];
	newsData.articles[0] = {};
	newsData.articles[0].title = errMsg;
	newsData.articles[0].description = "";
	newsData.articles[0].dateInfo = "  &#x1F61E  ";
	newsData.articles[0].error = true;
	KadUtils.Table.clear("idTabBody_newsTitleTable");
	newsStopTicker();
	newsData.currIndex = 0;
}

function newsReturn(data) {
	if (data.error) {
		newsError(data.error);
		return;
	}
	if (data.results.length == 0) {
		newsError("No NEWS found for this Topic!");
		return;
	}
	newsData.articles = data.results;
	for (let i = newsData.articles.length - 1; i >= 0; i--) {
		newsData.articles[i].dateInfo = KadUtils.Date.getDate(newsData.articles[i].pubDate, { format: "DD.MM.YY/HH:mm" });
		let link = newsData.articles[i].link.replace(/https:\/\//, "");
		link = link.replace(/http:\/\//, "");
		link = link.replace(/www./, "");
		newsData.articles[i].source = link.split("/")[0];
	}
	newsCreateTable();
	newsData.currIndex = 0;
	showNews();
}

function showNews() {
	if (newsData.articles.length > 0) {
		KadUtils.dbID("idDiv_News_Title").innerHTML = `${newsData.articles[newsData.currIndex].title} (${newsData.articles[newsData.currIndex].dateInfo}, ${newsData.articles[newsData.currIndex].creator || newsData.articles[newsData.currIndex].source_id})`;
		KadUtils.dbID("idDiv_News_Text").innerHTML = newsData.articles[newsData.currIndex].description;
		if (newsData.articles[newsData.currIndex].image_url != null) {
			KadUtils.dbID("idImg_News_Image").src = newsData.articles[newsData.currIndex].image_url;
			KadUtils.dbID("idImg_News_Image").setAttribute("imgSize", "thumbnail");
		}
		newsUpdateTableIcons();
	}
}

function newsCreateTable() {
	KadUtils.Table.clear("idTabBody_newsTitleTable");
	for (let i = 0; i < newsData.articles.length; i++) {
		const row = KadUtils.Table.insertRow("idTabBody_newsTitleTable");
		row.id = `idRow_NewsTitle_${i}`;

		// arrow
		KadUtils.Table.addCell(row, {
			names: ["newsContent", i],
			type: "Img",
			subGroup: "subgrid",
			img: i == 0 ? "search" : "right",
			datasets: {
				shown: i == 0,
			},
			cellOnclick: () => {
				newsData.currIndex = i;
				newsStopTicker();
				news_URL();
			},
			onmouseover: () => {
				KadUtils.dbID("idTabBody_newsTitleTable").rows[i].cells[0].childNodes[0].src = KadUtils.DOM.getImgPath("globe");
			},
			onmouseleave: () => {
				if (KadUtils.dbID("idTabBody_newsTitleTable").rows[i].cells[0].childNodes[0].dataset.shown == "true") {
					KadUtils.dbID("idTabBody_newsTitleTable").rows[i].cells[0].childNodes[0].src = KadUtils.DOM.getImgPath("search");
				} else {
					KadUtils.dbID("idTabBody_newsTitleTable").rows[i].cells[0].childNodes[0].src = KadUtils.DOM.getImgPath("right");
				}
			},
		});

		//--  Title Label
		KadUtils.Table.addCell(row, {
			names: ["newsSource", i],
			type: "Lbl",
			text: newsData.articles[i].source,
			cellStyle: {
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
				textAlign: "left",
			},
			cellOnclick: () => {
				newsData.currIndex = i;
				newsStopTicker();
				showNews();
			},
		});
	}
}

function newsUpdateTableIcons() {
	if (!newsData.articles[0].hasOwnProperty("error")) {
		let activeImg = document.querySelectorAll('[data-shown="true"]')[0];
		activeImg.src = KadUtils.DOM.getImgPath("right");
		activeImg.setAttribute("data-shown", false);
		let nextActiveImg = KadUtils.dbID("idTabBody_newsTitleTable").rows[newsData.currIndex].cells[0].childNodes[0];
		nextActiveImg.src = KadUtils.DOM.getImgPath("search");
		nextActiveImg.setAttribute("data-shown", true);
	}
}

function news_URL() {
	newsStopTicker();
	window.open(newsData.articles[newsData.currIndex].link);
}

function newsShowNext() {
	let step = newsData.intervalTicker === null ? 1 : 0;
	newsStopTicker();
	newsData.currIndex = (newsData.currIndex + step + newsData.articles.length) % newsData.articles.length;
	showNews();
}

function newsToggleTicker() {
	if (newsData.intervalTicker === null) {
		newsData.intervalTicker = setInterval(newsAutoTicker, newsData.intervalTimeTicker);
		KadUtils.dbID("idBtn_tickerNewsToggle").textContent = "Stop Ticker";
		KadUtils.DOM.btnColor("idBtn_tickerNewsToggle", "negative");
	} else {
		newsStopTicker();
	}
}

function newsAutoTicker() {
	newsData.currIndex++;
	if (newsData.currIndex == newsData.articles.length) {
		newsData.currIndex = 0;
		newsStopTicker();
	}
	showNews();
}

function newsStopTicker() {
	if (newsData.intervalTicker != null) {
		KadUtils.dbID("idBtn_tickerNewsToggle").textContent = "Start Ticker";
		KadUtils.DOM.btnColor("idBtn_tickerNewsToggle");
		clearInterval(newsData.intervalTicker);
		newsData.intervalTicker = null;
	}
}
