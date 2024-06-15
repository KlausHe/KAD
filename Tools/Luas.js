import { globalColors } from "../Settings/Color.js";
import { dbID, dbIDStyle, initEL, KadDOM, KadValue } from "../KadUtils/KadUtils.js";
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

initEL({ id: idVin_luasVelAngular, fn: luasInputChange, resetValue: 10 });
initEL({ id: idVin_luasDiameter, fn: luasInputChange, resetValue: 10 });
initEL({
	id: idSel_luasAngularUnit,
	fn: luasInputChange,
	selList: [
		["U/s", 1],
		["U/min", 60],
	],
	selStartIndex: 1,
});
initEL({
	id: idSel_luasLinearUnit,
	fn: luasInputChange,
	selList: ["mm", "cm", "dm", "m", "km"],
});
initEL({ id: idBtn_luasChangeDirection, fn: luasChangeDirection });
initEL({ id: idBtn_luasChecker, fn: luasStart });
//Canvas Stuff
export function clear_cl_Luas() {
	idVin_luasVelAngular.KadReset();
	idVin_luasDiameter.KadReset();

	idSel_luasAngularUnit.KadReset();
	idSel_luasLinearUnit.KadReset();

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
		caLU.clear();
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
	luasOptions.speedVin = idVin_luasVelAngular.KadGet();
	luasOptions.diameterVin = idVin_luasDiameter.KadGet();
	luasOptions.angularVin = Number(idSel_luasAngularUnit.value);
	luasOptions.angularText = idSel_luasAngularUnit[idSel_luasAngularUnit.selectedIndex].text;
	luasOptions.linearText = idSel_luasLinearUnit[idSel_luasLinearUnit.selectedIndex].text;
	luasOptions.speedAngular = (luasOptions.speedVin * 360) / luasOptions.angularVin;
	luasOptions.speedLinear = luasOptions.speedVin * Math.PI * luasOptions.diameterVin;
	dbID("idLbl_luasResult").innerHTML = `Linear: ${KadValue.number(luasOptions.speedLinear, { decimals: 3 })} ${luasOptions.angularText.replace("U", luasOptions.linearText)}`;
}

function luasChangeDirection() {
	luasOptions.direction = luasOptions.direction == 1 ? -1 : 1;
	const luas = dbIDStyle("idImg_luasDirection");
	luas.transform = `scaleX(${luasOptions.direction})`;
	luas.webkitTransform = `scaleX(${luasOptions.direction})`;
}
