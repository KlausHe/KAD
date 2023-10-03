// p5-Setup in Soundlibrary only!  Use Instance "globalP5" for general functionality
const globalP5 = new p5((c) => {
	c.setup = function () {
		c.noCanvas();
		c.noLoop();
	};
});

window.onload = mainSetup;

function initCssMediaSizes() {
	for (let key of Object.keys(globalValues.mediaSizes)) {
		globalValues.mediaSizes[key] = getCssRoot(key, true, true);
	}
}
function mainSetup() {
  if (globalValues.hostDebug) {
    dbCLStyle("cl_Loading").display = "none";
	}
  contentLayout.createContentGrid();
	htmlSetVinChange();
	htmlSetAltTags();
	initCssMediaSizes();
	globalValues.colors.darkmodeOn = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
	createNewNuncDiscipuli();
	firebase.initializeApp({
		apiKey: "AIzaSyDHgM7J-2Q_W1Swp0Ozx6nY1QDoFcwEFwQ",
		authDomain: "kad-universe.firebaseapp.com",
		databaseURL: "https://kad-universe.firebaseio.com",
		projectId: "kad-universe",
		storageBucket: "kad-universe.appspot.com",
		messagingSenderId: "874702902059",
		appId: "1:874702902059:web:cbe47b5a31e8f57d",
	});
	const FBData = firebase.firestore();
	FBUserSettings = FBData.collection("User_Settings");

	layoutCreateContentlayoutList(); // First: create the LayoutLists
	layoutCreateNavbar();
	layoutCreateFooter();
	layoutCreateSubgrid();

	contentLayout.prevNavContent = contentLayout.defaultPage;
	layoutResizeGrid();
	layoutNavClick();

	//create Pikadays
	createIomlaidPikaday();
	layoutCreateNavbarPikaday();
	createKadarPikaday("A");
	createKadarPikaday("B");

	//check if Userstate changed!
	firebase.auth().onAuthStateChanged((user) => {
		if (user != null) {
			nuncDiscipuli.cred.email = user.email;
			nuncDiscipuli.cred.uid = user.uid;
		} else if (user === null) {
			nuncDiscipuli.cred.email = null;
			nuncDiscipuli.cred.uid = null;
		}
		toggleLayout();
		clearAllTiles();
		setTimeout(() => {
			layoutHideLoadingscreen();
			clearGlobalValue();
		}, 1000);
	});
	globalValues.globalInput.generateSpreadLists();
}

function resetAll() {
	createNewNuncDiscipuli();
	displayColorSystem();
	clearGlobalValue();
	layoutNavClick(contentLayout.defaultPage);
}

function clearAllTiles() {
	for (const obj in contentGrid) {
		window[`clear_${obj}`]();
	}
}

function redrawCanvases() {
	for (let obj in contentGrid) {
		if (contentGrid[obj].hasOwnProperty("canvas")) contentGrid[obj].canvas();
	}
}

function htmlSetAltTags() {
	// needed to display local files in Firefox when the imgSrc is set inside css
	envoked("trash");
	envoked("oAdd");
	envoked("oSub");

	function envoked(name) {
		const obj = dbCL(`img_${name}`, null);
		for (let imgObj of obj) {
			imgObj.alt = `${name}.svg`;
		}
	}
}

function htmlSetVinChange() {
	const dirName = ["oSub", "trash", "oAdd"];
	envoked("vinChangeSub", -1);
	envoked("vinChangeTrash", 0);
	envoked("vinChangeAdd", 1);

	function envoked(name, dir) {
		const obj = dbCL(`${name}`, null);
		for (let btn of obj) {
			btn.onclick = () => {
				return utilsVinChange(btn, dir);
			};
			btn.children[0].classList.add(`img_${dirName[dir + 1]}`);
		}
	}
}

function timeoutCanvasFinished(canv, txt = { textTop: "", textBottom: "" }) {
	canv.noLoop();
	setTimeout(() => {
		canv.stroke(255, 0, 0);
		canv.strokeWeight(2);
		canv.textSize(globalValues.mediaSizes.fontSize * 3);
		canv.fill(0, 100, 60);
		canv.textAlign(canv.CENTER, canv.BOTTOM);
		canv.text(txt.textTop, canv.width / 2, canv.height / 2);
		canv.textAlign(canv.CENTER, canv.TOP);
		canv.text(txt.textBottom, canv.width / 2, canv.height / 2);
	}, 200);
}

function clearGlobalValue() {
	globalValues.globalInput.value = "";
	dbID("idVin_globalValue").value = "";
	dbID("idVin_globalValue").addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			globalValueChanged(dbID("idVin_globalValue"), true);
		}
	});
}

function globalValueChanged(obj, enter = null) {
	dbID("idVin_globalValue").classList.remove("cl_highlighted");
	const arr = contentLayout.nameList;
  globalValues.globalInput.value = obj.value;
	if (arr.includes(obj.value)) {
		dbID("idVin_globalValue").classList.add("cl_highlighted");
		if (enter === true) {
			let key = Object.entries(contentGrid).filter((arr) => arr[1].name == obj.value)[0][0];
			layoutToggelFullscreen(key);
		}
	}
}

function globalValuePopulateDatalist() {
	if (dbID("idDlist_globalValue").childNodes.length > 1) return;
	for (const name of contentLayout.nameList) {
		const opt = document.createElement("OPTION");
		opt.textContent = name;
		dbID("idDlist_globalValue").appendChild(opt);
	}
}

function layoutCreateNavbarPikaday() {
	new Pikaday({
		field: dbID("idBtn_navBar_KW"),
		numberOfMonths: 2,
		mainCalendar: "left",
		showTime: false,
		i18n: i18nDE,
		onSelect: function (date) {
			let weekText = `KW ${utilsGetWeekNumber()}`;
			let weekDiff = Math.ceil((date.getTime() - new Date().getTime()) / 86400000 / 7);
			if (weekDiff !== 0) {
				weekText += weekDiff > 0 ? ` (+${weekDiff})` : ` (${weekDiff})`;
			}
			dbID("idBtn_navBar_KW").textContent = weekText;
		},
	});
}
