import { Data_Country_CodesIso3166 } from "../KadData/KadData_Countries.js";
import { dbID, initEL, KadRandom, KadValue } from "../KadUtils/KadUtils.js";

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

initEL({ id: dbID("idBtn_storreStartArea"), fn: storreStartArea, dataset: ["radio", "storreType"] });
initEL({ id: dbID("idBtn_storreStartPopulation"), fn: storreStartPopulation, dataset: ["radio", "storreType"] });
initEL({ id: dbID("idBtn_storreQuestionA"), fn: storreQuestion, dataset: ["set", "A"] });
initEL({ id: dbID("idBtn_storreQuestionB"), fn: storreQuestion, dataset: ["set", "B"] });
initEL({ id: dbID("idLbl_storreAnswerA") });
initEL({ id: dbID("idLbl_storreAnswerB") });

export function clear_cl_Storre() {
  dbID("idBtn_storreQuestionA").KadEnable(false);
  dbID("idBtn_storreQuestionB").KadEnable(false);
  storreReset();
}

function storreReset() {
  storreOptions.streak = 0;
  storreUpdateStreak();
  dbID("idBtn_storreQuestionA").KadReset({ resetValue: "..." });
  dbID("idBtn_storreQuestionB").KadReset({ resetValue: "..." });
  storreShowAnswers(true);
}

function storreStartArea() {
  storreOptions.dataType = "area";
  storreReset();
  storreGetData();
}

function storreStartPopulation() {
  storreOptions.dataType = "population";
  storreReset();
  storreGetData();
}

async function storreGetData() {
  dbID("idBtn_storreQuestionA").KadEnable(true);
  dbID("idBtn_storreQuestionB").KadEnable(true);
  storreOptions.data = KadRandom.shuffleData(storreOptions.data);
  storreDisplayQuestions();
}

function storreDisplayQuestions() {
  const offsetA = storreOptions.streak % 2 == 0 ? 0 : 1;
  const valA = storreOptions.data[storreOptions.streak + offsetA].nameDECommon;
  const offsetB = storreOptions.streak % 2 == 0 ? 1 : 0;
  const valB = storreOptions.data[storreOptions.streak + offsetB].nameDECommon;
  dbID("idBtn_storreQuestionA").KadReset({ resetValue: valA });
  dbID("idBtn_storreQuestionB").KadReset({ resetValue: valB });
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
      dbID(`idBtn_storreQuestion${set}`).KadButtonColor("negative");
      storreUpdateStreak(true);
      storreShowAnswers();
      dbID("idBtn_storreStartArea").KadButtonColor(null);
      dbID("idBtn_storreStartPopulation").KadButtonColor(null);
      return;
    }
    dbID(`idBtn_storreQuestion${set}`).KadButtonColor("positive");
    storreShowAnswers();
    storreOptions.gameState = storreOptions.gameStates.ANSWERED;
    storreOptions.streak++;
    storreUpdateStreak();
  }
}

function storreShowAnswers(clear = false) {
  const unit = storreOptions.dataType == "area" ? "km<sup>2</sup>" : " E";
  dbID("idLbl_storreAnswerA").KadSetHTML(clear ? "" : KadValue.number(storreOptions.dataA, { indicator: true }) + unit);
  dbID("idLbl_storreAnswerB").KadSetHTML(clear ? "" : KadValue.number(storreOptions.dataB, { indicator: true }) + unit);
  if (clear) {
    dbID("idBtn_storreQuestionA").KadButtonColor();
    dbID("idBtn_storreQuestionB").KadButtonColor();
  }
}

function storreUpdateStreak(lost = false) {
  const text = lost ? `Game Over!<br>Punkte: ${storreOptions.streak}` : `Punkte: ${storreOptions.streak}`;
  dbID("idLbl_storreStreak").innerHTML = text;
}
