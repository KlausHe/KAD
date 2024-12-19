import { speechSpeakOutput } from "../Benkyou/Speech.js";
import { dbID, initEL, KadDate } from "../KadUtils/KadUtils.js";

const eggOptions = {
  timerEggCount: null,
  timeTotal: 0,
  timeRemaining: 0,
  timerState: false,
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
initEL({ id: idBtn_EggStart, fn: eggStartChange });

export function clear_cl_Egg() {
  eggOptions.mass.val = idVin_EggMass.KadReset();
  eggOptions.temp.val = idVin_EggTemp.KadReset();
  eggOptions.yolk.val = idVin_EggYolk.KadReset();

  dbID("idLbl_EggMass").textContent = eggOptions.mass.label;
  dbID("idLbl_EggTemp").textContent = eggOptions.temp.label;
  dbID("idLbl_EggYolk").textContent = eggOptions.yolk.label;
  eggOptions.timerState = true;
  eggStartChange();
}

function eggMassChange(obj) {
  eggOptions.mass.val = obj.target.KadGet();
  dbID("idLbl_EggMass").textContent = eggOptions.mass.label;
  eggRefrechInput();
}

function eggTempChange(obj) {
  eggOptions.temp.val = obj.target.KadGet();
  dbID("idLbl_EggTemp").textContent = eggOptions.temp.label;
  eggRefrechInput();
}

function eggYolkChange(obj) {
  eggOptions.yolk.val = obj.target.KadGet();
  dbID("idLbl_EggYolk").textContent = eggOptions.yolk.label;
  eggRefrechInput();
}

function eggRefrechInput() {
  eggOptions.timerState = false;
  clearInterval(eggOptions.timerEggCount);
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
  dbID("idLbl_EggTime").textContent = `${obj.h}:${obj.m}:${obj.s}`;
}

function eggStartChange() {
  eggOptions.timerState = !eggOptions.timerState;
  if (eggOptions.timerState) {
    idBtn_EggStart.textContent = "Stop";
    eggCalculate();
    dbID("idProg_eggProgress").setAttribute("max", eggOptions.timeTotal);
    eggCountdown();
    eggOptions.timerEggCount = setInterval(eggCountdown, 1000);
  } else {
    idBtn_EggStart.textContent = "Start";
    clearInterval(eggOptions.timerEggCount);
    let textStart = "Eieruhr";
    dbID("idLbl_EggTime").textContent = textStart;
  }
}

function eggCountdown() {
  eggOptions.timeRemaining--;
  dbID("idProg_eggProgress").setAttribute("value", eggOptions.timeRemaining);
  if (eggOptions.timeRemaining <= 0) {
    dbID("idLbl_EggTime").textContent = "Fertig!";
    clearInterval(eggOptions.timerEggCount);
    if (dbID("idCb_eggVoiceOutput").checked) {
      speechSpeakOutput("Deine Eier sind fertig!", "de");
    }
  } else {
    eggShowTime();
  }
}
