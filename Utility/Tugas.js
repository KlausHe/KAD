import { saveDiscipuli } from "../General/Account.js";
import { dbID, initEL, KadTable } from "../KadUtils/KadUtils.js";

let tugasOptions = { data: [] };

initEL({ id: idArea_tugasEntry, action: "change", fn: tugasNewEntry, resetValue: "Paste to Tugas" });
initEL({ id: idBtn_tugasEntry, fn: tugasNewEntry });

export function clear_cl_Tugas() {
  tugasOptions.data = [];
  idArea_tugasEntry.KadReset();
  tugasCreateTable();
}
export const storage_cl_Tugas = {
  dbName: "Tugas",
  contentName: "cl_Tugas",
  clear() {
    this.data = [];
  },
  get data() {
    return tugasOptions.data;
  },
  set data(data) {
    tugasOptions.data = [];
    if (typeof data == "object") {
      for (let [key, value] of Object.entries(data)) {
        tugasOptions.data.push({ text: key, state: value });
      }
    } else {
      tugasOptions.data = data;
    }
    tugasCreateTable();
  },
};

function tugasClearRow(index) {
  tugasOptions.data.splice(index, 1);
  tugasCreateTable();
}

function tugasEditRow(index) {
  dbID("idArea_tugasEntry").value = tugasOptions.data[index].text;
  tugasOptions.data.splice(index, 1);
}

function tugasNewEntry() {
  const value = idArea_tugasEntry.KadGet({ noPlaceholder: true });
  if (value == "") return;
  tugasOptions.data.push({ text: value, state: false });
  idArea_tugasEntry.value = "";
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
    { data: tugasOptions.data.map((item) => item.text), settings: { names: ["tugas", "entry"], for: "idCheckbox_tugas_state" } },
  ];

  KadTable.createHTMLGrid({ id: idTab_tugasTable, body });
}
