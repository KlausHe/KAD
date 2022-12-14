const kounselorOptions = {
	curType: null,
	curTypeOrig: "HSL",
	contrastGood: "#FFFFFF",
	contrastBad: "#000000",
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
					kounselorOptions.types.RGB.value = utilsColor.get("HEX", "RGB", this.value);
				}
				if (this.value == null) {
					this.value = utilsColor.get("RGB", "HEX", kounselorOptions.types.RGB.value);
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
					kounselorOptions.types.RGB.value = utilsColor.get("HSL", "RGB", this.value);
				}
				let RGB = kounselorOptions.types.RGB.value;
				if (this.value == null) {
					this.value = utilsColor.get("RGB", "HSL", kounselorOptions.types.RGB.value);
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
					kounselorOptions.types.RGB.value = utilsColor.get("HSB", "RGB", this.value);
				}
				let RGB = kounselorOptions.types.RGB.value;
				if (this.value == null) {
					this.value = utilsColor.get("RGB", "HSB", kounselorOptions.types.RGB.value);
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
					kounselorOptions.types.RGB.value = utilsColor.get("CMYK", "RGB", this.value);
				}
				let RGB = kounselorOptions.types.RGB.value;
				if (this.value == null) {
					this.value = utilsColor.get("RGB", "CMYK", kounselorOptions.types.RGB.value);
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
	for (const name of Object.keys(kounselorOptions.types)) {
		if (name != kounselorOptions.curType) {
			if (kounselorOptions.types[name].value == null) {
				resetInput(`idVin_kounselor${name}`, name);
				continue;
			}
			resetInput(
				`idVin_kounselor${name}`,
				colorReturnFormat(kounselorOptions.types[name].value, {
					type: name.toLowerCase(),
					text: true,
				})
			);
		}
	}
	const color = kounselorOptions.types.HSL.value;
	kounselorOptions.contrastGood = colStateToHSL(color);
	kounselorOptions.contrastBad = colStateToHSL(color, true);
	dbIDStyle("idLbl_kounselorOutputA").background = colorReturnFormat(color, {
		type: "hsl",
		text: true,
	});
	dbIDStyle("idLbl_kounselorOutputB").background = colorReturnFormat(color, {
		type: "hsl",
		text: true,
	});
	dbIDStyle("idLbl_kounselorOutputA").color = colorReturnFormat(kounselorOptions.contrastGood, {
		type: "hsl",
		text: true,
	});
	dbIDStyle("idLbl_kounselorOutputB").color = colorReturnFormat(kounselorOptions.contrastBad, {
		type: "hsl",
		text: true,
	});
}
