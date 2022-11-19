const iomlaidOptions = {
  url: "https://api.exchangerate.host",
  data: {},
  options: {},
  optionsOrig: {
    base: "EUR",
    value: 10,
    date: null
  },
  dateFormat: {
    sep: "-",
    leading: true,
    reversed: true,
    fullYear: true
  }
};
let iomlaidPicker;

function clear_cl_Iomlaid() {
  let dateStart = new Date();
  dateStart.setDate(dateStart.getDate() - 14);
  iomlaidOptions.data = {
    latest: {},
    historic: {}
  };
  iomlaidOptions.options = deepClone(iomlaidOptions.optionsOrig);
  iomlaidOptions.options.date = convertDate(dateStart, iomlaidOptions.dateFormat);

  for (let [key, value] of currencies) {
    let option1 = document.createElement("option");
    option1.textContent = `${key} (${value})`;
    option1.setAttribute("data-base", key);
    dbID("idSel_IomlaidCur").appendChild(option1);
  };
  dbID("idSel_IomlaidCur").options[8].selected = true;

  resetInput("idVin_IomlaidCur", iomlaidOptions.options.value)
  dbID('idBtn_iomlaidDate').textContent = iomlaidOptions.options.date;
  iomlaidCalculate()
};

function createIomlaidPikaday() {

  iomlaidPicker = new Pikaday({
    field: dbID('idBtn_iomlaidDate'),
    showTime: false,
    i18n: i18nDE,
    format: 'DD.MM.YYYY',
    minDate: new Date(2000, 1, 1),
    maxDate: new Date(),
    toString(date, format) {
      return convertDate(date, iomlaidOptions.dateFormat);
    },
    onSelect: function () {
      iomlaidSelDate(iomlaidPicker.toString());
    }
  });
};

function iomlaidVinSet(val) {
  iomlaidOptions.options.value = (val.value == "") ? iomlaidOptions.optionsOrig.value : Number(val.value);
  if (Object.keys(iomlaidOptions.data.latest).length == 0 || Object.keys(iomlaidOptions.data.historic).length == 0) {
    iomlaidCalculate();
  } else {
    iomlaidTable();
  };
};

function iomlaidSelSet(sel) {
  iomlaidOptions.options.base = sel.options[sel.selectedIndex].dataset.base;
  iomlaidCalculate();
};

function iomlaidSelDate(date) {
  iomlaidOptions.options.date = date;
  dbID('idBtn_iomlaidDate').textContent = date;
  iomlaidCalculate();
};

async function iomlaidCalculate() {
  let date = convertDate(null, iomlaidOptions.dateFormat);
  try {
    const fetches = [
      fetch(`${iomlaidOptions.url}/${date}?base=${iomlaidOptions.options.base}`),
      fetch(`${iomlaidOptions.url}/${iomlaidOptions.options.date}?base=${iomlaidOptions.options.base}`)
    ]
    let results = await Promise.all(fetches)
    let data = await Promise.all(results.map((r) => r.json()))
    iomlaidOptions.data.latest = (data[0].success == false) ? null : data[0];
    iomlaidOptions.data.historic = (data[1].success == false) ? null : data[1];
    iomlaidTable();
  } catch (err) {
    console.error(err);
  }
};

function iomlaidTable() {
  dbID("idTabHeader_iomlaidRequestedAmount").textContent = `Betrag: ${iomlaidOptions.options.value} ${iomlaidOptions.options.base}`;
  dbID("idTabHeader_iomlaidDatedDate").textContent = `${iomlaidOptions.options.date}`;
  clearTable("idTabBody_Iomlaid");
  let i = 0;

  for (let [key, value] of currencies) {
    if (key != iomlaidOptions.options.base) {
      let row = insertTableRow("idTabBody_Iomlaid");
      // Währung
      tableAddCell(row, {
        names: ["iomlaidCurrency", i],
        type: "Lbl",
        text: `${key} (${value})`,
        createCellClass: ["clTab_borderThinRight"],
        copy: true
      });

      //latest Kurs
      tableAddCell(row, {
        names: ["iomlaidLatestChange", i],
        type: "Lbl",
        text: (iomlaidOptions.data.latest == null) ? "n.d." : iomlaidOptions.data.latest.rates[key],
        cellStyle: {
          textAlign: "right",
        },
        copy: true
      });
      //latest Betrag
      tableAddCell(row, {
        names: ["iomlaidLatestRate", i],
        type: "Lbl",
        text: (iomlaidOptions.data.latest == null) ? "n.d." : Number(iomlaidOptions.data.latest.rates[key] * iomlaidOptions.options.value).toFixed(3),
        createCellClass: ["clTab_borderThinRight"],
        cellStyle: {
          textAlign: "right",
        },
        copy: true
      });

      //historic Kurs
      tableAddCell(row, {
        names: ["iomlaidHistoricChange", i],
        type: "Lbl",
        text: (iomlaidOptions.data.historic == null) ? "n.d." : Number(iomlaidOptions.data.historic.rates[key]).toFixed(3),
        cellStyle: {
          textAlign: "right"
        },
        copy: true
      });

      //historic Betrag
      tableAddCell(row, {
        names: ["iomlaidHistoricRate", i],
        type: "Lbl",
        text: (iomlaidOptions.data.historic == null) ? "n.d." : Number(iomlaidOptions.data.historic.rates[key] * iomlaidOptions.options.value).toFixed(3),
        cellStyle: {
          textAlign: "right"
        },
        copy: true
      });
    };
    i++;
  };
};