import { Data_Nummernschild } from "../KadData/KadData.js";
import { dbID, initEL } from "../KadUtils/KadUtils.js";

initEL({ id: dbID("idVin_platLesenReg"), action: "focus", dbList: Data_Nummernschild.map((item) => item[1]) });
initEL({ id: dbID("idVin_platLesenNum"), action: "focus", dbList: Data_Nummernschild.map((item) => item[0]).sort() });
initEL({ id: dbID("idVin_platLesenReg"), fn: platLesenRegInput, resetValue: "Region eingeben" });
initEL({ id: dbID("idVin_platLesenNum"), fn: platLesenNumInput, resetValue: "Kürzel eingeben" });
initEL({ id: dbID("idLbl_platLesenResult"), resetValue: "" });

export function clear_cl_PlatLesen() {
  dbID("idVin_platLesenReg").KadReset();
  dbID("idVin_platLesenNum").KadReset();
  dbID("idLbl_platLesenResult").KadReset();
  platlesenResult();
}

function platLesenRegInput() {
  let reg = dbID("idVin_platLesenReg").KadGet();
  if (reg == "") {
    platlesenResult();
    return;
  }
  const input = reg.toLowerCase();
  let index = Data_Nummernschild.findIndex((item) => item[1].toString().toLowerCase() == input);
  if (index < 0) return;
  dbID("idVin_platLesenNum").KadReset();
  const num = Data_Nummernschild[index][0];
  platlesenResult(reg, num);
}

function platLesenNumInput() {
  let num = dbID("idVin_platLesenNum").KadGet();
  if (num == "") {
    platlesenResult();
    return;
  }
  const input = num.toLowerCase();
  let index = Data_Nummernschild.findIndex((item) => item[0].toString().toLowerCase() == input);
  if (index < 0) return;
  dbID("idVin_platLesenReg").KadReset();
  const reg = Data_Nummernschild[index][1];
  platlesenResult(reg, num);
}

function platlesenResult(reg = "Aachen", num = "AC") {
  if (num == undefined) {
    dbID("idLbl_platLesenResult").KadSetText(`\"${reg}\" nicht gefunden`);
    return;
  }
  dbID("idLbl_platLesenResult").KadSetText(`${reg}: ${num.toUpperCase()}`);
}
