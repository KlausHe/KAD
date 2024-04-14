import { dbID, daEL, KadDOM, KadArray } from "../General/KadUtils.js";
import {  socketPost } from "../General/KadServerCommunication.js";
import { Data_Country_CodesIso639 } from "../General/MainData.js";

const speechTranslateOptions = {
	synthObj: window.speechSynthesis,
	output: false,
	voices: [],
	resetCouner: 0,
	textDE: "Text übersetzen",
	textEN: "Translate Text",
};

daEL(idSel_translateSelectorFrom, "change", speechTranslatePopulateSpeech);
daEL(idSel_translateSelectorTo, "change", speechTranslatePopulateSpeech);
daEL(idBtn_TranslateSwitch, "click", translateSwitch);
daEL(idBtn_speechTranslateOnly, "click", () => speechSpeak(0));
daEL(idBtn_speechTranslateSpeak, "click", () => speechSpeak(1));
daEL(idBtn_speechSpeakFrom, "click", () => speechSpeakOnly(idArea_speechFromText, idSel_speechSelectorFrom));
daEL(idBtn_speechSpeakTo, "click", () => speechSpeakOnly(idArea_speechToText, idSel_speechSelectorTo));

export function clear_cl_SpeechTranslate() {
	speechTranslateOptions.output = false;
	speechTranslateOptions.voices = [];
	speechTranslateOptions.synthObj.cancel();
	KadDOM.resetInput("idArea_speechFromText", speechTranslateOptions.textDE);
	KadDOM.resetInput("idArea_speechToText", speechTranslateOptions.textEN);
	let voicesUnsorted = speechTranslateOptions.synthObj.getVoices();
	if (voicesUnsorted.length == 0 && speechTranslateOptions.resetCouner < 20) {
		speechTranslateOptions.resetCouner++;
		setTimeout(clear_cl_SpeechTranslate, 200);
	} else if (speechTranslateOptions.resetCouner >= 20) {
		speechTranslateOptions.resetCouner = 0;
		return;
	} else {
		speechTranslatePopulateLanguage();
		speechTranslateOptions.voices = KadArray.sortArrayByKey(voicesUnsorted, "lang", false, true);
		speechTranslatePopulateSpeech();
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
		dbID("idSel_translateSelectorFrom").appendChild(option1);
		dbID("idSel_translateSelectorTo").appendChild(option2);
	});
}

function speechTranslatePopulateSpeech() {
	dbID("idSel_speechSelectorFrom").innerHTML = "";
	dbID("idSel_speechSelectorTo").innerHTML = "";
	let fromIndex = dbID("idSel_translateSelectorFrom").selectedIndex;
	let fromCode = dbID("idSel_translateSelectorFrom").options[fromIndex].dataset.code;
	let toIndex = dbID("idSel_translateSelectorTo").selectedIndex;
	let toCode = dbID("idSel_translateSelectorTo").options[toIndex].dataset.code;
	for (let i = 0; i < speechTranslateOptions.voices.length; i++) {
		let langSplit;
		if (speechTranslateOptions.voices[i].lang.split("-")[0] == "zh") {
			langSplit = speechTranslateOptions.voices[i].lang.toLowerCase(); // if Chinese, keep all and switch to lower case
		} else {
			langSplit = speechTranslateOptions.voices[i].lang.split("-")[0];
		}
		if (langSplit == fromCode) {
			createSpeechOption(langSplit, speechTranslateOptions.voices[i], "idSel_speechSelectorFrom");
		}
		if (langSplit == toCode) {
			createSpeechOption(langSplit, speechTranslateOptions.voices[i], "idSel_speechSelectorTo");
		}
	}
	if (idSel_speechSelectorFrom.options.length == 0) {
		createSpeechOption("en", speechTranslateOptions.voices[0], "idSel_speechSelectorFrom");
	}
	if (idSel_speechSelectorTo.options.length == 0) {
		createSpeechOption("en", speechTranslateOptions.voices[0], "idSel_speechSelectorTo");
	}
}

function createSpeechOption(landCode, voice, id) {
	let option = document.createElement("option");
	option.textContent = `${Data_Country_CodesIso639.get(landCode)} (${voice.name})`;
	option.setAttribute("data-name", voice.name);
	const dataLang = voice.lang == "nb-NO" ? "no-NO" : voice.lang; //special treatment with norway!
	option.setAttribute("data-lang", dataLang);
	dbID(id).appendChild(option);
}

function translateSwitch() {
	const objFrom = dbID("idSel_translateSelectorFrom");
	const objTo = dbID("idSel_translateSelectorTo");
	const objFromIndex = objFrom.selectedIndex;
	objFrom.options[objTo.selectedIndex].selected = true;
	objTo.options[objFromIndex].selected = true;
	speechTranslatePopulateSpeech();
}

function speechLanguageChange() {
	let objFrom = dbID("idSel_translateSelectorFrom");
	let objTo = dbID("idSel_translateSelectorTo");
	let language = {
		from: objFrom.options[objFrom.selectedIndex].dataset.code,
		fromSplit: objFrom.options[objFrom.selectedIndex].dataset.code.split("-")[0],
		to: objTo.options[objTo.selectedIndex].dataset.code,
		toSplit: objTo.options[objTo.selectedIndex].dataset.code.split("-")[0],
	};
	return language;
}

function speechSpeak(out) {
	speechTranslateOptions.output = out == 1 ? true : false;
	dbID("idArea_speechToText").value = "...";
	speechTranslateRequest(dbID("idArea_speechFromText").value.trim());
}

function speechTranslateRequest(text) {
	if (text === undefined || text == "") {
		dbID("idArea_speechToText").value = "";
		return;
	}

	SpeechAPI.translate("Je ne mangé pas six jours", { to: "en"}) // corsUrl: "http://cors-anywhere.herokuapp.com/" 
		.then((res) => {
			// I do not eat six days
			console.log(res.text);
		})
		.catch((err) => {
			console.error(err);
		});

	return;
	let languages = speechLanguageChange();
	socketPost(
		"SpeechTranslate",
		{
			text: text,
			langTo: languages.toSplit,
			langFrom: languages.fromSplit,
		},
		speechTranslateReturn
	);
}

function speechTranslateReturn(data) {
	if (data.error) {
		alert("Sorry, hat nicht geklappt.\nVersuchs nochmal!");
	}
	const pronunciation = data.pronunciation == null ? "" : `\n(${data.pronunciation})`;
	dbID("idArea_speechToText").value = `${data.text}${pronunciation}`;
	if (speechTranslateOptions.output) {
		speechSpeakOnly(idArea_speechToText, idSel_speechSelectorTo);
	}
}

function speechSpeakOnly(IDSelectText, IDSelectLang) {
	let textElement = dbID(IDSelectText.id);
	let langElement = dbID(IDSelectLang.id);
	let text = textElement.textContent || textElement.value.split("\n(")[0] || textElement.placeholder;
	let lang = langElement.dataset.lang || langElement.selectedOptions[0].dataset.lang;
	speechSpeakOutput(text, lang);
}

function speechSpeakOutput(dataText, lang) {
	speechTranslateOptions.synthObj.cancel();
	let output = new SpeechSynthesisUtterance();
	output.text = dataText;
	output.voice = speechTranslateOptions.voices.filter((voice) => {
		output.lang = lang;
		return voice.lang == lang;
	})[0];
	speechTranslateOptions.synthObj.speak(output);
}
