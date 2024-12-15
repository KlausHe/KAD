import { Data_Botanicals } from "../General/MainData.js";
import { initEL, KadTable } from "../KadUtils/KadUtils.js";

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
	const plant = Data_Botanicals.find((p) => p.plant == botanicalsOptions.plant);
	const header = [
		{ data: "Beschwerden", settings: { align: "center" } },
		{ data: "Wirkung", settings: { align: "center" } },
	];
	const body = [{ data: plant.discomfort }, { data: plant.effect }];
	KadTable.createHTMLGrid({ id: idTab_botanicalsTablePlant, header, body });
}

function botanicalsDiscomfortTable() {
	const discomfort = botanicalsOptions.discomfort;
	let plantsArray = Data_Botanicals.filter((item) => item.discomfort.includes(discomfort)).map((item) => item.plant);

	const header = [{ data: "Gewürze / Kräuter", colSpan: 2, settings: { align: "center" } }];
	const body = [{ data: plantsArray, multiColumn: 2 }];
	KadTable.createHTMLGrid({ id: idTab_botanicalsTableDiscomfort, header, body });
}
