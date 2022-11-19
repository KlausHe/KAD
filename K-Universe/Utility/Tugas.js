let tugasData = {};

function clear_cl_Tugas() {
  tugasData = {};
  createTugas();
  resetInput("idArea_tugasEntry", "Paste to Tugas")
};

function clearRowTugas(name) {
  delete tugasData[name];
  createTugas();
};

function editRowTugas(name) {
  delete tugasData[name];
  dbID("idArea_tugasEntry").value = name;
};

function newTugas() {
  const value = dbID("idArea_tugasEntry").value.toString().trim();
  if (value != false) return
  tugasData[value] = false;
  dbID("idArea_tugasEntry").value = "";
  createTugas();
  if (nuncDiscipuli.checkLogin) {
    saveDiscipuliRequest(contentGrid.cl_Tugas.userStoreDB);
  };
}

function createTugas() {
  //clear list
  clearTable(idTabBody_tugas);
  // sort tugasList
  let TugasTemp = [];
  for (let i = 0; i < Object.keys(tugasData).length; i++) {
    TugasTemp.push({
      name: Object.keys(tugasData)[i],
      state: Object.values(tugasData)[i]
    });
  };

  const TugasSorted = sortArrayByKey(TugasTemp, "name", false, true);

  //create list
  for (let i = 0; i < TugasSorted.length; i++) {
    let row = idTabBody_tugas.insertRow(idTabBody_tugas.rows.length);

    // get the data from the array
    const entryValue = TugasSorted[i].name;
    const entryState = TugasSorted[i].state;

    //clearButton
    tableAddCell(row, {
      names: ["tugasTrash", i],
      type: "Btn",
      subGroup: "subgrid",
      img: "trash",
      ui: {
        uiSize: "square",
        uiType: "transparent"
      },
      style: {
        textAlign: "center"
      },
      onclick: () => {
        clearRowTugas(entryValue);
      }
    });

    // EDIT
    tableAddCell(row, {
      names: ["tugasEdit", i],
      type: "Btn",
      subGroup: "subgrid",
      img: "edit",
      ui: {
        uiSize: "square",
        uiType: "transparent"
      },
      style: {
        textAlign: "center"
      },
      onclick: () => {
        editRowTugas(entryValue);
        dbID("idArea_tugasEntry").focus();
      }
    });

    // Check
    tableAddCell(row, {
      names: ["tugasCheck", i],
      type: "Vin",
      subGroup: "checkbox",
      pointer: true,
      style: {
        textAlign: "center"
      },
      checked: entryState,
      onclick: () => {
        const curRow = idTabBody_tugas.rows[i];
        let label = curRow.cells[3];
        let entry = curRow.cells[3].textContent;
        if (curRow.cells[2].childNodes[0].checked) {
          label.innerHTML = `<del>${entry}</del>`;
          tugasData[entry] = true;
        } else {
          label.textContent = entry;
          tugasData[entry] = false;
        }
      }
    });

    // TEXT
    tableAddCell(row, {
      names: ["tugas", i],
      type: "Lbl",
      text: entryState ? `<del>${entryValue}</del>` : entryValue,
      style: {
        textAlign: "left"
      },
      copy: true
    });
  };
};
