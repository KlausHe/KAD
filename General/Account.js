import { resetAll } from "../Main.js";
import { KadDOM, KadTable, dbCL, dbCLStyle, dbID, dbIDStyle, initEL, error, log } from "../General/KadUtils.js";
import { contentLayout, navClick } from "./Layout.js";
import { Data_AkademischerGrad, Data_HumanNames, Data_Nummernschild, Data_RALColors } from "./MainData.js";
import * as DBData from "../MainModulesDBData.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
	apiKey: "AIzaSyDHgM7J-2Q_W1Swp0Ozx6nY1QDoFcwEFwQ",
	authDomain: "kad-universe.firebaseapp.com",
	databaseURL: "https://kad-universe.firebaseio.com",
	projectId: "kad-universe",
	storageBucket: "kad-universe.appspot.com",
	messagingSenderId: "874702902059",
	appId: "1:874702902059:web:cbe47b5a31e8f57d",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export const nuncDiscipuli = {
	cred: {
		email: null,
		uid: null,
		keepLogin: null,
	},
	registering: false,
	logging: false,
	get short() {
		return AccData.data ? AccData.infos.shortName.data : "";
	},
	createShort: () => {
		const newShort = {
			first: AccData.infos.firstName.data?.slice(0, 2),
			sur: AccData.infos.surname.data?.slice(0, 2),
			email: nuncDiscipuli.cred.email.slice(0, 2),
		};
		return newShort.first || newShort.sur || newShort.email;
	},
	getAllData: () => {
		let retData = {};
		for (const dbDataObj of Object.values(DBData)) {
			retData[dbDataObj.dbName] = dbDataObj.data;
		}
		return retData;
	},
	getData(obj) {
		const objName = `storage_cl_${obj}`;
		return DBData[objName].data;
	},
	saveData(obj, data) {
		const objName = `storage_cl_${obj}`;
		if (!DBData[objName]) return;
		DBData[objName].data = data;
	},
};

export const AccData = {
	data: false,
	infos: {
		anrede: {
			data: null,
			description: "Anrede",
			get suggestions() {
				return Data_HumanNames.genders;
			},
		},
		titel: {
			data: null,
			description: "Titel",
			get suggestions() {
				return Object.entries(Data_AkademischerGrad.allEntries).map((d) => d.join(" - "));
			},
		},
		firstName: {
			data: null,
			description: "Vorname",
			get suggestions() {
				return Data_HumanNames.all;
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
				return Array.from({ length: 150 }, (n, i) => h - i - 1);
			},
		},
		birthPlace: {
			data: null,
			description: "Geburtsort",
			get suggestions() {
				return Array.from(Data_Nummernschild.values());
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
				return Data_RALColors.map((o) => o.Name);
			},
		},
		shoeSize: {
			data: null,
			description: "Schuhgröße",
			get suggestions() {
				let off = 5;
				return Array.from({ length: 110 }, (n, i) => off + i * 0.5 + 0.5);
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

// ------------CLEAR-------------
export function clear_cl_UserLogin() {
	nuncDiscipuli.cred.email = idVin_userLogin_email.KadReset();
	nuncDiscipuli.cred.uid = idVin_userLogin_pass.KadReset();

	idCb_userLogin_check.KadReset();
	accountPersistanceChange();
	dbID("idVin_userLogin_email").removeAttribute("disabled");
	KadDOM.enableBtn("idBtn_userLogin_login", true);
	dbID("idLbl_userLogin_alert").textContent = "";
}

export function clear_cl_UserChange() {
	createUserInfos();
}

export const storage_cl_UserAcc = {
	dbName: "UserAcc",
	contentName: "cl_UserAcc",
	clear() {
		AccData.data = false;
		for (const key of Object.keys(AccData.data)) {
			AccData.infos[key].data = null;
		}
	},
	get data() {
		let data = {};
		for (const [key, value] of Object.entries(AccData.infos)) {
			data[key] = value.data;
		}
		return data;
	},
	set data(data) {
		AccData.data = true;
		for (const [key, value] of Object.entries(data)) {
			AccData.infos[key].data = value;
		}
	},
};

//--------------RESET BASIC DATA-------------
export function createNewNuncDiscipuli() {
	nuncDiscipuli.cred.email = null;
	nuncDiscipuli.cred.uid = null;
	for (const dbDataObj of Object.values(DBData)) {
		dbDataObj.clear();
	}
}

initEL({
	id: idVin_userLogin_email,
	action: "keyup",
	fn: (event) => {
		if (event.keyCode === 13) {
			dbID("idVin_userLogin_pass").focus();
			event.preventDefault();
		}
	},
	resetValue: "E-Mail",
});
initEL({
	id: idVin_userLogin_pass,
	action: "keyup",
	fn: (event) => {
		if (event.keyCode === 13) {
			dbID("idBtn_userLogin_login").click();
			event.preventDefault();
		}
	},
	resetValue: "Passwort",
});

initEL({ id: idDiv_navBar_AccountLogin, fn: openNavLogin });
initEL({ id: idDiv_navBar_AccountChange, fn: openNavChange });

function openNavLogin() {
	clear_cl_UserLogin();
	navClick("cl_UserLogin");
	dbID("idVin_userLogin_email").focus();
}

function openNavChange() {
	clear_cl_UserChange();
	navClick("cl_UserChange");
}

//-----------------------ACTIONS------------------------------------
initEL({ id: idCb_userLogin_check, fn: accountPersistanceChange, resetValue: true });
initEL({ id: idBtn_userLogin_login, fn: firebaseLogin });
initEL({ id: idBtn_userLogin_register, fn: firebaseRegister });
initEL({ id: idBtn_userChange_logout, fn: firebaseLogout });
initEL({ id: idBtn_userChange_change, fn: userChange });
initEL({ id: idBtn_userLogin_cancel, fn: loginCancel });
initEL({ id: idBtn_userChange_cancel, fn: changeCancel });

function accountPersistanceChange() {
  nuncDiscipuli.cred.keepLogin = dbID("idCb_userLogin_check").checked ? browserSessionPersistence : browserLocalPersistence; // "Session" : "None";
  log(nuncDiscipuli.cred.keepLogin)
}

onAuthStateChanged(auth, (user) => {
	const state = user != null;
	nuncDiscipuli.cred.email = state ? user.email : null;
	nuncDiscipuli.cred.uid = state ? user.uid : null;
	dbIDStyle(idDiv_navBar_AccountLogin).display = state ? "none" : "block";
	dbIDStyle(idDiv_navBar_AccountChange).display = state ? "block" : "none";
	dbID(idLbl_userChange_user).textContent = state ? nuncDiscipuli.cred.email : "User";
	if (state && !nuncDiscipuli.registering) loadDiscipuli(null);

	let btnList = [...dbCLStyle("DLParent", null), ...dbCLStyle("ULParent", null)];
	for (const btn of btnList) {
		btn.display = state ? "initial" : "none";
	}
});

export function userLoggedIn() {
	return auth.currentUser != null;
}

function firebaseLogin() {
	const email = KadDOM.stringFromInput(idVin_userLogin_email);
	const pass = KadDOM.stringFromInput(idVin_userLogin_pass);
	setPersistence(auth, nuncDiscipuli.cred.keepLogin);
	nuncDiscipuli.logging = true;
	signInWithEmailAndPassword(auth, email, pass)
		.then(() => {
			KadDOM.enableBtn("idBtn_userLogin_login", false);
		})
		.catch((error) => {
			userAccError(error);
		});
}

function firebaseRegister() {
	nuncDiscipuli.registering = true;
	const email = KadDOM.stringFromInput(idVin_userLogin_email);
	const pass = KadDOM.stringFromInput(idVin_userLogin_pass);
	createUserWithEmailAndPassword(auth, email, pass)
		.then((user) => {
			nuncDiscipuli.registering = false;
			userRegister();
		})
		.catch((error) => {
			nuncDiscipuli.registering = false;
			userAccError(error);
		});
}
function userRegister() {
	createNewDatabase();
	navClick("cl_UserChange");
	KadDOM.enableBtn("idBtn_userLogin_login", false);
}

function firebaseLogout() {
	signOut(auth)
		.then(() => {
			dbIDStyle("idDiv_navBar_User").display = "none";
			resetAll();
		})
		.catch((error) => {
			alert(`ERROR, could not log out:`, error);
		});
}

function userChange() {
	for (let key of Object.keys(AccData.infos)) {
		const id = `idVin_child_uInfoVin_${key}`;
		const vinUser = KadDOM.stringFromInput(id);
		if (vinUser != "") {
			AccData.infos[key].data = vinUser;
		}
	}
	if (nuncDiscipuli.short === null) {
		nuncDiscipuli.short = nuncDiscipuli.createShort();
	}
	dbID("idLbl_navBarLbl_User").textContent = nuncDiscipuli.short;
	saveDiscipuli("UserAcc");
}

function loginCancel() {
	clear_cl_UserLogin();
	navClick(contentLayout.defaultPage);
}
function changeCancel() {
	clear_cl_UserChange();
	navClick(contentLayout.defaultPage);
}

function userAccSetUserBtn() {
	dbIDStyle("idDiv_navBar_User").display = "initial";
	if (nuncDiscipuli.short == null) AccData.infos.shortName.data = nuncDiscipuli.createShort();
	dbID("idLbl_navBarLbl_User").textContent = nuncDiscipuli.short;
	KadDOM.enableBtn("idBtn_userLogin_login", true);
}

function userAccError(err) {
	KadDOM.enableBtn(idBtn_userLogin_login, true);
	KadDOM.enableBtn(idBtn_userLogin_register, true);
	dbID(idLbl_userLogin_alert).textContent = "E-Mail oder Passwort falsch!";
	error(err);
}

//--------------Load Single DATA-------------
export async function loadDiscipuli(category = null) {
	if (!userLoggedIn()) return;
	const categories = [];
	if (category !== null) {
		categories.push(category);
	} else {
		for (const dbDataObj of Object.values(DBData)) {
			categories.push(dbDataObj.dbName);
		}
	}
	loadFromDatabase(categories);
}

//--------------Save/Update Single DATA-------------
export function saveDiscipuli(category = null) {
	if (!userLoggedIn()) return;
	let saveData = {};
	if (category !== null) {
		saveData = { [category]: nuncDiscipuli.getData(category) };
	} else {
		for (const key of Object.keys(nuncDiscipuli.saves)) {
			saveData[key] = nuncDiscipuli.getData(key);
		}
	}
	saveToDatabase(saveData);
}

//--------------Load Single DATA-------------
async function loadFromDatabase(categories) {
	const docRef = doc(firestore, "User_Settings", nuncDiscipuli.cred.uid);
	const docSnap = await getDoc(docRef);
	const savedData = docSnap.data();
	for (let category of categories) {
		if (Object.keys(savedData).includes(category)) {
			nuncDiscipuli.saveData(category, savedData[category]);
		} else {
			error("Currently not supported data from saved userdata:", category);
		}
	}
	userAccSetUserBtn();

	if (nuncDiscipuli.logging) {
		nuncDiscipuli.logging = false;
		navClick("User");
	}
}

async function saveToDatabase(data) {
	const docRef = doc(firestore, "User_Settings", nuncDiscipuli.cred.uid);
	await updateDoc(docRef, data);
}

async function createNewDatabase() {
	const colRef = collection(firestore, "User_Settings");
	await setDoc(doc(colRef, nuncDiscipuli.cred.uid), nuncDiscipuli.getAllData());
}
// ------------CREATE INFO-DIV-------------
function createUserInfos() {
	const parent = dbCL("cl_UserChange_infos");
	KadDOM.clearFirstChild(parent);
	const loggedIn = userLoggedIn();
	for (const [key, subObj] of Object.entries(AccData.infos)) {
		const uInfoParent = KadTable.createCell("Div", {
			names: ["uInfoParent", key],
			style: {
				whiteSpace: "nowrap",
			},
		});
		parent.appendChild(uInfoParent);

		const uInfoBtn = KadTable.createCell("Lbl", {
			names: ["uInfoLbl", key],
			createClass: ["cl_info"],
			ui: {
				uiRadius: "left",
			},
			text: subObj.description,
		});
		uInfoParent.appendChild(uInfoBtn);

		let ph = subObj.description;
		if (loggedIn) {
			if (AccData.infos[key].data) {
				ph = AccData.infos[key].data;
			} else {
				ph = "...";
			}
		}

		const uInfoVin = KadTable.createCell("Vin", {
			names: ["uInfoVin", key],
			subGroup: "text",
			ui: {
				uiRadius: "none",
				uiSize: "wide",
				list: `dList_uInfo_${key}`,
				maxLength: subObj.maxlength ? subObj.maxlength : 50,
			},
			placeholder: ph,
		});
		uInfoParent.appendChild(uInfoVin);
		const uInfoDel = KadTable.createCell("Btn", {
			names: ["uInfoDel", key],
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
				const opt = new Option(sug);
				// document.createElement("OPTION");
				dList.appendChild(opt);
			}
		}
	}
}
