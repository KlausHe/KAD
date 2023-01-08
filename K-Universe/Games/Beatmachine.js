const beatmachineOptions = {
	BPMOrig: 105,
	curTime: 0,
	stepInterval: 0,
	stepIntervalChanged: false,
	transportState: false,
	loop: null,
	duration: 16,
	muteAll: false,
	expanding: false,
	tracks: [
		{ name: "Base", pattern: [], path: "Data/sounds/909_BD1.mp3", sound: null, enable: true },
		{ name: "Snare", pattern: [], path: "Data/sounds/909_SD2.mp3", sound: null, enable: true },
		{ name: "Clap", pattern: [], path: "Data/sounds/909_ClapST.mp3", sound: null, enable: true },
		{ name: "HiHat", pattern: [], path: "Data/sounds/909_HH2.mp3", sound: null, enable: true },
		{ name: "HH open", pattern: [], path: "Data/sounds/909_HHo2.mp3", sound: null, enable: true },
		{ name: "Ride", pattern: [], path: "Data/sounds/SS_Kit09_Ride.mp3", sound: null, enable: true },
		// { name: "Crash", pattern: [], path: "Data/sounds/909_Crash.mp3", sound: null, enable: true },
		// { name: "Tom 1", pattern: [], path: "Data/sounds/909_Tom2.mp3", sound: null, enable: true },
		// { name: "Tom 2", pattern: [], path: "Data/sounds/909_Tom3.mp3", sound: null, enable: true },
		// { name: "Shaker", pattern: [], path: "Data/sounds/BM_Shaker1.mp3", sound: null, enable: true },
		// { name: "Raiser", pattern: [], path: "Data/sounds/WA_retro_ride2.mp3", sound: null, enable: true },
		// { name: "Tone", pattern: [], path: "Data/sounds/SS_Tom_Mid.mp3", sound: null, enable: true },
	],
};

function clear_cl_Beatmachine() {
	beatmachineOptions.curTime = 0;
	beatmachineOptions.stepInterval = 0;
	beatmachineOptions.stepIntervalChanged = false;
	beatmachineOptions.transportState = false;
	beatmachineOptions.BPM = beatmachineOptions.BPMOrig;
	beatmachineOptions.expanding = false;
	setBPMtoInterval(beatmachineOptions.BPM);
	resetInput("idVin_beatmachine_BPM", beatmachineOptions.BPM);
	beatmachineStop(true);
	beatmachineCreateTracks();
}

function beatmachineCreateTracks() {
	const inputClass = dbCL("cl_beatmachineTracks");
	clearFirstChild(inputClass);

	for (const [index, obj] of beatmachineOptions.tracks.entries()) {
		let baseParent = document.createElement("div");
		baseParent.id = `idDiv_beatmachineTrack_${obj.name}`;

		if (!beatmachineOptions.expanding) {
			obj.enable = true;
			obj.pattern = [];
		}

		let temp = document.createElement("BUTTON");
		temp.id = `idBtn_beatmachineEnable_${obj.name}`;
		temp.setAttribute("data-track", index);
		temp.setAttribute("data-btnstatus", "btnPositive");
		temp.onclick = function () {
			beatmachineToggleTrack(index);
		};
		temp.innerHTML = obj.name;
		temp.setAttribute("uiSize", "small");
		temp.setAttribute("uiAlign", "left");
		baseParent.appendChild(temp);

		for (let i = 0; i < beatmachineOptions.duration; i++) {
			if (!beatmachineOptions.expanding) {
				obj.pattern.push(0);
			}
			let temp = document.createElement("BUTTON");
			temp.classList.add("cl_BeatmachineBtn");
			temp.id = `idBtn_beatmachine_${obj.name}_${i}`;
			temp.setAttribute("data-track", index);
			temp.setAttribute("data-pattern", i);
			temp.onclick = function () {
				beatmachineTogglePattern(temp);
			};
			if (i % 4 == 0) {
				temp.classList.add("cl_BeatmachineBtnBorder");
			}
			baseParent.appendChild(temp);
		}
		inputClass.appendChild(baseParent);
	}
}

function setBPMtoInterval(val) {
	beatmachineOptions.stepInterval = Math.round((60 / 4 / val) * 1000);
}

function beatmachineBPMChange(obj) {
	let val = obj.value;
	val = val == "" ? obj.placeholder : Number(val);
	setBPMtoInterval(val);
	beatmachineOptions.stepIntervalChanged = true;
}

function beatmachineGetSounds() {
	let loadCounter = 0;
	for (const obj of beatmachineOptions.tracks) {
		loadSound(obj.path, beatmachineSoundLoaded);
		function beatmachineSoundLoaded(sound) {
			obj.sound = sound;
			obj.sound.setVolume(0.6);
			loadCounter++;
			if (loadCounter == beatmachineOptions.tracks.length) {
				console.log("all loaded");
				dbIDStyle("idBtn_beatmachineLoad").display = "none";
				dbIDStyle("idBtn_transportPlayPause").display = "initial";
			}
		}
	}
}

function beatmachineExpand() {
	if (beatmachineOptions.duration == 16) {
		beatmachineOptions.duration = 32;
	} else if (beatmachineOptions.duration == 32) {
		beatmachineOptions.duration = 16;
		beatmachineOptions.curTime = 0; //reset to 0 to avoid playing non-existing buttons
	}
	beatmachineOptions.expanding = true;
	clear_cl_Beatmachine();
	beatmachineDrawAll();
	layoutNavClick(contentLayout.prevNavContent);
}

function beatmachineCreateBeat() {
	for (let track of beatmachineOptions.tracks) {
		for (let i = 0; i < beatmachineOptions.duration; i++) {
			track.pattern[i] = 0;
			if (i % 4 == 0) {
				track.pattern[i] = Math.random() > 0.6 ? 1 : 0;
			} else if (i % 2 == 0) {
				track.pattern[i] = Math.random() > 0.8 ? 1 : 0;
			} else {
				track.pattern[i] = Math.random() > 0.95 ? 1 : 0;
			}
			if (i % 4 == 0 && track.name == "Base") {
				track.pattern[i] = 1;
			}
		}
	}
	beatmachineDrawAll();
}

function beatmachineTransport() {
	beatmachineOptions.curTime = 0;
	if (beatmachineOptions.transportState === false) {
		beatmachinePlay();
		beatmachineOptions.transportState = true;
	} else {
		beatmachineStop();
		beatmachineOptions.transportState = false;
	}
}

function beatmachinePlay() {
	dbID("idBtn_transportPlayPause").textContent = "Stop";
	btnColor("idBtn_transportPlayPause", "positive");
	beatmachineOptions.loop = setInterval(beatmachineLoop, beatmachineOptions.stepInterval);
}
function beatmachineStop(reset = null) {
	dbID("idBtn_transportPlayPause").textContent = "Play";
	btnColor("idBtn_transportPlayPause", null);
	clearInterval(beatmachineOptions.loop);
	beatmachineOptions.loop = null;

	if (reset) return;
	for (let obj of beatmachineOptions.tracks) {
		obj.sound.stop();
	}
}

// const btn = dbID(`idBtn_beatmachine_${trackObj.name}_${pIndex}`);
// if (trackObj.pattern[pIndex]) {
//   btn.classList.add("cl_BeatmachineBtnRow");
// } else {
//   btn.classList.remove("cl_BeatmachineBtnRow");

function beatmachineLoop() {
	for (let obj of beatmachineOptions.tracks) {
		// beatmachineBtnColor(obj, beatmachineOptions.curTime);
		// beatmachineBtnColor(obj, (beatmachineOptions.curTime + beatmachineOptions.duration - 1) % beatmachineOptions.duration, true);
		if (obj.enable && obj.pattern[beatmachineOptions.curTime] == 1) {
			obj.sound.play();
		}
	}
	beatmachineOptions.curTime = (beatmachineOptions.curTime + 1) % beatmachineOptions.duration;
	if (beatmachineOptions.curTime == 0) {
		if (beatmachineOptions.stepIntervalChanged == true) {
			beatmachineOptions.stepIntervalChanged = false;
			clearInterval(beatmachineOptions.loop);
			beatmachineOptions.loop = setInterval(beatmachineLoop, beatmachineOptions.stepInterval);
		}
	}
}

function muteAll() {
	beatmachineOptions.muteAll = !beatmachineOptions.muteAll;
	btnColor("idBtn_transporteMute", beatmachineOptions.muteAll ? "negative" : null);
	for (let obj of beatmachineOptions.tracks) {
		obj.enable = !beatmachineOptions.muteAll;
		btnColor(`idBtn_beatmachineEnable_${obj.name}`, beatmachineOptions.muteAll ? "negative" : "positive");
	}
}

function beatmachineToggleTrack(tIndex) {
	if (beatmachineOptions.muteAll) {
		beatmachineOptions.muteAll = false;
		btnColor("idBtn_transporteMute", null);
	}
	let track = beatmachineOptions.tracks[tIndex];
	track.enable = !track.enable;
	btnColor(`idBtn_beatmachineEnable_${track.name}`, track.enable ? "positive" : "negative");
}

function beatmachineTogglePattern(btnObj) {
	let tIndex = btnObj.getAttribute("data-track");
	let pIndex = btnObj.getAttribute("data-pattern");
	let track = beatmachineOptions.tracks[tIndex];
	track.pattern[pIndex] = !track.pattern[pIndex];
	beatmachineBtnColor(track, pIndex);
}

function beatmachineDrawAll() {
	for (let obj of beatmachineOptions.tracks) {
		for (let i = 0; i < beatmachineOptions.duration; i++) {
			beatmachineBtnColor(obj, i);
		}
	}
}

function beatmachineBtnColor(trackObj, pIndex) {
	const btn = dbID(`idBtn_beatmachine_${trackObj.name}_${pIndex}`);
	if (trackObj.pattern[pIndex]) {
		btn.classList.add("cl_BeatmachineBtnSelect");
	} else {
		btn.classList.remove("cl_BeatmachineBtnSelect");
	}
}

function setup() {
	noCanvas();
	noLoop();
}
