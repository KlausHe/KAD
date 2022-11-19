function clear_cl_PlatLesen() {
  clearFirstChild("idSel_platLesenReg");
  clearFirstChild("idSel_platLesenNum");
  dbID("idSel_platLesenNum").options[0] = new Option("Region wählen");
  dbID("idSel_platLesenReg").options[0] = new Option("Nummernschild wählen");
  dbID("idLbl_platLesenRegResult").textContent = "~Nummernschild~";
  dbID("idLbl_platLesenNumResult").textContent = "~Region~";
};

function platLesenPopulateOptions() {
  if (dbID("idSel_platLesenNum").options.length > 1) return
  let i = 1;
  for (const [key, value] of Data_PlatLesen) {
    dbID("idSel_platLesenNum").options[i] = new Option(value);
    dbID("idSel_platLesenReg").options[i] = new Option(key);
    i++
  }
};

function platLesenReg(sel) {
  if (sel.selectedIndex == 0) {
    dbID("idLbl_platLesenNumResult").textContent = "~Nummernschild~"
    return
  }
  dbID("idLbl_platLesenNumResult").textContent = Array.from(Data_PlatLesen.values())[sel.selectedIndex - 1]
};

function platLesenNum(sel) {
  if (sel.selectedIndex == 0) {
    dbID("idLbl_platLesenRegResult").textContent = "~Region~"
    return
  }
  dbID("idLbl_platLesenRegResult").textContent = Array.from(Data_PlatLesen.keys())[sel.selectedIndex - 1]
};