import { daEL, dbID, dbIDStyle, KadColor, KadDOM } from "../General/KadUtils.js";
import { globalValues } from "../Settings/Basics.js";
import { Data_RALColors } from "../General/MainData.js";

const kounselorOptions = {
	curType: null,
	curTypeOrig: "HSL",
	types: {
		RAL: {
			value: null,
			setValue(input) {
				this.value = input.trim();
			},
			convert() {
				this.value = null;
			},
		},
		Name: {
			value: null,
			setValue(input) {
				this.value = input.trim();
			},
			convert() {
				this.value = null;
			},
		},
		HEX: {
			value: null,
			setValue(input) {
				this.value = input.charAt(0) === "#" ? input : `#${input}`;
			},
			convert() {
				if (kounselorOptions.types.RGB.value == null) {
					kounselorOptions.types.RGB.value = KadColor.get(this.value, "HEX", "RGB");
				}
				if (this.value == null) {
					this.value = KadColor.get(kounselorOptions.types.RGB.value, "RGB", "HEX");
				}
			},
		},
		RGB: {
			value: null,
			setValue(input) {
				let data = input.replace(/\s/g, "");
				data = data.split(/,|-|\s/g);
				this.value = data.map((n) => Number(n));
			},
			convert() {
				return;
			},
		},
		HSL: {
			value: null,
			setValue(input) {
				let data = input.replace(/%/g, "");
				data = data.split(/,|-|\s/g);
				this.value = data.map((n) => Number(n));
			},
			convert() {
				if (kounselorOptions.types.RGB.value == null) {
					kounselorOptions.types.RGB.value = KadColor.get(this.value, "HSL", "RGB");
				}
				let RGB = kounselorOptions.types.RGB.value;
				if (this.value == null) {
					this.value = KadColor.get(kounselorOptions.types.RGB.value, "RGB", "HSL");
				}
			},
		},
		HSB: {
			// same as HSV
			value: null,
			setValue(input) {
				let data = input.replace(/%/g, "");
				data = data.split(/,|-|\s/g);
				this.value = data.map((n) => Number(n));
			},
			convert() {
				if (kounselorOptions.types.RGB.value == null) {
					kounselorOptions.types.RGB.value = KadColor.get(this.value, "HSB", "RGB");
				}
				let RGB = kounselorOptions.types.RGB.value;
				if (this.value == null) {
					this.value = KadColor.get(kounselorOptions.types.RGB.value, "RGB", "HSB");
				}
			},
		},
		CMYK: {
			value: null,
			setValue(input) {
				let data = input.replace(/%/g, "");
				data = data.split(/,|-|\s/g);
				this.value = data.map((n) => Number(n));
			},
			convert() {
				if (kounselorOptions.types.RGB.value == null) {
					kounselorOptions.types.RGB.value = KadColor.get(this.value, "CMYK", "RGB");
				}
				let RGB = kounselorOptions.types.RGB.value;
				if (this.value == null) {
					this.value = KadColor.get(kounselorOptions.types.RGB.value, "RGB", "CMYK");
				}
			},
		},
	},
};

export function clear_cl_Kounselor() {
	for (const name of Object.keys(kounselorOptions.types)) {
		const id = `idVin_kounselor${name}`;
		daEL(id, "focus", () => kounselorPopulateDatalists(id));
		daEL(id, "change", () => kounselorInput(id));
		KadDOM.resetInput(id, name);
		kounselorOptions.types[name].value = null;
	}
	kounselorOptions.curType = kounselorOptions.curTypeOrig;
	kounselorOptions.types[kounselorOptions.curType].value = globalValues.colors.elements.baseColor;
	kounselorShowResults();
}

export function canvas_cl_Kounselor() {
	clear_cl_Kounselor();
}

function kounselorPopulateDatalists(obj) {
	const type = dbID(obj).dataset.type;
	if (dbID(`idDlist_kounselor${type}`).childNodes.length > 1) return;
	for (const data of Data_RALColors) {
		const opt = document.createElement("OPTION");
		opt.textContent = data[type];
		dbID(`idDlist_kounselor${type}`).appendChild(opt);
	}
}

function kounselorInput(vinObj) {
	const obj = dbID(vinObj);
	const input = KadDOM.stringFromInput(obj);
	// let input = dbID(obj).value.trim();
	if (input === "") return;
	kounselorOptions.curType = obj.dataset.type;
	kounselorOptions.types[kounselorOptions.curType].setValue(input);
	const result = kounselorScanDatalist();
	if (result != false) {
		for (const [key, val] of Object.entries(result)) {
			kounselorOptions.types[key].value = val;
		}
		kounselorShowResults();
		return;
	}
	if (kounselorOptions.curType == "RAL" || kounselorOptions.curType == "Name") return;
	kounselorConvert();
	kounselorShowResults();
}

function kounselorScanDatalist() {
	for (let obj of Data_RALColors) {
		if (JSON.stringify(obj[kounselorOptions.curType]) == JSON.stringify(kounselorOptions.types[kounselorOptions.curType].value)) return obj;
	}
	return false;
}
function kounselorConvert() {
	kounselorOptions.types[kounselorOptions.curType].convert();
	const list = Object.keys(kounselorOptions.types).filter((k) => !(k == kounselorOptions.curType)); // || k == "RAL" || k == "Name"));
	for (const name of list) {
		kounselorOptions.types[name].convert();
	}
}

function kounselorShowResults() {
	for (const type of Object.keys(kounselorOptions.types)) {
		if (type != kounselorOptions.curType) {
			if (kounselorOptions.types[type].value == null) {
				KadDOM.resetInput(`idVin_kounselor${type}`, type);
				continue;
			}
			KadDOM.resetInput(`idVin_kounselor${type}`, KadColor.formatAsCSS(kounselorOptions.types[type].value, type));
		}
	}
	const colorCSS = KadColor.formatAsCSS(kounselorOptions.types.HSL.value, "HSL");
	dbIDStyle("idLbl_kounselorOutputA").background = colorCSS;
	dbIDStyle("idLbl_kounselorOutputB").background = colorCSS;
	dbIDStyle("idLbl_kounselorOutputA").color = KadColor.stateAsCSS(kounselorOptions.types.HSL.value, "HSL");
	dbIDStyle("idLbl_kounselorOutputB").color = KadColor.stateAsCSS(kounselorOptions.types.HSL.value, "HSL", true);
}
