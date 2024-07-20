import { globalP5 } from "../Main.js";
import { dbID, initEL, KadTable, KadRandom } from "../KadUtils/KadUtils.js";

initEL({ id: idBtn_newsTickerNext, fn: postillonTickerNext });

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
	postillonTickerOptions.num = KadRandom.randomObject(postillonTickerOptions.availiableNums);
	postillonTickerOptions.usedNums.push(postillonTickerOptions.num);
	postillionCreate();
}

function postillionCreate() {
	dbID("idLbl_newsTickerNumber").innerHTML = `Ticker ${postillonTickerOptions.num}`;
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
