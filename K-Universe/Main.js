const globalP5 = new p5((c) => {
  c.setup = function () {
    c.noCanvas();
  };
});

window.onload = mainSetup;

function initCssMediaSizes() {
  for (let key of Object.keys(globalValues.mediaSizes)) {
    globalValues.mediaSizes[key] = getCssRoot(key, true, true)
  }
}

function mainSetup() {
  if (globalValues.hostDebug) {
    dbCLStyle("cl_Loading").display = "none";
  }
  htmlAltTag();
  initCssMediaSizes();
  globalValues.colors.darkmodeOn = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  // socketStart();
  createNewNuncDiscipuli();
  firebase.initializeApp({
    apiKey: "AIzaSyDHgM7J-2Q_W1Swp0Ozx6nY1QDoFcwEFwQ",
    authDomain: "kad-universe.firebaseapp.com",
    databaseURL: "https://kad-universe.firebaseio.com",
    projectId: "kad-universe",
    storageBucket: "kad-universe.appspot.com",
    messagingSenderId: "874702902059",
    appId: "1:874702902059:web:cbe47b5a31e8f57d"
  });

  layoutCreateSubgrid(); // FIRST:  CREATE THE SUBGRIDS
  layoutCreateContentlayoutList(); // SECOND: create the LayoutLists
  layoutCreateNavbar(); // THIRD:  Create the Navbar
  layoutCreateFooter();

  contentLayout.prevNavContent = contentLayout.defaultPage
  layoutResizeGrid();
  layoutNavClick();

  //create Pikadays
  createIomlaidPikaday();
  layoutCreateNavbarPikaday();
  createKadarPikaday("A");
  createKadarPikaday("B");
  createCovidPikaday("A");
  createCovidPikaday("B");

  //check if Userstate changed!
  firebase.auth().onAuthStateChanged((user) => {
    if (user != null) {
      nuncDiscipuli.cred.email = user.email;
      nuncDiscipuli.cred.uid = user.uid;
    } else if (user === null) {
      nuncDiscipuli.cred.email = null;
      nuncDiscipuli.cred.uid = null;
    };
    toggleLayout();
    clearAllTiles();
    setTimeout(() => {
      layoutHideLoadingscreen();
    }, 1000);
  });
};

function resetAll() {
  createNewNuncDiscipuli();
  // socket.disconnect();
  // utilsSocketStart();
  displayColorSystem();
  clearGlobalValue();
  layoutNavClick(contentLayout.defaultPage);
};

function clearAllTiles() {
  for (const obj in contentGrid) {
    window[`clear_${obj}`]();
  };
}

function utilsSocketStart() {
  // socket.on('reconnect', () => {
  //   if (nuncDiscipuli.checkLogin) {
  //     utilsSocketPost("UserAcc", {
  //       updateType: "login",
  //       uid: nuncDiscipuli.cred.uid,
  //       email: nuncDiscipuli.cred.email || null
  //     });
  //   };
  // });
  // socket.on('UserAccReturn', userAccReturn); //get all Data/error and then restore all Canvases/Saves
  // socket.on('SaveDiscipuliReturn', saveDiscipuliReturn);
  // socket.on('LoadDiscipuliReturn', loadDiscipuliReturn);
  // socket.on('HowaReturn', howaReturn); //
  // socket.on('NewsReturn', newsReturn);
  // socket.on('SpeechTranslateReturn', speechTranslateReturn);
};

function redrawCanvases() {
  for (let obj in contentGrid) {
    contentGrid[obj].canvas();
  };
};

function htmlAltTag() { // needed to display local files in Firefox when the imgSrc is set inside css
  setAlt("trash");
  setAlt("oAdd");
  setAlt("oSub");

  function setAlt(name) {
    const t = dbCL(`img_${name}`, null)
    for (let e of t) {
      e.alt = `${name}.svg`
    }
  }
}

function timeoutCanvasFinished(canv, txt = {
  text1: "",
  text2: ""
}) {
  canv.noLoop();
  setTimeout(() => {
    canv.stroke(255, 0, 0);
    canv.strokeWeight(2);
    canv.textSize(32);
    canv.fill(0, 100, 60);
    canv.textAlign(canv.CENTER, canv.BOTTOM);
    canv.text(txt.text1, canv.width / 2, canv.height / 2);
    canv.textAlign(canv.CENTER, canv.TOP);
    canv.text(txt.text2, canv.width / 2, canv.height / 2);
  }, 200);
}

function clearGlobalValue() {
  globalValues.globalInput.value = "";
  dbID("idVin_globalValue").value = "";
}

function globalValueChanged(obj) {
  globalValues.globalInput.value = obj.value;
};

function utilsGetFavicon(url) {
  const size = globalValues.mediaSizes.imgSize;
  return `https://www.google.com/s2/favicons?domain=${url}&sz=${size}`
}

function layoutCreateNavbarPikaday() {
  new Pikaday({
    field: dbID('idBtn_navBar_KW'),
    numberOfMonths: 2,
    mainCalendar: 'left',
    showTime: false,
    i18n: i18nDE,
    onSelect: function (date) {
      let weekText = `KW ${getWeekNumber()}`;
      let weekDiff = Math.ceil(((date.getTime() - new Date().getTime()) / 86400000) / 7);
      if (weekDiff !== 0) {
        weekText += (weekDiff > 0) ? ` (+${weekDiff})` : ` (${weekDiff})`;
      };
      dbID('idBtn_navBar_KW').textContent = weekText;
    }
  });
};