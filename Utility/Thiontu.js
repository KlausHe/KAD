import { Data_Leetspeak } from "../General/MainData.js";
import { initEL, dbID, dbCL, KadDOM, KadString, KadRandom } from "../General/KadUtils.js";
const thiontuData = {
	input: "",
	inputRaw: "",
	selected: null,
	opts: {
		stringToUppercase: {
			btnName: "All to Uppercase",
			get enable() {
				return true;
			},
			get func() {
				return thiontuData.input.toUpperCase();
			},
		},
		stringToLowercase: {
			btnName: "All to Lowercase",
			get enable() {
				return true;
			},
			get func() {
				return thiontuData.input.toLowerCase();
			},
		},
		stringToFirstUppercase: {
			btnName: "First to Uppercase",
			get enable() {
				return true;
			},
			get func() {
				const input = thiontuData.input.toLowerCase();
				return input.replace(/\b\w+/g, function (l) {
					return KadString.firstLetterCap(l);
				});
			},
		},
		stringToByte: {
			btnName: "String to Byte",
			get enable() {
				return true;
			},
			get func() {
				let str = thiontuData.input;
				let arr = [];
				for (let i = 1; i <= str.length; i++) {
					let d = str.charCodeAt(str.length - i);
					for (let j = 0; j < 8; j++) {
						arr.push(d % 2);
						d = Math.floor(d / 2);
					}
					arr.push(" ");
				}
				return arr.reverse().join("").trim();
			},
		},
		stringToASCII: {
			btnName: "String to ASCII",
			get enable() {
				return true;
			},
			get func() {
				const str = thiontuData.inputRaw.split("");
				const arr = str.map((s) => s.charCodeAt());
				return arr.join("-");
			},
		},
		stringToBase64: {
			btnName: "String to Base64",
			get enable() {
				return true;
			},
			get func() {
				return window.btoa(unescape(encodeURIComponent(thiontuData.input)));
			},
		},

		byteToString: {
			btnName: "Byte to String",
			get enable() {
				return /^[0-1\s]{1,}$/.test(thiontuData.input);
			},
			get func() {
				let str = thiontuData.input;
				return str.replace(/\s*[01]{8}\s*/g, function (str) {
					return String.fromCharCode(parseInt(str, 2));
				});
			},
		},
		asciiToString: {
			btnName: "ASCII to String",
			get enable() {
				return /^[\x00-\xFF]*$/.test(thiontuData.inputRaw);
			},
			get func() {
				const regexSplit = new RegExp(/[_\-\:\.\s\\\/\,]+/);
				const codeArr = thiontuData.inputRaw.split(regexSplit);
				const arr = codeArr.map((c) => String.fromCharCode(c));
				return arr.join("");
			},
		},
		base64ToString: {
			btnName: "Base64 to String",
			get enable() {
				return true;
			},
			get func() {
				return window.atob(thiontuData.input);
				// return decodeURIComponent(escape(window.atob(thiontuData.input)));
			},
		},
		binaryToDecimal: {
			btnName: "Binary to Decimal",
			get enable() {
				return /^[0-1\s]{1,}$/.test(thiontuData.input); // the ""\s" includes the "space"
			},
			get func() {
				const regexSplit = new RegExp(/[\s,.]+/);
				let arr = thiontuData.input.split(regexSplit);
				arr = arr.map((txt) => parseInt(txt, 2));
				return arr.join(" ");
			},
		},
		hexToDecimal: {
			btnName: "Hex to Decimal",
			get enable() {
				return /^[0-9a-fA-F\s#]+$/.test(thiontuData.input);
			},
			get func() {
				const regexSplit = new RegExp(/[_\-\:\.\s\\\/\,#]+/);
				const codeArr = thiontuData.input.split(regexSplit);
				const arr = codeArr.map((c) => parseInt(`0x${c}`));
				return arr.join(" ");
			},
		},
		textToLeetSimple: {
			btnName: "Leetspeak (1337)",
			get enable() {
				return true;
			},
			get func() {
				let retText = "";
				let arr = thiontuData.input.trim();
				for (let letter of arr) {
					const L = letter.toUpperCase();
					if (!Data_Leetspeak.has(L)) {
						retText += letter;
						continue;
					}
					retText += Data_Leetspeak.get(L)[0];
				}
				return retText;
			},
		},
		decimalToBinary: {
			btnName: "Decimal to Binary",
			get enable() {
				return thiontuData.input === "" || /^[0-9\s]{1,}$/.test(thiontuData.input); // the ""\s" includes the "space"
			},
			get func() {
				const regexSplit = new RegExp(/[\s,.]+/);
				let arr = thiontuData.input.split(regexSplit);
				arr = arr.map((txt) => Number(txt).toString(2));
				return arr.join(" ");
			},
		},
		decimalToHex: {
			btnName: "Decimal to Hex",
			get enable() {
				return /^[0-9\s,]{1,}$/.test(thiontuData.input); // the ""\s" includes the "space"
			},
			get func() {
				const regexSplit = new RegExp(/[\s,.]+/);
				let arr = thiontuData.input.split(regexSplit);
				arr = arr.map((txt) => Number(txt).toString(16));
				return arr.join(" ");
			},
		},
		textToLeetAdvanced: {
			btnName: "Leetspeak (31337)",
			get enable() {
				return true;
			},
			get func() {
				let retText = "";
				let arr = thiontuData.input.trim();
				for (let letter of arr) {
					const L = letter.toUpperCase();
					if (!Data_Leetspeak.has(L)) {
						retText += letter;
						continue;
					}
					retText += KadRandom.randomObject(Data_Leetspeak.get(L));
				}
				return retText;
			},
		},
	},
};

initEL({ id: idArea_thiontuInputEntry, fn: thiontuUpdate, resetValue: "Type text to convert" });

export function clear_cl_Thiontu() {
	idArea_thiontuInputEntry.KadReset();
	KadDOM.resetInput("idArea_thiontuOutputArea", "~~~~~~~~~~~");
	const clBtn = dbCL("clBtn_ThiontuOptions", null);
	for (let i = 0; i < clBtn.length; i++) {
		KadDOM.enableBtn(clBtn[i], true);
		clBtn[i].id = `idBtn_thiontuToText_${Object.keys(thiontuData.opts)[i]}`;
		clBtn[i].textContent = Object.values(thiontuData.opts)[i].btnName;
		clBtn[i].value = Object.keys(thiontuData.opts)[i];
		clBtn[i].addEventListener("click", thiontuOptionChange, false);
		if (i === 0) {
			KadDOM.btnColor(clBtn[0], "positive");
			thiontuData.selected = Object.keys(thiontuData.opts)[i];
		} else {
			KadDOM.btnColor(clBtn[i]);
		}
	}
}

function thiontuOptionChange(btn) {
	const obj = btn.target;
	const clBtn = dbCL("clBtn_ThiontuOptions", null);
	for (let i = 0; i < clBtn.length; i++) {
		if (!clBtn[i].disabled) {
			KadDOM.btnColor(clBtn[i]);
		}
	}
	KadDOM.btnColor(obj, "positive");
	thiontuData.selected = obj.value;
	thiontuUpdate();
}

function thiontuUpdate() {
	thiontuData.inputRaw = dbID("idArea_thiontuInputEntry").value;
	thiontuData.input = dbID("idArea_thiontuInputEntry").value.trim();

	//check text and disable buttons if input is not valid for them
	const clBtn = dbCL("clBtn_ThiontuOptions", null);
	for (let i = 0; i < clBtn.length; i++) {
		KadDOM.enableBtn(clBtn[i], thiontuData.opts[clBtn[i].value].enable);
		if (thiontuData.opts[clBtn[i].value].enable) {
			KadDOM.enableBtn(clBtn[i], true);
		} else {
			KadDOM.enableBtn(clBtn[i], false);
			clBtn[i].style.backgroundColor = "";
		}
	}

	//if selected is disabled, jump to ALL CAPS
	if (!thiontuData.opts[thiontuData.selected].enable) {
		KadDOM.btnColor(clBtn[0], "positive");
		thiontuData.selected = clBtn[0].value;
	}

	let obj = dbID("idArea_thiontuOutputArea");
	obj.value = thiontuData.input == "" || thiontuData.input == 0 ? "" : thiontuData.opts[thiontuData.selected].func;
}
