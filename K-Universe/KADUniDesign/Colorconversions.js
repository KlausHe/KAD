//colorReturnFormat
function colorReturnFormat(arr, opts = {
  alpha: null,
  type: "", //hsl, rgb, hex
  text: false
}) {
  let colRet = arr;
  if (opts === null) {
    return colRet;
  }
  if (opts.type == "") {
    return colRet;
  }
  let colText = "";
  switch (opts.type) {
    case "hsl":
      colText = `${colRet[0]} ${colRet[1]}% ${colRet[2]}%`
      if (opts.alpha != null) colText = `${colText} / ${opts.alpha}`;
      if (opts.text) colText = `hsl(${colText})`;
      break;
    case "rgb":
      colText = `${colRet[0]} ${colRet[1]} ${colRet[2]}`
      if (opts.alpha != null) colText = `${colText} / ${opts.alpha}`;
      if (opts.text) colText = `rgb(${colText})`;
      break;
    case "hex":
      colText = `#${arr.toUpperCase()}`;
      break;
  }
  return colText;
}

function colHSLtoRGB(_hsl, opts) {
  let hsl = {
    h: _hsl[0] / 60,
    s: _hsl[1] / 100,
    l: _hsl[2] / 100
  }
  let rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  const C = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
  const X = C * (1 - Math.abs(hsl.h % 2 - 1));
  if (hsl.h >= 0 && hsl.h < 1) {
    rgb.r = C;
    rgb.g = X;
  } else if (hsl.h >= 1 && hsl.h < 2) {
    rgb.r = X;
    rgb.g = C;
  } else if (hsl.h >= 2 && hsl.h < 3) {
    rgb.g = C;
    rgb.b = X;
  } else if (hsl.h >= 3 && hsl.h < 4) {
    rgb.g = X;
    rgb.b = C;
  } else if (hsl.h >= 4 && hsl.h < 5) {
    rgb.r = X;
    rgb.b = C;
  } else {
    rgb.r = C;
    rgb.b = X;
  }
  const m = hsl.l - C / 2;

  rgb.r += m;
  rgb.g += m;
  rgb.b += m;
  rgb.r = Math.round(rgb.r * 255)
  rgb.g = Math.round(rgb.g * 255)
  rgb.b = Math.round(rgb.b * 255)

  return colorReturnFormat(Object.values(rgb), opts);
}

function colHSLtoHEX(hsl, opts) {
  const rgb = colHSLtoRGB(hsl);
  const hex = colRGBtoHEX(rgb);
  return colorReturnFormat(hex, opts);
}

function colRGBtoHSL(_rgb, opts) {
  const rgb = {
    r: _rgb[0] / 255,
    g: _rgb[1] / 255,
    b: _rgb[2] / 255
  };
  const ma = Math.max(...Object.values(rgb));
  const mi = Math.min(...Object.values(rgb));

  let hsl = {
    h: 0,
    s: 0,
    l: ((ma + mi) / 2)
  }
  if (ma != mi) {
    const d = ma - mi;
    hsl.s = (hsl.l > 0.5) ? (d / (2 - ma - mi)) : (d / (ma + mi));
    if (rgb.r == ma) {
      hsl.h = (rgb.g - rgb.b) / d;
    } else if (rgb.g == ma) {
      hsl.h = 2 + (rgb.b - rgb.r) / d;
    } else if (rgb.b == ma) {
      hsl.h = 4 + (rgb.r - rgb.g) / d;
    }
    hsl.h = Math.min(hsl.h * 60, 360);
    if (hsl.h < 0) hsl.h += 360;
  }
  hsl.h = Math.round(hsl.h);
  hsl.s = Math.round(hsl.s * 100);
  hsl.l = Math.round(hsl.l * 100);
  return colorReturnFormat(Object.values(hsl), opts);
};


//-------------------
function colRGBtoHEX(rgb, opts = null) {
  let arr = [];
  if (rgb.length === 1) {
    arr = [rgb[0], rgb[0], rgb[0]];
  } else {
    arr = [...rgb];
  }
  if (opts != null && opts.alpha != null) {
    arr.push(alpha);
  }
  let hex = "";
  arr.forEach(c => {
    let tempHex = Number(c).toString(16);
    hex += (tempHex.length < 2) ? `0${tempHex}` : tempHex;
  })
  return colorReturnFormat(hex, opts);
};

function colHEXtoRGB(col, opts) {
  let rgb = [];
  const hex = (col.charAt(0) === '#') ? col.substring(1, 7) : col;
  rgb[0] = parseInt(hex.substring(0, 2), 16); // hexToR
  rgb[1] = parseInt(hex.substring(2, 4), 16); // hexToG
  rgb[2] = parseInt(hex.substring(4, 6), 16); // hexToB
  return colorReturnFormat(rgb, opts);
};

function colHEXtoHSL(hex, opts) {
  const rgb = colHEXtoRGB(hex)
  const hsl = colRGBtoHSL(rgb);
  return colorReturnFormat(hsl, opts);
}


// ------------------------------------------------------- get States from colors -------------------------------------------------------
function colStateHSL(hsl, invert = false) {
  const rgb = colHSLtoRGB(hsl)
  const output = colStateRGB(rgb, invert);
  return Number(output);
};

function colStateRGB(rgb, invert = false) {
  let uicolors = [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
  let c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  let L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  const output = invert ? !(L < 0.179) : (L < 0.179);
  return Number(output);
};

function colStateHEX(hex, invert = false) {
  const rgb = colHSLtoRGB(hex)
  const output = colStateRGB(rgb, invert);
  return Number(output);
};

// ------------------------------------------------------- get Colors from State -------------------------------------------------------
function colStateToHSL(hsl, invert = false) {
  let state = colStateHSL(hsl, invert)
  let arr = [0, 0, state * 100]
  return colorReturnFormat(arr)
}

function colStateToRGB(rgb, invert = false) {
  let state = colStateRGB(rgb, invert)
  let arr = [state * 255, state * 255, state * 255]
  return colorReturnFormat(arr)
}

function colStateToHEX(hex, invert = false) {
  let state = colStateHEX(hex, invert)
  let arr = [state * 255, state * 255, state * 255]
  return colorReturnFormat(arr)
}
