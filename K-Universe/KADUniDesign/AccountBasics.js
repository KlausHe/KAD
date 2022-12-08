let nuncDiscipuli = {
	cred: {
		email: null,
		uid: null,
		keepLogin: "SESSION",
	},
	get checkLogin() {
		return firebase.auth().currentUser != null;
	},
	get short() {
		return accData.data ? accData.infos.shortName.data : "";
	},
	clear: () => {
		nuncDiscipuli.saves.userAcc = {};
		accData.data = false; //reset the "Data is set" variable when clear
		nuncDiscipuli.saves.UserGridLayout = [];
		nuncDiscipuli.saves.ColorSettings = null;
		nuncDiscipuli.saves.generalSettings = {
			copyClick: true,
			copySeparator: true,
			decimals: 4,
			fontSize: 12,
		};
		nuncDiscipuli.saves.MaterialFilterSettings = [...materialFilterOptions.orig];
		nuncDiscipuli.saves.Material = [...materialOptions.matListOrig];
		nuncDiscipuli.saves.Tugas = {};
		nuncDiscipuli.saves.Howa = "Berlin";
		nuncDiscipuli.saves.Covid = "World";
		nuncDiscipuli.saves.Lions = 0;
		nuncDiscipuli.saves.WikiSearch = {
			tab: null,
			content: null,
		};
		nuncDiscipuli.saves.Lotto = {
			startup: true,
			Eurojackpot: {
				tips: [],
				star: [],
				date: null,
			},
			"6aus49": {
				tips: [],
				star: [],
				date: null,
			},
		};
	},
	saves: {
		get userAcc() {
			let data = {};
			for (const [key, value] of Object.entries(accData.infos)) {
				data[key] = value.data;
			}
			return data;
		},
		set userAcc(data) {
			accData.data = true;
			for (const [key, value] of Object.entries(data)) {
				accData.infos[key].data = value;
			}
		},
		get UserGridLayout() {
			return usergridData.generateArray();
		},
		set UserGridLayout(data) {
			contentLayout.navContent.User = data.filter((cl) => {
				return Object.keys(contentGrid).includes(cl);
			});
			for (const gridName of contentLayout.navContent.Universe) {
				contentGrid[gridName].enableUser = contentLayout.navContent.User.includes(gridName); //safety, if old things in Database!
			}
			usergridCreateTable();
			usergridData.checkAllGroups();
		},
		get GeneralSettings() {
			return globalValues.settings;
		},
		set GeneralSettings(data) {
			for (const key of Object.keys(globalValues.settings)) {
				globalValues.settings[key] = data[key];
			}
			//call functions without arg to toggle secific functionality
			settingsCopyClick();
			settingsCopySeparator();
			settingsFontsize();
			settingsDecimals();
		},
		get ColorSettings() {
			return {
				lightmode: deepClone(globalValues.colors.lightmode),
				darkmode: deepClone(globalValues.colors.darkmode),
			};
		},
		set ColorSettings(data) {
			if (data == null) {
				globalValues.colors.lightmode = deepClone(globalValues.colors.colorSettingsOrig.lightmode);
				globalValues.colors.darkmode = deepClone(globalValues.colors.colorSettingsOrig.darkmode);
				return;
			}
			globalValues.colors.lightmode = deepClone(data.lightmode);
			globalValues.colors.darkmode = deepClone(data.darkmode);
			displayColorSystem();
			populateColorSelector();
		},
		get ColorSettings() {
			return {
				lightmode: deepClone(globalValues.colors.lightmode),
				darkmode: deepClone(globalValues.colors.darkmode),
			};
		},
		set ColorSettings(data) {
			if (data == null) {
				globalValues.colors.lightmode = deepClone(globalValues.colors.colorSettingsOrig.lightmode);
				globalValues.colors.darkmode = deepClone(globalValues.colors.colorSettingsOrig.darkmode);
				return;
			}
			globalValues.colors.lightmode = deepClone(data.lightmode);
			globalValues.colors.darkmode = deepClone(data.darkmode);
			displayColorSystem();
			populateColorSelector();
		},
		get Material() {
			return [...materialOptions.matList];
		},
		set Material(data) {
			materialOptions.matList = data;
			materialSelectedTable();
		},
		get MaterialFilterSettings() {
			return [...materialFilterOptions.select];
		},
		set MaterialFilterSettings(data) {
			let filteredWrong = [];
			materialFilterOptions.select = [];
			for (const dataPoint of data) {
				if (Object.keys(Data_Material.metadata).includes(dataPoint)) {
					materialFilterOptions.select.push(dataPoint);
				} else {
					filteredWrong.push(dataPoint);
				}
			}
			if (filteredWrong.length > 0) console.log("The following Filters are no longer supported:", filteredWrong);
			materialFilterUpdateCB();
			materialFilterBuildTable();
			// materialSelectedTable();
		},
		get Tugas() {
			return tugasOptions;
		},
		set Tugas(data) {
			tugasOptions = deepClone(data);
			createTugas();
		},
		get WikiSearch() {
			return wikiOptions.search;
		},
		set WikiSearch(data) {
			wikiOptions.search = deepClone(data);
			if (idVin_wikiInput.value == "") {
				if (wikiOptions.search.tab != null) {
					dbID("idVin_wikiInput").placeholder = wikiOptions.search.tab;
					wikiSearchInput(wikiOptions.search.tab);
					if (wikiOptions.search.content) {
						wikiShowSelectedText(wikiOptions.search.content, true);
					}
					if (wikiOptions.search.image) {
						wikiShowSelectedImage(wikiOptions.search.image, true);
					}
				} else if (accData.data != false) {
					const arr = Object.values(accData.infos).filter((obj) => {
						return obj.data != null;
					});
					const autoSearch = randomObject(arr);
					dbID("idVin_wikiInput").placeholder = autoSearch.data;
					wikiSearchInput(autoSearch.data, true);
				}
				clearTable("idTabBody_wikiTitleTable");
			}
		},
		get Lotto() {
			let retData = {};
			for (const [key, values] of Object.entries(lottoOptions.games)) {
				retData[key] = {};
				retData[key]["tips"] = values.savedSet.tips;
				retData[key]["star"] = values.savedSet.star;
				retData[key]["date"] = values.savedSet.date;
			}
			return retData;
		},
		set Lotto(data) {
			dbCLStyle("cl_LottoSavedGame").display = "initial";
			for (const [key, values] of Object.entries(lottoOptions.games)) {
				if (data[key] != null && data[key] != "") {
					lottoOptions.games[key].savedSet["tips"] = data[key].date != null ? [...data[key].tips] : [];
					lottoOptions.games[key].savedSet["star"] = data[key].date != null ? [...data[key].star] : [];
					lottoOptions.games[key].savedSet["date"] = data[key].date != null ? data[key].date : null;
				}
			}
			if (!data.startup) {
				lottoUpdateSavegames();
			}
			lottoOptions.randomiziation = 0;
			clearTimeout(lottoOptions.randomTimeout);
			createLotto(false);
		},
		get Howa() {
			return howaData.pos.location;
		},
		set Howa(data) {
			dbID("idVin_howaEntry").value = data;
			howaGetLocation();
		},
		get Lions() {
			return lionsOptions.num;
		},
		set Lions(data) {
			dbID("idVin_lionsInput").value = data;
			setTimeout(() => {
				lionsRequestNumber();
			}, 1000);
		},
		get Covid() {
			return covidData.selectedCountry;
		},
		set Covid(data) {
			covidData.selectedCountry = data;
			if (covidGraph === null || covidData.data === null) return;
			covidRefreshGraph();
			covidGraph.update();
		},
	},
};

const accData = {
	data: false,
	infos: {
		anrede: {
			data: null,
			description: "Anrede",
			get suggestions() {
				return Data_Names.genders;
			},
		},
		titel: {
			data: null,
			description: "Titel",
			get suggestions() {
				return Object.entries(Data_AkademischerGrad.allEntries).map((d) => {
					return d.join(" - ");
				});
			},
		},
		firstName: {
			data: null,
			description: "Vorname",
			get suggestions() {
				return Data_Names.all;
			},
		},
		surname: {
			data: null,
			description: "Nachname",
			suggestions: ["Schmidt", "Müller"],
		},
		shortName: {
			data: null,
			description: "Kürzel",
			suggestions: null,
			maxlength: 2,
		},
		birthYear: {
			data: null,
			description: "Geburtsjahr",
			get suggestions() {
				let h = new Date().getFullYear();
				return Array.from(
					{
						length: 150,
					},
					(_, i) => h - i - 1
				);
			},
		},
		birthPlace: {
			data: null,
			description: "Geburtsort",
			get suggestions() {
				return Array.from(Data_PlatLesen.values());
			},
		},
		lTier: {
			data: null,
			description: "Lieblingstier",
			suggestions: ["Hund", "Katze", "Hamster", "Maus", "Esel", "Flamingo"],
		},
		lFarbe: {
			data: null,
			description: "Lieblingsfarbe",
			get suggestions() {
				return Data_Kounselor.map((o) => {
					return o.Name;
				});
			},
		},
		shoeSize: {
			data: null,
			description: "Schuhgröße",
			get suggestions() {
				let off = 5;
				return Array.from(
					{
						length: 110,
					},
					(_, i) => off + i * 0.5 + 0.5
				);
			},
		},
		lFilm: {
			data: null,
			description: "Lieblingsfilm",
			suggestions: null,
		},
		eyeColor: {
			data: null,
			description: "Augenfarbe",
			suggestions: ["blau", "braun", "blau-grün", "grün"],
		},
	},
};

function toggleLayout() {
	let dbList = [];
	for (let [key, value] of Object.entries(contentGrid)) {
		if (value.hasOwnProperty("userStoreDB")) dbList.push(key);
	}
	if (nuncDiscipuli.checkLogin) {
		// logged in
		loadDiscipuli();
		dbID("idImg_userNav_A").src = imgPath("uCheck");
		dbID("idImg_userNav_B").src = imgPath("uX");
		dbID("idDiv_navBar_AccountSettingsA").setAttribute("data-type", "change");
		dbID("idDiv_navBar_AccountSettingsB").setAttribute("data-type", "logout");
		//show Download/Upload buttons
		for (const key of dbList) {
			dbIDStyle(`idDiv_child_gridtitle_dbUpload_${key}`).display = "initial";
			dbIDStyle(`idDiv_child_gridtitle_dbDownload_${key}`).display = "initial";
		}
		setCssRoot("navContentLength", contentLayout.contentLength);
	} else {
		// logged out
		dbID("idImg_userNav_A").src = imgPath("uBasic");
		dbID("idImg_userNav_B").src = imgPath("uPlus");
		dbID("idDiv_navBar_AccountSettingsA").setAttribute("data-type", "login");
		dbID("idDiv_navBar_AccountSettingsB").setAttribute("data-type", "register");
		dbIDStyle("idDiv_navBar_User").display = "none";
		dbID("idLbl_navBarLbl_User").textContent = "User"; // User ShortName is set in userAccReturn(), after login the data has not yet returned

		//hide Download/Upload buttons
		for (const key of dbList) {
			dbIDStyle(`idDiv_child_gridtitle_dbUpload_${key}`).display = "none";
			dbIDStyle(`idDiv_child_gridtitle_dbDownload_${key}`).display = "none";
		}
		setCssRoot("navContentLength", contentLayout.contentLength - 1); //"User" gets skipped
	}
}

// ------------CLEAR-------------
function clear_cl_userAcc() {
	dbCLStyle("cl_userAcc_pass").display = "initial";
	dbCLStyle("cl_userAcc_check").display = "initial";
	dbID("idVin_userAcc_mail").removeAttribute("disabled");
	enableBtn("idBtn_userAcc_submit", true); //enable Button
	dbID("idLbl_userAcc_alert").textContent = "";
	dbID("idVin_userAcc_mail").value = "";
	dbID("idVin_userAcc_mail").addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			dbID("idVin_userAcc_pass").focus();
			event.preventDefault();
		}
	});
	dbID("idVin_userAcc_pass").value = "";
	dbID("idVin_userAcc_pass").addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			dbID("idBtn_userAcc_submit").click();
			event.preventDefault();
		}
	});
}

//--------------RESET BASIC DATA-------------
function createNewNuncDiscipuli() {
	nuncDiscipuli.cred.email = null;
	nuncDiscipuli.cred.uid = null;
	nuncDiscipuli.clear();
}

function openUserNav(btn) {
	const type = btn.dataset.type;
	//initialize inputs
	switch (type) {
		case "login":
			dbID("idBtn_userAcc_submit").setAttribute("data-type", type);
			dbID("idBtn_userAcc_submit").textContent = firstLetterCap(type);
			dbID("idVin_userAcc_mail").focus();
			dbID("idVin_userAcc_mail").placeholder = "E-Mail";
			dbCLStyle("cl_userAcc_infos").display = "none";
			layoutNavClick("AccountSettingsA");
			break;
		case "register":
			dbID("idBtn_userAcc_submit").setAttribute("data-type", type);
			dbID("idBtn_userAcc_submit").textContent = firstLetterCap(type);
			dbID("idVin_userAcc_mail").focus();
			dbID("idVin_userAcc_mail").placeholder = "E-Mail";
			dbCLStyle("cl_userAcc_infos").display = "initial";
			createUserInfos(type);
			layoutNavClick("AccountSettingsB");
			break;
		case "change":
			dbID("idBtn_userAcc_submit").setAttribute("data-type", type);
			dbID("idBtn_userAcc_submit").textContent = firstLetterCap(type);
			createUserInfos(type);
			dbID("idVin_userAcc_mail").setAttribute("disabled", "true");
			dbID("idVin_userAcc_mail").placeholder = nuncDiscipuli.cred.email || "E-Mail";
			dbCLStyle("cl_userAcc_infos").display = "initial";
			dbCLStyle("cl_userAcc_pass").display = "none";
			dbCLStyle("cl_userAcc_check").display = "none";
			layoutNavClick("AccountSettingsA");
			break;
		case "logout":
			accountLogout();
			break;
	}
	clear_cl_userAcc();
}

function accountLogout() {
	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
	firebase
		.auth()
		.signOut()
		.then(() => {
			resetAll();
		})
		.catch((error) => {
			alert(`ERROR, could not log out: ${error}`);
		});
}

// ------------CREATE INFO-DIV-------------
function createUserInfos(type) {
	const parent = dbCL("cl_userAcc_infos");
	clearFirstChild(parent);
	for (const [key, subObj] of Object.entries(accData.infos)) {
		const uInfoParent = cellDiv({
			names: ["uInfoParent", key],
			type: "Div",
			style: {
				whiteSpace: "nowrap",
			},
		});
		parent.appendChild(uInfoParent);

		const uInfoBtn = cellLbl({
			names: ["uInfoLbl", key],
			type: "Lbl",
			createClass: ["cl_info"],
			ui: {
				uiRadius: "left",
			},
			text: subObj.description,
		});
		uInfoParent.appendChild(uInfoBtn);

		const uInfoVin = cellVin({
			names: ["uInfoVin", key],
			type: "Vin",
			subGroup: "text",
			ui: {
				uiRadius: "none",
				uiSize: "wide",
				list: `dList_uInfo_${key}`,
				maxLength: subObj.maxlength ? subObj.maxlength : 50,
			},
			placeholder:
				type == "register" ? subObj.description : accData.infos[key].data == null || accData.infos[key].data == "" ? "..." : accData.infos[key].data,
		});
		uInfoParent.appendChild(uInfoVin);
		const uInfoDel = cellBtn({
			names: ["uInfoDel", key],
			type: "Btn",
			subGroup: "button",
			img: "trash",
			ui: {
				uiRadius: "right",
				uiSize: "square",
			},
			style: {
				textAlign: "center",
			},
			onclick: () => {
				accData.infos[key].data = null;
				uInfoVin.value = "";
				uInfoVin.placeholder = "...";
			},
		});
		uInfoParent.appendChild(uInfoDel);

		if (subObj.suggestions != null) {
			const dList = document.createElement("datalist");
			dList.id = `dList_uInfo_${key}`;
			uInfoVin.appendChild(dList);
			for (let sug of subObj.suggestions) {
				const opt = document.createElement("OPTION");
				opt.textContent = sug;
				dList.appendChild(opt);
			}
		}
	}
}

//---------------ACTIONS--------------
function cancelAccount() {
	clear_cl_userAcc();
	layoutNavClick(contentLayout.defaultPage);
}

function submitUser() {
	enableBtn("idBtn_userAcc_submit", false); //disable Button
	const type = dbID("idBtn_userAcc_submit").dataset.type;
	nuncDiscipuli.cred.email = dbID("idVin_userAcc_mail").value.trim();
	if (type == "register" || type == "change") {
		for (let [key, val] of Object.entries(accData.infos)) {
			const id = `idVin_child_uInfoVin_${key}`;
			const vinUser = dbID(id).value.trim();
			if (vinUser != "") {
				accData.infos[key].data = vinUser;
			}
		}
		if (nuncDiscipuli.short === null) {
			const newShort = {
				first: accData.infos.firstName.slice(0, 2),
				sur: accData.infos.surname.slice(0, 2),
				email: nuncDiscipuli.cred.email.slice(0, 2),
			};
			nuncDiscipuli.short = newShort.first || newShort.sur || newShort.email;
		}
	}
	//just login
	nuncDiscipuli.cred.keepLogin = dbID("idCb_userAcc_check").checked ? "LOCAL" : "SESSION"; // "NONE";
	switch (type) {
		case "login":
			userAccLogin();
			break;
		case "register":
			userAccRegister();
			break;
		case "change":
			saveDiscipuli("userAcc");
			layoutNavClick();
			break;
	}
}

function userAccLogin() {
	firebase
		.auth()
		.setPersistence(firebase.auth.Auth.Persistence[nuncDiscipuli.cred.keepLogin])
		.then(() => {
			return firebase
				.auth()
				.signInWithEmailAndPassword(nuncDiscipuli.cred.email, dbID("idVin_userAcc_pass").value.trim())
				.then((response) => {
					console.log("loggin OK", response.user.uid);
					nuncDiscipuli.cred.uid = response.user.uid;
					loadDiscipuli();
				});
		})
		.catch((error) => {
			userAccError(error);
		});
}

function userAccRegister() {
	firebase
		.auth()
		.setPersistence(firebase.auth.Auth.Persistence[keepLogin])
		.then(() => {
			return firebase
				.auth()
				.createUserWithEmailAndPassword(nuncDiscipuli.cred.email, dbID("idVin_userAcc_pass").value.trim())
				.then((response) => {
					nuncDiscipuli.cred.uid = response.user.uid;
				});
		})
		.then(() => {
			let saves = nuncDiscipuli.saves;
			saves.uid = nuncDiscipuli.cred.uid;
			saves.email = nuncDiscipuli.cred.email;
			FBUserSettings.doc(nuncDiscipuli.cred.uid)
				.set(saves)
				.then(() => {
					userAccSetUserBtn();
				});
		})
		.catch((error) => {
			userAccError(error);
		});
}

function userAccSetUserBtn() {
	dbIDStyle("idDiv_navBar_User").display = "initial";
	dbID("idLbl_navBarLbl_User").textContent = nuncDiscipuli.short;
	enableBtn("idBtn_userAcc_submit", true);
	layoutNavTitle();
	layoutNavClick("User");
}

function userAccError(error) {
	enableBtn(idBtn_userAcc_submit, true);
	dbID("idLbl_userAcc_alert").textContent = "E-Mail oder Passwort falsch!";
}

//--------------Load Single DATA-------------
function loadDiscipuli(category = null) {
	if (!nuncDiscipuli.checkLogin) return;
	FBUserSettings.doc(nuncDiscipuli.cred.uid)
		.get()
		.then((doc) => {
			const savedData = doc.data();
			if (category == null) {
				for (const [key, value] of Object.entries(savedData)) {
					if (key == "uid" || key == "email" || !Object.keys(contentGrid).includes(`cl_${key}`) || contentGrid[`cl_${key}`].userStoreDB != key) {
						console.log("Currently not sopported:", key);
					} else {
						nuncDiscipuli.saves[key] = value;
					}
				}
				userAccSetUserBtn();
			} else {
				nuncDiscipuli.saves[category] = savedData[category];
			}
		})
		.catch((error) => {
			console.error("Error", error);
		});
}

//--------------Save/Update Single DATA-------------
function saveDiscipuli(category = null) {
	if (!nuncDiscipuli.checkLogin) return;
	let data = {};
	if (category == null) {
		for (const keys of Object.keys(nuncDiscipuli.saves)) {
			data = { [keys]: nuncDiscipuli.saves[keys] };
		}
	} else {
		data = { [category]: nuncDiscipuli.saves[category] };
	}
	FBUserSettings.doc(nuncDiscipuli.cred.uid)
		.update(data, { merge: true })
		.then(() => {
			enableBtn("idBtn_userAcc_submit", true);
			setTimeout(() => {
				for (const key of Object.keys(data)) {
					dbIDStyle(`idBtn_child_gridtitle_dbUpload_cl_${key}`).filter = "invert(0)";
				}
			}, 500);
		})
		.catch((error) => {
			console.error("Error", error);
		});
}