import { daEL, dbID, KadDOM, KadTable } from "../General/KadUtils.js";
import { Data_Botanicals } from "../General/MainData.js";

daEL(idSel_botanicalsPlant, "change", () => botanicalsPlantChange(idSel_botanicalsPlant));
daEL(idSel_botanicalsPlant, "focus", () => botanicalsPopulateOptions(idSel_botanicalsPlant));
daEL(idSel_botanicalsDiscomfort, "change", () => botanicalsDiscomfortChange(idSel_botanicalsDiscomfort));
daEL(idSel_botanicalsDiscomfort, "focus", () => botanicalsPopulateOptions(idSel_botanicalsDiscomfort));

export function clear_cl_Botanicals() {
	KadDOM.clearFirstChild("idSel_botanicalsPlant");
	KadDOM.clearFirstChild("idSel_botanicalsDiscomfort");
	dbID("idSel_botanicalsPlant").options[0] = new Option("Pflanze wählen");
	dbID("idSel_botanicalsDiscomfort").options[0] = new Option("Beschwerde wählen");
	KadTable.clear("idTabBody_botanicalsResultDiscomfort");
	dbID("idTabHeader_BotanicalPlants").innerHTML = "Gewürze / Kräuter";
	KadTable.clear("idTabBody_botanicalsResultPlant");
	dbID("idTabHeader_BotanicalPlantDiscomfort").innerHTML = "Beschwerden";
	dbID("idTabHeader_BotanicalPlantEffect").innerHTML = "Wirkung";
}

function botanicalsPopulateOptions(type) {
	if (dbID(type.id).options.length > 1) return;
	if (type.id == "idSel_botanicalsPlant") {
		Data_Botanicals.forEach((obj, index) => {
			dbID("idSel_botanicalsPlant").options[index] = new Option(obj.plant);
		});
	} else {
		let discomfortSet = new Set();
		for (let dis of Data_Botanicals) {
			dis.discomfort.forEach((item) => discomfortSet.add(item));
		}
		discomfortSet = Array.from(discomfortSet).sort();
		discomfortSet.forEach((d, index) => {
			dbID("idSel_botanicalsDiscomfort").options[index] = new Option(d);
		});
	}
}

function botanicalsPlantChange(sel) {
	if (sel.selectedIndex > 0) {
		const plant = Data_Botanicals[sel.selectedIndex - 1];
		botanicalsPlantTable(plant);
	}
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
				createCellClass: [plant.effect && plant.effect[i] ? "clTab_borderThinRight" : null],
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

function botanicalsDiscomfortChange(sel) {
	if (sel.selectedIndex > 0) {
		let plantsArray = [];
		Data_Botanicals.forEach((obj) => {
			if (obj.discomfort.includes(sel.value)) {
				plantsArray.push(obj.plant);
			}
		});
		botanicalsDiscomfortTable(plantsArray);
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
			createCellClass: [plants[i + 1] !== undefined ? "clTab_borderThinRight" : null],
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
