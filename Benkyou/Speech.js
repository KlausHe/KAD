// import { generateRequestUrl, translate, normaliseResponse, isSupported } from "https://unpkg.com/browse/google-translate-api-browser@5.0.0/";
import { generateRequestUrl, translate, normaliseResponse, isSupported } from "https://cdn.jsdelivr.net/npm/google-translate-api-browser@4.0.0/+esm";
import { dbID, daEL,error, KadDOM, KadArray } from "../General/KadUtils.js";
import { Data_Country_CodesIso639 } from "../General/MainData.js";

const speechOptions = {
	synthObj: window.speechSynthesis,
	voices: [],
	resetCouner: 0,
	timer: null,
	input: "",
	fromIndex: 0,
	fromCode: "",
	toIndex: 0,
	toCode: "",
};

daEL(idSel_speechLanguageFrom, "change", speechHandleLanguageSelect);
daEL(idSel_speechLanguageTo, "change", speechHandleLanguageSelect);
daEL(idBtn_speechSwitch, "click", translateSwitch);
daEL(idBtn_speechSpeakFrom, "click", () => speechSpeak("From"));
daEL(idBtn_speechSpeakTo, "click", () => speechSpeak("To"));
daEL(idArea_speechFromText, "input", speechTranslate);

export function clear_cl_Speech() {
	speechOptions.voices = [];
	speechOptions.synthObj.cancel();
	KadDOM.resetInput("idArea_speechFromText", "Text übersetzen");
	KadDOM.resetInput("idArea_speechToText", "Translate text");
	let voicesUnsorted = speechOptions.synthObj.getVoices();
	if (voicesUnsorted.length == 0 && speechOptions.resetCouner < 20) {
		speechOptions.resetCouner++;
		setTimeout(clear_cl_Speech, 200);
	} else if (speechOptions.resetCouner >= 20) {
		speechOptions.resetCouner = 0;
		return;
	} else {
		speechTranslatePopulateLanguage();
		speechOptions.voices = KadArray.sortArrayByKey(voicesUnsorted, "lang", false, true);
		speechHandleLanguageSelect();
	}
}

function speechTranslatePopulateLanguage() {
	let lang = navigator.language.split("-")[0] || "de";
	Data_Country_CodesIso639.forEach((value, key) => {
		let option1 = document.createElement("option");
		option1.textContent = value;
		option1.setAttribute("data-code", key);
		option1.setAttribute("data-name", value);
		let option2 = option1.cloneNode(true);
		if (key == lang) {
			option1.selected = true;
		}
		if (key == "en") {
			option2.selected = true;
		}
		dbID("idSel_speechLanguageFrom").appendChild(option1);
		dbID("idSel_speechLanguageTo").appendChild(option2);
	});
}

function speechHandleLanguageSelect() {
	dbID("idSel_speechVoiceFrom").innerHTML = "";
	dbID("idSel_speechVoiceTo").innerHTML = "";
	const langFrom = dbID("idSel_speechLanguageFrom");
	const langTo = dbID("idSel_speechLanguageTo");
	speechOptions.fromIndex = langFrom.selectedIndex;
	speechOptions.fromCode = langFrom.options[speechOptions.fromIndex].dataset.code;
	speechOptions.toIndex = langTo.selectedIndex;
	speechOptions.toCode = langTo.options[speechOptions.toIndex].dataset.code;
	for (let i = 0; i < speechOptions.voices.length; i++) {
		let langSplit;
		if (speechOptions.voices[i].lang.split("-")[0] == "zh") {
			langSplit = speechOptions.voices[i].lang.toLowerCase(); // if Chinese, keep all and switch to lower case
		} else {
			langSplit = speechOptions.voices[i].lang.split("-")[0];
		}
		if (langSplit == speechOptions.fromCode) {
			createSpeechOption(langSplit, speechOptions.voices[i], "idSel_speechVoiceFrom");
		}
		if (langSplit == speechOptions.toCode) {
			createSpeechOption(langSplit, speechOptions.voices[i], "idSel_speechVoiceTo");
		}
	}
	if (dbID("idSel_speechVoiceFrom").options.length == 0) {
		createSpeechOption("en", speechOptions.voices[0], "idSel_speechVoiceFrom");
	}
	if (dbID("idSel_speechVoiceTo").options.length == 0) {
		createSpeechOption("en", speechOptions.voices[0], "idSel_speechVoiceTo");
	}
}
function translateSwitch() {
	const objFrom = dbID("idSel_speechLanguageFrom");
	const objTo = dbID("idSel_speechLanguageTo");
	const tempIndex = speechOptions.fromIndex;
	objFrom.options[speechOptions.toIndex].selected = true;
	objTo.options[tempIndex].selected = true;

	speechHandleLanguageSelect();
}
function createSpeechOption(landCode, voice, id) {
	let option = document.createElement("option");
	option.textContent = `${Data_Country_CodesIso639.get(landCode)} (${voice.name})`;
	option.setAttribute("data-name", voice.name);
	const dataLang = voice.lang == "nb-NO" ? "no-NO" : voice.lang; //special treatment with norway!
	option.setAttribute("data-lang", dataLang);
	dbID(id).appendChild(option);
}

function speechSpeak(type) {
	const textElement = dbID(`idArea_speech${type}Text`);
	const langElement = dbID(`idSel_speechLanguage${type}`);
	const text = textElement.textContent || textElement.value.split("\n(")[0] || textElement.placeholder;
	const lang = langElement.selectedOptions[0].dataset.code;
	speechSpeakOutput(text, lang, type);
}
export function speechSpeakOutput(dataText, lang, voice = null) {
	const voices = speechOptions.voices.filter((voice) => voice.lang.split("-")[0] == lang);
	speechOptions.synthObj.cancel();
	let output = new SpeechSynthesisUtterance();
	output.text = dataText;
	output.lang = lang;
	const voiceIndex = voice == null ? 0 : dbID(`idSel_speechVoice${voice}`).selectedIndex;
	output.voice = voices[voiceIndex];
	speechOptions.synthObj.speak(output);
}

function speechTranslate() {
	speechOptions.input = dbID("idArea_speechFromText").value.trim();
	if (speechOptions.input == "") {
		clearTimeout(speechOptions.timer);
		dbID("idArea_speechToText").value = "...";
		return;
	}

	if (speechOptions.timer != null) {
		clearTimeout(speechOptions.timer);
		speechOptions.timer = null;
	}
	speechOptions.timer = setTimeout(() => {
		speechOptions.timer = null;
		speechTranslateRequest();
	}, 500);
}

// function speechLanguageChange() {
// 	let objFrom = dbID("idSel_speechLanguageFrom");
// 	let objTo = dbID("idSel_speechLanguageTo");
// 	let language = {
// 		from: objFrom.options[objFrom.selectedIndex].dataset.code,
// 		fromSplit: objFrom.options[objFrom.selectedIndex].dataset.code.split("-")[0],
// 		to: objTo.options[objTo.selectedIndex].dataset.code,
// 		toSplit: objTo.options[objTo.selectedIndex].dataset.code.split("-")[0],
// 	};
// 	return language;
// }

async function speechTranslateRequest() {
	// speechOptions.input;
	// console.log(isSupported("de"));
	// let languages = speechLanguageChange();

	dbID("idArea_speechToText").value = "Funktion is currently not implemented!";
	translate("Je ne mangé pas six jours", { from: "fr", to: "en" })
		.then((res) => {
			// I do not eat six days
			console.log("text:", res.text);
			dbID("idArea_speechToText").value = res.text;
		})
		.catch((err) => {
			error("Error receiving data for translation:",err);
		});

	return;

	const f = speechOptions.fromCode == "ja" ? "jpn" : speechOptions.fromCode;
	const t = speechOptions.toCode == "ja" ? "jpn" : speechOptions.toCode;
	const url = generateRequestUrl(speechOptions.input, {
		from: f,
		to: t,
		raw: true,
	});

	console.log(url);
	let response = await fetch(url);
	let data = await response.json();
	if (data.error) {
		alert("Sorry, hat nicht geklappt.\nVersuchs nochmal!");
	}

	const pronunciation = returnData.pronunciation == undefined || returnData.pronunciation == "" ? "" : `\n(${data.pronunciation})`;
	dbID("idArea_speechToText").value = `${data.text}${pronunciation}`;
}
