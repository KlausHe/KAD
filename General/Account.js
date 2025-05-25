import { contentLayout, navClick } from "../General/Layout.js";
import { Data_HumanNames, Data_Nummernschild } from "../KadData/KadData.js";
import { Data_AkademischerGrad } from "../KadData/KadDataAkademischerGrad.js";
import { Data_RALColors } from "../KadData/KadDataColor.js";
import { KadDOM, KadLog, KadTable, dbCLStyle, dbID, dbIDStyle, initEL } from "../KadUtils/KadUtils.js";
import { resetAll } from "../Main.js";
import * as DBData from "../MainModulesDBData.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
//      LOCAL:  	browserLocalPersistence
//      SESSION:  	browserSessionPersistence
//      NONE: 	inMemoryPersistence
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
    return DBData[objName].getData();
  },
  saveData(obj, data) {
    const objName = `storage_cl_${obj}`;
    if (!DBData[objName]) return;
    DBData[objName].saveData(data);
    DBData[objName].activateData();
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
        return Data_Nummernschild.map((item) => item[1]);
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
  nuncDiscipuli.logging = false;
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
  getData() {
    let data = {};
    for (const [key, value] of Object.entries(AccData.infos)) {
      data[key] = value.data;
    }
    return data;
  },
  saveData(data) {
    AccData.data = true;
    for (const [key, value] of Object.entries(data)) {
      AccData.infos[key].data = value;
    }
  },
  activateData() {
    return;
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

initEL({ id: idVin_userLogin_email, resetValue: "E-Mail" });
initEL({ id: idVin_userLogin_pass, resetValue: "Passwort" });

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
  nuncDiscipuli.cred.keepLogin = dbID("idCb_userLogin_check").checked ? browserLocalPersistence : browserSessionPersistence;
}

onAuthStateChanged(auth, (user) => {
  const state = user != null;
  nuncDiscipuli.cred.email = state ? user.email : null;
  nuncDiscipuli.cred.uid = state ? user.uid : null;
  dbIDStyle(idDiv_navBar_AccountLogin).display = state ? "none" : "block";
  dbIDStyle(idDiv_navBar_AccountChange).display = state ? "block" : "none";
  dbID(idLbl_userChange_user).textContent = state ? nuncDiscipuli.cred.email : "User";
  if (state && !nuncDiscipuli.registering) {
    nuncDiscipuli.logging = true;
    loadDiscipuli(null);
  }

  let btnList = [...dbCLStyle("DLParent", null), ...dbCLStyle("ULParent", null)];
  for (const btn of btnList) {
    btn.display = state ? "initial" : "none";
  }
});

export function userLoggedIn() {
  return auth.currentUser !== null;
}

function firebaseLogin() {
  nuncDiscipuli.logging = true;
  KadLog.log("log in");
  const email = idVin_userLogin_email.KadGet();
  const pass = idVin_userLogin_pass.KadGet();
  setPersistence(auth, nuncDiscipuli.cred.keepLogin);
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
  const email = idVin_userLogin_email.KadGet();
  const pass = idVin_userLogin_pass.KadGet();
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
    const vinUser = id.KadGet();
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
  1;
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
  let categories = [];
  if (category !== null) {
    categories = [category];
  } else {
    for (const dbDataObj of Object.values(DBData)) {
      categories.push(dbDataObj.dbName);
    }
  }
  await loadFromDatabase(categories);
  userAccSetUserBtn();
  if (nuncDiscipuli.logging) {
    nuncDiscipuli.logging = false;
    navClick("User");
  }
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
function accountClearInfo(index) {
  const key = Object.keys(AccData.infos)[index];
  AccData.infos[key].data = null;
  let uInfoVin = dbID(`idInput_uInfoData_${index}`);
  uInfoVin.value = "";
  uInfoVin.placeholder = "...";
}

function createUserInfos() {
  const body = [
    //
    { data: Object.values(AccData.infos).map((item) => item.description), settings: { class: "cl_info", noBorder: "bottom", uiRadius: "left" } },
    {
      type: "Input",
      data: Object.entries(AccData.infos).map(([key, value]) => {
        if (!userLoggedIn()) return value.description;
        if (AccData.infos[key].data) return AccData.infos[key].data;
        return "...";
      }),
      settings: { names: ["uInfoData"], dList: Object.values(AccData.infos).map((item) => item.suggestions), noBorder: "bottom", uiRadius: "none" },
    },
    { type: "ButtonImage", data: "trash", settings: { onclick: accountClearInfo, noBorder: "bottom", uiRadius: "right", uiSize: "width1" } },
  ];

  KadTable.createHTMLGrid({ id: idTab_userChangeTable, body });
}
