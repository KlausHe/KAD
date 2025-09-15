import { initEL, KadDate, KadRandom } from "../KadUtils/KadUtils.js";
const foodyOptions = {
  timerCount: 0,
  timeTotal: 0,
  timerState: false,
  timeRemaining: 0,
  foodIndex: 0,
  get chosenFood() {
    return this.data[this.foodIndex];
  },
  preheat: 0,
  preheatOrig: 6,
  startCallbacks: [
    ["Start", foodyStart],
    ["Stop", foodyStop],
  ],
  data: [
    {
      name: "Baguette",
      time: 15,
      temp: "220C",
    },
    {
      name: "Blätterteig flach",
      time: 12,
      temp: "200C",
    },
    {
      name: "Blätterteig gefüllt",
      time: 20,
      temp: "200C",
    },
    {
      name: "Ei: hart",
      time: 9,
      temp: "Topf",
    },
    {
      name: "Ei: wachs",
      time: 7,
      temp: "Topf",
    },
    {
      name: "Ei: weich",
      time: 5,
      temp: "Topf",
    },
    {
      name: "Fischstäbchen",
      numerus: true,
      time: 16,
      temp: "220C",
    },
    {
      name: "Fleischkas",
      time: 35,
      temp: "180C",
    },
    {
      name: "Fusilli",
      numerus: true,
      time: 11,
      temp: "Topf",
    },
    {
      name: "Gemelli",
      numerus: true,
      time: 10,
      temp: "Topf",
    },
    {
      name: "Kabeljaufilet",
      time: 10,
      temp: "180C",
    },
    {
      name: "Kroketten",
      numerus: true,
      time: 20,
      temp: "200C",
    },
    {
      name: "Lasagne",
      time: 45,
      temp: "180C",
    },
    {
      name: "Laugenbrezel",
      numerus: true,
      time: 15,
      temp: "220C",
    },
    {
      name: "Laugenstangen",
      numerus: true,
      time: 15,
      temp: "200C",
    },
    {
      name: "Parboild Reis",
      time: 17,
      temp: "Topf",
    },
    {
      name: "Penne",
      numerus: true,
      time: 11,
      temp: "Topf",
    },
    {
      name: "Pizza",
      time: 10,
      temp: "220C",
    },
    {
      name: "Pommes",
      numerus: true,
      time: 18,
      temp: "200C",
    },
    {
      name: "Rösti",
      numerus: true,
      time: 22,
      temp: "200C",
    },
    {
      name: "Spaghetti No 1",
      numerus: true,
      time: 3,
      temp: "Topf",
    },
    {
      name: "Spaghetti No 3",
      numerus: true,
      time: 9,
      temp: "Topf",
    },
    {
      name: "Spaghetti No 5",
      numerus: true,
      time: 8,
      temp: "Topf",
    },
  ],
};

const Btn_foodyStart = initEL({ id: "idBtn_foodyStart", fn: foodyStartChange, btnCallbacks: foodyOptions.startCallbacks });
const Vin_foodyPreheat = initEL({ id: "idVin_foodyPreheat", fn: foodyPreheatChange, resetValue: foodyOptions.preheatOrig });
const Sel_foodyType = initEL({ id: "idSel_foodyType", fn: foodyChangeFood, selStartIndex: 0, selList: foodyOptions.data.map((f, i) => [`${f.name} (${f.time}min)`, i]) });
const Lbl_foodyTime = initEL({ id: "idLbl_foodyTime", resetValue: "Foody" });
const Prog_foodyProgress = initEL({ id: "idProg_foodyProgress", domOpts: { max: 100 } });

export function clear_cl_Foody() {
  foodyOptions.timerState = Btn_foodyStart.KadReset();
  foodyOptions.preheat = Vin_foodyPreheat.KadReset();
  Lbl_foodyTime.KadReset();
  Sel_foodyType.KadReset({ selStartIndex: KadRandom.randomIndex(foodyOptions.data) });
  clearInterval(foodyOptions.timerCount);
  foodyCalculate();
}

function foodyPreheatChange() {
  foodyOptions.preheat = Vin_foodyPreheat.KadGet();
  foodyCalculate();
}

function foodyChangeFood() {
  foodyOptions.foodIndex = Sel_foodyType.KadGet();
  foodyCalculate();
}

function foodyCalculate() {
  const preheatState = foodyOptions.chosenFood.temp != "Topf";
  let noTopfPreheat = preheatState ? foodyOptions.preheat : 0;
  Vin_foodyPreheat.KadEnable(preheatState);
  foodyOptions.timeTotal = (foodyOptions.chosenFood.time + noTopfPreheat) * 60;
  foodyOptions.timeRemaining = foodyOptions.timeTotal;
  foodyShowTime();
}

function foodyStart() {
  Prog_foodyProgress.KadSetMax(foodyOptions.timeTotal);
  foodyOptions.timerCount = setInterval(foodyCountdown, 1000);
  foodyCountdown();
}

function foodyStop() {
  clearInterval(foodyOptions.timerCount);
  let textStart = "Foody";
  Lbl_foodyTime.KadSetText(textStart);
}
function foodyStartChange() {
  foodyOptions.timerState = !foodyOptions.timerState;
  Vin_foodyPreheat.KadEnable(!foodyOptions.timerState);
  Sel_foodyType.KadEnable(!foodyOptions.timerState);
}

function foodyCountdown() {
  foodyOptions.timeRemaining--;
  Prog_foodyProgress.KadSetValue(foodyOptions.timeRemaining);
  if (foodyOptions.timeRemaining <= 0) {
    Lbl_foodyTime.KadSetText("Fertig!");
    clearInterval(foodyOptions.timerCount);
    setTimeout(foodyStartChange, 10000);
  } else {
    foodyShowTime();
  }
}

function foodyShowTime() {
  let zubereitung = foodyOptions.chosenFood.temp === "Topf" ? " (im Topf)" : " (Ofen bei " + foodyOptions.chosenFood.temp + ")";
  let obj = KadDate.secondsToObj(foodyOptions.timeRemaining);
  Lbl_foodyTime.KadSetText(`${obj.h}:${obj.m}:${obj.s} ${zubereitung}`);
}
