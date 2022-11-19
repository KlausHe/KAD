const ranjeOptions = {
  value: 36,
  results: [
    [6, 6],
    [1, 12]
  ]
};

function clear_cl_Ranje() {
  resetInput("idVin_ranjeVal", 36)
  ranjeCalc();
};

function ranjeCalc() {
  ranjeOptions.results = [];
  ranjeOptions.value = numberFromInput("idVin_ranjeVal");
  for (let i = 2; i < ranjeOptions.value; i++) {
    if (ranjeOptions.value % i === 0) {
      ranjeOptions.results.push([i, Math.floor(ranjeOptions.value / i)]);
    }
  }
  if (ranjeOptions.results.length == 0) {
    ranjeOptions.results.push([ranjeOptions.value, 1]);
  }
  tableRanjeCalculate();
};

function tableRanjeCalculate() {
  clearTable("idTabHeader_ranjeList");
  clearTable("idTabBody_ranjeList");
  for (let i = 0; i < ranjeOptions.results.length; i++) {
    const row = insertTableRow("idTabBody_ranjeList");
    tableAddCell(row, {
      names: ["ranje", "op", i],
      type: "Lbl",
      text: ranjeOptions.value,
      cellStyle: {
        textAlign: "center"
      }
    });
    tableAddCell(row, {
      names: ["ranje", "eq", i],
      type: "Lbl",
      text: "=",
      cellStyle: {
        textAlign: "center"
      }
    });
    tableAddCell(row, {
      names: ["ranje", "res", i],
      type: "Lbl",
      text: `${ranjeOptions.results[i][0]} x ${ranjeOptions.results[i][1]}`,
      copy: true
    });
  };
}
