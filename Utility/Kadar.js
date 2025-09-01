import { dbID, initEL, KadDate, KadTable, KadValue } from "../KadUtils/KadUtils.js";

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

initEL({ id: dbID("idVin_kadarDateA"), fn: kadarDateSelectedA, resetValue: kadarOptions.dateOrig(-7), dateOpts: { format: kadarOptions.format, dateObject: true } });
initEL({ id: dbID("idVin_kadarDateB"), fn: kadarDateSelectedB, resetValue: kadarOptions.dateOrig(7), dateOpts: { format: kadarOptions.format, dateObject: true } });
initEL({ id: dbID("idBtn_kadarTrashA"), fn: clearKadarTableAnow });
initEL({ id: dbID("idBtn_kadarRefresh"), fn: kadarTable });
initEL({ id: dbID("idBtn_kadarTrashB"), fn: clearKadarTableBnow });
initEL({ id: dbID("idLbl_kadarDateNow") });

export function clear_cl_Kadar() {
  kadarOptions.table.valueA = dbID("idVin_kadarDateA").KadReset();
  kadarOptions.table.valueB = dbID("idVin_kadarDateB").KadReset();
  dbID("idLbl_kadarDateNow").KadSetText(KadDate.getDate(null, { format: "DD.MM.YYYY, HH:mm" }));
  kadarTable();
}

function kadarDateSelectedA() {
  kadarOptions.table.valueA = dbID("idVin_kadarDateA").KadGet();
  kadarTable();
}
function kadarDateSelectedB() {
  kadarOptions.table.valueB = dbID("idVin_kadarDateB").KadGet();
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
  KadTable.createHTMLGrid({ id: dbID("idTab_KadarTable"), header, body });
}
