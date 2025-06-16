import { initEL, KadDate, KadTable, KadValue } from "../KadUtils/KadUtils.js";

const kadarOptions = {
  table: {
    headers: ["A bis jetzt", "A bis B", "B bis jetzt"],
    units: ["Millisekunden", "Sekunden", "Minuten", "Stunden", "Tage", "Wochen", "Monate", "Jahre"],
    divisor: [1, 1000, 60000, 3600000, 86400000, 604800000, 2620800000, 31449600000],
    decimals: [0, 0, 2, 3, 4, 5, 6, 7],
    valueA: null,
    valueB: null,
  },
  valueDiffA: 0,
  valueDiffB: 0,
  valueDiffAB: 0,
  format: "YYYY-MM-DDTHH:mm",
  dateOrig(days) {
    return KadDate.getDate(new Date(new Date().getTime() + days * 86400000), { format: this.format });
  },
};

initEL({ id: idVin_kadarDateA, fn: kadarDateSelectedA, resetValue: kadarOptions.dateOrig(-7), dateOpts: { format: kadarOptions.format, dateObject: true } });
initEL({ id: idVin_kadarDateB, fn: kadarDateSelectedB, resetValue: kadarOptions.dateOrig(7), dateOpts: { format: kadarOptions.format, dateObject: true } });
initEL({ id: idBtn_kadarTrashA, fn: clearKadarTableAnow });
initEL({ id: idBtn_kadarRefresh, fn: kadarTable });
initEL({ id: idBtn_kadarTrashB, fn: clearKadarTableBnow });

export function clear_cl_Kadar() {
  kadarOptions.table.valueA = idVin_kadarDateA.KadReset();
  kadarOptions.table.valueB = idVin_kadarDateB.KadReset();
  idLbl_kadarDateNow.textContent = KadDate.getDate(null, { format: "DD.MM.YYYY, HH:mm" });
  kadarTable();
}

function kadarDateSelectedA() {
  kadarOptions.table.valueA = idVin_kadarDateA.KadGet();
  kadarTable();
}
function kadarDateSelectedB() {
  kadarOptions.table.valueB = idVin_kadarDateB.KadGet();
  kadarTable();
}

function clearKadarTableAnow() {
  kadarOptions.table.valueA = null;
  kadarTable();
}

function clearKadarTableBnow() {
  kadarOptions.table.valueB = null;
  kadarTable();
}

function kadarTable() {
  const settings = { align: "right" };
  const header = [...kadarOptions.table.headers.map((item) => ({ data: item, settings: { align: "center" } })), { data: "Einheit" }];
  const tab = kadarOptions.table;
  const body = [
    { data: tab.divisor.map((div, index) => KadValue.number(Math.abs(tab.valueA - new Date().getTime()) / div, { decimals: tab.decimals[index] })), settings },
    { data: tab.divisor.map((div, index) => KadValue.number(Math.abs(tab.valueA - tab.valueB) / div, { decimals: tab.decimals[index] })), settings },
    { data: tab.divisor.map((div, index) => KadValue.number(Math.abs(tab.valueB - new Date().getTime()) / div, { decimals: tab.decimals[index] })), settings },
    { data: tab.units },
  ];
  KadTable.createHTMLGrid({ id: idTab_KadarTable, header, body });
}
