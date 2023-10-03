const kadarOptions = {
  valA: null,
  tableA: "idTabBody_Kadar_Anow",
  valB: null,
  tableB: "idTabBody_Kadar_Bnow",
  diffAB: null,
  tableAB: "idTabBody_Kadar_AB",
  diff: null,
  calc: {
    millis: {
      text: (t) => {
        return t ? "Millisekunde" : "Millisekunden";
      },
      get val() {
        return utilsNumber(kadarOptions.diff);
      }
    },
    seconds: {
      text: (t) => {
        return t ? "Sekunde" : "Sekunden";
      },
      get val() {
        return utilsNumber(kadarOptions.diff / 1000);
      }
    },
    minutes: {
      text: (t) => {
        return t ? "Minute" : "Minuten";
      },
      get val() {
        return utilsNumber(kadarOptions.diff / 60000);
      }
    },
    hours: {
      text: (t) => {
        return t ? "Stunde" : "Stunden";
      },
      get val() {
        return utilsNumber(kadarOptions.diff / 3600000);
      }
    },
    days: {
      text: (t) => {
        return t ? "Tag" : "Tage";
      },
      get val() {
        return utilsNumber(kadarOptions.diff / 86400000);
      }
    },
    weeks: {
      text: (t) => {
        return t ? "Woche" : "Wochen";
      },
      get val() {
        return utilsNumber(kadarOptions.diff / 604800000);
      }
    },
    month: {
      text: (t) => {
        return t ? "Monat" : "Monate";
      },
      get val() {
        return utilsNumber(kadarOptions.diff / 2620800000);
      }
    },
    years: {
      text: (t) => {
        return t ? "Jahr" : "Jahre";
      },
      get val() {
        return utilsNumber(kadarOptions.diff / 31449600000);
      }
    }
  }
};

function clear_cl_Kadar() {
  kadarOptions.valA = null;
  kadarOptions.valB = null;
  kadarOptions.valAB = null;
  dbID("idBtn_kadarDateNow").textContent = utilsDate()
  clearTable(kadarOptions.tableA);
  clearTable(kadarOptions.tableB);
  clearTable(kadarOptions.tableAB);
};

function clearKadarTableAnow() {
  clearTable(kadarOptions.tableA);
  kadarOptions.valA = null;
  dbID("idBtn_kadarDateA").textContent = "Start Datum";
  // dbID("idBtn_kadarDateA").value = "Start Datum";
  kadarCalculate();
}

function clearKadarTableBnow() {
  clearTable(kadarOptions.tableB);
  kadarOptions.valB = null;
  dbID("idBtn_kadarDateB").textContent = "End Datum";
  kadarCalculate();
}

function createKadarPikaday(loc) {
  new Pikaday({
    field: dbID(`idBtn_kadarDate${loc}`),
    showTime: true,
    firstDay: 1,
    position: "top",
    i18n: i18nDE,
    onSelect: (date) => {
      kadarOptions[`val${loc}`] = date.getTime();
      dbID(`idBtn_kadarDate${loc}`).textContent = utilsDate(date);
      kadarCalculate();
    }
  });
};

function kadarCalculate() {
  //calculate Table A-Now
  if (kadarOptions.valA != null) {
    kadarOptions.diff = Math.abs(kadarOptions.valA - new Date().getTime());
    kadarTable(kadarOptions.tableA);
  };
  if (kadarOptions.valB != null) {
    kadarOptions.diff = Math.abs(kadarOptions.valB - new Date().getTime());
    kadarTable(kadarOptions.tableB);
  };
  if (kadarOptions.valA != null && kadarOptions.valB != null) {
    kadarOptions.diff = Math.abs(kadarOptions.valA - kadarOptions.valB);
    kadarTable(kadarOptions.tableAB);
  } else {
    dbID("idBtn_kadarDateNow").textContent = utilsDate();
    clearTable(kadarOptions.tableAB);
  };
};

function kadarTable(tableID) {
  clearTable(tableID);
  for (let i = 0; i < Object.keys(kadarOptions.calc).length; i++) {
    const time = Object.keys(kadarOptions.calc)[i];
    const row = insertTableRow(tableID);

    // time
    tableAddCell(row, {
      names: ["kadarTime", i],
      type: "Lbl",
      text: kadarOptions.calc[time].val,
      cellStyle: {
        textAlign: "right"
      },
      copy: true
    });

    //  Unit
    tableAddCell(row, {
      names: ["kadarTime", i],
      type: "Lbl",
      text: kadarOptions.calc[time].text(Math.abs(kadarOptions.calc[time].val) == 1)
    });
  };
};
