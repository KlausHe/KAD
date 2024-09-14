import { Data_Nummernschild } from "../General/MainData.js";
import { dbID, initEL } from "../KadUtils/KadUtils.js";

initEL({ id: idVin_platLesenReg, action: "focus", dbList: Array.from(Data_Nummernschild.values()) });
initEL({ id: idVin_platLesenNum, action: "focus", dbList: Array.from(Data_Nummernschild.keys()).sort() });
initEL({ id: idVin_platLesenReg, fn: platLesenInput, resetValue: "Region eingeben" });
initEL({ id: idVin_platLesenNum, fn: platLesenInput, resetValue: "Kürzel eingeben" });

export function clear_cl_PlatLesen() {
	idVin_platLesenReg.KadReset();
	idVin_platLesenNum.KadReset();
	platlesenResult('"AC"', '"Aachen"');
}

function platLesenInput(btn) {
	const obj = btn.target;
	if (obj.value == "") platlesenResult('"AC"', '"Aachen"');
	let to = null;
	const input = obj.value.toString().toLowerCase();
	const type = obj.dataset.type;
	if (type == "REG") {
		dbID("idVin_platLesenNum").value = "";
		let index = Array.from(Data_Nummernschild).findIndex((a) => a[1].toString().toLowerCase() == input); //REG
		to = Array.from(Data_Nummernschild.keys())[index]; //REG
	} else {
		dbID("idVin_platLesenReg").value = "";
		let index = Array.from(Data_Nummernschild).findIndex((a) => a[0].toString().toLowerCase() == input); //REG
		to = Array.from(Data_Nummernschild.values())[index]; //NUM
	}
	platlesenResult(obj.value, to);
}

function platlesenResult(from, to) {
	if (to == undefined) {
		dbID("idLbl_platLesenResult").textContent = `\"${from}\" nicht gefunden`;
		return;
	}
	dbID("idLbl_platLesenResult").textContent = `${from}-> ${to}`;
}
