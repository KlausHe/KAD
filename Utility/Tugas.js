import { saveDiscipuli } from "../General/Account.js";
import { dbID, initEL, KadTable } from "../KadUtils/KadUtils.js";

let tugasOptions = { data: [] };

const Area_tugasEntry = initEL({ id: "idArea_tugasEntry", action: "change", fn: tugasNewEntry, resetValue: "Paste to Tugas" });
initEL({ id: "idBtn_tugasEntry", fn: tugasNewEntry });

export function clear_cl_Tugas() {
  tugasOptions.data = [];
  Area_tugasEntry.KadReset();
  tugasCreateTable();
}
export const storage_cl_Tugas = {
  dbName: "Tugas",
  contentName: "cl_Tugas",
  clear() {
    this.data = [];
  },
  getData() {
    return tugasOptions.data;
  },
  saveData(data) {
    tugasOptions.data = [];
    if (typeof data == "object") {
      for (let obj of data) {
        tugasOptions.data.push(obj);
      }
    } else {
      tugasOptions.data = data;
    }
  },
  activateData() {
    tugasCreateTable();
  },
};

function tugasClearRow(index) {
  tugasOptions.data.splice(index, 1);
  tugasCreateTable();
}

function tugasEditRow(index) {
  Area_tugasEntry.KadSetValue(tugasOptions.data[index].text);
  tugasOptions.data.splice(index, 1);
}

function tugasNewEntry() {
  const value = Area_tugasEntry.KadGet({ noPlaceholder: true });
  if (value == "") return;
  tugasOptions.data.push({ text: value, state: false });
  Area_tugasEntry.KadReset();
  tugasCreateTable();
  saveDiscipuli("Tugas");
}

function checkboxClicked(index) {
  let label = dbID(`idLbl_tugas_entry_${index}`);
  const entry = tugasOptions.data[index].text;
  label.innerHTML = tugasOptions.data[index].state ? entry : `<del>${entry}</del>`;
  tugasOptions.data[index].state = !tugasOptions.data[index].state;
}

function tugasCreateTable() {
  const body = [
    { type: "KADImg", data: "trash", settings: { onclick: tugasClearRow } },
    { type: "KADImg", data: "edit", settings: { onclick: tugasEditRow } },
    { type: "Checkbox", data: tugasOptions.data.map((item) => item.state), settings: { names: ["tugas", "state"], onclick: checkboxClicked } },
    { data: tugasOptions.data.map((item) => item.text), settings: { names: ["tugas", "entry"], for: "tugas_state" } },
  ];

  KadTable.createHTMLGrid({ id: "idTab_tugasTable", body });
}
