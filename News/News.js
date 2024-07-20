import { dbID, KadDOM, KadDate, KadTable, initEL, KadString, log } from "../KadUtils/KadUtils.js";

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

initEL({ id: idDiv_News_Title, resetValue: "Nachrichtentitel" });
initEL({ id: idDiv_News_Text, resetValue: "Nachrichtentext" });
initEL({
	id: idSel_newsRegion,
	fn: newsInputChanged,
	selGroup: { Region: newsData.regionList.map((v, index) => [v, index + 1]) },
});
initEL({
	id: idSel_newsRessort,
	fn: newsInputChanged,
	selGroup: { Ressort: newsData.ressortList.map((v) => [KadString.firstLetterCap(v), v]) },
});

export function clear_cl_News() {
	idDiv_News_Title.KadReset();
	idDiv_News_Text.KadReset();
	idSel_newsRegion.KadReset();
	idSel_newsRessort.KadReset();
	newsData.requestCount = [];
	newsData.currIndex = 0;
	newsInputChanged();
}

function newsInputChanged() {
	newsData.region = idSel_newsRegion.KadGet();
	newsData.ressort = idSel_newsRessort.KadGet();
	newsGetData();
}

function newsError(...msg) {
	dbID(idDiv_News_Title).textContent = msg.join(" ");
	dbID(idDiv_News_Text).textContent = "";
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
	try {
		let response = await fetch(newsData.articlesURL);
		if (response.ok == true) {
			let data = await response.json();
			newsData.articles = data.news;
		} else {
			newsError("Fehler bei Datenabfrage. Stauts:", response.status);
      log(err)
      return
		}
	} catch (err) {
		newsError("Keine daten zum Anzeigen gefunden. Bitte später noch einmal verwuchen. Error: ", err);
    return
	}
	newsData.articles = newsData.articles.filter((n) => n.type == "story");
	newsData.currIndex = 0;
	newsCreateTable();
	showNews();
}

async function showNews() {
	const date = KadDate.getDate(newsData.articles[newsData.currIndex].date, { format: "DD.MM.YY / HH:mm" });
	dbID(idDiv_News_Title).textContent = `${newsData.articles[newsData.currIndex].title} (${date})`;

	dbID(idImg_News_Image).src = newsData.articles[newsData.currIndex].teaserImage.imageVariants["1x1-144"];
	if (newsCheckRequestCount()) return;
	try {
		let response = await fetch(newsData.articles[newsData.currIndex].details);
		let data = await response.json();
		newsData.articles[newsData.currIndex].content = data.content;
	} catch (err) {
		newsError(err);
	}

	let cleandContent = newsData.articles[newsData.currIndex].content
		.filter((obj) => obj.type == "text")
		.map((obj) => `${obj.value}<br><br>`)
		.join(" ");
	dbID(idDiv_News_Text).innerHTML = cleandContent;
	KadDOM.scrollToTop(idDiv_News_Text);
	newsUpdateTableIcons();
}

function newsCreateTable() {
	KadTable.clear("idTabBody_newsTitleTable");
	KadDOM.scrollToTop(idTabBody_newsTitleTable);
	for (let i = 0; i < newsData.articles.length; i++) {
		const row = KadTable.createRow("idTabBody_newsTitleTable");
		row.id = `idRow_NewsTitle_${i}`;

		// arrow
		KadTable.addCell(row, {
			names: ["newsContent", i],
			type: "Img",
			subGroup: "subgrid",
			img: "right",
			cellOnclick: () => {
				newsData.currIndex = i;
				newsOpenURL();
			},

			onmouseover: () => {
				dbID(`idImg_child_newsContent_${i}`).src = KadDOM.getImgPath("globe");
			},
			onmouseleave: () => {
				dbID(`idImg_child_newsContent_${i}`).src = KadDOM.getImgPath(newsData.currIndex == i ? "search" : "right");
			},
		});

		//--  Title Label
		KadTable.addCell(row, {
			names: ["newsSource", i],
			type: "Lbl",
			text: newsData.articles[i].topline,
			title: `${newsData.articles[i].title}\n${newsData.articles[i].firstSentence}`,
			cellStyle: {
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap",
				textAlign: "left",
			},
			cellOnclick: () => {
				newsData.currIndex = i;
				showNews();
			},
		});
	}
	newsUpdateTableIcons();
}

function newsUpdateTableIcons() {
	for (let i = 0; i < newsData.articles.length; i++) {
		let img = dbID(`idImg_child_newsContent_${i}`);
		img.src = KadDOM.getImgPath(newsData.currIndex == i ? "search" : "right");
	}
}

function newsOpenURL() {
	window.open(newsData.articles[newsData.currIndex].shareURL);
}
