import { KadDate, KadTable, KadValue } from "../KadUtils/KadUtils.js";

export function clear_cl_Holy() {
  holyGenerateTable();
}

const holyOptions = {
  dateFormat: "YYYY-MM-DD",
  data: [
    ["Mamertus", "05-11", "https://de.wikipedia.org/wiki/Mamertus"],
    ["Pankratius", "05-12", "https://de.wikipedia.org/wiki/Pankratius"],
    ["Servatius", "05-13", "https://de.wikipedia.org/wiki/Servatius_von_Tongern"],
    ["Bonifatius", "05-14", "https://de.wikipedia.org/wiki/Bonifatius_von_Tarsus"],
    ["Sophia", "05-15", "https://de.wikipedia.org/wiki/Sophia_von_Rom"],
  ],
};
function holyGenerateTable() {
  const year = KadDate.getDate(null, { format: "YYYY" });
  const header = [{ data: "Eisheiliger" }, { data: "Datum" }, { data: "vor Tagen" }, { data: "in Tagen" }];
  const body = [
    //

    { data: holyOptions.data.map((item) => item[0]), settings: { onclick: holyOpenWiki, cursor: "alias" } },
    { data: holyOptions.data.map((item) => KadDate.getDate(`${year}-${item[1]}`), { format: "DD.MM.YYYY" }) },
    { data: holyOptions.data.map((item) => KadValue.number(Math.abs(Date.parse(`${Number(year) - 1}-${item[1]}`) - new Date().getTime()) / 86400000, { cap: "ceil" })) },
    { data: holyOptions.data.map((item) => KadValue.number(Math.abs(Date.parse(`${year}-${item[1]}`) - new Date().getTime()) / 86400000, { cap: "floor" })) },
  ];
  KadTable.createHTMLGrid({ id: "idTab_holyTable", header, body });
}

function holyOpenWiki(index) {
  window.open(holyOptions.data[index][2]);
}
