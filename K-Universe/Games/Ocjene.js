/*
ToDo:
- vorzeichen im gleichen Takt weglassen
- Vorzeichen aufheben im gleichen Takt weglassen

*/

const ocjeneOptions = {
	get div() {
		return "idCanv_ocjeneSheet";
	},
	division: 576,
	notenwerte: {
		selected: [],
		selectedOrig: [0, 0, 1, 1, 0, 0], //1/1, 1/2, 1/4, 1/8, 1/16
		quaternote: 144,
		noteArrays: {
			base: [576, 288, 144, 72, 36, 18],
			triplet: [null, 192, 96, 48, 24, 12],
			dotted: [null, 432, 216, 108, 54, 27],
		},
		get min() {
			return this.selected.findLastIndex((i) => i > 0);
		},
	},
	dotted: {
		state: false,
		stateOrig: false,
		probability: 0.2,
		val: 0,
		valOrig: 0,
		min: 0,
		max: 50,
	},
	triplet: {
		state: false,
		stateOrig: true,
		probability: 0.2,
		val: 0,
		valOrig: 0,
		min: 0,
		max: 50,
	},
	rests: {
		val: 0,
		valOrig: 0,
		min: 0,
		max: 50,
	},
	timeSignature: {
		index: 0,
		indexOrig: 3,
		get currSignature() {
			return ocjeneOptions.definitions.timeSignatures[this.index];
		},
	},
	interval: {
		val: 0,
		valOrig: 4,
	},
	tempo: {
		val: 0,
		valOrig: 95,
		min: 60,
		max: 210,
	},
	bars: {
		val: 0,
		valOrig: 4,
		max: 24,
	},
	barOverflowStop: {
		state: true,
		stateOrig: true,
	},
	showText: {
		state: false,
		stateOrig: false,
	},
	textLanguage: {
		index: 0,
		indexOrig: 5, //navigator.language == "de"
		name(index = null) {
			const id = index == null ? this.index : index;
			let code = Object.keys(ocjeneOptions.definitions.notes.textLanguage)[id];
			return Data_Country_CodesIso639.get(code);
		},
		val(index = null) {
			const id = index == null ? this.index : index;
			return Object.keys(ocjeneOptions.definitions.notes.textLanguage)[id];
		},
	},
	clef: {
		index: 0,
		indexOrig: 0,
		name(index = null) {
			if (index == null) return Object.keys(ocjeneOptions.definitions.clefs)[this.index];
			return Object.keys(ocjeneOptions.definitions.clefs)[index];
		},
		val(index = null) {
			if (index == null) {
				return ocjeneOptions.definitions.clefs[Object.keys(ocjeneOptions.definitions.clefs)[this.index]];
			}
			return ocjeneOptions.definitions.clefs[Object.keys(ocjeneOptions.definitions.clefs)[this.index]];
		},
	},
	keySignatures: {
		index: 0,
		indexOrig: 0,
	},
	keys: {
		index: 0,
		indexOrig: 4,
		get current() {
			return ocjeneOptions.definitions.keys[ocjeneOptions.keys.index][ocjeneOptions.keySignatures.index];
		},
		get shiftDir() {
			return ocjeneOptions.keys.index <= 7 ? -1 : 1;
		},
	},
	keyOnly: {
		state: false,
		stateOrig: false,
	},
	limitRange: {
		state: false,
		stateOrig: true,
		base: 69,
	},
	rangeOffset: {
		val: 10,
		valOrig: 12,
	},
	firstPitchIterations: {
		val: 0,
		valOrig: 4,
	},
	definitions: {
		notes: {
			abcJSBasenotes: ["C", "D", "E", "F", "G", "A", "B", "^C", "^D", "^F", "^G", "^A", "_D", "_E", "_G", "_A", "_B"],
			A: [
				"A,,,,",
				"^A,,,,",
				"B,,,,",
				"C,,,",
				"^C,,,",
				"D,,,",
				"^D,,,",
				"E,,,",
				"F,,,",
				"^F,,,",
				"G,,,",
				"^G,,,",
				"A,,,",
				"^A,,,",
				"B,,,",
				"C,,",
				"^C,,",
				"D,,",
				"^D,,",
				"E,,",
				"F,,",
				"^F,,",
				"G,,",
				"^G,,",
				"A,,",
				"^A,,",
				"B,,",
				"C,",
				"^C,",
				"D,",
				"^D,",
				"E,",
				"F,",
				"^F,",
				"G,",
				"^G,",
				"A,",
				"^A,",
				"B,",
				"C",
				"^C",
				"D",
				"^D",
				"E",
				"F",
				"^F",
				"G",
				"^G",
				"A",
				"^A",
				"B",
				"c",
				"^c",
				"d",
				"^d",
				"e",
				"f",
				"^f",
				"g",
				"^g",
				"a",
				"^a",
				"b",
				"c'",
				"^c'",
				"d'",
				"^d'",
				"e'",
				"f'",
				"^f'",
				"g'",
				"^g'",
				"a'",
				"^a'",
				"b'",
				"c''",
				"^c''",
				"d''",
				"^d''",
				"e''",
				"f''",
				"^f''",
				"g''",
				"^g''",
				"a''",
				"^a''",
				"b''",
				"c'''",
			],
			B: [
				"A,,,,",
				"_B,,,,",
				"B,,,,",
				"C,,,",
				"_D,,,",
				"D,,,",
				"_E,,,",
				"E,,,",
				"F,,,",
				"_G,,,",
				"G,,,",
				"_A,,,",
				"A,,,",
				"_B,,,",
				"B,,,",
				"C,,",
				"^C,,",
				"D,,",
				"_E,,",
				"E,,",
				"F,,",
				"_G,,",
				"G,,",
				"_A,,",
				"A,,",
				"_B,,",
				"B,,",
				"C,",
				"_D,",
				"D,",
				"_E,",
				"E,",
				"F,",
				"_G,",
				"G,",
				"_A,",
				"A,",
				"_B,",
				"B,",
				"C",
				"_D",
				"D",
				"_E",
				"E",
				"F",
				"_G",
				"G",
				"_A",
				"A",
				"_B",
				"B",
				"c",
				"_d",
				"d",
				"_e",
				"e",
				"f",
				"_g",
				"g",
				"_a",
				"a",
				"_b",
				"b",
				"c'",
				"_d'",
				"d'",
				"_e'",
				"e'",
				"f'",
				"_g'",
				"g'",
				"_a'",
				"a'",
				"_b'",
				"b'",
				"c''",
				"_d''",
				"d''",
				"_e''",
				"e''",
				"f''",
				"_g''",
				"g''",
				"_a''",
				"a''",
				"_b''",
				"b''",
				"c'''",
			],
			midi: [
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68,
				69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
			],
			textLanguage: {
				//Data_Country_CodesIso639
				en: ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"],
				nl: ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"],
				"zh-cn": ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"],
				"zh-tw": ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"],
				"zh-hk": ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"],
				de: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				da: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				nb: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				sv: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				pl: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				sk: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				cs: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				sr: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				hr: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				hu: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				fr: ["do", "ré", "mi", "fa", "sol", "la", "si", "do dièse", "ré dièse", "fa dièse", "sol dièse", "la dièse", "ré bémol", "mi bémol", "sol bémol", "la bémol", "si bémol"],
				it: ["do", "ré", "mi", "fa", "sol", "la", "si", "do dièse", "ré diesis", "fa diesis", "sol diesis", "la diesis", "ré bemolle", "mi bemolle", "sol bemolle", "la bemolle", "si bemolle"],
				es: ["do", "ré", "mi", "fa", "sol", "la", "si", "do sostenido", "ré sostenido", "fa sostenido", "sol sostenido", "la sostenido", "ré bemol", "mi bemol", "sol bemol", "la bemol", "si bemol"],
				ro: ["do", "ré", "mi", "fa", "sol", "la", "si", "do diez", "ré diez", "fa diez", "sol diez", "la diez", "ré bemol", "mi bemol", "sol bemol", "la bemol", "si bemol"],
				lv: ["do", "ré", "mi", "fa", "sol", "la", "si", "do diez", "ré diez", "fa diez", "sol diez", "la diez", "ré bemol", "mi bemol", "sol bemol", "la bemol", "si bemol"],
				pt: [
					"Dó",
					"Ré",
					"Mi",
					"Fá",
					"Sol",
					"Lá",
					"Si",
					"Dó sustenido",
					"Ré sustenido",
					"Fá sustenido",
					"Sol sustenido",
					"Lá sustenido",
					"Si sustenido",
					"Ré bemol",
					"Mi bemol",
					"Sol bemol",
					"Lá bemol",
					"Si bemol",
				],
				bg: ["до", "ре", "ми", "фа", "сол", "ла", "си", "д диезо", "ре диез", "фа диез", "сол диез", "ла диез", "ре бемол", "ми бемол", "сол бемол", "ла бемол", "си бемол"],
				ru: ["до", "ре", "ми", "фа", "соль", "ля", "си", "до диез", "ре диез", "фа диез", "соль диез", "ля диез", "ре бемоль", "ми бемоль", "соль бемоль", "ля бемоль", "си бемоль"],
				el: ["Ντο", "Ρε", "Μι", "Φα", "Σολ", "Λα", "Σι", "Ντο δίεση", "Ρε δίεση", "Φα δίεση", "Σολ δίεση", "Λα δίεση", "Ρε ύφεση", "Μι ύφεση", "Σολ ύφεση", "Λα ύφεση", "Σι ύφεση"],
				ja: ["ハ", "ニ", "ホ", "ヘ", "ト", "イ", "ロ", "嬰ハ", "嬰ニ", "嬰ヘ", "嬰ト", "嬰イ", "変ニ", "変ホ", "変ト", "変イ", "変ロ"],
			},
			getTextLanguageArray(index) {
				const code = Object.keys(this.textLanguage)[index];
				return this.textLanguage[code];
			},
			getTextLanguageNoteIndex(note) {
				return this.abcJSBasenotes.indexOf(note);
			},
			get ABCJSnotes() {
				const p = ocjeneOptions.keys.index <= 7 ? "A" : "B";
				return this[p];
			},
		},
		clefs: {
			Violin: "treble",
			Sopran: "alto1",
			Mezzosopran: "alto2",
			Alto: "alto",
			Tenor: "tenor",
			Bariton: "bass3",
			Bass: "bass",
		},
		timeSignatures: [
			[2, 2],
			[2, 4],
			[3, 4],
			[4, 4],
			[3, 8],
			[6, 8],
			[7, 8],
			[9, 8],
			[12, 8],
		],
		keySignatures: ["Dur", "Moll"],
		keys: [
			["C", "Am", []],
			["G", "Em", [6]],
			["D", "Bm", [6, 1]],
			["A", "F#m", [6, 1, 8]],
			["E", "C#m", [6, 1, 8, 3]],
			["B", "G#m", [6, 1, 8, 3, 10]],
			["F#", "D#m", [6, 1, 8, 3, 10]],
			["C#", "A#m", [6, 1, 8, 3, 10]],
			["F", "Dm", [10]],
			["Bb", "Gm", [10, 3]],
			["Eb", "Cm", [10, 3, 8]],
			["Ab", "Fm", [10, 3, 8, 1]],
			["Db", "Bbm", [10, 3, 8, 1, 6]],
			["Gb", "Ebm", [10, 3, 8, 1, 6]],
			["Cb", "Abm", [10, 3, 8, 1, 6]],
		],
		accidentals: [1, 3, 6, 8, 10],
		get keyAccidentals() {
			return ocjeneOptions.definitions.keys[ocjeneOptions.keys.index][2];
		},
	},
};

const ocjeneInstruments = {
	index: 0,
	indexOrig: 0,
	get instrument() {
		return this.data[this.index];
	},
	get firstPitch() {
		return randomObjectCentered(this.getRange.lower, this.getRange.upper, ocjeneOptions.firstPitchIterations.val);
	},
	get getRange() {
		if (!ocjeneOptions.limitRange.state) {
			return this.instrument.range;
		}
		const base = ocjeneOptions.limitRange.base - 3 * ocjeneOptions.clef.index;
		return {
			lower: Math.max(this.instrument.range.lower, base - ocjeneOptions.rangeOffset.val),
			upper: Math.min(this.instrument.range.upper, base + ocjeneOptions.rangeOffset.val),
		};
	},
	data: [
		{
			Name: "Klavier",
			group: "Strings",
			range: {
				lower: 33,
				upper: 108,
			},
			clef: "Violin",
		},
		{
			Name: "Geige",
			group: "Strings",
			range: {
				lower: 55,
				upper: 103,
			},
			clef: "Violin",
		},
		{
			Name: "Viola",
			group: "Strings",
			range: {
				lower: 48,
				upper: 91,
			},
			clef: "Violin",
		},
		{
			Name: "Cello",
			group: "Strings",
			range: {
				lower: 36,
				upper: 76,
			},
			clef: "Violin",
		},
		{
			Name: "Kontrabass",
			group: "Strings",
			range: {
				lower: 28,
				upper: 67,
			},
			clef: "Bass",
		},
		{
			Name: "Bassgitarre",
			group: "Strings",
			range: {
				lower: 28,
				upper: 67,
			},
			clef: "Bass",
		},
		{
			Name: "Gitarre",
			group: "Strings",
			range: {
				lower: 40,
				upper: 88,
			},
			clef: "Violin",
		},
		{
			Name: "Tuba",
			group: "Brass",
			range: {
				lower: 28,
				upper: 58,
			},
			clef: "Bass",
		},
		{
			Name: "Bassposaune",
			group: "Brass",
			range: {
				lower: 34,
				upper: 67,
			},
			clef: "Bass",
		},
		{
			Name: "Posaune",
			group: "Brass",
			range: {
				lower: 40,
				upper: 72,
			},
			clef: "Bass",
		},
		{
			Name: "Flügelhorn",
			group: "Brass",
			range: {
				lower: 34,
				upper: 77,
			},
			clef: "Violin",
		},
		{
			Name: "Trompete",
			group: "Brass",
			range: {
				lower: 55,
				upper: 82,
			},
			clef: "Violin",
		},
		{
			Name: "Piccoloflöte",
			group: "Woodwinds",
			range: {
				lower: 74,
				upper: 102,
			},
			clef: "Violin",
		},
		{
			Name: "Flöte",
			group: "Woodwinds",
			range: {
				lower: 60,
				upper: 96,
			},
			clef: "Violin",
		},
		{
			Name: "Oboe",
			group: "Woodwinds",
			range: {
				lower: 58,
				upper: 91,
			},
			clef: "Violin",
		},
		{
			Name: "Altflöte",
			group: "Woodwinds",
			range: {
				lower: 55,
				upper: 91,
			},
			clef: "Violin",
		},
		{
			Name: "Englischhorn",
			group: "Woodwinds",
			range: {
				lower: 52,
				upper: 81,
			},
			clef: "Violin",
		},
		{
			Name: "Klarinette",
			group: "Woodwinds",
			range: {
				lower: 50,
				upper: 94,
			},
			clef: "Violin",
		},
		{
			Name: "Bassklarinette",
			group: "Woodwinds",
			range: {
				lower: 38,
				upper: 77,
			},
			clef: "Violin",
		},
		{
			Name: "Fagott",
			group: "Woodwinds",
			range: {
				lower: 34,
				upper: 75,
			},
			clef: "Bass",
		},
		{
			Name: "Kontrafagott",
			group: "Woodwinds",
			range: {
				lower: 22,
				upper: 53,
			},
			clef: "Bass",
		},
		{
			Name: "Sopranblockflöte",
			group: "Woodwinds",
			range: {
				lower: 72,
				upper: 98,
			},
			clef: "Violin",
		},
		{
			Name: "Altblockflöte",
			group: "Woodwinds",
			range: {
				lower: 65,
				upper: 91,
			},
			clef: "Violin",
		},
		{
			Name: "Tenorblockflöte",
			group: "Woodwinds",
			range: {
				lower: 60,
				upper: 86,
			},
			clef: "Violin",
		},
		{
			Name: "Bassblockflöte",
			group: "Woodwinds",
			range: {
				lower: 53,
				upper: 79,
			},
			clef: "Bass",
		},
		{
			Name: "Baritonsaxophon",
			group: "Woodwinds",
			range: {
				lower: 36,
				upper: 69,
			},
			clef: "Violin",
		},
		{
			Name: "Tenorsaxophon",
			group: "Woodwinds",
			range: {
				lower: 44,
				upper: 76,
			},
			clef: "Violin",
		},
		{
			Name: "Altsaxophon",
			group: "Woodwinds",
			range: {
				lower: 49,
				upper: 81,
			},
			clef: "Violin",
		},
		{
			Name: "Sopranosaxophon",
			group: "Woodwinds",
			range: {
				lower: 56,
				upper: 88,
			},
			clef: "Violin",
		},
		{
			Name: "Glockenspiel",
			group: "Percussion",
			range: {
				lower: 79,
				upper: 108,
			},
			clef: "Violin",
		},
		{
			Name: "Xylophon",
			group: "Percussion",
			range: {
				lower: 65,
				upper: 108,
			},
			clef: "Violin",
		},
		{
			Name: "Vibraphon",
			group: "Percussion",
			range: {
				lower: 53,
				upper: 89,
			},
			clef: "Violin",
		},
		{
			Name: "Marimba",
			group: "Percussion",
			range: {
				lower: 45,
				upper: 96,
			},
			clef: "Violin",
		},
		{
			Name: "Bass Marimba",
			group: "Percussion",
			range: {
				lower: 33,
				upper: 81,
			},
			clef: "Violin",
		},
		{
			Name: "Celesta",
			group: "Percussion",
			range: {
				lower: 60,
				upper: 108,
			},
			clef: "Violin",
		},
		{
			Name: "Röhrenglocken",
			group: "Percussion",
			range: {
				lower: 60,
				upper: 77,
			},
			clef: "Violin",
		},
		{
			Name: "Pauken",
			group: "Percussion",
			range: {
				lower: 40,
				upper: 55,
			},
			clef: "Bass",
		},
		{
			Name: "Cembalo",
			group: "Percussion",
			range: {
				lower: 29,
				upper: 89,
			},
			clef: "Violin",
		},
		{
			Name: "Harfe",
			group: "Percussion",
			range: {
				lower: 24,
				upper: 103,
			},
			clef: "Violin",
		},
	],
};

const ocjeneSong = {
	spread: 4,
	title: "",
	author: "",
	get header() {
		const config = {
			T: `${firstLetterCap(this.title)}`, //Title --- shot bars:    \n%%barnumbers 1
			C: `M: ${this.author}`, //Author
			S: `${new Date().getFullYear()}, Khage`, // copyright
			M: ocjeneOptions.timeSignature.currSignature.join("/"), //Taktart
			L: `1/${ocjeneOptions.division}`, // kleinster Notenwert
			Q: `1/4=${ocjeneOptions.tempo.val}`, // tempo
			K: `${ocjeneOptions.keys.current} clef=${ocjeneOptions.clef.val()}`, //  Tonart, Reihenfolge wichtig!
		};
		return (
			Object.entries(config)
				.map(([key, value]) => `${key}:${value}\n`)
				.join("") + "%\n"
		);
	},
	get songlength() {
		return ocjeneOptions.bars.val * this.barLength;
	},
	get remainingSongLength() {
		return this.songlength - this.currentSongLength;
	},
	currentSongLength: 0,
	get barLength() {
		return ocjeneOptions.timeSignature.currSignature[0] * (ocjeneOptions.division / ocjeneOptions.timeSignature.currSignature[1]);
	},
	get remainingBarLength() {
		return this.barLength - (ocjeneSong.currentSongLength % this.barLength);
	},
	noteData: [],
	abcJSSong: "",
	abcJSText: "",
};

class ocjeneNote {
	constructor(type, duration, timeStamp, tripletIndex, splitIndex = null, splitMidiPitch = null) {
		this.abcJSPitch = null;
		this.midiPitch = null;
		this.resolved = false;
		this.type = type;
		this.duration = duration;
		this.timeStamp = timeStamp;
		this.tripletIndex = tripletIndex;
		this.splitIndex = splitIndex;
		this.spaceStembar = false;
		this.slur = null;
		this.addToSongData();
		this.createPitch(splitMidiPitch);
		this.checkSplit();
		this.checkSpace();
		this.translatePitch();
	}
	addToSongData() {
		if (this.splitIndex == null) {
			ocjeneSong.noteData.push(this);
			ocjeneSong.currentSongLength += this.duration;
		} else {
			ocjeneSong.noteData.splice(this.splitIndex, 1, this);
		}
	}
	getDataIndex() {
		return ocjeneSong.noteData.findIndex((obj) => obj === this);
	}
	getDurationIndex() {
		return ocjeneOptions.notenwerte.noteArrays[this.type].indexOf(this.duration);
	}
	checkSplit() {
		if (this.type == "triplet") return;
		if (!ocjeneOptions.barOverflowStop.state && this.isCrossingBar()) {
			const barStamp = (this.getBar() + 1) * ocjeneSong.barLength;
			const tsEnd = this.timeStamp + this.duration;
			const newDuration = barStamp - this.timeStamp;
			const addedNoteDuration = tsEnd - barStamp;
			this.split(newDuration, addedNoteDuration);
			return;
		}

		if (this.getDurationIndex() < 3) {
			if (this.timeStamp % ocjeneOptions.notenwerte.quaternote != 0) {
				const newDuration = this.timeStamp % ocjeneOptions.notenwerte.quaternote;
				const addedNoteDuration = this.duration - newDuration;
				this.split(newDuration, addedNoteDuration);
				return;
			}
		}
	}
	split(newDuration, addedNoteDuration) {
		this.duration = newDuration;
		this.slur = true;
		let ts = this.timeStamp + newDuration;
		new ocjeneNote(this.type, addedNoteDuration, ts, 0, this.getDataIndex() + 1, this.midiPitch);
	}
	checkSpace() {
		const dIndex = this.getDurationIndex();
		if (dIndex < 3) return;
		if (this.type == "triplet") return;
		if (this.midiPitch == null) return (this.spaceStembar = true);

		const num = ocjeneOptions.timeSignature.currSignature[0];
		const den = ocjeneOptions.timeSignature.currSignature[1];
		let splitTime;
		let dIndexMultiplyer = dIndex - 2;
		if (dIndex == 3 && den % num == 0) dIndexMultiplyer = dIndex - 1;
		if ((num * den) % 3 == 0) {
			splitTime = this.duration * 3 * dIndexMultiplyer;
		} else {
			splitTime = this.duration * 2 * dIndexMultiplyer;
		}
		if (this.timeStamp % splitTime == 0) this.spaceStembar = true;
	}
	getBar(offset = 0) {
		return Math.floor((this.timeStamp + offset) / ocjeneSong.barLength);
	}
	isCrossingBar() {
		return this.getBar() != this.getBar(this.duration - 1);
	}
	isOnNewBar() {
		if (this.timeStamp == 0) return false;
		let a = this.timeStamp % ocjeneSong.barLength == 0;
		return this.timeStamp % ocjeneSong.barLength == 0;
	}

	createPitch(splitMidiPitch) {
		if (splitMidiPitch) {
			this.midiPitch = splitMidiPitch;
			return;
		}
		const lastNoteIndex = ocjeneSong.noteData.findLastIndex((n) => n.midiPitch != null);
		if (lastNoteIndex == -1) {
			this.midiPitch = ocjeneInstruments.firstPitch;
		} else {
			const prevPitch = ocjeneSong.noteData[lastNoteIndex].midiPitch;
			const interval = randomObject(ocjeneOptions.interval.val * -1, ocjeneOptions.interval.val);
			const nextPitch = prevPitch + interval;
			if (nextPitch < ocjeneInstruments.getRange.lower) this.midiPitch = prevPitch + Math.abs(interval);
			else if (nextPitch > ocjeneInstruments.getRange.upper) this.midiPitch = prevPitch - Math.abs(interval);
			else this.midiPitch = nextPitch;
		}
		// correct Pitch if "keyOnly"
		const accArr = ocjeneOptions.keyOnly.state ? ocjeneOptions.definitions.accidentals : []; // ocjeneOptions.definitions.keyAccidentals;
		if (accArr.includes(this.midiPitch % 12)) {
			this.midiPitch += ocjeneOptions.keys.shiftDir;
		}
		this.createRest();
	}
	createRest() {
		const prevPitch = this.getDataIndex() == 0 ? ocjeneSong.noteData[0].midiPitch : ocjeneSong.noteData[this.getDataIndex() - 1].midiPitch;
		if (prevPitch == null) return;
		if (Math.random() * 100 < ocjeneOptions.rests.val) this.midiPitch = null;
	}

	translatePitch() {
		const midiIndex = ocjeneOptions.definitions.notes.midi.indexOf(this.midiPitch);
		let pitch = this.midiPitch == null ? "z" : ocjeneOptions.definitions.notes.ABCJSnotes[midiIndex];
		let duration = this.duration;

		let prefix = this.isOnNewBar() ? " |" : "";
		prefix += this.spaceStembar ? " " : "";
		let postfix = this.slur ? "-" : "";
		if (this.type == "triplet") {
			const durationIndex = this.getDurationIndex();
			prefix += this.tripletIndex == 0 ? " (3" : "";
			postfix = this.tripletIndex == 2 ? " " : "";
			duration = ocjeneOptions.notenwerte.noteArrays.base[durationIndex];
		}
		if (this.resolved) {
			pitch = pitch.replace(/[^_]/, "");
			pitch = `=${pitch}`;
		}

		this.abcJSPitch = `${prefix}${pitch}${duration}${postfix}`;
	}
	translateText() {
		if (this.midiPitch == null) return "";
		if (this.getDataIndex() > 0 && !this.isOnNewBar() && ocjeneSong.noteData[this.getDataIndex() - 1].slur == true) return "* ";

		// clean Notetext
		const midiIndex = ocjeneOptions.definitions.notes.midi.indexOf(this.midiPitch);
		let text = ocjeneOptions.definitions.notes.ABCJSnotes[midiIndex].toUpperCase();
		text = text.replace(/[',]/g, "");
		const index = ocjeneOptions.definitions.notes.getTextLanguageNoteIndex(text);
		const arr = ocjeneOptions.definitions.notes.getTextLanguageArray(ocjeneOptions.textLanguage.index);
		return `${arr[index]} `;
	}
}
let failSafe = 10;
function ocjeneGenerate() {
	// console.clear();
	btnColor("idBtn_ocjeneGenerate", null);
	ocjeneSong.title = randomObject(netsaonaOptions.data.Random);
	ocjeneSong.author = "Khage"; //randomObject(netsaonaOptions.data.Name);
	ocjeneSong.noteData = [];
	ocjeneSong.currentSongLength = 0;

	let failSafeCurr = 10;
	while (ocjeneSong.currentSongLength < ocjeneSong.songlength) {
		let fail = {};
		if (Math.random() * 100 < ocjeneOptions.triplet.val) {
			let arr = ocjeneOptions.notenwerte.noteArrays.triplet.slice();
			fail = ocjeneCreateNote(arr, "triplet");
		} else if (Math.random() * 100 < ocjeneOptions.dotted.val) {
			let arr = ocjeneOptions.notenwerte.noteArrays.dotted.slice();
			fail = ocjeneCreateNote(arr, "dotted");
		} else {
			let arr = ocjeneOptions.notenwerte.noteArrays.base.slice();
			fail = ocjeneCreateNote(arr, "base");
		}
		if (fail.error) {
			// console.log(fail);
			failSafeCurr--;
			if (failSafeCurr <= 0) {
				failSafe--;
				if (failSafe <= 0) {
					alert("FATAL ERROR!");
					return;
				}
				ocjeneGenerate();
				console.log("impossible!!!", ocjeneSong.remainingSongLength);
				// alert("Taktart kann nicht mit gewählter Taktzahl und gewählten Notenlängen errreicht werden.");
				return;
			}
		}
	}
	ocjeneCleanAfterGeneration();
	ocjeneDraw();
	// console.log(ocjeneSong.abcJSSong);
	failSafe = 10;
}

function ocjeneCleanAfterGeneration() {
	if (ocjeneOptions.keyOnly.state) return;
	let bars = [[]];
	for (let n of ocjeneSong.noteData) {
		let b = n.getBar();
		if (bars[b] == undefined) bars[b] = [];
		bars[b].push([n, 0]);
	}
	const dir = ocjeneOptions.keys.shiftDir;
	// console.log(bars);
	for (let b of bars) {
		for (let i = 0; i < b.length; i++) {
			const n = b[i];
			let midiPitch = n[0].midiPitch % 12;
			if (ocjeneOptions.definitions.keyAccidentals.includes(midiPitch)) {
				if (ocjeneOptions.definitions.accidentals.includes(midiPitch)) {
					n[1] = dir * -1;
				}
			}
			if (ocjeneOptions.definitions.keyAccidentals.includes(midiPitch - dir)) {
				n[0].resolved = true;
			}

		}
	}

	for (let b of bars) {
		for (let n of b) {
			n[0].midiPitch = n[0].midiPitch + n[1];
			n[0].translatePitch();
		}
	}

	return;

	const accArr = ocjeneOptions.keyOnly.state ? ocjeneOptions.definitions.accidentals : []; // ocjeneOptions.definitions.keyAccidentals;
	if (accArr.includes(this.midiPitch % 12)) {
		this.midiPitch += ocjeneOptions.keys.shiftDir;
	}

	// correct if note is acc and is present in key (shift)
	// correct if note is base and is present as acc in key (-1 * shift)

	// for (let i = ocjeneSong.noteData.length - 1; i > 0; i--) {
	// 	note = ocjeneSong.noteData[i];
	// }
	// ocjeneSong.abcJSSong = "";
}

function ocjeneCreateNote(arr, type) {
	let possibleNotes = [];
	for (let i = 0; i < ocjeneOptions.notenwerte.selected.length; i++) {
		if (!ocjeneOptions.notenwerte.selected[i]) continue;
		if (type == "triplet" && i < 3) continue;
		if (type == "dotted" && i == 0) continue;
		possibleNotes.push(arr[i]);
	}
	let mult = type == "triplet" ? 3 : 1;
	mult = type == "dotted" ? 2 : 1;

	possibleNotes = possibleNotes.filter((n) => n * mult <= ocjeneSong.remainingSongLength);
	if (ocjeneOptions.barOverflowStop.state) possibleNotes = possibleNotes.filter((n) => n * mult <= ocjeneSong.remainingBarLength);
	if (possibleNotes.length == 0) return { error: true, type: type, l: ocjeneSong.remainingBarLength };

	//more doubled 1/16 and 1/32
	ocjeneIncreasePossibilities(type, possibleNotes);
	const duration = randomObject(possibleNotes);
	new ocjeneNote(type, duration, ocjeneSong.currentSongLength, 0);
	if (type == "triplet") {
		new ocjeneNote(type, duration, ocjeneSong.currentSongLength, 1);
		new ocjeneNote(type, duration, ocjeneSong.currentSongLength, 2);
	}
	return { error: false };
}

function ocjeneIncreasePossibilities(type, possibleNotes) {
	if (type != "base") return;
	if (ocjeneSong.noteData.length < 2) return;
	let prev1 = ocjeneSong.noteData[ocjeneSong.noteData.length - 1];
	if (type != prev1.type) return;
	let prev2 = ocjeneSong.noteData[ocjeneSong.noteData.length - 2];
	if (prev1.getDurationIndex() > 2 && prev1.duration != prev2.duration) {
		possibleNotes.push(prev1.duration);
		possibleNotes.push(prev1.duration);
	}
}

function ocjeneGetSongData() {
	let song = "";
	let text = "";
	for (let n of ocjeneSong.noteData) {
		song += n.abcJSPitch;
		text += n.translateText();
	}
	song += "|]";
	text += "]";
	ocjeneSong.abcJSSong = song;
	ocjeneSong.abcJSText = text;
}

function ocjeneDraw() {
	ocjeneGetSongData();

	let text = ocjeneOptions.showText.state ? `w: ${ocjeneSong.abcJSText}` : "";
	const res = `${ocjeneSong.header}${ocjeneSong.abcJSSong}\n${text}`;
	const drawOptions = {
		// print:true, // show in DINA4 format
		staffwidth: 400, // hier wird die weite width bestimmt!
		wrap: {
			minSpacing: 1.8,
			maxSpacing: 2.7,
			preferredMeasuresPerLine: ocjeneSong.spread,
		},
	};
	// let abcSynth = new ABCJS.synth.CreateSynth();
	// let abdObj = ABCJS.renderAbc(ocjeneOptions.div, res, drawOptions)[0];
	ABCJS.renderAbc(ocjeneOptions.div, res, drawOptions);
}

function clear_cl_Ocjene(preset = null) {
	// dbID("idCanv_ocjeneSheet").innerHTML = "";
	dbIDStyle("idCanv_ocjeneSheet").backgroundColor = "#FFFFF3";
	dbIDStyle("idCanv_ocjeneSheet").color = "#000000";

	ocjeneOptions.firstPitchIterations.val = preset === null ? ocjeneOptions.firstPitchIterations.valOrig : ocjeneSettings.get("firstPitchIterations");

	ocjeneOptions.tempo.val = preset === null ? ocjeneOptions.tempo.valOrig : ocjeneSettings.get("tempo");
	resetInput("idVin_ocjeneTempo", ocjeneOptions.tempo.val, {
		min: ocjeneOptions.tempo.min,
		max: ocjeneOptions.tempo.max,
	});

	ocjeneOptions.bars.val = preset === null ? ocjeneOptions.bars.valOrig : ocjeneSettings.get("bars");
	resetInput("idVin_ocjeneBars", ocjeneOptions.bars.val, {
		max: ocjeneOptions.bars.max,
	});

	ocjeneOptions.interval.val = preset === null ? ocjeneOptions.interval.valOrig : ocjeneSettings.get("interval");
	resetInput("idVin_ocjeneInterval", ocjeneOptions.interval.val, {
		max: ocjeneOptions.bars.max,
	});

	ocjeneOptions.timeSignature.index = preset === null ? ocjeneOptions.timeSignature.indexOrig : ocjeneSettings.get("timeSignature");
	const selSignature = dbID("idSel_ocjeneTimeSignature");
	clearFirstChild("idSel_ocjeneTimeSignature");
	for (const [index, opt] of ocjeneOptions.definitions.timeSignatures.entries()) {
		const option = document.createElement("OPTION");
		option.textContent = opt.join("/");
		option.value = opt.join("/");
		if (index == ocjeneOptions.timeSignature.index) option.selected = true;
		selSignature.appendChild(option);
	}

	ocjeneOptions.notenwerte.selected = preset === null ? ocjeneOptions.notenwerte.selectedOrig.slice() : ocjeneSettings.get("notenwerte");
	const notenwertCB = dbCL("cl_ocjeneNotenwerte", null);
	for (let i = 0; i < notenwertCB.length; i++) {
		notenwertCB[i].checked = ocjeneOptions.notenwerte.selected[i];
		notenwertCB[i].setAttribute("data-index", i);
	}
	// ocjeneOptions.notenwerte.createDivisions();

	ocjeneInstruments.index = ocjeneInstruments.indexOrig;
	const selInstruemnts = dbID("idSel_ocjeneInstrument");
	clearFirstChild("idSel_ocjeneInstrument");
	let groups = {};
	for (const vals of Object.values(ocjeneInstruments.data)) {
		if (groups[vals.group] === undefined) {
			groups[vals.group] = [vals];
		} else {
			groups[vals.group].push(vals);
		}
	}
	for (let [name, arr] of Object.entries(groups)) {
		let optGroup = document.createElement("optgroup");
		optGroup.label = name;
		for (let opt of arr) {
			const option = document.createElement("OPTION");
			option.textContent = opt.Name;
			option.value = opt.Name;
			optGroup.appendChild(option);
		}
		selInstruemnts.appendChild(optGroup);
	}

	ocjeneOptions.clef.index = preset === null ? ocjeneOptions.clef.indexOrig : ocjeneSettings.get("clef");
	const selClefs = dbID("idSel_ocjeneClefs");
	clearFirstChild("idSel_ocjeneClefs");
	for (let i = 0; i < Object.keys(ocjeneOptions.definitions.clefs).length; i++) {
		const option = document.createElement("OPTION");
		option.textContent = ocjeneOptions.clef.name(i);
		option.value = ocjeneOptions.clef.val(i);
		if (i == ocjeneOptions.clef.index) {
			option.selected = true;
		}
		selClefs.appendChild(option);
	}

	ocjeneOptions.keySignatures.index = ocjeneOptions.keySignatures.indexOrig;
	ocjeneOptions.keys.index = preset === null ? ocjeneOptions.keys.indexOrig : ocjeneSettings.get("keys");
	const selKeySignatures = dbID("idSel_ocjeneKeySignature");
	clearFirstChild("idSel_ocjeneKeySignature");
	for (const [index, opt] of ocjeneOptions.definitions.keySignatures.entries()) {
		const option = document.createElement("OPTION");
		option.textContent = opt;
		option.value = opt;
		if (index == ocjeneOptions.keys.index) option.selected = true;
		selKeySignatures.appendChild(option);
	}
	ocjenePopulateKeys(); // this needs to be below the KeySignatre definition!!

	ocjeneOptions.keyOnly.state = preset === null ? ocjeneOptions.keyOnly.stateOrig : ocjeneSettings.get("keyOnly");
	dbID("idCb_ocjeneKeyOnly").checked = ocjeneOptions.keyOnly.state;

	// ocjeneOptions.dotted.state = preset === null ? ocjeneOptions.dotted.stateOrig : ocjeneSettings.get("dotted");
	// dbID("idCb_ocjeneDotted").checked = ocjeneOptions.dotted.state;
	ocjeneOptions.dotted.val = preset === null ? ocjeneOptions.dotted.valOrig : ocjeneSettings.get("dotted");
	resetInput("idVin_ocjeneDotted", ocjeneOptions.dotted.val, {
		min: ocjeneOptions.dotted.min,
		max: ocjeneOptions.dotted.max,
	});

	// ocjeneOptions.triplet.state = preset === null ? ocjeneOptions.triplet.stateOrig : ocjeneSettings.get("triplet");
	// dbID("idCb_ocjeneTriplet").checked = ocjeneOptions.triplet.state;
	ocjeneOptions.triplet.val = preset === null ? ocjeneOptions.triplet.valOrig : ocjeneSettings.get("triplet");
	resetInput("idVin_ocjeneTriplet", ocjeneOptions.triplet.val, {
		min: ocjeneOptions.triplet.min,
		max: ocjeneOptions.triplet.max,
	});

	ocjeneOptions.barOverflowStop.state = preset === null ? ocjeneOptions.barOverflowStop.stateOrig : ocjeneSettings.get("barOverflowStop");
	dbID("idCb_ocjeneBarOverflowStop").checked = ocjeneOptions.barOverflowStop.state;

	ocjeneOptions.limitRange.state = preset === null ? ocjeneOptions.limitRange.stateOrig : ocjeneSettings.get("limitRange");
	ocjeneOptions.rangeOffset.val = preset === null ? ocjeneOptions.rangeOffset.valOrig : ocjeneSettings.get("rangeOffset");
	dbID("idCb_ocjeneLimitRange").checked = ocjeneOptions.limitRange.state;

	ocjeneOptions.showText.state = preset === null ? ocjeneOptions.showText.stateOrig : ocjeneSettings.get("showText");
	dbID("idCb_ocjeneShowText").checked = ocjeneOptions.showText.state;

	ocjeneOptions.textLanguage.index = preset === null ? ocjeneOptions.textLanguage.indexOrig : ocjeneSettings.get("textLanguage");
	const textLanguage = dbID("idSel_ocjeneTextLanguage");
	clearFirstChild("idSel_ocjeneTextLanguage");
	for (let i = 0; i < Object.keys(ocjeneOptions.definitions.notes.textLanguage).length; i++) {
		const option = document.createElement("OPTION");
		option.textContent = ocjeneOptions.textLanguage.name(i);
		option.value = ocjeneOptions.textLanguage.val(i);
		if (i == ocjeneOptions.textLanguage.index) {
			option.selected = true;
		}
		textLanguage.appendChild(option);
	}

	ocjeneOptions.rests.val = preset === null ? ocjeneOptions.rests.valOrig : ocjeneSettings.get("rests");
	resetInput("idVin_ocjeneRests", ocjeneOptions.rests.val, {
		min: ocjeneOptions.rests.min,
		max: ocjeneOptions.rests.max,
	});

	setTimeout(ocjeneGenerate, 300);
	// if (globalValues.hostDebug || preset) {
	//   setTimeout(ocjeneGenerate, 300)
	// } else {
	//   btnColor("idBtn_ocjeneGenerate", "positive");
	// }
}

function ocjenePopulateKeys() {
	let selKey = dbID("idSel_ocjeneKey");
	clearFirstChild("idSel_ocjeneKey");
	for (const [index, opt] of ocjeneOptions.definitions.keys.entries()) {
		const option = document.createElement("OPTION");
		option.textContent = opt[ocjeneOptions.keySignatures.index];
		option.value = opt[ocjeneOptions.keySignatures.index];
		if (index == 0 && ocjeneOptions.keys.index == null) {
			option.selected = true;
		} else if (index == ocjeneOptions.keys.index) {
			option.selected = true;
		}
		selKey.appendChild(option);
	}
}

function ocjeneNotenwert(obj) {
	const index = obj.dataset.index;
	ocjeneOptions.notenwerte.selected[index] = obj.checked;
	ocjeneInputChange();
}

function ocjeneTimeSignature(obj) {
	ocjeneOptions.timeSignature.index = obj.selectedIndex;
	ocjeneInputChange();
}

function ocjeneInstrument(obj) {
	ocjeneInstruments.index = obj.selectedIndex;
	ocjeneOptions.clef.index = Object.keys(ocjeneOptions.definitions.clefs).indexOf(ocjeneInstruments.instrument.clef);
	dbID("idSel_ocjeneClefs").selectedIndex = ocjeneOptions.clef.index;
	ocjeneInputChange();
}

function ocjeneInterval(obj) {
	ocjeneOptions.interval.val = Number(obj.value);
	ocjeneInputChange();
}

function ocjeneClefs(obj) {
	ocjeneOptions.clef.index = obj.selectedIndex;
	ocjeneDraw();
}

function ocjeneKeySignature(obj) {
	ocjeneOptions.keySignatures.index = obj.selectedIndex;
	ocjenePopulateKeys();
	ocjeneInputChange();
}

function ocjeneKey(obj) {
	ocjeneOptions.keys.index = obj.selectedIndex;
	ocjeneInputChange();
}

function ocjeneKeyOnly(obj) {
	ocjeneOptions.keyOnly.state = obj.checked;
	ocjeneInputChange();
}

function ocjeneDotted(obj) {
	// ocjeneOptions.dotted.state = obj.checked;
	ocjeneOptions.dotted.val = obj.value;
	ocjeneInputChange();
}

function ocjeneTriplet(obj) {
	// ocjeneOptions.triplet.state = obj.checked;
	ocjeneOptions.triplet.val = obj.value;
	ocjeneInputChange();
}

function ocjeneShowText(obj) {
	ocjeneOptions.showText.state = obj.checked;
	ocjeneDraw();
}

function ocjeneTextLanguage(obj) {
	ocjeneOptions.textLanguage.index = obj.selectedIndex;
	ocjeneDraw();
}

function ocjeneTempo(obj) {
	ocjeneOptions.tempo.val = obj.value;
	ocjeneDraw();
}

function ocjeneBars(obj) {
	ocjeneOptions.bars.val = obj.value;
	ocjeneInputChange();
}

function ocjeneBarOverflowStop(obj) {
	ocjeneOptions.barOverflowStop.state = obj.checked;
	ocjeneInputChange();
}

function ocjeneLimitRange(obj) {
	ocjeneOptions.limitRange.state = obj.checked;
	ocjeneInputChange();
}

function ocjeneRests(obj) {
	ocjeneOptions.rests.val = obj.value;
	ocjeneInputChange();
}

function ocjeneInputChange() {
	btnColor("idBtn_ocjeneGenerate", "positive");
}

function ocjeneRandom(obj) {
	ocjeneSettings.level = Number(obj.dataset.level);
	clear_cl_Ocjene(true);
}

const ocjeneSettings = {
	level: 0,
	get(fn) {
		return this.data[fn];
	},
	data: {
		get firstPitchIterations() {
			if (ocjeneSettings.level == 0) return 20;
			if (ocjeneSettings.level == 1) return 6;
			if (ocjeneSettings.level == 2) return 4;
		},
		get tempo() {
			if (ocjeneSettings.level == 0) return randomObject(80, 100);
			if (ocjeneSettings.level == 1) return randomObject(70, 135);
			if (ocjeneSettings.level == 2) return randomObject(60, 190);
		},
		get bars() {
			if (ocjeneSettings.level == 0) return 4;
			if (ocjeneSettings.level == 1) return 8;
			if (ocjeneSettings.level == 2) return 16;
		},
		get barOverflowStop() {
			if (ocjeneSettings.level == 0) return true;
			if (ocjeneSettings.level == 1) return false;
			if (ocjeneSettings.level == 2) return false;
		},
		get showText() {
			if (ocjeneSettings.level == 0) return true;
			if (ocjeneSettings.level == 1) return false;
			if (ocjeneSettings.level == 2) return false;
		},
		get textLanguage() {
			if (ocjeneSettings.level == 0) return 3;
			if (ocjeneSettings.level == 1) return 0;
			if (ocjeneSettings.level == 2) return 13;
		},
		get interval() {
			if (ocjeneSettings.level == 0) return 5;
			if (ocjeneSettings.level == 1) return 7;
			if (ocjeneSettings.level == 2) return 8;
		},
		get timeSignature() {
			if (ocjeneSettings.level == 0) return randomObject([2, 3]);
			if (ocjeneSettings.level == 1) return randomObject([1, 2, 3, 5, 7]);
			if (ocjeneSettings.level == 2) return randomObject(ocjeneOptions.definitions.timeSignatures.length);
		},
		get notenwerte() {
			if (ocjeneSettings.level == 0) return [1, 1, 1, 0, 0];
			if (ocjeneSettings.level == 1) return [1, 1, 1, 1, 0];
			if (ocjeneSettings.level == 2) return [0, 1, 1, 1, 1];
		},
		get clef() {
			if (ocjeneSettings.level == 0) return 0;
			if (ocjeneSettings.level == 1) return randomObject([0, 6]);
			if (ocjeneSettings.level == 2) return randomObject([0, 3, 6]); //Object.keys(ocjeneOptions.definitions.clefs).length
		},
		get keys() {
			if (ocjeneSettings.level == 0) return randomObject([0, 1, 8]);
			if (ocjeneSettings.level == 1) return randomObject([0, 1, 2, 3, 8, 9, 10]);
			if (ocjeneSettings.level == 2) return randomObject(ocjeneOptions.definitions.keys.length);
		},
		get keyOnly() {
			if (ocjeneSettings.level == 0) return true;
			if (ocjeneSettings.level == 1) return false;
			if (ocjeneSettings.level == 2) return false;
		},
		get limitRange() {
			if (ocjeneSettings.level == 0) return true;
			if (ocjeneSettings.level == 1) return true;
			if (ocjeneSettings.level == 2) return false;
		},
		get rangeOffset() {
			if (ocjeneSettings.level == 0) return 8;
			if (ocjeneSettings.level == 1) return 10;
			if (ocjeneSettings.level == 2) return 24;
		},
		get dotted() {
			if (ocjeneSettings.level == 0) return 0;
			if (ocjeneSettings.level == 1) return 15;
			if (ocjeneSettings.level == 2) return 25;
		},
		get triplet() {
			if (ocjeneSettings.level == 0) return 0;
			if (ocjeneSettings.level == 1) return 10;
			if (ocjeneSettings.level == 2) return 20;
		},
		get rests() {
			if (ocjeneSettings.level == 0) return 0;
			if (ocjeneSettings.level == 1) return 15;
			if (ocjeneSettings.level == 2) return 30;
		},
	},
};
