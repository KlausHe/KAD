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
		return KadUtils.dbID("idSel_wikiLanguage").selectedOptions[0].dataset.code;
	},
	random: null,
	resultTerms: null,
	search: {
		tab: null,
		content: null,
		image: null,
	},
};

function clear_cl_WikiSearch() {
	wikiOptions.random = null;
	KadUtils.DOM.resetInput("idVin_wikiInput", "Search on Wiki");
	KadUtils.dbID("idDiv_wiki_Title").textContent = "";
	KadUtils.dbID("idDiv_wiki_Text").textContent = "";
	KadUtils.dbID("idImg_Wiki_Image").src = "";
	KadUtils.dbID("idImg_Wiki_Image").removeAttribute("imgSize");

	wikiOptions.search = {
		tab: null,
		content: null,
	};
	KadUtils.Table.clear("idTabBody_wikiTitleTable");
	wikiSearchPopulateLanguage();
}

function wikiSearchPopulateLanguage() {
	let lang = "de";
	// let lang = navigator.language.split("-")[0] || "de";
	Data_Country_CodesIso639.forEach((value, key) => {
		let option = document.createElement("option");
		option.textContent = value;
		option.setAttribute("data-code", key);
		if (key == lang) {
			option.selected = true;
		}
		KadUtils.dbID("idSel_wikiLanguage").appendChild(option);
	});
}

function wikiSearchInput(input = null, random = null) {
	wikiOptions.random = random;
	wikiOptions.search.tab = input ? input.trim() : idVin_wikiInput.value.replace(/\s+/g, "_");
	if (wikiOptions.search.tab != null && wikiOptions.search.tab != "") {
		globalP5.loadJSON(`${wikiOptions.searchUrl}${wikiOptions.search.tab}`, wikiCreateTable, "jsonp");
		KadUtils.dbID("idDiv_wiki_Title").textContent = "Artikel wählen";
		KadUtils.dbID("idDiv_wiki_Title").onclick = null;
		KadUtils.dbID("idDiv_wiki_Text").textContent = "";
		KadUtils.dbID("idImg_Wiki_Image").src = "";
		KadUtils.dbID("idImg_Wiki_Image").removeAttribute("imgSize");
	}
}

function wikiSearchLanguage(obj) {
	wikiSearchInput();
}

function wikiCreateTable(data) {
	wikiOptions.resultTerms = data[1];
	KadUtils.Table.clear("idTabBody_wikiTitleTable");
	for (let i = 0; i < wikiOptions.resultTerms.length; i++) {
		let row = KadUtils.Table.insertRow("idTabBody_wikiTitleTable");
		// arrow
		const arrow = KadUtils.Table.addCell(row, {
			names: ["wikiContent", i],
			type: "Img",
			subGroup: "subgrid",
			img: "right",
			cellOnclick: () => {
				for (let j = 0; j < wikiOptions.resultTerms.length; j++) {
					KadUtils.dbID("idTabBody_wikiTitleTable").rows[j].cells[0].childNodes[0].src = KadUtils.DOM.getImgPath("right");
				}
				KadUtils.dbID("idTabBody_wikiTitleTable").rows[i].cells[0].childNodes[0].src = KadUtils.DOM.getImgPath("search");
				globalP5.loadJSON(wikiOptions.contentUrl + wikiOptions.resultTerms[i], wikiShowSelectedText, "jsonp");
				KadUtils.dbID("idDiv_wiki_Title").textContent = "searching...";
				KadUtils.dbID("idDiv_wiki_Title").onclick = null;
			},
		});
		//--  Title
		KadUtils.Table.addCell(row, {
			names: ["wikiContent", i],
			type: "Lbl",
			text: wikiOptions.resultTerms[i],
			cellStyle: {
				textAlign: "left",
			},
			cellOnclick: () => {
				for (let j = 0; j < wikiOptions.resultTerms.length; j++) {
					KadUtils.dbID("idTabBody_wikiTitleTable").rows[j].cells[0].childNodes[0].src = KadUtils.DOM.getImgPath("right");
				}
				KadUtils.dbID("idTabBody_wikiTitleTable").rows[i].cells[0].childNodes[0].src = KadUtils.DOM.getImgPath("search");
				globalP5.loadJSON(wikiOptions.contentUrl + wikiOptions.resultTerms[i], wikiShowSelectedText, "jsonp");
				globalP5.loadJSON(wikiOptions.imageUrl + wikiOptions.resultTerms[i], wikiShowSelectedImage, "jsonp");
				KadUtils.dbID("idDiv_wiki_Title").textContent = "searching...";
				KadUtils.dbID("idDiv_wiki_Title").onclick = null;
			},
		});
	}

	if (wikiOptions.random) {
		wikiOptions.random = null;
		wikiQueryRandom();
	}
}

function wikiQueryRandom() {
	const term = KadUtils.Random.randomObject(wikiOptions.resultTerms);
	globalP5.loadJSON(wikiOptions.contentUrl + term, wikiShowSelectedText, "jsonp");
	globalP5.loadJSON(wikiOptions.imageUrl + term, wikiShowSelectedImage, "jsonp");
}

function wikiShowSelectedText(data, loaded) {
	wikiOptions.random = null;
	if (loaded) {
		wikiOptions.search.content = data;
	} else {
		wikiOptions.search.content = data.query.pages;
	}
	let pagesID = Object.keys(wikiOptions.search.content);
	const title = wikiOptions.search.content[pagesID].title;
	KadUtils.dbID("idDiv_wiki_Title").textContent = title;
	KadUtils.dbID("idDiv_wiki_Title").onclick = () => {
		const urlTitle = title.replace(/\s+/g, "_");
		window.open(`${wikiOptions.openUrl}${urlTitle}`);
	};
	KadUtils.dbID("idDiv_wiki_Text").textContent = wikiOptions.search.content[pagesID].extract;
}

function wikiShowSelectedImage(data, loaded) {
	if (loaded) {
		wikiOptions.search.image = data;
	} else {
		wikiOptions.search.image = data.query.pages;
	}
	let pagesID = Object.keys(wikiOptions.search.image);
	if (wikiOptions.search.image[pagesID].thumbnail) {
		KadUtils.dbID("idImg_Wiki_Image").src = wikiOptions.search.image[pagesID].thumbnail.source;
		KadUtils.dbID("idImg_Wiki_Image").setAttribute("imgSize", "thumbnail");
	} else {
		KadUtils.dbID("idImg_Wiki_Image").src = "";
	}
}
