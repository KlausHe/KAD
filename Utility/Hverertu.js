import { Data_GetCountryByKey } from "../KadData/KadData_Countries.js";
import { initEL, KadFile, KadLog, KadTable } from "../KadUtils/KadUtils.js";

const hverertuOptions = {
  input: "",
  dataCount: 0,
  age: "...",
  gender: "...",
  origin: "...",
  urls: {
    get age() {
      return `https://api.agify.io/?name=${hverertuOptions.input}`;
    },
    get gender() {
      return `https://api.genderize.io/?name=${hverertuOptions.input}`;
    },
    get origin() {
      return `https://api.nationalize.io/?name=${hverertuOptions.input}`;
    },
  },
};
const Vin_hverertuEntry = initEL({ id: "idVin_hverertuEntry", fn: hverertuGetInput, resetValue: "Vorname eingeben" });
initEL({ id: "idBtn_hverertuEntry", fn: hverertuGetInput });

export function clear_cl_Hverertu() {
  Vin_hverertuEntry.KadReset();
  hverertuOptions.input = "";
  createHverertuTable();
}

function hverertuGetInput() {
  hverertuOptions.input = Vin_hverertuEntry.KadGet();
  if (hverertuOptions.input == "") return;
  const URLS = [`https://api.agify.io/?name=${hverertuOptions.input}`, `https://api.genderize.io?name=${hverertuOptions.input}`, `https://api.nationalize.io?name=${hverertuOptions.input}`];
  KadFile.loadUrlToJSON({ variableArray: ["age", "gender", "origin"], urlArray: URLS, callback: hverertuGetData, errorCallback: hverertuErrorData });
}

function hverertuErrorData({ error }) {
  KadLog.error("Could not load Hverertu!", error);
}

function hverertuGetData(data) {
  const { age, gender, origin } = data;
  hverertuAge(age);
  hverertuOrigin(origin);
  hverertuGender(gender);
  createHverertuTable();
}

function hverertuAge(data) {
  if (data.age == null) return;
  hverertuOptions.age = data.age;
}

function hverertuOrigin(data) {
  if (data.country.length == 0) return;
  hverertuOptions.origin = "";
  for (let country of data.country) {
    hverertuOptions.origin += `${Data_GetCountryByKey(country.country_id, "cca2").nameDECommon}, `;
  }
  hverertuOptions.origin = hverertuOptions.origin.slice(0, -2);
}

function hverertuGender(data) {
  if (data.gender == null) return;
  const type = data.gender == "male" ? "männlich" : "weiblich";
  hverertuOptions.gender = `${type} (${data.probability * 100}%)`;
}

function createHverertuTable() {
  const body = [{ data: ["Alter", "Herkunft", "Gender"] }, { data: [hverertuOptions.age, hverertuOptions.origin, hverertuOptions.gender] }];
  KadTable.createHTMLGrid({ id: "idTab_hverertuTable", body });
}
