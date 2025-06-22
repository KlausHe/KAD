import { Data_GetReducedCountryList } from "../KadData/KadData_Countries.js";
import { countryOutlines } from "../KadData/KadData_CountryBoundaries.js";
import { initEL, KadArray, KadInteraction, KadLog, KadRandom } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";
import { globalValues } from "../Settings/General.js";

const kontourOptions = {
  get canvas() {
    return { w: globalValues.mediaSizes.canvasSize.w * 1.4, h: globalValues.mediaSizes.canvasSize.h };
  },
  streak: 0,
  guessCount: 1,
  guessCountMax: 1, //3
  points: 0,
  bordersActive: true,
  availableList: [],
  current: null,
  nameList: Data_GetReducedCountryList(["cca3", "nameDECommon"]),
};

initEL({ id: idBtn_kontourStart, fn: kontourStart, resetValue: "Start" });
initEL({ id: idCb_kontourBorders, fn: kontourBorders, resetValue: true });
initEL({
  id: idVin_kontourInput,
  action: "change",
  fn: kontourInput,
  resetValue: "Guess the Country",
  dbList: kontourOptions.nameList.map((item) => item.nameDECommon).sort(),
});

export function clear_cl_Kontour() {
  kontourReset();
  KadInteraction.removeContextmenu(idCanv_kontour);
}

export function canvas_cl_Kontour() {
  caKO.resizeCanvas(kontourOptions.canvas.w, kontourOptions.canvas.h);
  caKO.redraw();
}
function kontourReset() {
  kontourOptions.streak = 0;
  kontourOptions.points = 0;
  kontourOptions.availableList = KadArray.createIndexedArray(countryOutlines.length);
  idVin_kontourInput.KadReset();
}

function kontourStart() {
  kontourUpdateOutput();
  kontourReset();
  kontourGetNewCountry();
}

function kontourBorders() {
  kontourOptions.bordersActive = idCb_kontourBorders.KadGet();
  caKO.redraw();
  if (kontourOptions.current != null) {
    kontourDrawCloseup();
  }
}
function kontourGetNewCountry() {
  kontourOptions.guessCount = 1;
  kontourOptions.availableList.splice(kontourOptions.current, 1);
  kontourOptions.current = KadRandom.randomObject(kontourOptions.availableList);
  caKO.redraw();
  kontourDrawCloseup();
}

function kontourInput() {
  if (kontourOptions.current == null) return;
  const input = idVin_kontourInput.KadGet();
  idVin_kontourInput.KadReset({ resetValue: input });

  const obj = kontourOptions.nameList.find((item) => item.nameDECommon.toLowerCase() == input.toLowerCase());
  if (obj == undefined) return;

  if (obj.cca3 == countryOutlines[kontourOptions.current].cca3) {
    kontourOptions.streak++;
    kontourOptions.points += 4 - kontourOptions.guessCount;
    kontourGetNewCountry();
  } else {
    kontourOptions.guessCount++;
  }
  if (kontourOptions.guessCount > kontourOptions.guessCountMax) {
    kontourUpdateOutput(true);
    return;
  }
  kontourUpdateOutput();
}

function kontourUpdateOutput(lost = false) {
  if (!lost) {
    const lives = ["III", "II", "I"];
    idLbl_kontourStreak.innerHTML = `Punkte: ${kontourOptions.points}<br>Versuche: ${lives[kontourOptions.guessCount - 1]}`;
  } else {
    idLbl_kontourStreak.innerHTML = `Game Over!<br>Punkte: ${kontourOptions.points}`;
    const obj = kontourOptions.nameList.find((item) => item.cca3 == countryOutlines[kontourOptions.current].cca3);
    caKO.textAlign(caKO.CENTER, caKO.CENTER);
    caKO.stroke(0);
    caKO.strokeWeight(1);
    caKO.textSize(24);
    caKO.text(obj.nameDECommon, kontourOptions.canvas.w / 2, kontourOptions.canvas.h / 2);
  }
}

const caKO = new p5((c) => {
  c.setup = function () {
    c.canv = c.createCanvas(kontourOptions.canvas.w, kontourOptions.canvas.h);
    c.canv.id("canvasKontour");
    c.canv.parent("#idCanv_kontour");
    c.colorMode(c.HSL);
    c.noLoop();
  };
  c.draw = function () {
    c.clear();
    c.stroke(globalColors.elements.baseColor);
    c.noFill();
    c.strokeWeight(1);
    c.rect(1, 1, kontourOptions.canvas.w - 2, kontourOptions.canvas.h - 2);

    c.stroke(kontourOptions.bordersActive ? globalColors.elements.line : globalColors.elements.baseColor);
    c.strokeWeight(1);
    let len = countryOutlines.length;
    for (let i = 0; i < len; i++) {
      const pixelData = convertCoordToPixel(i, kontourOptions.canvas.w, kontourOptions.canvas.h);
      drawShape(pixelData.points, i, pixelData.offset);
    }
  };
}, "#idCanv_kontour");

function kontourDrawCloseup() {
  // caKO.text(countryOutlines[kontourOptions.current].cca3, 10, 10);

  const pixelData = convertCoordToPixel(kontourOptions.current, kontourOptions.canvas.w, kontourOptions.canvas.h);
  const ratio = pixelData.width / pixelData.height;
  const closeupSize = { w: kontourOptions.canvas.h * 0.3 * ratio, h: kontourOptions.canvas.h * 0.3 };

  const closeupTop = kontourOptions.canvas.h - closeupSize.h;
  const closeupLeft = kontourOptions.canvas.w / 2 - closeupSize.w / 2;
  const closeupRight = kontourOptions.canvas.w / 2 + closeupSize.w / 2;

  const treshold = 200; //15;
  if (pixelData.width > treshold && pixelData.height > treshold) {
    return;
  }

  caKO.stroke(255);
  caKO.noFill();
  caKO.strokeWeight(1);
  const padding = 5;
  caKO.rect(pixelData.left - padding, pixelData.top - padding, pixelData.width + 2 * padding, pixelData.height + 2 * padding);
  caKO.line(pixelData.left - padding, pixelData.top - padding, closeupLeft - padding, closeupTop - 2 * padding);
  caKO.line(pixelData.right + padding, pixelData.bottom + padding, closeupRight + padding, closeupTop - 2 * padding);
  caKO.fill(globalColors.elements.baseColor);
  caKO.rect(closeupLeft - padding, closeupTop - 2 * padding, closeupSize.w + 2 * padding, closeupSize.h + 4 * padding);
  const offset = { x: closeupLeft, y: closeupTop - padding };
  const scaleW = (closeupSize.w / pixelData.width) * kontourOptions.canvas.w;
  const scaleH = (closeupSize.h / pixelData.height) * kontourOptions.canvas.h;
  const closeupPixelData = convertCoordToPixel(kontourOptions.current, scaleW, scaleH);
  drawShape(closeupPixelData.points, kontourOptions.current, offset);
}

function convertCoordToPixel(countryIndex, mapWidth, mapHeight) {
  const pointList = { points: [], top: 2 * mapHeight, right: -2 * mapWidth, bottom: -2 * mapHeight, left: 2 + mapWidth };
  for (let poly of countryOutlines[countryIndex].coordinates) {
    let tempArray = [];
    for (let coords of poly) {
      const xyPoint = mercatorProjection(coords[0], coords[1], mapWidth, mapHeight);
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
      caKO.vertex(p.x + offset.x, p.y + offset.y);
    }
    caKO.endShape(caKO.CLOSE);
  }
}

function mercatorProjection(lon, lat, mapWidth, mapHeight) {
  KadLog.errorChecked(!mapWidth || !mapHeight, "Mapsize not defined!");
  // get x
  const x = ((lon + 180) / 360) * mapWidth;
  // get y value
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = mapHeight / 2 - (mapWidth * mercN) / (2 * Math.PI);
  return { x, y };
}
