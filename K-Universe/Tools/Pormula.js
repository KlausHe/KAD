import { daEL, dbID, dbIDStyle, dbCL, KadDOM, KadValue, KadTable } from "../General/KadUtils.js";

const pormulaOptions = {
	valuesOrig: [3, 5, 8],
	messages: [],
	reg: null,
	data: {
		userPoints: [],
		uniquePoints: [],
		uniqueX: [],
		length: 3,
		minLength: 2,
		maxLength: 11,
	},
	selType: null,
	regOptionsOrig: {
		order: 2,
		precision: 4,
	},
	regOptions: {
		order: 2,
		precision: 4,
	},
	types: {
		Linear: {
			calc() {
				pormulaOptions.reg = regression.linear(pormulaOptions.data.userPoints, pormulaOptions.regOptions);
			},
			result(d) {
				let a = d[0] == 0 ? "" : d[0] == 1 ? "x" : `${d[0]}x`;
				let b = d[1] == 0 ? "" : d[1] < 0 ? `${d[1]}` : `+${d[1]}`;
				return `y=${a}${b}`;
			},
			cleaning() {
				if (pormulaOptions.data.uniquePoints.length < 2) {
					pormulaOptions.messages.push(`Zu wenig eindeutige Datenpunkte!`);
					return true;
				}
			},
		},
		Exponential: {
			calc() {
				pormulaOptions.reg = regression.exponential(pormulaOptions.data.userPoints, pormulaOptions.regOptions);
			},
			result(d) {
				let a = d[0] == 1 ? "" : `${d[0]}`;
				let b = d[1] == 0 ? "" : d[1] < 0 ? `${d[1]}x` : `${d[1]}x`;
				return `y=${a}e<sup>${b}</sup>`;
			},
			cleaning() {
				if (pormulaOptions.data.uniquePoints.length < 2) {
					pormulaOptions.messages.push(`Zu wenig eindeutige Datenpunkte!`);
					return true;
				}
			},
		},
		Logarithmus: {
			calc() {
				pormulaOptions.reg = regression.logarithmic(pormulaOptions.data.userPoints, pormulaOptions.regOptions);
			},
			result(d) {
				let p = d[1] < 0 ? "" : "+";

				let a = d[0] == 0 ? "" : `${d[0]}`;
				let b = d[1] == 0 ? "" : d[1] == 1 ? `ln(x)` : `${p}${d[1]}ln(x)`;
				return `y=${a}${b}`;
			},
			cleaning() {
				if (pormulaOptions.data.uniquePoints.length < 2) {
					pormulaOptions.messages.push(`Zu wenig eindeutige Datenpunkte!`);
					return true;
				}
				if (pormulaOptions.data.uniqueX.includes(0)) {
					pormulaOptions.messages.push(`Funktion bei x=0 nicht definiert!`);
					return true;
				}
			},
		},
		Potenz: {
			calc() {
				pormulaOptions.reg = regression.power(pormulaOptions.data.userPoints, pormulaOptions.regOptions);
			},
			result(d) {
				let a = d[0] == 0 ? "" : `${d[0]}`;
				let b = d[1] == 0 ? "" : d[1] == 1 ? "x" : `x<sup>${d[1]}</sup>`;
				return `y=${a}${b}`;
			},
			cleaning() {
				if (pormulaOptions.data.uniquePoints.length < 2) {
					pormulaOptions.messages.push(`Zu wenig eindeutige Datenpunkte!`);
					return true;
				}
				if (pormulaOptions.data.uniqueX.includes(0)) {
					pormulaOptions.messages.push(`Funktion bei x=0 nicht definiert!`);
					return true;
				}
			},
		},
		Polynom: {
			calc() {
				pormulaOptions.reg = regression.polynomial(pormulaOptions.data.userPoints, pormulaOptions.regOptions);
			},
			result(d) {
				d.reverse();
				let text = "";
				for (let i = d.length - 1; i >= 0; i--) {
					let p = text.length == 0 || d[i] < 0 ? "" : "+";
					if (i == 0) {
						text += d[i] == 0 ? "" : `${p}${d[i]}`;
					} else if (i == 1) {
						text += d[i] == 0 ? "" : d[i] == 1 ? `${p}x` : `${p}${d[i]}x`;
					} else {
						text += d[i] == 0 ? "" : d[i] == 1 ? `${p}x<sup>${i}</sup>` : `${p}${d[i]}x<sup>${i}</sup>`;
					}
				}
				return `y=${text}`;
			},
			cleaning() {
				if (pormulaOptions.data.uniquePoints.length < pormulaOptions.regOptions.order) {
					pormulaOptions.messages.push(`Zu wenig eindeutige Datenpunkte!`);
					return true;
				}
				let orderMin = Math.min(pormulaOptions.regOptions.order, pormulaOptions.data.uniquePoints.length);
				if (orderMin < pormulaOptions.regOptions.order) {
					dbID("idVin_pormulaOrder").value = orderMin;
					pormulaOptions.regOptions.order = orderMin;
					pormulaOptions.messages.push(`Order wurde geändert!`);
					return;
				}
			},
		},
	},
};

daEL(idBtn_pormulaBestFit, "click", pormulaBestFit);
daEL(idBtn_pormulaPolyFit, "click", pormulaPolyFit);
daEL(idVin_pormulaPrecision, "input", pormulaCalculate);
daEL(idVin_pormulaOrder, "input", pormulaCalculate);
daEL(idBtn_pormulaSubInput, "click", () => pormulaAddInput(-1));
daEL(idBtn_pormulaAddInput, "click", () => pormulaAddInput(1));
daEL(idVin_pormulaPointEntryA, "input", pormulaCalculate);
daEL(idVin_pormulaPointEntryB, "input", pormulaCalculate);
daEL(idVin_pormulaPointEntryC, "input", pormulaCalculate);

daEL(idVin_Pormula_x0, "input", idVin_Pormula_x0);
daEL(idVin_Pormula_y0, "input", idVin_Pormula_y0);
daEL(idVin_Pormula_x1, "input", idVin_Pormula_x1);
daEL(idVin_Pormula_y1, "input", idVin_Pormula_y1);
daEL(idVin_Pormula_x2, "input", idVin_Pormula_x2);
daEL(idVin_Pormula_y2, "input", idVin_Pormula_y2);
daEL(idVin_Pormula_x3, "input", idVin_Pormula_x3);
daEL(idVin_Pormula_y3, "input", idVin_Pormula_y3);
daEL(idVin_Pormula_x4, "input", idVin_Pormula_x4);
daEL(idVin_Pormula_y4, "input", idVin_Pormula_y4);
daEL(idVin_Pormula_x5, "input", idVin_Pormula_x5);
daEL(idVin_Pormula_y5, "input", idVin_Pormula_y5);
daEL(idVin_Pormula_x6, "input", idVin_Pormula_x6);
daEL(idVin_Pormula_y6, "input", idVin_Pormula_y6);
daEL(idVin_Pormula_x7, "input", idVin_Pormula_x7);
daEL(idVin_Pormula_y7, "input", idVin_Pormula_y7);
daEL(idVin_Pormula_x8, "input", idVin_Pormula_x8);
daEL(idVin_Pormula_y8, "input", idVin_Pormula_y8);
daEL(idVin_Pormula_x9, "input", idVin_Pormula_x9);
daEL(idVin_Pormula_y9, "input", idVin_Pormula_y9);
daEL(idVin_Pormula_x10, "input", idVin_Pormula_x10);
daEL(idVin_Pormula_y10, "input", idVin_Pormula_y10);
daEL(idVin_Pormula_x11, "input", idVin_Pormula_x11);
daEL(idVin_Pormula_y11, "input", idVin_Pormula_y11);

export function clear_cl_Pormula() {
	const selectParent = dbID("idDiv_PormulaTypeSelect");
	KadDOM.clearFirstChild(selectParent);
	for (let i = 0; i < Object.keys(pormulaOptions.types).length; i++) {
		KadTable.addCell(
			null,
			{
				names: ["pormulaTypeSelect", i],
				type: "Btn",
				subGroup: " text",
				createClass: ["clBtn_pormulaTypeSelect"],
				text: Object.keys(pormulaOptions.types)[i],
				onclick: () => {
					pormulaGetType(`idBtn_child_pormulaTypeSelect_${i}`, Object.keys(pormulaOptions.types)[i]);
				},
			},
			selectParent
		);
	}
	pormulaGetType();

	pormulaOptions.regOptions.order = KadDOM.resetInput("idVin_pormulaOrder", pormulaOptions.regOptionsOrig.order);
	pormulaOptions.regOptions.precision = KadDOM.resetInput("idVin_pormulaPrecision", pormulaOptions.regOptionsOrig.precision);
	KadDOM.resetInput("idVin_pormulaPointEntryA", pormulaOptions.valuesOrig[1] * 2);
	KadDOM.resetInput("idVin_pormulaPointEntryB", pormulaOptions.valuesOrig[1] * 5);
	KadDOM.resetInput("idVin_pormulaPointEntryC", pormulaOptions.valuesOrig[1] * 10);

	pormulaOptions.data.length = pormulaOptions.valuesOrig.length;
	const inputParent = dbCL("clDiv_pormulaInput", null);
	for (let i = 0; i < inputParent.length; i++) {
		KadDOM.resetInput(`idVin_Pormula_x${i}`, i < pormulaOptions.data.length ? i + 1 : "", {
			value: i < pormulaOptions.data.length ? i + 1 : "",
		});
		KadDOM.resetInput(`idVin_Pormula_y${i}`, i < pormulaOptions.data.length ? pormulaOptions.valuesOrig[i] : "", {
			value: i < pormulaOptions.data.length ? pormulaOptions.valuesOrig[i] : "",
		});
	}
	pormulaAddInput(0); // initiate hiding/showing of input rows
	pormulaCalculate();
}

function pormulaAddInput(dir) {
	pormulaOptions.data.length += dir;
	pormulaOptions.data.length = KadValue.constrain(pormulaOptions.data.length, pormulaOptions.data.minLength, pormulaOptions.data.maxLength);
	const parent = dbCL("clDiv_pormulaInput", null);
	parent.forEach((p, i) => {
		p.style.display = i < pormulaOptions.data.length ? "block" : "none";
		if (dir == 1 && i == pormulaOptions.data.length - 1) {
			dbID(`idVin_Pormula_x${i}`).value = KadDOM.numberFromInput(`idVin_Pormula_x${i - 1}`) + 1;
			dbID(`idVin_Pormula_y${i}`).value = KadDOM.numberFromInput(`idVin_Pormula_y${i - 1}`) + 1;
		}
	});
	pormulaCalculate();
}

function pormulaGetType(id = null, type) {
	let cl = dbCL("clBtn_pormulaTypeSelect", null);
	for (let i = 0; i < cl.length; i++) {
		KadDOM.btnColor(cl[i]);
	}
	if (id != null) {
		KadDOM.btnColor(id, "positive");
		pormulaOptions.selType = type;
	} else {
		KadDOM.btnColor(cl[0], "positive");
		pormulaOptions.selType = Object.keys(pormulaOptions.types)[0];
	}
	pormulaCalculate();
}

function pormulaReadInputs() {
	//no logic, only gathering informations
	pormulaOptions.regOptions.order = KadDOM.numberFromInput("idVin_pormulaOrder");
	pormulaOptions.regOptions.precision = KadDOM.numberFromInput("idVin_pormulaPrecision");
	pormulaOptions.data.userPoints = [];
	pormulaOptions.data.uniquePoints = [];
	pormulaOptions.data.uniqueX = [];
	for (let i = 0; i < pormulaOptions.data.length; i++) {
		const x = KadDOM.numberFromInput(`idVin_Pormula_x${i}`, i, true);
		const y = KadDOM.numberFromInput(`idVin_Pormula_y${i}`, pormulaOptions.valuesOrig[i], true);
		if (x != null && y != null) {
			pormulaOptions.data.userPoints.push([x, y]);
			if (!pormulaOptions.data.uniqueX.includes(x)) {
				pormulaOptions.data.uniquePoints.push([x, y]);
				pormulaOptions.data.uniqueX.push(x);
			}
		}
	}
}

function pormulaCalculate() {
	pormulaOptions.messages = [];
	pormulaReadInputs();
	const critic = pormulaOptions.types[pormulaOptions.selType].cleaning();
	pormulaInfo();
	if (critic == true) {
		pormulaError();
		return;
	}
	pormulaRegressioin();
}

function pormulaRegressioin() {
	const regType = pormulaOptions.types[pormulaOptions.selType];
	regType.calc();
	pormulaPoint();
	const string = regType.result(pormulaOptions.reg.equation);
	dbID("idP_pormulaResult").innerHTML = string;
	dbID("idLbl_pormulaAccuracy").textContent = `${(pormulaOptions.reg.r2 * 100).toFixed(2)}%`;
}

function pormulaError() {
	dbID("idP_pormulaResult").innerHTML = "---";
	dbID("idLbl_pormulaAccuracy").textContent = "0%";
}

function pormulaBestFit() {
	let types = Object.keys(pormulaOptions.types);
	types.pop();
	let bestType = null;
	let bestR = 0;
	let bestI = null;
	types.forEach((t, i) => {
		const regType = pormulaOptions.types[t];
		regType.calc();
		const cur = pormulaOptions.reg.r2;
		if (bestR < cur) {
			bestR = cur;
			bestType = t;
			bestI = i;
		}
	});

	if (bestType != null) {
		pormulaGetType(`idBtn_child_pormulaTypeSelect_${bestI}`, bestType);
	}
}

function pormulaPolyFit() {
	const polyI = Object.keys(pormulaOptions.types).length - 1;
	const polyName = Object.keys(pormulaOptions.types)[polyI];

	let prevR = null;
	for (let i = 0; i < pormulaOptions.data.uniquePoints.length; i++) {
		const reg = regression.polynomial(pormulaOptions.data.userPoints, {
			order: i,
			precision: pormulaOptions.regOptions.precision,
		});
		const newR = reg.r2;
		if (i == pormulaOptions.data.uniquePoints.length - 1 || newR == 1) {
			pormulaOptions.regOptions.order = i;
			break;
		}
		if (prevR != null && prevR >= newR) {
			pormulaOptions.regOptions.order = i;
			break;
		}
		prevR = newR;
	}

	KadDOM.resetInput("idVin_pormulaOrder", pormulaOptions.regOptions.order);
	pormulaGetType(`idBtn_child_pormulaTypeSelect_${polyI}`, polyName);
}

function pormulaPoint() {
	let p1 = KadDOM.numberFromInput("idVin_pormulaPointEntryA");
	let p2 = KadDOM.numberFromInput("idVin_pormulaPointEntryB");
	let p3 = KadDOM.numberFromInput("idVin_pormulaPointEntryC");
	let r1 = pormulaOptions.reg.predict(p1);
	let r2 = pormulaOptions.reg.predict(p2);
	let r3 = pormulaOptions.reg.predict(p3);
	dbID("idLbl_pormulaPointResultA").textContent = KadValue.number(r1[1], { notation: "scientific", decimals: 2 });
	dbID("idLbl_pormulaPointResultB").textContent = KadValue.number(r2[1], { notation: "scientific", decimals: 2 });
	dbID("idLbl_pormulaPointResultC").textContent = KadValue.number(r3[1], { notation: "scientific", decimals: 2 });
}

function pormulaInfo() {
	if (pormulaOptions.messages.length == 0) {
		dbIDStyle("idDiv_pormulaInfo").display = "none";
	} else {
		let text = "";
		pormulaOptions.messages.forEach((t, i) => {
			if (i > 0) text += "<br>";
			text += t;
		});
		dbID("idLbl_pormulaInfo").innerHTML = text;
		dbIDStyle("idDiv_pormulaInfo").display = "initial";
	}
}
