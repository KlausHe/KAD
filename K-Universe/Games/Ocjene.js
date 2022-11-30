// https://abcnotation.com/wiki/abc:standard:v2.1
// https://www.abcjs.net/abcjs-editor.html
// http://www.lehrklaenge.de/PHP/Grundlagen/Notenschluessel.php
// https://soundprogramming.net/file-formats/midi-note-ranges-of-orchestral-instruments/
// https://de.wikipedia.org/wiki/Liste_musikalischer_Symbole
// https://musescore.org/sl/instruments
// https://cyrusn.github.io/note/abcjs/

const ocjeneOptions = {
	get div() {
		return "idCanv_ocjeneSheet";
	},
	get maxDivisionsTotal() {
		return 2 ** (this.notenwerte.selectedOrig.length - 1);
	},
	get maxDivisionPerBar() {
		return this.timeSignature.currSignature[0] * (this.maxDivisionsTotal / this.timeSignature.currSignature[1]);
	},
	notenwert(note) {
		//recalculate the actual notelength
		return this.maxDivisionsTotal / note;
	},
	notenwerte: {
		selected: [],
		selectedOrig: [0, 1, 1, 1, 0], //1/1, 1/2, 1/4, 1/8, 1/16
		get shortest() {
			return Math.min(...this.divisions);
		},
		get longest() {
			return Math.max(...this.divisions);
		},
		divisions: [],
		createDivisions() {
			this.divisions = [];
			let revArr = [...this.selected].reverse();
			for (let i = 0; i < revArr.length; i++) {
				if (revArr[i]) this.divisions.push(2 ** i);
			}
			this.divisions.reverse();
		},
	},
	dotted: {
		state: false,
		stateOrig: false,
		probability: 0.2,
	},
	triplet: {
		state: false,
		stateOrig: false,
		probability: 0.2,
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
		valOrig: 8,
		max: 24,
		overflow: false,
	},
	showText: {
		state: false,
		stateOrig: false,
	},
	germanText: {
		state: false,
		stateOrig: false,
	},
	restProbability: {
		val: 0,
		valOrig: 0.1,
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
		indexOrig: 2,
		get current() {
			return ocjeneOptions.definitions.keys[ocjeneOptions.keys.index][ocjeneOptions.keySignatures.index];
		},
		get shiftDir() {
			return this.index <= 7 ? -1 : 1;
		},
	},
	keyOnly: {
		state: false,
		stateOrig: true,
	},
	limitRange: {
		state: false,
		stateOrig: true,
		base: 69,
	},
	rangeOffset: {
		val: 10,
		valOrig: 10,
	},
	firstNoteIterations: {
		val: 0,
		valOrig: 4,
	},
	octaved: {
		val: 0,
		valOrig: 0,
		interval: 12,
	},
	definitions: {
		notes: {
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
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
				56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
				91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
			],
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
	get firstNote() {
		let note = 0;
		const iterations = ocjeneOptions.firstNoteIterations.val;
		for (let i = 0; i < iterations; i++) {
			note += randomObject(this.getRange.lower, this.getRange.upper);
		}
		return Math.floor(note / iterations);
	},
	get getRange() {
		let lower = this.instrument.range.low;
		let upper = this.instrument.range.high;
		if (ocjeneOptions.limitRange.state) {
			let base = ocjeneOptions.limitRange.base - 3 * ocjeneOptions.clef.index;
			upper = Math.min(upper, base + ocjeneOptions.rangeOffset.val);
			lower = Math.max(lower, base - ocjeneOptions.rangeOffset.val);
		}
		return {
			lower,
			upper,
		};
	},
	data: [
		{
			Name: "Klavier",
			group: "Strings",
			range: {
				low: 33,
				high: 108,
			},
			clef: "Violin",
		},
		{
			Name: "Geige",
			group: "Strings",
			range: {
				low: 55,
				high: 103,
			},
			clef: "Violin",
		},
		{
			Name: "Viola",
			group: "Strings",
			range: {
				low: 48,
				high: 91,
			},
			clef: "Violin",
		},
		{
			Name: "Cello",
			group: "Strings",
			range: {
				low: 36,
				high: 76,
			},
			clef: "Violin",
		},
		{
			Name: "Kontrabass",
			group: "Strings",
			range: {
				low: 28,
				high: 67,
			},
			clef: "Bass",
		},
		{
			Name: "Bassgitarre",
			group: "Strings",
			range: {
				low: 28,
				high: 67,
			},
			clef: "Bass",
		},
		{
			Name: "Gitarre",
			group: "Strings",
			range: {
				low: 40,
				high: 88,
			},
			clef: "Violin",
		},
		{
			Name: "Tuba",
			group: "Brass",
			range: {
				low: 28,
				high: 58,
			},
			clef: "Bass",
		},
		{
			Name: "Bassposaune",
			group: "Brass",
			range: {
				low: 34,
				high: 67,
			},
			clef: "Bass",
		},
		{
			Name: "Posaune",
			group: "Brass",
			range: {
				low: 40,
				high: 72,
			},
			clef: "Bass",
		},
		{
			Name: "Flügelhorn",
			group: "Brass",
			range: {
				low: 34,
				high: 77,
			},
			clef: "Violin",
		},
		{
			Name: "Trompete",
			group: "Brass",
			range: {
				low: 55,
				high: 82,
			},
			clef: "Violin",
		},
		{
			Name: "Piccoloflöte",
			group: "Woodwinds",
			range: {
				low: 74,
				high: 102,
			},
			clef: "Violin",
		},
		{
			Name: "Flöte",
			group: "Woodwinds",
			range: {
				low: 60,
				high: 96,
			},
			clef: "Violin",
		},
		{
			Name: "Oboe",
			group: "Woodwinds",
			range: {
				low: 58,
				high: 91,
			},
			clef: "Violin",
		},
		{
			Name: "Altflöte",
			group: "Woodwinds",
			range: {
				low: 55,
				high: 91,
			},
			clef: "Violin",
		},
		{
			Name: "Englischhorn",
			group: "Woodwinds",
			range: {
				low: 52,
				high: 81,
			},
			clef: "Violin",
		},
		{
			Name: "Klarinette",
			group: "Woodwinds",
			range: {
				low: 50,
				high: 94,
			},
			clef: "Violin",
		},
		{
			Name: "Bassklarinette",
			group: "Woodwinds",
			range: {
				low: 38,
				high: 77,
			},
			clef: "Violin",
		},
		{
			Name: "Fagott",
			group: "Woodwinds",
			range: {
				low: 34,
				high: 75,
			},
			clef: "Bass",
		},
		{
			Name: "Kontrafagott",
			group: "Woodwinds",
			range: {
				low: 22,
				high: 53,
			},
			clef: "Bass",
		},
		{
			Name: "Sopranblockflöte",
			group: "Woodwinds",
			range: {
				low: 72,
				high: 98,
			},
			clef: "Violin",
		},
		{
			Name: "Altblockflöte",
			group: "Woodwinds",
			range: {
				low: 65,
				high: 91,
			},
			clef: "Violin",
		},
		{
			Name: "Tenorblockflöte",
			group: "Woodwinds",
			range: {
				low: 60,
				high: 86,
			},
			clef: "Violin",
		},
		{
			Name: "Bassblockflöte",
			group: "Woodwinds",
			range: {
				low: 53,
				high: 79,
			},
			clef: "Bass",
		},
		{
			Name: "Baritonsaxophon",
			group: "Woodwinds",
			range: {
				low: 36,
				high: 69,
			},
			clef: "Violin",
		},
		{
			Name: "Tenorsaxophon",
			group: "Woodwinds",
			range: {
				low: 44,
				high: 76,
			},
			clef: "Violin",
		},
		{
			Name: "Altsaxophon",
			group: "Woodwinds",
			range: {
				low: 49,
				high: 81,
			},
			clef: "Violin",
		},
		{
			Name: "Sopranosaxophon",
			group: "Woodwinds",
			range: {
				low: 56,
				high: 88,
			},
			clef: "Violin",
		},
		{
			Name: "Glockenspiel",
			group: "Percussion",
			range: {
				low: 79,
				high: 108,
			},
			clef: "Violin",
		},
		{
			Name: "Xylophon",
			group: "Percussion",
			range: {
				low: 65,
				high: 108,
			},
			clef: "Violin",
		},
		{
			Name: "Vibraphon",
			group: "Percussion",
			range: {
				low: 53,
				high: 89,
			},
			clef: "Violin",
		},
		{
			Name: "Marimba",
			group: "Percussion",
			range: {
				low: 45,
				high: 96,
			},
			clef: "Violin",
		},
		{
			Name: "Bass Marimba",
			group: "Percussion",
			range: {
				low: 33,
				high: 81,
			},
			clef: "Violin",
		},
		{
			Name: "Celesta",
			group: "Percussion",
			range: {
				low: 60,
				high: 108,
			},
			clef: "Violin",
		},
		{
			Name: "Röhrenglocken",
			group: "Percussion",
			range: {
				low: 60,
				high: 77,
			},
			clef: "Violin",
		},
		{
			Name: "Pauken",
			group: "Percussion",
			range: {
				low: 40,
				high: 55,
			},
			clef: "Bass",
		},
		{
			Name: "Cembalo",
			group: "Percussion",
			range: {
				low: 29,
				high: 89,
			},
			clef: "Violin",
		},
		{
			Name: "Harfe",
			group: "Percussion",
			range: {
				low: 24,
				high: 103,
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
			L: `1/${ocjeneOptions.maxDivisionsTotal}`, // kleinster Notenwert
			Q: `1/4=${ocjeneOptions.tempo.val}`, // tempo
			K: `${ocjeneOptions.keys.current} clef=${ocjeneOptions.clef.val()}`, //  Tonart, Reihenfolge wichtig!
		};
		return (
			Object.entries(config)
				.map(([k, v]) => `${k}:${v}\n`)
				.join("") + "%\n"
		);
	},
	data: [],
	newNote(prevNote, interval) {
		if (prevNote == null) return ocjeneInstruments.firstNote;

		if (prevNote <= ocjeneInstruments.getRange.lower) return prevNote + Math.abs(interval);
		if (prevNote >= ocjeneInstruments.getRange.upper) return prevNote - Math.abs(interval);
		return prevNote + interval;
	},
	prevNoteIndex(_bar, _n) {
		if (_bar == 0 && _n == 0) return null;
		for (let bar = _bar; bar >= 0; bar--) {
			for (let n = this.data[bar].length - 1; n >= 0; n--) {
				if (_bar == bar && n >= _n) continue;
				if (this.data[bar][n].rythm != null)
					return {
						bar,
						n,
					};
			}
		}
		return null;
	},
	nextNoteIndex(_bar, _n) {
		for (let bar = _bar; bar < this.data.length; bar++) {
			for (let n = 0; n < this.data[bar].length; n++) {
				if (_bar == bar && n <= _n) continue;
				if (this.data[bar][n].rythm != null)
					return {
						bar,
						n,
					};
			}
		}
		return null;
	},
	nextBeat(_bar, _n) {
		// let currNote = ocjeneOptions.notenwert(this.data[_bar][_n]) // 1/1 = 1, 1/2 = 2...
		const beatQuater = ocjeneOptions.maxDivisionsTotal / 4;
		let distToNext = (beatQuater - (_n % beatQuater)) % beatQuater;
		if (distToNext == 0) return null;

		let n = _n + distToNext;
		let bar = _bar;
		if (n >= ocjeneOptions.maxDivisionPerBar) {
			n = Math.min(n, ocjeneOptions.maxDivisionPerBar - 1);
		}

		// console.log(distToNext);
		return {
			bar,
			n,
			distToNext,
		};
	},
	noteParse(bar, n, tripIndex = null) {
		// THIS FUNCTION RETURNS THE ACTUAL COMBINED NOTES+SHIFT !!!
		const singleNoteState = this.data[bar][n].trips == null;
		const accArr = ocjeneOptions.keyOnly.state ? ocjeneOptions.definitions.accidentals : ocjeneOptions.definitions.keyAccidentals;
		if (singleNoteState) {
			// if a single note
			this.data[bar][n].shift = 0;
			if (accArr.includes(this.data[bar][n].notes % 12)) {
				this.data[bar][n].shift = ocjeneOptions.keys.shiftDir;
			}
		} else {
			// if a triplet
			for (let i = 0; i < tripIndex + 1; i++) {
				//this.data[bar][n].trips.notes.length
				this.data[bar][n].trips.shift[i] = 0;
				if (accArr.includes(this.data[bar][n].trips.notes[i] % 12)) {
					this.data[bar][n].trips.shift[i] = ocjeneOptions.keys.shiftDir;
				}
			}
		}
		//look backwards and chack for the last occurrence of this exact note in the bar!
		let noteArray = [];
		for (let p = n - 1; p >= 0; p--) {
			if (this.data[bar][p].rythm == null) continue;
			// fill noteArray with the actual notes( notes and trips etc) and respectively their shifts
			const singleNote = this.data[bar][p].trips == null;
			if (singleNote) {
				noteArray.push({
					notes: this.data[bar][p].notes,
					shift: this.data[bar][p].shift,
				});
			} else {
				let end = tripIndex == null ? 3 : tripIndex;
				for (let i = 0; i < end; i++) {
					noteArray.push({
						notes: this.data[bar][p].trips.notes[i],
						shift: this.data[bar][p].trips.shift[i],
					});
				}
			}
		}

		/*
    // now loop through this array, no need to worry about for the trips etc, they are resolved in the Array!
    
    const curr = (this.data[bar][n].trips == null) ? {
      notes: this.data[bar][n].notes,
      shift: this.data[bar][n].shift
    } : {
      notes: this.data[bar][n].trips.notes[tripIndex],
      shift: this.data[bar][n].trips.shift[tripIndex]
    }
    for (let prev of noteArray) {
      if (!accArr.includes(curr.notes % 12)) { // if current note not sharp/flat
        // 1 - same note do nothing (break)
        if (curr.notes == prev.notes)
        break;
        
        // 2 - prev note was sharp/flat and not shifted --> shift=true 
        if (accArr.includes(prev.notes % 12) && curr.notes == (prev.notes - ocjeneOptions.keys.shiftDir) && prev.shift == null) {
          this.data[bar][n].shift = ocjeneOptions.keys.shiftDir;
          break;
        }
      } else {
        
        // if current note is sharp/flat check:
        // 1 - prev was root do nothing (break)
        // 1 - same note has appeared before --> shift (break)
        // 2 - same note was shifted --> shift as well (break)
      }
    }
    */
		if (singleNoteState) {
			return this.data[bar][n].notes + this.data[bar][n].shift + ocjeneOptions.octaved.val;
		} else {
			return this.data[bar][n].trips.notes[tripIndex] + this.data[bar][n].trips.shift[tripIndex] + ocjeneOptions.octaved.val;
		}
	},
	midiToNote(note) {
		const index = ocjeneOptions.definitions.notes.midi.indexOf(note);
		let palettName = ocjeneOptions.keys.index <= 7 ? "A" : "B";
		return ocjeneOptions.definitions.notes[palettName][index];
	},
	sheetText(bar, n, tripIndex = null) {
		let num = 0;
		if (tripIndex == null) {
			// check if note is shiftes in Tonart
			num = this.data[bar][n].notes + this.data[bar][n].shift;
		} else {
			num = this.data[bar][n].trips.notes[tripIndex] + this.data[bar][n].trips.shift[tripIndex];
		}

		if (ocjeneOptions.definitions.keyAccidentals.includes((num - ocjeneOptions.keys.shiftDir) % 12)) {
			num -= ocjeneOptions.keys.shiftDir;
		}

		let t = this.midiToNote(num);
		t = t.toUpperCase();
		t = t.replace(/[',]/g, "");
		t = ocjeneOptions.germanText.state == true ? t.replace(/B/g, "H") : t;
		if (t.charAt(0) == "^") {
			t = t.replace(/\^/g, "");
			t += "#";
		} else if (t.charAt(0) == "_") {
			t = t.replace(/\_/g, "");
			if (t == "H") {
				t = t.replace(/H/g, "B");
			} else {
				t += "b";
			}
		}
		this.text += `${t} `;
	},
	split(bar, n) {
		// test if a "SPACE" needs to be added!
		let quant = ocjeneOptions.notenwert(this.data[bar][n].rythm); //recalculate the actual notelength
		if (quant <= 4) return "";
		const num = ocjeneOptions.timeSignature.currSignature[0];
		const den = ocjeneOptions.timeSignature.currSignature[1];
		let mod = 2;
		if (den == 2 && num % 2 == 0 && quant == 8) mod = 4;
		if (den == 4 && num % 2 == 0 && quant == 8) mod = 4;
		if (den == 8 && num % 3 == 0) mod = 3;
		let split = (mod * ocjeneOptions.maxDivisionsTotal) / 8;
		if (quant == 32) split /= 2;
		return (n + this.data[bar][n].rythm) % split == 0 ? " " : ""; // zu "n" einmal den Notenwert addieren um zu sehen ob zwischen dieser und der nächsten der Space muss
	},
	createRythm(bar, n) {
		let r = randomObject(ocjeneOptions.notenwerte.divisions); //8,4,2,1  -->  1/1, 1/2, 1/4, 1/8 !!

		if (ocjeneOptions.dotted.state && r != ocjeneOptions.notenwerte.shortest && Math.random() < ocjeneOptions.dotted.probability) {
			r *= 1.5;
		}
		const prev = this.prevNoteIndex(bar, n);
		if (prev != null && prev.bar == bar) {
			const prevLength = this.data[prev.bar][prev.n].rythm;
			if (prevLength % 3 === 0) {
				r = Math.floor(prevLength / 3);
			}
		}
		if (r > ocjeneOptions.maxDivisionPerBar - n) {
			if (bar == ocjeneOptions.bars.val - 1 || !ocjeneOptions.bars.overflow) {
				// no overflow allowed!
				let v = getNearestValueInArray([...ocjeneOptions.notenwerte.divisions].reverse(), ocjeneOptions.maxDivisionPerBar - n);
				let index = ocjeneOptions.notenwerte.divisions.indexOf(v);
				let redArray = ocjeneOptions.notenwerte.divisions.slice(index);
				r = randomObject(redArray); // set r to a possible division
			}
		}
		this.data[bar][n].rythm = r;
		return r - 1;
	},
	createNotes(bar, n, genenerateOnly = false) {
		const interval = randomObject(ocjeneOptions.interval.val * -1, ocjeneOptions.interval.val);
		const p = this.prevNoteIndex(bar, n);
		let prevNote = p == null ? null : this.data[p.bar][p.n].notes;

		if (genenerateOnly) prevNote = this.data[bar][n].notes;
		let note = this.newNote(prevNote, interval);

		if (genenerateOnly) return note; // used for trips
		this.data[bar][n].notes = note;
	},
	createRests(bar, n) {
		if (n == 0) return;
		const prev = this.prevNoteIndex(bar, n);
		if (this.data[prev.bar][prev.n].rests == true) return;
		if (Math.random() < ocjeneOptions.restProbability.val) this.data[bar][n].rests = true;
	},
	createSlurs(bar, n) {
		if (this.data[bar][n].rests != null) return;
		if (this.data[bar][n].rythm == ocjeneOptions.notenwerte.shortest) return; // if shortest no need to split

		let nextPos = this.nextBeat(bar, n);
		if (nextPos == null) {
			// console.log(bar, n, "nothing");
			return;
		}
		if (nextPos.distToNext > ocjeneOptions.notenwert(this.data[bar][n].rythm)) {
			console.log(bar, n, "to short", nextPos, ocjeneOptions.notenwert(this.data[bar][n].rythm));
			return null;
		}
		this.data[bar][n].slurs = true;

		// if (nextPos.distToNext > 0) {
		this.data[nextPos.bar][nextPos.n].rythm = this.data[bar][n].rythm - nextPos.distToNext;
		this.data[nextPos.bar][nextPos.n].notes = this.data[bar][n].notes;
		this.data[bar][n].rythm = nextPos.distToNext;
		// }
	},
	createTrips(bar, n) {
		let t = this.data[bar][n].rythm;
		if (this.data[bar][n].slurs != null || t == ocjeneOptions.notenwerte.shortest || t % 3 == 0) return;
		if (ocjeneOptions.triplet.state && Math.random() < ocjeneOptions.triplet.probability) {
			let n1 = this.data[bar][n].notes;
			let n2 = this.createNotes(bar, n, true);
			let n3 = this.createNotes(bar, n, true);
			this.data[bar][n].trips = {
				notes: [n1, n2, n3],
				shift: [null, null, null],
			};
		}
	},
	fullSong: "",
	text: "",
	createSong() {
		this.fullSong = "";
		this.text = "w: ";
		// console.clear();
		// console.log(this.data);
		for (let bar = 0; bar < this.data.length; bar++) {
			for (let n = 0; n < this.data[bar].length; n++) {
				if (this.data[bar][n].rythm == null) continue;
				//add NOTES
				let note;
				if (this.data[bar][n].trips == null) {
					note = this.midiToNote(this.noteParse(bar, n));
					if (this.data[bar][n].rests != null) {
						note = "z";
					} else {
						this.sheetText(bar, n);
					}
				} else if (this.data[bar][n].trips != null) {
					// if (this.data[bar][n].rythm == ocjeneOptions.notenwerte.shortest) return // if shortest no need to split
					let r = Math.floor(this.data[bar][n].rythm / 2);
					this.sheetText(bar, n, 0);
					this.sheetText(bar, n, 1);
					this.sheetText(bar, n, 2);
					let t = [
						this.midiToNote(this.noteParse(bar, n, 0)),
						this.midiToNote(this.noteParse(bar, n, 1)),
						this.midiToNote(this.noteParse(bar, n, 2)),
					];
					if (this.data[bar][n].rests != null) {
						t[randomObject(3)] = "z";
					}
					note = ` (3${t[0]}${r}${t[1]}${r}${t[2]}${r} `;
				}
				this.fullSong += note;
				//add RYTHM
				let rythm = this.data[bar][n].rythm;
				if (this.data[bar][n].trips != null) rythm = "";
				this.fullSong += rythm;
				//add SLURS
				this.fullSong += this.data[bar][n].slurs == true && this.data[bar][n].rests == null ? " -" : "";
				let next = this.nextNoteIndex(bar, n);
				if (next != null && this.data[bar][n].rythm == this.data[next.bar][next.n].rythm) this.fullSong += this.split(bar, n);
				if (this.data[bar][n].rests != null) this.fullSong += " ";
			}
			this.fullSong += "|";
		}
		this.fullSong += "]";
		this.text += "]";
		this.text = this.text.replace(/[0-9(]/g, " ");
	},
};
class ocjeneBar {
	constructor() {
		this.rythm = null;
		this.notes = null;
		this.rests = null;
		this.slurs = null;
		this.shift = null;
		this.trips = null;
	}
}
class ocjeneNote {
	constructor() {
		this.rythm = null;
		this.notes = null;
		this.rests = null;
		this.slurs = null;
		this.shift = null;
		this.trips = null;
	}
}

function ocjeneGenerate() {
	btnColor("idBtn_ocjeneGenerate", null);
	ocjeneSong.data = [];
	let countTillNext = 0;
	for (let bar = 0; bar < ocjeneOptions.bars.val; bar++) {
		ocjeneSong.data[bar] = new Array(ocjeneOptions.maxDivisionPerBar).fill().map(() => {
			return new ocjeneNote();
		});

		for (let n = 0; n < ocjeneOptions.maxDivisionPerBar; n++) {
			if (countTillNext > 0) {
				countTillNext--;
				continue;
			}
			countTillNext = ocjeneSong.createRythm(bar, n);
			ocjeneSong.createNotes(bar, n);
			ocjeneSong.createRests(bar, n);
		}
	}

	for (let bar = ocjeneSong.data.length - 1; bar >= 0; bar--) {
		for (let n = ocjeneSong.data[bar].length - 1; n >= 0; n--) {
			if (ocjeneSong.data[bar][n].rythm != null && ocjeneSong.data[bar][n].rests == null) {
				ocjeneSong.createSlurs(bar, n);
			}
		}
	}

	for (let bar = 0; bar < ocjeneSong.data.length; bar++) {
		for (let n = 0; n < ocjeneSong.data[bar].length; n++) {
			if (ocjeneSong.data[bar][n].rythm != null) {
				ocjeneSong.createTrips(bar, n);
			}
		}
	}

	ocjeneSong.title = randomObject(netsaonaOptions.data.Random);
	ocjeneSong.author = randomObject(netsaonaOptions.data.Name);
	ocjeneDraw();
}

function ocjeneDraw() {
	ocjeneSong.createSong();
	let text = ocjeneOptions.showText.state ? ocjeneSong.text : "";
	const res = `${ocjeneSong.header}${ocjeneSong.fullSong}\n${text}`;
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

	ocjeneOptions.firstNoteIterations.val = preset === null ? ocjeneOptions.firstNoteIterations.valOrig : ocjeneSettings.get("firstNoteIterations");
	ocjeneOptions.octaved.val = ocjeneOptions.octaved.valOrig;

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
	ocjeneOptions.notenwerte.createDivisions();

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
	ocjenePopulateKeys(); // this needs to be below t he KeySignatre definition!!

	ocjeneOptions.keyOnly.state = preset === null ? ocjeneOptions.keyOnly.stateOrig : ocjeneSettings.get("keyOnly");
	dbID("idCb_ocjeneKeyOnly").checked = ocjeneOptions.keyOnly.state;

	ocjeneOptions.dotted.state = preset === null ? ocjeneOptions.dotted.stateOrig : ocjeneSettings.get("dotted");
	dbID("idCb_ocjeneDotted").checked = ocjeneOptions.dotted.state;

	ocjeneOptions.triplet.state = preset === null ? ocjeneOptions.triplet.stateOrig : ocjeneSettings.get("triplet");
	dbID("idCb_ocjeneTriplet").checked = ocjeneOptions.triplet.state;

	ocjeneOptions.limitRange.state = preset === null ? ocjeneOptions.limitRange.stateOrig : ocjeneSettings.get("limitRange");
	ocjeneOptions.rangeOffset.val = preset === null ? ocjeneOptions.rangeOffset.valOrig : ocjeneSettings.get("rangeOffset");
	dbID("idCb_ocjeneLimitRange").checked = ocjeneOptions.limitRange.state;

	ocjeneOptions.showText.state = preset === null ? ocjeneOptions.showText.stateOrig : ocjeneSettings.get("showText");
	dbID("idCb_ocjeneShowText").checked = ocjeneOptions.showText.state;

	ocjeneOptions.germanText.state = preset === null ? ocjeneOptions.germanText.stateOrig : ocjeneSettings.get("germanText");
	dbID("idCb_ocjeneGermanText").checked = ocjeneOptions.germanText.state;

	ocjeneOptions.restProbability.val = preset === null ? ocjeneOptions.restProbability.valOrig : ocjeneSettings.get("restProbability");
	resetInput("idRange_ocjeneRestsProbability", ocjeneOptions.restProbability.val);
	dbID("idLbl_ocjeneRestsProbability").textContent = `${Math.floor(ocjeneOptions.restProbability.val * 100)} %`;

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
	ocjeneOptions.notenwerte.createDivisions();
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
	ocjeneDraw();
}

function ocjeneKey(obj) {
	ocjeneOptions.keys.index = obj.selectedIndex;
	ocjeneDraw();
}

function ocjeneKeyOnly(obj) {
	ocjeneOptions.keyOnly.state = obj.checked;
	ocjeneDraw();
}

function ocjeneDotted(obj) {
	ocjeneOptions.dotted.state = obj.checked;
	ocjeneInputChange();
}

function ocjeneTriplet(obj) {
	ocjeneOptions.triplet.state = obj.checked;
	ocjeneInputChange();
}

function ocjeneShowText(obj) {
	ocjeneOptions.showText.state = obj.checked;
	ocjeneDraw();
}

function ocjeneGermanText(obj) {
	ocjeneOptions.germanText.state = obj.checked;
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

function ocjeneLimitRange(obj) {
	ocjeneOptions.limitRange.state = obj.checked;
	ocjeneInputChange();
}

function ocjeneOctave(obj) {
	ocjeneOptions.octaved.val += obj < 0 ? -ocjeneOptions.octaved.interval : ocjeneOptions.octaved.interval;
	ocjeneDraw();
}

function ocjeneRestsProbability(obj) {
	ocjeneOptions.restProbability.val = obj.value;
	dbID("idLbl_ocjeneRestsProbability").textContent = `${Math.floor(ocjeneOptions.restProbability.val * 100)} %`;
	for (let bar = 0; bar < ocjeneSong.data.length; bar++) {
		for (let n = 0; n < ocjeneSong.data[bar].length; n++) {
			if (ocjeneSong.data[bar][n].rythm === null) continue;
			ocjeneSong.data[bar][n].rests = null;
			ocjeneSong.createRests(bar, n);
		}
	}
	ocjeneDraw();
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
		get firstNoteIterations() {
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
		get showText() {
			if (ocjeneSettings.level == 0) return true;
			if (ocjeneSettings.level == 1) return false;
			if (ocjeneSettings.level == 2) return false;
		},
		get germanText() {
			if (ocjeneSettings.level == 0) return true;
			if (ocjeneSettings.level == 1) return false;
			if (ocjeneSettings.level == 2) return false;
		},
		get interval() {
			if (ocjeneSettings.level == 0) return 5;
			if (ocjeneSettings.level == 1) return 8;
			if (ocjeneSettings.level == 2) return 10;
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
			if (ocjeneSettings.level == 0) return false;
			if (ocjeneSettings.level == 1) return true;
			if (ocjeneSettings.level == 2) return true;
		},
		get triplet() {
			if (ocjeneSettings.level == 0) return false;
			if (ocjeneSettings.level == 1) return true;
			if (ocjeneSettings.level == 2) return true;
		},
		get restProbability() {
			if (ocjeneSettings.level == 0) return 0;
			if (ocjeneSettings.level == 1) return 0.2;
			if (ocjeneSettings.level == 2) return 0.4;
		},
	},
};
