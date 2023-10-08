const quickmathOptions = {
	values: {
		val: 12,
		i: 42,
	},
	objects: {
		Multiply: {
			tabID: "idTabBody_quickmathMultiply",
			get html() {
				return `${quickmathOptions.values.val} x ${quickmathOptions.values.i}`; //\u22C5
			},
			get num() {
				return KadUtils.Value.number(quickmathOptions.values.val * quickmathOptions.values.i, { decimals: 3 });
			},
		},
		Divide: {
			tabID: "idTabBody_quickmathDivide",
			get html() {
				return `${quickmathOptions.values.val}/${quickmathOptions.values.i}`; //"Div by 0"
			},
			get num() {
				const res = KadUtils.Value.number(quickmathOptions.values.val / quickmathOptions.values.i, { decimals: 3 });
				return quickmathOptions.values.i == 0 ? "-" : res;
			},
		},
		Pow: {
			tabID: "idTabBody_quickmathPow",
			get html() {
				return `${quickmathOptions.values.val}<sup>${quickmathOptions.values.i}</sup>`;
			},
			get num() {
				return KadUtils.Value.number(quickmathOptions.values.val ** quickmathOptions.values.i, { decimals: 3, notation:"engineering" });
			},
		},
	},
};

function clear_cl_Quickmath() {
	KadUtils.DOM.resetInput("idVin_quickkmathVal", 25);
	KadUtils.DOM.resetInput("idVin_quickkmathStart", 1);
	KadUtils.DOM.resetInput("idVin_quickkmathEnd", 10);
	calcQuickmath();
}

function calcQuickmath() {
	quickmathOptions.values.val = KadUtils.DOM.numberFromInput("idVin_quickkmathVal");
	tableQuickmathCalculate("Multiply");
	tableQuickmathCalculate("Divide");
	tableQuickmathCalculate("Pow");
}

function tableQuickmathCalculate(op) {
	const operation = op;
	const obj = quickmathOptions.objects[operation];
	KadUtils.Table.clear(obj.tabID);
	const vinMin = KadUtils.DOM.numberFromInput("idVin_quickkmathStart");
	const vinMax = KadUtils.DOM.numberFromInput("idVin_quickkmathEnd");
	const start = Math.min(vinMin, vinMax);
	const end = Math.max(vinMin, vinMax) + 1;

	for (let i = start; i < end; i++) {
		quickmathOptions.values.i = i;
		const row = KadUtils.Table.insertRow(obj.tabID);
		//vals
		KadUtils.Table.addCell(row, {
			names: ["quickmath", "op", operation, i],
			type: "Lbl",
			text: obj.html,
			cellStyle: {
				textAlign: "center",
			},
		});

		KadUtils.Table.addCell(row, {
			names: ["quickmath", "eq", operation, i],
			type: "Lbl",
			text: "=",
			cellStyle: {
				textAlign: "center",
			},
		});

		KadUtils.Table.addCell(row, {
			names: ["quickmath", "res", operation, i],
			type: "Lbl",
			text: obj.num,
			copy: true,
		});
	}
}
