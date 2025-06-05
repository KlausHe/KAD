import { Data_Botanicals, Data_HumanNames, Data_Nummernschild } from "../KadData/KadData.js";
import { Data_RALColors } from "../KadData/KadDataColor.js";
import { Data_Country_CodesIso3166, Data_Country_CodesIso639, Data_Country_GermanDistrics, Data_Currencies } from "../KadData/KadDataCountries.js";
import { dbCL, dbID, KadRandom } from "../KadUtils/KadUtils.js";

export const netsaonaOptions = {
  data: {
    get ID() {
      return [Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36)];
    },
    Boolean: ["Ja", "Nein", "1", "0", "An", "Aus"],
    get Integer() {
      return [...Array(10000).keys()];
    },
    Tier: ["Hund", "Katze", "Hamster", "Maus", "Esel", "Flamingo"],
    get Pflanze() {
      return Data_Botanicals.map((o) => {
        return o.plant;
      });
    },
    get Beschwerde() {
      let disSet = new Set();
      for (let d of Data_Botanicals) {
        d.discomfort.forEach((i) => disSet.add(i));
      }
      return Array.from(disSet).sort();
    },
    get Farbe() {
      return Data_RALColors.map((o) => {
        return o.Name;
      });
    },
    get Wochentag() {
      return ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    },
    get Monat() {
      return ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    },
    get Stadt() {
      return Data_Nummernschild.map((item) => item[1]);
    },
    get Land() {
      return Data_Country_CodesIso3166.map((item) => item.nameDE);
    },
    get Bundesland() {
      return Data_Country_GermanDistrics.map((o) => {
        return o.LandDE;
      });
    },
    get Sprache() {
      return Array.from(Data_Country_CodesIso639.values());
    },
    get Name() {
      return Data_HumanNames.all;
    },
    get Geld() {
      return Data_Currencies.map((cur) => `${cur.name} (${cur.symbol})`);
    },
    get Gender() {
      return Data_HumanNames.genders;
    },
    get Random() {
      let rand = new Set(Object.keys(netsaonaOptions.data));
      rand.delete("random");
      let type = KadRandom.randomObject([...rand]);
      return netsaonaOptions.data[type];
    },
    get RandomWord() {
      let randomSet = new Set(Object.keys(netsaonaOptions.data));
      randomSet.delete("RandomWord");
      randomSet.delete("Random");
      randomSet.delete("ID");
      randomSet.delete("Boolean");
      randomSet.delete("Integer");
      let type = KadRandom.randomObject([...randomSet]);
      return netsaonaOptions.data[type];
    },
  },
  RandomSelection(arr) {
    let randomSet = new Set([...arr]);
    let type = KadRandom.randomObject([...randomSet]);
    return netsaonaOptions.data[type];
  },
  RandomSelectedElement(arr) {
    let randomSet = new Set([...arr]);
    let type = KadRandom.randomObject([...randomSet]);
    return KadRandom.randomObject(netsaonaOptions.data[type]);
  },
};

export function clear_cl_Netsaona() {
  dbID("idLbl_netsaonaOutput").textContent = "...";
  const clBtn = dbCL("cl_NetsaonaOption", null);
  for (let i = 0; i < clBtn.length; i++) {
    const name = Object.keys(netsaonaOptions.data)[i];
    clBtn[i].textContent = name;
    clBtn[i].value = name;
    clBtn[i].addEventListener(
      "click",
      () => {
        netsaonaGenerate(clBtn[i]);
      },
      false
    );
  }
  netsaonaGenerate(clBtn[clBtn.length - 1]);
}

function netsaonaGenerate(obj) {
  dbID("idLbl_netsaonaOutput").textContent = KadRandom.randomObject(netsaonaOptions.data[obj.value]);
}
