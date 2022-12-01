const contentGrid = {
	cl_Howa: {
		enableUser: true,
		userStoreDB: "Howa",
		width: 2,
		canvas: () => {
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
	cl_Sepakbola: {
		enableUser: false,
		height: 2,
		canvas: () => {
			return;
		},
		contentGroup: "News",
		name: "Sepakbola",
		heritage: ["javanisch", "Fußball"],
		source: {
			Daten: "https://www.openligadb.de",
		},
		subgrid: [
			["cl_SepakbolaInputLigaLbl", "center"],
			["cl_SepakbolaInputLigaSel", "center"],
			["cl_SepakbolaInputSeasonLbl", "center"],
			["cl_SepakbolaInputSeasonSel", "center"],
			["cl_SepakbolaInputDayLbl", "center"],
			["cl_SepakbolaInputDaySel", "center"],
			["cl_SepakbolaTable", "right"],
			["cl_SepakbolaMatches", "left"],
		],
	},
	cl_Covid: {
		enableUser: true,
		userStoreDB: "Covid",
		height: 2,
		canvas: () => {
			covidRefreshGraph();
			covidColorGraph();
		},
		contentGroup: "News",
		name: "Covid-19",
		source: {
			Daten: "https://github.com/pomber/covid19",
		},
		info: "Aktuelle Infos zur Covid-19-Ausbreitung",
		subgrid: [
			["cl_CovidTable", "center"],
			["cl_covidConfirmed", "right"],
			["cl_covidDeaths", "left"],
			["cl_CovidGraphOptionsA", "center"],
			["cl_CovidGraphOptionsB", "center"],
			["cl_CovidGraphOptionsC", "center"],
			["cl_CovidGraph", "center"],
			["cl_CovidGraphDate", "center"],
			["cl_CovidGraphDateA", "right"],
			["cl_CovidGraphDateB", "left"],
			["cl_CovidTableShow", "center"],
		],
	},
	cl_News: {
		enableUser: true,
		canvas: () => {
			return;
		},
		contentGroup: "News",
		name: "News",
		heritage: ["englisch", "Nachrichten"],
		source: {
			Daten: "https://newsapi.org",
		},
		subgrid: [
			["cl_NewsNav", "left"],
			["cl_NewsNum", "left"],
			["cl_NewsCategory", "left"],
			["cl_NewsCountry", "left"],
			["cl_NewsTable", "left"],
			["cl_NewsResultTitle", "left", "center"],
			["cl_NewsResultText", "center"],
			["cl_NewsResultImage", "center"],
		],
	},

  cl_Lions: {
    enableUser: true,
    userStoreDB: "Lions",
    canvas: () => {
      return
    },
    contentGroup: "News",
    name: "Lions",
    heritage: ["englisch", "Löwen"],
    source: {
      Daten: "https://hirsau.lions.de/"
    },
    info: "Gewinner des Lions-Advendskalender 2021 - Edition Nagold",
    subgrid: [
      ["cl_LionsInput", "right", "center"],
      ["cl_LionsOutput", "left"],
      ["cl_LionsTable", "center"]
    ]
  },
	cl_PostillonTicker: {
		enableUser: true,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		userStoreDB: "Tugas",
		canvas: () => {
			return;
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
		enableUser: true,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		canvas: () => {
			return;
		},
		contentGroup: "Utility",
		name: "Kounselor",
		heritage: ["jiddisch", "Ratgeber"],
		subgrid: [
			["cl_KounselorOptionsA", "left"],
			["cl_KounselorOptionsB", "left"],
			["cl_KounselorOptionsC", "left"],
			["cl_KounselorOptionsD", "left"],
			["cl_KounselorOptionsE", "left"],
			["cl_KounselorOutputA", "right", "center"],
			["cl_KounselorOutputB", "right", "center"],
		],
	},
	cl_Kaihanga: {
		enableUser: true,
		canvas: () => {
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
			["cl_KaihangaInput", "left"],
			["cl_KaihangaSegments", "left"],
			["cl_KaihangaResult", "center"],
			["cl_KaihangaCanvas", "center"],
		],
	},
	cl_Botanicals: {
		enableUser: true,
		canvas: () => {
			return;
		},
		contentGroup: "Utility",
		name: "Botanicals",
		heritage: ["englisch", "botanisch"],
		source: {
			Daten: "https://www.tabelle.info/kraeuter.html",
		},
		subgrid: [
			["cl_botanicalsVinPlant", "center"],
			["cl_botanicalsVinDiscomfort", "center"],
			["cl_botanicalsLblTitlePlant", "center"],
			["cl_botanicalsLblTitleDiscomfort", "center"],
			["cl_botanicalsTabResultPlant", "center"],
			["cl_botanicalsTabResultDiscomfort", "center"],
		],
	},
	cl_PlatLesen: {
		enableUser: true,
		canvas: () => {
			return;
		},
		contentGroup: "Utility",
		name: "PlatLesen",
		heritage: ["malaysisch", "Nummernschild"],
		source: {
			Daten: "https://www.wbrnet.info/db/9964.html",
		},
		subgrid: [
			["cl_platLesenNumInput", "center"],
			["cl_platLesenNumResult", "center"],
			["cl_platLesenRegInput", "center"],
			["cl_platLesenRegResult", "center"],
		],
	},
	cl_Iomlaid: {
		enableUser: true,
		canvas: () => {
			return;
		},
		contentGroup: "Utility",
		name: "Iomlaid",
		heritage: ["schottisch-gälisch", "Austausch"],
		source: {
			Daten: "https://exchangerate.host",
		},
		subgrid: [
			["cl_iomlaidVinCur", "center"],
			["cl_iomlaidSelCur", "right"],
			["cl_iomlaidSelDate", "left"],
			["cl_iomlaidTab", "center"],
		],
	},
	cl_SpeechTranslate: {
		enableUser: true,
		canvas: () => {
			return;
		},
		contentGroup: "Benkyou",
		name: "Discipuli",
		heritage: ["latein", "Student"],
		subgrid: [
			["cl_speechLangSelect", "center"],
			["cl_speechVoiceSelect", "center"],
			["cl_speechOptions", "center"],
			["cl_speechOutputArea", "center"],
		],
	},
	cl_Afinn: {
		enableUser: true,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		userStoreDB: "WikiSearch",
		canvas: () => {
			return;
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
		enableUser: true,
		canvas: () => {
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
		enableUser: true,
		logReqUser: true,
		userStoreDB: "Material",
		canvas: () => {
			return;
		},
		contentGroup: "Tools",
		name: "Material",
		source: {
			Daten: "https://www.schweizer-fn.de/festigkeit/festigkeitswerte/stahl/stahl_start.php",
		},
		subgrid: [
			["cl_MaterialPropertyCb", "left"],
			["cl_MaterialAdd", "left"],
			["cl_MaterialList", "left"],
			["cl_MaterialSearchVin", "left"],
			["cl_MaterialSearchSel", "left"],
			["cl_MaterialSearchClose", "left"],
			["cl_MaterialSearchList", "left"],
		],
	},
	cl_Expansion: {
		enableUser: true,
		canvas: () => {
			return;
		},
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
			["cl_ExpansionVinLength", "right"],
			["cl_ExpansionVinBaseTemperature", "right"],
			["cl_ExpansionVinTemperature", "right"],
			["cl_ExpansionCBDifference", "left"],
			["cl_ExpansionCBCoefficient", "left"],
			["cl_ExpansionList", "center"],
		],
	},
	cl_Pattern: {
		enableUser: true,
		logReqUser: true,
		canvas: () => {
			drawPattern();
		},
		contentGroup: "Tools",
		name: "Pattern",
		heritage: ["englisch", "Muster"],
		subgrid: [
			["cl_PatternInputA", "left"],
			["cl_PatternInputB", "left"],
			["cl_PatternInputC", "left"],
			["cl_PatternInputD", "left"],
			["cl_PatternInputE", "left"],
			// ["cl_PatternList", "right"],
			["cl_PatternCanvas", "center"],
		],
	},
	cl_Luas: {
		enableUser: true,
		canvas: () => {
			luasOptions.lastAngle = 0;
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
		enableUser: true,
		canvas: () => {
			showMiddleCanvas();
		},
		contentGroup: "Tools",
		name: "Mittenberechnung",
		info: "Berechnet mit: (b-a) / 2",
		subgrid: [
			["cl_MiddleInput0", "center"],
			["cl_MiddleInput1", "center"],
			["cl_MiddleMid", "right"],
			["cl_MiddleDiff", "left"],
			["cl_MiddleCanvas", "center"],
		],
	},
	cl_Ranje: {
		enableUser: true,
		canvas: () => {
			return;
		},
		contentGroup: "Tools",
		name: "Ranje",
		heritage: ["Haiti-Kreolisch", "anordnen"],
		subgrid: [
			["cl_ranjeInput", "center"],
			["cl_ranjeList", "center"],
		],
	},
	cl_Niska: {
		enableUser: true,
		canvas: () => {
			return;
		},
		source: {
			Regelgewinde: "https://de.wikipedia.org/wiki/Metrisches_ISO-Gewinde",
			Feingewinde: "http://gewindenormen.com",
			Berechnung: "https://www.schweizer-fn.de/maschinenelemente/schraube/schraubenverbindung.php",
		},
		contentGroup: "Tools",
		name: "Niska",
		heritage: ["mazedonisch", "Gewinde"],
		subgrid: [
			["cl_niskaHeaderInput", "center"],
			["cl_niskaHeaderSelect", "center"],
			["cl_niskaSize", "center"],
			["cl_niskaPitch", "center"],
			["cl_niskaSelect", "center"],
			["cl_niskaStrengthClass", "center"],
			["cl_niskaList", "center"],
		],
	},
	cl_Quickmath: {
		enableUser: true,
		width: 2,
		canvas: () => {
			return;
		},
		contentGroup: "Tools",
		name: "Quickmath",
		subgrid: [
			["cl_quickmathInput", "right"],
			["cl_quickmathStart", "center"],
			["cl_quickmathEnd", "left"],
			["cl_quickmathListMultiply", "center"],
			["cl_quickmathListDivide", "center"],
			["cl_quickmathListPow", "center"],
			["cl_quickmathListRoot", "center"],
		],
	},
	cl_Pythagoras: {
		enableUser: true,
		canvas: () => {
			calcPytho();
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
		enableUser: true,
		width: 2,
		canvas: () => {
			pormulaCalculate();
		},
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
		enableUser: true,
		logReqUser: true,
		canvas: () => {
			return;
		},
		contentGroup: "Tools",
		name: "Blechgeometrie",
		source: {
			Daten: "https://rime.de/de/wiki/lochabstand-berechnen/",
		},
		subgrid: [
			["cl_BlechgeoVinDicke", "right"],
			["cl_BlechgeoVinRadius", "right"],
			["cl_BlechgeoVinForm", "right"],
			["cl_BlechgeoVinBreite", "right"],
			["cl_BlechgeoLblResult", "center"],
			["cl_BlechgeoImg", "left"],
		],
	},
	cl_Numbery: {
		enableUser: true,
		width: 2,
		height: 2,
		canvas: () => {
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
			["cl_NumberyInputs", "center"],
			["cl_NumberyPlayers", "right"],
			["cl_NumberyPairs", "right"],
			["cl_NumberyCathegory", "right"],
			["cl_NumberyPlayerNum", "right"],
			["cl_NumberyResult", "center"],
			["cl_NumberyImages", "center"],
		],
	},
	cl_Ocjene: {
		enableUser: true,
		width: 2,
		height: 1,
		canvas: () => {
			return;
		},
		contentGroup: "Games",
		name: "Ocjene",
		heritage: ["bosnisch", "Noten"],
		source: {
			Library: "https://paulrosen.github.io/abcjs/",
		},
		info: "Notenleseübung mit zufälligen Melodien",
		subgrid: [
			["cl_OcjeneSheet", "right"],
			["cl_OcjeneSongHeader", "left", "end"],
			["cl_OcjeneRhytmusHeader", "left", "end"],
			["cl_OcjeneInstrumentHeader", "left", "end"],
			["cl_OcjeneMelodieHeader", "left", "end"],
			["cl_OcjeneNotenwert1", "left"],
			["cl_OcjeneNotenwert2", "left"],
			["cl_OcjeneNotenwert4", "left"],
			["cl_OcjeneNotenwert8", "left"],
			["cl_OcjeneNotenwert16", "left"],
			["cl_OcjeneDotted", "left"],
			["cl_OcjeneTriplet", "left"],
			["cl_OcjeneShowText", "left"],
			["cl_OcjeneGermanText", "left"],
			["cl_OcjeneInstrument", "left"],
			["cl_OcjeneInterval", "left"],
			["cl_OcjeneOctave", "left"],
			["cl_OcjeneClefs", "left"],
			["cl_OcjeneKeySignature", "left"],
			["cl_OcjeneKey", "left"],
			["cl_OcjeneKeyOnly", "left"],
			["cl_OcjeneTimeSignature", "left"],
			["cl_OcjeneTempo", "left"],
			["cl_OcjeneBars", "left"],
			["cl_OcjeneLimitRange", "left"],
			["cl_OcjeneRestsProbability", "left"],
			["cl_OcjeneGenerate", "left", "end"],
			["cl_OcjeneRandomA", "left"],
			["cl_OcjeneRandomB", "left"],
			["cl_OcjeneRandomC", "left"],
		],
	},
	cl_Linaha: {
		enableUser: true,
		height: 2,
		canvas: () => {
			return;
		},
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
		enableUser: true,
		height: 2,
		canvas: () => {
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
		enableUser: true,
		width: 2,
		height: 2,
		canvas: () => {
			caSU.redraw();
		},
		contentGroup: "Games",
		name: "Sudoku",
		source: {
			Code: "https://github.com/boggan/js-sudoku-generator#readme",
			Puzzels: "https://www.kaggle.com/bryanpark/sudoku",
		},
		info: "Klassisches Sudoku-Puzzle.<br>Durch Eingabe einer Zahl mittels Tastatur kannst du die Zahl eintragen. Durch drücken der Leertaste kannst du die Eingabeart direkt wechseln.",
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
		enableUser: true,
		logReqUser: false,
		userStoreDB: "Lotto",
		width: 2,
		canvas: () => {
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
			["cl_LottoOptions", "center"],
			["cl_LottoSavedGame", "center"],
			["cl_LottoGetGames", "center"],
			["cl_LottoTabGames", "center"],
			["cl_LottoCanvas", "center"],
			["cl_LottoOverview", "center"],
		],
	},
	cl_RayCaster: {
		enableUser: true,
		width: 2,
		height: 2,
		canvas: () => {
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
			["cl_RayCasterInputs", "center"],
			["cl_RayCasterSpeed", "left"],
			["cl_RayCasterSize", "left"],
			["cl_RayCasterView", "left"],
			["cl_RayCasterOptions", "left"],
			["cl_RayCasterCanvas", "center"],
		],
	},
	cl_Empat: {
		enableUser: true,
		height: 2,
		canvas: () => {
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
		enableUser: true,
		width: 2,
		height: 2,
		canvas: () => {
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
			["cl_SweeperGrid", "left"],
			["cl_SweeperSweeps", "left"],
		],
	},
	cl_GeneralSettings: {
		enableUser: true,
		userStoreDB: "GeneralSettings",
		canvas: () => {
			return;
		},
		contentGroup: "GlobalSettings",
		name: "General-Settings",
		subgrid: [
			["cl_SettingsCopyClick", "left"],
			["cl_SettingsCopySeparator", "left"],
			["cl_SettingsFontsize", "left"],
			["cl_SettingsDecimals", "left"],
		],
	},
	cl_ColorSettings: {
		enableUser: true,
		userStoreDB: "ColorSettings",
		canvas: () => {
			return;
		},
		contentGroup: "GlobalSettings",
		name: "Color-Settings",
		subgrid: [
			["cl_colourSettings_0", "right"],
			["cl_colourSettings_1", "right"],
			["cl_colourSettings_2", "right"],
		],
	},
	cl_UserGridLayout: {
		enableUser: true,
		userStoreDB: "UserGridLayout",
		height: 2,
		canvas: () => {
			return;
		},
		contentGroup: "GlobalSettings",
		name: "User-Layout",
		subgrid: [
			// ["cl_UserGridCanvas", "right"],
			["cl_UserGridBtnToggle", "left"],
			["cl_UserGridBtnSave", "left"],
			["cl_UserGridTable", "right"],
		],
	},
	cl_MaterialFilterSettings: {
		enableUser: true,
		userStoreDB: "MaterialFilterSettings",
		height: 2,
		canvas: () => {
			return;
		},
		contentGroup: "GlobalSettings",
		name: "Materialfilter",
		subgrid: [["cl_MaterialFilterTable", "center"]],
	},
	cl_userAcc: {
		enableUser: true,
		userStoreDB: "userAcc",
		width: 0,
		canvas: () => {
			return;
		},
		contentGroup: "AccountSettings",
		name: "Account-Settings",
		subgrid: [
			["cl_userAcc_infos", "left"],
			["cl_userAcc_mail", "left"],
			["cl_userAcc_pass", "left"],
			["cl_userAcc_submit", "left"],
			["cl_userAcc_check", "left"],
			["cl_userAcc_alert", "left"],
		],
	},
};

const contentFooter = [
	["Icons", "https://www.iconfinder.com/iconsets/feather-2"],
	["Font", "https://github.com/weiweihuanghuang/Work-Sans"],
	["Canvas-Library", "https://p5js.org/"],
	["Charts", "http://chartJS.org"],
	["Date-Picker", "https://github.com/Pikaday/Pikaday"],
	["Inspirations", "https://thecodingtrain.com/"],
	[
		"Color calculations",
		"https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color/3943023#3943023",
	],
	["Color calculations", "https://www.html-code-generator.com/javascript/color-converter-script"],
];
