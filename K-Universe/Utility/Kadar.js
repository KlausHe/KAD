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
        return KadUtils.Value.number(kadarOptions.diff);
      }
    },
    seconds: {
      text: (t) => {
        return t ? "Sekunde" : "Sekunden";
      },
      get val() {
        return KadUtils.Value.number(kadarOptions.diff / 1000);
      }
    },
    minutes: {
      text: (t) => {
        return t ? "Minute" : "Minuten";
      },
      get val() {
        return KadUtils.Value.number(kadarOptions.diff / 60000);
      }
    },
    hours: {
      text: (t) => {
        return t ? "Stunde" : "Stunden";
      },
      get val() {
        return KadUtils.Value.number(kadarOptions.diff / 3600000);
      }
    },
    days: {
      text: (t) => {
        return t ? "Tag" : "Tage";
      },
      get val() {
        return KadUtils.Value.number(kadarOptions.diff / 86400000);
      }
    },
    weeks: {
      text: (t) => {
        return t ? "Woche" : "Wochen";
      },
      get val() {
        return KadUtils.Value.number(kadarOptions.diff / 604800000);
      }
    },
    month: {
      text: (t) => {
        return t ? "Monat" : "Monate";
      },
      get val() {
        return KadUtils.Value.number(kadarOptions.diff / 2620800000);
      }
    },
    years: {
      text: (t) => {
        return t ? "Jahr" : "Jahre";
      },
      get val() {
        return KadUtils.Value.number(kadarOptions.diff / 31449600000);
      }
    }
  }
};

function clear_cl_Kadar() {
  kadarOptions.valA = null;
  kadarOptions.valB = null;
  kadarOptions.valAB = null;
  KadUtils.dbID("idBtn_kadarDateNow").textContent = KadUtils.Date.getDate()
  KadUtils.Table.clear(kadarOptions.tableA);
  KadUtils.Table.clear(kadarOptions.tableB);
  KadUtils.Table.clear(kadarOptions.tableAB);
};

function clearKadarTableAnow() {
  KadUtils.Table.clear(kadarOptions.tableA);
  kadarOptions.valA = null;
  KadUtils.dbID("idBtn_kadarDateA").textContent = "Start Datum";
  // KadUtils.dbID("idBtn_kadarDateA").value = "Start Datum";
  kadarCalculate();
}

function clearKadarTableBnow() {
  KadUtils.Table.clear(kadarOptions.tableB);
  kadarOptions.valB = null;
  KadUtils.dbID("idBtn_kadarDateB").textContent = "End Datum";
  kadarCalculate();
}

function createKadarPikaday(loc) {
  new Pikaday({
    field: KadUtils.dbID(`idBtn_kadarDate${loc}`),
    showTime: true,
    firstDay: 1,
    position: "top",
    i18n: i18nDE,
    onSelect: (date) => {
      kadarOptions[`val${loc}`] = date.getTime();
      KadUtils.dbID(`idBtn_kadarDate${loc}`).textContent = KadUtils.Date.getDate(date);
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
    KadUtils.dbID("idBtn_kadarDateNow").textContent = KadUtils.Date.getDate();
    KadUtils.Table.clear(kadarOptions.tableAB);
  };
};

function kadarTable(tableID) {
  KadUtils.Table.clear(tableID);
  for (let i = 0; i < Object.keys(kadarOptions.calc).length; i++) {
    const time = Object.keys(kadarOptions.calc)[i];
    const row = KadUtils.Table.insertRow(tableID);

    // time
    KadUtils.Table.addCell(row, {
      names: ["kadarTime", i],
      type: "Lbl",
      text: kadarOptions.calc[time].val,
      cellStyle: {
        textAlign: "right"
      },
      copy: true
    });

    //  Unit
    KadUtils.Table.addCell(row, {
      names: ["kadarTime", i],
      type: "Lbl",
      text: kadarOptions.calc[time].text(Math.abs(kadarOptions.calc[time].val) == 1)
    });
  };
};
