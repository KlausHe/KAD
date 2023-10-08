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

//Canvas Stuff
function clear_cl_Luas() {
	KadUtils.DOM.resetInput("idVin_luasVelAngular", 10);
	KadUtils.DOM.resetInput("idVin_luasDiameter", 10);

	KadUtils.dbID("idSel_luasAngularUnit").options[0] = new Option("U/s", 1, false); // text, value
	KadUtils.dbID("idSel_luasAngularUnit").options[1] = new Option("U/min", 60, false, true); // text, value
	KadUtils.dbID("idSel_luasLinearUnit").options[0] = new Option("mm", 1, false, true); // text, value
	KadUtils.dbID("idSel_luasLinearUnit").options[1] = new Option("cm", 1, false); // text, value
	KadUtils.dbID("idSel_luasLinearUnit").options[2] = new Option("dm", 1, false); // text, value
	KadUtils.dbID("idSel_luasLinearUnit").options[3] = new Option("m", 1, false); // text, value
	KadUtils.dbID("idSel_luasLinearUnit").options[4] = new Option("km", 1, false); // text, value
	luasInputChange();
	luasOptions.radius = luasOptions.canvas.w * 0.5 * 0.9;
	luasOptions.lastAngle = 0;
	caLU.noLoop();
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
		c.stroke(globalValues.colors.elements.line);
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

function luasResize() {
	caLU.resizeCanvas(luasOptions.canvas.w, luasOptions.canvas.h);
}

function luasStart() {
	if (luasOptions.state === 0) {
		// play
		luasOptions.state = 1;
		KadUtils.dbID("idImg_luasChecker").src = KadUtils.DOM.getImgPath("tStop");
		luasOptions.lastAngle = 0;
		luasOptions.lastFramecount = caLU.frameCount;
		caLU.loop();
	} else {
		//stop
		luasOptions.state = 0;
		KadUtils.dbID("idImg_luasChecker").src = KadUtils.DOM.getImgPath("tPlay");
		caLU.noLoop();
		luasOptions.lastAngle = 0;
		luasOptions.lastFramecount = caLU.frameCount;
	}
}

function luasInputChange() {
	luasOptions.speedVin = KadUtils.DOM.numberFromInput("idVin_luasVelAngular");
	luasOptions.diameterVin = KadUtils.DOM.numberFromInput("idVin_luasDiameter");
	luasOptions.angularVin = Number(KadUtils.dbID("idSel_luasAngularUnit").value);
	luasOptions.angularText = KadUtils.dbID("idSel_luasAngularUnit").options[KadUtils.dbID("idSel_luasAngularUnit").selectedIndex].textContent;
	luasOptions.linearText = KadUtils.dbID("idSel_luasLinearUnit").options[KadUtils.dbID("idSel_luasLinearUnit").selectedIndex].textContent;
	luasOptions.speedAngular = (luasOptions.speedVin * 360) / luasOptions.angularVin;
	luasOptions.speedLinear = luasOptions.speedVin * Math.PI * luasOptions.diameterVin;

	KadUtils.dbID("idLbl_luasResult").innerHTML = `Linear: ${KadUtils.Value.number(luasOptions.speedLinear, { decimals: 3 })} ${luasOptions.linearText}/${luasOptions.angularText.replace("U/", "")}`;
}

function luasChangeDirection() {
	luasOptions.direction = luasOptions.direction == 1 ? -1 : 1;
	const luas = KadUtils.dbIDStyle("idImg_luasDirection");
	luas.transform = `scaleX(${luasOptions.direction})`;
	luas.webkitTransform = `scaleX(${luasOptions.direction})`;
}
