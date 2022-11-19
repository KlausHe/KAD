const eggOptions = {
  timerEggCount: null,
  eggTimeLeft: 0,
  eggTimeOut: 0,
  eggTimerState: false,
  mass: {
    XL: 73,
    L: 63,
    M: 53,
    S: 40
  },
  temp: {
    Wohnung: 16,
    Keller: 9,
    Kühlschrank: 4
  },
  yolk: {
    "fest": 80,
    "fast fest": 75,
    "wachs": 65,
    "leicht wachs": 55,
    "weich": 45
  }
}

function clear_cl_Egg() {
  eggMassChange();
  eggTempChange();
  eggYolkChange();
  eggOptions.eggTimerState = true;
  eggStartChange();
};

function eggMassChange(obj = null) {
  let label;
  const mass = (obj === null) ? 60 : obj.value;
  for (const [key, val] of Object.entries(eggOptions.mass)) {
    if (mass >= val) {
      label = key;
      break;
    }
  }
  dbID("idLbl_EggMass").textContent = `${mass}g (${label})`;
};

function eggTempChange(obj = null) {
  let label;
  const temp = (obj === null) ? 7 : obj.value;
  for (const [key, val] of Object.entries(eggOptions.temp)) {
    if (temp >= val) {
      label = key;
      break;
    }
  }
  dbID("idLbl_EggTemp").textContent = `${temp}°C (${label})`;
};

function eggYolkChange(obj = null) {
  let label;
  const yolk = (obj === null) ? 75 : obj.value;
  for (const [key, val] of Object.entries(eggOptions.yolk)) {
    if (yolk >= val) {
      label = key;
      break;
    }
  }
  dbID("idLbl_EggYolk").textContent = `${label} (~${yolk}°C)`;
};



function eggStartChange() {
  eggOptions.eggTimerState = !eggOptions.eggTimerState;
  if (eggOptions.eggTimerState) {
    dbID("idBtn_EggStart").textContent = "Stop";
    //calculate eggOptions.eggTimeLeft in seconds!
    let mEgg = dbID("idRange_EggMass").value;
    let tEgg = dbID("idRange_EggTemp").value;
    let yEgg = dbID("idRange_EggYolk").value;

    let tempFactor = 0.76 * ((tEgg - 100) / (yEgg - 100));
    tempFactor = Math.log(tempFactor);
    let massFactor = 27.05089242 * Math.pow(mEgg, 2 / 3)
    eggOptions.eggTimeLeft = massFactor * tempFactor;
    eggOptions.eggTimeOut = new Date(Date.now() + eggOptions.eggTimeLeft * 1000);
    dbID("idProg_eggProgress").setAttribute("max", eggOptions.eggTimeLeft)
    eggCountdown();
    eggOptions.timerEggCount = setInterval(eggCountdown, 250);
  } else {
    dbID("idBtn_EggStart").textContent = "Start";
    clearInterval(eggOptions.timerEggCount);
    let textStart = "Eieruhr";
    dbID("idLbl_EggTime").textContent = textStart;
  };
};

function eggCountdown() {
  let now = new Date();
  let distance = (eggOptions.eggTimeOut - now) / 1000;
  dbID("idProg_eggProgress").setAttribute("value", distance);
  if (distance <= 0) {
    let textDone = "Fertig!";
    if (dbID("idCb_eggVoiceOutput").checked) {
      speechSpeakOutput("Deine Eier sind fertig!", "de");
    };
    dbID("idLbl_EggTime").textContent = textDone;
    clearInterval(eggOptions.timerEggCount);
    setTimeout(eggStartChange, 10000);
  } else {
    let minutes = Math.floor(distance / 60);
    let seconds = Math.floor(distance % 60);
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    let text = minutes + ":" + seconds;
    dbID("idLbl_EggTime").textContent = text;
  };
};