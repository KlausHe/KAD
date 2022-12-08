let tugasOptions = {}

function clear_cl_Tugas() {
  tugasOptions = {};
  createTugas();
  resetInput("idArea_tugasEntry", "Paste to Tugas")
};

function clearRowTugas(name) {
  delete tugasOptions[name];
  createTugas();
};

function editRowTugas(name) {
  delete tugasOptions[name];
  dbID("idArea_tugasEntry").value = name;
};

function newTugas() {
  const value = dbID("idArea_tugasEntry").value.toString().trim();
  if (value == "") return

  tugasOptions[value] = false;
  dbID("idArea_tugasEntry").value = "";
  createTugas();
  saveDiscipuli("Tugas");
}

function createTugas() {
  //clear list
  clearTable(idTabBody_tugas);
  let tempList = [];
  for (let i = 0; i < Object.keys(tugasOptions).length; i++) {
    tempList.push({
      name: Object.keys(tugasOptions)[i],
      state: Object.values(tugasOptions)[i]
    });
  };
  const sortedList = sortArrayByKey(tempList, "name", false, true);

  //create list
  for (let i = 0; i < sortedList.length; i++) {
    let row = idTabBody_tugas.insertRow(idTabBody_tugas.rows.length);

    // get the data from the array
    const entryValue = sortedList[i].name;
    const entryState = sortedList[i].state;

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
          tugasOptions[entry] = true;
        } else {
          label.textContent = entry;
          tugasOptions[entry] = false;
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