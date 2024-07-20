import { initEL, dbID, dbIDStyle, dbCL, objectLength, KadDOM, KadValue, KadTable } from "../KadUtils/KadUtils.js";

const pormulaOptions = {
	valuesOrig: [3, 5, 8],
	messages: [],
	reg: null,
	data: {
		userPoints: [],
		uniquePoints: [],
		uniqueX: [],
		size: 3,
		minSize: 2,
		maxSize: 11,
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

initEL({ id: idBtn_pormulaBestFit, fn: pormulaBestFit });
initEL({ id: idBtn_pormulaPolyFit, fn: pormulaPolyFit });
initEL({ id: idVin_pormulaPrecision, fn: pormulaCalculate, resetValue: pormulaOptions.regOptionsOrig.precision });
initEL({ id: idVin_pormulaOrder, fn: pormulaCalculate, resetValue: pormulaOptions.regOptionsOrig.order });
initEL({ id: idBtn_pormulaSubInput, fn: pormulaSubInput });
initEL({ id: idBtn_pormulaAddInput, fn: pormulaAddInput });
initEL({ id: idVin_pormulaPointEntryA, fn: pormulaCalculate, resetValue: pormulaOptions.valuesOrig[0] });
initEL({ id: idVin_pormulaPointEntryB, fn: pormulaCalculate, resetValue: pormulaOptions.valuesOrig[1] });
initEL({ id: idVin_pormulaPointEntryC, fn: pormulaCalculate, resetValue: pormulaOptions.valuesOrig[2] });
initEL({ id: idVin_Pormula_x0, fn: pormulaCalculate, resetValue: 1 });
initEL({ id: idVin_Pormula_y0, fn: pormulaCalculate, resetValue: 1 });
initEL({ id: idVin_Pormula_x1, fn: pormulaCalculate, resetValue: 2 });
initEL({ id: idVin_Pormula_y1, fn: pormulaCalculate, resetValue: 2 });
initEL({ id: idVin_Pormula_x2, fn: pormulaCalculate, resetValue: 3 });
initEL({ id: idVin_Pormula_y2, fn: pormulaCalculate, resetValue: 3 });
initEL({ id: idVin_Pormula_x3, fn: pormulaCalculate, resetValue: 4 });
initEL({ id: idVin_Pormula_y3, fn: pormulaCalculate, resetValue: 4 });
initEL({ id: idVin_Pormula_x4, fn: pormulaCalculate, resetValue: 5 });
initEL({ id: idVin_Pormula_y4, fn: pormulaCalculate, resetValue: 5 });
initEL({ id: idVin_Pormula_x5, fn: pormulaCalculate, resetValue: 6 });
initEL({ id: idVin_Pormula_y5, fn: pormulaCalculate, resetValue: 6 });
initEL({ id: idVin_Pormula_x6, fn: pormulaCalculate, resetValue: 7 });
initEL({ id: idVin_Pormula_y6, fn: pormulaCalculate, resetValue: 7 });
initEL({ id: idVin_Pormula_x7, fn: pormulaCalculate, resetValue: 8 });
initEL({ id: idVin_Pormula_y7, fn: pormulaCalculate, resetValue: 8 });
initEL({ id: idVin_Pormula_x8, fn: pormulaCalculate, resetValue: 9 });
initEL({ id: idVin_Pormula_y8, fn: pormulaCalculate, resetValue: 9 });
initEL({ id: idVin_Pormula_x9, fn: pormulaCalculate, resetValue: 10 });
initEL({ id: idVin_Pormula_y9, fn: pormulaCalculate, resetValue: 10 });
initEL({ id: idVin_Pormula_x10, fn: pormulaCalculate, resetValue: 11 });
initEL({ id: idVin_Pormula_y10, fn: pormulaCalculate, resetValue: 11 });
initEL({ id: idVin_Pormula_x11, fn: pormulaCalculate, resetValue: 12 });
initEL({ id: idVin_Pormula_y11, fn: pormulaCalculate, resetValue: 12 });

export function clear_cl_Pormula() {
	const selectParent = dbID("idDiv_PormulaTypeSelect");
	KadDOM.clearFirstChild(selectParent);
	for (let i = 0; i < objectLength(pormulaOptions.types); i++) {
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

	pormulaOptions.regOptions.order = idVin_pormulaOrder.KadReset();
	pormulaOptions.regOptions.precision = idVin_pormulaPrecision.KadReset();
	idVin_pormulaPointEntryA.KadReset();
	idVin_pormulaPointEntryB.KadReset();
	idVin_pormulaPointEntryC.KadReset();

	pormulaOptions.data.size = pormulaOptions.valuesOrig.length;
	const inputParent = dbCL("clDiv_pormulaInput", null);
	for (let i = 0; i < inputParent.length; i++) {
		const x = i < pormulaOptions.data.size ? i + 1 : "";
		const y = i < pormulaOptions.data.size ? pormulaOptions.valuesOrig[i] : "";
		dbID(`idVin_Pormula_x${i}`).KadReset({ resetValue: x });
		dbID(`idVin_Pormula_y${i}`).KadReset({ resetValue: y });
	}
	pormulaDirInput(0); // initiate hiding/showing of input rows
	pormulaCalculate();
}

function pormulaSubInput() {
	pormulaDirInput(-1);
}
function pormulaAddInput() {
	pormulaDirInput(1);
}
function pormulaDirInput(dir) {
	pormulaOptions.data.size += dir;
	pormulaOptions.data.size = KadValue.constrain(pormulaOptions.data.size, pormulaOptions.data.minSize, pormulaOptions.data.maxSize);
	const parent = dbCL("clDiv_pormulaInput", null);
	parent.forEach((p, i) => {
		p.style.display = i < pormulaOptions.data.size ? "block" : "none";
		if (dir == 1 && i == pormulaOptions.data.size - 1) {
			dbID(`idVin_Pormula_x${i}`).value = dbID(`idVin_Pormula_x${i - 1}`).KadGet() + 1;
			dbID(`idVin_Pormula_y${i}`).value = dbID(`idVin_Pormula_y${i - 1}`).KadGet() + 1;
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
	pormulaOptions.regOptions.order = idVin_pormulaOrder.KadGet();
	pormulaOptions.regOptions.precision = idVin_pormulaPrecision.KadGet();
	pormulaOptions.data.userPoints = [];
	pormulaOptions.data.uniquePoints = [];
	pormulaOptions.data.uniqueX = [];
	for (let i = 0; i < pormulaOptions.data.size; i++) {
		const x = dbID(`idVin_Pormula_x${i}`).KadGet({ failSafe: i, noPlaceholder: true });
		const y = dbID(`idVin_Pormula_y${i}`).KadGet({ failSafe: pormulaOptions.valuesOrig[i], noPlaceholder: true });
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
	const polyI = objectLength(pormulaOptions.types) - 1;
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

	pormulaOptions.regOptions.order = idVin_pormulaOrder.KadReset();

	pormulaGetType(`idBtn_child_pormulaTypeSelect_${polyI}`, polyName);
}

function pormulaPoint() {
	let p1 = idVin_pormulaPointEntryA.KadGet();
	let p2 = idVin_pormulaPointEntryB.KadGet();
	let p3 = idVin_pormulaPointEntryC.KadGet();
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
