import { KadFile, KadLog, KadTable, initEL } from "../KadUtils/KadUtils.js";
const synonymOptions = {
  get URL() {
    return `https://www.openthesaurus.de/synonyme/search?q=${this.input}&format=application/json&similar=true&baseform=true`;
  },
  input: "",
  data: {},
};

const Vin_synonymEntry = initEL({ id: "idVin_synonymEntry", fn: newSynonym, resetValue: "Search for synonyms" });
const Lbl_synonymSearchWord = initEL({ id: "idLbl_synonymSearchWord" });

export function clear_cl_Synonym() {
  Vin_synonymEntry.KadReset();
  KadTable.createHTMLGrid({ id: "idTab_synonymTableSynonym" });
  KadTable.createHTMLGrid({ id: "idTab_synonymTableSimilar" });
}

function newSynonym() {
  synonymOptions.input = Vin_synonymEntry.KadGet();
  if (!synonymOptions.input) return;
  KadFile.loadUrlToJSON({ variable: "data", url: synonymOptions.URL, callback: synonymGetData, errorCallback: synonymErrorData });
}

function synonymErrorData({ error }) {
  KadLog.error("Could not receive data for 'Synonym'.", error);
  Lbl_synonymSearchWord.KadSetText("---");
}

function synonymGetData(data) {
  synonymOptions.data = data.data;
  Lbl_synonymSearchWord.KadSetText(synonymOptions.input);
  synonymCreateTable();
}

function synonymCreateTable() {
  KadLog.log(synonymOptions.data);
  let header = [{ data: "Synonyme", colSpan: 3, settings: { align: "center" } }];
  let body = [];
  if (synonymOptions.data.synsets.length > 0) {
    body = [{ data: synonymOptions.data.synsets[0].terms.map((item) => [item.term]), multiColumn: 3 }];
  }
  KadTable.createHTMLGrid({ id: "idTab_synonymTableSynonym", header, body });

  if (synonymOptions.data.hasOwnProperty("similarterms")) {
    header = [{ data: "Ähnliche Befriffe", colSpan: 3, settings: { align: "center" } }];
    body = [{ data: synonymOptions.data.similarterms.map((item) => [item.term]), multiColumn: 3 }];
    KadTable.createHTMLGrid({ id: "idTab_synonymTableSimilar", header, body });
  }
}
