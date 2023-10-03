const netsaonaOptions = {
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
			return Data_Kounselor.map((o) => {
				return o.Name;
			});
		},
		get Wochentag() {
			return i18nDE.weekdays;
		},
		get Monat() {
			return i18nDE.months;
		},
		get Stadt() {
			return Array.from(Data_PlatLesen.values());
		},
		get Land() {
			return Array.from(Data_Country_CodesIso3166.values());
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
			return Data_Names.all;
		},
		get Geld() {
			return Array.from(currencies.values());
		},
		get Gender() {
			return Data_Names.genders;
		},
		// get Voice() {
		// 	return Object.keys(ocjeneOptions.definitions.clefs);
		// },
		// get Instrument() {
		// 	return ocjeneInstruments.data.map((i) => i.Name);
		// },
		get Random() {
			let rand = new Set(Object.keys(netsaonaOptions.data));
			rand.delete("random");
			let type = randomObject([...rand]);
			return netsaonaOptions.data[type];
		},
		get RandomWord() {
			let randomSet = new Set(Object.keys(netsaonaOptions.data));
			randomSet.delete("RandomWord");
			randomSet.delete("Random");
			randomSet.delete("ID");
			randomSet.delete("Boolean");
			randomSet.delete("Integer");
			let type = randomObject([...randomSet]);
			return netsaonaOptions.data[type];
		},
	},
	RandomSelection(arr) {
		let randomSet = new Set([...arr]);
		let type = randomObject([...randomSet]);
		return netsaonaOptions.data[type];
	},
	RandomSelectedElement(arr) {
		let randomSet = new Set([...arr]);
		let type = randomObject([...randomSet]);
		return randomObject(netsaonaOptions.data[type]);
	},
};

function clear_cl_Netsaona() {
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
	netsaonaOptions.selected = randomObject(netsaonaOptions.data[netsaonaOptions.selType]);
	dbID("idLbl_netsaonaOutput").textContent = netsaonaOptions.selected;
	netsaonaOptions.selType = null;
}
