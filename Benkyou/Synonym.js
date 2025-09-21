import { initEL, KadFile, KadLog, KadRandom, KadTable } from "../KadUtils/KadUtils.js";
import { netsaonaOptions } from "../Utility/Netsaona.js";

const synonymOptions = {
  get URL() {
    return `https://www.openthesaurus.de/synonyme/search?q=${this.input}&format=application/json&similar=true&baseform=true`;
  },
  input: "",
  initialValue: null,
  data: {},
};

const Vin_synonymEntry = initEL({ id: "idVin_synonymEntry", fn: newSynonym, resetValue: "Search for synonyms" });
const Lbl_synonymSearchWord = initEL({ id: "idLbl_synonymSearchWord" });

export function clear_cl_Synonym() {
  KadTable.createHTMLGrid({ id: "idTab_synonymTableSynonym" });
  KadTable.createHTMLGrid({ id: "idTab_synonymTableSimilar" });
  Vin_synonymEntry.KadReset();
  if (synonymOptions.initialValue === null) {
    newSynonym();
  }
}

function newSynonym() {
  synonymOptions.input = Vin_synonymEntry.KadGet();
  if (!synonymOptions.input) return;
  if (synonymOptions.initialValue === null) {
    synonymOptions.initialValue = KadRandom.randomObject(netsaonaOptions.data.RandomWord);
    synonymOptions.input = synonymOptions.initialValue;
  }
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
