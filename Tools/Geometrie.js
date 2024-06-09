//  https://de.wikipedia.org/wiki/Pyramide_(Geometrie)

import { globalColors } from "../Settings/Color.js";
import { dbID, dbCL, KadValue, KadDOM, KadTable, initEL } from "../General/KadUtils.js";
import { Data_Materials } from "../General/MainData.js";
import { globalValues } from "../Settings/General.js";
import { materialOptions } from "./Material.js";

const geometrieOptions = {
	get canvas() {
		return { w: globalValues.mediaSizes.canvasSize.w * 0.5, h: globalValues.mediaSizes.canvasSize.h * 0.5 };
	},
	roh: 0,
	acc: 4,
	units: {
		circumference: {
			name: "Umfang",
			unit: "mm",
			dim: 1,
		},
		basearea: {
			name: "Grundfläche",
			unit: "mm",
			dim: 2,
		},
		fullarea: {
			name: "Oberfläche",
			unit: "mm",
			dim: 2,
		},
		volume: {
			name: "Volumen",
			unit: "mm",
			dim: 3,
		},
		mass: {
			name: "Masse",
			unit: "g",
			dim: 1,
		},
	},
	result: {
		circumference: 0,
		basearea: 0,
		fullarea: 0,
		volume: 0,
		mass: 0,
	},
	get matList() {
		return materialOptions.matList;
	},
};

let geoObjects = {
	get dim() {
		const w = geometrieOptions.canvas.w;
		const h = geometrieOptions.canvas.h;
		return {
			a: w * 0.35,
			b: w * 0.08,
			c: h * 0.35,
			d: h * 0.08,
			s: w * 0.06,
		};
	},
	strokeBody: 2,
	strokeHair: 1,
	elements: ["Quader", "Würfel", "Pyramide", "Dreieckspyramide", "Zylinder", "Rohr", "Kegel", "Kugel"],
	get selected() {
		return geoObjects[geoObjects.elements[geoObjects.elementIndex]];
	},
	elementIndexOrig: 5,
	elementIndex: 2,
	radState: false,
	valA: null,
	valB: null,
	valC: null,
	get diameterActive() {
		return this.radState ? 1 : 0.5;
	},
	get diameter() {
		return this.radState ? { low: "r", cap: "R" } : { low: "d", cap: "D" };
	},
	initiateShow() {
		caGE.resetMatrix();
		caGE.clear();
		caGE.textSize(globalValues.mediaSizes.fontSize);
		caGE.push();
		caGE.translate(geometrieOptions.canvas.w / 2, geometrieOptions.canvas.h / 2);
		caGE.strokeWeight(geoObjects.strokeBody);
		caGE.strokeCap(caGE.ROUND);
		caGE.strokeJoin(caGE.ROUND);
		caGE.fill(globalColors.elements.baseColor);
		caGE.stroke(globalColors.elements.line);
	},
	Quader: {
		lbl: ["a", "b", "c"],
		vals: [223, 20, 10],
		get radiusFactor() {
			return [1, 1, 1];
		},
		cbRadiusEnable: false,
		get circumference() {
			return 2 * (geoObjects.valA + geoObjects.valB);
		},
		get basearea() {
			return geoObjects.valA * geoObjects.valB;
		},
		get fullarea() {
			return 2 * (geoObjects.valA * geoObjects.valB + geoObjects.valB * geoObjects.valC + geoObjects.valA * geoObjects.valC);
		},
		get volume() {
			return geoObjects.valA * geoObjects.valB * geoObjects.valC;
		},
		show() {
			let { a, b, c, d } = geoObjects.dim;
			c = c / 2;
			const shape = [
				[a - b, c + d],
				[a + b, c - d],
				[-(a - b), c - d],
				[-(a + b), c + d],
				[a - b, -(c - d)],
				[a + b, -(c + d)],
				[-(a - b), -(c + d)],
				[-(a + b), -(c - d)],
			];
			geoObjects.initiateShow();

			//Grundfläche
			caGE.beginShape();
			for (let i = 0; i < 4; i++) {
				caGE.vertex(...shape[i]);
			}
			caGE.endShape(caGE.CLOSE);

			for (let n = 0; n < 4; n++) {
				const k = n + 4;
				const l = ((n + 5) % 4) + 4;
				caGE.line(...shape[k], ...shape[l]);
				caGE.line(...shape[n], ...shape[k]);
			}

			caGE.fill(globalColors.elements.text);
			caGE.noStroke();
			patternText(this.lbl[0], shape[3], shape[0], caGE.CENTER, caGE.TOP);
			patternText(this.lbl[1], shape[0], shape[1], caGE.LEFT, caGE.CENTER);
			patternText(this.lbl[2], shape[1], shape[5], caGE.LEFT, caGE.CENTER);
			caGE.pop();
		},
	},
	Würfel: {
		lbl: ["a", "", ""],
		vals: [10, null, null],
		get radiusFactor() {
			return [1, 1, 1];
		},
		cbRadiusEnable: false,
		get circumference() {
			return 4 * geoObjects.valA;
		},
		get basearea() {
			return geoObjects.valA * geoObjects.valA;
		},
		get fullarea() {
			return 6 * geoObjects.valA * geoObjects.valA;
		},
		get volume() {
			return geoObjects.valA * geoObjects.valA * geoObjects.valA;
		},
		show() {
			const { a, b, c, d } = geoObjects.dim;
			const shape = [
				[a - b, c + d],
				[a + b, c - d],
				[-(a - b), c - d],
				[-(a + b), c + d],
				[a - b, -(c - d)],
				[a + b, -(c + d)],
				[-(a - b), -(c + d)],
				[-(a + b), -(c - d)],
			];
			geoObjects.initiateShow();
			//Grundfläche
			caGE.beginShape();
			for (let i = 0; i < 4; i++) {
				caGE.vertex(...shape[i]);
			}
			caGE.endShape(caGE.CLOSE);

			for (let n = 0; n < 4; n++) {
				let k = n + 4;
				let l = ((n + 5) % 4) + 4;
				caGE.line(...shape[k], ...shape[l]);
				caGE.line(...shape[n], ...shape[k]);
			}

			caGE.fill(globalColors.elements.text);
			caGE.noStroke();
			patternText(this.lbl[0], shape[3], shape[0], caGE.CENTER, caGE.TOP);
			patternText(this.lbl[0], shape[0], shape[1], caGE.LEFT, caGE.CENTER);
			patternText(this.lbl[0], shape[1], shape[5], caGE.LEFT, caGE.CENTER);
			caGE.pop();
		},
	},
	Pyramide: {
		lbl: ["a", "b", "h"],
		vals: [10, 10, 10],
		get radiusFactor() {
			return [1, 1, 1];
		},
		cbRadiusEnable: false,
		get circumference() {
			return 4 * geoObjects.valA;
		},
		get basearea() {
			return geoObjects.valA * geoObjects.valA;
		},
		get fullarea() {
			const a = geoObjects.valA;
			const b = geoObjects.valB;
			const h = geoObjects.valC;
			const h_a = Math.sqrt(h ** 2 + a ** 2 / 4);
			return a * b + a * h_a + b * h_a;
		},
		get volume() {
			return (geoObjects.valA * geoObjects.valB * geoObjects.valC) / 3;
		},
		show() {
			const { a, b, c, d } = geoObjects.dim;
			const shape = [
				[a - b, c + d],
				[a + b, c - d],
				[-(a - b), c - d],
				[-(a + b), c + d],
				[0, -(c + d)],
				[0, c],
			];
			geoObjects.initiateShow();
			//Grundfläche
			caGE.beginShape();
			for (let i = 0; i < 4; i++) {
				caGE.vertex(...shape[i]);
			}
			caGE.endShape(caGE.CLOSE);

			for (let n = 0; n < 4; n++) {
				caGE.line(...shape[n], ...shape[4]);
			}
			caGE.strokeWeight(geoObjects.strokeHair);
			caGE.line(...shape[4], ...shape[5]);
			caGE.strokeWeight(geoObjects.strokeBody);

			//text
			caGE.fill(globalColors.elements.text);
			caGE.noStroke();
			patternText(this.lbl[0], shape[3], shape[0], caGE.CENTER, caGE.TOP);
			patternText(this.lbl[1], shape[0], shape[1], caGE.LEFT, caGE.CENTER);
			patternText(this.lbl[2], shape[4], shape[5], caGE.LEFT, caGE.CENTER);
			caGE.pop();
		},
	},
	Dreieckspyramide: {
		lbl: ["a", "h", ""],
		vals: [10, 10, null],
		get radiusFactor() {
			return [1, 1, 1];
		},
		cbRadiusEnable: false,
		get circumference() {
			return 4 * geoObjects.valA;
		},
		get basearea() {
			return (geoObjects.valA * geoObjects.valA) / 2;
		},
		get fullarea() {
			const a = geoObjects.valA;
			const h = geoObjects.valB;
			return ((3 * a) / 4) * ((a / 3) * Math.sqrt(3) + Math.sqrt(4 * h ** 2 + a ** 2 / 3));
		},
		get volume() {
			return ((geoObjects.valA ** 2 * geoObjects.valB) / 12) * Math.sqrt(3);
		},
		show() {
			const { a, b, c, d } = geoObjects.dim;
			const shape = [
				[a + b, c + d],
				[-b, c - d],
				[-(a + b), c + d],
				[0, -(c + d)],
				[0, c],
			];
			geoObjects.initiateShow();
			//Grundfläche
			caGE.beginShape();
			for (let i = 0; i < 3; i++) {
				caGE.vertex(...shape[i]);
			}
			caGE.endShape(caGE.CLOSE);

			for (let n = 0; n < 3; n++) {
				caGE.line(...shape[n], ...shape[3]);
			}
			caGE.strokeWeight(geoObjects.strokeHair);
			caGE.line(...shape[3], ...shape[4]);
			caGE.strokeWeight(geoObjects.strokeBody);

			//text
			caGE.fill(globalColors.elements.text);
			caGE.noStroke();
			patternText(this.lbl[0], shape[2], shape[0], caGE.CENTER, caGE.TOP);
			patternText(this.lbl[1], shape[3], shape[4], caGE.LEFT, caGE.CENTER);
			caGE.pop();
		},
	},
	Zylinder: {
		get lbl() {
			return [geoObjects.diameter.cap, "h", ""];
		},
		vals: [10, 10, null],
		get radiusFactor() {
			return [geoObjects.diameterActive, 1, 1];
		},
		cbRadiusEnable: true,
		get circumference() {
			const valA = geoObjects.valA;
			return Math.PI * 2 * valA;
		},
		get basearea() {
			const valA = geoObjects.valA;
			return Math.PI * valA * valA;
		},
		get fullarea() {
			const valA = geoObjects.valA; //valA === R
			return 2 * Math.PI * valA * (geoObjects.valB + valA);
		},
		get volume() {
			const valA = geoObjects.valA;
			return Math.PI * valA * valA * geoObjects.valB;
		},
		show() {
			geoObjects.initiateShow();
			let { a, b, c, d } = geoObjects.dim;
			const shape = [
				[a + b, c],
				[a + b, -c],
				[-(a + b), c],
				[-(a + b), -c],
				[0, c],
				[0, c + d],
			];

			caGE.line(...shape[0], ...shape[1]);
			caGE.line(...shape[2], ...shape[3]);
			caGE.ellipse(0, c, (a + b) * 2, d * 2);
			caGE.noFill();
			caGE.ellipse(0, -c, (a + b) * 2, d * 2);

			//text
			caGE.fill(globalColors.elements.text);
			caGE.noStroke();
			patternText(this.lbl[0], shape[5], shape[5], caGE.CENTER, caGE.TOP);
			patternText(this.lbl[1], shape[0], shape[1], caGE.LEFT, caGE.CENTER);
			caGE.pop();
		},
	},
	Rohr: {
		get lbl() {
			return [geoObjects.diameter.cap, "h", geoObjects.diameter.low];
		},
		vals: [10, 10, 5],
		get radiusFactor() {
			return [geoObjects.diameterActive, 1, geoObjects.diameterActive];
		},
		cbRadiusEnable: true,
		get circumference() {
			const valA = geoObjects.valA;
			const valC = geoObjects.valC;
			return Math.PI * 2 * (valA + valC);
		},
		get basearea() {
			const valA = geoObjects.valA;
			const valC = geoObjects.valC;
			return Math.PI * (valA * valA - valC * valC);
		},
		get fullarea() {
			const valA = geoObjects.valA;
			const valC = geoObjects.valC;
			return 2 * Math.PI * (valA * valA - valC * valC + (valA + valC) * geoObjects.valB);
		},
		get volume() {
			const valA = geoObjects.valA;
			const valC = geoObjects.valC;
			return Math.PI * (valA * valA - valC * valC) * geoObjects.valB;
		},
		show() {
			geoObjects.initiateShow();
			let { a, b, c, d, s } = geoObjects.dim;

			const innerE = [a + b - s, d - s / 2];
			const outerE = [a + b, d];
			//  coloured Ellipse
			caGE.angleMode(caGE.DEGREES);

			let shape = [];
			//inner Boundary
			for (let a = 0; a < 360; a += 10) {
				shape.push([outerE[0] * caGE.cos(a), c + outerE[1] * caGE.sin(a)]);
			}
			shape.push([outerE[0], c]);
			//outer Boundary
			for (let a = 360; a >= 0; a -= 10) {
				shape.push([innerE[0] * caGE.cos(a), c + innerE[1] * caGE.sin(a)]);
			}
			caGE.noStroke();
			caGE.beginShape();
			for (const v of shape) {
				caGE.vertex(...v);
			}
			caGE.endShape();

			const outline = [
				[a + b, c],
				[a + b, -c],
				[-(a + b), c],
				[-(a + b), -c],
				[a + b - s, c],
				[a + b - s, -c + (s * 2) / 3],
				[-(a + b - s), c],
				[-(a + b - s), -c + (s * 2) / 3],
				[0, c + d],
			];

			caGE.angleMode(caGE.RADIANS);
			caGE.stroke(globalColors.elements.line);
			caGE.noFill();
			caGE.ellipse(0, c, (a + b) * 2, d * 2);
			caGE.ellipse(0, -c, (a + b) * 2, d * 2);
			caGE.ellipse(0, -c, (a + b - s) * 2, (d - s / 2) * 2);
			caGE.line(...outline[0], ...outline[1]);
			caGE.line(...outline[2], ...outline[3]);

			caGE.strokeWeight(geoObjects.strokeHair);
			caGE.ellipse(0, c, (a + b - s) * 2, (d - s / 2) * 2);
			caGE.line(...outline[4], ...outline[5]);
			caGE.line(...outline[6], ...outline[7]);
			caGE.strokeWeight(geoObjects.strokeBody);

			caGE.fill(globalColors.elements.text);
			caGE.noStroke();
			patternText(this.lbl[0], outline[8], outline[8], caGE.CENTER, caGE.TOP);
			patternText(this.lbl[1], outline[0], outline[1], caGE.LEFT, caGE.CENTER);
			caGE.pop();
		},
	},
	Kegel: {
		get lbl() {
			return [geoObjects.diameter.cap, "h", ""];
		},
		vals: [10, 10, null],
		get radiusFactor() {
			return [geoObjects.diameterActive, 1, 1];
		},
		cbRadiusEnable: true,
		get circumference() {
			const valA = geoObjects.valA;
			return Math.PI * 2 * valA;
		},
		get basearea() {
			const valA = geoObjects.valA;
			return Math.PI * valA * valA;
		},
		get fullarea() {
			const a = geoObjects.valA;
			return Math.PI * a * (geoObjects.valB + a);
		},
		get volume() {
			const a = geoObjects.valA;
			return (Math.PI / 3) * a ** 2 * geoObjects.valB;
		},
		show() {
			geoObjects.initiateShow();
			let { a, b, c, d } = geoObjects.dim;
			const shape = [
				[a + b, c],
				[0, -c],
				[-(a + b), c],
				[0, -c],
				[0, c],
				[0, c + d],
			];

			caGE.ellipse(0, c, (a + b) * 2, d * 2);
			caGE.noFill();
			caGE.line(...shape[0], ...shape[1]);
			caGE.line(...shape[2], ...shape[3]);
			caGE.strokeWeight(geoObjects.strokeHair);
			caGE.line(...shape[3], ...shape[4]);
			caGE.strokeWeight(geoObjects.strokeBody);

			//text
			caGE.fill(globalColors.elements.text);
			caGE.noStroke();
			patternText(this.lbl[0], shape[5], shape[5], caGE.CENTER, caGE.TOP);
			patternText(this.lbl[1], shape[3], shape[4], caGE.LEFT, caGE.CENTER);
			caGE.pop();
		},
	},
	Kugel: {
		get lbl() {
			return [geoObjects.diameter.cap, "", ""];
		},
		vals: [10, null, null],
		get radiusFactor() {
			return [geoObjects.diameterActive, 1, 1];
		},
		cbRadiusEnable: true,
		get circumference() {
			const valA = geoObjects.valA;
			return Math.PI * 2 * valA;
		},
		get basearea() {
			const valA = geoObjects.valA;
			return Math.PI * valA * valA;
		},
		get fullarea() {
			const valA = geoObjects.valA;
			return 4 * Math.PI * valA * valA;
		},
		get volume() {
			const valA = geoObjects.valA;
			return (4 / 3) * Math.PI * valA * valA * valA;
		},
		show() {
			geoObjects.initiateShow();
			let { a, b, c, d } = geoObjects.dim;
			caGE.ellipse(0, 0, (a + b) * 2, d * 2);
			caGE.noFill();
			caGE.circle(0, 0, (a + b) * 2);

			//text
			caGE.fill(globalColors.elements.text);
			caGE.noStroke();
			const shape = [0, d];
			patternText(this.lbl[0], shape, shape, caGE.CENTER, caGE.TOP);
			caGE.pop();
		},
	},
};

initEL({ id: idVin_Area_0, fn: geoBerechnung });
initEL({ id: idVin_Area_1, fn: geoBerechnung });
initEL({ id: idVin_Area_2, fn: geoBerechnung });
initEL({ id: idCb_geoRadius, fn: geoChangeDiameter });

export function clear_cl_Geometrie() {
	geoObjects.elementIndex = geoObjects.elementIndexOrig;
	let parent = dbID("idDiv_GeometrieAreaSelect");
	KadDOM.clearFirstChild(parent);

	for (let i = 0; i < geoObjects.elements.length; i++) {
		KadTable.addCell(
			null,
			{
				names: ["geometrieAreaSelect", i],
				type: "Btn",
				subGroup: " text",
				createClass: ["clBtn_geometrieAreaSelect"],
				text: geoObjects.elements[i],
				ui: {
					uisize: "size7",
				},
				onclick: () => {
					changeGeoObject(i);
				},
			},
			parent
		);
	}
	changeGeoObject(geoObjects.elementIndex);
	dbID("idCb_geoRadius").checked = false;

	let num = document.getElementsByName("naDiv_Area").length;
	for (let i = 0; i < num; i++) {
		dbID(`idVin_Area_${i}`).value = "";
	}
}

function geoChangeDiameter() {
	geoObjects.radState = dbID("idCb_geoRadius").checked;
	let num = document.getElementsByName("naDiv_Area").length;
	for (let i = 0; i < num; i++) {
		if (geoObjects.selected.vals[i]) {
			dbID(`idLbl_Vin_Area_${i}`).innerHTML = geoObjects.selected.lbl[i]; //LABEL
		}
	}
	geoObjects.selected.show();
	geoBerechnung();
}

export function canvas_cl_Geometrie() {
	caGE.resizeCanvas(geometrieOptions.canvas.w, geometrieOptions.canvas.h);
	caGE.redraw();
}

const caGE = new p5((c) => {
	c.setup = function () {
		c.canv = c.createCanvas(geometrieOptions.canvas.w, geometrieOptions.canvas.h);
		c.canv.id("canvasGeometrie");
		c.canv.parent("#idCanv_geometire");
		c.colorMode(c.HSL);
		c.noLoop();
	};
	c.draw = function () {
		geoObjects.selected.show();
	};
}, "#idCanv_geometire");

function patternText(text, v1, v2, posLR, posTB) {
	const x = (v1[0] + v2[0]) / 2 + 3;
	const y = (v1[1] + v2[1]) / 2 + 3;
	caGE.textAlign(posLR, posTB);
	caGE.text(` ${text}`, x, y);
}

function changeGeoObject(index) {
	geoObjects.elementIndex = index;
	let cl = dbCL("clBtn_geometrieAreaSelect", null);
	for (let i = 0; i < cl.length; i++) {
		KadDOM.btnColor(cl[i]);
	}
	KadDOM.btnColor(cl[geoObjects.elementIndex], "positive");
	geoObjects.selected.show();

	let num = document.getElementsByName("naDiv_Area").length;
	for (let i = 0; i < num; i++) {
		if (geoObjects.selected.vals[i]) {
			KadDOM.enableBtn(`idVin_Area_${i}`, true);
			dbID(`idLbl_Vin_Area_${i}`).textContent = geoObjects.selected.lbl[i]; //LABEL
			dbID(`idVin_Area_${i}`).placeholder = geoObjects.selected.vals[i];
		} else {
			KadDOM.enableBtn(`idVin_Area_${i}`, false);
			KadDOM.enableBtn(`idVin_Area_${i}`, false);
			dbID(`idLbl_Vin_Area_${i}`).textContent = ""; //LABEL
			dbID(`idVin_Area_${i}`).placeholder = "";
		}
	}
	KadDOM.enableBtn(idCb_geoRadius, geoObjects.selected.cbRadiusEnable);
	const cbEntry = dbID("idLbl_goeRadius").textContent;
	dbID("idLbl_goeRadius").innerHTML = geoObjects.selected.cbRadiusEnable ? cbEntry : `<del>${cbEntry}</del>`;
	geoBerechnung();
}

//---------------------------
function geoBerechnung() {
	let selectedObj = geoObjects.selected;
	geoObjects.valA = KadDOM.numberFromInput(idVin_Area_0, selectedObj.vals[0]) * selectedObj.radiusFactor[0];
	geoObjects.valB = KadDOM.numberFromInput(idVin_Area_1, selectedObj.vals[1]) * selectedObj.radiusFactor[1];
	geoObjects.valC = KadDOM.numberFromInput(idVin_Area_2, selectedObj.vals[2]) * selectedObj.radiusFactor[2];
	geometrieOptions.result.circumference = KadValue.number(selectedObj.circumference, { decimals: 3 });
	geometrieOptions.result.basearea = KadValue.number(selectedObj.basearea, { decimals: 3 });
	geometrieOptions.result.fullarea = KadValue.number(selectedObj.fullarea, { decimals: 3 });
	geometrieOptions.result.volume = KadValue.number(selectedObj.volume, { decimals: 3 });
	geoUpdateMassDependency();
}

export function geoUpdateMassDependency() {
	let selectedObj = geoObjects.selected;
	geometrieOptions.result.mass = [];
	for (let i = 0; i < geometrieOptions.matList.length; i++) {
		let mass = Data_Materials.Materials[geometrieOptions.matList[i]].roh * 0.001 * selectedObj.volume;
		mass = KadValue.number(mass, { decimals: 4 });
		geometrieOptions.result.mass.push({
			mass: mass,
			matName: geometrieOptions.matList[i],
		});
	}
	geoResultTable();
}

function geoResultTable() {
	KadTable.clear("idTabBody_geometrieResults");
	let unitObj = Object.keys(geometrieOptions.units);
	let unitLength = unitObj.length - 1 + geometrieOptions.result.mass.length;
	for (let i = 0; i < unitLength; i++) {
		let unitName;
		let lblName;
		let resultNum = null;
		if (i < unitObj.length - 1) {
			unitName = unitObj[i];
			lblName = geometrieOptions.units[unitName].name;
		} else {
			unitName = unitObj[unitObj.length - 1];
			resultNum = i - unitObj.length + 1;
			lblName = `${geometrieOptions.units[unitName].name} (${geometrieOptions.result.mass[resultNum].matName})`;
		}
		const row = KadTable.insertRow("idTabBody_geometrieResults");
		//LBL Title
		KadTable.addCell(row, {
			names: ["geoResults", "title", i],
			type: "Lbl",
			text: `${lblName}`,
			cellStyle: {
				textAlign: "left",
				whiteSpace: "nowrap",
			},
		});
		//  LBL Value
		KadTable.addCell(row, {
			names: ["geoResults", "value", i],
			type: "Lbl",
			text: resultNum != null ? geometrieOptions.result[unitName][resultNum].mass : geometrieOptions.result[unitName],
			cellStyle: {
				textAlign: "right",
				whiteSpace: "nowrap",
				widht: "100%",
			},
			copy: true,
		});
		// Lbl unit
		KadTable.addCell(row, {
			names: ["geoResults", "unit", i],
			type: "Lbl",
			get text() {
				let suffixText = geometrieOptions.units[unitName].unit;
				suffixText += geometrieOptions.units[unitName].dim > 1 ? `<sup>${geometrieOptions.units[unitName].dim}</sup>` : "";
				return suffixText;
			},
		});
	}
}
