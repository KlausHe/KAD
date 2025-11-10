import { Data_RALColors } from "../KadData/KadData_Color.js";
import { dbIDStyle, initEL, KadColor, KadString } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";

const kounselorOptions = {
  value: null,
  type: "",
  typeOrig: "HSL",
  types: ["RAL", "Name", "HEX", "RGB", "HSL", "HSB", "CMYK"],
  RALObj: null,
};

const Vin_kounselorName = initEL({ id: "idVin_kounselorName", fn: [kounselorInput, "Name"], resetValue: "Name", dbList: Data_RALColors.map((d) => d.Name) });
const Vin_kounselorRAL = initEL({ id: "idVin_kounselorRAL", fn: [kounselorInput, "RAL"], resetValue: "RAL", dbList: Data_RALColors.map((d) => d.RAL) });
const Vin_kounselorHEX = initEL({ id: "idVin_kounselorHEX", fn: [kounselorInput, "HEX"], resetValue: "HEX", dbList: Data_RALColors.map((d) => d.HEX) });
const Vin_kounselorRGB = initEL({ id: "idVin_kounselorRGB", fn: [kounselorInput, "RGB"], resetValue: "RGB", dbList: Data_RALColors.map((d) => d.RGB) });
const Vin_kounselorHSL = initEL({ id: "idVin_kounselorHSL", fn: [kounselorInput, "HSL"], resetValue: "HSL", dbList: Data_RALColors.map((d) => d.HSL) });
const Vin_kounselorHSB = initEL({ id: "idVin_kounselorHSB", fn: [kounselorInput, "HSB"], resetValue: "HSB", dbList: Data_RALColors.map((d) => d.HSB) });
const Vin_kounselorCMYK = initEL({ id: "idVin_kounselorCMYK", fn: [kounselorInput, "CMYK"], resetValue: "CMYK", dbList: Data_RALColors.map((d) => d.CMYK) });
const Vin_kounselors = [Vin_kounselorName, Vin_kounselorRAL, Vin_kounselorHEX, Vin_kounselorRGB, Vin_kounselorHSL, Vin_kounselorHSB, Vin_kounselorCMYK];

export function clear_cl_Kounselor() {
  for (let Vin_kon of Vin_kounselors) {
    Vin_kon.KadReset();
  }
  kounselorOptions.type = kounselorOptions.typeOrig;
  kounselorOptions.value = globalColors.elements.baseColor;
  kounselorGenerateColorobject();
  kounselorShowResults();
}

export function canvas_cl_Kounselor() {
  clear_cl_Kounselor();
}

function kounselorInput(element) {
  const input = element.Element.KadGet();
  if (input === "") return;
  kounselorOptions.type = element.data[0];

  let data = null;
  switch (kounselorOptions.type) {
    case "Name":
      kounselorOptions.value = Vin_kounselorName.KadGet();
      kounselorOptions.value = KadString.firstLetterCap(kounselorOptions.value);
      break;
    case "RAL":
      kounselorOptions.value = Vin_kounselorRAL.KadGet();
      break;
    case "HEX":
      kounselorOptions.value = Vin_kounselorHEX.KadGet();
      kounselorOptions.value = kounselorOptions.value.charAt(0) === "#" ? kounselorOptions.value : `#${kounselorOptions.value}`;
      break;
    case "RGB":
      kounselorOptions.value = Vin_kounselorRGB.KadGet();
      data = kounselorOptions.value.replace(/\s/g, "");
      data = data.split(/,|-|\s/g);
      kounselorOptions.value = data.map((n) => Number(n));
      break;
    case "HSL":
      kounselorOptions.value = Vin_kounselorHSL.KadGet();
      data = kounselorOptions.value.replace(/%/g, "");
      data = data.split(/,|-|\s/g);
      kounselorOptions.value = data.map((n) => Number(n));
      break;
    case "HSB":
      kounselorOptions.value = Vin_kounselorHSB.KadGet();
      data = kounselorOptions.value.replace(/%/g, "");
      data = data.split(/,|-|\s/g);
      kounselorOptions.value = data.map((n) => Number(n));
      break;
    case "CMYK":
      kounselorOptions.value = Vin_kounselorCMYK.KadGet();
      data = kounselorOptions.value.replace(/%/g, "");
      data = data.split(/,|-|\s/g);
      kounselorOptions.value = data.map((n) => Number(n));
      break;
  }

  kounselorGenerateColorobject();
  kounselorShowResults();
}

function kounselorFindRAL() {
  kounselorOptions.RALObj = Data_RALColors.find((item) => item[kounselorOptions.type] == kounselorOptions.value);
  return kounselorOptions.RALObj != undefined;
}

function kounselorGenerateColorobject() {
  const ralFound = kounselorFindRAL();

  if (!ralFound) {
    if (kounselorOptions.type == "Name" || kounselorOptions.type == "RAL") {
      return;
    }
    const RGB = kounselorOptions.type == "RGB" ? kounselorOptions.value : KadColor.colAsArray({ colorArray: kounselorOptions.value, from: kounselorOptions.type });
    if (!KadColor.validateColor({ colorArray: RGB, type: "RGB" })) return;
    kounselorOptions.RALObj = {
      Name: "---",
      RAL: "---",
      RGB,
      HEX: kounselorOptions.type == "HEX" ? kounselorOptions.value : KadColor.colAsArray({ colorArray: RGB, from: "RGB", to: "HEX" }),
      HSL: kounselorOptions.type == "HSL" ? kounselorOptions.value : KadColor.colAsArray({ colorArray: RGB, from: "RGB", to: "HSL" }),
      HSB: kounselorOptions.type == "HSB" ? kounselorOptions.value : KadColor.colAsArray({ colorArray: RGB, from: "RGB", to: "HSB" }),
      CMYK: kounselorOptions.type == "CMYK" ? kounselorOptions.value : KadColor.colAsArray({ colorArray: RGB, from: "RGB", to: "CMYK" }),
    };
  }
}

function kounselorShowResults() {
  for (let i = 0; i < kounselorOptions.types.length; i++) {
    const type = kounselorOptions.types[i];

    if (type == kounselorOptions.type) continue;
    const text = type == "Name" || type == "RAL" ? kounselorOptions.RALObj[type] : KadColor.formatAsString({ colorArray: kounselorOptions.RALObj[type], type });
    Vin_kounselors[i].KadReset({ resetValue: text });
  }
  const colorCSS = KadColor.formatAsCSS({ colorArray: kounselorOptions.RALObj.HSL, type: "HSL" });
  dbIDStyle("idLbl_kounselorOutputA").background = colorCSS;
  dbIDStyle("idLbl_kounselorOutputB").background = colorCSS;
  dbIDStyle("idLbl_kounselorOutputA").color = KadColor.stateAsCSS({ colorArray: kounselorOptions.RALObj.HSL, type: "HSL" });
  dbIDStyle("idLbl_kounselorOutputB").color = KadColor.stateAsCSS({ colorArray: kounselorOptions.RALObj.HSL, type: "HSL", invert: true });
}
