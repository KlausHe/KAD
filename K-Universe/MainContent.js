const contentGrid = {
	cl_UserAcc: {
		userSelected: true,
		userStoreDBName: "UserAcc",
		userStoreDBClear: function () {
			this.userStoreDBData = false;
		},
		get userStoreDBData() {
			let data = {};
			for (const [key, value] of Object.entries(AccData.infos)) {
				data[key] = value.data;
			}
			return data;
		},
		set userStoreDBData(data) {
			AccData.data = true;
			for (const [key, value] of Object.entries(data)) {
				AccData.infos[key].data = value;
			}
		},
		width: 0,
		contentGroup: "AccountSettings",
		name: "Account-Settings",
		subgrid: [
			["cl_UserAcc_infos", "left"],
			["cl_UserAcc_mail", "left"],
			["cl_UserAcc_pass", "left"],
			["cl_UserAcc_submit", "left"],
			["cl_UserAcc_check", "left"],
			["cl_UserAcc_alert", "left"],
		],
	},
	cl_Howa: {
		userSelected: true,
		userStoreDBName: "Howa",
		userStoreDBClear: function () {
			this.userStoreDBData = "Berlin";
		},
		get userStoreDBData() {
			return howaData.pos.location;
		},
		set userStoreDBData(data) {
			dbID("idVin_howaEntry").value = data;
			howaGetLocation();
		},
		width: 2,
		canvas: function () {
			howaRefreshGraph();
			howaColorGraph();
		},
		contentGroup: "News",
		name: "Howa",
		heritage: ["turkmenisch", "Wetter"],
		source: {
			Daten: "https://openweathermap.org",
		},
		info: "Wettervorhersage in 3 Stunden abständen für die nächsten 4 Tage.",
		subgrid: [
			["cl_HowaInput", "center", "end"],
			["cl_HowaNow", "center", "end"],
			["cl_HowaOptionsA", "left"],
			["cl_HowaOptionsB", "left"],
			["cl_HowaOptionsC", "left"],
			["cl_HowaGraph", "center"],
			["cl_HowaZoom", "center"],
			["cl_HowaMapsExpand", "center"],
			["cl_HowaMapsSelectCountry", "right"],
			["cl_HowaMapsSelectCriteria", "left"],
			["cl_HowaMapsImg", "center"],
		],
	},
	// cl_Sepakbola: {
	// 	userSelected: false,
	// 	height: 2,
	// 	contentGroup: "News",
	// 	name: "Sepakbola",
	// 	heritage: ["javanisch", "Fußball"],
	// 	source: {
	// 		Daten: "https://www.openligadb.de",
	// 	},
	// 	subgrid: [
	// 		["cl_SepakbolaInputLiga", "left"],
	// 		["cl_SepakbolaInputSeason", "left"],
	// 		["cl_SepakbolaInputDay", "center"],
	// 		["cl_SepakbolaTable", "right"],
	// 		["cl_SepakbolaMatches", "left"],
	// 	],
	// },
	cl_News: {
		userSelected: true,
		contentGroup: "News",
		name: "News",
		heritage: ["englisch", "Nachrichten"],
		source: {
			Daten: "https://newsdata.io",
		},
		subgrid: [
			["cl_NewsNav", "left"],
			["cl_NewsCategory", "left"],
			["cl_NewsCountry", "left"],
			["cl_NewsTable", "left"],
			["cl_NewsResultTitle", "center", "center"],
			["cl_NewsResultText", "center"],
			["cl_NewsResultImage", "center"],
		],
	},
	cl_Lions: {
		userSelected: true,
		userStoreDBName: "Lions",
		userStoreDBClear: function () {
			this.userStoreDBData = 0;
		},
		get userStoreDBData() {
			return lionsOptions.num;
		},
		set userStoreDBData(data) {
			dbID("idVin_lionsInput").value = data;
			setTimeout(() => {
				lionsRequestNumber();
			}, 1000);
		},
		active: false,
		contentGroup: "News",
		name: "Lions",
		heritage: ["englisch", "Löwen"],
		source: {
			Daten: "https://hirsau.lions.de/",
		},
		info: "Gewinner des Lions-Advendskalender 2021 - Edition Nagold",
		subgrid: [
			["cl_LionsInput", "right", "center"],
			["cl_LionsOutput", "left"],
			["cl_LionsTable", "center"],
		],
	},
	cl_PostillonTicker: {
		userSelected: true,
		contentGroup: "News",
		name: "PostillonTicker",
		source: {
			Daten: "https://www.der-Postillon.com",
		},
		info: "Alle Postillon News-Ticker zum durchklicken",
		subgrid: [
			["cl_PostillionTable", "center"],
			["cl_PostillionNumber", "center"],
		],
	},
	cl_Netsaona: {
		userSelected: true,
		contentGroup: "Utility",
		name: "Netsaona",
		heritage: ["shona", "Zufall"],
		info: "Zufallsgenerator für verschiedene Dinge!",
		subgrid: [
			["cl_NetsaonaOptionsA", "center"],
			["cl_NetsaonaOptionsB", "center"],
			["cl_NetsaonaOptionsC", "center"],
			["cl_NetsaonaOptionsD", "center"],
			["cl_NetsaonaOptionsE", "center"],
			["cl_NetsaonaOptionsF", "center"],
			["cl_NetsaonaOptionsG", "center"],
			["cl_NetsaonaOutput", "center"],
		],
	},
	cl_Pelvelea: {
		userSelected: true,
		contentGroup: "Utility",
		name: "Pelvelea",
		heritage: ["khmer", "Zeit"],
		info: "Wann kannst du nach Hause?!",
		subgrid: [
			["cl_PelveleaStarttime", "center"],
			["cl_PelveleaBreaks", "center"],
			["cl_PelveleaWorktime", "center"],
			["cl_PelveleaResult", "center"],
			["cl_PelveleaProgress", "center"],
			["cl_PelveleaBreaktime", "center"],
		],
	},
	cl_Tugas: {
		userSelected: true,
		userStoreDBName: "Tugas",
		userStoreDBClear: function () {
			this.userStoreDBData = {};
		},
		get userStoreDBData() {
			return tugasOptions;
		},
		set userStoreDBData(data) {
			tugasOptions = deepClone(data);
			createTugas();
		},
		contentGroup: "Utility",
		name: "Tugas",
		heritage: ["indonesisch", "Pflicht"],
		info: 'Füge Texte ein und drück "Enter". Klicke auf einen deiner Texte und er kopiert sich direkt in deine Zwischenablage!',
		subgrid: [
			["cl_TugasInput", "center"],
			["cl_TugasEnter", "center"],
			["cl_TugasList", "left"],
		],
	},
	cl_Kadar: {
		userSelected: true,
		contentGroup: "Utility",
		name: "Kadar",
		heritage: ["türkisch", "bis"],
		info: "Berechne Zeiten",
		subgrid: [
			["cl_KadarSelA", "center"],
			["cl_KadarSelB", "center"],
			["cl_KadarLblNow", "center"],
			["cl_KadarResultTable_Anow", "center"],
			["cl_KadarResultTable_AB", "center"],
			["cl_KadarResultTable_Bnow", "center"],
		],
	},
	cl_Thiontu: {
		userSelected: true,
		contentGroup: "Utility",
		name: "Thiontu",
		heritage: ["irisch", "umwandeln"],
		subgrid: [
			["cl_ThiontuInputArea", "right"],
			["cl_ThiontuOutputArea", "left"],
			["cl_ThiontuOptions_A", "center"],
			["cl_ThiontuOptions_B", "center"],
			["cl_ThiontuOptions_C", "center"],
			["cl_ThiontuOptions_D", "center"],
			["cl_ThiontuOptions_E", "center"],
		],
	},
	cl_Egg: {
		userSelected: true,
		contentGroup: "Utility",
		name: "Eierkochen",
		source: {
			Daten: "newton.ex.ac.uk/teaching/CDHW/egg/",
		},
		info: "1. Ausreichnd Wasser zum kochen bringen.<br>2. Ei in leicht kochendes Wasser legen, sodass es vollständig bedeckt ist.<br>3. Timer starten.<br>4. Fertiges Ei aus kochendem Wasser entnehmen. Achtung, das Wasser ist heiß, das Ei auch!<br>5. Nach belieben unter kaltem Wasser abschrecken",
		subgrid: [
			["cl_EggMassValue", "center"],
			["cl_EggTempValue", "center"],
			["cl_EggYolkValue", "center"],
			["cl_EggStart", "center"],
			["cl_EggTime", "center"],
			["cl_EggTimeProgress", "center"],
		],
	},
	cl_Foody: {
		userSelected: true,
		contentGroup: "Utility",
		name: "Foody",
		heritage: ["vietnamesisch", "lecker"],
		info: "Wie lange und wie warm muss es kochen oder backen?<br>Suche ein Gericht aus und starte den Timer!",
		subgrid: [
			["cl_FoodyType", "left"],
			["cl_FoodyPreheat", "left"],
			["cl_FoodyStart", "center"],
			["cl_FoodyTime", "center"],
			["cl_FoodyTimeProgress", "center"],
		],
	},
	cl_Hverertu: {
		userSelected: true,
		contentGroup: "Utility",
		name: "Hver Ertu",
		heritage: ["isländisch", "Wer bist du"],
		source: {
			Alter: "https://agify.io",
			Herkunft: "https://nationalize.io",
			Gender: "https://genderize.io",
		},
		subgrid: [
			["cl_HverertuInput", "center"],
			["cl_HverertuTable", "center"],
		],
	},
	cl_Kounselor: {
		userSelected: true,
		contentGroup: "Utility",
		width: 1,
		name: "Kounselor",
		heritage: ["jiddisch", "Ratgeber"],
		subgrid: [
			["cl_KounselorOptionsA", "left"],
			["cl_KounselorOptionsB", "left"],
			["cl_KounselorOptionsC", "left"],
			["cl_KounselorOptionsD", "left"],
			["cl_KounselorOptionsE", "left"],
			["cl_KounselorOptionsF", "left"],
			["cl_KounselorOptionsG", "left"],
			["cl_KounselorOutputA", "right", "center"],
			["cl_KounselorOutputB", "right", "center"],
		],
	},
	cl_Kaihanga: {
		userSelected: true,
		canvas: function () {
			kaihangaResize();
			clear_cl_Kaihanga();
		},
		contentGroup: "Utility",
		name: "Kaihanga",
		heritage: ["maori", "Hersteller"],
		source: {
			Code: "http://dougtesting.net/home",
		},
		info: "Glücksrad!<br>Gib Gewinne ein und drücke auf das Rad.",
		subgrid: [
			["cl_KaihangaInput", "right"],
			["cl_KaihangaSegments", "right"],
			["cl_KaihangaResult", "left"],
			["cl_KaihangaCanvas", "left"],
		],
	},
	cl_Botanicals: {
		userSelected: true,
		contentGroup: "Utility",
		name: "Botanicals",
		heritage: ["englisch", "botanisch"],
		source: {
			Daten: "https://www.tabelle.info/kraeuter.html",
		},
		subgrid: [
			["cl_BotanicalsVinPlant", "center"],
			["cl_BotanicalsVinDiscomfort", "center"],
			["cl_BotanicalsTabResultPlant", "center"],
			["cl_BotanicalsTabResultDiscomfort", "center"],
		],
	},
	cl_PlatLesen: {
		userSelected: true,
		contentGroup: "Utility",
		name: "PlatLesen",
		heritage: ["malaysisch", "Nummernschild"],
		source: {
			Daten: "https://www.wbrnet.info/db/9964.html",
		},
		subgrid: [
			["cl_PlatLesenNumInput", "center"],
			["cl_PlatLesenRegInput", "center"],
			["cl_PlatLesenResult", "center"],
		],
	},
	cl_Iomlaid: {
		userSelected: true,
		contentGroup: "Utility",
		name: "Iomlaid",
		heritage: ["schottisch-gälisch", "Austausch"],
		source: {
			Daten: "https://exchangerate.host",
		},
		subgrid: [
			["cl_IomlaidSelCur", "right"],
			["cl_IomlaidVinCur", "left"],
			["cl_IomlaidTab", "center"],
		],
	},
	cl_SpeechTranslate: {
		userSelected: true,
		contentGroup: "Benkyou",
		name: "Discipuli",
		heritage: ["latein", "Student"],
		subgrid: [
			["cl_SpeechLangSelect", "center"],
			["cl_SpeechVoiceSelect", "center"],
			["cl_SpeechOptions", "center"],
			["cl_SpeechOutputArea", "center"],
		],
	},
	cl_Afinn: {
		userSelected: true,
		contentGroup: "Benkyou",
		name: "Afinn-Analyse",
		source: {
			Daten: "https://github.com/syzer/sentiment-analyser/blob/master/SentiWS.txt",
		},
		info: "Lass einen Text oder einzelne Wörter auf ihre Stimmung hin prüfen! Der schlechteste wert ist -10, der beste ist 10",
		subgrid: [
			["cl_AfinnInput", "right"],
			["cl_AfinnResult", "center"],
			["cl_AfinnProgress", "center", "start"],
			["cl_AfinnNews", "right"],
			["cl_AfinnWiki", "right"],
			["cl_AfinnTabResult", "center"],
		],
	},
	cl_Synonym: {
		userSelected: true,
		contentGroup: "Benkyou",
		name: "Synonym",
		heritage: ["deutsch", "Ersatzwort"],
		source: {
			Daten: "https://www.openthesaurus.de",
		},
		info: "Finde Synonyme für einen Begriff.",
		subgrid: [
			["cl_SynonymInput", "center"],
			["cl_SynonymSearchword", "center"],
			["cl_SynonymTable", "center"],
		],
	},
	cl_BiktadA: {
		userSelected: true,
		contentGroup: "Utility",
		name: "BiktadA",
		heritage: ["schwedisch", "gebeichtet"],
		source: {
			Code: "https://stackoverflow.com/a/5918791",
		},
		info: "Diese Daten sind ohne deine Zustimmung im Browser verfügbar!",
		subgrid: [["cl_BiktadATable", "center"]],
	},
	cl_Boredom: {
		userSelected: true,
		contentGroup: "Utility",
		name: "Boredom",
		heritage: ["englisch", "Langeweile"],
		source: {
			Daten: "https://www.boredapi.com/",
		},
		subgrid: [
			["cl_BoredomStart", "center"],
			["cl_BoredomAnswer", "center"],
		],
	},
	cl_WikiSearch: {
		userSelected: true,
		userStoreDBName: "WikiSearch",
		userStoreDBClear: function () {
			this.userStoreDBData = { tab: null, content: null, image: null };
		},
		get userStoreDBData() {
			return wikiOptions.search;
		},
		set userStoreDBData(data) {
			wikiOptions.search = deepClone(data);
			if (idVin_wikiInput.value == "") {
				if (wikiOptions.search.tab != null) {
					dbID("idVin_wikiInput").placeholder = wikiOptions.search.tab;
					wikiSearchInput(wikiOptions.search.tab);
					if (wikiOptions.search.content) {
						wikiShowSelectedText(wikiOptions.search.content, true);
					}
					if (wikiOptions.search.image) {
						wikiShowSelectedImage(wikiOptions.search.image, true);
					}
				} else if (AccData.data == true) {
					const arr = Object.values(AccData.infos).filter((obj) => {
						return obj.data != null;
					});
					if (arr.length > 0) {
						const autoSearch = randomObject(arr);
						dbID("idVin_wikiInput").placeholder = autoSearch.data;
						wikiSearchInput(autoSearch.data, true);
					}
				}
				clearTable("idTabBody_wikiTitleTable");
			}
		},
		contentGroup: "Benkyou",
		name: "Wiki-Search",
		source: {
			Code: "https://thecodingtrain.com/CodingChallenges/075-wikipedia-api.html",
		},
		subgrid: [
			["cl_WikiInput", "left"],
			["cl_WikiLanguage", "left"],
			["cl_WikiTable", "left"],
			["cl_WikiResultTitle", "left", "center"],
			["cl_WikiResultText", "center"],
			["cl_WikiResultImage", "center"],
		],
	},
	cl_Geometrie: {
		userSelected: true,
		canvas: function () {
			geoResize();
			caGE.redraw();
		},
		contentGroup: "Tools",
		name: "Geometrie",
		subgrid: [
			["cl_GeometrieAreaSelect", "left"],
			["cl_GeometrieAreaInputA", "center"],
			["cl_GeometrieAreaInputB", "center"],
			["cl_GeometrieAreaInputC", "center"],
			["cl_GeometrieOptions", "center"],
			["cl_GeometrieCanvas", "center", "start"],
			["cl_GeometrieTable", "center"],
		],
	},
	cl_Material: {
		userSelected: true,
		logReqUser: true,
		userStoreDBName: "Material",
		userStoreDBClear: function () {
			this.userStoreDBData = [...materialOptions.matListOrig];
		},
		get userStoreDBData() {
			return [...materialOptions.matList];
		},
		set userStoreDBData(data) {
			materialOptions.matList = data;
			materialSelectedTable();
		},
		contentGroup: "Tools",
		name: "Material",
		source: {
			Daten: "https://www.schweizer-fn.de/festigkeit/festigkeitswerte/stahl/stahl_start.php",
		},
		subgrid: [
			["cl_MaterialPropertyCb", "left"],
			["cl_MaterialList", "left"],
			["cl_MaterialSearchOptions", "left"],
			// ["cl_MaterialSearchVin", "left"],
			// ["cl_MaterialSearchSel", "left"],
			// ["cl_MaterialSearchClose", "left"],
			["cl_MaterialSearchList", "left"],
		],
	},
	cl_Expansion: {
		userSelected: true,
		contentGroup: "Tools",
		name: "Expansion",
		heritage: ["englisch", "Ausdehnung"],
		source: {
			Daten: "https://www.schweizer-fn.de/stoff/waermedehnung/waermedehnung.php#stahltabelle",
		},
		subgrid: [
			["cl_ExpansionMaterialsA", "right"],
			["cl_ExpansionMaterialSwitch", "center"],
			["cl_ExpansionMaterialsB", "left"],
			["cl_ExpansionVinLength", "center"],
			["cl_ExpansionVinBaseTemperature", "center"],
			["cl_ExpansionVinTemperature", "center"],
			["cl_ExpansionCBOptions", "center", "center"],
			["cl_ExpansionList", "center"],
		],
	},
	cl_Pattern: {
		userSelected: true,
		logReqUser: true,
		width: 2,
		canvas: function () {
			patternResize();
			drawPattern();
		},
		contentGroup: "Tools",
		name: "Pattern",
		heritage: ["englisch", "Muster"],
		subgrid: [
			["cl_PatternInputA", "center"],
			["cl_PatternInputB", "center"],
			["cl_PatternInputC", "center"],
			["cl_PatternInputD", "center"],
			["cl_PatternInputE", "center"],
			["cl_PatternCanvas", "center"],
		],
	},
	cl_Luas: {
		userSelected: true,
		canvas: function () {
			luasOptions.lastAngle = 0;
			luasResize();
			caLU.redraw();
		},
		contentGroup: "Tools",
		name: "Luas",
		heritage: ["irisch", "Geschwindigkeit"],
		info: "Geschwindigkeiten übersetzen und darstellen",
		subgrid: [
			["cl_LuasVinAngularVin", "left"],
			["cl_LuasVinLinearVin", "left"],
			["cl_LuasOptAngularVin", "left"],
			["cl_LuasOptLinearVin", "left"],
			["cl_LuasResult", "center"],
			["cl_LuasCanvas", "center"],
		],
	},
	cl_Middle: {
		userSelected: true,
		canvas: function () {
			middleResize();
			middleShowCanvas();
		},
		contentGroup: "Tools",
		name: "Mittenberechnung",
		info: "Berechnet mit: (b-a) / 2",
		subgrid: [
			["cl_MiddleInput0", "center"],
			["cl_MiddleInput1", "center"],
			["cl_MiddleMid", "center"],
			["cl_MiddleDiff", "center"],
			["cl_MiddleCanvas", "center"],
		],
	},
	cl_Ranje: {
		userSelected: true,
		contentGroup: "Tools",
		name: "Ranje",
		heritage: ["Haiti-Kreolisch", "anordnen"],
		subgrid: [
			["cl_RanjeInput", "center"],
			["cl_RanjeList", "center"],
		],
	},
	cl_Niska: {
		userSelected: true,
		source: {
			Regelgewinde: "https://de.wikipedia.org/wiki/Metrisches_ISO-Gewinde",
			Feingewinde: "http://gewindenormen.com",
			Berechnung: "https://www.schweizer-fn.de/maschinenelemente/schraube/schraubenverbindung.php",
		},
		contentGroup: "Tools",
		name: "Niska",
		height: 2,
		heritage: ["mazedonisch", "Gewinde"],
		subgrid: [
			["cl_NiskaHeaderInput", "center"],
			["cl_NiskaHeaderSelect", "center"],
			["cl_NiskaSize", "center"],
			["cl_NiskaPitch", "center"],
			["cl_NiskaSelect", "center"],
			["cl_NiskaStrengthClassA", "center"],
			["cl_NiskaStrengthClassB", "center"],
			["cl_NiskaList", "center"],
		],
	},
	cl_Quickmath: {
		userSelected: true,
		contentGroup: "Tools",
		name: "Quickmath",
		subgrid: [
			["cl_QuickmathInput", "center"],
			["cl_QuickmathStart", "center"],
			["cl_QuickmathEnd", "center"],
			["cl_QuickmathListMultiply", "center"],
			["cl_QuickmathListDivide", "center"],
			["cl_QuickmathListPow", "center"],
		],
	},
	cl_Pythagoras: {
		userSelected: true,
		canvas: function () {
			pythoResize();
			pythoCalc();
		},
		contentGroup: "Tools",
		name: "Pythagoras",
		subgrid: [
			["cl_PythagorasInput0", "right"],
			["cl_PythagorasInput1", "right"],
			["cl_PythagorasInput2", "right"],
			["cl_PythagorasInput3", "right"],
			["cl_PythagorasInput4", "right"],
			["cl_PythagorasInfo", "center"],
			["cl_PythagorasCanvas", "left"],
		],
	},
	cl_Pormula: {
		userSelected: true,
		width: 2,
		contentGroup: "Tools",
		name: "Pormula",
		source: {
			Library: "https://github.com/Tom-Alexander/regression-js",
		},
		heritage: ["filipino", "Formel"],
		info: "Gleichung aus Datenpunkten ermitteln.",
		subgrid: [
			["cl_PormulaBestFit", "center"],
			["cl_PormulaTypeSelect", "center"],
			["cl_PormulaPolyFit", "center"],
			["cl_PormulaPrecision", "center"],
			["cl_PormulaOrder", "center"],
			["cl_PormulaInputs", "left"],
			["cl_PormulaAddInputs", "left"],
			["cl_PormulaPointEntry", "center"],
			["cl_PormulaPointResult", "center"],
			["cl_PormulaInfo", "center"],
			["cl_PormulaLblResult", "center"],
			["cl_PormulaAccuracy", "center"],
			["cl_PormulaCanvas", "center"],
		],
	},
	cl_Blechgeometrie: {
		userSelected: true,
		logReqUser: true,
		contentGroup: "Tools",
		name: "Blechgeometrie",
		source: {
			Daten: "https://rime.de/de/wiki/lochabstand-berechnen/",
		},
		subgrid: [
			["cl_BlechgeoVinDicke", "center"],
			["cl_BlechgeoVinRadius", "center"],
			["cl_BlechgeoVinForm", "center"],
			["cl_BlechgeoVinBreite", "center"],
			["cl_BlechgeoLblResult", "center"],
			["cl_BlechgeoImg", "center"],
		],
	},
	cl_Numbery: {
		userSelected: true,
		canvas: function () {
			startNumbery();
		},
		contentGroup: "Games",
		name: "Numbery",
		heritage: ["indonesisch", "nummeriert"],
		source: {
			Amazon: "https://www.iconfinder.com/iconsets/life-of-amazon-outline",
			Camping: "https://www.iconfinder.com/iconsets/camp-2",
			Furniture: "https://www.iconfinder.com/iconsets/furniture-269",
			Sport: "https://www.iconfinder.com/iconsets/sports-android-l-lollipop-icon-pack",
			SeaAnimals: "https://www.iconfinder.com/iconsets/under-the-sea-7",
			Zoo: "https://www.iconfinder.com/iconsets/zoo-line-welcome-to-zootopia",
		},
		info: "Klassisches Memory!",
		subgrid: [
			["cl_NumberyInputs", "left"],
			["cl_NumberyPlayers", "left"],
			["cl_NumberyPairs", "left"],
			["cl_NumberyCathegory", "left"],
			["cl_NumberyPlayerNum", "left"],
			["cl_NumberyResult", "left"],
			["cl_NumberyImages", "center", "center"],
		],
	},
	cl_Beatmachine: {
		userSelected: true,
		width: 2,
		contentGroup: "Games",
		name: "Beatmachine",
		heritage: ["englisch", "Rhythmusmaschine"],
		info: "Drumpattern im klassischen Stil erstellen",
		subgrid: [
			["cl_BeatmachineOptionsA", "left"],
			["cl_BeatmachineOptionsB", "left"],
			["cl_BeatmachineOptionsC", "left"],
			["cl_BeatmachineOptionsD", "left"],
			["cl_BeatmachineTracks", "left"],
		],
	},
	cl_Linaha: {
		userSelected: true,
		contentGroup: "Games",
		name: "Linaha",
		heritage: ["sesotho", "Länder"],
		source: {
			Daten: "https://restcountries.com/",
		},
		info: "Erweitere dein Wissen in Geographie!",
		subgrid: [
			["cl_LinahaOptionsA", "center"],
			["cl_LinahaOptionsB", "left"],
			["cl_LinahaOptionsC", "left"],
			["cl_LinahaOptionsStart", "left", "center"],
			["cl_LinahaQuestion", "center"],
			["cl_LinahaRounds", "right"],
			["cl_LinahaScore", "right"],
			["cl_LinahaMap", "left", "center"],
			["cl_LinahaAnswers", "center"],
		],
	},
	cl_Ibhaluni: {
		userSelected: true,
		height: 2,
		canvas: function () {
			ibhalumiResize();
			caIB.redraw();
		},
		contentGroup: "Games",
		name: "Ibhaluni",
		heritage: ["zulu", "Ballon"],
		source: {
			Hintergrundbild: "https://opengameart.org/content/flappy-bird-background",
		},
		info: "Plopp die Ballons!",
		subgrid: [
			["cl_IbhaluniInputs", "center"],
			["cl_IbhaluniCanvas", "center"],
		],
	},
	cl_Sudoku: {
		userSelected: true,
		width: 2,
		height: 2,
		canvas: function () {
			sudokuResize();
			caSU.redraw();
		},
		contentGroup: "Games",
		name: "Sudoku",
		source: {
			Code: "https://github.com/boggan/js-sudoku-generator#readme",
			Puzzels: "https://www.kaggle.com/bryanpark/sudoku",
		},
		info: "Klassisches Sudoku-Puzzle.<br>Durch Eingabe einer Zahl mittels Tastatur kannst du die Zahl eintragen. Durch drücken der Leertaste kannst du die Eingabeart direkt wechseln. Mit SHIFT kannst du mehere Zellen gleichzeitig auswählen.",
		subgrid: [
			["cl_SudokuGetBoard", "center"],
			["cl_SudokuTimer", "left"],
			["cl_SudokuOptionsA", "left"],
			["cl_SudokuOptionsB", "left"],
			["cl_SudokuOptionsC", "left"],
			["cl_SudokuInput", "left"],
			["cl_SudokuOverview", "left", "start"],
			["cl_SudokuCanvas", "center"],
		],
	},
	cl_Lotto: {
		userSelected: true,
		logReqUser: false,
		userStoreDBName: "Lotto",
		userStoreDBClear: function () {
			this.userStoreDBData = {
				startup: true,
				Eurojackpot: {
					tips: [],
					star: [],
					date: null,
				},
				"6aus49": {
					tips: [],
					star: [],
					date: null,
				},
			};
		},
		get userStoreDBData() {
			let retData = {};
			for (const [key, values] of Object.entries(lottoOptions.games)) {
				retData[key] = {};
				retData[key]["tips"] = values.savedSet.tips;
				retData[key]["star"] = values.savedSet.star;
				retData[key]["date"] = values.savedSet.date;
			}
			return retData;
		},
		set userStoreDBData(data) {
			dbCLStyle("cl_LottoSavedGame").display = "initial";
			for (const [key, values] of Object.entries(lottoOptions.games)) {
				if (data[key] != null && data[key] != "") {
					lottoOptions.games[key].savedSet["tips"] = data[key].date != null ? [...data[key].tips] : [];
					lottoOptions.games[key].savedSet["star"] = data[key].date != null ? [...data[key].star] : [];
					lottoOptions.games[key].savedSet["date"] = data[key].date != null ? data[key].date : null;
				}
			}
			if (!data.startup) {
				lottoUpdateSavegames();
			}
			lottoOptions.randomiziation = 0;
			clearTimeout(lottoOptions.randomTimeout);
			createLotto(false);
		},
		width: 2,
		canvas: function () {
			lottoResize();
			caLO.redraw();
		},
		contentGroup: "Games",
		name: "Lotto",
		source: {
			Zahlen: "https://github.com/JohannesFriedrich/LottoNumberArchive",
			Daten: "https://www.npmjs.com/package/norsk-tipping",
		},
		info: "Lotto / Eurojackpot",
		subgrid: [
			["cl_LottoOptionsA", "center"],
			["cl_LottoOptionsB", "center"],
			["cl_LottoSavedGame", "center"],
			["cl_LottoGetGames", "center"],
			["cl_LottoTabGames", "center"],
			["cl_LottoCanvas", "center"],
			["cl_LottoOverview", "center"],
		],
	},
	cl_RayCaster: {
		userSelected: true,
		width: 2,
		height: 2,
		canvas: function () {
			raycasterResize();
			caRC.redraw();
		},
		contentGroup: "Games",
		name: "RayCaster",
		source: {
			Code1: "https://ncase.me/sight-and-light/",
			Code2: "https://thecodingtrain.com/CodingChallenges/010.4-maze-dfs-p5.html",
		},
		info: 'Du bist der "blaue" und willst den grünen Punkt erreichen. Bewegen kannst du dich mit den Pfeiltasten. Drücke "x" um deine aktuelle Position zu markieren. Aber beachte: du hast nur 5 Markierungen!',
		subgrid: [
			["cl_RayCasterInputs", "left"],
			["cl_RayCasterSpeed", "left"],
			["cl_RayCasterSize", "left"],
			["cl_RayCasterView", "left"],
			["cl_RayCasterOptionsA", "left"],
			["cl_RayCasterOptionsB", "left"],
			["cl_RayCasterOptionsC", "left"],
			["cl_RayCasterOptionsD", "left"],
			["cl_RayCasterCanvas", "center"],
		],
	},
	cl_Empat: {
		userSelected: true,
		height: 2,
		canvas: function () {
			empatResize();
			caEM.redraw();
		},
		contentGroup: "Games",
		name: "Sambung Empat",
		heritage: ["malaysisch", "verbinde vier"],
		info: 'Klassisches 4-Gewinnt!Benutze die Maus, die Pfeiltasten oder die Zifferntasten zum bewegen. Mit "Enter" oder "Space" lässt sich ein Stein legen.',
		subgrid: [
			["cl_EmpatInputs", "center"],
			["cl_EmpatCanvas", "center"],
		],
	},
	cl_Sweeper: {
		userSelected: true,
		width: 2,
		height: 2,
		canvas: function () {
			sweeperResize();
			caSW.redraw();
		},
		contentGroup: "Games",
		name: "Sweeper",
		heritage: ["englisch", "Kehrmaschine"],
		source: {
			Code: "https://thecodingtrain.com/CodingChallenges/071-minesweeper.html",
		},
		info: "Klassisches Mine-Sweeper!",
		subgrid: [
			["cl_SweeperCanvas", "center"],
			["cl_SweeperInputs", "center"],
			["cl_SweeperGrid", "center"],
			["cl_SweeperSweeps", "center"],
		],
	},
	cl_GeneralSettings: {
		userSelected: true,
		userStoreDBName: "GeneralSettings",
		userStoreDBClear: function () {
			this.userStoreDBData = {
				copyClick: true,
				copySeparator: true,
				decimals: 4,
				fontSize: 12,
				clear: true,
			};
		},
		get userStoreDBData() {
			return globalValues.settings;
		},
		set userStoreDBData(data) {
			const clear = data.hasOwnProperty("clear");
			for (const key of Object.keys(globalValues.settings)) {
				if (key == "clear") continue;
				globalValues.settings[key] = data[key];
			}
			//call functions without arg to toggle secific functionality
			if (!clear) {
				settingsCopyClick();
				settingsCopySeparator();
				settingsFontsize();
				settingsDecimals();
			}
		},
		contentGroup: "GlobalSettings",
		name: "General-Settings",
		subgrid: [
			["cl_SettingsCopyClick", "left"],
			["cl_SettingsFontsize", "left"],
			["cl_SettingsCopySeparator", "left"],
			["cl_SettingsDecimals", "left"],
		],
	},
	cl_ColorSettings: {
		userSelected: true,
		userStoreDBName: "ColorSettings",
		userStoreDBClear: function () {
			this.userStoreDBData = null;
		},
		get userStoreDBData() {
			return {
				lightmode: deepClone(globalValues.colors.lightmode),
				darkmode: deepClone(globalValues.colors.darkmode),
			};
		},
		set userStoreDBData(data) {
			if (data == null) {
				globalValues.colors.lightmode = deepClone(globalValues.colors.colorSettingsOrig.lightmode);
				globalValues.colors.darkmode = deepClone(globalValues.colors.colorSettingsOrig.darkmode);
				return;
			}
			globalValues.colors.lightmode = deepClone(data.lightmode);
			globalValues.colors.darkmode = deepClone(data.darkmode);
			displayColorSystem();
			populateColorSelector();
		},
		contentGroup: "GlobalSettings",
		name: "Color-Settings",
		subgrid: [
			["cl_ColourSettingsHeaderLight", "center"],
			["cl_ColourSettingsHeaderDark", "center", "end"],
			["cl_ColourSettings_light_0", "center"],
			["cl_ColourSettings_light_1", "center"],
			["cl_ColourSettings_light_2", "center"],
			["cl_ColourSettings_dark_0", "center"],
			["cl_ColourSettings_dark_1", "center"],
			["cl_ColourSettings_dark_2", "center"],
		],
	},
	cl_UserGridLayout: {
		userSelected: true,
		userStoreDBName: "UserGridLayout",
		userStoreDBClear: function () {
			this.userStoreDBData = [];
		},
		get userStoreDBData() {
			return usergridOptions.generateArray();
		},
		set userStoreDBData(data) {
			contentLayout.navContent.User = data.filter((cl) => {
				return Object.keys(contentGrid).includes(cl);
			});
			for (const gridName of contentLayout.navContent.Universe) {
				contentGrid[gridName].userSelected = contentLayout.navContent.User.includes(gridName); //safety, if old things in Database!
			}
			usergridCreateTable();
			usergridOptions.checkAllGroups();
		},
		height: 2,
		contentGroup: "GlobalSettings",
		name: "User-Layout",
		subgrid: [
			["cl_UserGridOptions", "center"],
			["cl_UserGridTable", "center"],
			// ["cl_UserGridCanvas", "center"],
		],
	},
	cl_MaterialFilterSettings: {
		userSelected: true,
		userStoreDBName: "MaterialFilterSettings",
		userStoreDBClear: function () {
			this.userStoreDBData = [...materialFilterOptions.listOrig];
		},
		get userStoreDBData() {
			return [...materialFilterOptions.select];
		},
		set userStoreDBData(data) {
			let filteredWrong = [];
			materialFilterOptions.select = [];
			for (const dataPoint of data) {
				if (Object.keys(Data_Material.metadata).includes(dataPoint)) {
					materialFilterOptions.select.push(dataPoint);
				} else {
					filteredWrong.push(dataPoint);
				}
			}
			if (filteredWrong.length > 0) console.log("The following Filters are no longer supported:", filteredWrong);
			materialFilterBuildTable();
			materialFilterUpdateCB();
			// materialSelectedTable();
		},
		height: 2,
		contentGroup: "GlobalSettings",
		name: "Materialfilter",
		subgrid: [["cl_MaterialFilterTable", "center"]],
	},
};

const contentFooter = [
	["Icons", "https://www.iconfinder.com/iconsets/feather-2"],
	["Canvas-Library", "https://p5js.org/"],
	["Charts", "http://chartJS.org"],
	["Date-Picker", "https://github.com/Pikaday/Pikaday"],
	["Inspirations", "https://thecodingtrain.com/"],
	["Color calculations", "https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color/3943023#3943023"],
	["Color calculations", "https://www.html-code-generator.com/javascript/color-converter-script"],
];
