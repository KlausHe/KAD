import { KadDate, KadTable } from "../KadUtils/KadUtils.js";

const waktuOptions = {
  Sommerzeit: {
    date: "2026-4-1",
    dir: "-1 Stunde",
  },
  Winterzeit: {
    date: "2026-10-1",
    dir: "+1 Stunde",
  },
};

export function clear_cl_Waktu() {
  waktuGenerateTable();
}

function waktuCalculateDay(date) {
  let sz = new Date(date);
  sz.setDate(sz.getDate() - sz.getDay());
  return KadDate.getDate(sz, { format: "DD.MM.YYYY" });
}

function waktuGenerateTable() {
  const header = [{ data: "Sommerzeit" }, { data: "Winterzeit" }];
  const body = [
    //
    { data: [waktuCalculateDay(waktuOptions.Sommerzeit.date), waktuOptions.Sommerzeit.dir] },
    { data: [waktuCalculateDay(waktuOptions.Winterzeit.date), waktuOptions.Winterzeit.dir] },
  ];
  KadTable.createHTMLGrid({ id: "idTab_waktuTable", header, body });
}
