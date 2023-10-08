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
		return AccData.data ? AccData.infos.shortName.data : "";
	},
	get createShort() {
		const newShort = {
			first: AccData.infos.firstName.data.slice(0, 2),
			sur: AccData.infos.surname.data.slice(0, 2),
			email: nuncDiscipuli.cred.email.slice(0, 2),
		};

		return newShort.first || newShort.sur || newShort.email;
	},
	clear: () => {
		for (let obj in contentGrid) {
			if (contentGrid[obj].hasOwnProperty("userStoreDBData")) contentGrid[obj].userStoreDBClear();
		}
	},
	getAllData: () => {
		let retData = {};
		for (let obj in contentGrid) {
			if (contentGrid[obj].hasOwnProperty("userStoreDBData")) retData[obj] = contentGrid[obj].userStoreDBData;
		}
		return retData;
	},
	getData(obj) {
		let name = `cl_${obj}`;
		if (contentGrid[name].hasOwnProperty("userStoreDBData")) return contentGrid[name].userStoreDBData;
	},
	saveData(obj, data) {
		let name = `cl_${obj}`;
		if (contentGrid[name].hasOwnProperty("userStoreDBData")) contentGrid[name].userStoreDBData = data;
	},
};

const AccData = {
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
				return Array.from({ length: 150 }, (_, i) => h - i - 1);
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
				return Array.from({ length: 110 }, (_, i) => off + i * 0.5 + 0.5);
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
		if (value.hasOwnProperty("userStoreDBName")) dbList.push(key);
	}
	if (nuncDiscipuli.checkLogin) {
		// logged in
		loadDiscipuli();
		KadUtils.dbID("idImg_userNav_A").src = KadUtils.DOM.getImgPath("uCheck");
		KadUtils.dbID("idImg_userNav_B").src = KadUtils.DOM.getImgPath("uX");
		KadUtils.dbID("idDiv_navBar_AccountSettingsA").setAttribute("data-type", "change");
		KadUtils.dbID("idDiv_navBar_AccountSettingsB").setAttribute("data-type", "logout");
		//show Download/Upload buttons
		for (const key of dbList) {
			KadUtils.dbIDStyle(`idDiv_child_gridtitle_dbUpload_${key}`).display = "initial";
			KadUtils.dbIDStyle(`idDiv_child_gridtitle_dbDownload_${key}`).display = "initial";
		}
		KadUtils.CSS.setRoot("navContentLength", contentLayout.contentLength);
	} else {
		// logged out
		KadUtils.dbID("idImg_userNav_A").src = KadUtils.DOM.getImgPath("uBasic");
		KadUtils.dbID("idImg_userNav_B").src = KadUtils.DOM.getImgPath("uPlus");
		KadUtils.dbID("idDiv_navBar_AccountSettingsA").setAttribute("data-type", "login");
		KadUtils.dbID("idDiv_navBar_AccountSettingsB").setAttribute("data-type", "register");
		KadUtils.dbIDStyle("idDiv_navBar_User").display = "none";
		KadUtils.dbID("idLbl_navBarLbl_User").textContent = "User";

		//hide Download/Upload buttons
		for (const key of dbList) {
			KadUtils.dbIDStyle(`idDiv_child_gridtitle_dbUpload_${key}`).display = "none";
			KadUtils.dbIDStyle(`idDiv_child_gridtitle_dbDownload_${key}`).display = "none";
		}
		KadUtils.CSS.setRoot("navContentLength", contentLayout.contentLength - 1); //"User" gets skipped
	}
}

// ------------CLEAR-------------
function clear_cl_UserAcc() {
	KadUtils.dbCLStyle("cl_UserAcc_pass").display = "initial";
	KadUtils.dbCLStyle("cl_UserAcc_check").display = "initial";
	KadUtils.dbID("idVin_userAcc_mail").removeAttribute("disabled");
	KadUtils.DOM.enableBtn("idBtn_userAcc_submit", true); //enable Button
	KadUtils.dbID("idLbl_userAcc_alert").textContent = "";
	KadUtils.dbID("idVin_userAcc_mail").value = "";
	KadUtils.dbID("idVin_userAcc_mail").addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			KadUtils.dbID("idVin_userAcc_pass").focus();
			event.KadUtils.Interaction.preventDefault();
		}
	});
	KadUtils.dbID("idVin_userAcc_pass").value = "";
	KadUtils.dbID("idVin_userAcc_pass").addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			KadUtils.dbID("idBtn_userAcc_submit").click();
			event.KadUtils.Interaction.preventDefault();
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
			KadUtils.dbID("idBtn_userAcc_submit").setAttribute("data-type", type);
			KadUtils.dbID("idBtn_userAcc_submit").textContent = KadUtils.String.firstLetterCap(type);
			KadUtils.dbID("idVin_userAcc_mail").focus();
			KadUtils.dbID("idVin_userAcc_mail").placeholder = "E-Mail";
			KadUtils.dbCLStyle("cl_UserAcc_infos").display = "none";
			layoutNavClick("AccountSettingsA");
			break;
		case "register":
			KadUtils.dbID("idBtn_userAcc_submit").setAttribute("data-type", type);
			KadUtils.dbID("idBtn_userAcc_submit").textContent = KadUtils.String.firstLetterCap(type);
			KadUtils.dbID("idVin_userAcc_mail").focus();
			KadUtils.dbID("idVin_userAcc_mail").placeholder = "E-Mail";
			KadUtils.dbCLStyle("cl_UserAcc_infos").display = "initial";
			createUserInfos(type);
			layoutNavClick("AccountSettingsB");
			break;
		case "change":
			KadUtils.dbID("idBtn_userAcc_submit").setAttribute("data-type", type);
			KadUtils.dbID("idBtn_userAcc_submit").textContent = KadUtils.String.firstLetterCap(type);
			createUserInfos(type);
			KadUtils.dbID("idVin_userAcc_mail").setAttribute("disabled", "true");
			KadUtils.dbID("idVin_userAcc_mail").placeholder = nuncDiscipuli.cred.email || "E-Mail";
			KadUtils.dbCLStyle("cl_UserAcc_infos").display = "initial";
			KadUtils.dbCLStyle("cl_UserAcc_pass").display = "none";
			KadUtils.dbCLStyle("cl_UserAcc_check").display = "none";
			layoutNavClick("AccountSettingsA");
			break;
		case "logout":
			accountLogout();
			break;
	}
	clear_cl_UserAcc();
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
	const parent = KadUtils.dbCL("cl_UserAcc_infos");
	KadUtils.DOM.clearFirstChild(parent);
	for (const [key, subObj] of Object.entries(AccData.infos)) {
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
			placeholder: type == "register" ? subObj.description : AccData.infos[key].data == null || AccData.infos[key].data == "" ? "..." : AccData.infos[key].data,
		});
		uInfoParent.appendChild(uInfoVin);
		const uInfoDel = cellBtn({
			names: ["uInfoDel", key],
			type: "Btn",
			subGroup: "button",
			img: "trash",
			ui: {
				uiRadius: "right",
				uiSize: "size1",
			},
			style: {
				textAlign: "center",
			},
			onclick: () => {
				AccData.infos[key].data = null;
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
	clear_cl_UserAcc();
	layoutNavClick(contentLayout.defaultPage);
}

function submitUser() {
	KadUtils.DOM.enableBtn("idBtn_userAcc_submit", false); //disable Button
	const type = KadUtils.dbID("idBtn_userAcc_submit").dataset.type;
	nuncDiscipuli.cred.email = KadUtils.dbID("idVin_userAcc_mail").value.trim();
	if (type == "register" || type == "change") {
		for (let [key, val] of Object.entries(AccData.infos)) {
			const id = `idVin_child_uInfoVin_${key}`;
			const vinUser = KadUtils.dbID(id).value.trim();
			if (vinUser != "") {
				AccData.infos[key].data = vinUser;
			}
		}
		if (nuncDiscipuli.short === null) {
			nuncDiscipuli.short = nuncDiscipuli.createShort;
		}
		KadUtils.dbID("idLbl_navBarLbl_User").textContent = nuncDiscipuli.short;
	}
	//just login
	nuncDiscipuli.cred.keepLogin = KadUtils.dbID("idCb_userAcc_check").checked ? "LOCAL" : "SESSION"; // "NONE";

	if (type == "login") {
		userAccLogin();
	}
	if (type == "register") {
		userAccRegister();
	}
	if (type == "change") {
		saveDiscipuli("UserAcc");
		layoutNavClick();
	}
}

function userAccLogin() {
	firebase
		.auth()
		.setPersistence(firebase.auth.Auth.Persistence[nuncDiscipuli.cred.keepLogin])
		.then(() => {
			return firebase
				.auth()
				.signInWithEmailAndPassword(nuncDiscipuli.cred.email, KadUtils.dbID("idVin_userAcc_pass").value.trim())
				.then((response) => {
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
				.createUserWithEmailAndPassword(nuncDiscipuli.cred.email, KadUtils.dbID("idVin_userAcc_pass").value.trim())
				.then((response) => {
					nuncDiscipuli.cred.uid = response.user.uid;
				});
		})
		.then(() => {
			let saves = nuncDiscipuli.getAllData();
			console.log(saves);
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
	KadUtils.dbIDStyle("idDiv_navBar_User").display = "initial";
	if (nuncDiscipuli.short == null) {
		nuncDiscipuli.short = nuncDiscipuli.createShort;
	}
	KadUtils.dbID("idLbl_navBarLbl_User").textContent = nuncDiscipuli.short;
	KadUtils.DOM.enableBtn("idBtn_userAcc_submit", true);
	layoutNavTitle();
	layoutNavClick("User");
}

function userAccError(error) {
	KadUtils.DOM.enableBtn(idBtn_userAcc_submit, true);
	KadUtils.dbID("idLbl_userAcc_alert").textContent = "E-Mail oder Passwort falsch!";
}

//--------------Load Single DATA-------------
function loadDiscipuli(category = null) {
	if (!nuncDiscipuli.checkLogin) return;
	FBUserSettings.doc(nuncDiscipuli.cred.uid)
		.get()
		.then((doc) => {
			const savedData = doc.data();
			if (category != null) {
				nuncDiscipuli.saveData(category, savedData[category]);
			} else {
				for (const [key, value] of Object.entries(savedData)) {
					if (key == "uid" || key == "email" || !Object.keys(contentGrid).includes(`cl_${key}`) || contentGrid[`cl_${key}`].userStoreDBName != key) {
						console.log("Currently not sopported:", key);
					} else {
						nuncDiscipuli.saveData(key, value);
					}
				}
				userAccSetUserBtn();
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
		for (const key of Object.keys(nuncDiscipuli.saves)) {
			data = { [key]: nuncDiscipuli.getData(key) };
		}
	} else {
		data = { [category]: nuncDiscipuli.getData(category) };
	}
	FBUserSettings.doc(nuncDiscipuli.cred.uid)
		.update(data, { merge: true })
		.then(() => {
			KadUtils.DOM.enableBtn("idBtn_userAcc_submit", true);
			setTimeout(() => {
				for (const key of Object.keys(data)) {
					KadUtils.dbIDStyle(`idBtn_child_gridtitle_dbUpload_cl_${key}`).filter = "invert(0)";
				}
			}, 500);
		})
		.catch((error) => {
			console.error("Error", error);
		});
}
