import { daEL, dbID, KadDOM, KadValue } from "../General/KadUtils.js";
import { globalValues } from "../Settings/Basics.js";
const patternOptions = {
	get margin() {
		return globalValues.mediaSizes.canvasSize.w * 0.02;
	},
	get canvas() {
		return { w: globalValues.mediaSizes.canvasSize.w * 1.5, h: globalValues.mediaSizes.canvasSize.h / 4 };
	},
	length: {
		//0
		val: null,
		valOrig: 330,
		name: "Gesamtlänge",
	},
	side: {
		//1
		val: null,
		valOrig: 20,
		name: "Seitenversatz",
	},
	numHoles: {
		//4
		val: null,
		valOrig: 2,
		name: "Punkte",
	},
	asym: {
		//3
		val: null,
		valOrig: 0,
		name: "Asymetrie",
	},
	propHoles: {
		val: null,
		valOrig: 3,
		name: "Vorschlag",
	},
	holeDist: 200,
	absArr: [],
	incArr: [],
};

const caPA = new p5((c) => {
	c.setup = function () {
		c.canv = c.createCanvas(patternOptions.canvas.w, patternOptions.canvas.h);
		c.canv.id("canvasPattern");
		c.canv.parent("#idCanv_pattern");
		c.colorMode(c.HSL);
		c.noLoop();
	};
}, "#idCanv_pattern");

daEL(idVin_Pattern0, "input", calcPattern);
daEL(idVin_Pattern1, "input", calcPattern);
daEL(idVin_Pattern2, "input", calcPattern);
daEL(idVin_Pattern3, "input", calcPattern);
daEL(idVin_Pattern4, "click", patternProp);

export function canvas_cl_Pattern() {
	caPA.resizeCanvas(patternOptions.canvas.w, patternOptions.canvas.h);
  drawPattern();
}

export function clear_cl_Pattern() {
	patternOptions.length.val = KadDOM.resetInput("idVin_Pattern0", patternOptions.length.valOrig);
	patternOptions.side.val = KadDOM.resetInput("idVin_Pattern1", patternOptions.side.valOrig);
	patternOptions.asym.val = KadDOM.resetInput("idVin_Pattern2", patternOptions.asym.valOrig);
	patternOptions.numHoles.val = KadDOM.resetInput("idVin_Pattern3", patternOptions.numHoles.valOrig);

	dbID("idLbl_Pattern0").textContent = patternOptions.length.name; //gesamltänge
	dbID("idLbl_Pattern1").textContent = patternOptions.side.name; //Seitenversatz
	dbID("idLbl_Pattern2").textContent = patternOptions.asym.name; //Asymmetrie
	dbID("idLbl_Pattern3").textContent = patternOptions.numHoles.name; //Punkte
	calcPattern();
}

function calcPattern() {
	patternOptions.length.val = KadDOM.numberFromInput("idVin_Pattern0", patternOptions.length.valOrig);
	patternOptions.side.val = KadDOM.numberFromInput("idVin_Pattern1", patternOptions.side.valOrig);
	patternOptions.asym.val = KadDOM.numberFromInput("idVin_Pattern2", patternOptions.asym.valOrig);
	patternOptions.numHoles.val = KadDOM.numberFromInput("idVin_Pattern3", patternOptions.numHoles.valOrig);

	//correct based on Length
	patternOptions.side.val = patternOptions.length.val <= 2 * patternOptions.side.val ? 0 : patternOptions.side.val;

	let minAbstand = patternOptions.length.val - 2 * patternOptions.side.val;
	if (minAbstand > patternOptions.holeDist) {
		patternOptions.propHoles.val = 1 + Math.ceil(minAbstand / patternOptions.holeDist);
	} else {
		patternOptions.propHoles.val = 2;
	}
	dbID("idVin_Pattern4").textContent = `${patternOptions.propHoles.val} Punkte`;

	//Array
	let incBasis = (patternOptions.length.val - 2 * patternOptions.side.val - patternOptions.asym.val) / (patternOptions.numHoles.val - 1);
	patternOptions.incArr = [patternOptions.side.val];
	patternOptions.absArr = [patternOptions.side.val];
	for (let i = 1; i < patternOptions.numHoles.val; i++) {
		if (patternOptions.numHoles.val % 2 !== 0) {
			if (i == Math.floor(patternOptions.numHoles.val / 2) || i == Math.floor(patternOptions.numHoles.val / 2 + 1)) {
				patternOptions.incArr.push(incBasis + patternOptions.asym.val / 2);
			} else {
				patternOptions.incArr.push(incBasis);
			}
		} else {
			if (i == Math.floor(patternOptions.numHoles.val / 2)) {
				patternOptions.incArr.push(incBasis + patternOptions.asym.val);
			} else {
				patternOptions.incArr.push(incBasis);
			}
		}
		patternOptions.absArr.push(patternOptions.incArr[i] + patternOptions.absArr[i - 1]);
	}
	patternOptions.incArr.push(patternOptions.side.val);
	patternOptions.absArr.push(patternOptions.incArr[patternOptions.numHoles.val] + patternOptions.absArr[patternOptions.numHoles.val - 1]);
	drawPattern();
}

function patternProp() {
	dbID("idVin_Pattern3").value = patternOptions.propHoles.val;
	calcPattern();
}

function drawPattern() {
	caPA.clear();
	const m = patternOptions.margin;
	const w = patternOptions.canvas.w;
	const h = patternOptions.canvas.h;
	const r = globalValues.mediaSizes.radius;

	//text Length top
	caPA.textSize(globalValues.mediaSizes.fontSize);
	caPA.textAlign(caPA.CENTER, caPA.CENTER);
	caPA.noStroke();
	caPA.fill(globalValues.colors.elements.line);
	caPA.strokeWeight(1);
	caPA.text(KadValue.number(patternOptions.length.val, { decimals: 3 }), w / 2, h * 0.1);
	//Maincontur
	caPA.stroke(globalValues.colors.elements.line);
	caPA.strokeWeight(4);
	let offset = 0.3;
	// caPA.line(m, h * offset, m, h);
	// caPA.line(w - m, h * offset, w - m, h);
	caPA.line(m, h * offset, w - m, h * offset);

	caPA.strokeWeight(1);
	//measure at top
	offset = 0.1;
	caPA.line(m, h * offset, m, h * 0.6);
	caPA.line(w - m, h * offset, w - m, h * 0.6);
	caPA.line(m, h * offset * 2, w - m, h * offset * 2);

	//measure horizontal at bottom
	offset = 0.45;
	caPA.line(m, h * offset, w - m, h * offset);
	// return;

	//draw points and measurements in kleiner schrift
	let absPos;
	let incPos;
	caPA.strokeWeight(1);

	const dw = w - 2 * m;
	const drawingScaling = dw / patternOptions.length.val;
	for (let i = 0; i < patternOptions.absArr.length; i++) {
		absPos = drawingScaling * patternOptions.absArr[i];
		if (i == 0) {
			incPos = absPos / 2;
		} else {
			incPos = drawingScaling * ((patternOptions.absArr[i] + patternOptions.absArr[i - 1]) / 2);
		}
		absPos += m;
		incPos += m;

		//draw line and circle
		if (i < patternOptions.absArr.length - 1) {
			caPA.noFill();
			caPA.strokeWeight(1);
			caPA.stroke(globalValues.colors.elements.line);
			offset = 0.3;
			caPA.line(absPos, h * offset, absPos, h * offset * 2.5);
			caPA.strokeWeight(4);
			caPA.circle(absPos, h * offset, 2 * r);
		}

		// draw ABS Text
		if (patternOptions.side.val == 0 && (i == 0 || i == patternOptions.absArr.length - 1)) continue;
		caPA.fill(globalValues.colors.elements.line);
		caPA.noStroke();
		if (i < patternOptions.absArr.length - 1 && patternOptions.absArr[i] != patternOptions.length.val) {
			offset = 0.9;
			caPA.text(KadValue.number(patternOptions.absArr[i], { decimals: 3 }), absPos, h * offset);
		}
		offset = 0.55;
		caPA.text(KadValue.number(patternOptions.incArr[i], { decimals: 3 }), incPos, h * offset);
	}
}
