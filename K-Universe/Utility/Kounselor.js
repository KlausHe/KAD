const kounselorOptions = {
  curType: null,
  opts: ["RAL", "Name", "RGB", "HSL", "HEX"],
  values: [null, null, null, null, null],
  contrastGood: "#FFFFFF",
  contrastBad: "#000000"
}

function clear_cl_Kounselor() {
  for (const name of kounselorOptions.opts) {
    resetInput(`idVin_kounselor${name}`, name)
  }
  kounselorOptions.curType = 3;
  kounselorOptions.values = [null, null, colHSLtoRGB(globalValues.colors.elements.baseColor), globalValues.colors.elements.baseColor, `#${colHSLtoHEX(globalValues.colors.elements.baseColor).toUpperCase()}`];
  kounselorSetResults()
};

function kounselorPopulateDatalists(obj) {
  const type = obj.dataset.type
  if (dbID(`idDlist_kounselor${type}`).childNodes.length > 1) return
  for (const data of Data_Kounselor) {
    const opt = document.createElement("OPTION");
    if (Object.keys(Data_Kounselor[0]).includes(type)) {
      opt.textContent = data[type];
    } else { // not inside list
      const text = window[`colRGBto${type}`](data.RGB, {
        type: type.toLowerCase()
      });
      opt.textContent = text;
    }
    dbID(`idDlist_kounselor${type}`).appendChild(opt);
  }
}

function kounselorInput(obj = null) {
  if (obj === null) {
    kounselorSetResults()
    return;
  }
  let input = obj.value.trim();
  if (input === "") return
  kounselorOptions.curType = kounselorOptions.opts.indexOf(obj.dataset.type);
  let data = null;
  let rgb = null;
  if (kounselorOptions.curType == 0 || kounselorOptions.curType == 1) { // get Values from Data
    data = Data_Kounselor.filter((o) => {
      return (o[obj.dataset.type] == input)
    })[0];
    if (data === null) return;
    rgb = data.RGB;
  } else if (kounselorOptions.curType == 2) { //RGB
    input = input.replace(/\s/g, "");
    input = input.split(/,|-|\s/g);
    rgb = input.map(n => Number(n))
    data = kounselorSearchRAL(rgb);
  } else if (kounselorOptions.curType == 3) { //HSL
    input = input.replace(/%/g, "");
    input = input.split(/,|-|\s/g);
    input = input.map(n => Number(n))
    rgb = colHSLtoRGB(input);
    data = kounselorSearchRAL(rgb);
  } else if (kounselorOptions.curType == 4) { //HEX
    if (input.charAt(0) != "#") input = `#${input}`
    rgb = colHEXtoRGB(input);
    data = kounselorSearchRAL(rgb);
  }

  //set the Value
  kounselorOptions.values = [(data === null) ? null : data.RAL, (data === null) ? null : data.Name, rgb, colRGBtoHSL(rgb), `#${colRGBtoHEX(rgb).toUpperCase()}`];
  for (let i = 0; i < kounselorOptions.opts.length; i++) {
    if (i != kounselorOptions.curType) {
      resetInput(`idVin_kounselor${kounselorOptions.opts[i]}`, kounselorOptions.values[i])
    };
  }
  kounselorSetResults();
}

function kounselorSearchRAL(input) {
  const data = Data_Kounselor.filter((o) => {
    const d = 2; // Abweichung bei der Berechnung von RGB / HSL, da dies nicht standardisiert zu sein scheint
    return (
      (o.RGB[0] >= input[0] - d && o.RGB[0] <= input[0] + d) &&
      (o.RGB[0] >= input[1] - d && o.RGB[1] <= input[1] + d) &&
      (o.RGB[0] >= input[2] - d && o.RGB[2] <= input[2] + d)
    )
  })[0];
  if (data === undefined) return null; //check if data is null or undefined-->return without doing things
  return data;
}

function kounselorSetResults() {
  kounselorOptions.contrastGood = colStateToHSL(kounselorOptions.values[3]);
  kounselorOptions.contrastBad = colStateToHSL(kounselorOptions.values[3], true);
  dbIDStyle("idLbl_kounselorOutputA").background = colorReturnFormat(kounselorOptions.values[3], {
    type: "hsl",
    text: true
  });
  dbIDStyle("idLbl_kounselorOutputB").background = colorReturnFormat(kounselorOptions.values[3], {
    type: "hsl",
    text: true
  });
  dbIDStyle("idLbl_kounselorOutputA").color = colorReturnFormat(kounselorOptions.contrastGood, {
    type: "hsl",
    text: true
  });
  dbIDStyle("idLbl_kounselorOutputB").color = colorReturnFormat(kounselorOptions.contrastBad, {
    type: "hsl",
    text: true
  });
}
