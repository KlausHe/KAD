import { initEL, KadValue, KadTable } from "../KadUtils/KadUtils.js";
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

initEL({ id: idVin_quickkmathVal, fn: calcQuickmath, resetValue: 25 });
initEL({ id: idVin_quickkmathStart, fn: calcQuickmath, resetValue: 1 });
initEL({ id: idVin_quickkmathEnd, fn: calcQuickmath, resetValue: 10 });

export function clear_cl_Quickmath() {
	idVin_quickkmathVal.KadReset();
	idVin_quickkmathStart.KadReset();
	idVin_quickkmathEnd.KadReset();
	calcQuickmath();
}

function calcQuickmath() {
	for (let op of Object.keys(quickmathOptions.objects)) {
		tableQuickmathCalculate(op);
	}
}

function tableQuickmathCalculate(op) {
	const operation = op;
	const obj = quickmathOptions.objects[operation];
	KadTable.clear(obj.tabID);
	quickmathOptions.values.val = idVin_quickkmathVal.KadGet();
	const vinMin = idVin_quickkmathStart.KadGet();
	const vinMax = idVin_quickkmathEnd.KadGet();
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
