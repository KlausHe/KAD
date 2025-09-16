import { Data_Leetspeak } from "../KadData/KadData.js";
import { dbCL, dbID, initEL, KadRandom, KadString } from "../KadUtils/KadUtils.js";
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
        return window.btoa(thiontuData.input);
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
    // base64ToString: {
    //   btnName: "Base64 to String",
    //   get enable() {
    //     return true;
    //   },
    //   get func() {
    //     return window.atob(thiontuData.input);
    //   },
    // },
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
          const index = Data_Leetspeak.findIndex((item) => item[0] == L);
          if (index < 0) {
            retText += letter;
          } else {
            retText += Data_Leetspeak[index][1][0];
          }
        }
        return retText;
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
          const index = Data_Leetspeak.findIndex((item) => item[0] == L);
          if (index < 0) {
            retText += letter;
          } else {
            retText += KadRandom.randomObject(Data_Leetspeak[index][1]);
          }
        }
        return retText;
      },
    },
  },
};

const Area_thiontuInputEntry = initEL({ id: "idArea_thiontuInputEntry", fn: thiontuUpdate, resetValue: "Type text to convert" });
const Area_thiontuOutputArea = initEL({ id: "idArea_thiontuOutputArea", resetValue: "~~~~~~~~~~~" });
let Btn_ThiontuToTexts = [];
export function clear_cl_Thiontu() {
  Area_thiontuInputEntry.KadReset();
  Area_thiontuOutputArea.KadReset();
  const clBtn = dbCL("clBtn_ThiontuOptions", null);
  Btn_ThiontuToTexts = [];
  for (let i = 0; i < clBtn.length; i++) {
    const btn = dbID(clBtn[i]);
    btn.id = `idBtn_thiontuToText_${Object.keys(thiontuData.opts)[i]}`;
    Btn_ThiontuToTexts.push(initEL({ id: btn.id, fn: () => thiontuOptionChange(i), resetValue: Object.values(thiontuData.opts)[i].btnName, dataset: ["radio", "thiontuOption"] }));
    btn.value = Object.keys(thiontuData.opts)[i];
  }

  Btn_ThiontuToTexts[0].KadButtonColor("positive");
  thiontuData.selected = Object.keys(thiontuData.opts)[0];
}

function thiontuOptionChange(index) {
  Btn_ThiontuToTexts[index].KadRadioColor();
  thiontuData.selected = Btn_ThiontuToTexts[index].KadGet();
  thiontuUpdate();
}

function thiontuUpdate() {
  thiontuData.inputRaw = Area_thiontuInputEntry.KadGet();
  thiontuData.input = Area_thiontuInputEntry.KadGet();

  //check text and disable buttons if input is not valid for them
  for (let i = 0; i < Btn_ThiontuToTexts.length; i++) {
    Btn_ThiontuToTexts[i].KadEnable(thiontuData.opts[Btn_ThiontuToTexts[i].KadGet()].enable);
    Btn_ThiontuToTexts[i].KadEnable(thiontuData.opts[Btn_ThiontuToTexts[i].KadGet()].enable);
  }
  //if selected is disabled, jump to ALL CAPS
  if (!thiontuData.opts[thiontuData.selected].enable) {
    Btn_ThiontuToTexts[0].KadRadioColor();
    thiontuData.selected = Btn_ThiontuToTexts[0].KadGet();
  }
  Area_thiontuOutputArea.HTML.value = thiontuData.input == "" || thiontuData.input == 0 ? "" : thiontuData.opts[thiontuData.selected].func;
}
