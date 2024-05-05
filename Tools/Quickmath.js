import { daEL, KadValue, KadDOM, KadTable } from "../General/KadUtils.js";
const quickmathOptions = {
	values: { val: 12, i: 42 },
	objects: {
		Multiply: {
			tabID: "idTabBody_quickmathMultiply",
			get html() {
				return `${quickmathOptions.values.val} x ${quickmathOptions.values.i}`; //\u22C5
			},
			get num() {
				return KadValue.number(quickmathOptions.values.val * quickmathOptions.values.i, { decimals: 3 });
			},
		},
		Divide: {
			tabID: "idTabBody_quickmathDivide",
			get html() {
				return `${quickmathOptions.values.val}/${quickmathOptions.values.i}`; //"Div by 0"
			},
			get num() {
				const res = KadValue.number(quickmathOptions.values.val / quickmathOptions.values.i, { decimals: 3 });
				return quickmathOptions.values.i == 0 ? "-" : res;
			},
		},
		Pow: {
			tabID: "idTabBody_quickmathPow",
			get html() {
				return `${quickmathOptions.values.val}<sup>${quickmathOptions.values.i}</sup>`;
			},
			get num() {
				return KadValue.number(quickmathOptions.values.val ** quickmathOptions.values.i, { decimals: 3, notation: "engineering" });
			},
		},
	},
};

daEL(idVin_quickkmathVal, "input", calcQuickmath);
daEL(idVin_quickkmathStart, "input", calcQuickmath);
daEL(idVin_quickkmathEnd, "input", calcQuickmath);

export function clear_cl_Quickmath() {
	KadDOM.resetInput("idVin_quickkmathVal", 25);
	KadDOM.resetInput("idVin_quickkmathStart", 1);
	KadDOM.resetInput("idVin_quickkmathEnd", 10);
	calcQuickmath();
}

function calcQuickmath() {
	quickmathOptions.values.val = KadDOM.numberFromInput("idVin_quickkmathVal");
	tableQuickmathCalculate("Multiply");
	tableQuickmathCalculate("Divide");
	tableQuickmathCalculate("Pow");
}

function tableQuickmathCalculate(op) {
	const operation = op;
	const obj = quickmathOptions.objects[operation];
	KadTable.clear(obj.tabID);
	const vinMin = KadDOM.numberFromInput("idVin_quickkmathStart");
	const vinMax = KadDOM.numberFromInput("idVin_quickkmathEnd");
	const start = Math.min(vinMin, vinMax);
	const end = Math.max(vinMin, vinMax) + 1;

	for (let i = start; i < end; i++) {
		quickmathOptions.values.i = i;
		const row = KadTable.insertRow(obj.tabID);
		//vals
		KadTable.addCell(row, {
			names: ["quickmath", "op", operation, i],
			type: "Lbl",
			text: obj.html,
			cellStyle: {
				textAlign: "center",
			},
		});

		KadTable.addCell(row, {
			names: ["quickmath", "eq", operation, i],
			type: "Lbl",
			text: "=",
			cellStyle: {
				textAlign: "center",
			},
		});

		KadTable.addCell(row, {
			names: ["quickmath", "res", operation, i],
			type: "Lbl",
			text: obj.num,
			copy: true,
		});
	}
}
