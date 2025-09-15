import { initEL, KadDate } from "../KadUtils/KadUtils.js";

const eggOptions = {
  timerEggCount: null,
  timeTotal: 0,
  timeRemaining: 0,
  timerState: false,
  startCallbacks: [
    ["Start", eggStart],
    ["Stop", eggStop],
  ],
  mass: {
    val: 0,
    valOrig: 60,
    min: 40,
    max: 85,
    get label() {
      for (const [key, val] of Object.entries(this.states)) {
        if (this.val >= val) return `${this.val}g (${key})`;
      }
    },
    states: {
      XL: 73,
      L: 63,
      M: 53,
      S: 40,
    },
  },
  temp: {
    val: 0,
    valOrig: 10,
    min: 4,
    max: 22,
    get label() {
      for (const [key, val] of Object.entries(this.states)) {
        if (this.val >= val) return `${this.val}°C (${key})`;
      }
    },
    states: {
      Wohnung: 16,
      Keller: 9,
      Kühlschrank: 4,
    },
  },
  yolk: {
    val: 0,
    valOrig: 65,
    min: 45,
    max: 90,
    get label() {
      for (const [key, val] of Object.entries(this.states)) {
        if (this.val >= val) return `${this.val}°C (${key})`;
      }
    },
    states: {
      fest: 80,
      "fast fest": 75,
      wachs: 65,
      "leicht wachs": 55,
      weich: 45,
    },
  },
};

const Vin_EggMass = initEL({ id: "idVin_EggMass", fn: eggMassChange, resetValue: eggOptions.mass.valOrig, domOpts: { min: eggOptions.mass.min, max: eggOptions.mass.max } });
const Vin_EggTemp = initEL({ id: "idVin_EggTemp", fn: eggTempChange, resetValue: eggOptions.temp.valOrig, domOpts: { min: eggOptions.temp.min, max: eggOptions.temp.max } });
const Vin_EggYolk = initEL({ id: "idVin_EggYolk", fn: eggYolkChange, resetValue: eggOptions.yolk.valOrig, domOpts: { min: eggOptions.yolk.min, max: eggOptions.yolk.max } });
const Btn_EggStart = initEL({ id: "idBtn_EggStart", fn: eggStartChange, btnCallbacks: eggOptions.startCallbacks });
const Lbl_EggTime = initEL({ id: "idLbl_EggTime", resetValue: "Eieruhr" });
const Lbl_EggMass = initEL({ id: "idLbl_EggMass" });
const Lbl_EggTemp = initEL({ id: "idLbl_EggTemp" });
const Lbl_EggYolk = initEL({ id: "idLbl_EggYolk" });
const Prog_eggProgress = initEL({ id: "idProg_eggProgress", domOpts: { max: 100 } });

export function clear_cl_Egg() {
  eggOptions.mass.val = Vin_EggMass.KadReset();
  eggOptions.temp.val = Vin_EggTemp.KadReset();
  eggOptions.yolk.val = Vin_EggYolk.KadReset();
  eggOptions.timerState = Btn_EggStart.KadReset();
  Lbl_EggTime.KadReset();

  Lbl_EggMass.KadSetText(eggOptions.mass.label);
  Lbl_EggTemp.KadSetText(eggOptions.temp.label);
  Lbl_EggYolk.KadSetText(eggOptions.yolk.label);
}

function eggMassChange(obj) {
  eggOptions.mass.val = obj.target.KadGet();
  Lbl_EggMass.KadSetText(eggOptions.mass.label);
  eggCalculate();
}

function eggTempChange(obj) {
  eggOptions.temp.val = obj.target.KadGet();
  Lbl_EggTemp.KadSetText(eggOptions.temp.label);
  eggCalculate();
}

function eggYolkChange(obj) {
  eggOptions.yolk.val = obj.target.KadGet();
  Lbl_EggYolk.KadSetText(eggOptions.yolk.label);
  eggCalculate();
}

function eggCalculate() {
  let tempFactor = 0.76 * ((eggOptions.temp.val - 100) / (eggOptions.yolk.val - 100));
  tempFactor = Math.log(tempFactor);
  let massFactor = 27.05089242 * Math.pow(eggOptions.mass.val, 2 / 3);
  eggOptions.timeTotal = massFactor * tempFactor;
  eggOptions.timeRemaining = eggOptions.timeTotal;
  eggShowTime();
}

function eggShowTime() {
  let obj = KadDate.secondsToObj(eggOptions.timeRemaining);
  Lbl_EggTime.KadSetText(`${obj.h}:${obj.m}:${obj.s}`);
}

function eggStartChange() {
  eggOptions.timerState = !eggOptions.timerState;
  Vin_EggMass.KadEnable(!eggOptions.timerState);
  Vin_EggTemp.KadEnable(!eggOptions.timerState);
  Vin_EggYolk.KadEnable(!eggOptions.timerState);
}

function eggStart() {
  eggCalculate();
  Prog_eggProgress.KadSetMax(eggOptions.timeTotal);
  eggCountdown();
  eggOptions.timerEggCount = setInterval(eggCountdown, 1000);
}

function eggStop() {
  clearInterval(eggOptions.timerEggCount);
  Lbl_EggTime.KadReset();
}

function eggCountdown() {
  eggOptions.timeRemaining--;
  Prog_eggProgress.KadSetValue(eggOptions.timeRemaining);
  if (eggOptions.timeRemaining > 0) {
    eggShowTime();
  } else {
    Lbl_EggTime.KadSetText("Fertig!");
    clearInterval(eggOptions.timerEggCount);
  }
}
