const pythoOptions = {
	p5Loaded: false,
	width: 180,
	height: 140,
	margin: 20,
	raduisRightAngle: 25,
	greekFont: "Arial",
	greekAlpha: "\u03B1",
	greekBeta: "\u03B2",
	inputState: [0, 1],
	vals: [],
	valsOrig: [3, 4],
	errorShown: false,
};

function clear_cl_Pythagoras() {
	pythoOptions.vals = [];
	for (let i = 0; i < 5; i++) {
		const val = pythoOptions.inputState.includes(i) ? pythoOptions.valsOrig[i] : "";
		resetInput(`idVin_Pytho_${i}`, val);
	}
	pythoOptions.inputState = [0, 1];
	pythoShowError();
	pythoCalc();
}

const caPY = new p5((c) => {
	c.setup = function () {
		c.canv = c.createCanvas(pythoOptions.width, pythoOptions.height);
		c.canv.id("canvasPytho");
		c.canv.parent("#idCanv_pytho");
		c.noLoop();
		c.colorMode(c.HSL);
		pythoOptions.p5Loaded = true;
	};
}, "#idCanv_pytho");

function pythoResize() {
	caPY.resizeCanvas(pythoOptions.width, pythoOptions.height);
}

function pythoTriHypo(a, b) {
	return caPY.sqrt(a ** 2 + b ** 2);
}

function pythoTriLength(c, n) {
	return caPY.sqrt(c ** 2 - n ** 2);
}

function pythoMinusNinety(angle) {
	return caPY.HALF_PI - angle;
}

function pythoShowError(text = null) {
	pythoOptions.errorShown = text === null ? true : false;
	if (pythoOptions.errorShown) {
		dbIDStyle("idDiv_pythagorasInfo").display = "none";
	} else {
		dbID("idLbl_pythagorasInfo").textContent = text;
		dbIDStyle("idDiv_pythagorasInfo").display = "initial";
	}
}

function pythoNewEntry(obj) {
	const id = obj.id;
	const i = Number(id.slice(-1));
	if (!pythoOptions.inputState.includes(i)) {
		pythoOptions.inputState.unshift(i);
		pythoOptions.inputState.pop();
	}
	pythoCalc();
}

function pythoCalc() {
	pythoShowError();
	pythoOptions.vals = [];
	const A = pythoOptions.inputState[0];
	const B = pythoOptions.inputState[1];
	pythoOptions.vals[A] = numberFromInput(`idVin_Pytho_${A}`);
	pythoOptions.vals[B] = numberFromInput(`idVin_Pytho_${B}`);

	if (A > 2) pythoOptions.vals[A] *= caPY.PI / 180; //convert dregrees to radians
	if (B > 2) pythoOptions.vals[B] *= caPY.PI / 180; //convert dregrees to radians
	const arr = deepClone(pythoOptions.inputState).sort();
	switch (arr.join("")) {
		case "01": //a & b
			pythoOptions.vals[2] = pythoTriHypo(pythoOptions.vals[0], pythoOptions.vals[1]); //c
			pythoOptions.vals[3] = caPY.asin(pythoOptions.vals[0] / pythoOptions.vals[2]);
			pythoOptions.vals[4] = pythoMinusNinety(pythoOptions.vals[3]); //Beta = 90-Alpha
			break;
		case "02": //a & c
			if (pythoOptions.vals[2] <= pythoOptions.vals[0]) {
				pythoShowError("Hypotenuse ist zu klein!");
				return;
			}
			pythoOptions.vals[1] = pythoTriLength(pythoOptions.vals[2], pythoOptions.vals[0]); //c
			pythoOptions.vals[4] = caPY.asin(pythoOptions.vals[1] / pythoOptions.vals[2]);
			pythoOptions.vals[3] = pythoMinusNinety(pythoOptions.vals[4]); //Beta = 90-Alpha
			break;
		case "12": //b & c
			if (pythoOptions.vals[2] <= pythoOptions.vals[1]) {
				pythoShowError("Hypotenuse ist zu klein!");
				return;
			}
			pythoOptions.vals[0] = pythoTriLength(pythoOptions.vals[2], pythoOptions.vals[1]); //c
			pythoOptions.vals[3] = Math.asin(pythoOptions.vals[1] / pythoOptions.vals[2]);
			pythoOptions.vals[4] = pythoMinusNinety(pythoOptions.vals[3]); //Beta = 90-Alpha
			break;

		//Alpha
		case "03": //a & Alpha
			pythoOptions.vals[2] = pythoOptions.vals[0] / Math.sin(pythoOptions.vals[3]);
			pythoOptions.vals[1] = pythoTriLength(pythoOptions.vals[2], pythoOptions.vals[0]); //c
			pythoOptions.vals[4] = pythoMinusNinety(pythoOptions.vals[3]); //Beta = 90-Alpha
			break;
		case "13": //b & Alpha
			pythoOptions.vals[2] = pythoOptions.vals[1] / Math.cos(pythoOptions.vals[3]);
			pythoOptions.vals[0] = pythoTriLength(pythoOptions.vals[2], pythoOptions.vals[1]); //c
			pythoOptions.vals[4] = pythoMinusNinety(pythoOptions.vals[3]); //Beta = 90-Alpha
			break;
		case "23": //c & Alpha
			pythoOptions.vals[0] = pythoOptions.vals[2] * Math.sin(pythoOptions.vals[3]);
			pythoOptions.vals[1] = pythoTriLength(pythoOptions.vals[2], pythoOptions.vals[0]); //c
			pythoOptions.vals[4] = pythoMinusNinety(pythoOptions.vals[3]); //Beta = 90-Alpha
			break;

		//Beta
		case "04": //a & Beta
			pythoOptions.vals[2] = pythoOptions.vals[0] / Math.cos(pythoOptions.vals[4]);
			pythoOptions.vals[1] = pythoTriLength(pythoOptions.vals[2], pythoOptions.vals[0]); //c
			pythoOptions.vals[3] = pythoMinusNinety(pythoOptions.vals[4]); //Beta = 90-Alpha
			break;
		case "14": //b & Beta
			pythoOptions.vals[2] = pythoOptions.vals[1] / Math.sin(pythoOptions.vals[4]);
			pythoOptions.vals[0] = pythoTriLength(pythoOptions.vals[2], pythoOptions.vals[1]); //c
			pythoOptions.vals[3] = pythoMinusNinety(pythoOptions.vals[4]); //Beta = 90-Alpha
			break;
		case "24": //c & Beta
			pythoOptions.vals[0] = pythoOptions.vals[2] * Math.cos(pythoOptions.vals[4]);
			pythoOptions.vals[1] = pythoTriLength(pythoOptions.vals[2], pythoOptions.vals[0]); //c
			pythoOptions.vals[3] = pythoMinusNinety(pythoOptions.vals[4]); //Beta = 90-Alpha
			break;
	}

	for (let i = 0; i < 5; i++) {
		if (!pythoOptions.inputState.includes(i)) {
			resetInput(`idVin_Pytho_${i}`, i < 3 ? pythoOptions.vals[i].toFixed(3) : ((pythoOptions.vals[i] * 180) / caPY.PI).toFixed(3));
		}
	}
	if (pythoOptions.p5Loaded) {
		drawPytho();
	}
}

function drawPytho() {
	let drawWidth = pythoOptions.width;
	let drawHeight = pythoOptions.height;

	if (pythoOptions.vals[0] / pythoOptions.vals[1] > pythoOptions.height / pythoOptions.width) {
		//--> "Y" fixed length, Scale "X"
		drawWidth = valueConstrain((pythoOptions.vals[1] / pythoOptions.vals[0]) * pythoOptions.height, pythoOptions.width * 0.4, pythoOptions.width);
	} else if (pythoOptions.vals[0] / pythoOptions.vals[1] < pythoOptions.height / pythoOptions.width) {
		//--> "X" fixed length
		drawHeight = valueConstrain((pythoOptions.vals[0] / pythoOptions.vals[1]) * pythoOptions.width, pythoOptions.height * 0.5, pythoOptions.height);
	}

	drawWidth = drawWidth - 2 * pythoOptions.margin;
	drawHeight = drawHeight - 2 * pythoOptions.margin;

	const pythPoints = [
		{
			x: -drawWidth,
			y: 0,
			Up: "A",
			Lo: " a",
		},
		{
			x: 0,
			y: -drawHeight,
			Up: "B",
			Lo: "b",
		},
		{
			x: 0,
			y: 0,
			Up: "C",
			Lo: "c",
		},
	];

	const hyp = pythoTriHypo(drawWidth, drawHeight);
	const beta = Math.asin(drawWidth / hyp);
	const alpha = pythoMinusNinety(beta); //Beta = 90-Alpha
	caPY.clear();
	caPY.strokeWeight(2);

	caPY.push();
	caPY.translate(pythoOptions.width - pythoOptions.margin, pythoOptions.height - pythoOptions.margin);
	// Basics
	caPY.noStroke();
	caPY.fill(globalValues.colors.elements.line);
	caPY.textSize(12);
	caPY.textAlign(caPY.RIGHT, caPY.TOP); //A
	caPY.text(pythPoints[0].Up, pythPoints[0].x, pythPoints[0].y);
	caPY.textAlign(caPY.LEFT, caPY.BOTTOM); //B
	caPY.text(pythPoints[1].Up, pythPoints[1].x, pythPoints[1].y);
	caPY.textAlign(caPY.LEFT, caPY.TOP); //C
	caPY.text(pythPoints[2].Up, pythPoints[2].x, pythPoints[2].y);
	caPY.stroke(globalValues.colors.elements.line);
	caPY.noFill();
	caPY.arc(pythPoints[2].x, pythPoints[2].y, pythoOptions.raduisRightAngle, pythoOptions.raduisRightAngle, caPY.PI, caPY.PI + caPY.HALF_PI); // C bottom right

	//Coloured Stuff
	// line "a"
	let curColor = pythoOptions.inputState.includes(0) ? globalValues.colors.elements.baseColor : globalValues.colors.elements.line;
	caPY.stroke(curColor);
	caPY.line(pythPoints[1].x, pythPoints[1].y, pythPoints[2].x, pythPoints[2].y); //BC
	caPY.noStroke();
	caPY.fill(curColor);
	caPY.textAlign(caPY.LEFT, caPY.CENTER); //a
	caPY.text(pythPoints[0].Lo, pythPoints[1].x, (pythPoints[1].y + pythPoints[2].y) / 2);

	// line "b"
	curColor = pythoOptions.inputState.includes(1) ? globalValues.colors.elements.baseColor : globalValues.colors.elements.line;
	caPY.stroke(curColor);
	caPY.line(pythPoints[0].x, pythPoints[0].y, pythPoints[2].x, pythPoints[2].y); //AC
	caPY.noStroke();
	caPY.fill(curColor);
	caPY.textAlign(caPY.CENTER, caPY.TOP); //b
	caPY.text(pythPoints[1].Lo, (pythPoints[2].x + pythPoints[0].x) / 2, pythPoints[2].y + 5);

	// line "c"
	curColor = pythoOptions.inputState.includes(2) ? globalValues.colors.elements.baseColor : globalValues.colors.elements.line;
	caPY.stroke(curColor);
	caPY.line(pythPoints[0].x, pythPoints[0].y, pythPoints[1].x, pythPoints[1].y); //AB
	caPY.noStroke();
	caPY.fill(curColor);
	caPY.textAlign(caPY.RIGHT, caPY.BOTTOM); //c
	caPY.text(pythPoints[2].Lo, (pythPoints[0].x + pythPoints[1].x) / 2, (pythPoints[0].y + pythPoints[1].y) / 2);

	caPY.textFont(pythoOptions.greekFont);
	caPY.textSize(10);
	//Alpha
	curColor = pythoOptions.inputState.includes(3) ? globalValues.colors.elements.baseColor : globalValues.colors.elements.line;
	caPY.stroke(curColor);
	caPY.noFill();
	caPY.arc(pythPoints[0].x, pythPoints[0].y, pythoOptions.raduisRightAngle, pythoOptions.raduisRightAngle, caPY.TWO_PI - alpha, caPY.TWO_PI); // A bottom left
	caPY.noStroke();
	caPY.fill(curColor);
	caPY.textAlign(caPY.LEFT, caPY.TOP); //A
	caPY.text(`${pythoOptions.greekAlpha}`, pythPoints[0].x + 8, pythPoints[0].y);

	//Beta
	curColor = pythoOptions.inputState.includes(4) ? globalValues.colors.elements.baseColor : globalValues.colors.elements.line;
	caPY.stroke(curColor);
	caPY.noFill();
	caPY.arc(pythPoints[1].x, pythPoints[1].y, pythoOptions.raduisRightAngle, pythoOptions.raduisRightAngle, caPY.HALF_PI, caPY.HALF_PI + beta); //B top right
	caPY.noStroke();
	caPY.fill(curColor);
	caPY.textAlign(caPY.LEFT, caPY.TOP); //B
	caPY.text(`${pythoOptions.greekBeta}`, pythPoints[1].x + 4, pythPoints[1].y);

	caPY.textSize(12);
	caPY.pop();
}
