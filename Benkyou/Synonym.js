import { KadFile, KadLog, KadTable, dbID, initEL } from "../KadUtils/KadUtils.js";
const synonymOptions = {
  get URL() {
    return `https://www.openthesaurus.de/synonyme/search?q=${this.input}&format=application/json&similar=true&baseform=true`;
  },
  inputTimer: null,
  input: "",
  data: {},
};

initEL({ id: dbID("idVin_synonymEntry"), fn: newSynonym, resetValue: "Search for synonyms" });
initEL({ id: dbID("idLbl_synonymSearchWord") });

export function clear_cl_Synonym() {
  dbID("idVin_synonymEntry").KadReset();
  dbID("idTab_synonymTableSynonym").textContent = "";
}

function newSynonym() {
  synonymOptions.input = dbID("idVin_synonymEntry").KadGet();
  if (!synonymOptions.input) return;

  if (synonymOptions.inputTimer != null) {
    clearTimeout(synonymOptions.inputTimer);
    synonymOptions.inputTimer = null;
  }
  synonymOptions.inputTimer = setTimeout(synonymGetData, 400);
}

async function synonymGetData() {
  synonymOptions.inputTimer = null;
  const { data, error } = await KadFile.loadUrlToJSON({ variable: "data", url: synonymOptions.URL });
  if (KadLog.errorChecked(error, "Could not receive data for 'Synonym'.", error)) {
    dbID("idLbl_synonymSearchWord").KadSetText("---");
  } else {
    synonymOptions.data = data;
    dbID("idLbl_synonymSearchWord").KadSetText(synonymOptions.input);
    synonymCreateTable();
  }
}

function synonymCreateTable() {
  const data = synonymOptions.data;
  let header = [{ data: "Synonyme", colSpan: 3, settings: { align: "center" } }];
  let body = [{ data: data.synsets[0].terms.map((item) => [item.term]), multiColumn: 3 }];
  KadTable.createHTMLGrid({ id: dbID("idTab_synonymTableSynonym"), header, body });

  if (data.hasOwnProperty("similarterms")) {
    header = [{ data: "Ähnliche Befriffe", colSpan: 3, settings: { align: "center" } }];
    body = [{ data: data.similarterms.map((item) => [item.term]), multiColumn: 3 }];
    KadTable.createHTMLGrid({ id: dbID("idTab_synonymTableSimilar"), header, body });
  }
}
