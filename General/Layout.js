import { dbCL, dbCLStyle, dbID, dbIDStyle, getFavicon, hostDebug, KadArray, KadCSS, KadDOM, KadLog, KadTable } from "../KadUtils/KadUtils.js";
import { updateMasterSelect } from "../Main.js";
import * as Clear from "../MainModulesClear.js";
import * as DBData from "../MainModulesDBData.js";
import { globalValues } from "../Settings/General.js";
import { userGridCreateCells } from "../Settings/UsergridLayout.js";
import { loadDiscipuli, nuncDiscipuli, saveDiscipuli, userLoggedIn } from "./Account.js";
import { bgaOptions } from "./BackgroundAnimation.js";
import { contentFooter, contentGroups, contentGroupsNav, rawContentGrid } from "./MainContent.js";

export let contentGrid = {};
export const contentLayout = {
  defaultPage: hostDebug() ? "cl_UserGridLayout" : "Universe",
  AccountSettings: ["cl_UserLogin", "cl_UserChange"],
  prevNavContent: null,
  prevNavFullscreen: null,
  settingsNames: ["Account-Settings", "Global-Settings"],
  origUniverse: [],
  navContent: {},
  namelistContent: {},
  get GlobalSettings() {
    if (!userLoggedIn() && !hostDebug()) return ["cl_GeneralSettings", "cl_ColorSettings"];
    return Object.keys(contentGrid).filter((key) => {
      return contentGrid[key].contentGroup == "Global-Settings";
    });
  },
  get getUniverse() {
    const list = Object.keys(contentGrid).filter((key) => {
      const settings = contentLayout.settingsNames.includes(contentGrid[key].contentGroup);
      return !settings;
    });
    return list;
  },
  createContentData() {
    let arr = Array.from(Object.entries(rawContentGrid)).filter((key) => contentCheckActive(key[1]));
    arr.sort((a, b) => {
      return b[1].name < a[1].name ? 1 : -1;
    });
    let sorted = [];
    for (let group of contentGroups) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][1].contentGroup == group) sorted.push(arr[i]);
      }
    }
    contentGrid = Object.fromEntries(sorted);
  },
};

export function contentCheckActive(contentObj) {
  if (hostDebug()) return true;
  if (contentObj.hasOwnProperty("deactivated") && contentObj.deactivated) return false;
  return true;
}

export function layoutCheckCORSandDisableModule(error, moduleName) {
  if (KadLog.errorChecked(error, `Could not receive data for ${moduleName}!\n\nDeactivating the module!\n\n`, error)) {
    contentGrid[`cl_${moduleName}`].deactivated = true;
    contentLayout.createContentData();
    createContentlayoutList();
    updateMasterSelect();
    return true;
  }
  return false;
}

export function createContentlayoutList() {
  contentLayout.navContent = { Universe: [], User: [] };
  contentLayout.navContent.Universe = contentLayout.getUniverse;
  contentLayout.origUniverse = [...contentLayout.navContent.Universe];
  contentLayout.namelistContent = {};
  for (const objKey of contentLayout.navContent.Universe) {
    const group = contentGrid[objKey].contentGroup;
    if (contentLayout.navContent[group] === undefined) {
      contentLayout.navContent[group] = [objKey];
    } else {
      contentLayout.navContent[group].push(objKey);
    }
  }
  for (const [key, val] of Object.entries(contentLayout.navContent)) {
    contentLayout.namelistContent[key];
    if (key != "Universe" && key != "User") {
      contentLayout.navContent[key] = val.sort();
      contentLayout.namelistContent[key] = val.map((val) => [val.replace("cl_", ""), val]).sort();
    }
  }
}

window.addEventListener("resize", resizeGrid);

export function resizeGrid() {
  const winWidth = window.innerWidth;
  const minWidth = globalValues.mediaSizes.divGridMinWidth;
  const calcX = Math.max(1, Math.floor(winWidth / minWidth)); // minimum 2 Cols
  if (KadCSS.getRoot({ value: "gridRowLength" }) != calcX) {
    KadCSS.setRoot({ variable: "gridRowLength", value: calcX });
    navClick(contentLayout.prevNavContent);
  }
  let navNames = dbCL("cl_navNames", null);
  const sp = dbID("idDiv_navBar_Universe").offsetLeft;
  const diff1 = sp <= 0;
  navNames.forEach((obj) => {
    obj.style.display = diff1 ? "none" : "initial";
  });
  const diff2 = sp <= 0;
  if (diff2 && !diff1) {
    navNames.forEach((obj) => {
      obj.style.display = diff2 ? "none" : "initial";
    });
  }
  userGridCreateCells();
}

export function navClick(layoutName = contentLayout.defaultPage) {
  if ([...Object.keys(contentLayout.navContent)].includes(layoutName)) {
    if (layoutName === "Universe") {
      contentLayout.navContent[layoutName] = [...contentLayout.origUniverse];
    } else if (layoutName === "User") {
      contentLayout.navContent[layoutName] = [...DBData.storage_cl_UserGridLayout.data];
    } else {
      contentLayout.navContent[layoutName] = contentLayout.navContent[layoutName].sort();
    }
  }
  contentLayout.prevNavContent = layoutName || contentLayout.defaultPage;
  navTitle();
  const { contentList, grid2DArray } = createGridLayout(contentLayout.prevNavContent);
  createAreaString({ grid2DArray });

  for (let objKey in contentGrid) {
    const state = contentList.includes(objKey);
    dbCLStyle(objKey).display = state ? "initial" : "none";
    dbCL(objKey).pointerEvents = state ? "auto" : "none";
  }

  for (const obj of [...Object.keys(contentLayout.navContent)]) {
    if (obj == contentLayout.prevNavContent) {
      dbID(`idDiv_navBar_${obj}`).classList.add("navbarActive");
    } else {
      dbID(`idDiv_navBar_${obj}`).classList.remove("navbarActive");
    }
  }

  // for (let objKey in contentGrid) {
  // 	dbCL(objKey).classList.toggle("sectionVisible", contentList.includes(objKey));
  // }

  // for (const obj of [...Object.keys(contentLayout.navContent)]) {
  // 	dbID(`idDiv_navBar_${obj}`).classList.toggle("navbarActive", obj == contentLayout.prevNavContent);
  // }
  setTimeout(() => {
    KadDOM.scrollToTop();
  }, 100);
}

function navTitle() {
  let titleText = contentLayout.prevNavContent;
  if (contentLayout.prevNavContent == "User") {
    titleText = nuncDiscipuli.short;
  } else if (contentLayout.prevNavContent == "GlobalSettings") {
    titleText = "Settings";
  } else if (contentLayout.prevNavContent == "Clear") {
    titleText = bgaOptions.animations[bgaOptions.curr].constructor.name;
  } else if (contentLayout.prevNavContent.includes("cl_")) {
    titleText = contentGrid[contentLayout.prevNavContent].name;
  }
  document.title = `KAD-${titleText}`;
}

export function createGridLayout(layoutName = contentLayout.defaultPage, list = null) {
  let contentList = list != null ? list : layoutContentList(layoutName);

  if (KadLog.errorChecked(contentList == [], "No Grid for gridTemplateAreas provided")) return;
  // fill list with data
  const columns = contentList.length == 1 ? 1 : KadCSS.getRoot({ value: "gridRowLength" }) + 1;
  if (columns === 1) {
    let grid2DArray = [];
    for (const name of contentList) {
      grid2DArray.push([name]);
    }
    return { contentList, grid2DArray };
  }

  let rows = 1;
  for (const name of contentList) {
    if (!KadLog.logChecked(!contentGrid[name].hasOwnProperty("size"), "no size:[] defined at", name)) {
      rows += contentGrid[name].size[1];
    }
  }
  let gridData = [];
  let grid2DArray = KadArray.createArray({ x: rows, y: columns, fillNumber: false });
  for (const name of contentList) {
    let contWidth = contentGrid[name].size[0];
    let contHeight = contentGrid[name].size[1];
    if (KadLog.logChecked(!contentGrid[name].hasOwnProperty("size"), "no size:[] defined at", name)) {
      contWidth = 1;
      contHeight = 1;
    }
    if (contWidth > columns) contWidth = columns;

    tryPlacing: for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns - contWidth + 1; column++) {
        if (grid2DArray[row][column] != false) continue;

        let placeable = true;
        tryNextSpot: for (let height = 0; height < contHeight; height++) {
          for (let width = 0; width < contWidth; width++) {
            if (grid2DArray[row + height][column + width] != false) {
              placeable = false;
              break tryNextSpot;
            }
          }
        }
        if (!placeable) continue;
        gridData.push({ name, row, contHeight, column, contWidth });
        for (let height = 0; height < contHeight; height++) {
          for (let width = 0; width < contWidth; width++) {
            grid2DArray[row + height][column + width] = name;
          }
        }
        break tryPlacing;
      }
    }
  }

  for (let i = grid2DArray.length - 1; i > 0; i--) {
    if (grid2DArray[i].every((item) => item === false)) grid2DArray.pop();
    else break;
  }

  // fill empty spaces
  for (let item of gridData) {
    let whileCounter = 0;
    // check bottom
    let expandBottom = true;
    while (expandBottom) {
      tryBottom: for (let width = 0; width < item.contWidth; width++) {
        if (grid2DArray[item.row + item.contHeight + whileCounter] === undefined || grid2DArray[item.row + item.contHeight + whileCounter][item.column + width] != false) {
          expandBottom = false;
          break tryBottom;
        }
      }
      if (expandBottom) {
        for (let width = 0; width < item.contWidth; width++) {
          grid2DArray[item.row + item.contHeight + whileCounter][item.column + width] = item.name;
        }
        whileCounter++;
      }
    }
    item.contHeight += whileCounter;

    // check right
    whileCounter = 0;
    let expandRight = true;
    while (expandRight) {
      tryRight: for (let height = 0; height < item.contHeight; height++) {
        if (grid2DArray[item.row + height][item.column + item.contWidth + whileCounter] != false) {
          expandRight = false;
          break tryRight;
        }
      }
      if (expandRight) {
        for (let height = 0; height < item.contHeight; height++) {
          grid2DArray[item.row + height][item.column + item.contWidth + whileCounter] = item.name;
        }
        whileCounter++;
      }
    }
    item.contWidth += whileCounter;
  }
  return { contentList, grid2DArray, gridData };
}

function layoutContentList(layoutName) {
  if (layoutName === "Clear") return []; // used in backgroundAnimations to clear all Tiles
  if (layoutName.includes("cl_")) return [layoutName]; // fullscreen-subgrid
  if (layoutName === "GlobalSettings") return contentLayout.GlobalSettings;
  if (layoutName === "AccountSettings") return contentLayout.AccountSettings;
  if (userLoggedIn()) return [...contentLayout.navContent[layoutName]];
  return [...contentLayout.navContent[layoutName]].filter((content) => {
    return hostDebug() ? true : contentGrid[content].logReqUser == undefined || contentGrid[content].logReqUser == false;
  });
}

function createAreaString({ grid2DArray } = {}) {
  if (grid2DArray.length == 0) {
    dbIDStyle("id_contentGrid").gridTemplateAreas = "";
    KadLog.error("No Grid for gridTemplateAreas provided");
    return;
  }

  let gridString = "";
  for (let row of grid2DArray) {
    const rowCleaned = row.map((item) => (item == false ? " . " : item));
    gridString += `" ${rowCleaned.join(" ")} "`;
  }
  dbIDStyle("id_contentGrid").gridTemplateAreas = gridString;
}

export function createSubgrid() {
  const databaseList = Object.values(DBData).map((obj) => obj.contentName);
  for (const gridKey in contentGrid) {
    const parentGrid = dbCL(gridKey);
    const contentObj = contentGrid[gridKey];
    const displayName = contentObj.name;

    parentGrid.style.gridArea = gridKey;

    const childDivArea = parentGrid.children[0].style;

    childDivArea.gridTemplateRows = "";
    let rows = [];
    if (contentObj.maingrid.rows.length == 0) {
      rows = ["auto"];
    } else {
      rows = contentObj.maingrid.rows;
    }
    for (let row of rows) {
      if (row == 0) {
        childDivArea.gridTemplateRows += "auto ";
      } else {
        childDivArea.gridTemplateRows += `var(--UIHeight${row})`;
      }
    }
    childDivArea.gridTemplateRows += "auto";

    const arr = KadArray.createArray({ x: contentObj.maingrid.areas[0].length, fillNumber: "auto" }).join(" ");
    childDivArea.gridTemplateColumns = `${arr}`;
    childDivArea.gridTemplateAreas = "";
    for (const main of contentObj.maingrid.areas) {
      childDivArea.gridTemplateAreas += `". ${main.join(" ")} ." `;
    }

    for (const sub of contentObj.subgrid) {
      dbCLStyle(sub[0]).gridArea = sub[0];
      if (sub[1]) dbCLStyle(sub[0]).justifySelf = sub[1];
      if (sub[2]) dbCLStyle(sub[0]).alignSelf = sub[2];
    }

    // CERATE Title-bar
    const parent = document.createElement("DIV");
    parent.classList.add("cl_gridTitle"); //design sits inside this class!!!
    parent.id = `idDiv_gridTitle_${gridKey}`;
    parentGrid.insertBefore(parent, parentGrid.firstChild);

    // nav-Icon
    let contGroup = contentObj.contentGroup;

    const dropIconParent = KadTable.createCell({
      type: "Div",
      names: ["navIcon", gridKey],
      createClass: ["cl_DropdownParent"],
      onclick: () => {
        navClick(contGroup);
      },
    });
    parent.appendChild(dropIconParent);
    const dropIconImg = KadTable.createCell({ type: "Img", names: ["navIcon", gridKey], subGroup: "gridtitle", img: `nav${contGroup}` });
    dropIconParent.appendChild(dropIconImg);
    const dropIconText = KadTable.createCell({ type: "Lbl", names: ["titleIcon", gridKey], text: `Gehe zu Kathegorie ${contGroup}.`, createClass: ["clDropdown", "cl_DropdownInfo"] });
    dropIconParent.appendChild(dropIconText);

    //name --> TITLE
    const titleDiv = KadTable.createCell({ type: "Div", names: ["titleName", gridKey], createClass: ["cl_DropdownParent"] });
    parent.appendChild(titleDiv);
    const titleText = KadTable.createCell({ type: "H1", names: ["titleName", displayName], text: displayName });
    titleDiv.appendChild(titleText);

    // NameHeritage --> DROPDOWN
    if (contentObj.hasOwnProperty("heritage")) {
      const heritage = contentObj.heritage;
      if (heritage.length > 0) {
        const dropNameText = KadTable.createCell({ type: "Lbl", names: ["titleDropName", gridKey], text: `\"${displayName}\" ist ${heritage[0]} und bedeutet \"${heritage[1]}\"`, createClass: ["clDropdown", "clDropdownName"] });
        titleDiv.appendChild(dropNameText);
      }
    }

    // info --> DROPDOWN
    if (contentObj.hasOwnProperty("info")) {
      const dropInfoParent = KadTable.createCell({ type: "Div", names: ["titleInfo", gridKey], createClass: ["cl_DropdownParent"] });
      parent.appendChild(dropInfoParent);
      const dropInfoImg = KadTable.createCell({ type: "Img", names: ["titleInfo", gridKey], subGroup: "gridtitle", img: "cInfo" });
      dropInfoParent.appendChild(dropInfoImg);
      const dropInfoText = KadTable.createCell({ type: "Lbl", names: ["titleInfo", gridKey], text: contentObj.info, createClass: ["clDropdown", "cl_DropdownInfo"] });
      dropInfoParent.appendChild(dropInfoText);
    }

    // source --> OPEN NEW WINDOW
    if (contentObj.hasOwnProperty("source")) {
      for (const [key, value] of Object.entries(contentObj.source)) {
        const dropSourceParent = KadTable.createCell({ type: "Div", names: ["titleSource", gridKey, key], createClass: ["cl_DropdownParent"] });
        parent.appendChild(dropSourceParent);
        const dropSourceImg = KadTable.createCell({
          type: "Img",
          names: ["titleSource", key],
          subGroup: "url",
          img: getFavicon(value, globalValues.mediaSizes.imgSize),
          onclick: () => {
            window.open(value);
          },
        });
        dropSourceParent.appendChild(dropSourceImg);
        const dropSourceText = KadTable.createCell({
          type: "Lbl",
          names: ["titleSource", "text", gridKey],
          text: `${key} von:<br>${value}<br>(Opens in a new Tab)`,
          createClass: ["clDropdown", "cl_DropdownInfo"],
          onclick: () => {
            window.open(value);
          },
        });
        dropSourceParent.appendChild(dropSourceText);
      }
    }
    //DEBUG-LABEL
    const dropSpaceParent = KadTable.createCell({
      type: "Div",
      names: ["titleSpace", gridKey],
      style: {
        flex: 1,
      },
    });
    parent.appendChild(dropSpaceParent);

    if (databaseList.includes(gridKey)) {
      //UPLOAD
      const titleUploadParent = KadTable.createCell({
        type: "Div",
        names: ["gridtitle", "dbUL", gridKey],
        createClass: ["ULParent"],
        style: {
          display: "none",
        },
      });
      parent.appendChild(titleUploadParent);
      const titleUploadBtn = KadTable.createCell({
        type: "Btn",
        names: ["gridtitle", "dbUL", gridKey],
        subGroup: "gridtitle",
        img: "upload",
        ui: {
          uiSize: "width1",
          uiType: "transparent",
        },
        onclick: () => {
          saveDiscipuli(gridKey.slice(3)); // remove "cl_"
        },
      });
      titleUploadParent.appendChild(titleUploadBtn);

      //DOWNLOAD
      const titleDownloadParent = KadTable.createCell({
        type: "Div",
        names: ["gridtitle", "dbDL", gridKey],
        createClass: ["DLParent"],
        style: {
          display: "none",
        },
      });
      parent.appendChild(titleDownloadParent);

      const titleDownloadBtn = KadTable.createCell({
        type: "Btn",
        names: ["gridtitle", "dbDL", gridKey],
        subGroup: "gridtitle",
        img: "download",
        ui: {
          uiSize: "width1",
          uiType: "transparent",
        },
        onclick: () => {
          loadDiscipuli(gridKey.slice(3)); // remove "cl_"
        },
      });
      titleDownloadParent.appendChild(titleDownloadBtn);
    }

    //fullscreen this subgrid
    const titleFullParent = KadTable.createCell({ type: "Div", names: ["gridtitle", "full", gridKey] });
    parent.appendChild(titleFullParent);
    const titleFullBtn = KadTable.createCell({
      type: "Btn",
      names: ["gridtitle", "full", gridKey],
      subGroup: "gridtitle",
      img: "fullscreen",
      ui: {
        uiSize: "width1",
        uiType: "transparent",
      },
      onclick: () => {
        toggelFullscreen(gridKey);
      },
    });
    titleFullParent.appendChild(titleFullBtn);

    //clear --> refresh
    const titleTrashParent = KadTable.createCell({ type: "Div", names: ["gridtitle", "trash", gridKey] });
    parent.appendChild(titleTrashParent);
    const titleTrashBtn = KadTable.createCell({
      type: "Btn",
      names: ["gridtitle", "trash", gridKey],
      subGroup: "gridtitle",
      img: "trash",
      ui: {
        uiSize: "width1",
        uiType: "transparent",
      },
      onclick: () => {
        Clear[`clear_${gridKey}`]();
      },
    });
    titleTrashParent.appendChild(titleTrashBtn);
  }
}

export function toggelFullscreen(gridKey) {
  if (contentLayout.prevNavContent == gridKey) {
    navClick(contentLayout.prevNavFullscreen);
  } else {
    contentLayout.prevNavFullscreen = contentLayout.prevNavContent;
    navClick(gridKey);
  }
}

export function createNavbar() {
  let parent = dbID("idNav_navElements");
  let navElements = dbCL("cl_navElements", null);
  while (navElements.length > 0) {
    navElements[0].parentNode.removeChild(navElements[0]);
  }
  let contentLength = 0;
  for (let i = contentGroupsNav.length - 1; i >= 0; i--) {
    contentLength++;
    const obj = contentGroupsNav[i];
    const navParentDiv = KadTable.createCell({
      type: "Div",
      names: ["navBar", obj],
      createClass: ["cl_navElements"],
      idNoChild: true,
      style: {
        whiteSpace: "nowrap",
      },
      onclick: () => navClick(obj),
    });
    const navParentImg = KadTable.createCell({ type: "Img", names: ["navBarIcon", "parent", obj], subGroup: "navbar", img: `nav${obj}` });
    navParentDiv.appendChild(navParentImg);
    const navParentLbl = KadTable.createCell({ type: "Lbl", names: ["navBarLbl", obj], createClass: ["cl_navNames"], idNoChild: true, text: obj });
    navParentDiv.appendChild(navParentLbl);
    parent.insertBefore(navParentDiv, parent.children[0]);
  }
  dbID("idDiv_navBar_Universe").classList.add("navbarActive");
  dbIDStyle("idDiv_navBar_User").display = "none";
  dbID("idLbl_navBarLbl_User").textContent = nuncDiscipuli.short || "User";
}

export function createFooter() {
  let parent = dbID("idDiv_footerCredits");
  while (parent.length > 0) {
    parent.removeChild(parent.firstChild);
  }
  contentFooter.forEach((arr, index) => {
    const name = arr[0];
    const url = arr[1];
    const dropSourceParent = KadTable.createCell({ type: "Div", names: ["footerSource", index], createClass: ["cl_DropdownParent", "clFooterCredits"] });
    parent.appendChild(dropSourceParent);

    const dropSourceImg = KadTable.createCell({
      type: "Img",
      names: ["footerSource", index],
      subGroup: "url",
      img: getFavicon(url, globalValues.mediaSizes.imgSize),
      onclick: () => {
        window.open(url);
      },
    });
    dropSourceParent.appendChild(dropSourceImg);
    const dropSourceText = KadTable.createCell({
      type: "Lbl",
      names: ["footerSource", index],
      text: `${name} von:<br>${url}<br>(Opens in a new Tab)`,
      createClass: ["clDropup", "cl_DropdownInfo"],
      onclick: () => {
        window.open(url);
      },
    });
    dropSourceParent.appendChild(dropSourceText);
  });
}
