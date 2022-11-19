const niskaOptions = {
  size: {
    val: 0,
    valOrig: 6
  },
  pitch: {
    val: 1,
    valOrig: 1
  },
  select: {
    index: 0,
    indexOrig: 8,
    type: "",
    typeOrig: "regel",
    get size() {
      return niskaOptions[this.type][this.index][0]
    },
    get pitch() {
      return niskaOptions[this.type][this.index][1]
    }
  },
  regel: [
    [1, 0.25],
    [1.2, 0.25],
    [1.4, 0.3],
    [1.6, 0.35],
    [2, 0.4],
    [2.5, 0.45],
    [3, 0.5],
    [4, 0.7],
    [5, 0.8],
    [6, 1],
    [7, 1],
    [8, 1.25],
    [10, 1.5],
    [12, 1.75],
    [14, 2],
    [16, 2],
    [16, 2.5],
    [20, 2.5],
    [22, 2.5],
    [24, 3],
    [27, 3],
    [30, 3.5],
    [33, 3.5],
    [36, 4],
    [39, 4],
    [42, 4.5],
    [45, 4.5],
    [48, 5],
    [52, 5],
    [56, 5.5],
    [60, 5.5],
    [64, 6],
    [68, 6]
  ],
  fein: [
    [1, 0.2],
    [1.1, 0.2],
    [1.2, 0.2],
    [1.4, 0.2],
    [1.4, 0.25],
    [1.6, 0.2],
    [1.6, 0.25],
    [1.8, 0.2],
    [1.8, 0.25],
    [2, 0.2],
    [2, 0.25],
    [2, 0.35],
    [2.2, 0.2],
    [2.2, 0.25],
    [2.2, 0.35],
    [2.5, 0.2],
    [2.5, 0.25],
    [2.5, 0.35],
    [3, 0.2],
    [3, 0.25],
    [3, 0.35],
    [3.5, 0.2],
    [3.5, 0.25],
    [3.5, 0.35],
    [4, 0.2],
    [4, 0.25],
    [4, 0.35],
    [4.5, 0.2],
    [4.5, 0.25],
    [4.5, 0.35],
    [5, 0.2],
    [5, 0.25],
    [5, 0.35],
    [5.5, 0.2],
    [5.5, 0.25],
    [5.5, 0.35],
    [6, 0.2],
    [6, 0.25],
    [6, 0.35],
    [6.5, 0.2],
    [6.5, 0.25],
    [6.5, 0.35],
    [7, 0.2],
    [7, 0.25],
    [7, 0.35],
    [7.5, 0.2],
    [7.5, 0.25],
    [7.5, 0.35],
    [8, 0.2],
    [8, 0.25],
    [8, 0.35],
    [8.5, 0.2],
    [8.5, 0.25],
    [8.5, 0.35],
    [9, 0.2],
    [9, 0.25],
    [9, 0.35],
    [9.5, 0.2],
    [9.5, 0.25],
    [9.5, 0.35],
    [10, 0.2],
    [10, 0.25],
    [10, 0.35],
    [10.5, 0.35],
    [11, 0.35],
    [11.5, 0.35],
    [12, 0.35],
    [12.5, 0.35],
    [13, 0.35],
    [13.5, 0.35],
    [14, 0.35],
    [14.5, 0.35],
    [15, 0.35],
    [15.5, 0.35],
    [16, 0.35],
    [17, 0.35],
    [18, 0.35],
    [19, 0.35],
    [20, 0.35],
    [21, 0.35],
    [22, 0.35],
    [23, 0.35],
    [24, 0.35],
    [25, 0.35],
    [26, 0.35],
    [27, 0.35],
    [28, 0.35],
    [29, 0.35],
    [30, 0.35],
    [31, 0.35],
    [32, 0.35],
    [33, 0.35],
    [34, 0.35],
    [35, 0.35],
    [36, 0.35],
    [37, 0.35],
    [38, 0.35],
    [39, 0.35],
    [40, 0.35],
    [42, 0.35],
    [45, 0.35],
    [48, 0.35],
    [50, 0.35]
  ],
  strengthClass: {
    val: [5.6, 6.8, 8.8, 10.9, 12.9],
    index: 0,
    indexOrig: 2,
    get re() { //Streckgrenze
      return Math.floor((this.val[this.index] % 1) * 10 * Math.floor(this.val[this.index]) * 10)
    },
    get rm() {
      return Math.floor(this.val[this.index]) * 100;
    }
  },
  data: {
    safetyAxialStatic: 1.5,
    safetyAxialDynamic: 2,
    safetyShearStatic: 1.5,
    safetyShearDynamic: 2.5,
    frictionCoefShear: 0.15,
    exploitRe: 0.8,
    get flankAngle() {
      return 60 * Math.PI / 180
    }
  },
  decimalOpts: {
    decimals: 3,
    expoThreashold: 7
  },

  results: {
    boreDiameter: {
      name: "Bohrungsdurchmesser",
      unit: "mm",
      val: []
    },
    innerCoreDiameterNut: {
      name: "Kernd. des Innengewindes",
      unit: "mm",
      val: []
    },
    outerCoreDiameter: {
      name: "Kernd. des Aussengewindes",
      unit: "mm",
      val: []
    },
    flankDiameter: {
      name: "Flankendurchmesser",
      unit: "mm",
      val: []
    },
    stressCrosssection: {
      name: "Spannungsquerschnitt",
      unit: "mm\u00b2",
      val: []
    },
    preloadMax: {
      name: "max. Vorspannkraft",
      unit: "N",
      val: []
    },
    // strengthAxialStatic: {
    //   name: "max. Axialkraft statisch",
    //   unit: "N",
    //   val: []
    // },
    // strengthAxialDynamic: {
    //   name: "max. Axialkraft dynamisch",
    //   unit: "N",
    //   val: []
    // },
    // // strengthouterCoreDiameterNut
    // strengthShearStatic: {
    //   name: "max. Querkraft statisch",
    //   unit: "N",
    //   val: []
    // },
    // strengthShearDynamic: {
    //   name: "max. Querkraft dynamisch",
    //   unit: "N",
    //   val: []
    // },
  }
};

function clear_cl_Niska() {
  niskaOptions.size.val = niskaOptions.size.valOrig
  niskaOptions.pitch.val = niskaOptions.pitch.valOrig
  niskaOptions.select.index = niskaOptions.select.indexOrig
  niskaOptions.select.type = niskaOptions.select.typeOrig
  niskaOptions.strengthClass.index = niskaOptions.strengthClass.indexOrig
  resetInput("idVin_niskaSize", niskaOptions.size.val, {
    min: 0
  })
  resetInput("idVin_niskaPitch", niskaOptions.pitch.val, {
    min: 0
  })

  clearFirstChild("idSel_niskaSelect");
  let selInput = dbID("idSel_niskaSelect")
  let optGroup = document.createElement("optgroup");
  optGroup.label = "Regelgewinde";
  for (const [index, val] of niskaOptions.regel.entries()) {
    const opt = document.createElement("OPTION");
    opt.textContent = `M${val[0]}x${val[1]}`;
    opt.value = index;
    opt.setAttribute("data-type", "regel");
    optGroup.appendChild(opt);
  };
  selInput.appendChild(optGroup);

  optGroup = document.createElement("optgroup");
  optGroup.label = "Feingewinde";
  for (const [index, val] of niskaOptions.fein.entries()) {
    const opt = document.createElement("OPTION");
    opt.textContent = `M${val[0]}x${val[1]}`;
    opt.value = index;
    opt.setAttribute("data-type", "fein");
    optGroup.appendChild(opt);
  };
  selInput.appendChild(optGroup);
  selInput.options[niskaOptions.select.index].selected = true;

  clearFirstChild("idSel_niskaStrengthClass");
  let selStrength = dbID("idSel_niskaStrengthClass")
  for (const val of niskaOptions.strengthClass.val) {
    const opt = document.createElement("OPTION");
    opt.textContent = val;
    opt.value = val;
    selStrength.appendChild(opt);
  };
  selStrength.options[niskaOptions.strengthClass.index].selected = true;


  niskaCalc();
};

function niskaCalc() {
  niskaOptions.size.val = numberFromInput("idVin_niskaSize");
  niskaOptions.pitch.val = numberFromInput("idVin_niskaPitch");
  niskaHelpCalculation(niskaOptions.size.val, niskaOptions.pitch.val, 0);
  niskaOptions.select.index = dbID("idSel_niskaSelect").selectedIndex
  niskaOptions.select.type = dbID("idSel_niskaSelect").options[niskaOptions.select.index].dataset.type
  dbID("idLbl_niskaRegelInfo").textContent = (niskaOptions.select.type == niskaOptions.select.typeOrig) ? "Regelgewinde" : "Feingewinde";
  niskaHelpCalculation(niskaOptions.select.size, niskaOptions.select.pitch, 1);
  niskaOptions.strengthClass.index = dbID("idSel_niskaStrengthClass").selectedIndex
  niskaTable();
};

function niskaHelpCalculation(d, P, index) {
  //geometric
  const boreDiameter = d - P;
  const innerCoreDiameterNut = d - (1.0825 * P); //  Kerndurchmesser des Muttergewindes
  const innerCoreDiameterBolt = d - (1.22687 * P); // d3 Kerndurchmesser des Bolzengewindes
  const outerCoreDiameter = d - (1.2269 * P);
  const flankDiameter = d - (0.6495 * P); //d2 = Flankendurchmesser
  const threadDepthBolt = 0.6134 * P; // Gewindetiefe des Bolzengewindes	h3 = 0,6134 * P = H * 17 / 24
  const threadDepthNut = 0.5413 * P; // Gewindetiefe des Muttergewindes	H1 = 0,5413 * P
  const rounding = 0.1443 * P; // Rundung	R = 0,1443 * P
  const pitchAngle = Math.atan(P / (flankDiameter * Math.PI)); //  φ° = Steigungswinkel(Grad)
  const stressCrosssection = (Math.PI / 4) * (((flankDiameter + outerCoreDiameter) / 2) ** 2); //  AS = Spannungsquerschnitt
  const stressDiameter_ds = (flankDiameter + innerCoreDiameterBolt) / 2; //Spannungsdurchmesser
  const polarResistancemoment = (Math.PI * (stressDiameter_ds ** 3)) / 16; // pol.Widerstandsmoment(mm³)
  const tensionPermitted = niskaOptions.strengthClass.re * niskaOptions.data.exploitRe; //σ zul = zul.Spannung
  const threadFrictionAngle = Math.atan(niskaOptions.data.frictionCoefShear / Math.cos(niskaOptions.data.flankAngle / 2)); //  ρ '   = Gewindereibwinkel (Grad)


  const preloadNum = tensionPermitted;
  const preloadDen1 = 1 / (stressCrosssection ** 2);
  const preloadDen2 = 0.75 * (flankDiameter ** 2) * (Math.tan(pitchAngle + threadFrictionAngle) ** 2);
  const preloadDen3 = polarResistancemoment ** 2;
  const preloadMax = preloadNum / Math.sqrt(preloadDen1 + (preloadDen2 / preloadDen3)) // Vorspannkraft(N)

  // F_erf                              (niskaOptions.strengthClass.re * stressCrosssection)
  // F Q = Querkraft(N)
  // S R = Rutschsicherheit(-)         //niskaOptions.data.safetyShearDynamic
  // μ T = Haftreibwert Trennfuge(-)   // niskaOptions.data.frictionCoefShear
  // i = Anzahl Trennfugen(-)
  const strengthShearStatic = (preloadMax * niskaOptions.data.frictionCoefShear * 1) / (niskaOptions.data.safetyShearStatic); // 1 = Anzahl Trennfugen
  const strengthShearDynamic = (preloadMax * niskaOptions.data.frictionCoefShear * 1) / (niskaOptions.data.safetyShearDynamic); // 1 = Anzahl Trennfugen

  const strengthAxialStatic = tensionPermitted / niskaOptions.data.safetyAxialStatic;
  const strengthAxialDynamic = tensionPermitted / niskaOptions.data.safetyAxialDynamic;

  niskaOptions.results.boreDiameter.val[index] = checkExponential(boreDiameter, niskaOptions.decimalOpts);
  niskaOptions.results.innerCoreDiameterNut.val[index] = checkExponential(innerCoreDiameterNut, niskaOptions.decimalOpts);
  niskaOptions.results.outerCoreDiameter.val[index] = checkExponential(outerCoreDiameter, niskaOptions.decimalOpts);
  niskaOptions.results.flankDiameter.val[index] = checkExponential(flankDiameter, niskaOptions.decimalOpts);
  niskaOptions.results.stressCrosssection.val[index] = checkExponential(stressCrosssection, niskaOptions.decimalOpts);
  niskaOptions.results.preloadMax.val[index] = checkExponential(preloadMax, {
    decimals: 0
  });
  // niskaOptions.results.strengthAxialStatic.val[index] = checkExponential(strengthAxialStatic, niskaOptions.decimalOpts);
  // niskaOptions.results.strengthAxialDynamic.val[index] = checkExponential(strengthAxialDynamic, niskaOptions.decimalOpts);
  // niskaOptions.results.strengthShearStatic.val[index] = checkExponential(strengthShearStatic, niskaOptions.decimalOpts);
  // niskaOptions.results.strengthShearDynamic.val[index] = checkExponential(strengthShearDynamic, niskaOptions.decimalOpts);
}

function niskaTable() {
  clearTable("idTabHeader_niskaList");

  const rowTh = insertTableRow("idTabHeader_niskaList");
  tableAddCellHeader(rowTh, {
    names: ["niska", "Header"],
    type: "Lbl",
    text: "",
  });
  tableAddCellHeader(rowTh, {
    names: ["niska", "Header", "Handeingabe"],
    type: "Lbl",
    text: `M${niskaOptions.size.val}x${niskaOptions.pitch.val}`,
    colSpan: 2,
    cellStyle: {
      textAlign: "center"
    }
  });
  tableAddCellHeader(rowTh, {
    names: ["niska", "Header", "Normgewinde"],
    type: "Lbl",
    text: `M${niskaOptions.select.size}x${niskaOptions.select.pitch}`,
    colSpan: 2,
    cellStyle: {
      textAlign: "center"
    }
  });


  clearTable("idTabBody_niskaList");
  for (let [key, value] of Object.entries(niskaOptions.results)) {
    const row = insertTableRow("idTabBody_niskaList");
    tableAddCell(row, {
      names: ["niska", "name", key],
      type: "Lbl",
      text: value.name,
      createCellClass: ["clTab_borderThinRight"],
      cellStyle: {
        textAlign: "left"
      }
    });
    tableAddCell(row, {
      names: ["niska", "val", key],
      type: "Lbl",
      text: value.val[0],
      cellStyle: {
        textAlign: "right"
      },
      copy: true
    });
    tableAddCell(row, {
      names: ["niska", "unit", key],
      type: "Lbl",
      text: value.unit,
      createCellClass: ["clTab_borderThinRight"],
      cellStyle: {
        textAlign: "left"
      }
    });
    tableAddCell(row, {
      names: ["niska", "val", key],
      type: "Lbl",
      text: value.val[1],
      cellStyle: {
        textAlign: "right"
      },
      copy: true
    });
    tableAddCell(row, {
      names: ["niska", "unit", key],
      type: "Lbl",
      text: value.unit,
      cellStyle: {
        textAlign: "left"
      }
    });
  };
}