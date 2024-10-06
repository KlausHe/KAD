import { layoutCheckCORSandDisableModule } from "../General/Layout.js";
import { KadArray, KadFile, KadTable, initEL, log } from "../KadUtils/KadUtils.js";

const pafadojOptions = {
	get URL() {
		const table = pafadojOptions.headers[pafadojOptions.date][0];
		return `https://www.wikitable2json.com/api/List_of_mass_shootings_in_the_United_States_in_${pafadojOptions.date}?lang=en&cleanRef=true&table=${table}&keyRows=1`;
	},
	headers: {
		2024: [1, ["2024 date", "Dead", "Injured", "Total", "State or territory", "Location"]],
		2023: [0, ["2023 date", "Dead", "Injured", "Total", "State or territory", "Location"]],
		2022: [0, ["Date", "Dead", "Injured", "Total", "State", "Community"]],
		2021: [0, ["Date", "Dead", "Injured", "Total", "State", "Community"]],
		2020: [0, ["Date", "Dead", "Injured", "Total", "State", "Community"]],
		// 2019: [0, ["Date", "Dead", "Injured", "Total", "State", "Community"]],
		2018: [0, ["Date", "Dead", "Injured", "Total", "Community"]],
		2017: [0, ["Date", "Dead", "Injured", "Total", "Location"]],
	},
	date: null,
	data: [],
	dataTotal: {},
	sumHeader: ["Dead", "Injured", "Total"],
	sort: {},
};

initEL({ id: idSel_pafadojSelect, fn: pafadojUpdate, selStartValue: 2024, selList: Object.keys(pafadojOptions.headers).map((year) => [year, year]) });

export function clear_cl_Pafadoj() {
	pafadojOptions.date = idSel_pafadojSelect.KadGet();
	pafadojUpdate();
}

async function pafadojUpdate() {
	pafadojOptions.date = idSel_pafadojSelect.KadGet();
	const { dataTable, error } = await KadFile.loadUrlToJSON({ variable: "dataTable", url: pafadojOptions.URL });
	if (layoutCheckCORSandDisableModule(error, "Pafadoj")) return;
	pafadojOptions.data = [];
	pafadojOptions.dataTotal = { Dead: 0, Injured: 0, Total: 0 };
	for (let row of dataTable[0]) {
		let dataObj = {};
		for (let head of pafadojOptions.headers[pafadojOptions.date][1]) {
			row[head] = Number.isNaN(Number(row[head])) ? row[head] : Number(row[head]);
			dataObj[head] = Number(row[head]) || row[head];
			if (pafadojOptions.sumHeader.includes(head)) {
				pafadojOptions.dataTotal[head] += Number(row[head]);
			}
		}
		pafadojOptions.data.push(dataObj);
	}
	pafadojTableReturn();
}

function pafadojTableReturn() {
	if (pafadojOptions.data.length == 0) return;
	const data = pafadojOptions.data;
	KadTable.clear("idTabHeader_PafadojTable");
	const rowTh = KadTable.createRow("idTabHeader_PafadojTable");
	for (let head of pafadojOptions.headers[pafadojOptions.date][1]) {
		const headText = head == "2024 date" || head == "2023 date" ? "Date" : head;
		KadTable.addHeaderCell(rowTh, {
			names: ["pafadojHeader", head],
			type: "Lbl",
			text: pafadojOptions.sumHeader.includes(headText) ? `${headText}<br> (${pafadojOptions.dataTotal[headText]})` : headText,
			cellStyle: {
				textAlign: "left",
			},
			onclick: () => {
				pafadojSort(head);
			},
		});
	}

	KadTable.clear("idTabBody_PafadojTable");
	for (let i = 0; i < data.length; i++) {
		let row = KadTable.createRow("idTabBody_PafadojTable");
		for (let head of pafadojOptions.headers[pafadojOptions.date][1]) {
			KadTable.addCell(row, {
				names: ["pafadoj", head, i],
				type: "Lbl",
				text: data[i][head],
				cellStyle: {
					textAlign: "left",
				},
			});
		}
	}
}

function pafadojSort(type) {
	pafadojOptions.sort[type] = !pafadojOptions.sort[type];
	pafadojOptions.data = KadArray.sortArrayByKey({ array: pafadojOptions.data, keys: type, inverse: pafadojOptions.sort[type] });
	pafadojTableReturn();
}
