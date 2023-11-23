import { daEL, dbID, dbIDStyle, dbCL, KadValue, KadDOM, KadTable } from "../General/KadUtils.js";
import { Data_Materials } from "../General/MainData.js";
import { globalValues } from "../Settings/Basics.js";
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
	get drawDim() {
		const h = geometrieOptions.canvas.h;
		return {
			a: h / 4.5,
			b: h / 3,
			c: h / 9,
			d: h / 3.6,
			s: h / 36,
		};
	},
	elements: ["Cuboid", "Cube", "Cylinder", "Pipe", "Sphere"],
	names: ["Quader", "Würfel", "Zylinder", "Rohr", "Kugel"],
	selectedGeo: "Cuboid",
	radState: false,
	valA: null,
	valB: null,
	valC: null,
	get lineCol() {
		return globalValues.colors.elements.line;
	},
	get textCol() {
		return globalValues.colors.elements.text;
	},
	get areaCol() {
		return globalValues.colors.elements.baseColor;
	},
	get diameter() {
		return this.radState ? { low: "r", cap: "R", factor: 1 } : { low: "d", cap: "D", factor: 0.5 };
	},
	initiateShow() {
		caGE.clear();
		caGE.textSize(globalValues.mediaSizes.fontSize);
		caGE.push();
		caGE.translate(geometrieOptions.canvas.w / 2, geometrieOptions.canvas.h / 2);
		caGE.strokeWeight(2);
		caGE.fill(geoObjects.areaCol);
		caGE.stroke(geoObjects.lineCol);
	},
	Cuboid: {
		lbl: ["a", "b", "c"],
		vals: [223, 20, 10],
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
		get mass() {
			return geoObjects.valA * geoObjects.valB * geoObjects.valC * geometrieOptions.roh * 0.001;
		},
		show() {
			const shape = [
				caGE.createVector(geoObjects.drawDim.b, -geoObjects.drawDim.c + geoObjects.drawDim.d / 2),
				caGE.createVector(geoObjects.drawDim.a, geoObjects.drawDim.c + geoObjects.drawDim.d / 2),
				caGE.createVector(-geoObjects.drawDim.b, geoObjects.drawDim.c + geoObjects.drawDim.d / 2),
				caGE.createVector(-geoObjects.drawDim.a, -geoObjects.drawDim.c + geoObjects.drawDim.d / 2),
				caGE.createVector(geoObjects.drawDim.b, -geoObjects.drawDim.c - geoObjects.drawDim.d / 2),
				caGE.createVector(geoObjects.drawDim.a, geoObjects.drawDim.c - geoObjects.drawDim.d / 2),
				caGE.createVector(-geoObjects.drawDim.b, geoObjects.drawDim.c - geoObjects.drawDim.d / 2),
				caGE.createVector(-geoObjects.drawDim.a, -geoObjects.drawDim.c - geoObjects.drawDim.d / 2),
			];
			geoObjects.initiateShow();
			//Grundfläche
			caGE.beginShape();
			for (let i = 0; i < 4; i++) {
				caGE.vertex(shape[i].x, shape[i].y);
			}
			caGE.endShape(caGE.CLOSE);
			for (let n = 0; n < 4; n++) {
				const k = n + 4;
				const l = ((n + 5) % 4) + 4;
				caGE.line(shape[k].x, shape[k].y, shape[l].x, shape[l].y);
				caGE.line(shape[n].x, shape[n].y, shape[k].x, shape[k].y);
			}
			//text
			caGE.fill(geoObjects.textCol);
			caGE.noStroke();
			caGE.textAlign(caGE.CENTER, caGE.TOP);
			let x = (shape[1].x + shape[2].x) / 2;
			let y = (shape[1].y + shape[2].y) / 2;
			caGE.text(` ${this.lbl[0]}`, x, y);
			caGE.textAlign(caGE.LEFT, caGE.CENTER);
			x = (shape[0].x + shape[1].x) / 2;
			y = (shape[0].y + shape[1].y) / 2;
			caGE.text(` ${this.lbl[1]}`, x, y);
			caGE.textAlign(caGE.LEFT, caGE.CENTER);
			x = (shape[0].x + shape[4].x) / 2;
			y = (shape[0].y + shape[4].y) / 2;
			caGE.text(` ${this.lbl[2]}`, x, y);
			caGE.pop();
		},
	},
	Cube: {
		lbl: ["a", "", ""],
		vals: [10, null, null],
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
		get mass() {
			return geoObjects.valA * geoObjects.valA * geoObjects.valA * geometrieOptions.roh * 0.001;
		},
		show() {
			const shape = [
				caGE.createVector(geoObjects.drawDim.b, -geoObjects.drawDim.c + geoObjects.drawDim.d),
				caGE.createVector(geoObjects.drawDim.a, geoObjects.drawDim.c + geoObjects.drawDim.d),
				caGE.createVector(-geoObjects.drawDim.b, geoObjects.drawDim.c + geoObjects.drawDim.d),
				caGE.createVector(-geoObjects.drawDim.a, -geoObjects.drawDim.c + geoObjects.drawDim.d),
				caGE.createVector(geoObjects.drawDim.b, -geoObjects.drawDim.c - geoObjects.drawDim.d),
				caGE.createVector(geoObjects.drawDim.a, geoObjects.drawDim.c - geoObjects.drawDim.d),
				caGE.createVector(-geoObjects.drawDim.b, geoObjects.drawDim.c - geoObjects.drawDim.d),
				caGE.createVector(-geoObjects.drawDim.a, -geoObjects.drawDim.c - geoObjects.drawDim.d),
			];
			geoObjects.initiateShow();
			//Grundfläche
			caGE.beginShape();
			for (let i = 0; i < 4; i++) {
				caGE.vertex(shape[i].x, shape[i].y);
			}
			caGE.endShape(caGE.CLOSE);

			for (let n = 0; n < 4; n++) {
				let k = n + 4;
				let l = ((n + 5) % 4) + 4;
				caGE.line(shape[k].x, shape[k].y, shape[l].x, shape[l].y);
				caGE.line(shape[n].x, shape[n].y, shape[k].x, shape[k].y);
			}

			//text
			caGE.fill(globalValues.colors.elements.text);
			caGE.noStroke();
			caGE.textAlign(caGE.CENTER, caGE.TOP);
			let x = (shape[1].x + shape[2].x) / 2;
			let y = (shape[1].y + shape[2].y) / 2;
			caGE.text(` ${this.lbl[0]}`, x, y);
			caGE.textAlign(caGE.LEFT, caGE.CENTER);
			x = (shape[0].x + shape[1].x) / 2;
			y = (shape[0].y + shape[1].y) / 2;
			caGE.text(` ${this.lbl[0]}`, x, y);
			caGE.textAlign(caGE.LEFT, caGE.CENTER);
			x = (shape[0].x + shape[4].x) / 2;
			y = (shape[0].y + shape[4].y) / 2;
			caGE.text(` ${this.lbl[0]}`, x, y);
			caGE.pop();
		},
	},
	Cylinder: {
		get lbl() {
			return [geoObjects.diameter.low, "h", ""];
		},
		vals: [10, 10, null],
		cbRadiusEnable: true,
		get circumference() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			return Math.PI * 2 * valA;
		},
		get basearea() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			return Math.PI * valA * valA;
		},
		get fullarea() {
			const valA = geoObjects.valA * geoObjects.diameter.factor; //valA === R
			return 2 * Math.PI * valA * (geoObjects.valB + valA);
		},
		get volume() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			return Math.PI * valA * valA * geoObjects.valB;
		},
		get mass() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			return Math.PI * valA * valA * geoObjects.valB * geometrieOptions.roh * 0.001;
		},
		show() {
			geoObjects.initiateShow();
			caGE.line(geoObjects.drawDim.b, geoObjects.drawDim.d, geoObjects.drawDim.b, -geoObjects.drawDim.d);
			caGE.line(-geoObjects.drawDim.b, geoObjects.drawDim.d, -geoObjects.drawDim.b, -geoObjects.drawDim.d);
			caGE.ellipse(0, geoObjects.drawDim.d, geoObjects.drawDim.b * 2, geoObjects.drawDim.c * 2);
			caGE.noFill();
			caGE.ellipse(0, -geoObjects.drawDim.d, geoObjects.drawDim.b * 2, geoObjects.drawDim.c * 2);

			//text
			caGE.fill(globalValues.colors.elements.text);
			caGE.noStroke();
			caGE.textAlign(caGE.CENTER, caGE.TOP);
			caGE.text(` ${this.lbl[0]}`, 0, geoObjects.drawDim.c + geoObjects.drawDim.d + geoObjects.drawDim.s);
			caGE.textAlign(caGE.LEFT, caGE.CENTER);
			caGE.text(` ${this.lbl[1]}`, geoObjects.drawDim.b, 0);
			caGE.pop();
		},
	},
	Pipe: {
		get lbl() {
			return [geoObjects.diameter.cap, "h", geoObjects.diameter.low];
		},
		vals: [10, 10, 5],
		cbRadiusEnable: true,
		get circumference() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			const valC = geoObjects.valC * geoObjects.diameter.factor;
			return Math.PI * 2 * (valA + valC);
		},
		get basearea() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			const valC = geoObjects.valC * geoObjects.diameter.factor;
			return Math.PI * (valA * valA - valC * valC);
		},
		get fullarea() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			const valC = geoObjects.valC * geoObjects.diameter.factor;
			return 2 * Math.PI * (valA * valA - valC * valC + (valA + valC) * geoObjects.valB);
		},
		get volume() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			const valC = geoObjects.valC * geoObjects.diameter.factor;
			return Math.PI * (valA * valA - valC * valC) * geoObjects.valB;
		},
		get mass() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			const valC = geoObjects.valC * geoObjects.diameter.factor;
			return Math.PI * (valA * valA - valC * valC) * geoObjects.valB * geometrieOptions.roh * 0.001;
		},
		show() {
			geoObjects.initiateShow();
			const innerR = caGE.createVector(geoObjects.drawDim.b, geoObjects.drawDim.c);
			const outerR = caGE.createVector(geoObjects.drawDim.b - geoObjects.drawDim.s, geoObjects.drawDim.c - geoObjects.drawDim.s);
			//  coloured Ellipse
			let shape = [];
			const yOff = geoObjects.drawDim.d;
			caGE.angleMode(caGE.DEGREES);
			//inner Boundary
			for (let a = 0; a < 360; a += 10) {
				shape.push(caGE.createVector(outerR.x * caGE.cos(a), yOff + outerR.y * caGE.sin(a)));
			}
			shape.push(caGE.createVector(outerR.x, yOff));
			//outer Boundary
			for (let a = 360; a >= 0; a -= 10) {
				shape.push(caGE.createVector(innerR.x * caGE.cos(a), yOff + innerR.y * caGE.sin(a)));
			}
			caGE.noStroke();
			caGE.beginShape();
			for (const v of shape) {
				caGE.vertex(v.x, v.y);
			}
			caGE.endShape();
			caGE.angleMode(caGE.RADIANS);
			caGE.stroke(geoObjects.lineCol);
			caGE.noFill();
			caGE.ellipse(0, -geoObjects.drawDim.d, innerR.x * 2, innerR.y * 2);
			caGE.ellipse(0, -geoObjects.drawDim.d, outerR.x * 2, outerR.y * 2);
			caGE.ellipse(0, geoObjects.drawDim.d, innerR.x * 2, innerR.y * 2);
			caGE.ellipse(0, geoObjects.drawDim.d, outerR.x * 2, outerR.y * 2);
			caGE.line(geoObjects.drawDim.b - geoObjects.drawDim.s, geoObjects.drawDim.d, geoObjects.drawDim.b - geoObjects.drawDim.s, -geoObjects.drawDim.d + geoObjects.drawDim.s * 2);
			caGE.line(geoObjects.drawDim.b, geoObjects.drawDim.d, geoObjects.drawDim.b, -geoObjects.drawDim.d);
			caGE.line(-geoObjects.drawDim.b + geoObjects.drawDim.s, geoObjects.drawDim.d, -geoObjects.drawDim.b + geoObjects.drawDim.s, -geoObjects.drawDim.d + geoObjects.drawDim.s * 2);
			caGE.line(-geoObjects.drawDim.b, geoObjects.drawDim.d, -geoObjects.drawDim.b, -geoObjects.drawDim.d);

			//text
			caGE.fill(globalValues.colors.elements.text);
			caGE.noStroke();
			caGE.textAlign(caGE.CENTER, caGE.TOP);
			caGE.text(` ${this.lbl[0]}`, 0, geoObjects.drawDim.c + geoObjects.drawDim.d + geoObjects.drawDim.s);
			caGE.textAlign(caGE.CENTER, caGE.BOTTOM);
			caGE.text(` ${this.lbl[2]}`, 0, geoObjects.drawDim.c + geoObjects.drawDim.d - geoObjects.drawDim.s);
			caGE.textAlign(caGE.LEFT, caGE.CENTER);
			caGE.text(` ${this.lbl[1]}`, geoObjects.drawDim.b, 0);
			caGE.pop();
		},
	},
	Sphere: {
		get lbl() {
			return [geoObjects.diameter.low, "", ""];
		},
		vals: [10, null, null],
		cbRadiusEnable: true,
		get circumference() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			return Math.PI * 2 * valA;
		},
		get basearea() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			return Math.PI * valA * valA;
		},
		get fullarea() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			return 4 * Math.PI * valA * valA;
		},
		get volume() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			return (4 / 3) * Math.PI * valA * valA * valA;
		},
		get mass() {
			const valA = geoObjects.valA * geoObjects.diameter.factor;
			return (4 / 3) * Math.PI * valA * valA * valA * geometrieOptions.roh * 0.001;
		},
		show() {
			geoObjects.initiateShow();
			caGE.ellipse(0, 0, geoObjects.drawDim.b * 2, geoObjects.drawDim.c * 2);
			caGE.noFill();
			caGE.ellipse(0, 0, geoObjects.drawDim.b * 2, geoObjects.drawDim.b * 2);
			//text
			caGE.fill(globalValues.colors.elements.text);
			caGE.noStroke();
			caGE.textAlign(caGE.CENTER, caGE.TOP);
			caGE.text(` ${this.lbl[0]}`, 0, geoObjects.drawDim.c + geoObjects.drawDim.s);
			caGE.pop();
		},
	},
};

daEL(idVin_Area_0, "input", geoBerechnung);
daEL(idVin_Area_1, "input", geoBerechnung);
daEL(idVin_Area_2, "input", geoBerechnung);
daEL(idCb_geoRadius, "click", geoChangeDiameter);

export function clear_cl_Geometrie() {
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
				text: geoObjects.names[i],
				onclick: () => {
					changeGeoObject(i);
				},
			},
			parent
		);
	}
	changeGeoObject(0);
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
		if (geoObjects[geoObjects.selectedGeo].vals[i]) {
			dbID(`idLbl_Vin_Area_${i}`).innerHTML = geoObjects[geoObjects.selectedGeo].lbl[i]; //LABEL
		}
	}
	geoObjects[geoObjects.selectedGeo].show();
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
		const name = geoObjects.selectedGeo;
		geoObjects[name].show();
	};
}, "#idCanv_geometire");

// //Draw Geometrie here
function changeGeoObject(index) {
	let cl = dbCL("clBtn_geometrieAreaSelect", null);
	for (let i = 0; i < cl.length; i++) {
		KadDOM.btnColor(cl[i]);
	}
	KadDOM.btnColor(cl[index], "positive");
	geoObjects.selectedGeo = geoObjects.elements[index];
	geoObjects[geoObjects.selectedGeo].show();

	let num = document.getElementsByName("naDiv_Area").length;
	for (let i = 0; i < num; i++) {
		if (geoObjects[geoObjects.selectedGeo].vals[i]) {
			dbIDStyle(`idDiv_Area_${i}`).display = "initial";
			dbID(`idLbl_Vin_Area_${i}`).textContent = geoObjects[geoObjects.selectedGeo].lbl[i]; //LABEL
			dbID(`idVin_Area_${i}`).placeholder = geoObjects[geoObjects.selectedGeo].vals[i];
		} else {
			dbIDStyle(`idDiv_Area_${i}`).display = "none";
		}
	}
	KadDOM.enableBtn(idCb_geoRadius, geoObjects[geoObjects.selectedGeo].cbRadiusEnable);
	const cbEntry = dbID("idLbl_goeRadius").textContent;
	dbID("idLbl_goeRadius").innerHTML = geoObjects[geoObjects.selectedGeo].cbRadiusEnable ? cbEntry : `<del>${cbEntry}</del>`;
	geoBerechnung();
}

//---------------------------
function geoBerechnung() {
	let selectedObj = geoObjects[geoObjects.selectedGeo];
	geoObjects.valA = KadDOM.numberFromInput("idVin_Area_0", selectedObj.vals[0]);
	geoObjects.valB = KadDOM.numberFromInput("idVin_Area_1", selectedObj.vals[1]);
	geoObjects.valC = KadDOM.numberFromInput("idVin_Area_2", selectedObj.vals[2]);
	geometrieOptions.result.circumference = KadValue.number(selectedObj.circumference, { decimals: 3 });
	geometrieOptions.result.basearea = KadValue.number(selectedObj.basearea, { decimals: 3 });
	geometrieOptions.result.fullarea = KadValue.number(selectedObj.fullarea, { decimals: 3 });
	geometrieOptions.result.volume = KadValue.number(selectedObj.volume, { decimals: 3 });
	geoUpdateMasse();
	geoResultTable();
}

export function geoUpdateMasse() {
	let selectedObj = geoObjects[geoObjects.selectedGeo];
	geometrieOptions.result.mass = [];
	for (let i = 0; i < geometrieOptions.matList.length; i++) {
		geometrieOptions.roh = Data_Materials.Materials[geometrieOptions.matList[i]].roh;
		const mass = KadValue.number(selectedObj.mass, { decimals: 4 });
		geometrieOptions.result.mass.push({
			mass: mass,
			matName: geometrieOptions.matList[i],
		});
	}
}

export function geoResultTable() {
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
