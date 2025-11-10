import { dbID, dbIDStyle, initEL, KadDOM, KadInteraction, KadValue } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";
import { globalValues } from "../Settings/General.js";

const luasOptions = {
  get canvas() {
    return { w: globalValues.mediaSizes.canvasSize.w * 0.5, h: globalValues.mediaSizes.canvasSize.h * 0.5 };
  },
  radius: 0,
  speedVin: 10,
  speedAngular: null,
  diameterVin: 10,
  speedLinear: null,
  angularVin: 1,
  angularText: null,
  linearText: null,
  state: 0,
  direction: 1,
  setFramerate: 60,
  lastAngle: 0,
  lastFramecount: 0,
};

const Vin_luasVelAngular = initEL({ id: "idVin_luasVelAngular", fn: luasInputChange, resetValue: 10 });
const Vin_luasDiameter = initEL({ id: "idVin_luasDiameter", fn: luasInputChange, resetValue: 10 });
const Sel_luasAngularUnit = initEL({
  id: "idSel_luasAngularUnit",
  fn: luasInputChange,
  selList: [
    ["U/s", 1],
    ["U/min", 60],
  ],
  selStartIndex: 1,
});
const Sel_luasLinearUnit = initEL({
  id: "idSel_luasLinearUnit",
  fn: luasInputChange,
  selList: ["mm", "cm", "dm", "m", "km"],
});
initEL({ id: "idBtn_luasChangeDirection", fn: luasChangeDirection });
initEL({ id: "idBtn_luasChecker", fn: luasStart });
const Lbl_luasResult = initEL({ id: "idLbl_luasResult" });
//Canvas Stuff
export function clear_cl_Luas() {
  KadInteraction.removeContextmenu("idCanv_luas");
  Vin_luasVelAngular.KadReset();
  Vin_luasDiameter.KadReset();

  Sel_luasAngularUnit.KadReset();
  Sel_luasLinearUnit.KadReset();

  luasInputChange();
  luasOptions.radius = luasOptions.canvas.w * 0.5 * 0.9;
  luasOptions.lastAngle = 0;
  caLU.noLoop();
  caLU.redraw();
}
export function canvas_cl_Luas() {
  luasOptions.lastAngle = 0;
  caLU.resizeCanvas(luasOptions.canvas.w, luasOptions.canvas.h);
  caLU.redraw();
}

const caLU = new p5((c) => {
  c.setup = function () {
    c.canv = c.createCanvas(luasOptions.canvas.w, luasOptions.canvas.h);
    c.canv.id("canvasLuas");
    c.canv.parent("#idCanv_luas");
    c.frameRate(luasOptions.setFramerate);
    c.angleMode(c.DEGREES);
    c.colorMode(c.HSL);
    c.strokeWeight(2);
    c.noLoop();
  };

  c.draw = function () {
    c.clear();
    c.stroke(globalColors.elements.line);
    c.push();
    c.translate(luasOptions.canvas.w * 0.5, luasOptions.canvas.h * 0.5);
    c.rotate(270);
    c.noFill();

    c.circle(0, 0, luasOptions.radius * 2);
    c.circle(luasOptions.radius, 0, 4);
    c.circle(0, 0, 4);
    c.circle(luasOptions.radius * c.cos(luasOptions.lastAngle), luasOptions.radius * c.sin(luasOptions.lastAngle), 3);
    c.line(0, 0, luasOptions.radius * c.cos(luasOptions.lastAngle), luasOptions.radius * c.sin(luasOptions.lastAngle));
    c.pop();

    if (c.frameCount - luasOptions.lastFramecount > 10) {
      luasOptions.lastAngle += (luasOptions.speedAngular / c.frameRate()) * luasOptions.direction;
    }
  };
}, "#idCanv_luas");

function luasStart() {
  if (luasOptions.state === 0) {
    // play
    luasOptions.state = 1;
    dbID("idImg_luasChecker").src = KadDOM.getImgPath("tStop");
    luasOptions.lastAngle = 0;
    luasOptions.lastFramecount = caLU.frameCount;
    caLU.loop();
  } else {
    //stop
    luasOptions.state = 0;
    dbID("idImg_luasChecker").src = KadDOM.getImgPath("tPlay");
    caLU.noLoop();
    luasOptions.lastAngle = 0;
    luasOptions.lastFramecount = caLU.frameCount;
  }
}

function luasInputChange() {
  luasOptions.speedVin = Vin_luasVelAngular.KadGet();
  luasOptions.diameterVin = Vin_luasDiameter.KadGet();
  luasOptions.angularVin = Sel_luasAngularUnit.KadGet();
  luasOptions.angularText = Sel_luasAngularUnit.HTML[Sel_luasAngularUnit.HTML.selectedIndex].text;
  luasOptions.linearText = Sel_luasLinearUnit.HTML[Sel_luasLinearUnit.HTML.selectedIndex].text;
  luasOptions.speedAngular = (luasOptions.speedVin * 360) / luasOptions.angularVin;
  luasOptions.speedLinear = luasOptions.speedVin * Math.PI * luasOptions.diameterVin;
  Lbl_luasResult.KadSetHTML(`Linear: ${KadValue.number(luasOptions.speedLinear, { decimals: 3 })} ${luasOptions.angularText.replace("U", luasOptions.linearText)}`);
}

function luasChangeDirection() {
  luasOptions.direction = luasOptions.direction == 1 ? -1 : 1;
  const luas = dbIDStyle("idImg_luasDirection");
  luas.transform = `scaleX(${luasOptions.direction})`;
  luas.webkitTransform = `scaleX(${luasOptions.direction})`;
}
