import { initEL, KadTable, KadValue } from "../KadUtils/KadUtils.js";
const quickmathOptions = {
	values: { val: 12, i: 42 },
	objects: {
		Multiply: {
			tabID: "idTab_quickmathTableMultiply",
			header: "Multiply",
			get html() {
				return `${quickmathOptions.values.val} x ${quickmathOptions.values.i}`; //\u22C5
			},
			get num() {
				return KadValue.number(quickmathOptions.values.val * quickmathOptions.values.i, { decimals: 3 });
			},
		},
		Divide: {
			tabID: "idTab_quickmathTableDivide",
			header: "Divide",
			get html() {
				return `${quickmathOptions.values.val}/${quickmathOptions.values.i}`; //"Div by 0"
			},
			get num() {
				const res = KadValue.number(quickmathOptions.values.val / quickmathOptions.values.i, { decimals: 3 });
				return quickmathOptions.values.i == 0 ? "-" : res;
			},
		},
		Pow: {
			tabID: "idTab_quickmathTablePow",
			header: "Power",
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
	const vinMin = idVin_quickkmathStart.KadGet();
	const vinMax = idVin_quickkmathEnd.KadGet();
	const start = Math.min(vinMin, vinMax);
	const end = Math.max(vinMin, vinMax) + 1;
	quickmathOptions.values.val = idVin_quickkmathVal.KadGet();

	const operation = op;
	const obj = quickmathOptions.objects[operation];

	const header = [{ data: obj.header, colSpan: 3, settings: { align: "center" } }];
	const dataHtml = [];
	const dataNum = [];
	for (let i = start; i < end; i++) {
		quickmathOptions.values.i = i;
		dataHtml.push(obj.html);
		dataNum.push(obj.num);
	}

	const body = [
		//
		{ data: dataHtml, settings: { align: "left", noBorder: "right" } },
		{ data: "=", settings: { align: "center", noBorder: "right" } },
		{ data: dataNum, settings: { align: "left" } },
	];

	KadTable.createHTMLGrid({ id: obj.tabID, header, body });
}
