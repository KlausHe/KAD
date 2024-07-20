import { initEL, KadTable } from "../KadUtils/KadUtils.js";
import { Data_Botanicals } from "../General/MainData.js";

const botanicalsOptions = {
	plant: null,
	discomfort: null,
	plantOrig: "Anis",
	discomfortOrig: "Blutniederdruck",
};
initEL({
	id: idSel_botanicalsPlant,
	fn: botanicalsPlantChange,
	selStartValue: botanicalsOptions.plantOrig,
	selGroup: { "Pflanze wählen": Data_Botanicals.map((obj) => [obj.plant, obj.plant]) },
});
initEL({
	id: idSel_botanicalsDiscomfort,
	fn: botanicalsDiscomfortChange,
	selStartValue: botanicalsOptions.discomfortOrig,
	selGroup: { "Beschwerde wählen": botanicalsPopulateDiscomfort() },
});

export function clear_cl_Botanicals() {
	botanicalsOptions.plant = idSel_botanicalsPlant.KadReset({ selStartValue: botanicalsOptions.plantOrig });
	botanicalsOptions.discomfort = idSel_botanicalsDiscomfort.KadReset({ selStartValue: botanicalsOptions.discomfortOrig });
	botanicalsPlantTable();
	botanicalsDiscomfortTable();
}

function botanicalsPopulateDiscomfort() {
	let discomfortSet = new Set();
	Data_Botanicals.forEach((dis) => dis.discomfort.forEach((item) => discomfortSet.add(item)));
	discomfortSet = Array.from(discomfortSet).sort();
	return discomfortSet.map((d) => [d, d]);
}

function botanicalsPlantChange() {
	botanicalsOptions.plant = idSel_botanicalsPlant.KadGet();
	botanicalsPlantTable();
}

function botanicalsDiscomfortChange() {
	botanicalsOptions.discomfort = idSel_botanicalsDiscomfort.KadGet();
	botanicalsDiscomfortTable();
}

function botanicalsPlantTable() {
	const plant = Data_Botanicals.filter((p) => p.plant == botanicalsOptions.plant)[0];
	KadTable.clear("idTabBody_botanicalsResultPlant");
	let maxA = plant.discomfort ? plant.discomfort.length : 0;
	let maxB = plant.effect ? plant.effect.length : 0;
	let maxLength = Math.max(maxA, maxB);
	for (let i = 0; i < maxLength; i++) {
		const row = KadTable.createRow("idTabBody_botanicalsResultPlant");
		if (plant.discomfort && plant.discomfort[i]) {
			KadTable.addCell(row, {
				names: ["botanicalsDiscomfort", i],
				type: "Lbl",
				text: plant.discomfort[i],
				onclick: () => {
					idSel_botanicalsDiscomfort.KadReset({ selStartValue: plant.discomfort[i] });
					botanicalsDiscomfortChange();
				},
				alias: true,
				createCellClass: [plant.effect && plant.effect[i] ? "clTab_UIBorderThinRight" : null],
			});
		}
		if (plant.effect && plant.effect[i]) {
			KadTable.addCell(row, {
				names: ["botanicalsEffect", i],
				type: "Lbl",
				text: plant.effect[i],
			});
		}
	}
}

function botanicalsDiscomfortTable() {
	const discomfort = botanicalsOptions.discomfort;
	let plantsArray = [];
	Data_Botanicals.forEach((obj) => {
		if (obj.discomfort.includes(discomfort)) {
			plantsArray.push(obj.plant);
		}
	});

	KadTable.clear("idTabBody_botanicalsResultDiscomfort");
	for (let i = 0; i < plantsArray.length; i += 2) {
		const row = KadTable.createRow("idTabBody_botanicalsResultDiscomfort");
		KadTable.addCell(row, {
			names: ["botanicalsPlants", i],
			type: "Lbl",
			text: plantsArray[i],
			createCellClass: [plantsArray[i + 1] !== undefined ? "clTab_UIBorderThinRight" : null],
			onclick: () => {
				idSel_botanicalsPlant.KadReset({ selStartValue: plantsArray[i] });
				botanicalsPlantChange();
			},
			alias: true,
		});

		if (plantsArray[i + 1] == undefined) continue;
		KadTable.addCell(row, {
			names: ["botanicalsPlants", i + 1],
			type: "Lbl",
			text: plantsArray[i + 1],
			onclick: () => {
				idSel_botanicalsPlant.KadReset({ selStartValue: plantsArray[i + 1] });
				botanicalsPlantChange();
			},
			alias: true,
		});
	}
}
