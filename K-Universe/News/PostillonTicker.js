let postillonTickerOptions = {
	num: null,
	tickerNums: null,
	usedNums: [],
	get availiableNums() {
		return this.tickerNums.filter((obj) => {
			return !this.usedNums.includes(obj);
		});
	},
	data: null,
};

function clear_cl_PostillonTicker() {
	if (postillonTickerOptions.data == null) {
		globalP5.loadJSON("./Data/DataLists/Newsticker.json", tickerLoadData, "json");
	}
	postillonTickerOptions.usedNums = [];
}

function tickerLoadData(data) {
	postillonTickerOptions.data = data.arr;
	postillonTickerOptions.tickerNums = new Array(postillonTickerOptions.data.length).fill(0).map((n, i) => i);
	postillonTickerNext();
}

function postillonTickerNext() {
	postillonTickerOptions.num = KadUtils.Random.randomObject(postillonTickerOptions.availiableNums);
	postillonTickerOptions.usedNums.push(postillonTickerOptions.num);
	postillionCreate();
}

function postillionCreate() {
	KadUtils.dbID("idLbl_newsTickerNumber").innerHTML = `Ticker ${postillonTickerOptions.num}`;
	KadUtils.Table.clear("idTabBody_postillionTable");
	const list = postillonTickerOptions.data[postillonTickerOptions.num];
	for (let i = 0; i < list.length; i++) {
		const row = KadUtils.Table.insertRow("idTabBody_postillionTable");
		KadUtils.Table.addCell(row, {
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
