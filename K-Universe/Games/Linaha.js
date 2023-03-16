const linahaOptions = {
	url: "https://restcountries.com/v3.1/alpha?codes=",
	// urlFields: "?fields=translations;flag;capital;population;area", // not working
	setLength: 1,
	setOptions: [2, 4, 6, 9, 12],
	setLayout: {
		cols: [2, 2, 3, 3, 3],
		rows: [1, 2, 2, 3, 4],
	},
	optionsDisplayed: ["Land", "Flagge", "Hauptstadt", "Einwohnerzahl", "Fläche"],
	selQ: 0,
	selA: 1,
	selRounds: 5,
	currentRound: -1,
	correctRounds: 0,
	answerIndex: null,
	answered: false,
	isPlaying: false,
	avaibleCodeIndex: [],
	data: [],
	get score() {
		return this.correctRounds * this.btnCount * 1.5;
	},
	get btnCount() {
		return this.setLayout.cols[this.setLength] * this.setLayout.rows[this.setLength];
	},
};

function clear_cl_Linaha() {
	linahaDisableEntries(false);
	//populate Selectors
	let selQ = dbID("idSel_linahaSelectQ");
	let selA = dbID("idSel_linahaSelectA");
	clearFirstChild("idSel_linahaSelectQ");
	clearFirstChild("idSel_linahaSelectA");
	for (const opt of linahaOptions.optionsDisplayed) {
		const option1 = document.createElement("OPTION");
		option1.textContent = opt;
		const option2 = option1.cloneNode(true);
		selQ.appendChild(option1);
		selA.appendChild(option2);
	}
	selA.options[1].selected = true;

	//populate SetLength selector
	let selC = dbID("idSel_linahaChoices");
	clearFirstChild("idSel_linahaChoices");
	for (const opt of linahaOptions.setOptions) {
		const option1 = document.createElement("OPTION");
		option1.textContent = opt;
		selC.appendChild(option1);
	}
	selC.options[1].selected = true; // set to setLength

	//clear Values
	resetInput("idVin_linahaRounds", 5);
	dbID("idLbl_linahaQuestion").innerHTML = `Spiele <br>${linahaOptions.selRounds} Runden<br>Linaha!`;
	enableBtn("idBtn_linahaMap", false);
	linahaCreateAvaible();
	linahaOptions.data = [];
	linahaOptions.selRounds = 5;
	linahaOptions.currentRound = -1;
	linahaOptions.correctRounds = 0;
	linahaOptions.answered = false;
	linahaOptions.isPlaying = true;
	linahaUpdateStats();
	linahaStart();
}

function linahaCreateAvaible() {
	linahaOptions.avaibleCodeIndex = Array.from(Data_Country_CodesIso3166.keys());
	linahaOptions.avaibleCodeIndex = shuffleData(linahaOptions.avaibleCodeIndex);
}

function linahaSelect(obj) {
	const tempSel = obj.selectedIndex;
	const tempIdent = `sel${obj.dataset.ident}`;
	const sw = tempSel == linahaOptions.selA || tempSel == linahaOptions.selQ;

	if (!sw) {
		linahaOptions[tempIdent] = tempSel;
		return;
	}
	if (tempIdent == "selQ") {
		const objA = dbID("idSel_linahaSelectA");
		objA.options[linahaOptions.selQ].selected = true;
		linahaOptions.selA = linahaOptions.selQ;
		linahaOptions.selQ = obj.selectedIndex;
	} else {
		const objQ = dbID("idSel_linahaSelectQ");
		objQ.options[linahaOptions.selA].selected = true;
		linahaOptions.selQ = linahaOptions.selA;
		linahaOptions.selA = obj.selectedIndex;
	}
}

function linahaSwitchSelect() {
	const objQ = dbID("idSel_linahaSelectQ");
	const objA = dbID("idSel_linahaSelectA");
	const objQIndex = objQ.selectedIndex;
	objQ.options[objA.selectedIndex].selected = true;
	objA.options[objQIndex].selected = true;
	linahaOptions.selA = objA.selectedIndex;
	linahaOptions.selQ = objQ.selectedIndex;
}

function linahaChoiceChange(sel) {
	linahaOptions.setLength = sel.selectedIndex;
}

function linahaRoundsChange(btn) {
	linahaOptions.selRounds = btn.value;
	dbID("idLbl_linahaQuestion").innerHTML = `Spiele ${linahaOptions.selRounds} Runden<br>Linaha!`;
	linahaUpdateStats();
}

function linahaFinished() {
	dbID("idLbl_linahaQuestion").removeAttribute("uiType");
	dbID("idBtn_linahaStart").textContent = "New Game";
	dbID("idLbl_linahaQuestion").innerHTML = `Punkte:<br>${linahaOptions.score}`;
	linahaDisableEntries(false);
	linahaOptions.currentRound = -1;
}

function linahaDisableEntries(lock) {
	const inputArr = ["idSel_linahaSelectQ", "idSel_linahaSelectSwitch", "idSel_linahaSelectA", "idSel_linahaChoices", "idVin_linahaRounds"];
	for (const id of inputArr) {
		enableBtn(id, !lock);
	}
}

function linahaUpdateStats() {
	dbID("idLbl_linahaCurrentRound").textContent = `${linahaOptions.currentRound + 1}/${linahaOptions.selRounds}`;
	dbID("idLbl_linahaCurrentScore").textContent = linahaOptions.score || 0;
}

function linahaStart() {
	linahaOptions.isPlaying = !linahaOptions.isPlaying;
	if (linahaOptions.isPlaying) {
		dbID("idBtn_linahaStart").textContent = "Reset";
		linahaOptions.currentRound = 0;
		linahaUpdateStats();
		linahaGetData();
		//disable these Inputs:
		linahaDisableEntries(true);
		linahaOptions.currentRound = 0;
		linahaOptions.correctRounds = 0;
		linahaOptions.answered = false;
	} else {
		dbID("idBtn_linahaStart").textContent = "Start";
		linahaDisableEntries(false);
	}
}

async function linahaGetData() {
	linahaClearEntries();
	linahaOptions.data = [];
	const selectionCount = linahaOptions.btnCount * linahaOptions.selRounds;
	if (linahaOptions.avaibleCodeIndex.length < selectionCount) {
		linahaCreateAvaible();
	}
	let indexArr = linahaOptions.avaibleCodeIndex.splice(0, selectionCount);
	let url = linahaOptions.url;
	for (const code of indexArr) {
		url += `${code},`;
	}
	try {
		let response = await fetch(url);
		linahaOptions.data = await response.json();
		linahaCreateButtons();
	} catch (err) {
		console.error(err);
	}
}

function linahaCreateButtons() {
	//select random countries
	const currArr = linahaOptions.data.slice(0, linahaOptions.btnCount);
	linahaOptions.answerIndex = randomObject(currArr.length);
	linahaShowData("idLbl_linahaQuestion", linahaOptions.selQ, linahaOptions.answerIndex);
	if (linahaOptions.selQ == 1) {
		dbID("idLbl_linahaQuestion").setAttribute("uiType", "transparent");
	} else {
		dbID("idLbl_linahaQuestion").removeAttribute("uiType");
	}
	let parent = dbCL("cl_LinahaAnswers");
	clearFirstChild(parent);
	const cols = linahaOptions.setLayout.cols[linahaOptions.setLength];
	const rows = linahaOptions.setLayout.rows[linahaOptions.setLength];
	for (let y = 0; y < rows; y++) {
		const rowDiv = tableAddCell(
			null,
			{
				names: ["linahaAnswers", y],
				type: "Div",
				createClass: ["cl_SquareButtonFlex"],
				ui: {
					uiFlex: "horizontal",
				},
			},
			parent
		);
		for (let x = 0; x < cols; x++) {
			const index = y * cols + x;
			const btn = tableAddCell(
				null,
				{
					names: ["linahaAnswers", index],
					type: "Btn",
					subGroup: "text",
					ui: {
						uiSize: linahaOptions.selA == 1 ? "linahaBtn" : "height2",
						uiType: linahaOptions.selA == 1 ? "transparent" : "",
					},
					style: {
						margin: getCssRoot("gridGap"),
						border: getCssRoot("borderThin"),
					},

					text: "...",
					onclick: () => {
						linahaAnswered(index);
					},
				},
				rowDiv
			);
			linahaShowData(`idBtn_child_linahaAnswers_${index}`, linahaOptions.selA, index);
		}
	}
}

function linahaShowData(domID, optionsID, dataIndex) {
	if (dataIndex === null) return;
	const obj = linahaOptions.data[dataIndex];
	if (obj === null) return;
	let retText;
	switch (optionsID) {
		case 0: // name text
			retText = obj.translations.deu.common;
			break;
		case 1: //flag IMG
			clearFirstChild(domID);
			tableAddCell(
				null,
				{
					names: ["linahaImg", dataIndex],
					type: "Img",
					subGroup: "url",
					img: obj.flags.svg,
					ui: {
						uiSize: "linahaImg",
					},
				},
				dbID(domID)
			);
			return;
		case 2: // capital text
			retText = obj.capital || "n.d.";
			break;
		case 3: // population text
			const value = obj.population || Math.floor(Math.random() * 25000) * 100;
			if (value >= 1000000) {
				retText = utilsNumber(Math.floor(value / 10000) / 100) + " M";
			} else if (value >= 1000) {
				retText = utilsNumber(Math.floor(value / 10) / 100) + " T";
			} else {
				retText = utilsNumber(value);
			}
			break;
		case 4: // area text
			const area = obj.area || Math.floor(Math.random() * 20000) * 100;
			retText = utilsNumber(area) + " km<sup>2</sup>";
			break;
		default:
			retText = "...";
	}
	dbID(domID).innerHTML = retText;
}

function linahaAnswered(index) {
	if (!linahaOptions.isPlaying) return;
	linahaOptions.answered = !linahaOptions.answered;
	enableBtn("idBtn_linahaMap", linahaOptions.answered);
	if (linahaOptions.answered) {
		// answer is chosen
		enableBtn("idBtn_linahaMap", true);
		const isCorrect = index == linahaOptions.answerIndex;
		linahaOptions.correctRounds += isCorrect ? 1 : 0;
		if (isCorrect) {
			dbIDStyle(`idBtn_child_linahaAnswers_${index}`).backgroundColor = utilsColor.formatAsCSS(globalValues.colors.elements.btnPositive, "HSL");
		} else {
			dbIDStyle(`idBtn_child_linahaAnswers_${index}`).backgroundColor = utilsColor.formatAsCSS(globalValues.colors.elements.btnNegative, "HSL");
			dbIDStyle(`idBtn_child_linahaAnswers_${linahaOptions.answerIndex}`).backgroundColor = utilsColor.formatAsCSS(globalValues.colors.elements.btnPositive, "HSL");
		}
	} else {
		linahaOptions.data.splice(0, linahaOptions.btnCount);
		if (linahaOptions.currentRound < linahaOptions.selRounds - 1) {
			linahaCreateButtons();
			linahaOptions.currentRound++;
		} else {
			linahaFinished();
			linahaOptions.isPlaying = false;
		}
	}
	linahaUpdateStats();
}

function linahaOpenMap() {
	if (!linahaOptions.data[linahaOptions.answerIndex].maps.googleMaps) return;
	const url = linahaOptions.data[linahaOptions.answerIndex].maps.googleMaps;
	const name = linahaOptions.data[linahaOptions.answerIndex].translations.deu.common;
	window.open(url, name, "popup");
}

function linahaClearEntries() {
	const cols = linahaOptions.setLayout.cols[linahaOptions.setLength];
	const rows = linahaOptions.setLayout.rows[linahaOptions.setLength];
	linahaShowData("idLbl_linahaQuestion", null, null);
	if (dbCL("cl_LinahaAnswers").childElementCount > 1) {
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				const index = y * cols + x;
				linahaShowData(`idBtn_child_linahaAnswers_${index}`, null, null);
			}
		}
	}
}
