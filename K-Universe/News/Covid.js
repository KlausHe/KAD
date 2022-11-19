let covidGraph = null;

const covidData = {
  url: "https://pomber.github.io/covid19/timeseries.json",
  data: null,
  dates: {
    datesUTC: [],
    selDateIndex: 0,
    A: null,
    B: null,
    inv: false
  },
  selectedCountry: "World",
  showTable: false,
  sort: {
    key: "deathsDaily",
    invert: true
  }
};

const covidOptions = {
  graphTypes: [{
    label: "infiziert (neu)",
    yAxis: "confirmedDaily",
    dbID: "idCb_covidConfirmedDaily",
    checked: true,
    color: "red",
    tableText: [0, ""]
  }, {
    label: "Todesfälle (neu)",
    yAxis: "deathsDaily",
    dbID: "idCb_covidDeathsDaily",
    checked: true,
    color: "darkblue",
    tableText: [0, ""]
  }, {
    label: "infiziert (gesamt)",
    yAxis: "confirmed",
    dbID: "idCb_covidConfirmed",
    checked: false,
    color: "DarkMagenta",
    tableText: [0, ""]
  }, {
    label: "Todesfälle (gesamt)",
    yAxis: "deaths",
    dbID: "idCb_covidDeaths",
    checked: false,
    color: "red",
    tableText: [0, ""]
  }, {
    label: "Mortalität (national)",
    yAxis: "deathsRate",
    dbID: "idCb_covidDeathsRate",
    checked: false,
    color: "darkblue",
    tableText: [2, "%"]
  }, {
    label: "Mortalität (global)",
    yAxis: "deathsWorld",
    dbID: "idCb_covidDeahtsWorld",
    checked: false,
    color: "DarkMagenta",
    tableText: [2, "%"]
  }],
  datasetStyle: {
    xAxisID: "covidDate",
    fill: false,
    pointStyle: "point",
    borderWidth: 1,
    pointRadius: 1,
    showLine: true,
    lineTension: 0.4,
    spanGaps: true
  },
  get ticksStyle() {
    return {
      autoSkip: true,
      fontSize: getCssRoot("fontSize", true) - 2,
      autoSkipPadding: getCssRoot("fontSize", true),
      beginAtZero: false
    }
  },
  get gridLinesStyle() {
    return {
      gridLines: {
        drawOnChartArea: true,
        tickMarkLength: 5
      }
    }
  }
};

function clear_cl_Covid() {
  //generate Header -------------------
  clearTable("idTabHeader_covidTable");
  const rowTH = insertTableRow("idTabHeader_covidTable");
  tableAddCellHeader(rowTH, {
    names: ["covid", "Head", "country"],
    type: "Lbl",
    text: "Land",
    cellStyle: {
      textAlign: "left"
    },
    cellOnclick: () => {
      covidSortTable("country");
    }
  });

  //Button sort
  tableAddCellHeader(rowTH, {
    names: ["covid", "Head", "country"],
    type: "Btn",
    subGroup: "subgrid",
    createCellClass: ["clTab_borderThinRight"],
    img: "refresh2",

    ui: {
      uiSize: "square",
      uiType: "transparent"
    },
    cellStyle: {
      textAlign: "center",
      cursor: "pointer"
    },
    cellOnclick: () => {
      covidSortTable("country");
    }
  });
  dbIDStyle("idTab_covidTable").display = "none";
  covidData.showTable = false;
  btnColor("idBtn_covidTableShow", covidData.showTable ? "positive" : null);

  covidOptions.graphTypes.forEach((lbl, index) => {
    // setCheckbox state
    for (let i = 0; i < covidOptions.graphTypes.length; i++) {
      dbID(covidOptions.graphTypes[i].dbID).checked = covidOptions.graphTypes[i].checked;
      // name Disabled Button
      const btnID = covidOptions.graphTypes[i].dbID.replace("idCb", "idLbl");
      dbID(btnID).textContent = covidOptions.graphTypes[i].label;
    }
    //create Header
    const thCell = tableAddCellHeader(rowTH, {
      names: ["covid", "Head", lbl.yAxis],
      type: "Lbl",
      text: lbl.label,
      createCellClass: [(index == covidOptions.graphTypes.length - 1) ? null : "clTab_borderThinRight"],
      cellStyle: {
        textAlign: "center",
        cursor: "pointer"
      },
      style: {
        cursor: "pointer",
      },
      cellOnclick: () => {
        covidSortTable(lbl.yAxis);
      }
    });
    thCell.classList.add("clTab_shortTH");
  });
  covidDataGenerate()


};

function createCovidPikaday(loc) {
  new Pikaday({
    field: dbID(`idBtn_covidGraphDate${loc}`),
    showTime: false,
    firstDay: 1,
    position: "top",
    i18n: i18nDE,
    format: 'DD-MM-YYYY',
    minDate: new Date(1579647600000),
    maxDate: new Date(),
    onSelect: (date) => {
      covidSetDates(loc, date.getTime());
    }
  });
};

function covidShowTable() {
  covidData.showTable = !covidData.showTable
  btnColor("idBtn_covidTableShow", covidData.showTable ? "positive" : null);
  createCovidTable();
}

function covidSetDates(loc, utc = null) {
  let btnTime;
  if (loc == "A") {
    if (utc === null) {
      covidData.dates.A = covidData.dates.datesUTC[0];
      btnTime = "Start Datum";
    } else {
      covidData.dates.A = utc;
      btnTime = convertDate(covidData.dates.A)
    }
  } else if (loc == "B") {
    if (utc === null) {
      covidData.dates.B = covidData.dates.datesUTC[covidData.dates.datesUTC.length - 1];
      btnTime = "End Datum";
    } else {
      covidData.dates.B = utc;
      btnTime = convertDate(covidData.dates.B)
    }
  }
  //print dates in buttons!!!!!!
  dbID(`idBtn_covidGraphDate${loc}`).textContent = btnTime;

  covidData.dates.inv = (covidData.dates.B < covidData.dates.A);
  covidRefreshGraph();
  covidGraph.update(0);
}
//----------------------------------------------------Data
function covidChangeDay(dir) {
  if (dir == 0) {
    covidData.dates.selDateIndex = covidData.dates.datesUTC.length - 1
  } else {
    covidData.dates.selDateIndex = (covidData.dates.selDateIndex + Number(dir) + covidData.dates.datesUTC.length) % covidData.dates.datesUTC.length;
  }
  createCovidTable();
};

async function covidLoadData(data) {
  covidData.data = data
  covidDataGenerate();
}

function covidDataGenerate() {
  if (covidData.data == null) {
    globalP5.loadJSON(covidData.url, covidLoadData, 'json');
    return
  }

  covidData.dates.datesUTC = [];
  //create "World", needed for each country
  covidData.data["World"] = [];
  // for each day
  const refCountry = Object.keys(covidData.data)[0];
  for (let i = 0; i < covidData.data[refCountry].length; i++) {
    const utc = new Date(covidData.data[refCountry][i].date.replace(/-/g, "/")).getTime() // dateUTC: 1579647600000
    covidData.dates.datesUTC[i] = utc;
    covidData.data.World[i] = {
      date: covidData.data[refCountry][i].date, // date: "2020-1-22"
      confirmed: 0,
      deaths: 0,
      confirmedDaily: 0,
      deathsDaily: 0,
      deathsRate: 0,
      deathsWorld: 0
      //
    }
    const world = covidData.data.World[i];
    // first loop
    for (const [key, val] of Object.entries(covidData.data)) {
      const obj = covidData.data[key][i]
      if (key != "World") {
        covidData.data.World[i].confirmed += val[i].confirmed;
        covidData.data.World[i].deaths += val[i].deaths;
      }
      obj.dateUTC = utc;
      if (i == 0) {
        obj.confirmedDaily = obj.confirmed;
        obj.deathsDaily = obj.deaths;
        obj.deathsRate = (obj.deaths == 0) ? 0 : (obj.deaths / obj.confirmed) * 100;
      } else {
        obj.confirmedDaily = obj.confirmed - covidData.data[key][i - 1].confirmed;
        obj.deathsDaily = obj.deaths - covidData.data[key][i - 1].deaths;
        obj.deathsRate = (obj.deaths / obj.confirmed) * 100;
      }
    }
    // second loop for "deathsWorld"
    for (const [key, val] of Object.entries(covidData.data)) {
      const obj = covidData.data[key][i]
      if (key === "World") {
        obj.deathsWorld = (world.deaths == 0) ? 0 : (obj.deaths / 7840000000) * 100;
      } else {
        obj.deathsWorld = (world.deaths == 0) ? 0 : (obj.deaths / world.deaths) * 100;
      }
    }
  }
  covidData.dates.selDateIndex = covidData.data[refCountry].length - 1;
  covidData.dates.A = covidData.dates.datesUTC[0];
  covidData.dates.B = covidData.dates.datesUTC[covidData.dates.datesUTC.length - 1];
  createCovidTable();
  covidRefreshGraph();
  covidOptionChange();
  covidColorGraph();
};


//-----------------------------------------------------table
function createCovidTable() {
  const dateIndex = covidData.dates.selDateIndex;
  dbID("idLbl_covidConfirmedOutput").textContent = `Infiziert: ${covidData.data.World[dateIndex].confirmed.toLocaleString()}`;
  dbID("idLbl_covidDeathsOutput").textContent = `Todesfälle:  ${covidData.data.World[dateIndex].deaths.toLocaleString()}`;
  dbID("idLbl_covidDay").textContent = convertDate(covidData.dates.datesUTC[dateIndex])
  dataForLabel("idLbl_covidConfirmedOutput", covidData.data.World[dateIndex].confirmed.toLocaleString());
  dataForLabel("idLbl_covidDeathsOutput", covidData.data.World[dateIndex].deaths.toLocaleString());
  //create list
  const covidList = [];
  for (let [key, val] of Object.entries(covidData.data)) {
    const vals = val[covidData.dates.selDateIndex];
    if (vals.infected !== 0) { // only show countries with infections
      covidList.push({
        country: key,
        ...vals
      });
    };
  };
  const covidListSorted = sortArrayByKey(covidList, covidData.sort.key, covidData.sort.invert);
  const wIndex = covidListSorted.findIndex((obj) => {
    return obj.country == "World"
  })
  const tempWorld = covidListSorted.splice(wIndex, 1)[0];
  covidListSorted.unshift(tempWorld);

  clearTable("idTabBody_covidTable");

  if (!covidData.showTable) {
    dbIDStyle("idTab_covidTable").display = "none";
  } else {
    dbIDStyle("idTab_covidTable").display = "initial";
    for (let i = 0; i < covidListSorted.length; i++) {
      const row = insertTableRow("idTabBody_covidTable");
      row.id = `idRow_covid_Body_${i}`;
      const obj = covidListSorted[i];
      //  CountryName
      tableAddCell(row, {
        names: ["covid", "country", i],
        type: "Lbl",
        text: obj.country,
        copy: false,
        cellStyle: {
          maxWidth: "8rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textAlign: "left"
        },
        cellOnclick: () => {
          covidData.selectedCountry = obj.country;
          covidRefreshGraph();
          covidGraph.update();
        }
      });
      //Button
      tableAddCell(row, {
        names: ["covid", "submit", i],
        type: "Btn",
        subGroup: "subgrid",
        createCellClass: ["clTab_borderThickRight"],
        img: "up",

        ui: {
          uiSize: "square",
          uiType: "transparent"
        },
        cellStyle: {
          textAlign: "center",
          cursor: "pointer"
        },
        cellOnclick: () => {
          covidData.selectedCountry = obj.country;
          covidRefreshGraph();
          covidGraph.update();
        }
      });

      covidOptions.graphTypes.forEach((lbl, index) => {
        let text = Number(obj[lbl.yAxis]);
        text = `${text.toFixed(lbl.tableText[0])}${lbl.tableText[1]}`
        tableAddCell(row, {
          names: ["covid", lbl.yAxis, i],
          type: "Lbl",
          text: text,
          createCellClass: [(index == covidOptions.graphTypes.length - 1) ? null : "clTab_borderThinRight"],
          cellStyle: {
            textAlign: "right"
          },
          copy: true
        });
      });
    };
  };
};

function covidSortTable(key) {
  covidData.sort.invert = (covidData.sort.key === key) ? !covidData.sort.invert : true;
  covidData.sort.key = key;
  createCovidTable();
  tableScrollInView("idRow_covid_Body_0");
};

//----------------------------------------------------graph
function covidCreateGraph() {
  const ctx = document.getElementById('idCanv_covidGraph').getContext('2d');
  covidGraph = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
      labels: covidData.data[covidData.selectedCountry].map((data) => {
        // Bereichsbegrenzung kann hier gemacht werden!!!!
        return convertDate(data.dateUTC)
      }),
      datasets: covidOptions.graphTypes.map((d, i) => {
        return {
          label: covidOptions.graphTypes[i].label,
          yAxisID: covidOptions.graphTypes[i].yAxis,
          backgroundColor: covidOptions.graphTypes[i].color,
          borderColor: covidOptions.graphTypes[i].color,
          ...covidOptions.datasetStyle
        }
      })
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true
      },
      animation: false,
      parsing: false,
      plugins: {
        decimation: {
          enabled: true,
          algorithm: 'lttb',
          samples: 300
        }
      },
      legend: {
        position: "bottom",
        labels: {
          filter: (legendItem, data) => {
            return legendItem.index != 1
          },
          usePointStyle: true,
          padding: getCssRoot("padding", true, true),
          boxWidth: getCssRoot("colBoxWidth", true, true) * 0.5
        },
        onClick: (e) => {}
      },
      tooltips: {
        mode: 'index',
        intersect: true,
        position: "average"
      },
      scales: {
        xAxes: [{
          id: "covidDate",
          position: 'bottom',
          display: true,
          ticks: {
            autoSkip: true,
            autoSkipPadding: getCssRoot("fontSize", true) - 2,
            fontSize: getCssRoot("fontSize", true) - 2,
            beginAtZero: false
          },
          ...covidOptions.gridLinesStyle
        }],
        yAxes: [{
            id: "confirmedDaily",
            type: 'linear',
            position: 'left',
            display: true,
            ticks: {
              callback: (value) => {
                if (value >= 1000000) {
                  return (Math.floor(value / 10000) / 100).toLocaleString() + "M"
                } else if (value >= 1000) {
                  return (Math.floor(value / 10) / 100).toLocaleString() + "T"
                }
                return value.toLocaleString();
              },
              ...covidOptions.ticksStyle
            },
            ...covidOptions.gridLinesStyle
          }, {
            id: "deathsDaily",
            type: 'linear',
            position: 'left',
            display: true,
            ticks: {
              callback: (value) => {
                if (value >= 1000000) {
                  return (Math.floor(value / 10000) / 100).toLocaleString() + "M"
                } else if (value >= 1000) {
                  return (Math.floor(value / 10) / 100).toLocaleString() + "T"
                }
                return value.toLocaleString();
              },
              ...covidOptions.ticksStyle
            },
            ...covidOptions.gridLinesStyle
          }, {
            id: "confirmed",
            type: 'linear',
            position: "left",
            display: false,
            ticks: {
              callback: (value) => {
                if (value >= 1000000) {
                  return (Math.floor(value / 10000) / 100).toLocaleString() + "M"
                } else if (value >= 1000) {
                  return (Math.floor(value / 10) / 100).toLocaleString() + "T"
                }
                return value.toLocaleString();
              },
              ...covidOptions.ticksStyle,
            },
            ...covidOptions.gridLinesStyle
          },
          {
            id: "deaths",
            type: 'linear',
            position: 'left',
            display: false,
            ticks: {
              callback: (value) => {
                if (value >= 1000000) {
                  return (Math.floor(value / 10000) / 100).toLocaleString() + "M"
                } else if (value >= 1000) {
                  return (Math.floor(value / 10) / 100).toLocaleString() + "T"
                }
                return value.toLocaleString();
              },
              ...covidOptions.ticksStyle
            },
            ...covidOptions.gridLinesStyle
          },
          {
            id: "deathsRate",
            type: 'linear',
            position: 'right',
            display: false,
            ticks: {
              callback: (value) => {
                return `${value.toFixed(0)}%`
              },
              ...covidOptions.ticksStyle,
            },
            ...covidOptions.gridLinesStyle
          },
          {
            id: "deathsWorld",
            type: 'linear',
            position: 'right',
            display: false,
            ticks: {
              callback: (value) => {
                return `${value.toFixed(0)}%`
              },
              ...covidOptions.ticksStyle,
            },
            ...covidOptions.gridLinesStyle
          }
        ]
      }
    }
  })
}


function covidRefreshGraph() {
  if (covidData.data === null) return
  if (covidGraph === null) {
    covidCreateGraph();
  }
  const startDate = (covidData.dates.inv) ? covidData.dates.B : covidData.dates.A;
  const endDate = (covidData.dates.inv) ? covidData.dates.A : covidData.dates.B;
  covidGraph.data.labels = covidData.data[covidData.selectedCountry].reduce((result, data) => {
    if (data.dateUTC >= startDate && data.dateUTC <= endDate) {
      result.push(convertDate(data.dateUTC))
    }
    return result
  }, []);

  for (let i = 0; i < covidOptions.graphTypes.length; i++) {
    covidGraph.data.datasets[i].data = covidData.data[covidData.selectedCountry].reduce((result, obj) => {
      if (obj.dateUTC >= startDate && obj.dateUTC <= endDate) {
        result.push(obj[covidOptions.graphTypes[i].yAxis])
      }
      return result;
    }, []);
  };
  covidGraph.options.title.text = covidData.selectedCountry;
}

function covidOptionChange() {
  if (covidGraph != null) {
    for (let i = 0; i < covidOptions.graphTypes.length; i++) {
      const dbIDName = covidOptions.graphTypes[i].dbID;
      const yAxis = covidOptions.graphTypes[i].yAxis;
      covidGraph.data.datasets[i].hidden = !dbID(dbIDName).checked;
      const index = covidGraph.options.scales.yAxes.map(obj => obj.id).indexOf(yAxis);
      covidGraph.options.scales.yAxes[index].display = dbID(dbIDName).checked;
    }
    covidGraph.update();
  }
}

function covidColorGraph() {
  if (covidGraph != null) {
    const lCol = globalValues.colors.elements.line;
    const tCol = colorReturnFormat(globalValues.colors.elements.text, {
      type: "hsl",
      text: true
    })
    covidGraph.options.title.fontSize = getCssRoot("fontSizeMedium", true, true);
    covidGraph.options.title.fontColor = tCol;
    covidGraph.options.legend.labels.fontColor = tCol;
    covidGraph.options.scales.xAxes[0].ticks.fontColor = tCol;
    covidGraph.options.scales.xAxes[0].gridLines.color = colorReturnFormat(lCol, {
      type: "hsl",
      text: true,
      alpha: 0.2
    });

    for (let i = 0; i < covidOptions.graphTypes.length; i++) {
      const alpha = valueMapping(i, 0, covidOptions.graphTypes.length - 1, 0.8, 0.2, true);
      covidGraph.options.scales.yAxes[i].gridLines.color = colorReturnFormat(lCol, {
        type: "hsl",
        text: true,
        alpha: alpha
      });
      covidGraph.options.scales.yAxes[i].ticks.fontColor = covidOptions.graphTypes[i].color;
    }
    covidGraph.update();
  };
};