import { daEL, dbID, KadDOM } from "../General/KadUtils.js";
import { Data_Nummernschild } from "../General/MainData.js";

daEL(idVin_platLesenNum, "focus", platLesenPopulateOptions);
daEL(idVin_platLesenNum, "change", () => platLesenInput(idVin_platLesenNum));
daEL(idVin_platLesenReg, "focus", platLesenPopulateOptions);
daEL(idVin_platLesenReg, "change", () => platLesenInput(idVin_platLesenReg));

export function clear_cl_PlatLesen() {
	KadDOM.resetInput("idVin_platLesenReg", "Region eingeben");
	KadDOM.resetInput("idVin_platLesenNum", "Kürzel eingeben");
	platlesenResult('"AC"', '"Aachen"');
}

function platLesenPopulateOptions() {
	const dlistNum = dbID("idDlist_platLesenNum");
	const dlistReg = dbID("idDlist_platLesenReg");
	if (dlistNum.childNodes.length > 1) return;
	let regArr = [];
	let i = 1;
	for (const [key, value] of Data_Nummernschild) {
		const opt = document.createElement("OPTION");
		opt.textContent = key;
		dlistNum.appendChild(opt);
		regArr.push(value);
		i++;
	}
	i = 1;
	regArr = regArr.sort();
	for (let v of regArr) {
		const opt = document.createElement("OPTION");
		opt.textContent = v;
		dlistReg.appendChild(opt);
		i++;
	}
}

function platLesenInput(obj) {
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
