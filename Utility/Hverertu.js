import { Data_Country_CodesIso3166 } from "../General/MainData.js";
import { dbID, initEL, KadFile, KadTable } from "../KadUtils/KadUtils.js";

const hverertuOptions = {
  input: "",
  inputTimer: null,
  dataCount: 0,
  data: {
    Alter: {
      value: null,
      description: "Alter (geschätzt)",
      get data() {
        KadFile.loadUrlToJSON({ variable: "data", url: `https://api.agify.io/?name=${hverertuOptions.input}`, callback: hverertuAlter });
      },
    },
    Gender: {
      value: null,
      description: "Geschlecht",
      get data() {
        KadFile.loadUrlToJSON({ variable: "data", url: `https://api.genderize.io?name=${hverertuOptions.input}`, callback: hverertuGender });
      },
    },
    Herkunft: {
      value: null,
      description: "Herkunft (nach Wahrscheinlichkeit)",
      get data() {
        KadFile.loadUrlToJSON({ variable: "data", url: `https://api.nationalize.io?name=${hverertuOptions.input}`, callback: hverertuHerkunft });
      },
    },
  },
};
initEL({ id: idVin_hverertuEntry, fn: hverertuGetInput, resetValue: "Enter a Name" });
initEL({ id: idBtn_hverertuEntry, fn: hverertuGetInput });

export function clear_cl_Hverertu() {
  idVin_hverertuEntry.KadReset();
  hverertuOptions.input = "";
  createHverertuTable();
}

function hverertuGetInput() {
  hverertuOptions.input = idVin_hverertuEntry.KadGet();
  if (hverertuOptions.input == "") return;

  if (hverertuOptions.inputTimer != null) {
    clearTimeout(hverertuOptions.inputTimer);
    hverertuOptions.inputTimer = null;
  }
  hverertuOptions.inputTimer = setTimeout(hverertuGetData, 400);
}

function hverertuGetData() {
  for (let obj in hverertuOptions.data) {
    hverertuOptions.data[obj].data;
  }
}

function hverertuPassValue(key) {
  const id = Object.keys(hverertuOptions.data).indexOf(key);
  dbID(`idLbl_hverertu_value_${id}`).innerHTML = hverertuOptions.data[key].value;
}

function hverertuAlter({ data }) {
  hverertuOptions.data.Alter.value = data.age == null ? "keine Daten gefunden" : data.age;
  hverertuPassValue("Alter");
}

function hverertuHerkunft({ data }) {
  if (data.country.length == 0) {
    hverertuOptions.data.Herkunft.value = "keine Daten gefunden";
  } else {
    hverertuOptions.data.Herkunft.value = data.country.map((obj) => {
      for (let item of Data_Country_CodesIso3166) {
        if (item.alpha2 == obj.country_id) return item.nameDE;
      }
    });
  }
  hverertuOptions.data.Herkunft.value = `${hverertuOptions.data.Herkunft.value}`.replace(/,/g, ", ");
  hverertuPassValue("Herkunft");
}

function hverertuGender({ data }) {
  if (data.gender == null) {
    hverertuOptions.data.Gender.value = "keine Daten gefunden";
  } else {
    const gender = data.gender == "male" ? "männlich" : "weiblich";
    hverertuOptions.data.Gender.value = `${gender} (${data.probability * 100}%)`;
  }
  hverertuPassValue("Gender");
}

function createHverertuTable() {
  const body = [{ data: Object.keys(hverertuOptions.data) }, { data: Object.keys(hverertuOptions.data).map((_) => "..."), settings: { names: ["hverertu", "value"] } }];
  KadTable.createHTMLGrid({ id: idTab_hverertuTable, body });
}
