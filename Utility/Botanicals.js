import { initEL, dbID, KadTable, log } from "../General/KadUtils.js";
import { Data_Botanicals } from "../General/MainData.js";

initEL({
	id: idSel_botanicalsPlant,
	fn: botanicalsPlantChange,
	selGroup: { "Pflanze wählen": Data_Botanicals.map((obj) => [obj.plant, obj.plant]) },
});
initEL({
	id: idSel_botanicalsDiscomfort,
	fn: botanicalsDiscomfortChange,
	selGroup: { "Beschwerde wählen": botanicalsPopulateDiscomfort() },
});

export function clear_cl_Botanicals() {
	idSel_botanicalsPlant.KadReset();
	idSel_botanicalsDiscomfort.KadReset();

	KadTable.clear("idTabBody_botanicalsResultDiscomfort");
	dbID("idTabHeader_BotanicalPlants").innerHTML = "Gewürze / Kräuter";
	KadTable.clear("idTabBody_botanicalsResultPlant");
	dbID("idTabHeader_BotanicalPlantDiscomfort").innerHTML = "Beschwerden";
	dbID("idTabHeader_BotanicalPlantEffect").innerHTML = "Wirkung";
}

function botanicalsPopulateDiscomfort() {
	let discomfortSet = new Set();
	Data_Botanicals.forEach((dis) => dis.discomfort.forEach((item) => discomfortSet.add(item)));
	discomfortSet = Array.from(discomfortSet).sort();
	return discomfortSet;
}

function botanicalsPlantChange(obj) {
	const sel = obj.target;
	const plant = Data_Botanicals[sel.selectedIndex - 1];
	botanicalsPlantTable(plant);
}

function botanicalsDiscomfortChange(obj) {
	const sel = obj.target;
	let plantsArray = [];
	Data_Botanicals.forEach((obj) => {
		if (obj.discomfort.includes(sel.value)) {
			plantsArray.push(obj.plant);
		}
	});
	botanicalsDiscomfortTable(plantsArray);
}

function botanicalsPlantTable(plant) {
	KadTable.clear("idTabBody_botanicalsResultPlant");
	let maxA = plant.discomfort ? plant.discomfort.length : 0;
	let maxB = plant.effect ? plant.effect.length : 0;
	let maxLength = Math.max(maxA, maxB);
	for (let i = 0; i < maxLength; i++) {
		const row = KadTable.insertRow("idTabBody_botanicalsResultPlant");
		if (plant.discomfort && plant.discomfort[i]) {
			KadTable.addCell(row, {
				names: ["botanicalsDiscomfort", i],
				type: "Lbl",
				text: plant.discomfort[i],
				createCellClass: [plant.effect && plant.effect[i] ? "clTab_UIBorderThinRight" : null],
				copy: true,
			});
		}
		if (plant.effect && plant.effect[i]) {
			KadTable.addCell(row, {
				names: ["botanicalsEffect", i],
				type: "Lbl",
				text: plant.effect[i],
				copy: true,
			});
		}
	}
}

function botanicalsDiscomfortTable(plants) {
	KadTable.clear("idTabBody_botanicalsResultDiscomfort");
	for (let i = 0; i < plants.length; i++) {
		const row = KadTable.insertRow("idTabBody_botanicalsResultDiscomfort");
		KadTable.addCell(row, {
			names: ["botanicalsPlants", i],
			type: "Lbl",
			text: plants[i],
			createCellClass: [plants[i + 1] !== undefined ? "clTab_UIBorderThinRight" : null],
			copy: true,
		});

		if (plants[i + 1] !== undefined) {
			i++;
			KadTable.addCell(row, {
				names: ["botanicalsPlants", i],
				type: "Lbl",
				text: plants[i],
				copy: true,
			});
		}
	}
}
