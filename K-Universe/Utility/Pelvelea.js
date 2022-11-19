const pelveleaOptions = {
  starttime: {
    val: "",
    get minutes() {
      let h = Number(this.val.slice(0, 2));
      let m = Number(this.val.slice(3, 5));
      return m + h * 60
    },
    offset: 5,
    get date() {
      let d = new Date()
      d = d.setHours(utilsMinutesToObj(this.minutes).h, utilsMinutesToObj(this.minutes).m)
      return new Date(d)
    },
    get valOrig() {
      let d = new Date();
      let h = d.getHours();
      let m = d.getMinutes() - this.offset;
      let mins = m + h * 60
      return `${utilsMinutesToObj(mins).h}:${utilsMinutesToObj(mins).m}`
    }
  },
  worktime: {
    val: "",
    valOrig: "08:00",
    get minutes() {
      let h = Number(this.val.slice(0, 2));
      let m = Number(this.val.slice(3, 5));
      return m + h * 60
    }
  },
  breaks: {
    val: "",
    valOrig: "00:30",
    get minutes() {
      let h = Number(this.val.slice(0, 2));
      let m = Number(this.val.slice(3, 5));
      return m + h * 60
    }
  },
  endtime: {
    val: null,
    overtime: 0
  },
  breaktime: {
    val: null,
    valOrig: "00:00",
  },
  progress: {
    // timer: null,
    // overtimer: null
  },
  timer: null
};

function clear_cl_Pelvelea() {
  clearTimeout(pelveleaOptions.timer);
  pelveleaOptions.timer = null;
  pelveleaOptions.starttime.val = pelveleaOptions.starttime.valOrig;
  dbID("idVin_pelveleaStarttime").value = pelveleaOptions.starttime.val;
  pelveleaOptions.worktime.val = pelveleaOptions.worktime.valOrig;
  dbID("idVin_pelveleaWorktime").value = pelveleaOptions.worktime.val;
  pelveleaOptions.breaks.val = pelveleaOptions.breaks.valOrig;
  dbID("idVin_pelveleaBreaks").value = pelveleaOptions.breaks.val;
  pelveleaCalculate();
};

function pelveleaStarttime(obj) {
  pelveleaOptions.starttime.val = obj.value;
  pelveleaCalculate()
}

function pelveleaWorktime(obj) {
  pelveleaOptions.worktime.val = obj.value;
  pelveleaCalculate()
}

function pelveleaBreaks(obj) {
  pelveleaOptions.breaks.val = obj.value;
  pelveleaCalculate()
}

function pelveleaCalculate() {
  let d = new Date()
  pelveleaOptions.endtime.val = d.setHours(0, pelveleaOptions.starttime.minutes + pelveleaOptions.breaks.minutes + pelveleaOptions.worktime.minutes)
  pelveleaOptions.endtime.val = new Date(pelveleaOptions.endtime.val);
  dbID("idLbl_pelveleaResult").textContent = `Arbeitsende: ${pelveleaOptions.endtime.val.toTimeString().slice(0, 5)}`
  clearTimeout(pelveleaOptions.timer);
  pelveleaOptions.timer = null;
  pelveleaTimer();
  pelveleaOptions.timer = setInterval(pelveleaTimer, 2000)
}

function pelveleaTimer() {
  let end = (pelveleaOptions.endtime.val - pelveleaOptions.starttime.date) / 1000
  if ((pelveleaOptions.endtime.val - new Date()) > 0) {
    dbID("idProg_pelveleaProgress").setAttribute("max", end)
    pelveleaProgress();
  } else {
    pelveleaOvertimer();
  }
  pelveleaBreaktime();
}

function pelveleaProgress() {
  let distance = (pelveleaOptions.endtime.val - new Date()) / 1000;
  dbID("idProg_pelveleaProgress").setAttribute("value", distance);
}

function pelveleaOvertimer() {
  const d = new Date(pelveleaOptions.endtime.val.valueOf())
  let mins = (new Date() - pelveleaOptions.endtime.val) / 60000;
  pelveleaOptions.endtime.overtime = d.setHours(0, mins)
  pelveleaOptions.endtime.overtime = new Date(pelveleaOptions.endtime.overtime);
  dbID("idLbl_pelveleaResult").textContent = `Überstunden: ${pelveleaOptions.endtime.overtime.toTimeString().slice(0, 5)}`
}

function pelveleaBreaktime() {
  const distance = (new Date() - pelveleaOptions.starttime.date) / 60000;

  function breaks(mins) {
    dbID("idLbl_pelveleaBreaktime").textContent = `${utilsMinutesToObj(mins).h}:${utilsMinutesToObj(mins).m}`
  }
  if (distance > 540) { // 9 Stunden
    breaks(45)
  } else if (distance > 360) {  // 6 Stunden
    breaks(30)
  } else {
    breaks(0)
  }
}