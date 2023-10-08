const ranjeOptions = {
  value: 36,
  results: [
    [6, 6],
    [1, 12]
  ]
};

function clear_cl_Ranje() {
  KadUtils.DOM.resetInput("idVin_ranjeVal", 36)
  ranjeCalc();
};

function ranjeCalc() {
  ranjeOptions.results = [];
  ranjeOptions.value = KadUtils.DOM.numberFromInput("idVin_ranjeVal");
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
  KadUtils.Table.clear("idTabHeader_ranjeList");
  KadUtils.Table.clear("idTabBody_ranjeList");
  for (let i = 0; i < ranjeOptions.results.length; i++) {
    const row = KadUtils.Table.insertRow("idTabBody_ranjeList");
    KadUtils.Table.addCell(row, {
      names: ["ranje", "op", i],
      type: "Lbl",
      text: ranjeOptions.value,
      cellStyle: {
        textAlign: "center"
      }
    });
    KadUtils.Table.addCell(row, {
      names: ["ranje", "eq", i],
      type: "Lbl",
      text: "=",
      cellStyle: {
        textAlign: "center"
      }
    });
    KadUtils.Table.addCell(row, {
      names: ["ranje", "res", i],
      type: "Lbl",
      text: `${ranjeOptions.results[i][0]} x ${ranjeOptions.results[i][1]}`,
      copy: true
    });
  };
}
