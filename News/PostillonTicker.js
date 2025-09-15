import { Data_Newsticker } from "../KadData/KadData_Newsticker.js";
import { initEL, KadArray, KadRandom, KadTable } from "../KadUtils/KadUtils.js";

const Btn_newsTickerNext = initEL({ id: "idBtn_newsTickerNext", fn: postillonTickerNext });
const Lbl_newsTickerNumber = initEL({ id: "idLbl_newsTickerNumber", resetValue: "Ticker" });

let postillonTickerOptions = {
  num: null,
  data: Data_Newsticker,
  tickerNums: KadArray.createIndexedArray(Data_Newsticker.length),
  usedNums: [],
  get availiableNums() {
    return this.tickerNums.filter((obj) => {
      return !this.usedNums.includes(obj);
    });
  },
};

export function clear_cl_PostillonTicker() {
  postillonTickerOptions.usedNums = [];
  postillonTickerNext();
}

function postillonTickerNext() {
  postillonTickerOptions.num = KadRandom.randomObject(postillonTickerOptions.availiableNums);
  postillonTickerOptions.usedNums.push(postillonTickerOptions.num);
  postillionCreate();
}

function postillionCreate() {
  Lbl_newsTickerNumber.KadSetText(`Ticker ${postillonTickerOptions.num}`);
  const body = [{ data: postillonTickerOptions.data[postillonTickerOptions.num], settings: { align: "center" } }];

  KadTable.createHTMLGrid({ id: "idTab_postillionTable", body });
}
