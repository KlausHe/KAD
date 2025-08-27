import { dbID, initEL, KadDate } from "../KadUtils/KadUtils.js";

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

initEL({ id: idVin_EggMass, fn: eggMassChange, resetValue: eggOptions.mass.valOrig, domOpts: { min: eggOptions.mass.min, max: eggOptions.mass.max } });
initEL({ id: idVin_EggTemp, fn: eggTempChange, resetValue: eggOptions.temp.valOrig, domOpts: { min: eggOptions.temp.min, max: eggOptions.temp.max } });
initEL({ id: idVin_EggYolk, fn: eggYolkChange, resetValue: eggOptions.yolk.valOrig, domOpts: { min: eggOptions.yolk.min, max: eggOptions.yolk.max } });
initEL({ id: idBtn_EggStart, fn: eggStartChange, btnCallbacks: eggOptions.startCallbacks });
initEL({ id: idLbl_EggTime, resetValue: "Eieruhr" });

export function clear_cl_Egg() {
  eggOptions.mass.val = idVin_EggMass.KadReset();
  eggOptions.temp.val = idVin_EggTemp.KadReset();
  eggOptions.yolk.val = idVin_EggYolk.KadReset();
  eggOptions.timerState = idBtn_EggStart.KadReset();
  idLbl_EggTime.KadReset();

  dbID("idLbl_EggMass").textContent = eggOptions.mass.label;
  dbID("idLbl_EggTemp").textContent = eggOptions.temp.label;
  dbID("idLbl_EggYolk").textContent = eggOptions.yolk.label;
  eggStartChange();
}

function eggMassChange(obj) {
  eggOptions.mass.val = obj.target.KadGet();
  dbID("idLbl_EggMass").textContent = eggOptions.mass.label;
  eggCalculate();
}

function eggTempChange(obj) {
  eggOptions.temp.val = obj.target.KadGet();
  dbID("idLbl_EggTemp").textContent = eggOptions.temp.label;
  eggCalculate();
}

function eggYolkChange(obj) {
  eggOptions.yolk.val = obj.target.KadGet();
  dbID("idLbl_EggYolk").textContent = eggOptions.yolk.label;
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
  idLbl_EggTime.KadSetText(`${obj.h}:${obj.m}:${obj.s}`);
}

function eggStartChange() {
  eggOptions.timerState = !eggOptions.timerState;
  idVin_EggMass.KadEnable(!eggOptions.timerState);
  idVin_EggTemp.KadEnable(!eggOptions.timerState);
  idVin_EggYolk.KadEnable(!eggOptions.timerState);

  idBtn_EggStart.KadNext();
}
function eggStart() {
  eggCalculate();
  dbID("idProg_eggProgress").setAttribute("max", eggOptions.timeTotal);
  eggCountdown();
  eggOptions.timerEggCount = setInterval(eggCountdown, 1000);
}

function eggStop() {
  clearInterval(eggOptions.timerEggCount);
  idLbl_EggTime.KadReset();
}

function eggCountdown() {
  eggOptions.timeRemaining--;
  dbID("idProg_eggProgress").setAttribute("value", eggOptions.timeRemaining);
  if (eggOptions.timeRemaining > 0) {
    eggShowTime();
  } else {
    idLbl_EggTime.KadSetText("Fertig!");
    clearInterval(eggOptions.timerEggCount);
  }
}
