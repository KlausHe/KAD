import { daEL, dbID } from "../General/KadUtils.js";
import { globalP5 } from "../Main.js";
const boredomOptions = {
	url: "https://www.boredapi.com/api/activity",
};
daEL(idBtn_boredomStart, "click", boredomStart);

export function clear_cl_Boredom() {
	dbID("idArea_boredomAnswer").value = "";
	dbID("idArea_boredomAnswer").placeholder = "Activitätengenerator...";
	boredomStart();
}

function boredomStart() {
	dbID("idArea_boredomAnswer").value = "searching...";
	globalP5.loadJSON(boredomOptions.url, boredomGetData, "json");
}

function boredomGetData(data) {
	dbID("idArea_boredomAnswer").value = `${data.activity}.`;
}
