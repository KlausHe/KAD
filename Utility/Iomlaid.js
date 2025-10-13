// https://github.com/fawazahmed0/exchange-api?tab=readme-ov-file
import { layoutCheckCORSandDisableModule } from "../General/Layout.js";
import { Data_Currencies } from "../KadData/KadData_Countries.js";
import { initEL, KadDate, KadFile, KadTable, KadValue } from "../KadUtils/KadUtils.js";

const iomlaidOptions = {
  get URLnow() {
    return `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${iomlaidOptions.baseCurrency.toLowerCase()}.min.json`;
  },
  get URLhistoric() {
    return `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${this.date}/v1/currencies/${iomlaidOptions.baseCurrency.toLowerCase()}.min.json`;
  },
  latest: null,
  historic: null,
  baseCurrency: null,
  optionsOrig: {
    baseCurrency: "EUR",
    value: 10,
    date: null,
  },
  value: 10,
  date: null,
  dateDatabase: "2024-03-03",
  dateFormat: "YYYY-MM-DD",
  get minDate() {
    let past = KadDate.getDate(new Date().setFullYear(new Date().getFullYear() - 1), { format: iomlaidOptions.dateFormat });
    return past < this.dateDatabase ? this.dateDatabase : past;
  },
};

const Sel_IomlaidCur = initEL({
  id: "idSel_IomlaidCur",
  fn: iomlaidCurrencyChange,
  selStartValue: iomlaidOptions.optionsOrig.baseCurrency,
  selList: Data_Currencies.map((currency) => [`${currency.cc} (${currency.name})`, currency.cc]),
});
const Vin_IomlaidDate = initEL({
  id: "idVin_IomlaidDate",
  fn: iomlaidDateChange,
  resetValue: iomlaidOptions.minDate,
  settings: { min: iomlaidOptions.dateDatabase },
});
const Vin_IomlaidCur = initEL({ id: "idVin_IomlaidCur", fn: iomlaidValueChange, resetValue: iomlaidOptions.optionsOrig.value });

export function clear_cl_Iomlaid() {
  iomlaidOptions.latest = null;
  iomlaidOptions.historic = null;
  iomlaidOptions.baseCurrency = iomlaidOptions.optionsOrig.baseCurrency;
  iomlaidOptions.date = Vin_IomlaidDate.KadReset();
  iomlaidOptions.value = Vin_IomlaidCur.KadReset();
  Sel_IomlaidCur.KadReset();
  iomlaidUpdateData();
}

function iomlaidCurrencyChange() {
  iomlaidOptions.baseCurrency = Sel_IomlaidCur.KadGet();
  iomlaidUpdateData();
}
function iomlaidDateChange() {
  iomlaidOptions.date = KadDate.dateFromInput(Vin_IomlaidDate, iomlaidOptions.dateFormat);
  iomlaidUpdateData();
}

function iomlaidValueChange() {
  iomlaidOptions.value = Vin_IomlaidCur.KadGet();
  iomlaidTable();
}
function iomlaidUpdateData() {
  KadFile.loadUrlToJSON({
    variableArray: ["dataNow", "dataHistory"],
    urlArray: [iomlaidOptions.URLnow, iomlaidOptions.URLhistoric],
    callback: iomlaidGetData,
    errorCallback: iomlaidErrorData,
  });
}

function iomlaidErrorData({ error }) {
  layoutCheckCORSandDisableModule(error, "Iomlaid");
}
function iomlaidGetData(data) {
  const { dataNow, dataHistory } = data;
  iomlaidOptions.latest = dataNow[iomlaidOptions.baseCurrency.toLowerCase()];
  iomlaidOptions.historic = dataHistory[iomlaidOptions.baseCurrency.toLowerCase()];
  iomlaidOptions.date = Vin_IomlaidDate.KadReset({ resetValue: dataHistory.date });
  iomlaidTable();
}

function iomlaidTable() {
  if (iomlaidOptions.latest == null || iomlaidOptions.historic == null) return;

  const header = [
    { data: `Betrag: ${KadValue.number(iomlaidOptions.value, { currency: iomlaidOptions.baseCurrency })}`, settings: { align: "center", justify: "end" } },
    { data: "Kurs<br>(heute)", settings: { align: "right" } },
    { data: "Betrag<br>(heute)", settings: { align: "right" } },
    { data: `Kurs<br>${iomlaidOptions.date}`, settings: { align: "right" } },
    { data: `Betrag<br>${iomlaidOptions.date}`, settings: { align: "right" } },
  ];

  const body = [
    {
      data: Data_Currencies.map((item) => `${item.name} (${item.cc})`),
      settings: { align: "right" },
    },
    {
      data: Data_Currencies.map((item) => (iomlaidOptions.latest == null ? "n.d." : KadValue.number(iomlaidOptions.latest[item.cc.toLowerCase()], { decimals: 3 }))),
      settings: { align: "right", noBorder: "right" },
    },
    {
      data: Data_Currencies.map((item) => (iomlaidOptions.latest == null ? "n.d." : `${KadValue.number(iomlaidOptions.latest[item.cc.toLowerCase()] * iomlaidOptions.value)} ${item.symbol}`)),
      settings: { align: "right" },
    },
    {
      data: Data_Currencies.map((item) => (iomlaidOptions.historic == null ? "n.d." : KadValue.number(iomlaidOptions.historic[item.cc.toLowerCase()], { decimals: 3 }))),
      settings: { align: "right", noBorder: "right" },
    },
    {
      data: Data_Currencies.map((item) => (iomlaidOptions.historic == null ? "n.d." : `${KadValue.number(iomlaidOptions.historic[item.cc.toLowerCase()] * iomlaidOptions.value)} ${item.symbol}`)),
      settings: { align: "right" },
    },
  ];
  KadTable.createHTMLGrid({ id: "idTab_iomlaidTable", header, body });
}
