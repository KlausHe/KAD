const quickmathOptions = {
  values: {
    val: 12,
    i: 42
  },
  objects: {
    Multiply: {
      tabID: "idTabBody_quickmathMultiply",
      get html() {
        return `${quickmathOptions.values.val} x ${quickmathOptions.values.i}`; //\u22C5
      },
      get num() {
        return checkExponential(quickmathOptions.values.val * quickmathOptions.values.i, {
          decimals: 4,
          expoThreashold: 4
        })
      }
    },
    Divide: {
      tabID: "idTabBody_quickmathDivide",
      get html() {
        return `${quickmathOptions.values.val}/${quickmathOptions.values.i}`; //"Div by 0"
      },
      get num() {
        const res = checkExponential((quickmathOptions.values.val / (quickmathOptions.values.i)), {
          decimals: 4,
          expoThreashold: 4
        })
        return (quickmathOptions.values.i == 0) ? "-" : res;
      }
    },
    Pow: {
      tabID: "idTabBody_quickmathPow",
      get html() {
        return `${quickmathOptions.values.val}<sup>${quickmathOptions.values.i}</sup>`;
      },
      get num() {
        return checkExponential(quickmathOptions.values.val ** quickmathOptions.values.i, {
          decimals: 4,
          expoThreashold: 4
        })
      }
    },
  }
};

function clear_cl_Quickmath() {
  resetInput("idVin_quickkmathVal", 25)
  resetInput("idVin_quickkmathStart", 1)
  resetInput("idVin_quickkmathEnd", 10)
  calcQuickmath();
};

function calcQuickmath() {
  quickmathOptions.values.val = utilsNumberFromInput("idVin_quickkmathVal");
  tableQuickmathCalculate("Multiply");
  tableQuickmathCalculate("Divide");
  tableQuickmathCalculate("Pow");
};

function tableQuickmathCalculate(op) {
  const operation = op;
  const obj = quickmathOptions.objects[operation];
  clearTable(obj.tabID);
  const vinMin = utilsNumberFromInput("idVin_quickkmathStart");
  const vinMax = utilsNumberFromInput("idVin_quickkmathEnd");
  const start = Math.min(vinMin, vinMax);
  const end = Math.max(vinMin, vinMax) + 1;

  for (let i = start; i < end; i++) {
    quickmathOptions.values.i = i;
    const row = insertTableRow(obj.tabID);
    //vals
    tableAddCell(row, {
      names: ["quickmath", "op", operation, i],
      type: "Lbl",
      text: obj.html,
      cellStyle: {
        textAlign: "center"
      }
    });

    tableAddCell(row, {
      names: ["quickmath", "eq", operation, i],
      type: "Lbl",
      text: "=",
      cellStyle: {
        textAlign: "center"
      }
    });

    tableAddCell(row, {
      names: ["quickmath", "res", operation, i],
      type: "Lbl",
      text: obj.num,
      copy: true
    });
  };
}
