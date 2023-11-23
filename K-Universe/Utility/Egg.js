import { daEL, dbID, KadDOM , KadDate} from "../General/KadUtils.js";

const eggOptions = {
	timerEggCount: null,
	timeTotal: 0,
	timeRemaining: 0,
	timerState: false,
	mass: {
		val: 0,
		valOrig: 60,
		min: 40,
		max: 85,
		get label() {
			for (const [key, val] of Object.entries(this.states)) {
				if (this.val >= val) return `${this.val}g (${key})`;
			}
		},
		states: {
			XL: 73,
			L: 63,
			M: 53,
			S: 40,
		},
	},
	temp: {
		val: 0,
		valOrig: 10,
		min: 4,
		max: 22,
		get label() {
			for (const [key, val] of Object.entries(this.states)) {
				if (this.val >= val) return `${this.val}°C (${key})`;
			}
		},
		states: {
			Wohnung: 16,
			Keller: 9,
			Kühlschrank: 4,
		},
	},
	yolk: {
		val: 0,
		valOrig: 65,
		min: 45,
		max: 90,
		get label() {
			for (const [key, val] of Object.entries(this.states)) {
				if (this.val >= val) return `${this.val}°C (${key})`;
			}
		},
		states: {
			fest: 80,
			"fast fest": 75,
			wachs: 65,
			"leicht wachs": 55,
			weich: 45,
		},
	},
};

daEL(idVin_EggMass, "input", () => eggMassChange(idVin_EggMass));
daEL(idVin_EggTemp, "input", () => eggTempChange(idVin_EggTemp));
daEL(idVin_EggYolk, "input", () => eggYolkChange(idVin_EggYolk));
daEL(idBtn_EggStart, "click", eggStartChange);

export function clear_cl_Egg() {
	eggOptions.mass.val = KadDOM.resetInput("idVin_EggMass", eggOptions.mass.valOrig, {
		min: eggOptions.mass.min,
		max: eggOptions.mass.max,
	});

	eggOptions.temp.val = KadDOM.resetInput("idVin_EggTemp", eggOptions.temp.valOrig, {
		min: eggOptions.temp.min,
		max: eggOptions.temp.max,
	});
	eggOptions.yolk.val = KadDOM.resetInput("idVin_EggYolk", eggOptions.yolk.valOrig, {
		min: eggOptions.yolk.min,
		max: eggOptions.yolk.max,
	});

	dbID("idLbl_EggMass").textContent = eggOptions.mass.label;
	dbID("idLbl_EggTemp").textContent = eggOptions.temp.label;
	dbID("idLbl_EggYolk").textContent = eggOptions.yolk.label;
	eggOptions.timerState = true;
	eggStartChange();
}

function eggMassChange(obj) {
	eggOptions.mass.val = KadDOM.numberFromInput(obj);
	dbID("idLbl_EggMass").textContent = eggOptions.mass.label;
	eggRefrechInput();
}

function eggTempChange(obj) {
	eggOptions.temp.val = KadDOM.numberFromInput(obj);
	dbID("idLbl_EggTemp").textContent = eggOptions.temp.label;
	eggRefrechInput();
}

function eggYolkChange(obj) {
	eggOptions.yolk.val = KadDOM.numberFromInput(obj);
	dbID("idLbl_EggYolk").textContent = eggOptions.yolk.label;
	eggRefrechInput();
}

function eggRefrechInput() {
	eggOptions.timerState = false;
	clearInterval(eggOptions.timerEggCount);
	eggCalculate();
}
function eggCalculate() {
	let mEgg = eggOptions.mass.val;
	let tEgg = eggOptions.temp.val;
	let yEgg = eggOptions.yolk.val;

	let tempFactor = 0.76 * ((tEgg - 100) / (yEgg - 100));
	tempFactor = Math.log(tempFactor);
	let massFactor = 27.05089242 * Math.pow(mEgg, 2 / 3);
	eggOptions.timeTotal = massFactor * tempFactor;
	eggOptions.timeRemaining = eggOptions.timeTotal;
	eggShowTime();
}

function eggShowTime() {
	let obj = KadDate.secondsToObj(eggOptions.timeRemaining);
	dbID("idLbl_EggTime").textContent = `${obj.h}:${obj.m}:${obj.s}`;
}

function eggStartChange() {
	eggOptions.timerState = !eggOptions.timerState;
	if (eggOptions.timerState) {
		dbID("idBtn_EggStart").textContent = "Stop";
		eggCalculate();
		dbID("idProg_eggProgress").setAttribute("max", eggOptions.timeTotal);
		eggCountdown();
		eggOptions.timerEggCount = setInterval(eggCountdown, 1000);
	} else {
		dbID("idBtn_EggStart").textContent = "Start";
		clearInterval(eggOptions.timerEggCount);
		let textStart = "Eieruhr";
		dbID("idLbl_EggTime").textContent = textStart;
	}
}

function eggCountdown() {
	eggOptions.timeRemaining--;
	dbID("idProg_eggProgress").setAttribute("value", eggOptions.timeRemaining);
	if (eggOptions.timeRemaining <= 0) {
		dbID("idLbl_EggTime").textContent = "Fertig!";
		clearInterval(eggOptions.timerEggCount);
		if (dbID("idCb_eggVoiceOutput").checked) {
			speechSpeakOutput("Deine Eier sind fertig!", "de");
		}
	} else {
		eggShowTime();
	}
}
