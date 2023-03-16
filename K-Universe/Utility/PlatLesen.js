function clear_cl_PlatLesen() {
	clearFirstChild("idSel_platLesenReg");
	clearFirstChild("idSel_platLesenNum");
	dbID("idSel_platLesenReg").options[0] = new Option("Region wählen");
	dbID("idSel_platLesenNum").options[0] = new Option("Nummernschild wählen");
	dbID("idLbl_platLesenRegResult").textContent = "Aachen -> AC";
	dbID("idLbl_platLesenNumResult").textContent = "AC -> Aachen";
}

function platLesenPopulateOptions() {
	if (dbID("idSel_platLesenNum").options.length > 1) return;
	let regArr = [];
	let i = 1;
	for (const [key, value] of Data_PlatLesen) {
		dbID("idSel_platLesenNum").options[i] = new Option(key);
		regArr.push(value);
		i++;
	}
	i = 1;
	regArr = regArr.sort();
	for (let v of regArr) {
		dbID("idSel_platLesenReg").options[i] = new Option(v);
		i++;
	}
}

function platLesenNum(sel) {
	if (sel.selectedIndex == 0) {
		dbID("idLbl_platLesenNumResult").textContent = "AC -> Aachen";
		return;
	}
	dbID("idLbl_platLesenNumResult").textContent = Array.from(Data_PlatLesen.values())[sel.selectedIndex - 1];
}

function platLesenReg(sel) {
	if (sel.selectedIndex == 0) {
		dbID("idLbl_platLesenRegResult").textContent = "Aachen -> AC";
		return;
	}
	let index = Array.from(Data_PlatLesen).findIndex((a) => a[1] == sel.value);
	dbID("idLbl_platLesenRegResult").textContent = Array.from(Data_PlatLesen.keys())[index];
}
