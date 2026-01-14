import { Data_Country_CodesIso3166 } from "../KadData/KadData_Countries.js";
import { initEL, KadRandom, KadValue } from "../KadUtils/KadUtils.js";

const storreOptions = {
  data: Data_Country_CodesIso3166,
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

const Btn_storreStartArea = initEL({ id: "idBtn_storreStartArea", fn: [storreStart, "area"], dataset: ["radio", "storreType"] });
const Btn_storreStartPopulation = initEL({ id: "idBtn_storreStartPopulation", fn: [storreStart, "population"], dataset: ["radio", "storreType"] });
const Btn_storreQuestionA = initEL({ id: "idBtn_storreQuestionA", fn: storreQuestion, dataset: ["set", "0"], resetValue: "..." });
const Btn_storreQuestionB = initEL({ id: "idBtn_storreQuestionB", fn: storreQuestion, dataset: ["set", "1"], resetValue: "..." });
const Lbl_storreAnswerA = initEL({ id: "idLbl_storreAnswerA" });
const Lbl_storreAnswerB = initEL({ id: "idLbl_storreAnswerB" });
const Lbl_storreStreak = initEL({ id: "idLbl_storreStreak", resetValue: "streak" });
const Btn_storreQuestions = [Btn_storreQuestionA, Btn_storreQuestionB];

export function clear_cl_Storre() {
  Btn_storreQuestionA.KadEnable(false);
  Btn_storreQuestionB.KadEnable(false);
  storreReset();
}

function storreReset() {
  storreOptions.streak = 0;
  storreUpdateStreak();
  Btn_storreQuestionA.KadReset();
  Btn_storreQuestionB.KadReset();
  storreShowAnswers(true);
}

function storreStart(dataType) {
  storreOptions.dataType = dataType.data[0];
  storreReset();
  storreGetData();
}

async function storreGetData() {
  Btn_storreQuestionA.KadEnable(true);
  Btn_storreQuestionB.KadEnable(true);
  storreOptions.data = KadRandom.shuffleData(storreOptions.data);
  storreDisplayQuestions();
}

function storreDisplayQuestions() {
  const offsetA = storreOptions.streak % 2 == 0 ? 0 : 1;
  const valA = storreOptions.data[storreOptions.streak + offsetA].nameDECommon;
  const offsetB = storreOptions.streak % 2 == 0 ? 1 : 0;
  const valB = storreOptions.data[storreOptions.streak + offsetB].nameDECommon;
  Btn_storreQuestionA.KadReset({ resetValue: valA });
  Btn_storreQuestionB.KadReset({ resetValue: valB });
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

    if ((set == 0 && storreOptions.dataA < storreOptions.dataB) || (set == 1 && storreOptions.dataA > storreOptions.dataB)) {
      storreOptions.gameState == storreOptions.gameStates.LOST;
      Btn_storreQuestions[set].KadButtonColor("negative");
      storreUpdateStreak(true);
      storreShowAnswers();
      Btn_storreStartArea.KadButtonColor(null);
      Btn_storreStartPopulation.KadButtonColor(null);
      return;
    }
    Btn_storreQuestions[set].KadButtonColor("positive");
    storreShowAnswers();
    storreOptions.gameState = storreOptions.gameStates.ANSWERED;
    storreOptions.streak++;
    storreUpdateStreak();
  }
}

function storreShowAnswers(clear = false) {
  const unit = storreOptions.dataType == "area" ? "km<sup>2</sup>" : " E";
  Lbl_storreAnswerA.KadSetHTML(clear ? "..." : KadValue.number(storreOptions.dataA, { indicator: true }) + unit);
  Lbl_storreAnswerB.KadSetHTML(clear ? "..." : KadValue.number(storreOptions.dataB, { indicator: true }) + unit);
  if (clear) {
    Btn_storreQuestionA.KadButtonColor();
    Btn_storreQuestionB.KadButtonColor();
  }
}

function storreUpdateStreak(lost = false) {
  const text = lost ? `Game Over!<br>Punkte: ${storreOptions.streak}` : `Punkte: ${storreOptions.streak}`;
  Lbl_storreStreak.KadSetHTML(text);
}
