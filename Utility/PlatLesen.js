import { Data_Nummernschild } from "../KadData/KadData.js";
import { initEL } from "../KadUtils/KadUtils.js";

initEL({ id: "idVin_platLesenReg", action: "focus", dbList: Data_Nummernschild.map((item) => item[1]) });
initEL({ id: "idVin_platLesenNum", action: "focus", dbList: Data_Nummernschild.map((item) => item[0]).sort() });
const Vin_platLesenReg = initEL({ id: "idVin_platLesenReg", fn: platLesenRegInput, resetValue: "Region eingeben" });
const Vin_platLesenNum = initEL({ id: "idVin_platLesenNum", fn: platLesenNumInput, resetValue: "Kürzel eingeben" });
const Lbl_platLesenResult = initEL({ id: "idLbl_platLesenResult", resetValue: "" });

export function clear_cl_PlatLesen() {
  Vin_platLesenReg.KadReset();
  Vin_platLesenNum.KadReset();
  Lbl_platLesenResult.KadReset();
  platlesenResult();
}

function platLesenRegInput() {
  let reg = Vin_platLesenReg.KadGet();
  if (reg == "") {
    platlesenResult();
    return;
  }
  const input = reg.toLowerCase();
  let index = Data_Nummernschild.findIndex((item) => item[1].toString().toLowerCase() == input);
  if (index < 0) return;
  Vin_platLesenNum.KadReset();
  const num = Data_Nummernschild[index][0];
  platlesenResult(reg, num);
}

function platLesenNumInput() {
  let num = Vin_platLesenNum.KadGet();
  if (num == "") {
    platlesenResult();
    return;
  }
  const input = num.toLowerCase();
  let index = Data_Nummernschild.findIndex((item) => item[0].toString().toLowerCase() == input);
  if (index < 0) return;
  Vin_platLesenReg.KadReset();
  const reg = Data_Nummernschild[index][1];
  platlesenResult(reg, num);
}

function platlesenResult(reg = "Aachen", num = "AC") {
  if (num == undefined) {
    Lbl_platLesenResult.KadSetText(`\"${reg}\" nicht gefunden`);
    return;
  }
  Lbl_platLesenResult.KadSetText(`${reg}: ${num.toUpperCase()}`);
}
