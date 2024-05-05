import { dbID, dbCL, KadRandom } from "../General/KadUtils.js";
import * as Data from "../General/MainData.js";

export const netsaonaOptions = {
	selType: null,
	selected: null,
	data: {
		get ID() {
			return "abs";
			// return [firebase.firestore().collection('name').doc().id]
		},
		Boolean: ["Ja", "Nein", "1", "0", "An", "Aus"],
		get Integer() {
			return [...Array(10000).keys()];
		},
		Tier: ["Hund", "Katze", "Hamster", "Maus", "Esel", "Flamingo"],
		get Pflanze() {
			return Data.Data_Botanicals.map((o) => {
				return o.plant;
			});
		},
		get Beschwerde() {
			let disSet = new Set();
			for (let d of Data.Data_Botanicals) {
				d.discomfort.forEach((i) => disSet.add(i));
			}
			return Array.from(disSet).sort();
		},
		get Farbe() {
			return Data.Data_RALColors.map((o) => {
				return o.Name;
			});
		},
		get Wochentag() {
			return Data.Data_i18nDE.weekdays;
		},
		get Monat() {
			return Data.Data_i18nDE.months;
		},
		get Stadt() {
			return Array.from(Data.Data_Nummernschild.values());
		},
		get Land() {
			return Array.from(Data.Data_Country_CodesIso3166.values());
		},
		get Bundesland() {
			return Data.Data_Country_GermanDistrics.map((o) => {
				return o.LandDE;
			});
		},
		get Sprache() {
			return Array.from(Data.Data_Country_CodesIso639.values());
		},
		get Name() {
			return Data.Data_HumanNames.all;
		},
		get Geld() {
			return Array.from(Data.Data_Currencies.values());
		},
		get Gender() {
			return Data.Data_HumanNames.genders;
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
		clBtn[i].setAttribute("data-type", name);
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
	netsaonaOptions.selType = obj.dataset.type;
	netsaonaOptions.selected = KadRandom.randomObject(netsaonaOptions.data[netsaonaOptions.selType]);
	dbID("idLbl_netsaonaOutput").textContent = netsaonaOptions.selected;
	netsaonaOptions.selType = null;
}
