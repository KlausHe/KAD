import { resetAll } from "../Main.js";
import * as KadUtils from "../General/KadUtils.js";
import { contentGrid, contentLayout, navClick } from "./Layout.js";
import { Data_AkademischerGrad, Data_HumanNames, Data_Nummernschild, Data_RALColors } from "./MainData.js";
import * as DBData from "../MainModulesDBData.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

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
	nuncDiscipuli.cred.email = KadUtils.KadDOM.resetInput("idVin_userLogin_email", "E-Mail");
	nuncDiscipuli.cred.uid = KadUtils.KadDOM.resetInput("idVin_userLogin_pass", "Passwort");

	KadUtils.KadDOM.resetInput("idCb_userLogin_check", true);
	accountPersistanceChange();
	KadUtils.dbID("idVin_userLogin_email").removeAttribute("disabled");
	KadUtils.KadDOM.enableBtn("idBtn_userLogin_login", true);
	KadUtils.dbID("idLbl_userLogin_alert").textContent = "";
	KadUtils.dbID("idVin_userLogin_email").addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			KadUtils.dbID("idVin_userLogin_pass").focus();
			event.preventDefault();
		}
	});
	KadUtils.dbID("idVin_userLogin_pass").addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			KadUtils.dbID("idBtn_userLogin_login").click();
			event.preventDefault();
		}
	});
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

KadUtils.daEL(idDiv_navBar_AccountLogin, "click", openNavLogin);
KadUtils.daEL(idDiv_navBar_AccountChange, "click", openNavChange);

function openNavLogin() {
	clear_cl_UserLogin();
	navClick("cl_UserLogin");
	KadUtils.dbID("idVin_userLogin_email").focus();
}

function openNavChange() {
	clear_cl_UserChange();
	navClick("cl_UserChange");
}

//-----------------------ACTIONS------------------------------------
KadUtils.daEL(idCb_userLogin_check, "change", accountPersistanceChange);
KadUtils.daEL(idBtn_userLogin_login, "click", firebaseLogin);
KadUtils.daEL(idBtn_userLogin_register, "click", firebaseRegister);
KadUtils.daEL(idBtn_userChange_logout, "click", firebaseLogout);
KadUtils.daEL(idBtn_userChange_change, "click", userChange);
KadUtils.daEL(idBtn_userLogin_cancel, "click", loginCancel);
KadUtils.daEL(idBtn_userChange_cancel, "click", changeCancel);

function accountPersistanceChange() {
	nuncDiscipuli.cred.keepLogin = KadUtils.dbID("idCb_userLogin_check").checked ? "Session" : "None"; // "SESSION";
}

onAuthStateChanged(auth, (user) => {
	const state = user != null;
	nuncDiscipuli.cred.email = state ? user.email : null;
	nuncDiscipuli.cred.uid = state ? user.uid : null;
	KadUtils.dbIDStyle(idDiv_navBar_AccountLogin).display = state ? "none" : "block";
	KadUtils.dbIDStyle(idDiv_navBar_AccountChange).display = state ? "block" : "none";
	KadUtils.dbID(idLbl_userChange_user).textContent = state ? nuncDiscipuli.cred.email : "User";
	if (state && !nuncDiscipuli.registering) loadDiscipuli(null);

	let btnList = [...KadUtils.dbCLStyle("DLParent", null), ...KadUtils.dbCLStyle("ULParent", null)];
	for (const btn of btnList) {
		btn.display = state ? "initial" : "none";
	}
});

export function userLoggedIn() {
	return auth.currentUser != null;
}

function firebaseLogin() {
	const email = KadUtils.dbID(idVin_userLogin_email).value.trim();
	const pass = KadUtils.dbID(idVin_userLogin_pass).value.trim();
	// setPersistence(auth, nuncDiscipuli.cred.keepLogin);
	nuncDiscipuli.logging = true;
	signInWithEmailAndPassword(auth, email, pass)
		.then(() => {
			KadUtils.KadDOM.enableBtn("idBtn_userLogin_login", false);
		})
		.catch((error) => {
			userAccError(error);
		});
}

function firebaseRegister() {
	nuncDiscipuli.registering = true;
	const email = KadUtils.dbID(idVin_userLogin_email).value.trim();
	const pass = KadUtils.dbID(idVin_userLogin_pass).value.trim();
	console.log("register", email, pass);
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
	KadUtils.KadDOM.enableBtn("idBtn_userLogin_login", false);
}

function firebaseLogout() {
	signOut(auth)
		.then(() => {
			KadUtils.dbIDStyle("idDiv_navBar_User").display = "none";
			resetAll();
		})
		.catch((error) => {
			alert(`ERROR, could not log out:`, error);
		});
}

function userChange() {
	for (let key of Object.keys(AccData.infos)) {
		const id = `idVin_child_uInfoVin_${key}`;
		const vinUser = KadUtils.dbID(id).value.trim();
		if (vinUser != "") {
			AccData.infos[key].data = vinUser;
		}
	}
	if (nuncDiscipuli.short === null) {
		nuncDiscipuli.short = nuncDiscipuli.createShort();
	}
	KadUtils.dbID("idLbl_navBarLbl_User").textContent = nuncDiscipuli.short;
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
	KadUtils.dbIDStyle("idDiv_navBar_User").display = "initial";
	if (nuncDiscipuli.short == null) AccData.infos.shortName.data = nuncDiscipuli.createShort();
	KadUtils.dbID("idLbl_navBarLbl_User").textContent = nuncDiscipuli.short;
	KadUtils.KadDOM.enableBtn("idBtn_userLogin_login", true);
}

function userAccError(error) {
	KadUtils.KadDOM.enableBtn(idBtn_userLogin_login, true);
	KadUtils.KadDOM.enableBtn(idBtn_userLogin_register, true);
	console.log(error);
	KadUtils.dbID(idLbl_userLogin_alert).textContent = "E-Mail oder Passwort falsch!";
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
			console.log("Currently not supported data from saved userdata:", category);
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
	const parent = KadUtils.dbCL("cl_UserChange_infos");
	KadUtils.KadDOM.clearFirstChild(parent);
	const loggedIn = userLoggedIn();
	for (const [key, subObj] of Object.entries(AccData.infos)) {
		const uInfoParent = KadUtils.KadTable.createCell("Div", {
			names: ["uInfoParent", key],
			type: "Div",
			style: {
				whiteSpace: "nowrap",
			},
		});
		parent.appendChild(uInfoParent);

		const uInfoBtn = KadUtils.KadTable.createCell("Lbl", {
			names: ["uInfoLbl", key],
			type: "Lbl",
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

		const uInfoVin = KadUtils.KadTable.createCell("Vin", {
			names: ["uInfoVin", key],
			type: "Vin",
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
		const uInfoDel = KadUtils.KadTable.createCell("Btn", {
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
