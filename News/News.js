import { dbID, daEL, KadDOM, KadDate, KadTable } from "../General/KadUtils.js";
import { Data_NewsCountries, Data_Country_CodesIso3166 } from "../General/MainData.js";

export const newsData = {
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

daEL(idSel_newsCategory, "change", newsUpdateOptions);
daEL(idSel_newsCountry, "change", newsUpdateOptions);
daEL(idDiv_News_Title, "click", news_URL);
daEL(idDiv_News_Text, "click", newsShowNext);

export function clear_cl_News() {
	KadDOM.clearFirstChild("idSel_newsCountry");
	KadDOM.clearFirstChild("idSel_newsCategory");
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

	newsUpdateOptions();
}

function newsUpdateOptions() {
	return {
		category: dbID("idSel_newsCategory").value,
		country: dbID("idSel_newsCountry").value,
	};
}

function newsError(errMsg) {
	newsData.articles = [];
	newsData.articles[0] = {};
	newsData.articles[0].title = errMsg;
	newsData.articles[0].description = "";
	newsData.articles[0].dateInfo = "  &#x1F61E  ";
	newsData.articles[0].error = true;
	KadTable.clear("idTabBody_newsTitleTable");
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
		newsData.articles[i].dateInfo = KadDate.getDate(newsData.articles[i].pubDate, { format: "DD.MM.YY/HH:mm" });
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
		dbID("idDiv_News_Title").innerHTML = `${newsData.articles[newsData.currIndex].title} (${newsData.articles[newsData.currIndex].dateInfo}, ${newsData.articles[newsData.currIndex].creator || newsData.articles[newsData.currIndex].source_id})`;
		dbID("idDiv_News_Text").innerHTML = newsData.articles[newsData.currIndex].description;
		if (newsData.articles[newsData.currIndex].image_url != null) {
			dbID("idImg_News_Image").src = newsData.articles[newsData.currIndex].image_url;
			dbID("idImg_News_Image").setAttribute("imgSize", "thumbnail");
		}
		newsUpdateTableIcons();
	}
}

function newsCreateTable() {
	KadTable.clear("idTabBody_newsTitleTable");
	for (let i = 0; i < newsData.articles.length; i++) {
		const row = KadTable.insertRow("idTabBody_newsTitleTable");
		row.id = `idRow_NewsTitle_${i}`;

		// arrow
		KadTable.addCell(row, {
			names: ["newsContent", i],
			type: "Img",
			subGroup: "subgrid",
			img: i == 0 ? "search" : "right",
			datasets: {
				shown: i == 0,
			},
			cellOnclick: () => {
				newsData.currIndex = i;
				news_URL();
			},
			onmouseover: () => {
				dbID("idTabBody_newsTitleTable").rows[i].cells[0].childNodes[0].src = KadDOM.getImgPath("globe");
			},
			onmouseleave: () => {
				const path = dbID("idTabBody_newsTitleTable").rows[i].cells[0].childNodes[0].dataset.shown == "true" ? "search" : "right";
				dbID("idTabBody_newsTitleTable").rows[i].cells[0].childNodes[0].src = KadDOM.getImgPath(path);
			},
		});

		//--  Title Label
		KadTable.addCell(row, {
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
				showNews();
			},
		});
	}
}

function newsUpdateTableIcons() {
	if (!newsData.articles[0].hasOwnProperty("error")) {
		let activeImg = document.querySelectorAll('[data-shown="true"]')[0];
		activeImg.src = KadDOM.getImgPath("right");
		activeImg.setAttribute("data-shown", false);
		let nextActiveImg = dbID("idTabBody_newsTitleTable").rows[newsData.currIndex].cells[0].childNodes[0];
		nextActiveImg.src = KadDOM.getImgPath("search");
		nextActiveImg.setAttribute("data-shown", true);
	}
}

function news_URL() {
	window.open(newsData.articles[newsData.currIndex].link);
}

function newsShowNext() {
	newsData.currIndex = (newsData.currIndex + 1 + newsData.articles.length) % newsData.articles.length;
	showNews();
}
