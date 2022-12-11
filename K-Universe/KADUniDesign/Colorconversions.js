const utilsColor = {
	types: {
		HEX: { postfix: ["", "", ""], stateRange: [(255).toString(16), (255).toString(16), (255).toString(16)] },
		RGB: { postfix: ["", "", ""], stateRange: [255, 255, 255] },
		HSL: { postfix: ["", "%", "%"], stateRange: [0, 0, 100] },
		HSB: { postfix: ["", "%", "%"], stateRange: [0, 0, 100] },
		CMYK: { postfix: ["%", "%", "%", "%"], stateRange: [0, 0, 0, 100] },
	},
	from: null,
	to: null,
	permutate: false,
	chain: [],
	get() {},
	state(COL, type = "HSL", opt = { toColor: false, invert: false }) {
		let col = type == "RGB" ? COL : this[`state${type}`](COL);
		let inv = type == "CMYK" ? !opt.invert : opt.invert;
		let state = Number(this.stateRGB(col, inv));
		if (opt.toColor) return this.stateToColor(state, type);
		return state;
	},
	stateRGB(RGB, invert = false) {
		let uicolors = [RGB[0] / 255, RGB[1] / 255, RGB[2] / 255];
		let c = uicolors.map((col) => {
			if (col <= 0.03928) {
				return col / 12.92;
			}
			return Math.pow((col + 0.055) / 1.055, 2.4);
		});
		let L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
		return invert ? !(L < 0.179) : L < 0.179;
	},
	stateHSL(HSL) {
		return colHSLtoRGB(HSL);
	},
	stateHSB(HSB) {
		return colHSBtoRGB(HSB);
	},
	stateCMYK(CMYK) {
		return colCMYKtoRGB(CMYK);
	},
	stateHEX(HEX) {
		return colHSLtoRGB(HEX);
	},
	stateToColor(state, type) {
		let colArr = [];
		const range = utilsColor.types[type.toUpperCase()].stateRange;
		for (let i = 0; i < range.length; i++) {
			colArr.push(state ? range[i] : 0);
		}
		return colorReturnFormat(colArr, { type, text: true });
	},
};

function test(type = "CMYK") {
	let c = [43, 163, 4];
	let r = utilsColor.state(c, type, { toColor: true });
}

// ------------------ convert to rgb:
//colHEXtoRGB;
function colHEXtoRGB(HEX, opts) {
	let rgb = [];
	const hex = HEX.charAt(0) === "#" ? HEX.substring(1, 7) : HEX;
	rgb[0] = parseInt(hex.substring(0, 2), 16); // hexToR
	rgb[1] = parseInt(hex.substring(2, 4), 16); // hexToG
	rgb[2] = parseInt(hex.substring(4, 6), 16); // hexToB
	return colorReturnFormat(rgb, opts);
}
//colHSLtoRGB;
function colHSLtoRGB(HSL, opts) {
	let h = HSL[0] / 60;
	let s = HSL[1] / 100;
	let l = HSL[2] / 100;
	let rgb = [0, 0, 0];
	const C = (1 - Math.abs(2 * l - 1)) * s;
	const X = C * (1 - Math.abs((h % 2) - 1));
	if (h >= 0 && h < 1) {
		rgb[0] = C;
		rgb[1] = X;
	} else if (h >= 1 && h < 2) {
		rgb[0] = X;
		rgb[1] = C;
	} else if (h >= 2 && h < 3) {
		rgb[1] = C;
		rgb[2] = X;
	} else if (h >= 3 && h < 4) {
		rgb[1] = X;
		rgb[2] = C;
	} else if (h >= 4 && h < 5) {
		rgb[0] = X;
		rgb[2] = C;
	} else {
		rgb[0] = C;
		rgb[2] = X;
	}
	const m = l - C / 2;

	rgb[0] += m;
	rgb[1] += m;
	rgb[2] += m;
	rgb[0] = Math.round(rgb[0] * 255);
	rgb[1] = Math.round(rgb[1] * 255);
	rgb[2] = Math.round(rgb[2] * 255);
	return colorReturnFormat(Object.values(rgb), opts);
}
//colHSBtoRGB;
function colHSBtoRGB(HSB, opts) {
	let s = HSB[0] / 360;
	let v = HSB[1] / 100;
	let h = HSB[2] / 100;
	let r, g, b;
	let i = Math.floor(h * 6);
	let f = h * 6 - i;
	let p = v * (1 - s);
	let q = v * (1 - f * s);
	let t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0:
			(r = v), (g = t), (b = p);
			break;
		case 1:
			(r = q), (g = v), (b = p);
			break;
		case 2:
			(r = p), (g = v), (b = t);
			break;
		case 3:
			(r = p), (g = q), (b = v);
			break;
		case 4:
			(r = t), (g = p), (b = v);
			break;
		case 5:
			(r = v), (g = p), (b = q);
			break;
	}
	r = Math.round(r * 255);
	g = Math.round(g * 255);
	b = Math.round(b * 255);
	return colorReturnFormat([r, g, b], opts);
}
// colCMYKtoRGB;
function colCMYKtoRGB(cmyk, opts) {
	let k = cmyk[3];
	let r = 255 - Math.min(1, cmyk[0] * (1 - k) + k) * 255;
	let g = 255 - Math.min(1, cmyk[1] * (1 - k) + k) * 255;
	let b = 255 - Math.min(1, cmyk[2] * (1 - k) + k) * 255;
	return colorReturnFormat([r, g, b], opts);
}
// ------------------  reverse from rgb:
// colRGBtoHEX;
function colRGBtoHEX(RGB, opts) {
	let rgb = RGB.length === 1 ? [RGB[0], RGB[0], RGB[0]] : RGB;
	if (opts?.alpha != null) {
		rgb.push(opts.alpha);
	}
	let hex = "";
	rgb.forEach((c) => {
		let tempHex = Number(c).toString(16);
		hex += tempHex.length < 2 ? `0${tempHex}` : tempHex;
	});
	return colorReturnFormat(hex, opts);
}
// colRGBtoHSL;
function colRGBtoHSL(RGB, opts) {
	let r = RGB[0] / 255;
	let g = RGB[1] / 255;
	let b = RGB[2] / 255;
	const ma = Math.max(r, g, b);
	const mi = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	let l = (ma + mi) / 2;
	if (ma != mi) {
		const d = ma - mi;
		s = l > 0.5 ? d / (2 - ma - mi) : d / (ma + mi);
		if (r == ma) {
			h = (g - b) / d;
		} else if (g == ma) {
			h = 2 + (b - r) / d;
		} else if (b == ma) {
			h = 4 + (r - g) / d;
		}
		h = Math.min(h * 60, 360);
		if (h < 0) h += 360;
	}
	h = Math.round(h);
	s = Math.round(s * 100);
	l = Math.round(l * 100);
	return colorReturnFormat([h, s, l], opts);
}
// colRGBtoHSB;
function colRGBtoHSB(RGB, opts) {
	let r = RGB[0];
	let g = RGB[1];
	let b = RGB[2];
	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);
	let d = max - min;
	let h;
	let s = max === 0 ? 0 : d / max;
	let v = max / 255;

	switch (max) {
		case min:
			h = 0;
			break;
		case r:
			h = g - b + d * (g < b ? 6 : 0);
			h /= 6 * d;
			break;
		case g:
			h = b - r + d * 2;
			h /= 6 * d;
			break;
		case b:
			h = r - g + d * 4;
			h /= 6 * d;
			break;
	}
	h *= 360;
	s *= 100;
	v *= 100;
	return colorReturnFormat([h, s, v], opts);
}
//colRGBtoCMYK;
function colRGBtoCMYK(RGB, opts) {
	let r = RGB[0] / 255;
	let g = RGB[1] / 255;
	let b = RGB[2] / 255;
	let max = Math.max(r, g, b);
	let c, m, y;
	let k = 1 - max;
	if (k == 1) {
		c = 0;
		m = 0;
		y = 0;
	} else {
		c = (1 - r - k) / (1 - k);
		m = (1 - g - k) / (1 - k);
		y = (1 - b - k) / (1 - k);
	}
	return colorReturnFormat([c, m, y, k], opts);
}

// permutations
function colHSLtoHEX(HSL, opts) {
	const rgb = colHSLtoRGB(HSL);
	const hex = colRGBtoHEX(rgb);
	return colorReturnFormat(hex, opts);
}

function colHEXtoHSL(HEX, opts) {
	const rgb = colHEXtoRGB(HEX);
	const hsl = colRGBtoHSL(rgb);
	return colorReturnFormat(hsl, opts);
}

//--------------------------------------------------------- colorReturnFormat ---------------------------------------------------------
function colorReturnFormat(colArray, opts = { alpha: null, type: "", text: false }) {
	if (opts == undefined || opts.text == "") return colArray;
	if (typeof arguments[0] === "string") return `${colArray.toUpperCase()}`;
	const typePostfix = utilsColor.types[opts.type.toUpperCase()].postfix;
	let retString = opts.text ? `${opts.type.toLowerCase()}(` : "";
	for (let i = 0; i < colArray.length; i++) {
		retString += ` ${colArray[i]}${typePostfix[i]}`;
	}
	retString += opts.alpha != null ? ` / ${opts.alpha}` : "";
	retString += opts.text ? ")" : "";
	return retString;
}

// ------------------------------------------------------- get States from colors -------------------------------------------------------
function colStateHSL(HSL, invert = false) {
	const rgb = colHSLtoRGB(HSL);
	const output = colStateRGB(rgb, invert);
	return Number(output);
}

function colStateRGB(RGB, invert = false) {
	let uicolors = [RGB[0] / 255, RGB[1] / 255, RGB[2] / 255];
	let c = uicolors.map((col) => {
		if (col <= 0.03928) {
			return col / 12.92;
		}
		return Math.pow((col + 0.055) / 1.055, 2.4);
	});
	let L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
	const output = invert ? !(L < 0.179) : L < 0.179;
	return Number(output);
}
function colStateHSB(HSB, invert = false) {
	const rgb = colHSBtoRGB(HSB);
	const output = colStateRGB(rgb, invert);
	return Number(output);
}
function colStateCMYK(CMYK, invert = false) {
	const rgb = colCMYKtoRGB(CMYK);
	const output = colStateRGB(rgb, invert);
	return Number(output);
}
function colStateHEX(HEX, invert = false) {
	const rgb = colHSLtoRGB(HEX);
	const output = colStateRGB(rgb, invert);
	return Number(output);
}

// ------------------------------------------------------- get Colors from State -------------------------------------------------------
function colStateToHSL(HSL, invert = false) {
	let state = colStateHSL(HSL, invert);
	return colorReturnFormat([0, 0, state * 100]);
}

function colStateToRGB(RGB, invert = false) {
	let state = colStateRGB(RGB, invert);
	return colorReturnFormat([state * 255, state * 255, state * 255]);
}

function colStateToHEX(HEX, invert = false) {
	let state = colStateHEX(HEX, invert);
	return colorReturnFormat([state * 255, state * 255, state * 255]);
}
