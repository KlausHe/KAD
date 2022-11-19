const hverertuOptions = {
  input: "",
  dataCount: 0,
  data: {
    Alter: {
      value: null,
      description: "Alter (geschätzt)",
      get data() {
        globalP5.loadJSON(`https://api.agify.io/?name=${hverertuOptions.input}`, hverertuAlter, "json");
      }
    },
    Gender: {
      value: null,
      description: "Geschlecht",
      get data() {
        globalP5.loadJSON(`https://api.genderize.io?name=${hverertuOptions.input}`, hverertuGender, "json");
      }
    },
    Herkunft: {
      value: null,
      description: "Herkunft (nach Wahrscheinlichkeit)",
      get data() {
        globalP5.loadJSON(`https://api.nationalize.io?name=${hverertuOptions.input}`, hverertuHerkunft, "json");
      }
    }
  }
};

function clear_cl_Hverertu() {
  resetInput("idVin_hverertuEntry", "Enter a Name")
  createHverertuTable()
  hverertuOptions.input = "";
};

function hverertuGetData() {
  hverertuOptions.input = dbID("idVin_hverertuEntry").value.trim();
  if (hverertuOptions.input == "") return
  for (let obj in hverertuOptions.data) {
    hverertuOptions.data[obj].data;
  }
};

function hverertuPassValue(id) {
  dbID(`idLbl_cell_hverertu_value_${id}`).innerHTML = hverertuOptions.data[id].value;
}

function hverertuAlter(data) {
  hverertuOptions.data.Alter.value = (data.age == null) ? "keine Daten gefunden" : data.age;
  hverertuPassValue("Alter");
  dbID("idLbl_child_hverertuHeader_Value").innerHTML = data.name;
}

function hverertuHerkunft(data) {
  if (data.country.length == 0) {
    hverertuOptions.data.Herkunft.value = "keine Daten gefunden"
  } else {
    hverertuOptions.data.Herkunft.value = data.country.map(obj => {
      return Data_Country_CodesIso3166.get(obj.country_id)
    })
  }
  hverertuOptions.data.Herkunft.value = `${hverertuOptions.data.Herkunft.value}`.replace(/,/g, ", ")
  hverertuPassValue("Herkunft");
}

function hverertuGender(data) {
  if (data.gender == null) {
    hverertuOptions.data.Gender.value = "keine Daten gefunden";
  } else {
    const gender = (data.gender == "male") ? "männlich" : "weiblich"
    hverertuOptions.data.Gender.value = `${gender} (${data.probability*100}%)`
  }
  hverertuPassValue("Gender");
}

function createHverertuTable() {
  //header
  clearTable("idTabHeader_Hverertu");
  const rowTh = insertTableRow("idTabHeader_Hverertu")
  tableAddCellHeader(rowTh, {
    names: ["hverertuHeader", "Description"],
    type: "Lbl",
    text: "Name",
    cellStyle: {
      textAlign: "left"
    }
  });
  tableAddCellHeader(rowTh, {
    names: ["hverertuHeader", "Value"],
    type: "Lbl",
    text: "...",
    cellStyle: {
      textAlign: "left"
    }
  });

  // body
 
 
 
  clearTable("idTabBody_Hverertu");
  // body
  for (const objName in hverertuOptions.data) {
    const row = insertTableRow("idTabBody_Hverertu")
    tableAddCell(row, {
      names: ["hverertu", "description", objName],
      type: "Lbl",
      text: hverertuOptions.data[objName].description,
      copy: true,
      cellStyle: {
        textAlign: "left"
      }
    });
    tableAddCell(row, {
      names: ["hverertu", "value", objName],
      type: "Lbl",
      text: "...",
      copy: true,
      cellStyle: {
        textAlign: "left"
      }
    });
  }
};