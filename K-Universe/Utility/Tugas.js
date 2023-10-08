let tugasOptions = {}

function clear_cl_Tugas() {
  tugasOptions = {};
  createTugas();
  KadUtils.DOM.resetInput("idArea_tugasEntry", "Paste to Tugas")
};

function clearRowTugas(name) {
  delete tugasOptions[name];
  createTugas();
};

function editRowTugas(name) {
  delete tugasOptions[name];
  KadUtils.dbID("idArea_tugasEntry").value = name;
};

function newTugas() {
  const value = KadUtils.dbID("idArea_tugasEntry").value.toString().trim();
  if (value == "") return

  tugasOptions[value] = false;
  KadUtils.dbID("idArea_tugasEntry").value = "";
  createTugas();
  saveDiscipuli("Tugas");
}

function createTugas() {
  //clear list
  KadUtils.Table.clear(idTabBody_tugas);
  let tempList = [];
  for (let i = 0; i < Object.keys(tugasOptions).length; i++) {
    tempList.push({
      name: Object.keys(tugasOptions)[i],
      state: Object.values(tugasOptions)[i]
    });
  };
  const sortedList = KadUtils.Array.sortArrayByKey(tempList, "name", false, true);

  //create list
  for (let i = 0; i < sortedList.length; i++) {
    let row = idTabBody_tugas.insertRow(idTabBody_tugas.rows.length);

    // get the data from the array
    const entryValue = sortedList[i].name;
    const entryState = sortedList[i].state;

    //clearButton
    KadUtils.Table.addCell(row, {
      names: ["tugasTrash", i],
      type: "Btn",
      subGroup: "subgrid",
      img: "trash",
      ui: {
        uiSize: "size1",
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
    KadUtils.Table.addCell(row, {
      names: ["tugasEdit", i],
      type: "Btn",
      subGroup: "subgrid",
      img: "edit",
      ui: {
        uiSize: "size1",
        uiType: "transparent"
      },
      style: {
        textAlign: "center"
      },
      onclick: () => {
        editRowTugas(entryValue);
        KadUtils.dbID("idArea_tugasEntry").focus();
      }
    });

    // Check
    KadUtils.Table.addCell(row, {
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
    KadUtils.Table.addCell(row, {
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