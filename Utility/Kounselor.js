import { Data_RALColors } from "../General/MainData.js";
import { dbID, dbIDStyle, initEL, KadColor } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";

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
				if (this.value == null) {
					this.value = KadColor.get(kounselorOptions.types.RGB.value, "RGB", "CMYK");
				}
			},
		},
	},
};

initEL({ id: idVin_kounselorRAL, fn: kounselorInput, resetValue: "RAL", dbList: Data_RALColors.map((d) => d.RAL) });
initEL({ id: idVin_kounselorName, fn: kounselorInput, resetValue: "Name", dbList: Data_RALColors.map((d) => d.Name) });
initEL({ id: idVin_kounselorHEX, fn: kounselorInput, resetValue: "HEX", dbList: Data_RALColors.map((d) => d.HEX) });
initEL({ id: idVin_kounselorRGB, fn: kounselorInput, resetValue: "RGB", dbList: Data_RALColors.map((d) => d.RGB) });
initEL({ id: idVin_kounselorHSL, fn: kounselorInput, resetValue: "HSL", dbList: Data_RALColors.map((d) => d.HSL) });
initEL({ id: idVin_kounselorHSB, fn: kounselorInput, resetValue: "HSB", dbList: Data_RALColors.map((d) => d.HSB) });
initEL({ id: idVin_kounselorCMYK, fn: kounselorInput, resetValue: "CMYK", dbList: Data_RALColors.map((d) => d.CMYK) });

export function clear_cl_Kounselor() {
	for (const name of Object.keys(kounselorOptions.types)) {
		dbID(`idVin_kounselor${name}`).KadReset();
		kounselorOptions.types[name].value = null;
	}
	kounselorOptions.curType = kounselorOptions.curTypeOrig;
	kounselorOptions.types[kounselorOptions.curType].value = globalColors.elements.baseColor;
	kounselorShowResults();
}

export function canvas_cl_Kounselor() {
	clear_cl_Kounselor();
}

function kounselorInput(vinObj) {
	const obj = vinObj.target;
	const input = obj.KadGet();
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
		if (type == kounselorOptions.curType) continue;
		const val = kounselorOptions.types[type].value == null ? type : KadColor.formatAsString({ colorArray: kounselorOptions.types[type].value, type });
		dbID(`idVin_kounselor${type}`).KadReset({ resetValue: val });
	}
	const colorCSS = KadColor.formatAsCSS({ colorArray: kounselorOptions.types.HSL.value, type: "HSL" });
	dbIDStyle("idLbl_kounselorOutputA").background = colorCSS;
	dbIDStyle("idLbl_kounselorOutputB").background = colorCSS;
	dbIDStyle("idLbl_kounselorOutputA").color = KadColor.stateAsCSS({ colorArray: kounselorOptions.types.HSL.value, type: "HSL" });
	dbIDStyle("idLbl_kounselorOutputB").color = KadColor.stateAsCSS({ colorArray: kounselorOptions.types.HSL.value, type: "HSL", invert: true });
}
