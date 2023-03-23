const geometrieOptions = {
	width: 140,
	height: 180,
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
	get matList() {
		return materialOptions.matList;
	},
};

let geoObjects = {
	drawDim: {
		a: 40,
		b: 60,
		c: 20,
		d: 50,
		s: 5,
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
	initiateShow() {
		caGE.clear();
		caGE.textSize(12);
		caGE.push();
		caGE.translate(geometrieOptions.width / 2, geometrieOptions.height / 2);
		caGE.strokeWeight(2);
		caGE.fill(geoObjects.areaCol);
		caGE.stroke(geoObjects.lineCol);
	},
	Cuboid: {
		lbl: ["a", "b", "c"],
		vals: [223, 20, 10],
		cbRadiusEnable: false,
		circumference: {
			text: "2a+2b",
			get formula() {
				return 2 * (geoObjects.valA + geoObjects.valB);
			},
		},
		basearea: {
			text: "a*b",
			get formula() {
				return geoObjects.valA * geoObjects.valB;
			},
		},
		fullarea: {
			text: "2(a*b+b*c+a*c)",
			get formula() {
				return 2 * (geoObjects.valA * geoObjects.valB + geoObjects.valB * geoObjects.valC + geoObjects.valA * geoObjects.valC);
			},
		},
		volume: {
			text: "abc",
			get formula() {
				return geoObjects.valA * geoObjects.valB * geoObjects.valC;
			},
		},
		mass: {
			text: "abc" + "\u03C1",
			get formula() {
				return geoObjects.valA * geoObjects.valB * geoObjects.valC * geometrieOptions.roh * 0.001;
			},
		},
		get show() {
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
				let i = n;
				let k = n + 4;
				let l = ((n + 5) % 4) + 4;
				caGE.line(shape[k].x, shape[k].y, shape[l].x, shape[l].y);
				caGE.line(shape[i].x, shape[i].y, shape[k].x, shape[k].y);
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
		circumference: {
			text: "4a",
			get formula() {
				return 4 * geoObjects.valA;
			},
		},
		basearea: {
			text: "a" + "\u00b2",
			get formula() {
				return geoObjects.valA * geoObjects.valA;
			},
		},
		fullarea: {
			text: "6a" + "\u00b2",
			get formula() {
				return 6 * geoObjects.valA * geoObjects.valA;
			},
		},
		volume: {
			text: "a" + "\u00b3",
			get formula() {
				return geoObjects.valA * geoObjects.valA * geoObjects.valA;
			},
		},
		mass: {
			text: "a" + "\u00b3" + "\u03C1",
			get formula() {
				return geoObjects.valA * geoObjects.valA * geoObjects.valA * geometrieOptions.roh * 0.001;
			},
		},
		get show() {
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
				let i = n;
				let k = n + 4;
				let l = ((n + 5) % 4) + 4;
				caGE.line(shape[k].x, shape[k].y, shape[l].x, shape[l].y);
				caGE.line(shape[i].x, shape[i].y, shape[k].x, shape[k].y);
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
			return [geoDiameter().low, "h", ""];
		},
		vals: [10, 10, null],
		cbRadiusEnable: true,
		circumference: {
			get text() {
				return geoObjects.radState ? `2\u03C0${geoDiameter().low}` : `\u03C0${geoDiameter().low}`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				return Math.PI * 2 * valA;
			},
		},
		basearea: {
			get text() {
				return geoObjects.radState ? `\u03C0${geoDiameter().low}\u00b2` : `\u03C0/4 ${geoDiameter().low}\u00b2`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				return Math.PI * valA * valA;
			},
		},
		fullarea: {
			get text() {
				return geoObjects.radState ? `2\u03C0${geoDiameter().low}\u00b2h` : `\u03C0${geoDiameter().low}(h+${geoDiameter().low}/2)`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor; //valA === R
				return 2 * Math.PI * valA * (geoObjects.valB + valA);
			},
		},
		volume: {
			get text() {
				return geoObjects.radState ? `\u03C0${geoDiameter().low}\u00b2h` : `\u03C0/4 ${geoDiameter().low}\u00b2h`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				return Math.PI * valA * valA * geoObjects.valB;
			},
		},
		mass: {
			get text() {
				return geoObjects.radState ? `\u03C0${geoDiameter().low}\u00b2h\u03C1` : `\u03C0/4 ${geoDiameter().low}\u00b2h\u03C1`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				return Math.PI * valA * valA * geoObjects.valB * geometrieOptions.roh * 0.001;
			},
		},
		get show() {
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
			return [geoDiameter().cap, "h", geoDiameter().low];
		},
		vals: [10, 10, 5],
		cbRadiusEnable: true,
		circumference: {
			get text() {
				return geoObjects.radState ? `2\u03C0(${geoDiameter().cap}+${geoDiameter().low})` : `\u03C0(${geoDiameter().cap}+${geoDiameter().low})`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				const valC = geoObjects.valC * geoDiameter().factor;
				return Math.PI * 2 * (valA + valC);
			},
		},
		basearea: {
			get text() {
				return geoObjects.radState ? `\u03C0(${geoDiameter().cap}\u00b2-${geoDiameter().low}\u00b2)` : `\u03C0/4 (${geoDiameter().cap}\u00b2-${geoDiameter().low}\u00b2)`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				const valC = geoObjects.valC * geoDiameter().factor;
				return Math.PI * (valA * valA - valC * valC);
			},
		},
		fullarea: {
			get text() {
				return geoObjects.radState ? `2\u03C0(${geoDiameter().cap}+${geoDiameter().low})(${geoDiameter().cap}-${geoDiameter().low}+h)` : `\u03C0(${geoDiameter().cap}+${geoDiameter().low})(1/2(${geoDiameter().cap}-${geoDiameter().low})+h)`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				const valC = geoObjects.valC * geoDiameter().factor;
				return 2 * Math.PI * (valA * valA - valC * valC + (valA + valC) * geoObjects.valB);
			},
		},
		volume: {
			get text() {
				return geoObjects.radState ? `\u03C0(${geoDiameter().cap}\u00b2-${geoDiameter().low}\u00b2)h` : `\u03C0/4 (${geoDiameter().cap}\u00b2-${geoDiameter().low}\u00b2)h`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				const valC = geoObjects.valC * geoDiameter().factor;
				return Math.PI * (valA * valA - valC * valC) * geoObjects.valB;
			},
		},
		mass: {
			get text() {
				return geoObjects.radState ? `\u03C0(${geoDiameter().cap}\u00b2-${geoDiameter().low}\u00b2)h\u03C1` : `\u03C0/4 (${geoDiameter().cap}\u00b2-${geoDiameter().low}\u00b2)h\u03C1`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				const valC = geoObjects.valC * geoDiameter().factor;
				return Math.PI * (valA * valA - valC * valC) * geoObjects.valB * geometrieOptions.roh * 0.001;
			},
		},
		get show() {
			geoObjects.initiateShow();
			const innerR = caGE.createVector(geoObjects.drawDim.b, geoObjects.drawDim.c);
			const outerR = caGE.createVector(geoObjects.drawDim.b - geoObjects.drawDim.s, geoObjects.drawDim.c - geoObjects.drawDim.s);
			//  coloured Ellipse
			let shape = [];
			const yOff = geoObjects.drawDim.d;

			caGE.angleMode(caGE.DEGREES);
			//inner Boundary
			for (let a = 0; a < 360; a += 5) {
				shape.push(caGE.createVector(outerR.x * caGE.cos(a), yOff + outerR.y * caGE.sin(a)));
			}
			shape.push(caGE.createVector(outerR.x, yOff));
			//outer Boundary
			for (let a = 360; a >= 0; a -= 5) {
				shape.push(caGE.createVector(innerR.x * caGE.cos(a), yOff + innerR.y * caGE.sin(a)));
			}
			caGE.beginShape();
			for (const v of shape) {
				caGE.vertex(v.x, v.y);
			}
			caGE.endShape();
			caGE.angleMode(caGE.RADIANS);

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
			return [geoDiameter().low, "", ""];
		},
		vals: [10, null, null],
		cbRadiusEnable: true,
		circumference: {
			get text() {
				return geoObjects.radState ? `2\u03C0${geoDiameter().low}` : `\u03C0${geoDiameter().low}`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				return Math.PI * 2 * valA;
			},
		},
		basearea: {
			get text() {
				return geoObjects.radState ? `\u03C0${geoDiameter().low}\u00b2` : `\u03C0/4 ${geoDiameter().low}\u00b2`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				return Math.PI * valA * valA;
			},
		},
		fullarea: {
			get text() {
				return geoObjects.radState ? `4\u03C0${geoDiameter().low}\u00b2` : `\u03C0${geoDiameter().low}\u00b2`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				return 4 * Math.PI * valA * valA;
			},
		},
		volume: {
			get text() {
				return geoObjects.radState ? `4/3 \u03C0${geoDiameter().low}\u00b3` : `1/6 \u03C0${geoDiameter().low}\u00b3`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				return (4 / 3) * Math.PI * valA * valA * valA;
			},
		},
		mass: {
			get text() {
				return geoObjects.radState ? `4/3 \u03C0${geoDiameter().low}\u00b3\u03C1` : `1/6 \u03C0${geoDiameter().low}\u00b3\u03C1`;
			},
			get formula() {
				const valA = geoObjects.valA * geoDiameter().factor;
				return (4 / 3) * Math.PI * valA * valA * valA * geometrieOptions.roh * 0.001;
			},
		},
		get show() {
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

function clear_cl_Geometrie() {
	let parent = dbID("idDiv_GeometrieAreaSelect");
	clearFirstChild(parent);

	for (let i = 0; i < geoObjects.elements.length; i++) {
		tableAddCell(
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

const caGE = new p5((c) => {
	c.setup = function () {
		c.canv = c.createCanvas(geometrieOptions.width, geometrieOptions.height);
		c.canv.id("canvasGeometrie");
		c.canv.parent("#idCanv_geometire");
		c.colorMode(c.HSL);
		c.noLoop();
	};
	c.draw = function () {
		const name = geoObjects.selectedGeo;
		geoObjects[name].show;
	};
}, "#idCanv_geometire");

function geoResize() {
	caGE.resizeCanvas(kaihangaOptions.width, kaihangaOptions.height);
}

// //Draw Geometrie here
function changeGeoObject(index) {
	let cl = dbCL("clBtn_geometrieAreaSelect", null);
	for (let i = 0; i < cl.length; i++) {
		btnColor(cl[i]);
	}
	btnColor(cl[index], "positive");
	geoObjects.selectedGeo = geoObjects.elements[index];
	geoObjects[geoObjects.selectedGeo].show;

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

	enableBtn(idCb_geoRadius, geoObjects[geoObjects.selectedGeo].cbRadiusEnable);
	const cbEntry = dbID("idLbl_goeRadius").textContent;
	dbID("idLbl_goeRadius").innerHTML = geoObjects[geoObjects.selectedGeo].cbRadiusEnable ? cbEntry : `<del>${cbEntry}</del>`;

	geoBerechnung();
}

//---------------------------
function geoBerechnung() {
	// DIESE EINE FUNKTION STEUERT ALLE OUTPUTS!!!
	let selectedObj = geoObjects[geoObjects.selectedGeo];
	geoObjects.valA = numberFromInput("idVin_Area_0", selectedObj.vals[0]);
	geoObjects.valB = numberFromInput("idVin_Area_1", selectedObj.vals[1]);
	geoObjects.valC = numberFromInput("idVin_Area_2", selectedObj.vals[2]);

	selectedObj.circumference.result = checkExponential(selectedObj.circumference.formula, {
		decimals: 4,
		exponent: 2,
	});
	selectedObj.basearea.result = checkExponential(selectedObj.basearea.formula, {
		decimals: 4,
		exponent: 2,
	});
	selectedObj.fullarea.result = checkExponential(selectedObj.fullarea.formula, {
		decimals: 4,
		exponent: 2,
	});
	selectedObj.volume.result = checkExponential(selectedObj.volume.formula, {
		decimals: 4,
		exponent: 2,
	});
	geoUpdateMasse();
	geoResultTable();
}

function geoUpdateMasse() {
	let selectedObj = geoObjects[geoObjects.selectedGeo];
	selectedObj.mass.result = [];
	for (let i = 0; i < geometrieOptions.matList.length; i++) {
		geometrieOptions.roh = Data_Material.Materials[geometrieOptions.matList[i]].roh;
		const mass = checkExponential(selectedObj.mass.formula, geoObjects.acc, 4);
		selectedObj.mass.result.push({
			mass: mass,
			matName: geometrieOptions.matList[i],
		});
	}
}

function geoResultTable() {
	const selectedObj = geoObjects[geoObjects.selectedGeo];
	clearTable("idTabBody_geometrieResults");
	let unitObj = Object.keys(geometrieOptions.units);
	let unitLength = unitObj.length - 1 + selectedObj.mass.result.length;
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
			lblName = `${geometrieOptions.units[unitName].name} (${selectedObj.mass.result[resultNum].matName})`;
		}
		const row = insertTableRow("idTabBody_geometrieResults");

		//LBL Title
		tableAddCell(row, {
			names: ["geoResults", "title", i],
			type: "Lbl",
			text: `${lblName}<br>[${selectedObj[unitName].text}]`,
			cellStyle: {
				textAlign: "left",
				whiteSpace: "nowrap",
			},
		});

		//  LBL Value
		tableAddCell(row, {
			names: ["geoResults", "value", i],
			type: "Lbl",
			text: resultNum != null ? selectedObj[unitName].result[resultNum].mass : selectedObj[unitName].result,
			cellStyle: {
				textAlign: "right",
				whiteSpace: "nowrap",
				widht: "100%",
			},
			copy: true,
		});

		// Lbl unit
		tableAddCell(row, {
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

function valChangeDim(dir, unitName) {
	geoBerechnung();
}

function geoChangeDiameter() {
	geoObjects.radState = dbID("idCb_geoRadius").checked;
	let num = document.getElementsByName("naDiv_Area").length;
	for (let i = 0; i < num; i++) {
		if (geoObjects[geoObjects.selectedGeo].vals[i]) {
			dbID(`idLbl_Vin_Area_${i}`).innerHTML = geoObjects[geoObjects.selectedGeo].lbl[i]; //LABEL
		}
	}
	geoObjects[geoObjects.selectedGeo].show;
	geoBerechnung();
}

function geoDiameter() {
	return {
		low: geoObjects.radState ? "r" : "d",
		cap: geoObjects.radState ? "R" : "D",
		factor: geoObjects.radState ? 1 : 0.5,
	};
}
