const luasOptions = {
	width: 200,
	height: 200,
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
	resetInput("idVin_luasVelAngular", 10);
	resetInput("idVin_luasDiameter", 10);

	dbID("idSel_luasAngularUnit").options[0] = new Option("U/s", 1, false); // text, value
	dbID("idSel_luasAngularUnit").options[1] = new Option("U/min", 60, false, true); // text, value
	dbID("idSel_luasLinearUnit").options[0] = new Option("mm", 1, false, true); // text, value
	dbID("idSel_luasLinearUnit").options[1] = new Option("cm", 1, false); // text, value
	dbID("idSel_luasLinearUnit").options[2] = new Option("dm", 1, false); // text, value
	dbID("idSel_luasLinearUnit").options[3] = new Option("m", 1, false); // text, value
	dbID("idSel_luasLinearUnit").options[4] = new Option("km", 1, false); // text, value
	luasInputChange();
	luasOptions.lastAngle = 0;
	caLU.noLoop();
	caLU.redraw();
}

const caLU = new p5((c) => {
	c.setup = function () {
		c.canv = c.createCanvas(luasOptions.width, luasOptions.height);
		c.canv.id("canvasLuas");
		c.canv.parent("#idCanv_luas");
		c.frameRate(luasOptions.setFramerate);
		c.angleMode(c.DEGREES);
		c.colorMode(c.HSL);
		c.noLoop();
	};

	c.draw = function () {
		const r = luasOptions.width / 2 - 10;
		caLU.clear();
		c.strokeWeight(2);
		c.stroke(globalValues.colors.elements.line);
		c.push();
		c.translate(luasOptions.width / 2, luasOptions.height / 2);
		c.rotate(270);
		c.noFill();

		c.circle(0, 0, r * 2);
		c.circle(r, 0, 4);
		c.circle(0, 0, 4);
		c.circle(r * c.cos(luasOptions.lastAngle), r * c.sin(luasOptions.lastAngle), 3);
		c.line(0, 0, r * c.cos(luasOptions.lastAngle), r * c.sin(luasOptions.lastAngle));
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
		dbID("idImg_luasChecker").src = imgPath("tStop");
		luasOptions.lastAngle = 0;
		luasOptions.lastFramecount = caLU.frameCount;
		caLU.loop();
	} else {
		//stop
		luasOptions.state = 0;
		dbID("idImg_luasChecker").src = imgPath("tPlay");
		caLU.noLoop();
		luasOptions.lastAngle = 0;
		luasOptions.lastFramecount = caLU.frameCount;
	}
}

function luasInputChange() {
	luasOptions.speedVin = numberFromInput("idVin_luasVelAngular");
	luasOptions.diameterVin = numberFromInput("idVin_luasDiameter");
	luasOptions.angularVin = Number(dbID("idSel_luasAngularUnit").value);
	luasOptions.angularText = dbID("idSel_luasAngularUnit").options[dbID("idSel_luasAngularUnit").selectedIndex].textContent;
	luasOptions.linearText = dbID("idSel_luasLinearUnit").options[dbID("idSel_luasLinearUnit").selectedIndex].textContent;

	luasOptions.speedAngular = (luasOptions.speedVin * 360) / luasOptions.angularVin;
	luasOptions.speedLinear = luasOptions.speedVin * Math.PI * luasOptions.diameterVin;

	dbID("idLbl_luasResult").innerHTML = `Linear: ${checkExponential(luasOptions.speedLinear, { decimals: 3, expoThreashold: 6 })} ${
		luasOptions.linearText
	}/${luasOptions.angularText.replace("U/", "")}`;
	dataForLabel("idLbl_luasResult", luasOptions.speedLinear);
}

function luasChangeDirection() {
	luasOptions.direction = luasOptions.direction == 1 ? -1 : 1;
	const luas = dbIDStyle("idImg_luasDirection");
	luas.transform = `scaleX(${luasOptions.direction})`;
	luas.webkitTransform = `scaleX(${luasOptions.direction})`;
}
