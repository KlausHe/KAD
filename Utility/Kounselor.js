import { Data_RALColors } from "../General/MainData.js";
import { dbID, dbIDStyle, initEL, KadColor, KadString } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";

const kounselorOptions = {
  value: null,
  type: "",
  typeOrig: "HSL",
  types: ["RAL", "Name", "HEX", "RGB", "HSL", "HSB", "CMYK"],
  RALObj: null,
};

initEL({ id: idVin_kounselorName, fn: kounselorInput, resetValue: "Name", dataset: ["type", "Name"], dbList: Data_RALColors.map((d) => d.Name) });
initEL({ id: idVin_kounselorRAL, fn: kounselorInput, resetValue: "RAL", dataset: ["type", "RAL"], dbList: Data_RALColors.map((d) => d.RAL) });
initEL({ id: idVin_kounselorHEX, fn: kounselorInput, resetValue: "HEX", dataset: ["type", "HEX"], dbList: Data_RALColors.map((d) => d.HEX) });
initEL({ id: idVin_kounselorRGB, fn: kounselorInput, resetValue: "RGB", dataset: ["type", "RGB"], dbList: Data_RALColors.map((d) => d.RGB) });
initEL({ id: idVin_kounselorHSL, fn: kounselorInput, resetValue: "HSL", dataset: ["type", "HSL"], dbList: Data_RALColors.map((d) => d.HSL) });
initEL({ id: idVin_kounselorHSB, fn: kounselorInput, resetValue: "HSB", dataset: ["type", "HSB"], dbList: Data_RALColors.map((d) => d.HSB) });
initEL({ id: idVin_kounselorCMYK, fn: kounselorInput, resetValue: "CMYK", dataset: ["type", "CMYK"], dbList: Data_RALColors.map((d) => d.CMYK) });

export function clear_cl_Kounselor() {
  for (const name of kounselorOptions.types) {
    dbID(`idVin_kounselor${name}`).KadReset();
  }
  kounselorOptions.type = kounselorOptions.typeOrig;
  kounselorOptions.value = globalColors.elements.baseColor;
  kounselorGenerateColorobject();
  kounselorShowResults();
}

export function canvas_cl_Kounselor() {
  clear_cl_Kounselor();
}

function kounselorInput(obj) {
  const input = obj.target.KadGet();
  if (input === "") return;
  kounselorOptions.type = obj.target.dataset.type;
  let data = null;
  switch (kounselorOptions.type) {
    case "Name":
      kounselorOptions.value = idVin_kounselorName.KadGet();
      kounselorOptions.value = KadString.firstLetterCap(kounselorOptions.value);
      break;
    case "RAL":
      kounselorOptions.value = idVin_kounselorRAL.KadGet();
      break;
    case "HEX":
      kounselorOptions.value = idVin_kounselorHEX.KadGet();
      kounselorOptions.value = kounselorOptions.value.charAt(0) === "#" ? kounselorOptions.value : `#${kounselorOptions.value}`;
      break;
    case "RGB":
      kounselorOptions.value = idVin_kounselorRGB.KadGet();
      data = kounselorOptions.value.replace(/\s/g, "");
      data = data.split(/,|-|\s/g);
      kounselorOptions.value = data.map((n) => Number(n));
      break;
    case "HSL":
      kounselorOptions.value = idVin_kounselorHSL.KadGet();
      data = kounselorOptions.value.replace(/%/g, "");
      data = data.split(/,|-|\s/g);
      kounselorOptions.value = data.map((n) => Number(n));
      break;
    case "HSB":
      kounselorOptions.value = idVin_kounselorHSB.KadGet();
      data = kounselorOptions.value.replace(/%/g, "");
      data = data.split(/,|-|\s/g);
      kounselorOptions.value = data.map((n) => Number(n));
      break;
    case "CMYK":
      kounselorOptions.value = idVin_kounselorCMYK.KadGet();
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
  for (const type of kounselorOptions.types) {
    if (type == kounselorOptions.type) continue;
    const text = type == "Name" || type == "RAL" ? kounselorOptions.RALObj[type] : KadColor.formatAsString({ colorArray: kounselorOptions.RALObj[type], type });
    dbID(`idVin_kounselor${type}`).KadReset({ resetValue: text });
  }
  const colorCSS = KadColor.formatAsCSS({ colorArray: kounselorOptions.RALObj.HSL, type: "HSL" });
  dbIDStyle("idLbl_kounselorOutputA").background = colorCSS;
  dbIDStyle("idLbl_kounselorOutputB").background = colorCSS;
  dbIDStyle("idLbl_kounselorOutputA").color = KadColor.stateAsCSS({ colorArray: kounselorOptions.RALObj.HSL, type: "HSL" });
  dbIDStyle("idLbl_kounselorOutputB").color = KadColor.stateAsCSS({ colorArray: kounselorOptions.RALObj.HSL, type: "HSL", invert: true });
}
