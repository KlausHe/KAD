import { dbIDStyle, hostDebug, initEL, KadDOM, KadRandom, KadTable, KadValue, log } from "../KadUtils/KadUtils.js";
import { globalColors } from "../Settings/Color.js";

const storreOptions = {
	get url() {
		return `https://restcountries.com/v3.1/all?fields=translations,flags,${storreOptions.dataType}`;
	},
	data: [],
	dataType: "area",
	streak: 0,
	gameState: 1,
	gameStates: {
		QUESTION: 1,
		ANSWERED: 2,
		LOST: 3,
	},
	get dataA() {
		const offset = storreOptions.streak % 2 == 0 ? 0 : 1;
		return storreOptions.data[storreOptions.streak + offset][storreOptions.dataType];
	},
	get dataB() {
		const offset = storreOptions.streak % 2 == 0 ? 1 : 0;
		return storreOptions.data[storreOptions.streak + offset][storreOptions.dataType];
	},
};

initEL({ id: idBtn_storreStartArea, fn: storreStartArea });
initEL({ id: idBtn_storreStartPopulation, fn: storreStartPopulation });
initEL({ id: idBtn_storreQuestionA, fn: storreQuestion, dataset: ["set", "A"] });
initEL({ id: idBtn_storreQuestionB, fn: storreQuestion, dataset: ["set", "B"] });

export function clear_cl_Storre() {
	storreOptions.data = null;
	storreReset();
	KadDOM.enableBtn(idBtn_storreQuestionA, false);
	KadDOM.enableBtn(idBtn_storreQuestionB, false);
}

function storreReset() {
	storreOptions.streak = 0;
	storreUpdateStreak();
	idBtn_storreQuestionA.KadReset({ resetValue: "..." });
	idBtn_storreQuestionB.KadReset({ resetValue: "..." });
	storreShowAnswers(true);
}

function storreStartArea() {
	KadDOM.btnColor(idBtn_storreStartArea, "positive");
	KadDOM.btnColor(idBtn_storreStartPopulation, null);
	storreOptions.dataType = "area";
	storreReset();
	storreGetData();
}

function storreStartPopulation() {
	KadDOM.btnColor(idBtn_storreStartArea, null);
	KadDOM.btnColor(idBtn_storreStartPopulation, "positive");
	storreOptions.dataType = "population";
	storreReset();
	storreGetData();
}

async function storreGetData() {
	if (storreOptions.data == null) {
		try {
			let response = await fetch(storreOptions.url);
			storreOptions.data = await response.json();
		} catch (err) {
			if (err.name == "TypeError") {
				log(err);
				return;
			}
		}
	}
	KadDOM.enableBtn(idBtn_storreQuestionA, true);
	KadDOM.enableBtn(idBtn_storreQuestionB, true);
	if (!hostDebug()) storreOptions.data = KadRandom.shuffleData(storreOptions.data);
	storreDisplayQuestions();
}

function storreDisplayQuestions() {
	const offsetA = storreOptions.streak % 2 == 0 ? 0 : 1;
	const valA = storreOptions.data[storreOptions.streak + offsetA].translations.deu.common;
	const offsetB = storreOptions.streak % 2 == 0 ? 1 : 0;
	const valB = storreOptions.data[storreOptions.streak + offsetB].translations.deu.common;
	idBtn_storreQuestionA.KadReset({ resetValue: valA });
	idBtn_storreQuestionB.KadReset({ resetValue: valB });
}

function storreQuestion(obj) {
	if (storreOptions.gameState == storreOptions.gameStates.ANSWERED) {
		storreOptions.gameState = storreOptions.gameStates.QUESTION;
		storreDisplayQuestions();
		storreShowAnswers(true);
		return;
	}
	if (storreOptions.gameState == storreOptions.gameStates.QUESTION) {
		const set = obj.target.dataset.set;
		if ((set == "A" && storreOptions.dataA < storreOptions.dataB) || (set == "B" && storreOptions.dataA > storreOptions.dataB)) {
			storreOptions.gameState == storreOptions.gameStates.LOST;
			KadDOM.btnColor(`idBtn_storreQuestion${set}`, "negative");
			storreUpdateStreak(true);
			storreShowAnswers();
			KadDOM.btnColor(idBtn_storreStartArea, null);
			KadDOM.btnColor(idBtn_storreStartPopulation, null);
			return;
		}
		KadDOM.btnColor(`idBtn_storreQuestion${set}`, "positive");
		storreShowAnswers();
		storreOptions.gameState = storreOptions.gameStates.ANSWERED;
		storreOptions.streak++;
		storreUpdateStreak();
	}
}

function storreShowAnswers(clear = false) {
	const unit = storreOptions.dataType == "area" ? "km<sup>2</sup>" : " E";
	idLbl_storreAnswerA.innerHTML = clear ? "" : KadValue.number(storreOptions.dataA, { indicator: true }) + unit;
	idLbl_storreAnswerB.innerHTML = clear ? "" : KadValue.number(storreOptions.dataB, { indicator: true }) + unit;
	if (clear) {
		KadDOM.btnColor(idBtn_storreQuestionA, null);
		KadDOM.btnColor(idBtn_storreQuestionB, null);
	}
}

function storreUpdateStreak(lost = false) {
	const text = lost ? `WRONG ANSWER!<br>streak: ${storreOptions.streak}` : `streak: ${storreOptions.streak}`;
	idLbl_storreStreak.innerHTML = text;
}
