const foodyOptions = {
  chosenFood: {},
  timerState: false,
  timerCount: 0,
  timeLeft: 0,
  timeOut: 0,
  preheat: 6,
  data: [{
    name: "Baguette",
    time: 15,
    temp: "220C"
  }, {
    name: "Blätterteig flach",
    time: 12,
    temp: "200C"
  }, {
    name: "Blätterteig gefüllt",
    time: 20,
    temp: "200C"
  }, {
    name: "Ei: hart",
    time: 9,
    temp: "Topf"
  }, {
    name: "Ei: wachs",
    time: 7,
    temp: "Topf"
  }, {
    name: "Ei: weich",
    time: 5,
    temp: "Topf"
  }, {
    name: "Fischstäbchen",
    numerus: true,
    time: 16,
    temp: "220C"
  }, {
    name: "Fleischkas",
    time: 35,
    temp: "180C"
  }, {
    name: "Fusilli",
    numerus: true,
    time: 11,
    temp: "Topf"
  }, {
    name: "Gemelli",
    numerus: true,
    time: 10,
    temp: "Topf"
  }, {
    name: "Kabeljaufilet",
    time: 10,
    temp: "180C"
  }, {
    name: "Kroketten",
    numerus: true,
    time: 20,
    temp: "200C"
  }, {
    name: "Lasagne",
    time: 45,
    temp: "180C"
  }, {
    name: "Laugenbrezel",
    numerus: true,
    time: 15,
    temp: "220C"
  }, {
    name: "Laugenstangen",
    numerus: true,
    time: 15,
    temp: "200C"
  }, {
    name: "Parboild Reis",
    time: 17,
    temp: "Topf"
  }, {
    name: "Penne",
    numerus: true,
    time: 11,
    temp: "Topf"
  }, {
    name: "Pizza",
    time: 10,
    temp: "220C"
  }, {
    name: "Pommes",
    numerus: true,
    time: 18,
    temp: "200C"
  }, {
    name: "Rösti",
    numerus: true,
    time: 22,
    temp: "200C"
  }, {
    name: "Spaghetti No 1",
    numerus: true,
    time: 3,
    temp: "Topf"
  }, {
    name: "Spaghetti No 3",
    numerus: true,
    time: 9,
    temp: "Topf"
  }, {
    name: "Spaghetti No 5",
    numerus: true,
    time: 8,
    temp: "Topf"
  }]
}

function clear_cl_Foody() {
  clearInterval(foodyOptions.timerCount);
  foodyOptions.timerState = true;
  resetInput("idRange_foodyPreheat", foodyOptions.preheat)
  foodyPreheatChange();
  for (let i = 0; i < foodyOptions.data.length; i++) {
    dbID("idSel_foodyType").options[i] = new Option(`${foodyOptions.data[i].name} (${foodyOptions.data[i].time}min)`);
  };
  const randomStart = randomIndex(foodyOptions.data);
  dbID("idSel_foodyType").options[randomStart].selected = true;
  foodyStartChange();
};

function foodyStartChange() {
  let index = dbID("idSel_foodyType").selectedIndex;
  foodyOptions.chosenFood = foodyOptions.data[index];
  foodyOptions.timerState = !foodyOptions.timerState;
  if (foodyOptions.timerState) {
    dbID("idBtn_foodyStart").textContent = "Stop";
    let noTopfPreheat;
    if (foodyOptions.chosenFood.temp != "Topf") {
      noTopfPreheat = foodyOptions.preheat;
    } else {
      noTopfPreheat = 0;
      dbID("idLbl_foodyPreheat").textContent = "---";
    };
    foodyOptions.timeLeft = (foodyOptions.chosenFood.time + noTopfPreheat) * 60 * 1000
    foodyOptions.timeOut = new Date(Date.now() + foodyOptions.timeLeft);
    const bar = dbID("idProg_foodyProgress");
    bar.setAttribute("max", foodyOptions.timeLeft / 1000);
    foodyCountdown();
    foodyOptions.timerCount = setInterval(foodyCountdown, 500);
  } else {
    dbID("idBtn_foodyStart").textContent = "Start";
    clearInterval(foodyOptions.timerCount);
    let textStart = "Foody";
    dbID("idLbl_foodyTime").innerHTML = textStart;
  };
};

function foodyPreheatChange() {
  foodyOptions.preheat = Number(dbID("idRange_foodyPreheat").value);
  dbID("idLbl_foodyPreheat").textContent = foodyOptions.preheat + " min";
};

function foodyCountdown() {
  let now = new Date();
  let distance = (foodyOptions.timeOut - now) / 1000;
  const bar = dbID("idProg_foodyProgress");
  bar.setAttribute("value", distance);
  let minutes = Math.floor(distance / 60);
  let seconds = Math.floor(distance % 60);
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  if (distance <= 0) {
    if (dbID("idCb_foodyVoiceOutput").checked) {
      let index = dbID("idSel_foodyType").selectedIndex;
      let s = foodyOptions.data[index].numerus ? "sind" : "ist";
      const sentence = `${foodyOptions.data[index].name} ${s} feritg!`
      speechSpeakOutput(sentence, "de");
    };
    dbID("idLbl_foodyTime").innerHTML = "Fertig!";
    clearInterval(foodyOptions.timerCount);
    setTimeout(foodyStartChange, 10000);
  } else {
    let zubereitung;
    if (foodyOptions.chosenFood.temp === "Topf") {
      zubereitung = " (im Topf)"
    } else {
      zubereitung = " (Ofen bei " + foodyOptions.chosenFood.temp + ")"
    }
    let text = minutes + ":" + seconds + zubereitung;
    dbID("idLbl_foodyTime").innerHTML = text;
  };
};
