import { globalColors } from "../Settings/Color.js";
import { dbID, initEL, KadInteraction, KadValue } from "../KadUtils/KadUtils.js";
import { globalValues } from "../Settings/General.js";
const patternOptions = {
	get margin() {
		return globalValues.mediaSizes.canvasSize.w * 0.02;
	},
	get canvas() {
		return { w: globalValues.mediaSizes.canvasSize.w * 1.5, h: globalValues.mediaSizes.canvasSize.h / 3 };
	},
	names: ["Gesamtlänge", "Seitenversatz", "Asymetrie", "Punkte", "Vorschlag"],
	valOrig: [330, 20, 0, 3, 3],
	size: 0,
	side: 0,
	asym: 0,
	holes: 0,
	propHoles: 0,
	holeDist: 90,
	absArr: [],
};

initEL({ id: idVin_Pattern0, fn: patternSize, resetValue: patternOptions.valOrig[0] });
initEL({ id: idVin_Pattern1, fn: patternSide, resetValue: patternOptions.valOrig[1] });
initEL({ id: idVin_Pattern2, fn: patternAsym, resetValue: patternOptions.valOrig[2] });
initEL({ id: idVin_Pattern3, fn: patternHoles, resetValue: patternOptions.valOrig[3] });
initEL({ id: idBtn_Pattern4, fn: patternProp });

export function clear_cl_Pattern() {
	KadInteraction.removeContextmenu(idCanv_pattern);
	patternOptions.size = idVin_Pattern0.KadReset();
	patternOptions.side = idVin_Pattern1.KadReset();
	patternOptions.asym = idVin_Pattern2.KadReset();
	patternOptions.holes = idVin_Pattern3.KadReset();

	dbID("idLbl_Pattern0").textContent = patternOptions.names[0]; //gesamltänge
	dbID("idLbl_Pattern1").textContent = patternOptions.names[1]; //Seitenversatz
	dbID("idLbl_Pattern2").textContent = patternOptions.names[2]; //Asymmetrie
	dbID("idLbl_Pattern3").textContent = patternOptions.names[3]; //Punkte
	calcPattern();
}

const caPA = new p5((c) => {
	c.setup = function () {
		c.canv = c.createCanvas(patternOptions.canvas.w, patternOptions.canvas.h);
		c.canv.id("canvasPattern");
		c.canv.parent("#idCanv_pattern");
		c.colorMode(c.HSL);
		c.noLoop();
	};
	c.draw = function () {
		caPA.clear();
		caPA.translate(patternOptions.margin, patternOptions.margin);
		const w = patternOptions.canvas.w - 2 * patternOptions.margin;
		const h = patternOptions.canvas.h - 2 * patternOptions.margin;
		const offsetLineTop = 0.1;
		const offsetContur = offsetLineTop + 0.15;
		const offsetPoint = offsetContur + 0.2;
		const offsetLineInc = offsetPoint + 0.2;
		const offsetTextInc = offsetLineInc + 0.1;
		const offsetLineAbs = offsetTextInc + 0.1;
		const offsetTextAbs = offsetLineAbs + 0.05;

		//Maincontur
		patternLine([0, h * offsetContur], [w, h * offsetContur], 3);
		patternLine([0, h * offsetContur], [0, h], 3);
		patternLine([w, h * offsetContur], [w, h], 3);

		//text Length top
		patternText(KadValue.number(patternOptions.size, { decimals: 3 }), [w / 2, 0]);
		patternArrowLine([0, h * offsetLineTop], [w, h * offsetLineTop]);
		patternLine([0, 0], [0, h * offsetContur]);
		patternLine([w, 0], [w, h * offsetContur]);

		let prevX;
		for (let i = 1; i < patternOptions.absArr.length; i++) {
			const currX = (patternOptions.absArr[i] / patternOptions.size) * w;
			prevX = (patternOptions.absArr[i - 1] / patternOptions.size) * w;

			if (i < patternOptions.absArr.length - 1) {
				patternPoint([currX, h * offsetPoint], 3, 10);
				patternLine([currX, h * offsetPoint], [currX, h * offsetLineAbs]);
				patternText(KadValue.number(patternOptions.absArr[i], { decimals: 3 }), [currX, h * offsetTextAbs]);
			}
			patternArrowLine([prevX, h * offsetLineInc], [currX, h * offsetLineInc]);
			patternText(KadValue.number(patternOptions.absArr[i] - patternOptions.absArr[i - 1], { decimals: 3 }), [(prevX + currX) * 0.5, h * offsetTextInc]);
		}
	};
}, "#idCanv_pattern");

export function canvas_cl_Pattern() {
	caPA.resizeCanvas(patternOptions.canvas.w, patternOptions.canvas.h);
	caPA.redraw();
}

function patternSize() {
	patternOptions.size = idVin_Pattern0.KadGet({ failSafe: patternOptions.valOrig[0] });
	calcPattern();
}
function patternSide() {
	patternOptions.side = idVin_Pattern1.KadGet({ failSafe: patternOptions.valOrig[1] });
	calcPattern();
}
function patternAsym() {
	patternOptions.asym = idVin_Pattern2.KadGet({ failSafe: patternOptions.valOrig[2] });
	calcPattern();
}
function patternHoles() {
	patternOptions.holes = idVin_Pattern3.KadGet({ failSafe: patternOptions.valOrig[3] });
	calcPattern();
}
function patternProp() {
	patternOptions.holes = patternOptions.propHoles;
	dbID("idVin_Pattern3").value = patternOptions.propHoles;
	calcPattern();
}

function calcPattern() {
	//correct side if size < 2 * side
	patternOptions.side = patternOptions.size <= 2 * patternOptions.side ? 0 : patternOptions.side;
	dbID("idLbl_Pattern1").textContent = patternOptions.side;

	const correctedSize = patternOptions.size - 2 * patternOptions.side;
	patternOptions.propHoles = 1 + Math.ceil((correctedSize - patternOptions.asym) / patternOptions.holeDist);
	dbID("idBtn_Pattern4").textContent = `${patternOptions.propHoles} Punkte`;

	patternOptions.absArr = [0];
	// const tempSize = patternOptions.holes % 2 == 0 ? correctedSize - patternOptions.asym : correctedSize;
	const holeDistance = correctedSize / (patternOptions.holes - 1);

	for (let i = 0; i < patternOptions.holes; i++) {
		const asymAdd = i > patternOptions.holes * 0.5 ? 0 : patternOptions.asym;
		patternOptions.absArr[i + 1] = patternOptions.side + i * holeDistance + asymAdd;
	}
	patternOptions.absArr.push(patternOptions.size);
	caPA.redraw();
}

function patternPoint(pos, weight = 3, d = 10) {
	caPA.stroke(globalColors.elements.line);
	caPA.strokeWeight(weight);
	caPA.noFill();
	caPA.circle(...pos, d);
}

function patternLine(start, end, weight = 1) {
	caPA.stroke(globalColors.elements.line);
	caPA.strokeWeight(weight);
	caPA.line(...start, ...end);
}

function patternArrowLine(start, end, weight = 1) {
	const arrowSizeX = 6;
	patternLine(start, end, weight);
	const sx = start[0];
	const sy = start[1];
	const ex = end[0];
	const ey = end[1];
	const arrowSizeY = arrowSizeX / 3;
	caPA.triangle(...start, sx + arrowSizeX, sy - arrowSizeY, sx + arrowSizeX, sy + arrowSizeY);
	caPA.triangle(...end, ex - arrowSizeX, ey - arrowSizeY, ex - arrowSizeX, ey + arrowSizeY);
}

function patternText(text, pos) {
	caPA.textSize(globalValues.mediaSizes.fontSize);
	caPA.textAlign(caPA.CENTER, caPA.TOP);
	caPA.noStroke();
	caPA.fill(globalColors.elements.line);
	caPA.strokeWeight(1);
	caPA.text(text, ...pos);
}
