function clear_cl_PlatLesen() {
	resetInput("idVin_platLesenReg", "Region eingeben");
	resetInput("idVin_platLesenNum", "Kürzel eingeben");
	platlesenResult('"AC"', '"Aachen"');
}

function platLesenPopulateOptions() {
	if (dbID("idVin_platLesenNum").childNodes.length > 1) return;
	let regArr = [];
	let i = 1;
	for (const [key, value] of Data_PlatLesen) {
		const opt = document.createElement("OPTION");
		opt.textContent = key;
		dbID("idDlist_platLesenNum").appendChild(opt);
		regArr.push(value);
		i++;
	}
	i = 1;
	regArr = regArr.sort();
	for (let v of regArr) {
		const opt = document.createElement("OPTION");
		opt.textContent = v;
		dbID("idDlist_platLesenReg").appendChild(opt);
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
		let index = Array.from(Data_PlatLesen).findIndex((a) => a[1].toString().toLowerCase() == input); //REG
		to = Array.from(Data_PlatLesen.keys())[index]; //REG
	} else {
		dbID("idVin_platLesenReg").value = "";
		let index = Array.from(Data_PlatLesen).findIndex((a) => a[0].toString().toLowerCase() == input); //REG
		to = Array.from(Data_PlatLesen.values())[index]; //NUM
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
