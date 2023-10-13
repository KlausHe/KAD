const foodyOptions = {
	chosenFood: {},
	timerState: false,
	timerCount: 0,
	timeTotal: 0,
	timeRemaining: 0,
	preheat: 0,
	preheatOrig: 6,
	get preheatLabel() {
		return `${foodyOptions.preheat} min.`;
	},
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

function clear_cl_Foody() {
	clearInterval(foodyOptions.timerCount);
	foodyOptions.timerState = true;
	foodyOptions.preheat = KadUtils.DOM.resetInput("idVin_foodyPreheat", foodyOptions.preheatOrig);
	KadUtils.dbID("idLbl_foodyPreheat").textContent = foodyOptions.preheatLabel;
	for (let i = 0; i < foodyOptions.data.length; i++) {
		KadUtils.dbID("idSel_foodyType").options[i] = new Option(`${foodyOptions.data[i].name} (${foodyOptions.data[i].time}min)`);
	}
	const randomStart = KadUtils.Random.randomIndex(foodyOptions.data);
	KadUtils.dbID("idSel_foodyType").options[randomStart].selected = true;
	foodyStartChange();
}

function foodyStartChange() {
	let index = KadUtils.dbID("idSel_foodyType").selectedIndex;
	foodyOptions.chosenFood = foodyOptions.data[index];
	foodyOptions.timerState = !foodyOptions.timerState;
	if (foodyOptions.timerState) {
		KadUtils.dbID("idBtn_foodyStart").textContent = "Stop";
		let noTopfPreheat;
		if (foodyOptions.chosenFood.temp != "Topf") {
			noTopfPreheat = foodyOptions.preheat;
		} else {
			noTopfPreheat = 0;
			KadUtils.dbID("idLbl_foodyPreheat").textContent = "---";
		}
		foodyOptions.timeTotal = (foodyOptions.chosenFood.time + noTopfPreheat) * 60;
		foodyOptions.timeRemaining = foodyOptions.timeTotal;
		const bar = KadUtils.dbID("idProg_foodyProgress");
		bar.setAttribute("max", foodyOptions.timeTotal);
		foodyCountdown();
		foodyOptions.timerCount = setInterval(foodyCountdown, 1000);
	} else {
		KadUtils.dbID("idBtn_foodyStart").textContent = "Start";
		clearInterval(foodyOptions.timerCount);
		let textStart = "Foody";
		KadUtils.dbID("idLbl_foodyTime").innerHTML = textStart;
	}
}

function foodyPreheatChange() {
	foodyOptions.preheat = KadUtils.dbID("idVin_foodyPreheat").value;
	KadUtils.dbID("idLbl_foodyPreheat").textContent = foodyOptions.preheatLabel;
}

function foodyCountdown() {
	foodyOptions.timeRemaining--;
	const bar = KadUtils.dbID("idProg_foodyProgress");
	bar.setAttribute("value", foodyOptions.timeRemaining);
	if (foodyOptions.timeRemaining <= 0) {
		if (KadUtils.dbID("idCb_foodyVoiceOutput").checked) {
			let index = KadUtils.dbID("idSel_foodyType").selectedIndex;
			let s = foodyOptions.data[index].numerus ? "sind" : "ist";
			const sentence = `${foodyOptions.data[index].name} ${s} feritg!`;
			speechSpeakOutput(sentence, "de");
		}
		KadUtils.dbID("idLbl_foodyTime").textContent = "Fertig!";
		clearInterval(foodyOptions.timerCount);
		setTimeout(foodyStartChange, 10000);
	} else {
		let zubereitung;
		if (foodyOptions.chosenFood.temp === "Topf") {
			zubereitung = " (im Topf)";
		} else {
			zubereitung = " (Ofen bei " + foodyOptions.chosenFood.temp + ")";
		}
		let obj = KadUtils.Date.secondsToObj(foodyOptions.timeRemaining);
		KadUtils.dbID("idLbl_foodyTime").textContent = `${obj.h}:${obj.m}:${obj.s} ${zubereitung}`;
	}
}
