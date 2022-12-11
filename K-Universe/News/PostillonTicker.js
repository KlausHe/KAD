let postillonTickerOptions = {
	tickerNums: null,
	num: null,
	usedNums: [],
	get availiableNums() {
		return this.tickerNums.filter((obj) => {
			return !this.usedNums.includes(obj);
		});
	},
	data: null,
	tickerReload: null,
	tickerInterval: 1000 * 60 * 10,
};

function clear_cl_PostillonTicker() {
	postillonStopTicker();
	if (postillonTickerOptions.data == null) {
		globalP5.loadJSON("./Data/DataLists/Newsticker.json", tickerLoadData, "json");
	}
	postillonTickerOptions.usedNums = [];
}

function tickerLoadData(data) {
	postillonTickerOptions.data = data.arr;
	postillonTickerOptions.tickerNums = new Array(postillonTickerOptions.data.length).fill(0).map((n, i) => i);
	postillonToggleTicker();
}

function postillonStartTicker() {
	postillonTickerNext();
	postillonTickerOptions.tickerReload = setInterval(postillonTickerNext, postillonTickerOptions.tickerInterval);
	dbID("idImg_postillonTicker").src = imgPath("tStop");
}

function postillonStopTicker() {
	clearInterval(postillonTickerOptions.tickerReload);
	postillonTickerOptions.tickerReload = null;
	dbID("idImg_postillonTicker").src = imgPath("tPlay");
}

function postillonToggleTicker() {
	if (postillonTickerOptions.tickerReload == null) {
		postillonStartTicker();
	} else {
		postillonStopTicker();
	}
}

function postillonTickerNext(obj = null) {
	if (obj != null) {
		postillonStopTicker();
	}
	postillonTickerOptions.num = randomObject(postillonTickerOptions.availiableNums);
	postillonTickerOptions.usedNums.push(postillonTickerOptions.num);
	postillionCreate();
}

function postillionCreate() {
	dbID("idLbl_newsTickerNumber").innerHTML = `Ticker ${postillonTickerOptions.num}`;
	clearTable("idTabBody_postillionTable");
	const list = postillonTickerOptions.data[postillonTickerOptions.num];
	for (let i = 0; i < list.length; i++) {
		const row = insertTableRow("idTabBody_postillionTable");
		tableAddCell(row, {
			names: ["postillon", i],
			type: "Lbl",
			text: `${list[i]}`,
			cellStyle: {
				textAlign: "center",
			},
			copy: true,
		});
	}
}
