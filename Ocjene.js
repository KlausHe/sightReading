// - slur --> balkentrennung beachten!

// https://abcnotation.com/wiki/abc:standard:v2.1
// https://github.com/paulrosen/abcjs/blob/main/examples/basic-transpose.html
// http://www.lehrklaenge.de/PHP/Grundlagen/Notenschluessel.php
// https://www.abcjs.net/abcjs-editor.html
// https://soundprogramming.net/file-formats/midi-note-ranges-of-orchestral-instruments/
// https://de.wikipedia.org/wiki/Liste_musikalischer_Symbole
// https://musescore.org/sl/instruments
// https://github.com/musescore/MuseScore
// https://musescore.org/en/handbook/developers-handbook/references/instrumentsxml-documentation#copyandpastemethod
// https://www.zem-college.de/midi/mc_taben.htm
// https://cyrusn.github.io/note/abcjs/

const ocjeneSubgrid = [
	["cl_OcjeneSheet", "right", "start"],
	["cl_OcjeneLevelHeader", "left", "end"],
	["cl_OcjeneLevelselect1", "left"],
	["cl_OcjeneLevelselect2", "left"],
	["cl_OcjeneLevelExercise", "left"],
	["cl_OcjeneInstrumentHeader", "left", "end"],
	["cl_OcjeneSongHeader", "left", "end"],
	["cl_OcjeneRhytmusHeader", "left", "end"],
	["cl_OcjeneMelodieHeader", "left", "end"],
	["cl_OcjeneNotenwert1", "left"],
	["cl_OcjeneNotenwert2", "left"],
	["cl_OcjeneNotenwert4", "left"],
	["cl_OcjeneNotenwert8", "left"],
	["cl_OcjeneNotenwert16", "left"],
	["cl_OcjeneNotenwert32", "left"],
	["cl_OcjeneDotted", "left"],
	["cl_OcjeneTriplet", "left"],
	["cl_OcjeneBarOverflowStop", "left"],
	["cl_OcjeneMetronome", "left"],
	["cl_OcjeneInstrument", "left"],
	["cl_OcjeneInterval", "left"],
	["cl_OcjeneClefs", "left"],
	["cl_OcjeneKey", "left"],
	["cl_OcjeneKeyOnly", "left"],
	["cl_OcjeneTimeSignature", "left"],
	["cl_OcjeneTempo", "left"],
	["cl_OcjeneBars", "left"],
	["cl_OcjeneLimitRange", "left"],
	["cl_OcjeneRests", "left"],
	["cl_OcjeneGenerate", "left", "end"],
	["cl_OcjeneShowText", "left"],
	// ["cl_OcjeneTextLanguage", "left"],
];

const ocjeneOptions = {
	get div() {
		return "idCanv_ocjeneSheet";
	},
	get audio() {
		return "#idCanv_ocjeneAudio";
	},
	division: 576,
	notenwerte: {
		selected: [],
		selectedOrig: [0, 1, 1, 1, 0, 0], //1/1, 1/2, 1/4, 1/8, 1/16, 1/32
		quaternote: 144,
		noteArrays: {
			base: [576, 288, 144, 72, 36, 18],
			triplet: [null, 192, 96, 48, 24, 12],
			dotted: [null, 432, 216, 108, 54, 27],
		},
		get minIndex() {
			return this.selected.findLastIndex((i) => i > 0);
		},
	},
	dotted: {
		val: 0,
		valOrig: 5,
		min: 0,
		max: 20,
	},
	triplet: {
		val: 0,
		valOrig: 5,
		min: 0,
		max: 20,
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
		min: 1,
		max: 12,
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
		min: 1,
		max: 24,
	},
	barOverflowStop: {
		state: true,
		stateOrig: true,
	},
	metronome: {
		state: false,
		stateOrig: false,
	},
	showText: {
		state: false,
		stateOrig: false,
	},
	showMidi: {
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
		abcName(index = null) {
			let i = index == null ? this.index : index;
			return ocjeneOptions.definitions.clefs[i].abc;
		},
		enName(index = null) {
			let i = index == null ? this.index : index;
			return ocjeneOptions.definitions.clefs[i].en;
		},
		deName(index = null) {
			let i = index == null ? this.index : index;
			return ocjeneOptions.definitions.clefs[i].de;
		},
	},
	keys: {
		index: 0,
		indexOrig: 0,
		get current() {
			return ocjeneOptions.definitions.keys[ocjeneOptions.keys.index][0];
		},
		get shiftDir() {
			return ocjeneOptions.keys.index <= 7 ? -1 : 1;
		},
	},
	keyOnly: {
		state: true,
		stateOrig: true,
	},
	limitRange: {
		state: true,
		stateOrig: true,
		lower: 0,
		lowerOrig: 0, //53,
		upper: 0,
		upperOrig: 127, //93,
	},
	definitions: {
		notes: {
			abcJSBasenotes: ["C", "D", "E", "F", "G", "A", "B", "^C", "^D", "^F", "^G", "^A", "_D", "_E", "_G", "_A", "_B"],
			A: [
				"C,,,,,,",
				"^C,,,,,",
				"D,,,,,",
				"^D,,,,,",
				"E,,,,,",
				"F,,,,,",
				"^F,,,,,",
				"G,,,,,",
				"^G,,,,,",
				"A,,,,,",
				"^A,,,,,",
				"B,,,,,",
				"C,,,,",
				"^C,,,,",
				"D,,,,",
				"^D,,,,",
				"E,,,,",
				"F,,,,",
				"^F,,,,",
				"G,,,,",
				"^G,,,,",
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
				"^c'''",
				"d'''",
				"^d'''",
				"e'''",
				"f'''",
				"^f'''",
				"g'''",
				"^g'''",
				"a'''",
				"^a'''",
				"b'''",
				"c''''",
				"^c''''",
				"d''''",
				"^d''''",
				"e''''",
				"f''''",
				"^f''''",
				"g''''",
				"^g''''",
			],
			B: [
				"C,,,,,,",
				"_D,,,,,",
				"D,,,,,",
				"_E,,,,,",
				"E,,,,,",
				"F,,,,,",
				"_G,,,,,",
				"G,,,,,",
				"_A,,,",
				"A,,,,,",
				"_B,,,,,",
				"B,,,,,",
				"C,,,,",
				"^C,,,,",
				"D,,,,",
				"_E,,,,",
				"E,,,,",
				"F,,,,",
				"_G,,,,",
				"G,,,,",
				"_A,,,,",
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
				"_d'''",
				"d'''",
				"_e'''",
				"e'''",
				"f'''",
				"_g'''",
				"g'''",
				"_a'''",
				"a'''",
				"_b'''",
				"b'''",
				"c''''",
				"_d''''",
				"d''''",
				"_e''''",
				"e''''",
				"f''''",
				"_g''''",
				"g''''",
				"_a''''",
			],
			midi: [
				0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
				75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127,
			],
			midiNotes: {
				A: [0, 7, 1, 8, 2, 3, 9, 4, 10, 5, 11, 6],
				B: [0, 12, 1, 13, 2, 3, 14, 4, 15, 5, 16, 6],
			},
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
				pt: ["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si", "Dó sustenido", "Ré sustenido", "Fá sustenido", "Sol sustenido", "Lá sustenido", "Si sustenido", "Ré bemol", "Mi bemol", "Sol bemol", "Lá bemol", "Si bemol"],
				bg: ["до", "ре", "ми", "фа", "сол", "ла", "си", "д диезо", "ре диез", "фа диез", "сол диез", "ла диез", "ре бемол", "ми бемол", "сол бемол", "ла бемол", "си бемол"],
				ru: ["до", "ре", "ми", "фа", "соль", "ля", "си", "до диез", "ре диез", "фа диез", "соль диез", "ля диез", "ре бемоль", "ми бемоль", "соль бемоль", "ля бемоль", "си бемоль"],
				el: ["Ντο", "Ρε", "Μι", "Φα", "Σολ", "Λα", "Σι", "Ντο δίεση", "Ρε δίεση", "Φα δίεση", "Σολ δίεση", "Λα δίεση", "Ρε ύφεση", "Μι ύφεση", "Σολ ύφεση", "Λα ύφεση", "Σι ύφεση"],
				ja: ["ハ", "ニ", "ホ", "ヘ", "ト", "イ", "ロ", "嬰ハ", "嬰ニ", "嬰ヘ", "嬰ト", "嬰イ", "変ニ", "変ホ", "変ト", "変イ", "変ロ"],
			},
			midiIndexToLanguageText(midiID, simple = false) {
				const keyMode = ocjeneOptions.keys.index <= 7 ? "A" : "B";
				const langArr = this.textLanguage[Object.keys(this.textLanguage)[ocjeneOptions.textLanguage.index]];
				const langIndex = this.midiNotes[keyMode][midiID % 12];
				let text = langArr[langIndex];
				if (simple) return text;

				let octaveIndicator = "";
				//language Rules ENGLISH
				const lIndex = ocjeneOptions.textLanguage.index;
				if (lIndex < 5) {
					octaveIndicator = Math.floor(midiID / 12);
				} else {
					// if (lIndex < 14)
					const shift = Math.floor(midiID / 12) - 3;
					if (shift < 0) octaveIndicator = Math.abs(shift);
					if (shift >= 2) octaveIndicator = shift - 1;
					if (shift > 0) text = text.toLowerCase();
				}
				return `${text} ${octaveIndicator}`;
			},
			get ABCJSnotes() {
				const p = ocjeneOptions.keys.index <= 7 ? "A" : "B";
				return this[p];
			},
		},
		clefs: [
			{ abc: "treble", en: "G", de: "Violin" },
			// { abc: "alto1", en: "C1", de: "Sopran" },
			// { abc: "alto2", en: "C2", de: "Mezzosopran" },
			{ abc: "alto", en: "C3", de: "Alt" },
			// { abc: "tenor", en: "C4", de: "Tenor" },
			// { abc: "bass3", en: "C5", de: "Bariton" },
			{ abc: "bass", en: "F", de: "Bass" },
			// { abc: "treble+8", en: "G8va", de: "Violin" },
			// { abc: "treble-8", en: "G8vb", de: "Violin" },
			{ abc: "bass+8", en: "F8va", de: "Bass" },
			{ abc: "bass-8", en: "F8vb", de: "Bass -8" },
		],
		timeSignatures: [
			{ sig: [2, 2], postfix: "", accentuation: [2] },
			{ sig: [2, 4], postfix: "", accentuation: [2] },
			{ sig: [3, 4], postfix: "", accentuation: [3] },
			{ sig: [4, 4], postfix: "", accentuation: [4] },
			{ sig: [5, 4], postfix: "", accentuation: [5] },
			{ sig: [3, 8], postfix: "", accentuation: [3] },
			{ sig: [6, 8], postfix: "", accentuation: [3, 3] },
			{ sig: [7, 8], postfix: "(3-4)", accentuation: [3, 4] },
			{ sig: [7, 8], postfix: "(4-3)", accentuation: [4, 3] },
			{ sig: [9, 8], postfix: "", accentuation: [3, 3, 3] },
			{ sig: [10, 8], postfix: "(3-2-3-2)", accentuation: [3, 2, 3, 2] },
			{ sig: [12, 8], postfix: "", accentuation: [3, 3, 3, 3] },
		],
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
		notAccidentals: [0, 2, 4, 5, 7, 9, 11],
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
	get baseNote() {
		return Math.floor((this.getSelectedRange[0] + this.getSelectedRange[1]) / 2);
	},
	get firstPitch() {
		return this.baseNote;
	},
	get getInstrumentRange() {
		const pro = ocjeneOptions.limitRange.state ? 0 : 1;
		return [this.instrument.range[pro][0] - ocjeneInstruments.instrument.transposeChromatic, this.instrument.range[pro][1] - ocjeneInstruments.instrument.transposeChromatic];
	},
	get getInstrumentFullRange() {
		return [this.instrument.range[1][0] - ocjeneInstruments.instrument.transposeChromatic, this.instrument.range[1][1] - ocjeneInstruments.instrument.transposeChromatic];
	},
	get getSelectedRange() {
		if (ocjeneOptions.limitRange.state) return [ocjeneOptions.limitRange.lower, ocjeneOptions.limitRange.upper];
		return this.getInstrumentRange;
	},
	instrumentFilterList: ["Klarinette", "Bassklarinette", "Altsaxophon", "Tenorsaxophon", "Baritonsaxophon", "Trompete", "Posaune", "Vibraphon", "Marimba", "Glockenspiel", "Violine", "Bratschen", "Cello", "Kontrabass", "Klavier", "Gitarre", "Akustischer Bass"],
	/*
  - "Holzbläser"
  "Klarinette in Bb"
  "Bassklarinette in Bb"
  "Altsaxophon"
  "Tenorsaxophon"
  "Baritonsaxophon"

  - "Blechbläser"
  "Trompete in Bb"
  "Posaune"

  - "Mallets"
  "Vibraphon"
  "Marimba "
  "Glockenspiel"

  - "Streichinstrumente"
  "Violine"
  "Viola"
  "Cello"
  "Kontrabass"

  - "Rhythmusgruppe"
  "Klavier"
  "Gitarre"
  "Akustischer Bass "
*/
	data: [
		{
			ID: "vibraphone",
			nameEN: "Vibraphone",
			nameDE: "Vibraphon",
			range: [
				[60, 64],
				[53, 89],
			],
			nameENtuning: null,
			transposeChromatic: 0,
			midiInstrumentIndex: 11,
			family: "Mallets",
			clef: "G",
		},
		{
			ID: "glockenspiel",
			nameEN: "Glockenspiel",
			nameDE: "Glockenspiel",
			range: [
				[79, 108],
				[76, 108],
			],
			nameENtuning: null,
			transposeChromatic: 24,
			midiInstrumentIndex: 9,
			family: "Mallets",
			clef: "G15ma",
		},
		{
			ID: "marimba-single",
			nameEN: "Marimba",
			nameDE: "Marimba",
			range: [
				[45, 96],
				[36, 96],
			],
			nameENtuning: null,
			transposeChromatic: 0,
			midiInstrumentIndex: 12,
			family: "Mallets",
			clef: "G",
		},
		{
			ID: "bb-clarinet",
			nameEN: "Clarinet",
			nameDE: "Klarinette",
			range: [
				[50, 89],
				[50, 94],
			],
			nameENtuning: "B♭",
			transposeChromatic: -2,
			midiInstrumentIndex: 71,
			family: "Holzbläser",
			clef: "G",
		},
		{
			ID: "bb-bass-clarinet",
			nameEN: "Bass Clarinet",
			nameDE: "Bassklarinette",
			range: [
				[37, 75],
				[34, 82],
			],
			nameENtuning: "B♭",
			transposeChromatic: -14,
			midiInstrumentIndex: 71,
			family: "Holzbläser",
			clef: "G8vb",
		},
		{
			ID: "alto-saxophone",
			nameEN: "Alto Saxophone",
			nameDE: "Altsaxophon",
			range: [
				[49, 80],
				[49, 92],
			],
			nameENtuning: null,
			transposeChromatic: -9,
			midiInstrumentIndex: 65,
			family: "Holzbläser",
			clef: "G",
		},
		{
			ID: "tenor-saxophone",
			nameEN: "Tenor Saxophone",
			nameDE: "Tenorsaxophon",
			range: [
				[44, 75],
				[44, 87],
			],
			nameENtuning: null,
			transposeChromatic: -14,
			midiInstrumentIndex: 66,
			family: "Holzbläser",
			clef: "G8vb",
		},
		{
			ID: "baritone-saxophone",
			nameEN: "Baritone Saxophone",
			nameDE: "Baritonsaxophon",
			range: [
				[36, 68],
				[36, 80],
			],
			nameENtuning: null,
			transposeChromatic: -21,
			midiInstrumentIndex: 67,
			family: "Holzbläser",
			clef: "F",
		},

		{
			ID: "bb-trumpet",
			nameEN: "Trumpet",
			nameDE: "Trompete",
			range: [
				[52, 80],
				[52, 85],
			],
			nameENtuning: "B♭",
			transposeChromatic: -2,
			midiInstrumentIndex: 56,
			family: "Blechbläser",
			clef: "G",
		},

		{
			ID: "trombone-treble",
			nameEN: "Trombone",
			nameDE: "Posaune",
			range: [
				[40, 71],
				[36, 74],
			],
			nameENtuning: null,
			transposeChromatic: -14,
			midiInstrumentIndex: 57,
			family: "Blechbläser",
			clef: "F",
		},
		{
			ID: "upright-piano",
			nameEN: "Upright Piano",
			nameDE: "Klavier",
			range: [
				[21, 108],
				[21, 108],
			],
			nameENtuning: null,
			transposeChromatic: 0,
			midiInstrumentIndex: 0,
			family: "Rhythmusgruppe",
			clef: "G",
		},
		{
			ID: "guitar-nylon-treble-clef",
			nameEN: "Guitar",
			nameDE: "Gitarre",
			range: [
				[40, 83],
				[40, 83],
			],
			nameENtuning: null,
			transposeChromatic: -12,
			midiInstrumentIndex: 24,
			family: "Rhythmusgruppe",
			clef: "G8vb",
		},
		{
			ID: "acoustic-bass",
			nameEN: "Acoustic Bass",
			nameDE: "Akustischer Bass",
			range: [
				[28, 62],
				[28, 67],
			],
			nameENtuning: null,
			transposeChromatic: -12,
			midiInstrumentIndex: 36,
			family: "Rhythmusgruppe",
			clef: "F8vb",
		},
		{
			ID: "violins",
			nameEN: "Violins",
			nameDE: "Violine",
			range: [
				[55, 88],
				[55, 103],
			],
			nameENtuning: null,
			transposeChromatic: 0,
			midiInstrumentIndex: 48,
			family: "Streichinstrumente",
			clef: "G",
		},
		{
			ID: "violas",
			nameEN: "Violas",
			nameDE: "Bratschen",
			range: [
				[48, 79],
				[48, 93],
			],
			nameENtuning: null,
			transposeChromatic: 0,
			midiInstrumentIndex: 48,
			family: "Streichinstrumente",
			clef: "C3",
		},
		{
			ID: "violoncello",
			nameEN: "Violoncello",
			nameDE: "Cello",
			range: [
				[36, 67],
				[36, 90],
			],
			nameENtuning: null,
			transposeChromatic: 0,
			midiInstrumentIndex: 42,
			family: "Streichinstrumente",
			clef: "F",
		},
		{
			ID: "contrabass",
			nameEN: "Contrabass",
			nameDE: "Kontrabass",
			range: [
				[28, 62],
				[24, 67],
			],
			nameENtuning: null,
			transposeChromatic: -12,
			midiInstrumentIndex: 43,
			family: "Streichinstrumente",
			clef: "F8vb",
		},
	],
};

const ocjeneSong = {
	spread: 4,
	get title() {
		if (ocjeneSettings.type == "level") return `Level ${ocjeneSettings[ocjeneSettings.type] + 1}`;
		return ocjeneSettings.exercises[ocjeneSettings.exercise];
	},
	author: "",
	get header() {
		const config = {
			T: this.title, //Title
			// S: `${new Date().getFullYear()}, KlausHe`, // copyright
			M: ocjeneOptions.timeSignature.currSignature.sig.join("/"), //Taktart
			L: `1/${ocjeneOptions.division}`, // kleinster Notenwert
			Q: `1/4=${ocjeneOptions.tempo.val}`, // tempo
			K: `${ocjeneOptions.keys.current} clef=${ocjeneOptions.clef.abcName()}`, //  Tonart, Reihenfolge wichtig!
		};
		const options = ["%score Melody"]; //"%%barnumbers 1",
		const text =
			Object.entries(config)
				.map(([key, value]) => `${key}:${value}\n`)
				.join("") +
			options.join("\n") +
			"\n";
		return text;
	},
	get songlength() {
		return ocjeneOptions.bars.val * this.barLength;
	},
	get remainingSongLength() {
		return this.songlength - this.currentSongLength;
	},
	currentSongLength: 0,
	get barLength() {
		return ocjeneOptions.timeSignature.currSignature.sig[0] * (ocjeneOptions.division / ocjeneOptions.timeSignature.currSignature.sig[1]);
	},
	get remainingBarLength() {
		return this.barLength - (ocjeneSong.currentSongLength % this.barLength);
	},
	get isOnQuaterNote() {
		let currPos = this.currentSongLength;
		let tpbar = this.barLength;
		let currBars = Math.floor(currPos / tpbar);
		const barTs = currPos - tpbar * currBars;
		return barTs % ocjeneOptions.notenwerte.quaternote == 0;
	},
	noteData: [],
	abcJSSong: "",
	abcJSText: "",
	generateData() {
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
	},
	abcCanvas: null,
	synthControl: null,
	synthOptions: {
		displayLoop: true,
		displayRestart: true,
		displayPlay: true,
		displayProgress: true,
		displayWarp: false,
		get midiTranspose() {
			return ocjeneInstruments.instrument.transposeChromatic;
		},
		get program() {
			return ocjeneInstruments.instrument.midiInstrumentIndex;
		},
		get drumIntro() {
			return 0;
		},
		get drum() {
			if (!ocjeneOptions.metronome.state) return "";
			let autoPattern = [[], [], []];
			const baseLength = ocjeneOptions.notenwerte.noteArrays.base[Math.log2(ocjeneOptions.timeSignature.currSignature.sig[1])];
			const accArr = ocjeneOptions.timeSignature.currSignature.accentuation;
			for (let i = 0; i < accArr.length; i++) {
				for (let j = 0; j < accArr[i]; j++) {
					let pitch = j == 0 ? 76 : 77;
					let volume = j == 0 ? 80 : 50;
					autoPattern[0].push(`d${baseLength}`); //notelength
					autoPattern[1].push(pitch); //pitch
					autoPattern[2].push(volume); //Volume
				}
			}
			let p0 = autoPattern[0].join("");
			let p1 = autoPattern[1].join(" ");
			let p2 = autoPattern[2].join(" ");
			return [p0, p1, p2].join(" ");
		},
	},
	midiBuffer: null,
	cursorControl: new ocjeneCursorControl(),
	startTune() {
		ocjeneSong.synthControl.disable(true);
		ocjeneSong.midiBuffer = new ABCJS.synth.CreateSynth();
		ocjeneSong.midiBuffer
			.init({
				visualObj: ocjeneSong.abcCanvas,
			})
			.then(function (response) {
				if (ocjeneSong.synthControl) {
					ocjeneSong.synthControl
						.setTune(ocjeneSong.abcCanvas, false, ocjeneSong.synthOptions)
						.then(function (response) {
							// console.log("Audio successfully loaded.", response);
						})
						.catch(function (error) {
							console.warn("Audio problem:", error);
						});
				}
			})
			.catch(function (error) {
				console.warn("Audio problem:", error);
			});
	},
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
		this.insertSpace();
		this.translatePitch();
	}
	pitchIndex() {
		return this.midiPitch % 12;
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
			const barStamp = this.getBarStart(1);
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

	insertSpace() {
		const dIndex = this.getDurationIndex();
		if (this.midiPitch == null) return (this.spaceStembar = true);
		// if (this.slur) return (this.spaceStembar = true); // keine Balken
		if (dIndex < 3) return (this.spaceStembar = true); // keine Balken
		if (this.type == "triplet") return;

		const diff = this.timeStamp - this.getBarStart();
		if (diff == 0) return;
		const signature = ocjeneOptions.timeSignature.currSignature;
		const accentLength = ocjeneOptions.division / signature.sig[1];

		const accentuationArray = signature.accentuation.length == 1 ? Array(signature.accentuation[0]).fill(1) : signature.accentuation;
		let accent = 0;
		for (let index = 0; index < accentuationArray.length; index++) {
			const currAccentTimestamp = accentLength * accent;
			if (diff - currAccentTimestamp <= accentLength && diff % currAccentTimestamp == 0) {
				this.spaceStembar = true;
				return;
			}
			accent += accentuationArray[index];
		}
	}
	getBar(offset = 0) {
		return Math.floor((this.timeStamp + offset) / ocjeneSong.barLength);
	}
	getBarStart(offset = 0) {
		return (Math.floor(this.timeStamp / ocjeneSong.barLength) + offset) * ocjeneSong.barLength;
	}
	isCrossingBar() {
		return this.getBar() != this.getBar(this.duration - 1);
	}
	isOnNewBar() {
		if (this.timeStamp == 0) return false;
		let a = this.timeStamp % ocjeneSong.barLength == 0;
		return this.timeStamp % ocjeneSong.barLength == 0;
	}
	static isAccidental(pitch) {
		return ocjeneOptions.definitions.accidentals.includes(pitch % 12);
	}
	static getBaseKey(pitch) {
		let state = ocjeneNote.isAccidental(pitch);
		if (!state) return pitch;
		return (pitch += ocjeneOptions.keys.shiftDir);
	}
	static isBaseKey(pitch) {
		let base = ocjeneNote.getBaseKey(pitch);
		return pitch == base;
	}

	createPitch(splitMidiPitch) {
		if (splitMidiPitch) {
			this.midiPitch = splitMidiPitch;
			return;
		}
		const lastNoteIndex = ocjeneSong.noteData.findLastIndex((n) => n.midiPitch != null);
		this.midiPitch = lastNoteIndex == -1 ? ocjeneInstruments.firstPitch : ocjeneSong.noteData[lastNoteIndex].midiPitch;
		this.midiPitch += randomObject(ocjeneOptions.interval.val * -1, ocjeneOptions.interval.val);
		this.midiPitch = valueConstrain(this.midiPitch, ocjeneInstruments.getSelectedRange[0], ocjeneInstruments.getSelectedRange[1]);

		if (ocjeneOptions.keyOnly.state) {
			this.midiPitch = ocjeneNote.getBaseKey(this.midiPitch);
		}
		this.createRest();
	}

	createRest() {
		const prevPitch = this.getDataIndex() == 0 ? ocjeneSong.noteData[0].midiPitch : ocjeneSong.noteData[this.getDataIndex() - 1].midiPitch;
		if (prevPitch == null) return;
		if (Math.random() * 100 < ocjeneOptions.rests.val) this.midiPitch = null;
	}

	translatePitch() {
		let pitch = this.midiPitch == null ? "z" : ocjeneOptions.definitions.notes.ABCJSnotes[this.midiPitch];
		let duration = this.duration;

		let prefix = this.isOnNewBar() ? " |" : "";
		prefix += this.spaceStembar ? " " : "";
		let postfix = this.slur ? "-" : ""; // added space after minus
		if (this.type == "triplet") {
			const durationIndex = this.getDurationIndex();
			prefix += this.tripletIndex == 0 ? " (3" : "";
			postfix = this.tripletIndex == 2 ? " " : "";
			duration = ocjeneOptions.notenwerte.noteArrays.base[durationIndex];
		}
		if (this.resolved) {
			pitch = pitch.replace(/[\^_]/, "");
			pitch = `=${pitch}`;
		}
		this.abcJSPitch = `${prefix}${pitch}${duration}${postfix}`;
	}
	translateText() {
		if (this.midiPitch == null) return "";
		if (this.getDataIndex() > 0 && !this.isOnNewBar() && ocjeneSong.noteData[this.getDataIndex() - 1].slur == true) return "* ";
		const text = ocjeneOptions.showMidi.state ? `${this.midiPitch} ` : `${ocjeneOptions.definitions.notes.midiIndexToLanguageText(this.midiPitch, true)} `;
		return text;
	}
}

function ocjeneGenerate() {
	// console.clear();
	btnColor("idBtn_ocjeneGenerate", null);
	if (ocjeneSettings.type == "level") btnColor(`idBtn_ocjeneLevel${ocjeneSettings.level}`, "positive");
	ocjeneSong.author = "KlausHe"; //randomObject(netsaonaOptions.data.Name);
	ocjeneSong.noteData = [];
	ocjeneSong.currentSongLength = 0;
	while (ocjeneSong.currentSongLength < ocjeneSong.songlength) {
		ocjeneCreateNote();
	}
	ocjeneCleanAfterGeneration();
	ocjeneDraw();
}

function ocjeneCreateNote() {
	let type = "base";
	const normalizedSum = ocjeneOptions.triplet.val + ocjeneOptions.dotted.val;
	if (normalizedSum != 0) {
		const tripletNormalized = ocjeneOptions.triplet.val / normalizedSum;
		const tempType = Math.random() < tripletNormalized ? "triplet" : "dotted";
		const tempState = Math.random() * 100 < ocjeneOptions[tempType].val;
		if (tempState) type = tempType;
	}

	let possibleNotes = ocjeneGetPossibleNotes(type);

	if (possibleNotes.length == 0) {
		type = "base";
		possibleNotes = ocjeneGetPossibleNotes(type);
	}

	if (type == "base") {
		(() => {
			if (ocjeneSong.noteData.length < 2) return;
			let prev1 = ocjeneSong.noteData[ocjeneSong.noteData.length - 1];
			if (prev1.type != "base") return;
			let prev2 = ocjeneSong.noteData[ocjeneSong.noteData.length - 2];
			if (prev1.getDurationIndex() > 2 && prev1.duration != prev2.duration) {
				possibleNotes.push(prev1.duration);
				possibleNotes.push(prev1.duration);
				possibleNotes.push(prev1.duration);
			}
		})();
	}

	const duration = randomObject(possibleNotes);
	new ocjeneNote(type, duration, ocjeneSong.currentSongLength, 0);
	if (type == "triplet") {
		new ocjeneNote(type, duration, ocjeneSong.currentSongLength, 1);
		new ocjeneNote(type, duration, ocjeneSong.currentSongLength, 2);
	}
}

function ocjeneGetPossibleNotes(type) {
	let possibleNotes = [];
	let noteArray = ocjeneOptions.notenwerte.noteArrays[type].slice();
	let indices = ocjeneOptions.notenwerte.selected
		.map((index, e) => index * e)
		.filter((e) => {
			return e > 0;
		}); //[0,1,3,4]

	if (type == "base") {
		const multiplier = 1;
		possibleNotes = noteArray.filter((n, index) => {
			if (!indices.includes(index)) return false;
			if (n * multiplier > ocjeneSong.remainingSongLength) return false;
			if (ocjeneOptions.barOverflowStop.state && n * multiplier > ocjeneSong.remainingBarLength) return false;
			return true;
		});
		return possibleNotes;
	}

	if (type == "triplet") {
		const multiplier = 3;
		possibleNotes = noteArray.filter((n, index) => {
			if (n == null) return false;
			if (!indices.includes(index)) return false;
			if (!ocjeneSong.isOnQuaterNote) return false;
			if (n * multiplier > ocjeneSong.remainingSongLength) return false;
			if (n * multiplier > ocjeneSong.remainingBarLength) return false;
			return true;
		});
		return possibleNotes;
	}

	if (type == "dotted") {
		const multiplier = 1.5;
		possibleNotes = noteArray.filter((n, index) => {
			if (n == null) return false;
			if (index == ocjeneOptions.notenwerte.minIndex) return false;
			if (!indices.includes(index)) return false;
			if (n * multiplier > ocjeneSong.remainingSongLength) return false;
			if (n * multiplier > ocjeneSong.remainingBarLength) return false;
			return true;
		});
		return possibleNotes;
	}
	return [];
}

function ocjeneCleanAfterGeneration() {
	if (ocjeneOptions.keyOnly.state) return;
	let bars = [[]];
	for (let n of ocjeneSong.noteData) {
		let b = n.getBar();
		if (bars[b] == undefined) bars[b] = [];
		bars[b].push([n, null]);
	}
	// console.log(bars);
	for (let b = 0; b < bars.length; b++) {
		const bar = bars[b];
		for (let i = 0; i < bar.length; i++) {
			let flag_untouched = true;
			const notePitch = bar[i][0].pitchIndex();
			const isBaseKey = ocjeneNote.isBaseKey(notePitch);
			const isFromKey = ocjeneOptions.definitions.keyAccidentals.some((acc) => acc == notePitch);

			for (let prevIndex = i - 1; prevIndex >= 0; prevIndex--) {
				const noteBase = ocjeneNote.getBaseKey(notePitch);
				const prevPitch = bar[prevIndex][0].pitchIndex();
				const prevBase = ocjeneNote.getBaseKey(prevPitch);
				if (noteBase != prevBase) continue;

				// same - Base         -- do nothing if its null, set to null if it is resolved
				if (notePitch == prevPitch && isBaseKey) {
					if (isFromKey) flag_untouched = false;
					break;
				}
				// same - Accidential   -- shift to avoid accidential and keep shifting --> depending on the current key
				if (notePitch == prevPitch && !isBaseKey) {
					if (isFromKey) {
						bar[i][1] = "shift";
						flag_untouched = false;
					} else {
						if (bar[prevIndex][1] == null) bar[i][1] = "shift";
					}
					break;
				}
				// different - Base       -- resolve after accidential and keep shifting
				if (notePitch != prevPitch && isBaseKey) {
					if (isFromKey) flag_untouched = false;
					bar[i][1] = "resolved";
					break;
				}
				// different - Accidential -- do nothing
				if (notePitch != prevPitch && !isBaseKey) {
					if (isFromKey) {
						bar[i][1] = "shift";
						flag_untouched = false;
					}
					break;
				}
			}
			if (flag_untouched && isFromKey) bar[i][1] = isBaseKey ? "resolved" : "shift";
		}
	}
	for (let bar of bars) {
		for (let i = 0; i < bar.length; i++) {
			if (bar[i][1] == null) continue;
			if (bar[i][1] == "resolved") bar[i][0].resolved = true;
			if (bar[i][1] == "shift") bar[i][0].midiPitch += ocjeneOptions.keys.shiftDir;
			bar[i][0].translatePitch();
		}
	}
}

function ocjeneCursorControl() {
	this.onReady = function () {};
	this.onStart = function () {
		let svg = document.querySelector(`#idCanv_ocjeneSheet svg`);
		let cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
		cursor.setAttribute("class", "cl_abcCursor");
		cursor.setAttributeNS(null, "x1", 0);
		cursor.setAttributeNS(null, "y1", 0);
		cursor.setAttributeNS(null, "x2", 0);
		cursor.setAttributeNS(null, "y2", 0);
		svg.appendChild(cursor);
	};
	this.beatSubdivisions = 2;
	this.onBeat = function (beatNumber, totalBeats, totalTime) {};
	this.onEvent = function (ev) {
		if (ev.measureStart && ev.left === null) return; // this was the second part of a tie across a measure line. Just ignore it.
		let lastSelection = document.querySelectorAll(`#${ocjeneOptions.div} svg .cl_abcHighlight`);
		for (let k = 0; k < lastSelection.length; k++) {
			lastSelection[k].classList.remove("cl_abcHighlight");
		}
		for (let i = 0; i < ev.elements.length; i++) {
			const note = ev.elements[i];
			for (let j = 0; j < note.length; j++) {
				note[j].classList.add("cl_abcHighlight");
			}
		}
		const cursor = document.querySelector(`#${ocjeneOptions.div} svg .cl_abcCursor`);
		if (cursor) {
			cursor.setAttribute("x1", ev.left - 2);
			cursor.setAttribute("x2", ev.left - 2);
			cursor.setAttribute("y1", ev.top);
			cursor.setAttribute("y2", ev.top + ev.height);
		}
	};
	this.onFinished = function () {
		const els = document.querySelectorAll("svg .cl_abcHighlight");
		for (let i = 0; i < els.length; i++) {
			els[i].classList.remove("cl_abcHighlight");
		}
		const cursor = document.querySelector(`#${ocjeneOptions.div} svg .cl_abcCursor`);
		if (cursor) {
			cursor.setAttribute("x1", 0);
			cursor.setAttribute("x2", 0);
			cursor.setAttribute("y1", 0);
			cursor.setAttribute("y2", 0);
		}
	};
}

function ocjeneDraw() {
	if (ocjeneSong.synthControl) {
		ocjeneSong.synthControl.pause();
		ocjeneSong.synthControl.restart();
	}
	ocjeneSong.generateData();
	let text = ocjeneOptions.showText.state ? `w: ${ocjeneSong.abcJSText}` : "";
	const res = `${ocjeneSong.header}${ocjeneSong.abcJSSong}\n${text}`;
	const drawOptions = {
		print: false, // show in DINA4 format
		// staffwidth: 400, // width 600
		staffwidth: getCssRoot("CardsWidth", true, true), // width 600
		// responsive: "resize",
		wrap: {
			minSpacing: 1.8,
			maxSpacing: 2.7,
			preferredMeasuresPerLine: ocjeneSong.spread,
		},
	};
	ocjeneSong.abcCanvas = ABCJS.renderAbc(ocjeneOptions.div, res, drawOptions)[0];
	if (!ABCJS.synth.supportsAudio()) {
		console.log("Audio is not supported in this browser.");
		alert("Audio is not supported in this browser.");
		return;
	}
	ocjeneSong.synthControl = new ABCJS.synth.SynthController();
	ocjeneSong.synthControl.load(ocjeneOptions.audio, ocjeneSong.cursorControl, ocjeneSong.synthOptions);
	ocjeneSong.startTune();
}

function createOcjene(preset = null) {
	dbIDStyle("idCanv_ocjeneSheet").backgroundColor = "#FFFFF3";
	dbIDStyle("idCanv_ocjeneSheet").color = "#000000";

	ocjeneOptions.tempo.val = preset === null ? ocjeneOptions.tempo.valOrig : ocjeneSettings.get("tempo");
	resetInput("idVin_ocjeneTempo", ocjeneOptions.tempo.val, {
		min: ocjeneOptions.tempo.min,
		max: ocjeneOptions.tempo.max,
	});

	ocjeneOptions.bars.val = preset === null ? ocjeneOptions.bars.valOrig : ocjeneSettings.get("bars");
	resetInput("idVin_ocjeneBars", ocjeneOptions.bars.val, {
		min: ocjeneOptions.bars.min,
		max: ocjeneOptions.bars.max,
	});

	ocjeneOptions.interval.val = preset === null ? ocjeneOptions.interval.valOrig : ocjeneSettings.get("interval");
	resetInput("idVin_ocjeneInterval", ocjeneOptions.interval.val, {
		min: ocjeneOptions.interval.min,
		max: ocjeneOptions.interval.max,
	});

	ocjeneOptions.timeSignature.index = preset === null ? ocjeneOptions.timeSignature.indexOrig : ocjeneSettings.get("timeSignature");
	const selSignature = dbID("idSel_ocjeneTimeSignature");
	clearFirstChild("idSel_ocjeneTimeSignature");
	for (const [index, opt] of ocjeneOptions.definitions.timeSignatures.entries()) {
		const option = document.createElement("OPTION");
		option.textContent = opt.sig.join("/") + opt.postfix;
		option.value = opt.sig.join("/");
		if (index == ocjeneOptions.timeSignature.index) option.selected = true;
		selSignature.appendChild(option);
	}
	ocjeneOptions.notenwerte.selected = preset === null ? ocjeneOptions.notenwerte.selectedOrig.slice() : ocjeneSettings.get("notenwerte");
	const notenwertCB = dbCL("cl_ocjeneNotenwerte", null);
	for (let i = 0; i < notenwertCB.length; i++) {
		notenwertCB[i].checked = ocjeneOptions.notenwerte.selected[i];
		notenwertCB[i].setAttribute("data-index", i);
	}

	if (preset === null) ocjeneInstruments.index = ocjeneInstruments.indexOrig;
	//populated at the end

	ocjeneOptions.clef.index = ocjeneOptions.definitions.clefs.findIndex((c) => c.en == ocjeneInstruments.instrument.clef);
	const selClefs = dbID("idSel_ocjeneClefs");
	clearFirstChild("idSel_ocjeneClefs");
	for (let [index, clef] of ocjeneOptions.definitions.clefs.entries()) {
		const option = document.createElement("OPTION");
		option.textContent = clef.de;
		option.value = index;
		selClefs.appendChild(option);
		if (index == ocjeneOptions.clef.index) option.selected = true;
	}

	ocjeneOptions.keyOnly.state = preset === null ? ocjeneOptions.keyOnly.stateOrig : ocjeneSettings.get("keyOnly");
	dbID("idCb_ocjeneKeyOnly").checked = ocjeneOptions.keyOnly.state;

	ocjeneOptions.rests.val = preset === null ? ocjeneOptions.rests.valOrig : ocjeneSettings.get("rests");
	resetInput("idVin_ocjeneRests", ocjeneOptions.rests.val, {
		min: ocjeneOptions.rests.min,
		max: ocjeneOptions.rests.max,
	});

	ocjeneOptions.dotted.val = preset === null ? ocjeneOptions.dotted.valOrig : ocjeneSettings.get("dotted");
	resetInput("idVin_ocjeneDotted", ocjeneOptions.dotted.val, {
		min: ocjeneOptions.dotted.min,
		max: ocjeneOptions.dotted.max,
	});

	ocjeneOptions.triplet.val = preset === null ? ocjeneOptions.triplet.valOrig : ocjeneSettings.get("triplet");
	resetInput("idVin_ocjeneTriplet", ocjeneOptions.triplet.val, {
		min: ocjeneOptions.triplet.min,
		max: ocjeneOptions.triplet.max,
	});

	ocjeneOptions.barOverflowStop.state = preset === null ? ocjeneOptions.barOverflowStop.stateOrig : ocjeneSettings.get("barOverflowStop");
	dbID("idCb_ocjeneBarOverflowStop").checked = ocjeneOptions.barOverflowStop.state;

	ocjeneOptions.metronome.state = preset === null ? ocjeneOptions.metronome.stateOrig : ocjeneSettings.get("metronome");
	dbID("idCb_ocjeneMetronome").checked = ocjeneOptions.metronome.state;

	ocjeneOptions.limitRange.state = preset === null ? ocjeneOptions.limitRange.stateOrig : ocjeneSettings.get("limitRange");
	dbID("idCb_ocjeneLimitRange").checked = ocjeneOptions.limitRange.state;

	ocjeneOptions.limitRange.lower = preset === null ? ocjeneOptions.limitRange.lowerOrig : ocjeneSettings.get("limitRangeLower");
	ocjeneOptions.limitRange.upper = preset === null ? ocjeneOptions.limitRange.upperOrig : ocjeneSettings.get("limitRangeUpper");
	//--> call "populate" at the end!

	ocjeneOptions.showText.state = preset === null ? ocjeneOptions.showText.stateOrig : ocjeneSettings.get("showText");
	dbID("idCb_ocjeneShowText").checked = ocjeneOptions.showText.state;

	// ocjeneOptions.showMidi.state = preset === null ? ocjeneOptions.showMidi.stateOrig : ocjeneSettings.get("showMidi");
	// dbID("idCb_ocjeneShowMidi").checked = ocjeneOptions.showMidi.state;

	// ocjeneOptions.textLanguage.index = preset === null ? ocjeneOptions.textLanguage.indexOrig : ocjeneSettings.get("textLanguage");
	// const textLanguage = dbID("idSel_ocjeneTextLanguage");
	// clearFirstChild("idSel_ocjeneTextLanguage");
	// for (let i = 0; i < Object.keys(ocjeneOptions.definitions.notes.textLanguage).length; i++) {
	// 	const option = document.createElement("OPTION");
	// 	option.textContent = ocjeneOptions.textLanguage.name(i);
	// 	option.value = ocjeneOptions.textLanguage.val(i);
	// 	if (i == ocjeneOptions.textLanguage.index) {
	// 		option.selected = true;
	// 	}
	// 	textLanguage.appendChild(option);
	// }

	const selExercise = dbID("idSel_ocjeneExercise");
	clearFirstChild("idSel_ocjeneExercise");
	for (let [index, exName] of ocjeneSettings.exercises.entries()) {
		const option = document.createElement("OPTION");
		option.textContent = exName;
		// option.textContent = `${index + 1} - ${exName}`;
		selExercise.appendChild(option);
		if (index == ocjeneSettings.exercise) option.selected = true;
	}

	// test();
	ocjenePopulateKeys(); // this needs to be below the KeySignatre definition!!
	ocjenePopulateInstruments();
	ocjenePopulateLimitRangeSelect(true);
	setTimeout(ocjeneGenerate, 300);
}

function ocjenePopulateKeys() {
	let selKey = dbID("idSel_ocjeneKey");
	clearFirstChild("idSel_ocjeneKey");
	let optGroupDur = document.createElement("optgroup");
	let optGroupMoll = document.createElement("optgroup");
	optGroupDur.label = "Dur";
	optGroupMoll.label = "Moll";
	for (const [index, opt] of ocjeneOptions.definitions.keys.entries()) {
		const optionDur = document.createElement("OPTION");
		optionDur.textContent = opt[0];
		optionDur.value = index;
		const optionMoll = document.createElement("OPTION");
		optionMoll.textContent = opt[1];
		optionMoll.value = index;
		if (index == 0 && ocjeneOptions.keys.index == null) {
			optionDur.selected = true;
		} else if (index == ocjeneOptions.keys.index) {
			optionDur.selected = true;
		}
		optGroupDur.appendChild(optionDur);
		optGroupMoll.appendChild(optionMoll);
	}
	selKey.appendChild(optGroupDur);
	selKey.appendChild(optGroupMoll);
}
function ocjenePopulateInstruments() {
	clearFirstChild("idSel_ocjeneInstrument");
	let family = {};
	for (const vals of Object.values(ocjeneInstruments.data)) {
		if (family[vals.family] === undefined) {
			family[vals.family] = [vals];
		} else {
			family[vals.family].push(vals);
		}
	}
	for (let [name, arr] of Object.entries(family)) {
		let optGroup = document.createElement("optgroup");
		optGroup.label = name;
		for (let opt of arr) {
			const option = document.createElement("OPTION");
			let tuning = opt.nameENtuning == null ? "" : ` in ${opt.nameENtuning}`;
			option.textContent = `${opt.nameDE}${tuning}`;
			option.value = opt.ID;
			optGroup.appendChild(option);
			if (opt.nameDE == ocjeneInstruments.instrument.nameDE) option.selected = true;
		}
		dbID("idSel_ocjeneInstrument").appendChild(optGroup);
	}
}
function ocjenePopulateLimitRangeSelect(instrumentChange = false) {
	const selLimitRangeLower = dbID("idSel_ocjeneLimitRangeLower");
	const selLimitRangeUpper = dbID("idSel_ocjeneLimitRangeUpper");
	selLimitRangeLower.style.direction = "rtl";
	selLimitRangeUpper.style.direction = "rtl";
	clearFirstChild("idSel_ocjeneLimitRangeLower");
	clearFirstChild("idSel_ocjeneLimitRangeUpper");

	const optGroupLower = document.createElement("optgroup");
	optGroupLower.label = "untere Grenze";
	const optGroupUpper = document.createElement("optgroup");
	optGroupUpper.label = "obere Grenze";
	selLimitRangeLower.appendChild(optGroupLower);
	selLimitRangeUpper.appendChild(optGroupUpper);

	if (instrumentChange) {
		ocjeneOptions.limitRange.lower = ocjeneInstruments.getInstrumentRange[0];
		ocjeneOptions.limitRange.upper = ocjeneInstruments.getInstrumentRange[1];
	}

	for (let i = ocjeneInstruments.getInstrumentFullRange[0]; i <= ocjeneInstruments.getInstrumentFullRange[1]; i++) {
		const optionL = document.createElement("OPTION");
		optionL.textContent = ocjeneOptions.definitions.notes.midiIndexToLanguageText(i);
		optionL.value = i;
		const optionU = optionL.cloneNode(true);
		if (i < ocjeneOptions.limitRange.upper) optGroupLower.appendChild(optionL);
		if (i > ocjeneOptions.limitRange.lower) optGroupUpper.appendChild(optionU);
		if (i == ocjeneOptions.limitRange.lower) optionL.selected = true;
		if (i == ocjeneOptions.limitRange.upper) optionU.selected = true;
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
	const instrument = ocjeneInstruments.data.find((o) => o.ID == obj.value);
	ocjeneInstruments.index = ocjeneInstruments.data.findIndex((o) => o.ID == obj.value);
	ocjeneOptions.clef.index = ocjeneOptions.definitions.clefs.findIndex((c) => c.en == instrument.clef);
	dbID("idSel_ocjeneClefs").selectedIndex = ocjeneOptions.clef.index;
	ocjenePopulateLimitRangeSelect(true);
	ocjeneInputChange();
}

function ocjeneInterval(obj) {
	ocjeneOptions.interval.val = utilsNumberFromInput(obj);
	ocjeneInputChange();
}

function ocjeneClefs(obj) {
	ocjeneOptions.clef.index = obj.selectedIndex;
	ocjeneDraw();
}

function ocjeneKey(obj) {
	ocjeneOptions.keys.index = obj.value;
	ocjenePopulateLimitRangeSelect(false);
	ocjeneInputChange();
}

function ocjeneKeyOnly(obj) {
	ocjeneOptions.keyOnly.state = obj.checked;
	ocjeneInputChange();
}

function ocjeneDotted(obj) {
	ocjeneOptions.dotted.val = utilsNumberFromInput(obj);
	ocjeneInputChange();
}

function ocjeneTriplet(obj) {
	ocjeneOptions.triplet.val = utilsNumberFromInput(obj);
	ocjeneInputChange();
}

function ocjeneShowText(obj) {
	ocjeneOptions.showText.state = obj.checked;
	ocjeneDraw();
}

function ocjeneShowMidi(obj) {
	ocjeneOptions.showMidi.state = obj.checked;
	ocjeneDraw();
}

function ocjeneTextLanguage(obj) {
	ocjeneOptions.textLanguage.index = obj.selectedIndex;
	ocjenePopulateLimitRangeSelect();
	ocjeneDraw();
}

function ocjeneTempo(obj) {
	ocjeneOptions.tempo.val = utilsNumberFromInput(obj);
	ocjeneDraw();
}

function ocjeneBars(obj) {
	ocjeneOptions.bars.val = utilsNumberFromInput(obj);
	ocjeneInputChange();
}

function ocjeneBarOverflowStop(obj) {
	ocjeneOptions.barOverflowStop.state = obj.checked;
	ocjeneInputChange();
}

function ocjeneMetronome(obj) {
	ocjeneOptions.metronome.state = obj.checked;
	ocjeneDraw();
}

function ocjeneLimitRange(obj) {
	ocjeneOptions.limitRange.state = obj.checked;
	if (ocjeneOptions.limitRange.state) {
		dbID("idSel_ocjeneLimitRangeLower").removeAttribute("disabled");
		dbID("idSel_ocjeneLimitRangeUpper").removeAttribute("disabled");
	} else {
		dbID("idSel_ocjeneLimitRangeLower").setAttribute("disabled", "true");
		dbID("idSel_ocjeneLimitRangeUpper").setAttribute("disabled", "true");
	}
	ocjeneInputChange();
}

function ocjeneLimitRangeSelect(obj) {
	ocjeneOptions.limitRange[obj.dataset.sel] = Number(obj.value);
	ocjenePopulateLimitRangeSelect();
	ocjeneInputChange();
}

function ocjeneRests(obj) {
	ocjeneOptions.rests.val = utilsNumberFromInput(obj);
	ocjeneInputChange();
}

function ocjeneInputChange() {
	btnColor("idBtn_ocjeneGenerate", "positive");
}

function ocjeneLevelSelect(obj) {
	ocjeneSettings.type = "level";
	btnColor("idBtn_ocjeneGenerate", null);
	btnColor("idSel_ocjeneExercise", null);
	btnColor(`idBtn_ocjeneLevel${ocjeneSettings.level}`, null);
	ocjeneSettings.level = Number(obj.dataset.level);
	btnColor(`idBtn_ocjeneLevel${ocjeneSettings.level}`, "positive");
	createOcjene(true);
}

function ocjeneExerciseSelect(obj) {
	btnColor("idSel_ocjeneExercise", "positive");
	btnColor("idBtn_ocjeneGenerate", null);
	btnColor(`idBtn_ocjeneLevel${ocjeneSettings.level}`, null);
	ocjeneSettings.type = "exercise";
	ocjeneSettings.exercise = obj.selectedIndex;
	createOcjene(true);
}

const ocjeneSettings = {
	type: "level",
	level: 1,
	exercise: 0,
	get(fn) {
		return this.data[fn];
	},
	exercises: ["1/4 Übung", "1/8 Übung", "1/8 Triolen"],

	data: {
		get tempo() {
			if (ocjeneSettings.type == "level") return [95, 100, randomObject(90, 110), randomObject(90, 110)][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return [95, 100, 100][ocjeneSettings.exercise];
		},
		get bars() {
			if (ocjeneSettings.type == "level") return [4, 4, 8, 16][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return [4, 4, 4][ocjeneSettings.exercise];
		},
		get barOverflowStop() {
			if (ocjeneSettings.type == "level") return [true, true, false, false][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return [true, true, true][ocjeneSettings.exercise];
		},
		get metronome() {
			if (ocjeneSettings.type == "level") return [false, false, false, false][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return [true, true, true][ocjeneSettings.exercise];
		},
		get showText() {
			if (ocjeneSettings.type == "level") return false; //[false, false, false, false][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return false; //[false, false][ocjeneSettings.levexerciseel];
		},
		get showMidi() {
			if (ocjeneSettings.type == "level") return false; //  [false, false, false, false][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return false; // [false, false, false, false][ocjeneSettings.exercise];
		},
		get textLanguage() {
			if (ocjeneSettings.type == "level") return 5; //[5, 5, 5, 5][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return 5; // [5, 5, 5, 5][ocjeneSettings.levexerciseel];
		},
		get interval() {
			if (ocjeneSettings.type == "level") return [4, 5, 8, 10][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return [2, 4, 4][ocjeneSettings.exercise];
		},
		get timeSignature() {
			if (ocjeneSettings.type == "level") return 3; //[3, 3, 3, 3][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return 3; //[3, 3, 3, 3][ocjeneSettings.exercise];
		},
		get notenwerte() {
			if (ocjeneSettings.type == "level")
				return [
					[1, 1, 1, 0, 0, 0],
					[0, 1, 1, 1, 0, 0],
					[0, 0, 1, 1, 1, 0],
					[0, 1, 1, 1, 1, 0],
				][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise")
				return [
					[0, 0, 1, 0, 0, 0],
					[0, 0, 0, 1, 0, 0],
					[0, 0, 0, 1, 0, 0],
				][ocjeneSettings.exercise];
		},
		get keys() {
			if (ocjeneSettings.type == "level") return [0, 0, 0, 0][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return 0; //[0, 0, 0, 0][ocjeneSettings.exercise];
		},
		get keyOnly() {
			if (ocjeneSettings.type == "level") return [true, true, false, false][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return [true, true, true][ocjeneSettings.exercise];
		},
		get dotted() {
			if (ocjeneSettings.type == "level") return [0, 10, 10, 15][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return [0, 0, 0][ocjeneSettings.exercise];
		},
		get triplet() {
			if (ocjeneSettings.type == "level") return [0, 0, 10, 15][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return [0, 0, 100][ocjeneSettings.exercise];
		},
		get rests() {
			if (ocjeneSettings.type == "level") return [0, 0, 15, 30][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return [0, 0, 0][ocjeneSettings.exercise];
		},
		get limitRange() {
			if (ocjeneSettings.type == "level") return [true, true, false, false][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return [true, true, true][ocjeneSettings.exercise];
		},
		get limitRangeLower() {
			if (ocjeneSettings.type == "level") return [55, 53, 53, 50][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return [55, 53, 53, 50][ocjeneSettings.exercise];
		},
		get limitRangeUpper() {
			if (ocjeneSettings.type == "level") return [90, 92, 94, 95][ocjeneSettings.level];
			if (ocjeneSettings.type == "exercise") return [90, 92, 94, 95][ocjeneSettings.exercise];
		},
	},
};
