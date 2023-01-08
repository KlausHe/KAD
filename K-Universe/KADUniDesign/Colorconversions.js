const utilsColor = {
	types: {
		HEX: { postfix: ["", "", ""], stateRange: ["FF", "FF", "FF"] },
		RGB: { postfix: ["", "", ""], stateRange: [255, 255, 255] },
		HSL: { postfix: ["", "%", "%"], stateRange: [0, 0, 100] },
		HSB: { postfix: ["", "%", "%"], stateRange: [0, 0, 100] },
		CMYK: { postfix: ["%", "%", "%", "%"], stateRange: [0, 0, 0, 100] },
	},
	colAsArray(colArr = [], cFrom = "", cTo = "") {
		let colFrom = cFrom.toUpperCase();
		const colTo = cTo.toUpperCase();
		if (!Object.keys(this.types).includes(colFrom)) return;
		if (!Object.keys(this.types).includes(colTo)) return;
		let c = colArr;
		if (colFrom != "RGB" && colTo != "RGB") {
			c = this[`${colFrom}toRGB`](colArr);
			colFrom = "RGB";
		}
		return this[`${colFrom}to${colTo}`](c);
	},
	colAsString(colArr = [], cFrom = "", cTo = "") {
		const c = this.colAsArray(colArr, cFrom, cTo);
		return this.formatAsString(c, cTo);
	},
	colAsCSS(colArr = [], cFrom = "", cTo = "") {
		const c = this.colAsArray(colArr, cFrom, cTo);
		return this.formatAsCSS(c, cTo);
	},

	stateAsBool(colArr = [], type = "HSL", invert = false) {
		let RGB = type == "RGB" ? colArr : this[`${type}toRGB`](colArr);
		let inv = type == "CMYK" ? !invert : invert;
		let uicolors = [RGB[0] / 255, RGB[1] / 255, RGB[2] / 255];
		let c = uicolors.map((col) => {
			if (col <= 0.03928) return col / 12.92;
			return Math.pow((col + 0.055) / 1.055, 2.4);
		});
		let L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
		return Number(inv ? !(L < 0.179) : L < 0.179);
	},
	stateAsArray(colArr = [], type = "HSL", invert = false) {
		const state = this.stateAsBool(colArr, type, invert);
		let c = [];
		const range = utilsColor.types[type.toUpperCase()].stateRange;
		for (let i = 0; i < range.length; i++) {
			c.push(state ? range[i] : 0);
		}
		return c;
	},
	stateAsString(colArr = [], type = "HSL", invert = false) {
		let c = this.stateAsArray(colArr, type, invert);
		return this.formatAsString(c, type);
	},
	stateAsCSS(colArr = [], type = "HSL", invert = false) {
		let c = this.stateAsArray(colArr, type, invert);
		return this.formatAsCSS(c, type);
	},

	formatAsString(colArray, type = "HSL") {
		if (typeof colArray === "string") return `${colArray.toUpperCase()}`;
		const typePostfix = utilsColor.types[type].postfix;
		let retString = "";
		for (let i = 0; i < colArray.length; i++) {
			retString += i > typePostfix.length ? ` / ${colArray[i]}` : ` ${colArray[i]}${typePostfix[i]}`;
		}
		return retString;
	},
	formatAsCSS(colArray, type = "HSL") {
		if (typeof colArray === "string") return `${colArray.toUpperCase()}`;
		const typePostfix = utilsColor.types[type].postfix;
		let retString = `${type.toLowerCase()}(`;
		for (let i = 0; i < colArray.length; i++) {
			if (i > typePostfix.length) {
				retString += ` / ${colArray[i]}`;
			} else {
				retString += ` ${colArray[i]}${typePostfix[i]}`;
			}
		}
		retString += ")";
		return retString;
	},

	HEXtoRGB(HEX) {
		let rgb = [];
		const hex = HEX.charAt(0) === "#" ? HEX.substring(1, 7) : HEX;
		rgb[0] = parseInt(hex.substring(0, 2), 16);
		rgb[1] = parseInt(hex.substring(2, 4), 16);
		rgb[2] = parseInt(hex.substring(4, 6), 16);
		return rgb;
	},
	HSLtoRGB(HSL) {
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
		return Object.values(rgb);
	},
	HSBtoRGB(HSB) {
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
		return [r, g, b];
	},
	CMYKtoRGB(CMYK) {
		let k = CMYK[3];
		let r = 255 - Math.min(1, CMYK[0] * (1 - k) + k) * 255;
		let g = 255 - Math.min(1, CMYK[1] * (1 - k) + k) * 255;
		let b = 255 - Math.min(1, CMYK[2] * (1 - k) + k) * 255;
		return [r, g, b];
	},
	RGBtoHEX(RGB) {
		let rgb = RGB.length === 1 ? [RGB[0], RGB[0], RGB[0]] : RGB;
		let hex = "#";
		rgb.forEach((c) => {
			let tempHex = Number(c).toString(16);
			hex += tempHex.length < 2 ? `0${tempHex}` : tempHex;
		});
		return hex;
	},
	RGBtoHSL(RGB) {
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
		return [h, s, l];
	},
	RGBtoHSB(RGB) {
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
		h = Math.round(h * 360);
		s = Math.round(s * 100);
		v = Math.round(v * 100);
		return [h, s, v];
	},
	RGBtoCMYK(RGB) {
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
		c = Math.round(c * 100);
		m = Math.round(m * 100);
		y = Math.round(y * 100);
		k = Math.round(k * 100);
		return [c, m, y, k];
	},
};
