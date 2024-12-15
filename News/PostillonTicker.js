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
	const body = [{ data: postillonTickerOptions.data[postillonTickerOptions.num], settings: { align: "center" } }];

	KadTable.createHTMLGrid({ id: idTab_postillionTable, body });
}
