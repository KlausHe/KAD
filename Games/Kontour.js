// https://personal.math.ubc.ca/~israel/m103/mercator/mercator.html
// https://gist.github.com/gr8bit/172584afeb738fd864d572b7cfbcc14d
// https://developers.google.com/maps/documentation/javascript/examples/map-projection-simple#maps_map_projection_simple-javascript

import { Data_GetCountriesByProperty, Data_GetReducedCountryList } from "../KadData/KadData_Countries.js";
import { Data_CountryOutlines } from "../KadData/KadData_CountryBoundaries.js";
import { initEL, KadArray, KadDOM, KadInteraction, KadLog, KadRandom, KadValue } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";
import { globalValues } from "../Settings/General.js";

const factor = 1.5;
const kontourOptions = {
  get canvas() {
    return { w: globalValues.mediaSizes.canvasSize.w * factor, h: (globalValues.mediaSizes.canvasSize.h / kontourOptions.projectionRatio) * factor };
  },
  detailledData: null,
  gameRunning: false,
  streak: 0,
  guessCount: 0,
  guessCountMax: 3,
  points: 0,
  bordersActive: true,
  availableCCA3List: [],
  current: null,
  nameList: Data_GetReducedCountryList(["cca3", "nameDECommon"]),
  projectionIndex: 1,
  projections: [
    {
      name: "Gall-Peterson",
      ratio: 2,
      projection(lon, latRaw, mapWidth, mapHeight) {
        const lat = limitLatitude(latRaw);
        const latRadians = (lat * Math.PI) / 180;
        const x = mapWidth * (0.5 + lon / 360);
        const y = mapHeight * (0.5 - 0.5 * Math.sin(latRadians));
        return { x, y };
      },
    },
    {
      name: "Robinson",
      ratio: 1 / 0.507188,
      projection(lon, latRaw, mapWidth, mapHeight) {
        const lat = limitLatitude(latRaw);
        const robinsonAA = [0.8487, 0.84751182, 0.84479598, 0.840213, 0.83359314, 0.8257851, 0.814752, 0.80006949, 0.78216192, 0.76060494, 0.73658673, 0.7086645, 0.67777182, 0.64475739, 0.60987582, 0.57134484, 0.52729731, 0.48562614, 0.45167814];
        const robinsonBB = [0.0, 0.0838426, 0.1676852, 0.2515278, 0.3353704, 0.419213, 0.5030556, 0.5868982, 0.67047034, 0.75336633, 0.83518048, 0.91537187, 0.99339958, 1.06872269, 1.14066505, 1.20841528, 1.27035062, 1.31998003, 1.3523];

        // Robinson's latitude interpolation points are in 5-degree-steps
        const latitudeAbs = Math.abs(lat);
        const latitudeStepFloor = Math.floor(latitudeAbs / 5);
        const latitudeStepCeil = Math.ceil(latitudeAbs / 5);
        // calc interpolation factor (0<=to <1) between two steps
        const latitudeInterpolation = (latitudeAbs - latitudeStepFloor * 5) / 5;

        // interpolate robinson table values
        const AA = robinsonAA[latitudeStepFloor] + (robinsonAA[latitudeStepCeil] - robinsonAA[latitudeStepFloor]) * latitudeInterpolation;
        const BB = robinsonBB[latitudeStepFloor] + (robinsonBB[latitudeStepCeil] - robinsonBB[latitudeStepFloor]) * latitudeInterpolation;

        const widthFactor = mapWidth / 5.332539370203315; // mapWidth / (2 * Math.PI * 0.8487)
        const latitudeSign = Math.sign(lat) || 1;
        const relativeX = (widthFactor * AA * lon * Math.PI) / 180;
        const relativeY = widthFactor * BB * latitudeSign;

        const widthHeightRatio = (Math.PI * robinsonAA[0]) / robinsonBB[18];
        const x = mapWidth / 2 + relativeX;
        const y = ((mapWidth / widthHeightRatio) * 1) / 2 - relativeY; //

        return { x, y };
      },
    },
    {
      name: "Mercator",
      ratio: 1,
      projection(lon, latRaw, mapWidth, mapHeight) {
        KadLog.errorChecked(!mapWidth || !mapHeight, "Mapsize not defined!");
        // get x
        const x = ((lon + 180) / 360) * mapWidth;
        // get y value
        const lat = limitLatitude(latRaw);
        const latRad = (lat * Math.PI) / 180;
        const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
        const y = mapHeight / 2 - (mapWidth * mercN) / (2 * Math.PI);
        return { x, y };
      },
    },
  ],
  projection(...args) {
    return kontourOptions.projections[kontourOptions.projectionIndex].projection(...args);
  },
  get projectionRatio() {
    return kontourOptions.projections[kontourOptions.projectionIndex].ratio;
  },
  currentQuestionset: null,
  outlinesCCA3: Data_CountryOutlines.map((item) => item.cca3),
  questionSets: {
    get "Unabhängige Länder"() {
      let array = Data_GetCountriesByProperty({ independent: true });
      return filterCountries(array);
    },
    get "Abhängige Länder"() {
      let array = Data_GetCountriesByProperty({ independent: false });
      return filterCountries(array);
    },
    get Afrika() {
      let array = Data_GetCountriesByProperty({ continents: "Africa" });
      return filterCountries(array);
    },
    get Amerika() {
      let array = Data_GetCountriesByProperty({ region: "Americas" });
      return filterCountries(array);
    },
    get Asien() {
      let array = Data_GetCountriesByProperty({ continents: "Asia" });
      return filterCountries(array);
    },
    get Europa() {
      let array = Data_GetCountriesByProperty({ continents: "Europe" });
      return filterCountries(array);
    },
    get Ozeanien() {
      let array = Data_GetCountriesByProperty({ continents: "Oceania" });
      return filterCountries(array);
    },
  },
};

function limitLatitude(lat) {
  const maxLat = 85.051129;
  return KadValue.constrain(lat, -maxLat, maxLat);
}

function filterCountries(array) {
  let data = [];
  for (let obj of array) {
    if (kontourOptions.outlinesCCA3.includes(obj.cca3)) {
      data.push(obj);
    }
  }
  return data;
}

initEL({ id: idBtn_kontourStart, fn: kontourStart, resetValue: "Start" });
initEL({ id: idCb_kontourBorders, fn: kontourBorders, resetValue: true });
initEL({
  id: idSel_kontourProjection,
  fn: kontourProjection,
  selStartIndex: 1,
  selList: kontourOptions.projections.map((item, index) => [item.name, index]),
});
initEL({
  id: idSel_kontourQuestionSet,
  fn: kontourQuestionSet,
  selStartIndex: 1,
  selList: Object.keys(kontourOptions.questionSets).map((item) => [item]),
});
initEL({
  id: idVin_kontourInput,
  action: "change",
  fn: kontourInput,
  resetValue: "Guess the Country",
  dbList: kontourOptions.nameList.map((item) => item.nameDECommon).sort(),
});

export function clear_cl_Kontour() {
  kontourOptions.gameRunning = false;
  idVin_kontourInput.KadReset();
  kontourOptions.bordersActive = idCb_kontourBorders.KadReset();
  kontourOptions.projectionIndex = idSel_kontourProjection.KadReset({ selStartIndex: KadRandom.randomIndex(kontourOptions.projections) });
  idSel_kontourQuestionSet.KadReset({ selStartIndex: KadRandom.randomIndex(kontourOptions.questionSets) });
  kontourRestart();
  KadInteraction.removeContextmenu(idCanv_kontour);
}

export function canvas_cl_Kontour() {
  caKO.resizeCanvas(kontourOptions.canvas.w, kontourOptions.canvas.h);
  caKO.redraw();
}
function kontourRestart() {
  kontourEnableInputs();
  kontourOptions.streak = 0;
  kontourOptions.points = 0;
  idVin_kontourInput.KadReset();
  kontourOptions.bordersActive = idCb_kontourBorders.KadGet();
  kontourOptions.projectionIndex = idSel_kontourProjection.KadGet();
  const questionSetsName = idSel_kontourQuestionSet.KadGet({ textContent: true });
  kontourOptions.currentQuestionset = kontourOptions.questionSets[questionSetsName];
  kontourOptions.availableCCA3List = KadRandom.shuffleData(kontourOptions.currentQuestionset.map((item) => item.cca3));
  kontourOptions.current = null;
  caKO.redraw();
}

function kontourEnableInputs() {
  const state = !kontourOptions.gameRunning;
  idBtn_kontourStart.textContent = state ? "Start" : "Stop";
  KadDOM.enableBtn("idCb_kontourBorders", state);
  KadDOM.enableBtn("idSel_kontourProjection", state);
  KadDOM.enableBtn("idSel_kontourQuestionSet", state);
}

function kontourStart() {
  kontourOptions.gameRunning = !kontourOptions.gameRunning;
  kontourEnableInputs();
  if (!kontourOptions.gameRunning) return;
  kontourRestart();
  kontourGetNewCountry();
  kontourUpdateOutput();
}

function kontourBorders() {
  kontourOptions.bordersActive = idCb_kontourBorders.KadGet();
  caKO.redraw();
  if (kontourOptions.current != null) {
    kontourDrawCloseup();
  }
}

function kontourProjection() {
  kontourOptions.projectionIndex = idSel_kontourProjection.KadGet();
  canvas_cl_Kontour();
  caKO.redraw();
}

function kontourQuestionSet() {
  const objName = idSel_kontourQuestionSet.KadGet({ textContent: true });
  kontourOptions.currentQuestionset = kontourOptions.questionSets[objName];
}

function kontourGetNewCountry() {
  kontourOptions.guessCount = 0;
  kontourOptions.availableCCA3List.splice(kontourOptions.current, 1);
  if (kontourOptions.availableCCA3List.length === 0) return;
  kontourOptions.current = kontourOptions.availableCCA3List[0];
  caKO.redraw();
  kontourDrawCloseup();
}

function kontourInput() {
  if (kontourOptions.current == null) return;
  const input = idVin_kontourInput.KadGet();
  idVin_kontourInput.KadReset({ resetValue: input });

  const obj = kontourOptions.nameList.find((item) => item.nameDECommon.toLowerCase() == input.toLowerCase());
  if (obj == undefined) return;
  const answerIsCorrect = obj.cca3 == kontourOptions.current;

  if (answerIsCorrect) {
    kontourOptions.streak++;
    kontourOptions.points += kontourOptions.guessCountMax + 1 - kontourOptions.guessCount;
    kontourGetNewCountry();
  } else {
    kontourOptions.guessCount++;
  }

  if (kontourOptions.guessCount == kontourOptions.guessCountMax) {
    kontourGameOver();
  } else if (kontourOptions.availableCCA3List.length == 1 && answerIsCorrect) {
    kontourGameWon();
  } else {
    kontourUpdateOutput();
  }
}

function kontourUpdateOutput() {
  const lives = ["III", "II", "I"];
  idLbl_kontourStreak.innerHTML = `Punkte: ${kontourOptions.points}<br>Versuche: ${lives[kontourOptions.guessCount]}`;
}

function kontourGameOver() {
  idLbl_kontourStreak.innerHTML = `Game Over!<br>Punkte: ${kontourOptions.points}`;
  kontourOptions.guessCount = 0;
  const obj = kontourOptions.nameList.find((item) => item.cca3 == kontourOptions.current);
  caKO.textAlign(caKO.CENTER, caKO.CENTER);
  caKO.stroke(0);
  caKO.strokeWeight(1);
  caKO.textSize(24);
  caKO.text(obj.nameDECommon, kontourOptions.canvas.w / 2, kontourOptions.canvas.h / 2);
  kontourOptions.gameRunning = false;
  kontourEnableInputs();
}

function kontourGameWon() {
  idLbl_kontourStreak.innerHTML = `Finished!<br>Punkte: ${kontourOptions.points}`;
  caKO.textAlign(caKO.CENTER, caKO.CENTER);
  caKO.stroke(0);
  caKO.strokeWeight(1);
  caKO.textSize(24);
  caKO.text("Finished!!!", kontourOptions.canvas.w / 2, kontourOptions.canvas.h / 2);
  kontourOptions.gameRunning = false;
  kontourEnableInputs();
}

const caKO = new p5((c) => {
  c.setup = function () {
    c.canv = c.createCanvas(kontourOptions.canvas.w, kontourOptions.canvas.h);
    c.canv.id("canvasKontour");
    c.canv.parent("#idCanv_kontour");
    c.colorMode(c.HSL);
    c.noLoop();
    caKO.curveTightness(0.9);
  };
  c.draw = function () {
    c.clear();
    c.stroke(globalColors.elements.baseColor);
    c.noFill();
    c.strokeWeight(1);
    c.rect(1, 1, kontourOptions.canvas.w - 2, kontourOptions.canvas.h - 2);

    c.stroke(kontourOptions.bordersActive ? globalColors.elements.line : globalColors.elements.baseColor);
    c.strokeWeight(1);

    for (let name of kontourOptions.outlinesCCA3) {
      const pixelData = convertCoordToPixel(Data_CountryOutlines, name, kontourOptions.canvas.w, kontourOptions.canvas.h);
      drawShape(pixelData.points, name, pixelData.offset);
    }
  };
}, "#idCanv_kontour");

async function kontourDrawCloseup() {
  if (kontourOptions.detailledData == null) {
    await import("../KadData/KadData_CountryBoundaries10m.js").then((modules) => {
      kontourOptions.detailledData = modules.Data_CountryOutlinesDetailed;
    });
  }

  let detailData = null;
  if (KadArray.getElementbyKey(kontourOptions.detailledData, "cca3", kontourOptions.current) !== null) {
    detailData = kontourOptions.detailledData;
  } else {
    detailData = Data_CountryOutlines;
  }
  const pixelData = convertCoordToPixel(detailData, kontourOptions.current, kontourOptions.canvas.w, kontourOptions.canvas.h);

  const treshold = 15;
  if (pixelData.width > treshold && pixelData.height > treshold) {
    return;
  }

  const ratio = pixelData.width / pixelData.height;
  let closeupSize = { w: kontourOptions.canvas.h * 0.3 * ratio, h: kontourOptions.canvas.h * 0.3 };
  if (closeupSize.w > kontourOptions.canvas.h * 0.8) {
    closeupSize = { w: kontourOptions.canvas.w * 0.8, h: (kontourOptions.canvas.w * 0.8) / ratio };
  }

  const closeupTop = kontourOptions.canvas.h - closeupSize.h;
  const closeupBottom = kontourOptions.canvas.h;
  const closeupLeft = kontourOptions.canvas.w / 2 - closeupSize.w / 2;
  const closeupRight = kontourOptions.canvas.w / 2 + closeupSize.w / 2;

  caKO.stroke(255);
  caKO.noFill();
  caKO.strokeWeight(1);
  const padding = 5;
  caKO.rect(pixelData.left - padding, pixelData.top - padding, pixelData.width + 2 * padding, pixelData.height + 2 * padding);
  caKO.line(pixelData.left - padding, pixelData.top - padding, closeupLeft - padding, closeupTop - 2 * padding);
  caKO.line(pixelData.left - padding, pixelData.bottom + padding, closeupLeft - padding, closeupBottom);
  caKO.line(pixelData.right + padding, pixelData.top - padding, closeupRight + padding, closeupTop - 2 * padding);
  caKO.line(pixelData.right + padding, pixelData.bottom + padding, closeupRight + padding, closeupBottom);
  caKO.fill(...globalColors.elements.baseColor, 0.5);
  caKO.rect(closeupLeft - padding, closeupTop - 2 * padding, closeupSize.w + 2 * padding, closeupSize.h + 4 * padding);
  const offset = { x: closeupLeft, y: closeupTop - padding };
  const scaleW = (closeupSize.w / pixelData.width) * kontourOptions.canvas.w;
  const scaleH = (closeupSize.h / pixelData.height) * kontourOptions.canvas.h;
  const closeupPixelData = convertCoordToPixel(detailData, kontourOptions.current, scaleW, scaleH);
  drawShape(closeupPixelData.points, kontourOptions.current, offset);
}

function convertCoordToPixel(outlineData, countryCCA3, mapWidth, mapHeight) {
  const pointList = { points: [], top: 2 * mapHeight, right: -2 * mapWidth, bottom: -2 * mapHeight, left: 2 + mapWidth };
  const country = outlineData.find((item) => item.cca3 == countryCCA3);
  for (let poly of country.coordinates) {
    let tempArray = [];
    for (let coords of poly) {
      const xyPoint = kontourOptions.projection(coords[0], coords[1], mapWidth, mapHeight);
      tempArray.push(xyPoint);
      pointList.top = Math.min(xyPoint.y, pointList.top);
      pointList.bottom = Math.max(xyPoint.y, pointList.bottom);
      pointList.left = Math.min(xyPoint.x, pointList.left);
      pointList.right = Math.max(xyPoint.x, pointList.right);
    }
    pointList.points.push(tempArray);
  }

  pointList.width = pointList.right - pointList.left;
  pointList.height = pointList.bottom - pointList.top;
  pointList.offset = { x: pointList.left, y: pointList.top };

  for (let a = 0; a < pointList.points.length; a++) {
    for (let b = 0; b < pointList.points[a].length; b++) {
      pointList.points[a][b].x -= pointList.offset.x;
      pointList.points[a][b].y -= pointList.offset.y;
    }
  }
  return pointList;
}

function drawShape(shapeArray, active, offset) {
  caKO.fill(active == kontourOptions.current ? "red" : globalColors.elements.baseColor);
  for (let poly of shapeArray) {
    caKO.beginShape();
    for (let p of poly) {
      caKO.curveVertex(p.x + offset.x, p.y + offset.y);
    }
    caKO.endShape(caKO.CLOSE);
  }
}
