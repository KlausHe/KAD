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
					kounselorOptions.types.RGB.value = utilsColor.get(this.value, "HEX", "RGB");
				}
				if (this.value == null) {
					this.value = utilsColor.get(kounselorOptions.types.RGB.value, "RGB", "HEX");
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
					kounselorOptions.types.RGB.value = utilsColor.get(this.value, "HSL", "RGB");
				}
				let RGB = kounselorOptions.types.RGB.value;
				if (this.value == null) {
					this.value = utilsColor.get(kounselorOptions.types.RGB.value, "RGB", "HSL");
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
					kounselorOptions.types.RGB.value = utilsColor.get(this.value, "HSB", "RGB");
				}
				let RGB = kounselorOptions.types.RGB.value;
				if (this.value == null) {
					this.value = utilsColor.get(kounselorOptions.types.RGB.value, "RGB", "HSB");
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
					kounselorOptions.types.RGB.value = utilsColor.get(this.value, "CMYK", "RGB");
				}
				let RGB = kounselorOptions.types.RGB.value;
				if (this.value == null) {
					this.value = utilsColor.get(kounselorOptions.types.RGB.value, "RGB", "CMYK");
				}
			},
		},
	},
};

function clear_cl_Kounselor() {
	for (const name of Object.keys(kounselorOptions.types)) {
		resetInput(`idVin_kounselor${name}`, name);
		kounselorOptions.types[name].value = null;
	}
	kounselorOptions.curType = kounselorOptions.curTypeOrig;
	kounselorOptions.types[kounselorOptions.curType].value = globalValues.colors.elements.baseColor;
	kounselorShowResults();
}

function kounselorPopulateDatalists(obj) {
	const type = obj.dataset.type;
	if (dbID(`idDlist_kounselor${type}`).childNodes.length > 1) return;
	for (const data of Data_Kounselor) {
		const opt = document.createElement("OPTION");
		opt.textContent = data[type];
		dbID(`idDlist_kounselor${type}`).appendChild(opt);
	}
}

function kounselorInput(obj) {
	let input = obj.value.trim();
	if (input === "") return;
	kounselorOptions.curType = obj.dataset.type;
	kounselorOptions.types[kounselorOptions.curType].setValue(input);
	const result = kounselorScanDatalist();
	if (result != false) {
		kounselorSetResults(result);
		kounselorShowResults();
		return;
	}
	if (kounselorOptions.curType == "RAL" || kounselorOptions.curType == "Name") return;
	kounselorConvert();
	kounselorShowResults();
}

function kounselorScanDatalist() {
	for (let obj of Data_Kounselor) {
		if (JSON.stringify(obj[kounselorOptions.curType]) == JSON.stringify(kounselorOptions.types[kounselorOptions.curType].value)) {
			return obj;
		}
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

function kounselorSetResults(obj) {
	for (const [key, val] of Object.entries(obj)) {
		kounselorOptions.types[key].value = val;
	}
}

function kounselorShowResults() {
	for (const type of Object.keys(kounselorOptions.types)) {
		if (type != kounselorOptions.curType) {
			if (kounselorOptions.types[type].value == null) {
				resetInput(`idVin_kounselor${type}`, type);
				continue;
			}
			resetInput(`idVin_kounselor${type}`, utilsColor.formatAsCSS(kounselorOptions.types[type].value, type));
		}
	}
	const colorCSS = utilsColor.formatAsCSS(kounselorOptions.types.HSL.value, "HSL");
	dbIDStyle("idLbl_kounselorOutputA").background = colorCSS;
	dbIDStyle("idLbl_kounselorOutputB").background = colorCSS;
	dbIDStyle("idLbl_kounselorOutputA").color = utilsColor.stateAsCSS(kounselorOptions.types.HSL.value, "HSL");
	dbIDStyle("idLbl_kounselorOutputB").color = utilsColor.stateAsCSS(kounselorOptions.types.HSL.value, "HSL", true);
}
