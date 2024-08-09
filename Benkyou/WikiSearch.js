import { dbID, deepClone, KadDOM, KadRandom, KadTable, initEL, log, dbIDStyle, KadFile } from "../KadUtils/KadUtils.js";
import { Data_Country_CodesIso639 } from "../General/MainData.js";
import { AccData } from "../General/Account.js";

const wikiOptions = {
	get searchUrl() {
		return `https://${this.language}.wikipedia.org/w/api.php?action=opensearch&limit=30&format=json&search=`;
	},
	get contentUrl() {
		return `https://${this.language}.wikipedia.org/w/api.php?action=query&prop=extracts&rvprop=content&rvsection=0&exintro&explaintext&redirects=1&format=json&titles=`;
	},
	get imageUrl() {
		return `https://${this.language}.wikipedia.org/w/api.php?action=query&prop=pageimages&redirects=1&format=json&pithumbsize=100&titles=`;
	},
	get openUrl() {
		return `https://${this.language}.wikipedia.org/wiki/`;
	},
	get language() {
		return dbID("idSel_wikiLanguage").selectedOptions[0].dataset.code;
	},
	random: null,
	resultTerms: null,
	search: {
		tab: null,
		content: null,
		image: null,
	},
};

initEL({ id: idVin_wikiInput, fn: wikiSearchInput, resetValue: "Search on Wiki" });
initEL({ id: idBtn_wikiInput, fn: wikiSearchInput });
initEL({ id: idSel_wikiLanguage, fn: wikiSearchLanguage });

export function clear_cl_WikiSearch() {
	idVin_wikiInput.KadReset();
	wikiOptions.random = null;
	dbID("idDiv_wiki_Title").textContent = "";
	dbID("idDiv_wiki_Text").textContent = "";
	dbID("idImg_Wiki_Image").src = "";
	dbIDStyle("idImg_Wiki_Image").display = "none";

	wikiOptions.search = { tab: null, content: null };
	KadTable.clear("idTabBody_wikiTitleTable");
	wikiSearchPopulateLanguage();
}

export const storage_cl_WikiSearch = {
	dbName: "WikiSearch",
	contentName: "cl_WikiSearch",
	clear() {
		this.data = { tab: null, content: null, image: null };
	},
	get data() {
		return wikiOptions.search;
	},
	set data(data) {
		wikiOptions.search = deepClone(data);
		if (idVin_wikiInput.KadGet() != "") return;
		if (wikiOptions.search.tab != null) {
			idVin_wikiInput.KadReset({ resetValue: wikiOptions.search.tab });
			wikiSearchInput(wikiOptions.search.tab);
			if (wikiOptions.search.content) {
				wikiShowSelectedText(wikiOptions.search.content, true);
			}
			if (wikiOptions.search.image) {
				wikiShowSelectedImage(wikiOptions.search.image, true);
			}
		} else if (AccData.data == true) {
			const arr = Object.values(AccData.infos).filter((obj) => {
				return obj.data != null;
			});
			if (arr.length > 0) {
				const autoSearch = KadRandom.randomObject(arr);
				idVin_wikiInput.KadReset({ resetValue: autoSearch.data });
				wikiSearchInput(autoSearch.data);
				wikiOptions.random = true;
			}
		}
		KadTable.clear("idTabBody_wikiTitleTable");
	},
};

function wikiSearchPopulateLanguage() {
	let lang = "de";
	Data_Country_CodesIso639.forEach((value, key) => {
		let option = document.createElement("option");
		option.textContent = value;
		option.setAttribute("data-code", key);
		if (key == lang) {
			option.selected = true;
		}
		dbID("idSel_wikiLanguage").appendChild(option);
	});
}

function wikiSearchInput() {
	wikiOptions.search.tab = idVin_wikiInput.KadGet().replace(/\s+/g, "_");
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
	wikiSearchInput();
}

function wikiCreateTable(data) {
	wikiOptions.resultTerms = data.data[1];
	KadTable.clear("idTabBody_wikiTitleTable");
	for (let i = 0; i < wikiOptions.resultTerms.length; i++) {
		let row = KadTable.createRow("idTabBody_wikiTitleTable");
		// arrow
		KadTable.addCell(row, {
			names: ["wikiContent", i],
			type: "Img",
			subGroup: "subgrid",
			img: "right",
			cellOnclick: () => {
				for (let j = 0; j < wikiOptions.resultTerms.length; j++) {
					dbID("idTabBody_wikiTitleTable").rows[j].cells[0].childNodes[0].src = KadDOM.getImgPath("right");
				}
				dbID("idTabBody_wikiTitleTable").rows[i].cells[0].childNodes[0].src = KadDOM.getImgPath("search");
				KadFile.loadUrlToJSON({ variable: "data", url: `${wikiOptions.contentUrl}${wikiOptions.resultTerms[i]}`, callback: wikiShowSelectedText });
				dbID("idDiv_wiki_Title").textContent = "searching...";
				dbID("idDiv_wiki_Title").onclick = null;
			},
		});
		//--  Title
		KadTable.addCell(row, {
			names: ["wikiContent", i],
			type: "Lbl",
			text: wikiOptions.resultTerms[i],
			cellStyle: {
				textAlign: "left",
			},
			cellOnclick: () => {
				for (let j = 0; j < wikiOptions.resultTerms.length; j++) {
					dbID("idTabBody_wikiTitleTable").rows[j].cells[0].childNodes[0].src = KadDOM.getImgPath("right");
				}
				dbID("idTabBody_wikiTitleTable").rows[i].cells[0].childNodes[0].src = KadDOM.getImgPath("search");
				KadFile.loadUrlToJSON({ variable: "data", url: `${wikiOptions.contentUrl}${wikiOptions.resultTerms[i]}`, callback: wikiShowSelectedText });
				KadFile.loadUrlToJSON({ variable: "data", url: `${wikiOptions.imageUrl}${wikiOptions.resultTerms[i]}`, callback: wikiShowSelectedImage });
				dbID("idDiv_wiki_Title").textContent = "searching...";
				dbID("idDiv_wiki_Title").onclick = null;
			},
		});
	}

	if (wikiOptions.random) {
		wikiOptions.random = null;
		wikiQueryRandom();
	}
}

function wikiQueryRandom() {
	const term = KadRandom.randomObject(wikiOptions.resultTerms);
	KadFile.loadUrlToJSON({ variable: "data", url: `${wikiOptions.contentUrl}${term}`, callback: wikiShowSelectedText });
	KadFile.loadUrlToJSON({ variable: "data", url: `${wikiOptions.imageUrl}${term}`, callback: wikiShowSelectedImage });
}

function wikiShowSelectedText(data, loaded) {
	wikiOptions.random = null;
	if (loaded) {
		wikiOptions.search.content = data.data;
	} else {
		wikiOptions.search.content = data.data.query.pages;
	}
	let pagesID = Object.keys(wikiOptions.search.content);
	const title = wikiOptions.search.content[pagesID].title;
	dbID("idDiv_wiki_Title").textContent = title;
	dbID("idDiv_wiki_Title").onclick = () => {
		const urlTitle = title.replace(/\s+/g, "_");
		window.open(`${wikiOptions.openUrl}${urlTitle}`);
	};
	dbID("idDiv_wiki_Text").textContent = wikiOptions.search.content[pagesID].extract;
}

function wikiShowSelectedImage(data, loaded) {
	if (loaded) {
		wikiOptions.search.image = data.data;
	} else {
		wikiOptions.search.image = data.data.query.pages;
	}
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
