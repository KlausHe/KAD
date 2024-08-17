import { globalColors } from "../Settings/Color.js";
import { initEL, dbID, dbIDStyle, deepClone, KadValue, KadInteraction } from "../KadUtils/KadUtils.js";
import { globalValues } from "../Settings/General.js";

const pythoOptions = {
	p5Loaded: false,
	get canvas() {
		return { w: globalValues.mediaSizes.canvasSize.w * 0.5, h: globalValues.mediaSizes.canvasSize.h * 0.5 };
	},
	margin: 20,
	raduisRightAngle: 25,
	greekFont: "Arial",
	greekAlpha: "\u03B1",
	greekBeta: "\u03B2",
	inputState: [0, 1],
	inputStateOrig: [0, 1],
	vals: [],
	valsOrig: [3, 4, null, null, null],
	errorShown: false,
};

initEL({ id: idVin_Pytho_0, fn: pythoNewEntry, resetValue: pythoOptions.valsOrig[0] });
initEL({ id: idVin_Pytho_1, fn: pythoNewEntry, resetValue: pythoOptions.valsOrig[1] });
initEL({ id: idVin_Pytho_2, fn: pythoNewEntry, resetValue: pythoOptions.valsOrig[2] });
initEL({ id: idVin_Pytho_3, fn: pythoNewEntry, resetValue: pythoOptions.valsOrig[3] });
initEL({ id: idVin_Pytho_4, fn: pythoNewEntry, resetValue: pythoOptions.valsOrig[4] });

export function clear_cl_Pythagoras() {
	KadInteraction.removeContextmenu(idCanv_pytho);
	pythoOptions.inputState = [...pythoOptions.inputStateOrig];
	for (let i = 0; i < 5; i++) {
		pythoOptions.vals[i] = dbID(`idVin_Pytho_${i}`).KadReset();
	}
	pythoShowError();
	pythoCalc();
}

export function canvas_cl_Pythagoras() {
	caPY.resizeCanvas(pythoOptions.canvas.w, pythoOptions.canvas.h);
	pythoCalc();
}

const caPY = new p5((c) => {
	c.setup = function () {
		c.canv = c.createCanvas(pythoOptions.canvas.w, pythoOptions.canvas.h);
		c.canv.id("canvasPytho");
		c.canv.parent("#idCanv_pytho");
		c.noLoop();
		c.colorMode(c.HSL);
		pythoOptions.p5Loaded = true;
	};
}, "#idCanv_pytho");

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
	const id = obj.target.id;
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
	pythoOptions.vals[A] = dbID(`idVin_Pytho_${A}`).KadGet();
	pythoOptions.vals[B] = dbID(`idVin_Pytho_${B}`).KadGet();

	if (B > 2) pythoOptions.vals[B] *= caPY.PI / 180;
	if (A > 2) pythoOptions.vals[A] *= caPY.PI / 180;
	const arr = deepClone(pythoOptions.inputState).sort();

	let a = pythoOptions.vals[0];
	let b = pythoOptions.vals[1];
	let c = pythoOptions.vals[2];
	let alpha = pythoOptions.vals[3];
	let beta = pythoOptions.vals[4];

	switch (arr.join("")) {
		case "01": //a & b
			c = pythoTriHypo(a, b);
			alpha = caPY.asin(a / c);
			beta = pythoMinusNinety(alpha);
			break;
		case "02": //a & c
			if (c <= a) {
				pythoShowError("Hypotenuse ist zu klein!");
				return;
			}
			b = pythoTriLength(c, a);
			beta = caPY.asin(b / c);
			alpha = pythoMinusNinety(beta);
			break;
		case "12": //b & c
			if (c <= b) {
				pythoShowError("Hypotenuse ist zu klein!");
				return;
			}
			a = pythoTriLength(c, b);
			alpha = Math.asin(b / c);
			beta = pythoMinusNinety(alpha);
			break;

		//Alpha
		case "03": //a & Alpha
			c = a / Math.sin(alpha);
			b = pythoTriLength(c, a);
			beta = pythoMinusNinety(alpha);
			break;
		case "13": //b & Alpha
			c = b / Math.cos(alpha);
			a = pythoTriLength(c, b);
			beta = pythoMinusNinety(alpha);
			break;
		case "23": //c & Alpha
			a = c * Math.sin(alpha);
			b = pythoTriLength(c, a);
			beta = pythoMinusNinety(alpha);
			break;

		//Beta
		case "04": //a & Beta
			c = a / Math.cos(beta);
			b = pythoTriLength(c, a);
			alpha = pythoMinusNinety(beta);
			break;
		case "14": //b & Beta
			c = b / Math.sin(beta);
			a = pythoTriLength(c, b);
			alpha = pythoMinusNinety(beta);
			break;
		case "24": //c & Beta
			a = c * Math.cos(beta);
			b = pythoTriLength(c, a);
			alpha = pythoMinusNinety(beta);
			break;
	}

	pythoOptions.vals[0] = a;
	pythoOptions.vals[1] = b;
	pythoOptions.vals[2] = c;
	pythoOptions.vals[3] = alpha;
	pythoOptions.vals[4] = beta;

	for (let i = 0; i < 5; i++) {
		if (!pythoOptions.inputState.includes(i)) {
			const val = i < 3 ? pythoOptions.vals[i].toFixed(3) : ((pythoOptions.vals[i] * 180) / caPY.PI).toFixed(3);
			dbID(`idVin_Pytho_${i}`).KadReset({ resetValue: val });
		}
	}
	if (pythoOptions.p5Loaded) {
		drawPytho();
	}
}

function drawPytho() {
	let drawWidth = pythoOptions.canvas.w;
	let drawHeight = pythoOptions.canvas.h;

	if (pythoOptions.vals[0] / pythoOptions.vals[1] > pythoOptions.canvas.h / pythoOptions.canvas.w) {
		//--> "Y" fixed length, Scale "X"
		drawWidth = KadValue.constrain((pythoOptions.vals[1] / pythoOptions.vals[0]) * pythoOptions.canvas.h, pythoOptions.canvas.w * 0.4, pythoOptions.canvas.w);
	} else if (pythoOptions.vals[0] / pythoOptions.vals[1] < pythoOptions.canvas.h / pythoOptions.canvas.w) {
		//--> "X" fixed length
		drawHeight = KadValue.constrain((pythoOptions.vals[0] / pythoOptions.vals[1]) * pythoOptions.canvas.w, pythoOptions.canvas.h * 0.5, pythoOptions.canvas.h);
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
	const alpha = pythoMinusNinety(beta);
	caPY.clear();
	caPY.strokeWeight(2);

	caPY.push();
	caPY.translate(pythoOptions.canvas.w - pythoOptions.margin, pythoOptions.canvas.h - pythoOptions.margin);
	// Basics
	caPY.noStroke();
	caPY.fill(globalColors.elements.line);
	caPY.textSize(globalValues.mediaSizes.fontSize);
	caPY.textAlign(caPY.RIGHT, caPY.TOP); //A
	caPY.text(pythPoints[0].Up, pythPoints[0].x, pythPoints[0].y);
	caPY.textAlign(caPY.LEFT, caPY.BOTTOM); //B
	caPY.text(pythPoints[1].Up, pythPoints[1].x, pythPoints[1].y);
	caPY.textAlign(caPY.LEFT, caPY.TOP);
	caPY.text(pythPoints[2].Up, pythPoints[2].x, pythPoints[2].y);
	caPY.stroke(globalColors.elements.line);
	caPY.noFill();
	caPY.arc(pythPoints[2].x, pythPoints[2].y, pythoOptions.raduisRightAngle, pythoOptions.raduisRightAngle, caPY.PI, caPY.PI + caPY.HALF_PI); // C bottom right

	//Coloured Stuff
	// line "a"
	let curColor = pythoOptions.inputState.includes(0) ? globalColors.elements.baseColor : globalColors.elements.line;
	caPY.stroke(curColor);
	caPY.line(pythPoints[1].x, pythPoints[1].y, pythPoints[2].x, pythPoints[2].y); //BC
	caPY.noStroke();
	caPY.fill(curColor);
	caPY.textAlign(caPY.LEFT, caPY.CENTER); //a
	caPY.text(pythPoints[0].Lo, pythPoints[1].x, (pythPoints[1].y + pythPoints[2].y) / 2);

	// line "b"
	curColor = pythoOptions.inputState.includes(1) ? globalColors.elements.baseColor : globalColors.elements.line;
	caPY.stroke(curColor);
	caPY.line(pythPoints[0].x, pythPoints[0].y, pythPoints[2].x, pythPoints[2].y); //AC
	caPY.noStroke();
	caPY.fill(curColor);
	caPY.textAlign(caPY.CENTER, caPY.TOP); //b
	caPY.text(pythPoints[1].Lo, (pythPoints[2].x + pythPoints[0].x) / 2, pythPoints[2].y + 5);

	// line "c"
	curColor = pythoOptions.inputState.includes(2) ? globalColors.elements.baseColor : globalColors.elements.line;
	caPY.stroke(curColor);
	caPY.line(pythPoints[0].x, pythPoints[0].y, pythPoints[1].x, pythPoints[1].y); //AB
	caPY.noStroke();
	caPY.fill(curColor);
	caPY.textAlign(caPY.RIGHT, caPY.BOTTOM);
	caPY.text(pythPoints[2].Lo, (pythPoints[0].x + pythPoints[1].x) / 2, (pythPoints[0].y + pythPoints[1].y) / 2);

	caPY.textFont(pythoOptions.greekFont);
	caPY.textSize(globalValues.mediaSizes.fontSize * 0.8);
	//Alpha
	curColor = pythoOptions.inputState.includes(3) ? globalColors.elements.baseColor : globalColors.elements.line;
	caPY.stroke(curColor);
	caPY.noFill();
	caPY.arc(pythPoints[0].x, pythPoints[0].y, pythoOptions.raduisRightAngle, pythoOptions.raduisRightAngle, caPY.TWO_PI - alpha, caPY.TWO_PI); // A bottom left
	caPY.noStroke();
	caPY.fill(curColor);
	caPY.textAlign(caPY.LEFT, caPY.TOP); //A
	caPY.text(`${pythoOptions.greekAlpha}`, pythPoints[0].x + 8, pythPoints[0].y);

	//Beta
	curColor = pythoOptions.inputState.includes(4) ? globalColors.elements.baseColor : globalColors.elements.line;
	caPY.stroke(curColor);
	caPY.noFill();
	caPY.arc(pythPoints[1].x, pythPoints[1].y, pythoOptions.raduisRightAngle, pythoOptions.raduisRightAngle, caPY.HALF_PI, caPY.HALF_PI + beta); //B top right
	caPY.noStroke();
	caPY.fill(curColor);
	caPY.textAlign(caPY.LEFT, caPY.TOP); //B
	caPY.text(`${pythoOptions.greekBeta}`, pythPoints[1].x + 4, pythPoints[1].y);

	caPY.textSize(globalValues.mediaSizes.fontSize);
	caPY.pop();
}
