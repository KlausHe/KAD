import { Data_Nummernschild } from "../General/MainData.js";
import { dbID, initEL } from "../KadUtils/KadUtils.js";

initEL({ id: idVin_platLesenReg, action: "focus", dbList: Data_Nummernschild.map((item) => item[1]) });
initEL({ id: idVin_platLesenNum, action: "focus", dbList: Data_Nummernschild.map((item) => item[0]).sort() });
initEL({ id: idVin_platLesenReg, fn: platLesenRegInput, resetValue: "Region eingeben" });
initEL({ id: idVin_platLesenNum, fn: platLesenNumInput, resetValue: "Kürzel eingeben" });

export function clear_cl_PlatLesen() {
	idVin_platLesenReg.KadReset();
	idVin_platLesenNum.KadReset();
	platlesenResult();
}

function platLesenRegInput() {
	let reg = idVin_platLesenReg.KadGet();
	if (reg == "") {
		platlesenResult();
		return;
	}
	const input = reg.toLowerCase();
	let index = Data_Nummernschild.findIndex((item) => item[1].toString().toLowerCase() == input);
	if (index < 0) return;
	idVin_platLesenNum.KadReset();
	const num = Data_Nummernschild[index][0];
	platlesenResult(reg, num);
}

function platLesenNumInput() {
	let num = idVin_platLesenNum.KadGet();
	if (num == "") {
		platlesenResult();
		return;
	}
	const input = num.toLowerCase();
	let index = Data_Nummernschild.findIndex((item) => item[0].toString().toLowerCase() == input);
	if (index < 0) return;
	idVin_platLesenReg.KadReset();
	const reg = Data_Nummernschild[index][1];
	platlesenResult(reg, num);
}

function platlesenResult(reg = "Aachen", num = "AC") {
	if (num == undefined) {
		dbID("idLbl_platLesenResult").textContent = `\"${reg}\" nicht gefunden`;
		return;
	}
	dbID("idLbl_platLesenResult").textContent = `${reg}: ${num.toUpperCase()}`;
}
