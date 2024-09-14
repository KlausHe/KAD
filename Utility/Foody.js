import { speechSpeakOutput } from "../Benkyou/Speech.js";
import { dbID, initEL, KadDate, KadRandom } from "../KadUtils/KadUtils.js";
const foodyOptions = {
	timerRunning: false,
	timerCount: 0,
	timeTotal: 0,
	timeRemaining: 0,
	foodIndex: 0,
	get chosenFood() {
		return this.data[this.foodIndex];
	},
	preheat: 0,
	preheatOrig: 6,
	data: [
		{
			name: "Baguette",
			time: 15,
			temp: "220C",
		},
		{
			name: "Blätterteig flach",
			time: 12,
			temp: "200C",
		},
		{
			name: "Blätterteig gefüllt",
			time: 20,
			temp: "200C",
		},
		{
			name: "Ei: hart",
			time: 9,
			temp: "Topf",
		},
		{
			name: "Ei: wachs",
			time: 7,
			temp: "Topf",
		},
		{
			name: "Ei: weich",
			time: 5,
			temp: "Topf",
		},
		{
			name: "Fischstäbchen",
			numerus: true,
			time: 16,
			temp: "220C",
		},
		{
			name: "Fleischkas",
			time: 35,
			temp: "180C",
		},
		{
			name: "Fusilli",
			numerus: true,
			time: 11,
			temp: "Topf",
		},
		{
			name: "Gemelli",
			numerus: true,
			time: 10,
			temp: "Topf",
		},
		{
			name: "Kabeljaufilet",
			time: 10,
			temp: "180C",
		},
		{
			name: "Kroketten",
			numerus: true,
			time: 20,
			temp: "200C",
		},
		{
			name: "Lasagne",
			time: 45,
			temp: "180C",
		},
		{
			name: "Laugenbrezel",
			numerus: true,
			time: 15,
			temp: "220C",
		},
		{
			name: "Laugenstangen",
			numerus: true,
			time: 15,
			temp: "200C",
		},
		{
			name: "Parboild Reis",
			time: 17,
			temp: "Topf",
		},
		{
			name: "Penne",
			numerus: true,
			time: 11,
			temp: "Topf",
		},
		{
			name: "Pizza",
			time: 10,
			temp: "220C",
		},
		{
			name: "Pommes",
			numerus: true,
			time: 18,
			temp: "200C",
		},
		{
			name: "Rösti",
			numerus: true,
			time: 22,
			temp: "200C",
		},
		{
			name: "Spaghetti No 1",
			numerus: true,
			time: 3,
			temp: "Topf",
		},
		{
			name: "Spaghetti No 3",
			numerus: true,
			time: 9,
			temp: "Topf",
		},
		{
			name: "Spaghetti No 5",
			numerus: true,
			time: 8,
			temp: "Topf",
		},
	],
};

initEL({ id: idBtn_foodyStart, fn: foodyStartTimer });
initEL({ id: idCb_foodyVoiceOutput, resetValue: false });
initEL({ id: idVin_foodyPreheat, fn: foodyPreheatChange, resetValue: foodyOptions.preheatOrig });
initEL({ id: idSel_foodyType, fn: foodyChangeFood, selStartIndex: 0, selList: foodyOptions.data.map((f, i) => [`${f.name} (${f.time}min)`, i]) });

export function clear_cl_Foody() {
	resetCounter();
	idCb_foodyVoiceOutput.KadReset();
	foodyOptions.preheat = idVin_foodyPreheat.KadReset();
	idSel_foodyType.KadReset({ selStartIndex: KadRandom.randomIndex(foodyOptions.data) });
	foodyDisplayTime();
}

function foodyPreheatChange() {
	foodyOptions.preheat = idVin_foodyPreheat.KadGet();
}

function foodyChangeFood() {
	foodyOptions.foodIndex = idSel_foodyType.KadGet();
}

function foodyStartTimer() {
	foodyOptions.timerRunning = !foodyOptions.timerRunning;
	idBtn_foodyStart.textContent = foodyOptions.timerRunning ? "Stop" : "Start";
}

function foodyDisplayTime() {}

function foodyStartChange() {
	if (foodyOptions.timerRunning) {
		let noTopfPreheat;
		if (foodyOptions.chosenFood.temp != "Topf") {
			noTopfPreheat = foodyOptions.preheat;
		} else {
			noTopfPreheat = 0;
			dbID("idLbl_foodyPreheat").textContent = "---";
		}
		foodyOptions.timeTotal = (foodyOptions.chosenFood.time + noTopfPreheat) * 60;
		foodyOptions.timeRemaining = foodyOptions.timeTotal;
		const bar = dbID("idProg_foodyProgress");
		bar.setAttribute("max", foodyOptions.timeTotal);
		foodyCountdown();
		foodyOptions.timerCount = setInterval(foodyCountdown, 1000);
	} else {
		dbID("idBtn_foodyStart").textContent = "Start";
		clearInterval(foodyOptions.timerCount);
		let textStart = "Foody";
		dbID("idLbl_foodyTime").innerHTML = textStart;
	}
}

function resetCounter() {
	clearInterval(foodyOptions.timerCount);
	foodyOptions.timerRunning = false;
}

function foodyCountdown() {
	foodyOptions.timeRemaining--;
	const bar = dbID("idProg_foodyProgress");
	bar.setAttribute("value", foodyOptions.timeRemaining);
	if (foodyOptions.timeRemaining <= 0) {
		if (dbID("idCb_foodyVoiceOutput").checked) {
			let index = idSel_foodyType.KadGet();
			let s = foodyOptions.data[index].numerus ? "sind" : "ist";
			const sentence = `${foodyOptions.data[index].name} ${s} feritg!`;
			speechSpeakOutput(sentence, "de");
		}
		dbID("idLbl_foodyTime").textContent = "Fertig!";
		clearInterval(foodyOptions.timerCount);
		setTimeout(foodyStartChange, 10000);
	} else {
		let zubereitung = foodyOptions.chosenFood.temp === "Topf" ? " (im Topf)" : " (Ofen bei " + foodyOptions.chosenFood.temp + ")";
		let obj = KadDate.secondsToObj(foodyOptions.timeRemaining);
		dbID("idLbl_foodyTime").textContent = `${obj.h}:${obj.m}:${obj.s} ${zubereitung}`;
	}
}
