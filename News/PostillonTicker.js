import { initEL, KadArray, KadFile, KadRandom, KadTable } from "../KadUtils/KadUtils.js";

initEL({ id: idBtn_newsTickerNext, fn: postillonTickerNext });
initEL({ id: idLbl_newsTickerNumber, resetValue: "Ticker" });

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

export function clear_cl_PostillonTicker() {
	if (postillonTickerOptions.data == null) {
		KadFile.loadUrlToJSON({ variable: "data", url: "./Data/DataLists/Newsticker.json", callback: tickerLoadData });
	} else {
		postillonTickerOptions.usedNums = [];
		postillonTickerNext();
	}
}

function tickerLoadData({ data }) {
	postillonTickerOptions.data = data;
	postillonTickerOptions.tickerNums = KadArray.createIndexedArray(postillonTickerOptions.data.length);
	postillonTickerNext();
}

function postillonTickerNext() {
	postillonTickerOptions.num = KadRandom.randomObject(postillonTickerOptions.availiableNums);
	postillonTickerOptions.usedNums.push(postillonTickerOptions.num);
	postillionCreate();
}

function postillionCreate() {
	idLbl_newsTickerNumber.KadSetText(`Ticker ${postillonTickerOptions.num}`);
	KadTable.clear("idTabBody_postillionTable");
	const list = postillonTickerOptions.data[postillonTickerOptions.num];
	for (let i = 0; i < list.length; i++) {
		const row = KadTable.createRow("idTabBody_postillionTable");
		KadTable.addCell(row, {
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
