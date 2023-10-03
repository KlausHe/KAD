const numberyOptions = {
	pairsOrig: 6,
	pairs: 6,
	maxPlayersOrig: 2,
	maxPlayers: 2,
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
	numberyOptions.delay = getCssRoot("transitionTimeHide", true) * 1000;
	dbID("idLbl_numberyResult").textContent = "...";
	let selC = dbID("idSel_numberCategory");
	clearFirstChild("idSel_numberCategory");
	numberyOptions.cathegory = randomObject(Object.keys(numberyOptions.cathegories));
	for (const opt of Object.keys(numberyOptions.cathegories)) {
		const option = document.createElement("OPTION");
		option.textContent = opt;
		option.value = opt;
		if (opt == numberyOptions.cathegory) option.selected = true;
		selC.appendChild(option);
	}
	utilsResetInput("idVin_numberyPairs", numberyOptions.pairsOrig, {
		max: numberyOptions.imgCount,
	});
	utilsResetInput("idVin_numberyPlayer", numberyOptions.maxPlayersOrig);

	numberyOptions.pairs = numberyOptions.pairsOrig;
	numberyOptions.maxPlayers = numberyOptions.maxPlayersOrig;
	numberyOptions.isPlaying = false;
	let inputImg = dbCL("cl_NumberyImages");
	clearFirstChild(inputImg);
	numberyDisableInputs(true);
}

function numberyDisableInputs() {
	utilsEnableBtn("idVin_numberyPairs", !numberyOptions.isPlaying);
	utilsEnableBtn("idVin_numberyPlayer", !numberyOptions.isPlaying);
	utilsEnableBtn("idSel_numberCategory", !numberyOptions.isPlaying);
	dbID("idBtn_startNumbery").textContent = numberyOptions.isPlaying ? "Stop" : "Start";
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
		dbID("idLbl_numberyResult").textContent = "...";
	} else {
		numberyOptions.isPlaying = true;
		startNumbery();
	}
	numberyDisableInputs();
}

function numberyPairsChange() {
	if (numberyOptions.isPlaying) return;
	let pairs = idVin_numberyPairs.value;
	numberyOptions.pairs = pairs == "" ? numberyOptions.pairsOrig : Number(pairs);
}

function numberyPlayerChange() {
	if (numberyOptions.isPlaying) return;
	let nums = idVin_numberyPlayer.value;
	numberyOptions.maxPlayers = nums == "" ? numberyOptions.maxPlayersOrig : Number(nums);
}

function numberyGameSelect(obj) {
	if (numberyOptions.isPlaying) return;
	numberyOptions.cathegory = utilsNumberFromInput(obj);
}

function numberyRestart() {
	numberyOptions.players = [];
	numberyOptions.cells = [];
	numberyOptions.cellCurrSel = [];
	let colStart = randomIndex(globalValues.colors.array.slice(5, globalValues.colors.array.length));
	for (let i = 0; i < numberyOptions.maxPlayers; i++) {
		numberyOptions.players.push(new NumberyPlayer(i, colStart + 5));
	}
	const result = dbID("idLbl_numberyResult");
	result.textContent = `${numberyOptions.player.name}`;
	result.style.removeProperty("--bgcNavbar");
	result.style.removeProperty("--txtNavbar");
	//check if pairs are possible with the current cethegory
	let maxPairs = Math.min(numberyOptions.pairs, Math.floor(numberyOptions.imgCount * 0.5));
	if (maxPairs != numberyOptions.pairs) {
		dbID("idVin_numberyPairs").value = maxPairs;
		numberyOptions.pairs = maxPairs;
	}
}

function startNumbery() {
	numberyRestart();
	//random double-Array of ImageID
	let imgIDArr = Array.from(Array(numberyOptions.imgCount).keys());
	imgIDArr = shuffleData(imgIDArr);
	imgIDArr = imgIDArr.slice(0, numberyOptions.pairs); // Get sub-array of first n elements after shuffled
	imgIDArr = shuffleData([...imgIDArr, ...imgIDArr]);

	//generate Cells
	let inputImg = dbCL("cl_NumberyImages");
	clearFirstChild(inputImg);
	const layout = numberyLayout(numberyOptions.pairs);
	for (let i = 0; i < layout.cols; i++) {
		const baseParent = document.createElement("div");
		baseParent.setAttribute("uiFlex", "horizontal");
		// baseParent.id = `idDiv_numberyOptionsImages${i}`;
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
			numberyOptions.cells.push({
				div,
				svg,
				free: true,
			});
			baseParent.appendChild(div);
		}
		inputImg.appendChild(baseParent);
	}
	nuScoreBoard();
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
		nuScoreBoard();
	}
}

function numberyCheckTwo() {
	const cells = [numberyOptions.cells[numberyOptions.cellCurrSel[0]], numberyOptions.cells[numberyOptions.cellCurrSel[1]]];
	if (cells[0].svg.dataset.imgID == cells[1].svg.dataset.imgID) {
		numberyOptions.player.scored();
		const c = utilsColor.stateAsBool(numberyOptions.player.col, "HSL");
		for (let cell of cells) {
			cell.div.classList.add("numbery_Div");
			cell.svg.classList.add("numbery_Svg");
			cell.div.style.setProperty("--col", utilsColor.formatAsString(numberyOptions.player.col, "HSL"));
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
	dbID("idLbl_numberyResult").textContent = `${numberyOptions.player.name}`;
}

function numberyCheckFinished() {
	for (const cell of Object.values(numberyOptions.cells)) {
		if (cell.free) return false;
	}
	numberyToggleStart();
	const result = dbID("idLbl_numberyResult");
	let maxScored = sortArrayByKey(numberyOptions.players, "score", true);
	if (maxScored[0].score == maxScored[1].score) {
		result.textContent = `Tie with ${maxScored[0].score} points`;
	} else {
		result.textContent = `${maxScored[0].name} won!`;
		result.style.setProperty("--bgcNavbar", utilsColor.formatAsString(maxScored[0].col, "HSL"));
		result.style.setProperty("--txtNavbar", utilsColor.stateAsString(maxScored[0].col, "HSL"));
	}
	return true;
}

function nuScoreBoard() {
	clearTable("idTabBody_Numbery");
	for (let i = 0; i < numberyOptions.players.length; i++) {
		const row = insertTableRow("idTabBody_Numbery");
		const isPlayer = i == numberyOptions.playerID;
		// colored Box
		tableAddCell(row, {
			names: ["numbery", i],
			type: "Colbox",
			color: numberyOptions.players[i].col,
			cellStyle: {
				backgroundColor: isPlayer ? numberyOptions.players[i].col : "",
			},
		});
		//Name
		tableAddCell(row, {
			names: ["numberyName", i],
			type: "Lbl",
			text: numberyOptions.players[i].name,
			cellStyle: {
				textAlign: "left",
				backgroundColor: isPlayer ? numberyOptions.players[i].col : "",
			},
		});
		//Score
		tableAddCell(row, {
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

class NumberyPlayer {
	constructor(i, colStart) {
		this.id = i;
		this.name = this.id == 0 ? nuncDiscipuli.short || `Player 1` : (this.name = `Player ${this.id + 1}`);
		this.col = globalValues.colors.array[(this.id + colStart) % globalValues.colors.array.length];
		this.score = 0;
	}
	scored() {
		this.score += 2;
		dbID(`idLbl_child_numberyScore_${this.id}`).textContent = this.score;
	}
}
