const materialFilterOptions = {
  get orig() {
    return ["WName", "WNr", "matGroup", "R_eR_p2", "R_m", "S_b_W", "A"]
  },
  select: []
};

function clear_cl_MaterialFilterSettings() {
  materialFilterOptions.select = [...materialFilterOptions.orig];
  materialFilterBuildTable();
  materialSelectedTable();
};

//Hauptliste mit Werkstoffdaten ersetllen!!!
function materialFilterBuildTable() {
  clearTable("idTabHeader_MaterialFilterTable");
  let headerRow = insertTableRow("idTabHeader_MaterialFilterTable");
  clearTable("idTabBody_MaterialFilterTable");
  for (const key of Object.keys(Data_Material.metadata)) {
    let bodyRow = insertTableRow("idTabBody_MaterialFilterTable");
    let nextCell = 0;
    let cell = bodyRow.insertCell(nextCell);
    let tempCB = document.createElement("input");
    tempCB.type = "checkbox";
    tempCB.id = `idCb_settingsMaterialfilter_${key}`;
    tempCB.value = key;
    tempCB.checked = materialFilterOptions.select.includes(key);
    tempCB.onclick = () => {
      materialFilterChoices(key, tempCB);
    }
    cell.appendChild(tempCB);
    cell.style.textAlign = "center";

    nextCell++;
    cell = bodyRow.insertCell(nextCell);
    let tempLBL = document.createElement("label");
    tempLBL.textContent = Data_Material.metadata[key].Bezeichnung;
    tempLBL.setAttribute("for", tempCB.id);
    cell.appendChild(tempLBL);
    cell.style.textAlign = "left";
    nextCell++;
    cell = bodyRow.insertCell(nextCell);
    let tempUnit = document.createElement("label");
    tempUnit.innerHTML = Data_Material.metadata[key].abbr;
    tempUnit.setAttribute("for", tempCB.id);
    cell.appendChild(tempUnit);
    cell.style.textAlign = "left";

  };
};

function materialFilterUpdateCB() {
  for (const key of Object.keys(Data_Material.metadata)) {
    let cb = `idCb_settingsMaterialfilter_${key}`;
    cb.checked = materialFilterOptions.select.includes(key);
  }
}

function materialFilterChoices(key, obj) {
  if (obj.checked) {
    materialFilterOptions.select.push(key);
  } else {
    let index = materialFilterOptions.select.indexOf(key)
    materialFilterOptions.select.splice(index, 1);
  }
  materialSelectedTable();
};
