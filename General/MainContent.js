export const contentGroups = ["Global-Settings", "Account-Settings", "News", "Benkyou", "Utility", "Tools", "Games"];
export const contentGroupsNav = ["Universe", "News", "Benkyou", "Utility", "Tools", "Games", "User"];
export const contentGroupsMaincontent = ["News", "Benkyou", "Utility", "Tools", "Games"];
export const rawContentGrid = {
	//Benkyou
	cl_Analysis: {
		contentGroup: "Benkyou",
		name: "Analysis",
		source: {
			Daten: "https://github.com/syzer/sentiment-analyser/blob/master/SentiWS.txt",
		},
		info: "Lass einen Text oder einzelne Wörter auf ihre Stimmung hin prüfen! Der schlechteste wert ist -100, der beste ist 100",
		size: [2, 1],
		maingrid: {
			areas: [
				//
				["cl_AnalysisInput", "cl_AnalysisResult"],
				["cl_AnalysisInput", "cl_AnalysisProgress"],
				["cl_AnalysisWiki", "cl_AnalysisTabResult"],
			],
			rows: [0, 0],
		},
		subgrid: [
			["cl_AnalysisInput", "right"],
			["cl_AnalysisResult", "center"],
			["cl_AnalysisProgress", "center", "start"],
			["cl_AnalysisWiki", "right"],
			["cl_AnalysisTabResult", "center"],
		],
	},
	cl_Barvoslepy: {
		contentGroup: "Benkyou",
		name: "Barvoslepy",
		heritage: ["tschechisch", "Farbenblind"],
		source: {
			Code: "https://github.com/MaPePeR/jsColorblindSimulator",
		},
		size: [2, 2],
		maingrid: {
			areas: [
				["cl_BarvoslepyUpload", "cl_BarvoslepyOriginal"],
				["cl_BarvoslepySelectImage", "cl_BarvoslepyPositive"],
				["cl_BarvoslepySelectWeakness", "cl_BarvoslepyNegative"],
				["cl_BarvoslepySeverity", "cl_BarvoslepyWhite"],
				["cl_BarvoslepyEpsilon", "cl_BarvoslepyBlack"],
				["cl_BarvoslepyOverview", "cl_BarvoslepyOverview"],
				["cl_BarvoslepyCanvas", "cl_BarvoslepyCanvas"],
			],
			rows: [1, 1, 1, 1, 1, 1],
		},
		subgrid: [
			["cl_BarvoslepyUpload", "right"],
			["cl_BarvoslepySelectImage", "right"],
			["cl_BarvoslepySelectWeakness", "right"],
			["cl_BarvoslepySeverity", "right"],
			["cl_BarvoslepyEpsilon", "right"],
			["cl_BarvoslepyOriginal", "left"],
			["cl_BarvoslepyPositive", "left"],
			["cl_BarvoslepyNegative", "left"],
			["cl_BarvoslepyWhite", "left"],
			["cl_BarvoslepyBlack", "left"],
			["cl_BarvoslepyOverview", "center"],
			["cl_BarvoslepyCanvas", "center", "start"],
		],
	},
	cl_Speech: {
		deactivated: true,
		contentGroup: "Benkyou",
		name: "Speech",
		heritage: ["englisch", "Sprache"],
		size: [2, 1],
		maingrid: {
			areas: [["cl_SpeechLangSelect"], ["cl_SpeechVoiceSelect"], ["cl_SpeechOutputArea"]],
			rows: [1, 1],
		},
		subgrid: [
			["cl_SpeechLangSelect", "center"],
			["cl_SpeechVoiceSelect", "center"],
			["cl_SpeechOutputArea", "center"],
		],
	},
	cl_Synonym: {
		contentGroup: "Benkyou",
		name: "Synonym",
		heritage: ["deutsch", "Ersatzwort"],
		source: {
			Daten: "https://www.openthesaurus.de",
		},
		info: "Finde Synonyme für einen Begriff.",
		size: [1, 2],
		maingrid: {
			areas: [["cl_SynonymInput"], ["cl_SynonymSearchword"], ["cl_SynonymTable"]],
			rows: [1, 1],
		},
		subgrid: [
			["cl_SynonymInput", "center"],
			["cl_SynonymSearchword", "center"],
			["cl_SynonymTable", "center"],
		],
	},
	cl_WikiSearch: {
		contentGroup: "Benkyou",
		name: "Wiki-Search",
		source: {
			Code: "https://thecodingtrain.com/CodingChallenges/075-wikipedia-api.html",
		},
		size: [2, 1],
		maingrid: {
			areas: [
				//
				["cl_WikiInput", "cl_WikiResultImage", "cl_WikiResultTitle"],
				["cl_WikiLanguage", "cl_WikiResultImage", "cl_WikiResultTitle"],
				["cl_WikiTable", "cl_WikiResultText", "cl_WikiResultText"],
			],
			rows: [1, 0],
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
	//Games
	cl_Beatmachine: {
		deactivated: true,
		contentGroup: "Games",
		name: "Beatmachine",
		heritage: ["englisch", "Rhythmusmaschine"],
		info: "Drumpattern im klassischen Stil erstellen",
		size: [2, 1],
		maingrid: {
			areas: [
				//
				["cl_BeatmachineOptionsA", "cl_BeatmachineOptionsB"],
				["cl_BeatmachineOptionsC", "cl_BeatmachineOptionsD"],
				["cl_BeatmachineTracks", "cl_BeatmachineTracks"],
			],
			rows: [1, 1],
		},
		subgrid: [
			["cl_BeatmachineOptionsA", "left"],
			["cl_BeatmachineOptionsB", "left"],
			["cl_BeatmachineOptionsC", "left"],
			["cl_BeatmachineOptionsD", "left"],
			["cl_BeatmachineTracks", "left"],
		],
	},
	cl_Empat: {
		contentGroup: "Games",
		name: "Sambung Empat",
		heritage: ["malaysisch", "verbinde vier"],
		info: 'Klassisches 4-Gewinnt!Benutze die Maus, die Pfeiltasten oder die Zifferntasten zum bewegen. Mit "Enter" oder "Space" lässt sich ein Stein legen.',
		size: [2, 2],
		maingrid: {
			areas: [
				//
				["cl_EmpatInputs"],
				["cl_EmpatCanvas"],
			],
			rows: [1],
		},
		subgrid: [
			["cl_EmpatInputs", "center"],
			["cl_EmpatCanvas", "center"],
		],
	},
	cl_Ibhaluni: {
		contentGroup: "Games",
		name: "Ibhaluni",
		heritage: ["zulu", "Ballon"],
		source: {
			Hintergrundbild: "https://opengameart.org/content/flappy-bird-background",
		},
		info: "Plopp die Ballons!",
		size: [2, 2],
		maingrid: {
			areas: [
				//
				["cl_IbhaluniInputs"],
				["cl_IbhaluniCanvas"],
			],
			rows: [1],
		},
		subgrid: [
			["cl_IbhaluniInputs", "center"],
			["cl_IbhaluniCanvas", "center"],
		],
	},
	cl_Linaha: {
		contentGroup: "Games",
		name: "Linaha",
		heritage: ["sesotho", "Länder"],
		source: {
			Daten: "https://restcountries.com/",
		},
		info: "Erweitere dein Wissen in Geographie!",
		size: [2, 2],
		maingrid: {
			areas: [
				//
				["cl_LinahaOptionsA", "cl_LinahaOptionsA"],
				["cl_LinahaOptionsB", "cl_LinahaOptionsStart"],
				["cl_LinahaOptionsC", "cl_LinahaOptionsStart"],
				["cl_LinahaRounds", "cl_LinahaMap"],
				["cl_LinahaScore", "cl_LinahaMap"],
				["cl_LinahaQuestion", "cl_LinahaQuestion"],
				["cl_LinahaAnswers", "cl_LinahaAnswers"],
			],
			rows: [1, 1, 1, 1, 1, 2],
		},
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
	cl_Lotto: {
		logReqUser: false,
		contentGroup: "Games",
		name: "Lotto",
		source: {
			Zahlen: "https://github.com/JohannesFriedrich/LottoNumberArchive",
			Daten: "https://www.npmjs.com/package/norsk-tipping",
		},
		info: "Lotto / Eurojackpot",
		size: [3, 2],
		maingrid: {
			areas: [
				//
				["cl_LottoOverview", "cl_LottoOptionsA"],
				["cl_LottoOverview", "cl_LottoOptionsB"],
				["cl_LottoCanvas", "cl_LottoSavedGame"],
				["cl_LottoCanvas", "cl_LottoGetGames"],
				["cl_LottoCanvas", "cl_LottoTabGames"],
			],
			rows: [1, 1, 1, 1],
		},
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
	cl_Numbery: {
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
		size: [3, 2],
		maingrid: {
			areas: [
				//
				["cl_NumberyImages", "cl_NumberyPlayerNum"],
				["cl_NumberyImages", "cl_NumberyCathegory"],
				["cl_NumberyImages", "cl_NumberyPairs"],
				["cl_NumberyImages", "cl_NumberyStart"],
				["cl_NumberyImages", "cl_NumberyPlayers"],
				["cl_NumberyImages", "cl_NumberyResult"],
				["cl_NumberyImages", "."],
			],
			rows: [1, 1, 1, 1, 0, 2],
		},
		subgrid: [
			["cl_NumberyStart", "left"],
			["cl_NumberyPlayers", "left"],
			["cl_NumberyPairs", "left"],
			["cl_NumberyCathegory", "left"],
			["cl_NumberyPlayerNum", "left"],
			["cl_NumberyResult", "left"],
			["cl_NumberyImages", "center", "center"],
		],
	},
	cl_RayCaster: {
		contentGroup: "Games",
		name: "RayCaster",
		source: {
			Code1: "https://ncase.me/sight-and-light/",
			Code2: "https://thecodingtrain.com/CodingChallenges/010.4-maze-dfs-p5.html",
		},
		info: 'Du bist der "blaue" und willst den grünen Punkt erreichen. Bewegen kannst du dich mit den Pfeiltasten. Drücke "x" um deine aktuelle Position zu markieren. Aber beachte: du hast nur 5 Markierungen!',
		size: [2, 2],
		maingrid: {
			areas: [
				//
				["cl_RayCasterCanvas", "cl_RayCasterInputs"],
				["cl_RayCasterCanvas", "cl_RayCasterSize"],
				["cl_RayCasterCanvas", "cl_RayCasterSpeed"],
				["cl_RayCasterCanvas", "cl_RayCasterView"],
				["cl_RayCasterCanvas", "cl_RayCasterMaze"],
				["cl_RayCasterCanvas", "cl_RayCasterTarget"],
				["cl_RayCasterCanvas", "cl_RayCasterPoly"],
				["cl_RayCasterCanvas", "cl_RayCasterSpider"],
				["cl_RayCasterCanvas", "."],
			],
			rows: [1, 1, 1, 1, 1, 1, 1, 1],
		},
		subgrid: [
			["cl_RayCasterInputs", "left"],
			["cl_RayCasterSpeed", "left"],
			["cl_RayCasterSize", "left"],
			["cl_RayCasterView", "left"],
			["cl_RayCasterMaze", "left"],
			["cl_RayCasterTarget", "left"],
			["cl_RayCasterPoly", "left"],
			["cl_RayCasterSpider", "left"],
			["cl_RayCasterCanvas", "center"],
		],
	},
	cl_Storre: {
		contentGroup: "Games",
		name: "Storre",
		heritage: ["dänisch", "größer"],
		source: {
			Daten: "https://restcountries.com/",
		},
		info: "Wer ist größer?",
		size: [1, 1],
		maingrid: {
			areas: [
				//
				["cl_StorreStartArea", "cl_StorreStartPopulation"],
				["cl_StorreQuestionA", "cl_StorreQuestionB"],
				["cl_StorreAnswerA", "cl_StorreAnswerB"],
				["cl_StorreStreak", "cl_StorreStreak"],
			],
			rows: [1, 3, 1],
		},
		subgrid: [
			["cl_StorreStartArea", "right"],
			["cl_StorreStartPopulation", "left"],
			["cl_StorreQuestionA", "right"],
			["cl_StorreQuestionB", "left"],
			["cl_StorreAnswerA", "right"],
			["cl_StorreAnswerB", "left"],
			["cl_StorreStreak", "center"],
		],
	},
	cl_Sudoku: {
		contentGroup: "Games",
		name: "Sudoku",
		source: {
			Code: "https://github.com/boggan/js-sudoku-generator#readme",
			Puzzels: "https://www.kaggle.com/bryanpark/sudoku",
		},
		info: "Klassisches Sudoku-Puzzle.<br>Durch Eingabe einer Zahl mittels Tastatur kannst du die Zahl eintragen. Durch drücken der Leertaste kannst du die Eingabeart direkt wechseln. Mit SHIFT kannst du mehere Zellen gleichzeitig auswählen.",
		size: [2, 2],
		maingrid: {
			areas: [
				//
				["cl_SudokuCanvas", "cl_SudokuGetBoard"],
				["cl_SudokuCanvas", "cl_SudokuClear"],
				["cl_SudokuCanvas", "cl_SudokuTimer"],
				["cl_SudokuCanvas", "cl_SudokuHint"],
				["cl_SudokuCanvas", "cl_SudokuValidate"],
				["cl_SudokuCanvas", "cl_SudokuAutoCheck"],
				["cl_SudokuCanvas", "cl_SudokuAutoErase"],
				["cl_SudokuCanvas", "cl_SudokuInput"],
				["cl_SudokuCanvas", "cl_SudokuOverview"],
			],
			rows: [1, 1, 2, 1, 2, 1, 2, 0],
		},
		subgrid: [
			["cl_SudokuGetBoard", "center"],
			["cl_SudokuTimer", "left"],
			["cl_SudokuClear", "left"],
			["cl_SudokuValidate", "left"],
			["cl_SudokuHint", "left"],
			["cl_SudokuAutoCheck", "left"],
			["cl_SudokuAutoErase", "left"],
			["cl_SudokuInput", "left", "center"],
			["cl_SudokuOverview", "center", "start"],
			["cl_SudokuCanvas", "center"],
		],
	},
	cl_Suika: {
		contentGroup: "Games",
		name: "Suika",
		heritage: ["japanisch", "Wassermelone"],
		source: {
			Code: "https://github.com/TomboFry/suika-game/blob/main/index.html",
		},
		info: "Reach the Suika!",
		size: [2, 2],
		maingrid: {
			areas: [
				//
				["cl_SuikaCanvas", "cl_SuikaInputs"],
				["cl_SuikaCanvas", "cl_SuikaScore"],
				["cl_SuikaCanvas", "cl_SuikaHighscore"],
				["cl_SuikaCanvas", "cl_SuikaNextFruit"],
				["cl_SuikaCanvas", "cl_SuikaSound"],
				["cl_SuikaCanvas", "cl_SuikaGameOver"],
				["cl_SuikaCanvas", "."],
			],
			rows: [1, 1, 1, 2, 1, 0],
		},
		subgrid: [
			["cl_SuikaInputs", "left"],
			["cl_SuikaSound", "left"],
			["cl_SuikaScore", "left"],
			["cl_SuikaHighscore", "left"],
			["cl_SuikaGameOver", "center"],
			["cl_SuikaNextFruit", "left"],
			["cl_SuikaCanvas", "right"],
		],
	},
	cl_Sweeper: {
		contentGroup: "Games",
		name: "Sweeper",
		heritage: ["englisch", "Kehrmaschine"],
		source: {
			Code: "https://thecodingtrain.com/CodingChallenges/071-minesweeper.html",
		},
		info: "Klassisches Mine-Sweeper!",
		size: [2, 2],
		maingrid: {
			areas: [
				["cl_SweeperCanvas", "cl_SweeperInputs"],
				["cl_SweeperCanvas", "cl_SweeperGrid"],
				["cl_SweeperCanvas", "cl_SweeperSweeps"],
			],
			rows: [1, 1],
		},
		subgrid: [
			["cl_SweeperCanvas", "center"],
			["cl_SweeperInputs", "center"],
			["cl_SweeperGrid", "center"],
			["cl_SweeperSweeps", "center"],
		],
	},
	//News
	cl_Howa: {
		contentGroup: "News",
		name: "Howa",
		heritage: ["turkmenisch", "Wetter"],
		source: {
			Daten: "https://open-meteo.com",
			GeoLocation: "https://github.com/bigdatacloudapi/js-reverse-geocode-client",
		},
		info: "Wettervorhersage für die nächsten Tage.",
		size: [3, 1],
		maingrid: {
			areas: [
				["cl_HowaInput", "cl_HowaMapsSelectDistrict", "cl_HowaMapsSelectCriteria"],
				["cl_HowaNow", "cl_HowaMapsImg", "cl_HowaMapsImg"],
				["cl_HowaGraph", "cl_HowaMapsImg", "cl_HowaMapsImg"],
			],
			rows: [1, 2],
		},
		subgrid: [
			["cl_HowaInput", "center", "end"],
			["cl_HowaNow", "center", "end"],
			["cl_HowaGraph", "center"],
			["cl_HowaMapsSelectDistrict", "right"],
			["cl_HowaMapsSelectCriteria", "left"],
			["cl_HowaMapsImg", "bottom"],
		],
	},
	cl_News: {
		contentGroup: "News",
		name: "News",
		heritage: ["englisch", "Nachrichten"],
		source: {
			Daten: "https://Tagesschau.de",
			API: "https://github.com/bundesAPI/tagesschau-api",
		},
		size: [2, 1],
		maingrid: {
			areas: [
				["cl_NewsRegion", "cl_NewsResultImage", "cl_NewsResultTitle"],
				["cl_NewsRessort", "cl_NewsResultImage", "cl_NewsResultTitle"],
				["cl_NewsTable", "cl_NewsResultImage", "cl_NewsResultTitle"],
				["cl_NewsTable", "cl_NewsResultText", "cl_NewsResultText"],
			],
			rows: [1, 1, 1],
		},
		subgrid: [
			["cl_NewsRegion", "left"],
			["cl_NewsRessort", "left"],
			["cl_NewsTable", "left"],
			["cl_NewsResultTitle", "center", "center"],
			["cl_NewsResultText", "center"],
			["cl_NewsResultImage", "center"],
		],
	},
	cl_PostillonTicker: {
		contentGroup: "News",
		name: "PostillonTicker",
		source: {
			Daten: "https://www.der-Postillon.com",
		},
		info: "Alle Postillon News-Ticker zum durchklicken",
		size: [2, 1],
		maingrid: {
			areas: [["cl_PostillionNumber"], ["cl_PostillionTable"]],
			rows: [1],
		},
		subgrid: [
			["cl_PostillionTable", "center"],
			["cl_PostillionNumber", "center"],
		],
	},
	cl_Pafadoj: {
		deactivated: false,
		contentGroup: "News",
		name: "Pafadoj",
		heritage: ["esperanto", "Schießerei"],
		source: {
			Daten: "hhttps://en.wikipedia.org/wiki/List_of_mass_shootings_in_the_United_States",
		},
		size: [2, 1],
		maingrid: {
			areas: [["cl_PafadojInfo"], ["cl_PafadojUpdate"], ["cl_PafadojTable"]],
			rows: [0, 1],
		},
		subgrid: [
			["cl_PafadojInfo", "center"],
			["cl_PafadojUpdate", "center"],
			["cl_PafadojTable", "center"],
		],
	},
	cl_Sepakbola: {
		deactivated: false,
		contentGroup: "News",
		name: "Sepakbola",
		heritage: ["javanisch", "Fußball"],
		source: {
			Daten: "https://www.openligadb.de",
		},
		size: [2, 3],
		maingrid: {
			areas: [
				["cl_SepakbolaInputLiga", "cl_SepakbolaInputDay"],
				["cl_SepakbolaInputSeason", "."],
				["cl_SepakbolaTable", "cl_SepakbolaMatches"],
			],
			rows: [1, 1],
		},
		subgrid: [
			["cl_SepakbolaInputLiga", "center"],
			["cl_SepakbolaInputSeason", "center"],
			["cl_SepakbolaInputDay", "center"],
			["cl_SepakbolaTable", "left"],
			["cl_SepakbolaMatches", "right"],
		],
	},
	cl_Olympia: {
		deactivated: false,
		contentGroup: "News",
		name: "Olympia",
		heritage: ["griechisch", "Olympia"],
		source: {
			Daten: "https://github.com/kevle1/paris-2024-olympic-api",
		},
		size: [2, 1],
		maingrid: {
			areas: [["cl_OlympiaUpdate"], ["cl_OlympiaTable"]],
			rows: [1],
		},
		subgrid: [
			["cl_OlympiaUpdate", "center"],
			["cl_OlympiaTable", "center"],
		],
	},
	//Tools
	cl_Blechgeometrie: {
		logReqUser: true,
		contentGroup: "Tools",
		name: "Blechgeometrie",
		source: {
			Daten: "https://rime.de/de/wiki/lochabstand-berechnen/",
		},
		size: [1, 1],
		maingrid: {
			areas: [["cl_BlechgeoVinDicke"], ["cl_BlechgeoVinRadius"], ["cl_BlechgeoVinForm"], ["cl_BlechgeoVinBreite"], ["cl_BlechgeoImg"], ["cl_BlechgeoLblResult"]],
			rows: [1, 1, 1, 1, 0],
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
	cl_Expansion: {
		contentGroup: "Tools",
		name: "Expansion",
		heritage: ["englisch", "Ausdehnung"],
		source: {
			Daten: "https://www.schweizer-fn.de/stoff/waermedehnung/waermedehnung.php#stahltabelle",
		},
		size: [2, 2],
		maingrid: {
			areas: [
				["cl_ExpansionMaterialsA", "cl_ExpansionMaterialSwitch", "cl_ExpansionMaterialsB"],
				["cl_ExpansionVinLength", "cl_ExpansionVinLength", "cl_ExpansionVinLength"],
				["cl_ExpansionVinTemperature", "cl_ExpansionVinTemperature", "cl_ExpansionVinTemperature"],
				["cl_ExpansionVinBaseTemperature", "cl_ExpansionVinBaseTemperature", "cl_ExpansionVinBaseTemperature"],
				["cl_ExpansionCBOptions", "cl_ExpansionCBOptions", "cl_ExpansionCBOptions"],
				["cl_ExpansionList", "cl_ExpansionList", "cl_ExpansionList"],
			],
			rows: [1, 1, 1, 1, 2],
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
	cl_Geometrie: {
		contentGroup: "Tools",
		name: "Geometrie",
		size: [2, 2],
		maingrid: {
			areas: [
				["cl_GeometrieAreaSelect", "cl_GeometrieTable"],
				["cl_GeometrieOptions", "cl_GeometrieCanvas"],
			],
			rows: [0],
			// rows: [1, 1, 1, 1, 1],
		},
		subgrid: [
			["cl_GeometrieAreaSelect", "left"],
			["cl_GeometrieOptions", "center"],
			["cl_GeometrieCanvas", "center", "start"],
			["cl_GeometrieTable", "center"],
		],
	},
	cl_Luas: {
		contentGroup: "Tools",
		name: "Luas",
		heritage: ["irisch", "Geschwindigkeit"],
		info: "Geschwindigkeiten übersetzen und darstellen",
		size: [1, 2],
		maingrid: {
			areas: [["cl_LuasVinAngularVin"], ["cl_LuasVinLinearVin"], ["cl_LuasOptAngularVin"], ["cl_LuasOptLinearVin"], ["cl_LuasCanvas"], ["cl_LuasResult"]],
			rows: [1, 1, 1, 1, 0],
		},
		subgrid: [
			["cl_LuasVinAngularVin", "left"],
			["cl_LuasVinLinearVin", "left"],
			["cl_LuasOptAngularVin", "left"],
			["cl_LuasOptLinearVin", "left"],
			["cl_LuasResult", "center"],
			["cl_LuasCanvas", "center"],
		],
	},
	cl_Material: {
		logReqUser: true,
		contentGroup: "Tools",
		name: "Material",
		source: {
			Daten: "https://www.schweizer-fn.de/festigkeit/festigkeitswerte/stahl/stahl_start.php",
		},
		size: [2, 2],
		maingrid: {
			areas: [
				//
				["cl_MaterialPropertyCb", "."],
				["cl_MaterialList", "cl_MaterialList"],
				// ["cl_MaterialSearchOptions", "cl_MaterialSearchOptions"], // in DIALOG
				// ["cl_MaterialSearchList cl_MaterialSearchList"], // in DIALOG
			],
			rows: [1],
			// rows: [1, 0, 1],
		},
		subgrid: [
			["cl_MaterialPropertyCb", "left"],
			["cl_MaterialList", "left"],
			// ["cl_MaterialSearchOptions", "left"], // in DIALOG
			// ["cl_MaterialSearchList", "left"], // in DIALOG
		],
	},
	cl_Middle: {
		contentGroup: "Tools",
		name: "Middle",
		heritage: ["englisch", "Mitte"],
		size: [1, 1],
		maingrid: {
			areas: [["cl_MiddleInput0"], ["cl_MiddleInput1"], ["cl_MiddleCanvas"], ["cl_MiddleMid"], ["cl_MiddleDiff"]],
			rows: [1, 1, 0, 2],
		},
		subgrid: [
			["cl_MiddleInput0", "center"],
			["cl_MiddleInput1", "center"],
			["cl_MiddleMid", "center"],
			["cl_MiddleDiff", "center"],
			["cl_MiddleCanvas", "center"],
		],
	},
	cl_Niska: {
		source: {
			Regelgewinde: "https://de.wikipedia.org/wiki/Metrisches_ISO-Gewinde",
			Feingewinde: "http://gewindenormen.com",
			Berechnung: "https://www.schweizer-fn.de/maschinenelemente/schraube/schraubenverbindung.php",
		},
		contentGroup: "Tools",
		name: "Niska",
		heritage: ["mazedonisch", "Gewinde"],
		size: [2, 3],
		maingrid: {
			areas: [
				["cl_NiskaHeaderInput", "cl_NiskaHeaderSelect"],
				["cl_NiskaSize", "cl_NiskaSelect"],
				["cl_NiskaPitch", "."],
				["cl_NiskaStrengthClassA", "cl_NiskaStrengthClassB"],
				["cl_NiskaList", "cl_NiskaList"],
			],
			rows: [1, 1, 1],
		},
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
	cl_Pattern: {
		logReqUser: true,
		contentGroup: "Tools",
		name: "Pattern",
		heritage: ["englisch", "Muster"],
		size: [2, 1],
		maingrid: {
			areas: [["cl_PatternInputA"], ["cl_PatternInputB"], ["cl_PatternInputC"], ["cl_PatternInputD"], ["cl_PatternInputE"], ["cl_PatternCanvas"]],
			rows: [1, 1, 1, 1, 1],
		},
		subgrid: [
			["cl_PatternInputA", "center"],
			["cl_PatternInputB", "center"],
			["cl_PatternInputC", "center"],
			["cl_PatternInputD", "center"],
			["cl_PatternInputE", "center"],
			["cl_PatternCanvas", "center"],
		],
	},
	cl_Pormula: {
		contentGroup: "Tools",
		name: "Pormula",
		source: {
			Library: "https://github.com/Tom-Alexander/regression-js",
		},
		heritage: ["filipino", "Formel"],
		info: "Gleichung aus Datenpunkten ermitteln.",
		size: [2, 1],
		maingrid: {
			areas: [
				["cl_PormulaAddInputs", "cl_PormulaTypeSelect", "cl_PormulaBestFit", "cl_PormulaPolyFit"],
				["cl_PormulaInputs", "cl_PormulaTypeSelect", "cl_PormulaOrder", "cl_PormulaOrder"],
				["cl_PormulaInputs", "cl_PormulaTypeSelect", "cl_PormulaPrecision", "cl_PormulaPrecision"],
				["cl_PormulaInputs", "cl_PormulaTypeSelect", "cl_PormulaAccuracy", "cl_PormulaAccuracy"],
				["cl_PormulaInputs", "cl_PormulaTypeSelect", "cl_PormulaLblResult", "cl_PormulaLblResult"],
				["cl_PormulaInfo", "cl_PormulaInfo", "cl_PormulaPointResults", "cl_PormulaPointResults"],
				[".", ".", "cl_PormulaPointEntryA", "cl_PormulaPointResultA"],
				[".", ".", "cl_PormulaPointEntryB", "cl_PormulaPointResultB"],
				[".", ".", "cl_PormulaPointEntryC", "cl_PormulaPointResultC"],
				["cl_PormulaCanvas", "cl_PormulaCanvas", "cl_PormulaCanvas", "cl_PormulaCanvas"],
			],
			rows: [1, 1, 1, 1, 2, 0, 0],
		},
		subgrid: [
			["cl_PormulaBestFit", "center"],
			["cl_PormulaTypeSelect", "center"],
			["cl_PormulaPolyFit", "center"],
			["cl_PormulaPrecision", "center"],
			["cl_PormulaOrder", "center"],
			["cl_PormulaInputs", "left"],
			["cl_PormulaAddInputs", "left"],
			["cl_PormulaPointEntryA", "center"],
			["cl_PormulaPointEntryB", "center"],
			["cl_PormulaPointEntryC", "center"],
			["cl_PormulaPointResultA", "center"],
			["cl_PormulaPointResultB", "center"],
			["cl_PormulaPointResultC", "center"],
			["cl_PormulaInfo", "center"],
			["cl_PormulaLblResult", "center"],
			["cl_PormulaPointResults", "center"],
			["cl_PormulaAccuracy", "center"],
			["cl_PormulaCanvas", "center"],
		],
	},
	cl_Pythagoras: {
		contentGroup: "Tools",
		name: "Pythagoras",
		size: [1, 1],
		maingrid: {
			areas: [
				//
				["cl_PythagorasInput0"],
				["cl_PythagorasInput1"],
				["cl_PythagorasInput2"],
				["cl_PythagorasInput3"],
				["cl_PythagorasInput4"],
				["cl_PythagorasInfo"],
				["cl_PythagorasCanvas"],
			],
			rows: [1, 1, 1, 1, 1, 0],
		},
		subgrid: [
			["cl_PythagorasInput0", "center"],
			["cl_PythagorasInput1", "center"],
			["cl_PythagorasInput2", "center"],
			["cl_PythagorasInput3", "center"],
			["cl_PythagorasInput4", "center"],
			["cl_PythagorasInfo", "center"],
			["cl_PythagorasCanvas", "center"],
		],
	},
	cl_Quickmath: {
		contentGroup: "Tools",
		name: "Quickmath",
		size: [1, 2],
		maingrid: {
			areas: [
				//
				["cl_QuickmathInput", "cl_QuickmathInput", "cl_QuickmathInput"],
				["cl_QuickmathStart", "cl_QuickmathStart", "cl_QuickmathStart"],
				["cl_QuickmathEnd", "cl_QuickmathEnd", "cl_QuickmathEnd"],
				["cl_QuickmathListMultiply", "cl_QuickmathListDivide", "cl_QuickmathListPow"],
			],
			rows: [1, 1, 1],
		},
		subgrid: [
			["cl_QuickmathInput", "center"],
			["cl_QuickmathStart", "center"],
			["cl_QuickmathEnd", "center"],
			["cl_QuickmathListMultiply", "center"],
			["cl_QuickmathListDivide", "center"],
			["cl_QuickmathListPow", "center"],
		],
	},
	cl_Ranje: {
		contentGroup: "Tools",
		name: "Ranje",
		heritage: ["Haiti-Kreolisch", "anordnen"],
		size: [1, 1],
		maingrid: {
			areas: [["cl_RanjeInput"], ["cl_RanjeList"]],
			rows: [1],
		},
		subgrid: [
			["cl_RanjeInput", "center"],
			["cl_RanjeList", "center"],
		],
	},
	//Utility
	cl_BiktadA: {
		contentGroup: "Utility",
		name: "BiktadA",
		heritage: ["schwedisch", "gebeichtet"],
		source: {
			Code: "https://stackoverflow.com/a/5918791",
		},
		info: "Diese Daten sind ohne deine Zustimmung im Browser verfügbar!",
		size: [1, 1],
		maingrid: {
			areas: [["cl_BiktadATable"]],
			rows: [0],
		},
		subgrid: [["cl_BiktadATable", "center"]],
	},
	cl_Boredom: {
		contentGroup: "Utility",
		name: "Boredom",
		heritage: ["englisch", "Langeweile"],
		source: {
			Daten: "https://www.boredapi.com/",
		},
		size: [1, 1],
		maingrid: {
			areas: [["cl_BoredomStart"], ["cl_BoredomAnswer"]],
			rows: [1],
		},
		subgrid: [
			["cl_BoredomStart", "center"],
			["cl_BoredomAnswer", "center"],
		],
	},
	cl_Botanicals: {
		contentGroup: "Utility",
		name: "Botanicals",
		heritage: ["englisch", "botanisch"],
		source: {
			Daten: "https://www.tabelle.info/kraeuter.html",
		},
		size: [2, 1],
		maingrid: {
			areas: [
				["cl_BotanicalsVinDiscomfort", "cl_BotanicalsVinPlant"],
				["cl_BotanicalsTabResultDiscomfort", "cl_BotanicalsTabResultPlant"],
			],
			rows: [1],
		},
		subgrid: [
			["cl_BotanicalsVinPlant", "center"],
			["cl_BotanicalsVinDiscomfort", "center"],
			["cl_BotanicalsTabResultPlant", "center"],
			["cl_BotanicalsTabResultDiscomfort", "center"],
		],
	},
	cl_Egg: {
		contentGroup: "Utility",
		name: "Eierkochen",
		source: {
			Daten: "newton.ex.ac.uk/teaching/CDHW/egg/",
		},
		info: "1. Ausreichnd Wasser zum kochen bringen.<br>2. Ei in leicht kochendes Wasser legen, sodass es vollständig bedeckt ist.<br>3. Timer starten.<br>4. Fertiges Ei aus kochendem Wasser entnehmen. Achtung, das Wasser ist heiß, das Ei auch!<br>5. Nach belieben unter kaltem Wasser abschrecken",
		size: [2, 1],
		maingrid: {
			areas: [["cl_EggMassValue"], ["cl_EggTempValue"], ["cl_EggYolkValue"], ["cl_EggStart"], ["cl_EggTime"], ["cl_EggTimeProgress"]],
			rows: [1, 1, 1, 1, 0],
		},
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
		contentGroup: "Utility",
		name: "Foody",
		heritage: ["vietnamesisch", "lecker"],
		info: "Wie lange und wie warm muss es kochen oder backen?<br>Suche ein Gericht aus und starte den Timer!",
		size: [2, 1],
		maingrid: {
			areas: [["cl_FoodyType"], ["cl_FoodyPreheat"], ["cl_FoodyStart"], ["cl_FoodyTime"], ["cl_FoodyTimeProgress"]],
			rows: [1, 1, 1, 0],
		},
		subgrid: [
			["cl_FoodyType", "left"],
			["cl_FoodyPreheat", "left"],
			["cl_FoodyStart", "center"],
			["cl_FoodyTime", "center"],
			["cl_FoodyTimeProgress", "center"],
		],
	},
	cl_Hverertu: {
		contentGroup: "Utility",
		name: "Hver Ertu",
		heritage: ["isländisch", "Wer bist du"],
		source: {
			Alter: "https://agify.io",
			Herkunft: "https://nationalize.io",
			Gender: "https://genderize.io",
		},
		size: [1, 1],
		maingrid: {
			areas: [["cl_HverertuInput"], ["cl_HverertuTable"]],
			rows: [1],
		},
		subgrid: [
			["cl_HverertuInput", "center"],
			["cl_HverertuTable", "center"],
		],
	},
	cl_Iomlaid: {
		contentGroup: "Utility",
		name: "Iomlaid",
		deactivated: false,
		heritage: ["schottisch-gälisch", "Austausch"],
		source: {
			Daten: "https://github.com/fawazahmed0/exchange-api",
		},
		size: [3, 1],
		maingrid: {
			areas: [
				//
				["cl_IomlaidSelCur", "cl_IomlaidVinCur", "cl_IomlaidVinDate"],
				["cl_IomlaidTab", "cl_IomlaidTab", "cl_IomlaidTab"],
			],
			rows: [1],
		},
		subgrid: [
			["cl_IomlaidSelCur", "center"],
			["cl_IomlaidVinCur", "center"],
			["cl_IomlaidVinDate", "center"],
			["cl_IomlaidTab", "center"],
		],
	},
	cl_Kadar: {
		contentGroup: "Utility",
		name: "Kadar",
		deactivated: false,
		heritage: ["türkisch", "bis"],
		info: "Berechne Zeiten",
		size: [2, 1],
		maingrid: {
			areas: [
				//
				["cl_KadarSelA", "cl_KadarLblNow", "cl_KadarSelB"],
				["cl_KadarResultTable_Anow", "cl_KadarResultTable_AB", "cl_KadarResultTable_Bnow"],
			],
			rows: [1],
		},
		subgrid: [
			["cl_KadarSelA", "center"],
			["cl_KadarSelB", "center"],
			["cl_KadarLblNow", "center"],
			["cl_KadarResultTable_Anow", "center"],
			["cl_KadarResultTable_AB", "center"],
			["cl_KadarResultTable_Bnow", "center"],
		],
	},
	cl_Kaihanga: {
		contentGroup: "Utility",
		name: "Kaihanga",
		heritage: ["maori", "Hersteller"],
		source: {
			Code: "http://dougtesting.net/home",
		},
		info: "Glücksrad!<br>Gib Gewinne ein und drücke auf das Rad.",
		size: [2, 1],
		maingrid: {
			areas: [
				//
				["cl_KaihangaInput", "cl_KaihangaCanvas"],
				["cl_KaihangaSegments", "cl_KaihangaCanvas"],
				["cl_KaihangaSegments", "cl_KaihangaResult"],
			],
			rows: [0, 0],
		},
		subgrid: [
			["cl_KaihangaInput", "left"],
			["cl_KaihangaSegments", "left"],
			["cl_KaihangaResult", "left"],
			["cl_KaihangaCanvas", "left"],
		],
	},
	cl_Kounselor: {
		contentGroup: "Utility",
		name: "Kounselor",
		heritage: ["jiddisch", "Ratgeber"],
		size: [1, 1],
		maingrid: {
			areas: [
				//
				["cl_KounselorOutputA"],
				["cl_KounselorOutputB"],
				["cl_KounselorOptionsA"],
				["cl_KounselorOptionsB"],
				["cl_KounselorOptionsC"],
				["cl_KounselorOptionsD"],
				["cl_KounselorOptionsE"],
				["cl_KounselorOptionsF"],
				["cl_KounselorOptionsG"],
			],
			rows: [2, 2, 1, 1, 1, 1, 1, 1],
		},
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
	cl_Netsaona: {
		contentGroup: "Utility",
		name: "Netsaona",
		heritage: ["shona", "Zufall"],
		info: "Zufallsgenerator für verschiedene Dinge!",
		size: [2, 2],
		maingrid: {
			areas: [
				//
				["cl_NetsaonaOptionsA"],
				["cl_NetsaonaOptionsB"],
				["cl_NetsaonaOptionsC"],
				["cl_NetsaonaOptionsD"],
				["cl_NetsaonaOptionsE"],
				["cl_NetsaonaOptionsF"],
				["cl_NetsaonaOptionsG"],
				["cl_NetsaonaOutput"],
			],
			rows: [1, 1, 1, 1, 1, 1, 1],
		},
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
		contentGroup: "Utility",
		name: "Pelvelea",
		heritage: ["khmer", "Zeit"],
		info: "Wann kannst du nach Hause?!",
		size: [1, 1],
		maingrid: {
			areas: [
				//
				["cl_PelveleaStarttime"],
				["cl_PelveleaBreaks"],
				["cl_PelveleaWorktime"],
				["cl_PelveleaResult"],
				["cl_PelveleaProgress"],
				["cl_PelveleaBreaktime"],
			],
			rows: [1, 1, 1, 2, 1],
		},
		subgrid: [
			["cl_PelveleaStarttime", "center"],
			["cl_PelveleaBreaks", "center"],
			["cl_PelveleaWorktime", "center"],
			["cl_PelveleaResult", "center"],
			["cl_PelveleaProgress", "center"],
			["cl_PelveleaBreaktime", "center"],
		],
	},
	cl_PlatLesen: {
		contentGroup: "Utility",
		name: "PlatLesen",
		heritage: ["malaysisch", "Nummernschild"],
		source: {
			Daten: "https://www.wbrnet.info/db/9964.html",
		},
		size: [1, 1],
		maingrid: {
			areas: [
				//
				["cl_PlatLesenRegInput"],
				["cl_PlatLesenNumInput"],
				["cl_PlatLesenResult"],
			],
			rows: [0, 0],
		},
		subgrid: [
			["cl_PlatLesenNumInput", "center"],
			["cl_PlatLesenRegInput", "center"],
			["cl_PlatLesenResult", "center"],
		],
	},
	cl_Thiontu: {
		contentGroup: "Utility",
		name: "Thiontu",
		heritage: ["irisch", "umwandeln"],
		size: [2, 1],
		maingrid: {
			areas: [
				//
				["cl_ThiontuInputArea", "cl_ThiontuOutputArea"],
				["cl_ThiontuOptions_A", "cl_ThiontuOptions_A"],
				["cl_ThiontuOptions_B", "cl_ThiontuOptions_B"],
				["cl_ThiontuOptions_C", "cl_ThiontuOptions_C"],
				["cl_ThiontuOptions_D", "cl_ThiontuOptions_D"],
				["cl_ThiontuOptions_E", "cl_ThiontuOptions_E"],
			],
			rows: [0, 1, 1, 1, 1],
		},
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
	cl_Tugas: {
		contentGroup: "Utility",
		name: "Tugas",
		heritage: ["indonesisch", "Pflicht"],
		info: 'Füge Texte ein und drück "Enter". Klicke auf einen deiner Texte und er kopiert sich direkt in deine Zwischenablage!',
		size: [1, 1],
		maingrid: {
			areas: [
				//
				["cl_TugasInput"],
				["cl_TugasEnter"],
				["cl_TugasList"],
			],
			rows: [0, 1],
		},
		subgrid: [
			["cl_TugasInput", "center"],
			["cl_TugasEnter", "center"],
			["cl_TugasList", "left"],
		],
	},
	//Setings
	cl_GeneralSettings: {
		contentGroup: "Global-Settings",
		name: "GeneralSettings",
		size: [1, 1],
		maingrid: {
			areas: [
				//
				["cl_SettingsFontsize"],
				["cl_SettingsDecimals"],
			],
			rows: [1],
		},
		subgrid: [
			["cl_SettingsFontsize", "left"],
			["cl_SettingsDecimals", "left"],
		],
	},
	cl_ColorSettings: {
		contentGroup: "Global-Settings",
		name: "ColorSettings",
		size: [1, 1],
		maingrid: {
			areas: [
				//
				["cl_ColorSettingsDefault"],
				["cl_ColorSettingsHeaderLight"],
				["cl_ColorSettings_light_0"],
				["cl_ColorSettings_light_1"],
				["cl_ColorSettings_light_2"],
				["cl_ColorSettingsHeaderDark"],
				["cl_ColorSettings_dark_0"],
				["cl_ColorSettings_dark_1"],
				["cl_ColorSettings_dark_2"],
			],
			rows: [1, 1, 1, 1, 1, 2, 1, 1],
		},
		subgrid: [
			["cl_ColorSettingsDefault", "center"],
			["cl_ColorSettingsHeaderLight", "center"],
			["cl_ColorSettingsHeaderDark", "center", "end"],
			["cl_ColorSettings_light_0", "center"],
			["cl_ColorSettings_light_1", "center"],
			["cl_ColorSettings_light_2", "center"],
			["cl_ColorSettings_dark_0", "center"],
			["cl_ColorSettings_dark_1", "center"],
			["cl_ColorSettings_dark_2", "center"],
		],
	},
	cl_UserGridLayout: {
		contentGroup: "Global-Settings",
		deactivated: false,
		name: "User-Layout",
		size: [3, 2],
		maingrid: {
			areas: [
				["cl_UserGridOptions", "cl_UserGridSelect"],
				["cl_UserGridTable", "cl_UserGridCanvas"],
			],
			rows: [1],
		},
		subgrid: [
			["cl_UserGridOptions", "center"],
			["cl_UserGridTable", "center"],
			["cl_UserGridSelect", "center"],
			["cl_UserGridCanvas", "center"],
		],
	},
	cl_MaterialFilterSettings: {
		contentGroup: "Global-Settings",
		name: "Materialfilter",
		size: [2, 1],
		maingrid: {
			areas: [
				//
				["cl_MaterialFilterTable"],
			],
			rows: [],
		},
		subgrid: [["cl_MaterialFilterTable", "center"]],
	},
	cl_UserLogin: {
		contentGroup: "Account-Settings",
		name: "Login or Register",
		size: [2, 2],
		maingrid: {
			areas: [
				//
				["cl_UserLogin_mail"],
				["cl_UserLogin_pass"],
				["cl_UserLogin_alert"],
				["cl_UserLogin_submit"],
				["cl_UserLogin_check"],
				["cl_UserLogin_cancel"],
			],
			rows: [1, 1, 0, 1, 1],
		},
		subgrid: [
			["cl_UserLogin_mail", "left"],
			["cl_UserLogin_pass", "left"],
			["cl_UserLogin_submit", "left"],
			["cl_UserLogin_cancel", "left"],
			["cl_UserLogin_check", "left"],
			["cl_UserLogin_alert", "left"],
		],
	},
	cl_UserChange: {
		contentGroup: "Account-Settings",
		name: "Change or Logout",
		size: [2, 2],
		maingrid: {
			areas: [
				//
				["cl_UserChange_user"],
				["cl_UserChange_logout"],
				["cl_UserChange_infos"],
				["cl_UserChange_change"],
				["cl_UserChange_cancel"],
			],
			rows: [2, 2, 0, 1],
		},
		subgrid: [
			["cl_UserChange_user", "left"],
			["cl_UserChange_infos", "left"],
			["cl_UserChange_change", "left"],
			["cl_UserChange_cancel", "left"],
			["cl_UserChange_logout", "left"],
		],
	},
};
export const contentFooter = [
	["Icons", "https://www.iconfinder.com/search/icons?family=feather"],
	["Canvas-Library", "https://p5js.org/"],
	["Charts", "http://chartJS.org"],
	["Date-Picker", "https://github.com/Pikaday/Pikaday"],
	["Inspirations", "https://thecodingtrain.com/"],
	["Color calculations", "https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color/3943023#3943023"],
	["Color calculations", "https://www.html-code-generator.com/javascript/color-converter-script"],
];
