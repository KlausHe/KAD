const numberyOptions = {
	pairsOrig: 6,
	pairs: 6,
	maxPlayersOrig: 2,
	playerCount: 2,
	playerID: 0,
	players: [],
	get player() {
		return this.players[this.playerID];
	},
	cells: [],
	cellCurrSel: [],
	isPlaying: false,
	cathegory: null,
	cathegories: {
		Amazon: 30,
		Camping: 26,
		Furniture: 42,
		Sport: 46,
		SeaAnimals: 20,
		Zoo: 29,
	},
	delay: 0,
	get imgCount() {
		return this.cathegories[this.cathegory];
	},
	img(id) {
		return `Data/Images/Numbery/${this.cathegory}/numbery_${this.cathegory}_${id}.svg`;
	},
};

function clear_cl_Numbery() {
	numberyMakePlayers();
	numberyOptions.delay = KadUtils.CSS.getRoot("transitionTimeHide", true) * 1000;
	KadUtils.dbID("idLbl_numberyResult").textContent = "...";
	let selC = KadUtils.dbID("idSel_numberCategory");
	KadUtils.DOM.clearFirstChild("idSel_numberCategory");
	numberyOptions.cathegory = KadUtils.Random.randomObject(Object.keys(numberyOptions.cathegories));
	for (const opt of Object.keys(numberyOptions.cathegories)) {
		const option = document.createElement("OPTION");
		option.textContent = opt;
		option.value = opt;
		if (opt == numberyOptions.cathegory) option.selected = true;
		selC.appendChild(option);
	}
	KadUtils.DOM.resetInput("idVin_numberyPairs", numberyOptions.pairsOrig, {
		max: numberyOptions.imgCount,
	});

	numberyOptions.maxPlayersOrig = globalValues.colors.array.length - 5;
	numberyOptions.playerCount = numberyOptions.maxPlayersOrig;
	KadUtils.DOM.resetInput("idVin_numberyPlayer", 2, { min: 2, max: numberyOptions.maxPlayersOrig });
	numberyOptions.pairs = numberyOptions.pairsOrig;
	numberyOptions.isPlaying = false;
	let inputImg = KadUtils.dbCL("cl_NumberyImages");
	KadUtils.DOM.clearFirstChild(inputImg);
	numberyDisableInputs(true);
}

function numberyDisableInputs() {
	KadUtils.DOM.enableBtn("idVin_numberyPairs", !numberyOptions.isPlaying);
	KadUtils.DOM.enableBtn("idVin_numberyPlayer", !numberyOptions.isPlaying);
	KadUtils.DOM.enableBtn("idSel_numberCategory", !numberyOptions.isPlaying);
	KadUtils.dbID("idBtn_startNumbery").textContent = numberyOptions.isPlaying ? "Stop" : "Start";
}

function numberyLayout(n) {
	let number = n * 2;
	const arr1 = Array.from(Array(number + 1), (_, i) => i).filter((i) => number % i === 0);
	let arrNum = arr1[Math.floor(arr1.length / 2)];
	const min = Math.min(arrNum, Math.floor(number / arrNum));
	const max = Math.max(arrNum, Math.floor(number / arrNum));
	const swt = n > 7 && [9, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43].includes(n);
	return {
		rows: swt ? min : max,
		cols: swt ? max : min,
	};
}

function numberyToggleStart() {
	if (numberyOptions.isPlaying) {
		numberyOptions.isPlaying = false;
		KadUtils.dbID("idLbl_numberyResult").textContent = "...";
	} else {
		numberyOptions.isPlaying = true;
		startNumbery();
	}
	numberyDisableInputs();
}

function numberyPairsChange() {
	if (numberyOptions.isPlaying) return;
	let pairs = KadUtils.DOM.numberFromInput(idVin_numberyPairs);
	numberyOptions.pairs = pairs == "" ? numberyOptions.pairsOrig : Number(pairs);
	startNumbery(true);
}

function numberyPlayerChange() {
	if (numberyOptions.isPlaying) return;
	let nums = KadUtils.DOM.numberFromInput(idVin_numberyPlayer);
	numberyOptions.playerCount = nums == "" ? numberyOptions.maxPlayersOrig : Number(nums);
	numberyMakePlayers();
	numberyScoreBoard();
}

function numberyGameSelect(obj) {
	if (numberyOptions.isPlaying) return;
	numberyOptions.cathegory = KadUtils.DOM.stringFromInput(obj);
	KadUtils.DOM.resetInput("idVin_numberyPairs", numberyOptions.pairsOrig, { max: numberyOptions.imgCount });
}

function numberyRestart() {
	numberyOptions.cells = [];
	numberyOptions.cellCurrSel = [];
	const result = KadUtils.dbID("idLbl_numberyResult");
	result.textContent = `${numberyOptions.player.name}`;
	result.style.removeProperty("--bgcNavbar");
	result.style.removeProperty("--txtNavbar");
	const maxPairs = Math.min(numberyOptions.pairs, Math.floor(numberyOptions.imgCount * 0.5));
	if (maxPairs != numberyOptions.pairs) {
		KadUtils.dbID("idVin_numberyPairs").value = maxPairs;
		numberyOptions.pairs = maxPairs;
	}
}

function startNumbery(userInput = false) {
	if (!userInput) numberyRestart();
	if (!userInput) numberyMakePlayers();
	let imgIDArr = Array.from(Array(numberyOptions.imgCount).keys());
	imgIDArr = KadUtils.Random.shuffleData(imgIDArr);
	imgIDArr = imgIDArr.slice(0, numberyOptions.pairs); // Get sub-array of first n elements after shuffled
	imgIDArr = KadUtils.Random.shuffleData([...imgIDArr, ...imgIDArr]);

	//generate Cells
	let inputImg = KadUtils.dbCL("cl_NumberyImages");
	KadUtils.DOM.clearFirstChild(inputImg);
	const layout = numberyLayout(numberyOptions.pairs);
	for (let i = 0; i < layout.cols; i++) {
		const baseParent = document.createElement("div");
		baseParent.setAttribute("uiFlex", "horizontal");
		for (let j = 0; j < layout.rows; j++) {
			const index = i * layout.rows + j;
			const div = document.createElement("div");
			div.id = `idImg_numberyOptions_${index}`;
			div.setAttribute("data-ID", index);
			div.classList.add("cl_numberyDiv");
			const svg = document.createElement("img");
			svg.src = numberyOptions.img(imgIDArr[index]);
			svg.setAttribute("imgSize", "numbery");
			svg.dataset.imgID = imgIDArr[index];
			svg.classList.add("numbery_imgHidden");
			div.onclick = () => {
				numberyCellClicked(index);
			};
			div.appendChild(svg);
			numberyOptions.cells.push({ div, svg, free: true });
			baseParent.appendChild(div);
		}
		inputImg.appendChild(baseParent);
	}
	numberyScoreBoard();
}

function numberyCellClicked(index) {
	if (numberyOptions.isPlaying) {
		const cell = numberyOptions.cells[index];
		if (!cell.free) return;
		if (numberyOptions.cellCurrSel.includes[index]) return;
		if (numberyOptions.cellCurrSel.length >= 2) return;
		numberyOptions.cellCurrSel.push(index);
		cell.svg.classList.remove("numbery_imgHidden");
		cell.free = false;
		if (numberyOptions.cellCurrSel.length == 2) {
			setTimeout(() => {
				numberyCheckTwo();
			}, numberyOptions.delay);
		}
		numberyScoreBoard();
	}
}

function numberyCheckTwo() {
	const cells = [numberyOptions.cells[numberyOptions.cellCurrSel[0]], numberyOptions.cells[numberyOptions.cellCurrSel[1]]];
	if (cells[0].svg.dataset.imgID == cells[1].svg.dataset.imgID) {
		numberyOptions.player.scored();
		const c = KadUtils.Color.stateAsBool(numberyOptions.player.col, "HSL");
		for (let cell of cells) {
			cell.div.classList.add("numbery_Div");
			cell.svg.classList.add("numbery_Svg");
			cell.div.style.setProperty("--col", KadUtils.Color.formatAsString(numberyOptions.player.col, "HSL"));
			cell.svg.style.setProperty("--inv", c);
		}
	} else {
		cells[0].svg.classList.add("numbery_imgHidden");
		cells[1].svg.classList.add("numbery_imgHidden");
		cells[0].free = true;
		cells[1].free = true;
		numberyNextPlayer();
	}
	numberyOptions.cellCurrSel = [];
	numberyCheckFinished();
}

function numberyNextPlayer() {
	numberyOptions.playerID = (numberyOptions.playerID + 1) % numberyOptions.players.length;
	KadUtils.dbID("idLbl_numberyResult").textContent = `${numberyOptions.player.name}`;
}

function numberyCheckFinished() {
	for (const cell of Object.values(numberyOptions.cells)) {
		if (cell.free) return false;
	}
	numberyToggleStart();
	const result = KadUtils.dbID("idLbl_numberyResult");
	let maxScored = KadUtils.Array.sortArrayByKey(numberyOptions.players, "score", true);
	if (maxScored[0].score == maxScored[1].score) {
		result.textContent = `Tie with ${maxScored[0].score} points`;
	} else {
		result.textContent = `${maxScored[0].name} won!`;
		result.style.setProperty("--bgcNavbar", KadUtils.Color.formatAsString(maxScored[0].col, "HSL"));
		result.style.setProperty("--txtNavbar", KadUtils.Color.stateAsString(maxScored[0].col, "HSL"));
	}
	return true;
}

function numberyScoreBoard() {
	KadUtils.Table.clear("idTabBody_Numbery");
	for (let i = 0; i < numberyOptions.players.length; i++) {
		const row = KadUtils.Table.insertRow("idTabBody_Numbery");
		const isPlayer = i == numberyOptions.playerID;
		// colored Box
		KadUtils.Table.addCell(row, {
			names: ["numbery", i],
			type: "Colbox",
			color: numberyOptions.players[i].col,
			cellStyle: {
				backgroundColor: isPlayer ? numberyOptions.players[i].col : "",
			},
		});
		//Name
		KadUtils.Table.addCell(row, {
			names: ["numberyName", i],
			type: "Lbl",
			text: numberyOptions.players[i].name,
			cellStyle: {
				textAlign: "left",
				backgroundColor: isPlayer ? numberyOptions.players[i].col : "",
			},
		});
		//Score
		KadUtils.Table.addCell(row, {
			names: ["numberyScore", i],
			type: "Lbl",
			text: numberyOptions.players[i].score,
			cellStyle: {
				textAlign: "left",
				backgroundColor: isPlayer ? numberyOptions.players[i].col : "",
			},
		});
	}
}

function numberyMakePlayers() {
	numberyOptions.players = [];
	numberyOptions.playerID = 0;
	let colStart = 5 + KadUtils.Random.randomIndex(globalValues.colors.array.slice(5, globalValues.colors.array.length));
	const step = Math.floor(globalValues.colors.array.length / numberyOptions.playerCount);
	for (let i = 0; i < numberyOptions.playerCount; i++) {
		const colID = (i * step + colStart) % globalValues.colors.array.length;
		numberyOptions.players.push(new NumberyPlayer(i, colID));
	}
}

class NumberyPlayer {
	constructor(i, colID) {
		this.id = i;
		this.name = this.id == 0 ? nuncDiscipuli.short || `Player 1` : (this.name = `Player ${this.id + 1}`);
		this.col = globalValues.colors.array[colID];
		this.score = 0;
	}
	scored() {
		this.score += 2;
		KadUtils.dbID(`idLbl_child_numberyScore_${this.id}`).textContent = this.score;
	}
}
