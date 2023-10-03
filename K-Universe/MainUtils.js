/**
 *  @param {String} app Name of *.js File, used in Rest-Endpoint
 *  @param {Object} data data-Object
 */
async function utilsSocketPost(app = null, data) {
	if (app == null) return;
	if (typeof data != "object") {
		console.error("NO OBJECT", data);
		return;
	}
	const path = "K-Universe/";
	const request = new Request(`${path}${app}/`, {
		method: "POST",
		body: data == null ? "" : JSON.stringify(data),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
	});
	const response = await fetch(request);
	const obj = await response.json();
	window[`${firstLetterLow(app)}Return`](obj);
}

function utilsGetWeekNumber(d) {
	const date = d ? new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) : new Date();
	const curThu = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000);
	const yearThu = curThu.getFullYear();
	const firstThu = new Date(new Date(yearThu, 0, 4).getTime() + (3 - ((new Date(yearThu, 0, 4).getDay() + 6) % 7)) * 86400000);
	return Math.floor(1 + 0.5 + (curThu.getTime() - firstThu.getTime()) / 604800000);
}

// function tableScrollInView(id) {
// 	dbID(id).scrollIntoView({
// 		behavior: "smooth",
// 		block: "nearest",
// 		inline: "end", //start
// 	});
// }

function utilsGetImgPath(name) {
	return `Data/Images/SVG/${name}.svg`;
}

function utilsCopyToClipboard(text) {
	if (globalValues.settings.copyClick) {
		let val = text;
		if (!isNaN(val) && Number.isFinite(Number(val))) {
			val = val.toString().replace(/,/g, ""); //remove thousandscomma
			val = !globalValues.settings.copyClick ? val.replace(".", ",") : val;
		}

		if (!navigator.clipboard) {
			// use old commandExec() way
			let temp = document.createElement("input");
			document.body.appendChild(temp);
			temp.setAttribute("value", val);
			temp.select();
			document.execCommand("copy");
			document.body.removeChild(temp);
		} else {
			navigator.clipboard.writeText(val);
		}
	}
}

function dbID(id) {
	if (id instanceof Object) return id;
	return document.getElementById(id);
}

function dbCL(id, loc = 0) {
	if (loc === null) {
		return document.getElementsByClassName(id);
	}
	return document.getElementsByClassName(id)[loc];
}

function dbIDStyle(id) {
	if (id instanceof Object) return id.style;
	return document.getElementById(id).style;
}

function dbCLStyle(id, loc = 0) {
	if (loc === null) {
		let ret = [];
		for (const s of document.getElementsByClassName(id)) {
			ret.push(s.style);
		}
		return ret;
	}
	return document.getElementsByClassName(id)[loc].style;
}

function utilsResetInput(id, ph, opts = null) {
	const obj = dbID(id);
	if (obj.type == "checkbox") {
		obj.checked = ph;
		return ph;
	}
	obj.value = "";
	obj.placeholder = ph;
	if (opts != null) {
		for (let [key, val] of Object.entries(opts)) {
			obj[key] = val;
		}
	}
	return Number(obj.placeholder);
}

function utilsBtnColor(id, opt = null) {
	const obj = dbID(id);
	if (opt === null) obj.removeAttribute("data-btnstatus");
	else if (opt === "positive") obj.dataset.btnstatus = "btnPositive";
	else if (opt === "negative") obj.dataset.btnstatus = "btnNegative";
	else if (opt === "colored") obj.dataset.btnstatus = "btnBasecolor";
}

function utilsEnableBtn(id, state) {
	const obj = typeof id == "string" ? dbID(id) : id;
	if (state) {
		obj.removeAttribute("disabled");
	} else {
		obj.setAttribute("disabled", "true");
	}
}

/**
 *  @param {Number} val Value to be constrained
 *  @param {Number} low lower border or null
 *  @param {Number} high higher border or null
 */
function utilsValueConstrain(val, min = null, max = null) {
	if (min == null && max == null) return val;
	if (min != null && max != null) return Math.max(Math.min(val, max), min);
	if (min == null && max != null) return Math.min(val, max);
	if (min != null && max == null) return Math.max(val, min);
}

function utilsValueMapping(i, start1, stop1, start2, stop2, bounds = false) {
	const val = ((i - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
	if (!bounds) {
		return val;
	}
	if (start2 < stop2) {
		return utilsValueConstrain(val, start2, stop2);
	} else {
		return utilsValueConstrain(val, stop2, start2);
	}
}

// untested!!!
function arrayConstrain(arr, val, low = null, high = null) {
	const arrayMin = Math.min(...arr);
	const arrayMax = Math.max(...arr);
	let a = low || arrayMin;
	let b = high || arrayMax;
	utilsValueConstrain(val, a, b);
}

function utilsGetNearestValueInArray(arr, val, higher = false) {
	return arr.reduce((prev, curr) => {
		if (higher) return Math.abs(curr - val) > Math.abs(prev - val) ? curr : prev;
		else return Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev;
	});
}

function utilsVinChange(id, v) {
	let obj = null;
	let siblingList = Array.from(id.parentNode.children);
	for (let i = siblingList.indexOf(id) - 1; i >= 0; i--) {
		if (siblingList[i].type != "button") {
			obj = siblingList[i];
			break;
		}
	}
	if (obj == null) return;
	if (obj.disabled) return;

	const dir = Number(v);

	if (obj.type == "time") evaluateTime();
	if (obj.type == "number") evaluateNumber();

	obj.dispatchEvent(new Event("input"));
	obj.focus();

	//---
	function evaluateTime() {
		const h = Number(obj.value.slice(0, 2));
		const m = Number(obj.value.slice(3, 5));
		let time = m + h * 60;
		time += time % 5 == 0 ? dir * 5 : dir;
		const t = utilsMinutesToObj(time);
		obj.value = `${t.h}:${t.m}`;
	}
	function evaluateNumber() {
		if (dir == 0) {
			const time = new Date().getTime();
			obj.setAttribute("data-ts", time);
			if (Number(obj.value) === 0 || Number(obj.value) === Number(obj.min)) {
				obj.value = "";
				return;
			}
			obj.value = obj.min || 0;
			return;
		}

		const time = new Date().getTime();
		let skip = false;
		if (obj.hasAttribute("data-ts")) {
			if (time - obj.dataset.ts < 1500) skip = true;
		}
		obj.setAttribute("data-ts", time);
		const actual = obj.value == "" && obj.placeholder != "" ? Number(obj.placeholder) : Number(obj.value);
		const num = skip && actual % 5 == 0 ? actual + dir * 5 : actual + dir;
		const min = obj.hasAttribute("min") && dir < 1 ? Number(obj.min) : null;
		const max = obj.hasAttribute("max") && dir > 0 ? Number(obj.max) : null;
		obj.value = utilsValueConstrain(num, min, max);
	}
}

function utilsNumberFromInput(id, failSafeVal = null, noPlaceholder = null) {
	const obj = dbID(id);
	if (!isNaN(obj.valueAsNumber)) return obj.valueAsNumber;
	if (failSafeVal != null) return failSafeVal;
	if (noPlaceholder != null) return null;
	return Number(obj.placeholder);
}

function utilsNumber(value = 1, { formating = globalValues.copySeparatorLocation, indicator = false, leadingDigits = 1, decimals = 1, currency = null, unit = null, notation = "standard" } = {}) {
	let options = {
		useGrouping: indicator,
		notation: notation,
		minimumIntegerDigits: leadingDigits,
		maximumFractionDigits: decimals,
	};

	if (options.notation == "engineering" || options.notation == "scientific") {
		if (value < 1000 && value > -1000) {
			options.notation = "standard";
			options.maximumFractionDigits = 1;
		}
	}

	if (currency) {
		options.useGrouping = true;
		options.style = "currency";
		options.currency = currency;
		options.maximumFractionDigits = 3;
	}
	if (unit) {
		options.style = "unit";
		options.unit = unit;
		options.unitDisplay = "short";
		options.useGrouping = true;
	}
	return Intl.NumberFormat(formating, options).format(value);
}

function utilsDate(date = null, { format = "DD.MM.YYYY", leadingDigit = true, reversed = false } = {}) {
	const regexSplit = new RegExp(/([$-/:-?{-~!"^_`\ [\]])/);
	const conversions = {
		date: date === null ? new Date() : new Date(date),
		get YYYY() {
			return this.date.getFullYear();
		},
		get YY() {
			return parseInt(this.date.getFullYear().toString().slice(2, 4), 10);
		},
		get MM() {
			return this.date.getMonth() + 1;
		},
		get DD() {
			return this.date.getDate();
		},
		get WD() {
			return i18nDE.weekdaysShort[this.date.getDay()];
		},
		get HH() {
			return this.date.getHours();
		},
		get mm() {
			return this.date.getMinutes();
		},
		get ss() {
			return this.date.getSeconds();
		},
		get ms() {
			return this.date.getMilliseconds();
		},
	};
	let arr = format.split(regexSplit);
	const leadingDigits = leadingDigit ? 2 : 1;
	for (let i = 0; i < arr.length; i++) {
		if (Object.keys(conversions).includes(arr[i])) {
			let str = utilsNumber(conversions[arr[i]], { leadingDigits });
			arr[i] = !isNaN(str) ? str : conversions[arr[i]];
		}
	}
	if (reversed) arr = arr.reverse();
	return arr.join("");
}

function utilsMinutesToObj(mins) {
	let h = Math.floor(mins / 60) < 10 ? `0${Math.floor(mins / 60)}` : Math.floor(mins / 60);
	let m = mins % 60 < 10 ? `0${mins % 60}` : mins % 60;
	return {
		h,
		m,
	};
}
function utilsSecondsToObj(second) {
	let sec = Math.floor(second);
	const obj = utilsMinutesToObj(Math.floor(sec / 60));
	const h = obj.h;
	const m = obj.m;
	const s = sec % 60 < 10 ? `0${sec % 60}` : sec % 60;
	return {
		h,
		m,
		s,
	};
}

function utilsGetHour(time = null) {
	if (time === null) {
		return new Date().getHours();
	} else if (time < 10000000000) {
		return new Date(time * 1000).getHours();
	} else {
		return new Date(time).getHours();
	}
}

function firstLetterCap(s) {
	if (s == "") return s;
	if (typeof s != "string") return s;
	return s[0].toUpperCase() + s.slice(1);
}

function firstLetterLow(s) {
	if (s == "") return s;
	if (typeof s != "string") return s;
	return s[0].toLowerCase() + s.slice(1);
}

function clearFirstChild(id) {
	const obj = typeof id == "string" ? dbID(id) : id;
	while (obj.firstChild) {
		obj.removeChild(obj.firstChild);
	}
	return obj;
}

function clearTable(id) {
	const obj = !(id instanceof Object) ? eval(id) : id;
	for (let i = obj.rows.length - 1; i >= 0; i--) {
		obj.deleteRow(i);
	}
}

function insertTableRow(tabID) {
	return dbID(tabID).insertRow(dbID(tabID).rows.length);
}

function deepClone(data) {
	if (data === null || data === undefined) return data;
	return JSON.parse(JSON.stringify(data));
}

function arrayFromNumber(obj, num = null) {
	if (num == null && typeof obj == "number") return [...Array(obj).keys()];
	if (typeof obj == "number" && typeof num == "number") {
		let min = Math.min(obj, num);
		let max = Math.max(obj, num);
		let arr = [];
		for (let i = min; i <= max; i++) {
			arr.push(i);
		}
		return arr;
	}
}

function randomIndex(obj) {
	if (typeof obj == "string") return Math.floor(Math.random() * obj.length);
	if (Array.isArray(obj)) return Math.floor(Math.random() * obj.length);
	return Math.floor(Math.random() * Object.keys(obj).length);
}

function randomObject(obj, top = null) {
	// takes a single Number, an Array or an Object
	if (typeof obj == "number") return randomObject(arrayFromNumber(obj, top));
	if (typeof obj == "string") return obj[randomIndex(obj)];
	if (Array.isArray(obj) && obj.length <= 0) return null;
	if (Array.isArray(obj)) return obj[randomIndex(obj)];
	const objKeys = Object.keys(obj);
	return obj[objKeys[randomIndex(objKeys)]];
}

function randomObjectCentered(obj, top = null, iterations = 1) {
	let sum = 0;
	for (let i = 0; i < iterations; i++) {
		sum += randomObject(obj, top);
	}
	return Math.floor(sum / iterations);
}

function randomSubset(array, numSubset) {
	let options = shuffleData(array);
	let ret = options.slice(0, numSubset);
	return ret;
}

function sortArrayByKey(arr, key, inverse = false, caseSensitive = false) {
	let array = Array.from(arr);
	return array.sort(function (a, b) {
		if (typeof a[key] == "number" && typeof b[key] == "number") {
			return inverse ? b[key] - a[key] : a[key] - b[key];
		} else {
			const x = caseSensitive ? a[key].toLowerCase() : a[key];
			const y = caseSensitive ? b[key].toLowerCase() : b[key];
			if (inverse) {
				return x < y ? 1 : x > y ? -1 : 0;
			} else {
				return x < y ? -1 : x > y ? 1 : 0;
			}
		}
	});
}

function shuffleData(arr) {
	let shuffled = deepClone(arr);
	if (!Array.isArray(arr)) return arr;
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

function createIndexedArray(x, y = null) {
	if (y == null) {
		arrX = [];
		for (let i = 0; i < x; i++) {
			arrX.push(i);
		}
		return arrX;
	}
	arrXY = [];
	for (let i = 0; i < x; i++) {
		for (let j = 0; j < y; j++) {
			arrXY.push([i, j]);
		}
	}
	return arrXY;
}

function create2DArray(x, y, fill = null) {
	let arrX = new Array(x);
	for (let i = 0; i < arrX.length; i++) {
		arrX[i] = fill == null ? (arrX[i] = new Array(y)) : new Array(y).fill(f);
	}
	return arrX;
}

/**
 *  @param {String} object Name of CssProperty
 *  @param {Boolean} numberOnly Convert to JS-Number
 *  @param {Boolean} toPX Convert from REM to PX
 */
function getCssRoot(object, numberOnly = false, RemToPX = false) {
	//  getCssRoot("navbarHeight", return only numberOnly=true)
	const obj = `--${object}`;
	const valOrig = getComputedStyle(document.body).getPropertyValue(obj);
	const unit = valOrig.match(/[a-zA-Z]{1,}/g);
	if (RemToPX == true && unit == "rem") {
		const size = getComputedStyle(document.body).getPropertyValue("--fontSize").replace(/px/g, "");
		const valConverted = valOrig.replace(/rem/g, "");
		return Number(size * valConverted);
	}
	if (numberOnly == true) {
		const valConverted = valOrig.replace(/s|px|rem/g, "");
		return Number(valConverted);
	}
	return getComputedStyle(document.body).getPropertyValue(obj).trim();
}

function setCssRoot(object, value, dim = "") {
	document.styleSheets[0].cssRules[0].style.setProperty(`--${object}`, `${value}${dim}`);
}

function utilsGetFavicon(url) {
	const size = globalValues.mediaSizes.imgSize;
	return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=${size}&url=${url}`;
	// return `https://www.google.com/s2/favicons?domain=${url}&sz=${size}`;
}

// DESKTOP stop scrolling
function keydown(e) {
	const keys = [37, 38, 39, 40];
	if (keys.includes(e.keyCode)) {
		preventDefault(e);
		return;
	}
}

function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault) e.preventDefault();
	e.returnValue = false;
}

function disable_scroll() {
	document.onkeydown = keydown;
	document.addEventListener("touchmove", preventDefault, false);
}

function enable_scroll() {
	document.onkeydown = null;
	document.removeEventListener("touchmove", preventDefault, false);
}

function tableAddCellHeader(row, opt) {
	opt.name = cellCreateName(opt);
	let cell = document.createElement("th");
	cell.id = `id${opt.type}${opt.name}`;

	//  LOGIC
	let mainChild = null;
	switch (opt.type) {
		case "Lbl":
			mainChild = cellLbl(opt);
			break;
		case "Btn":
			mainChild = cellBtn(opt);
			break;
		case "Vin":
			mainChild = cellVin(opt);
			break;
	}
	cell.appendChild(mainChild);
	CellOptions(cell, opt);
	row.appendChild(cell);
	return cell;
}

function cellCreateName(opt) {
	return opt.hasOwnProperty("name") ? opt.name : `_${opt.names.join("_")}`;
}

function tableAddCell(row, opt = {}, prevCell = null) {
	opt.name = cellCreateName(opt);
	let cell;
	if (prevCell === null) {
		cell = row.insertCell(-1);
		cell.id = `id${opt.type}_cell${opt.name}`;
	}
	let mainChild = null;
	switch (opt.type) {
		case "Vin":
			mainChild = cellVin(opt);
			break;
		case "Btn":
			mainChild = cellBtn(opt);
			break;
		case "Lbl":
			mainChild = cellLbl(opt);
			break;
		case "Sel":
			mainChild = cellSel(opt);
			break;
		case "Colbox":
			mainChild = cellColbox(opt);
			break;
		case "Img":
			mainChild = cellImg(opt);
			break;
		case "Div":
			mainChild = cellDiv(opt);
			break;
		case "H1":
			mainChild = cellH1(opt);
			break;
	}

	// OPTIONS
	if (mainChild != null) {
		if (prevCell === null) {
			cell.appendChild(mainChild);
		} else {
			prevCell.appendChild(mainChild);
		}
	}
	CellOptions(cell || prevCell, opt);
	return cell || prevCell;
}

function cellVin(opt, name) {
	const mainChild = document.createElement("INPUT");
	switch (opt.subGroup) {
		case "checkbox":
			mainChild.type = "checkbox";
			mainChild.checked = opt.checked || false;
			break;
		default:
			mainChild.type = opt.subGroup;
			mainChild.placeholder = opt.placeholder;
	}
	UIOptions(mainChild, opt);
	return mainChild;
}

function cellBtn(opt) {
	const mainChild = document.createElement("BUTTON");
	const elImg = document.createElement("img");
	mainChild.appendChild(elImg);
	mainChild.type = "button";
	switch (opt.subGroup) {
		case "button":
			elImg.src = utilsGetImgPath(opt.img);
			break;
		case "subgrid":
			mainChild.type = "image";
			elImg.src = utilsGetImgPath(opt.img);
			elImg.setAttribute("uiFilter", "invBackground");
			break;
		case "gridtitle":
			mainChild.type = "image";
			elImg.src = utilsGetImgPath(opt.img);
			elImg.setAttribute("uiFilter", "invGridtitle");
			break;
		case "navbar":
			elImg.src = utilsGetImgPath(opt.img);
			elImg.setAttribute("uiFilter", "invNavbar");
			break;
		case "url":
		case "urlInvert":
			mainChild.type = "image";
			elImg.src = opt.img;
			break;
		default:
			mainChild.type = "text";
			mainChild.textContent = opt.text;
	}
	UIOptions(mainChild, opt);
	return mainChild;
}

function cellLbl(opt) {
	const mainChild = document.createElement("label");
	mainChild.type = "Lbl";
	mainChild.innerHTML = opt.text;
	if (opt.hasOwnProperty("for")) {
		mainChild.for = opt.for;
		opt.pointer = true;
	}
	UIOptions(mainChild, opt);
	return mainChild;
}

function cellH1(opt) {
	const mainChild = document.createElement("H1");
	mainChild.innerHTML = opt.text;
	UIOptions(mainChild, opt);
	return mainChild;
}

function cellSel(opt) {
	const mainChild = document.createElement("select");
	opt.type = "sel";
	let start = 0;
	if (opt.hasOwnProperty("optionTitle")) {
		mainChild.options[start] = new Option(opt.optionTitle);
		start = 1;
	}
	for (let n = 0; n < opt.options.length; n++) {
		mainChild.options[n + start] = new Option(opt.options[n]);
	}
	UIOptions(mainChild, opt);
	return mainChild;
}

function cellColbox(opt) {
	const mainChild = document.createElement("div");
	opt.type = "Colbox";
	mainChild.classList.add("coloredBox");
	mainChild.style.background = utilsColor.formatAsCSS(opt.color, "HSL");
	UIOptions(mainChild, opt);
	return mainChild;
}

function cellImg(opt) {
	const mainChild = document.createElement("IMG");
	opt.type = "Img";
	switch (opt.subGroup) {
		case "button":
			mainChild.src = utilsGetImgPath(opt.img);
			break;
		case "subgrid":
			mainChild.src = utilsGetImgPath(opt.img);
			mainChild.setAttribute("uiFilter", "invBackground");
			break;
		case "gridtitle":
			mainChild.src = utilsGetImgPath(opt.img);
			mainChild.setAttribute("uiFilter", "invGridtitle");
			break;
		case "navbar":
			mainChild.src = utilsGetImgPath(opt.img);
			mainChild.setAttribute("uiFilter", "invNavbar");
			break;
		case "url":
		case "urlInvert":
			mainChild.src = opt.img;
			break;
	}
	UIOptions(mainChild, opt);
	return mainChild;
}

function cellDiv(opt) {
	const mainChild = document.createElement("div");
	UIOptions(mainChild, opt);
	return mainChild;
}

function CellOptions(cell, opt) {
	if (opt.hasOwnProperty("cellStyle")) {
		for (const [key, value] of Object.entries(opt.cellStyle)) {
			cell.style[key] = value;
		}
	}
	if (opt.hasOwnProperty("createCellClass")) {
		for (const cl of opt.createCellClass) {
			if (cl != "" && cl != null) {
				cell.classList.add(cl);
			}
		}
	}
	if (opt.hasOwnProperty("cellOnclick")) {
		cell.addEventListener("click", opt.cellOnclick, false);
	}
	cell.colSpan = opt.colSpan || 1;
	cell.rowSpan = opt.rowSpan || 1;
}

function UIOptions(cell, opt) {
	opt.name = cellCreateName(opt);
	cell.id = `id${opt.type}_child${opt.name}`;
	if (opt.hasOwnProperty("idNoChild")) {
		cell.id = `id${opt.type}${opt.name}`;
	}
	if (opt.hasOwnProperty("datasets")) {
		for (const [key, value] of Object.entries(opt.datasets)) {
			cell.setAttribute(`data-${key}`, value);
		}
	}
	if (opt.hasOwnProperty("createClass")) {
		for (const cl of opt.createClass) {
			if (cl != "" && cl != null) {
				cell.classList.add(cl);
			}
		}
	}
	if (opt.hasOwnProperty("ui")) {
		for (const [key, value] of Object.entries(opt.ui)) {
			cell.setAttribute(key, value);
		}
	}
	if (opt.pointer || opt.copy) {
		cell.style.cursor = "copy";
	}
	if (opt.alias) {
		cell.style.cursor = "alias";
	}
	if (opt.copy) {
		cell.addEventListener(
			"click",
			() => {
				utilsCopyToClipboard(cell.textContent);
			},
			false
		);
	}
	if (opt.hasOwnProperty("for")) {
		cell.setAttribute("for", opt.for);
	}
	if (opt.hasOwnProperty("style")) {
		for (const [key, value] of Object.entries(opt.style)) {
			cell.style[key] = value;
			if (opt.styleChild) {
				cell.childNodes[0].style[key] = value;
			}
		}
	}
	if (opt.hasOwnProperty("onclick")) {
		cell.addEventListener("click", opt.onclick, false);
		cell.style.cursor = "pointer";
	}
	if (opt.hasOwnProperty("ondoubleclick")) {
		cell.addEventListener("dblclick", opt.ondoubleclick, false);
		cell.style.cursor = "pointer";
	}
	if (opt.hasOwnProperty("oninput")) {
		cell.addEventListener("input", opt.oninput, false);
	}
	if (opt.onmouseover) {
		cell.onmouseover = opt.onmouseover;
		cell.addEventListener("mouseover", opt.onmouseover);
	}
	if (opt.onmouseleave) {
		cell.onmouseleave = opt.onmouseleave;
		cell.addEventListener("mouseleave", opt.onmouseleave);
	}
}
