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
	console.log(postillonTickerOptions.tickerNums, postillonTickerOptions.data);
	newsTickerNext();
}

function newsTickerNext() {
	postillonTickerOptions.num = randomObject(postillonTickerOptions.availiableNums);
	postillonTickerOptions.usedNums.push(postillonTickerOptions.num);
	createPostillion();
}

function createPostillion() {
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
