// https://github.com/fawazahmed0/exchange-api?tab=readme-ov-file
import { layoutCheckCORSandDisableModule } from "../General/Layout.js";
import { Data_Currencies } from "../KadData/KadData_Countries.js";
import { dbID, initEL, KadDate, KadFile, KadTable, KadValue } from "../KadUtils/KadUtils.js";

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

initEL({
  id: dbID("idSel_IomlaidCur"),
  fn: iomlaidCurrencyChange,
  selStartValue: iomlaidOptions.optionsOrig.baseCurrency,
  selList: Data_Currencies.map((currency) => [`${currency.cc} (${currency.name})`, currency.cc]),
});
initEL({
  id: dbID("idVin_IomlaidDate"),
  fn: iomlaidDateChange,
  resetValue: iomlaidOptions.minDate,
  domOpts: { min: iomlaidOptions.dateDatabase },
});
initEL({ id: dbID("idVin_IomlaidCur"), fn: iomlaidValueChange, resetValue: iomlaidOptions.optionsOrig.value });

export function clear_cl_Iomlaid() {
  iomlaidOptions.latest = null;
  iomlaidOptions.historic = null;
  iomlaidOptions.baseCurrency = iomlaidOptions.optionsOrig.baseCurrency;
  iomlaidOptions.date = dbID("idVin_IomlaidDate").KadReset();
  iomlaidOptions.value = dbID("idVin_IomlaidCur").KadReset();
  dbID("idSel_IomlaidCur").KadReset();
  iomlaidGetData();
}

function iomlaidCurrencyChange() {
  iomlaidOptions.baseCurrency = dbID("idSel_IomlaidCur").KadGet();
  iomlaidGetData();
}
function iomlaidDateChange() {
  iomlaidOptions.date = KadDate.dateFromInput(dbID("idVin_IomlaidDate"), iomlaidOptions.dateFormat);
  iomlaidGetData();
}

function iomlaidValueChange() {
  iomlaidOptions.value = dbID("idVin_IomlaidCur").KadGet();
  iomlaidTable();
}

async function iomlaidGetData() {
  const { error, dataNow, dataHistory } = await KadFile.loadUrlToJSON({
    variableArray: ["dataNow", "dataHistory"],
    urlArray: [iomlaidOptions.URLnow, iomlaidOptions.URLhistoric],
  });
  if (layoutCheckCORSandDisableModule(error, "Iomlaid")) return;
  iomlaidOptions.latest = dataNow[iomlaidOptions.baseCurrency.toLowerCase()];
  iomlaidOptions.historic = dataHistory[iomlaidOptions.baseCurrency.toLowerCase()];
  iomlaidOptions.date = dbID("idVin_IomlaidDate").KadReset({ resetValue: dataHistory.date });
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
  KadTable.createHTMLGrid({ id: dbID("idTab_iomlaidTable"), header, body });
}
