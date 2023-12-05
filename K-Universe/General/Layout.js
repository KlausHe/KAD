import * as KadUtils from "./KadUtils.js";
import * as Clear from "../MainModulesClear.js";
import { globalValues } from "../Settings/Basics.js";
import { contentGroupSort, rawContentGrid, contentFooter } from "./MainContent.js";
import { nuncDiscipuli, loadDiscipuli, saveDiscipuli, userLoggedIn } from "./Account.js";
import { bgaOptions } from "./BackgroundAnimation.js";
import * as DBData from "../MainModulesDBData.js";
// import * as Pikaday from "../Data/pikadayClock.js";

export let contentGrid = {};
export const contentLayout = {
	createContentGrid() {
		let arr = Array.from(Object.entries(rawContentGrid));
		contentGrid = Object.fromEntries(
			arr.filter((obj) => {
				return obj[1].active == undefined || obj[1].active == true;
			})
		);
	},
	navContent: {
		Universe: [],
		User: [],
	},
	origUniverse: [],
	get GlobalSettings() {
		if (!userLoggedIn()) return ["cl_GeneralSettings", "cl_ColorSettings"];
		return Object.keys(contentGrid).filter((key) => {
			return contentGrid[key].contentGroup == "Global-Settings";
		});
	},
	get getUniverse() {
		return Object.keys(contentGrid).filter((key) => {
			return contentGrid[key].contentGroup != "Account-Settings" && contentGrid[key].contentGroup != "Global-Settings";
		});
	},
	get nameList() {
		let list = [];
		Object.values(contentGrid).forEach((obj) => {
			if (obj.contentGroup == "Account-Settings" || obj.contentGroup == "Global-Settings") return;
			if (obj.hasOwnProperty("active") && obj.active == false) return;
			list.push(obj.name);
		});
		return list;
	},
	AccountSettings: ["cl_UserLogin", "cl_UserChange"],
	contentList: [],
	contentLength: 0,
	prevNavContent: null,
	prevNavFullscreen: null,
	defaultPage: KadUtils.hostDebug() ? "Benkyou" : "Universe",
};

export function createContentlayoutList() {
	contentLayout.navContent.Universe = contentLayout.getUniverse;
	contentLayout.origUniverse = [...contentLayout.navContent.Universe];
	for (const objKey of contentLayout.navContent.Universe) {
		const group = contentGrid[objKey].contentGroup;
		if (contentLayout.navContent[group] === undefined) {
			contentLayout.navContent[group] = [objKey];
		} else {
			contentLayout.navContent[group].push(objKey);
		}
	}
	for (const [key, val] of Object.entries(contentLayout.navContent)) {
		if (key != "Universe" && key != "User") {
			contentLayout.navContent[key] = val.sort();
		}
	}
}

window.addEventListener("resize", resizeGrid);

export function resizeGrid() {
	const winWidth = window.innerWidth;
	const minWidth = globalValues.mediaSizes.divGridMinWidth;
	const x = Math.max(1, Math.floor(winWidth / minWidth)); // minimum 2 Cols, floored division
	// const gap = KadUtils.KadCSS.getRoot("gridGap", true);
	// const margin = globalValues.mediaSizes.margin;
	// const tryWidth = minWidth * x + (x - 1) * gap + margin * 2;
	// const calcX = tryWidth < winWidth + gap + margin * 2 ? x : x;
	const calcX = x; //tryWidth < winWidth + gap + margin * 2 ? x : x;
	if (KadUtils.KadCSS.getRoot("gridRowLength", true) != calcX) {
		KadUtils.KadCSS.setRoot("gridRowLength", calcX);
		navClick(contentLayout.prevNavContent);
	}
	let navNames = KadUtils.dbCL("cl_navNames", null);
	const sp = KadUtils.dbID("idDiv_navBar_Universe");
	const diff1 = sp.offsetLeft <= 0;
	[...navNames].forEach((obj) => {
		obj.style.display = diff1 ? "none" : "initial";
	});
	const diff2 = sp.offsetLeft <= 0;
	if (diff2 && !diff1) {
		navNames.forEach((obj) => {
			obj.style.display = diff2 ? "none" : "initial";
		});
	}
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
	createGridLayout(contentLayout.prevNavContent);

	for (let objKey in contentGrid) {
		const state = contentLayout.contentList.includes(objKey);
		KadUtils.dbCLStyle(objKey).display = state ? "initial" : "none";
		KadUtils.dbCL(objKey).pointerEvents = state ? "auto" : "none";
	}

	for (const obj of [...Object.keys(contentLayout.navContent)]) {
		if (obj == contentLayout.prevNavContent) {
			KadUtils.dbID(`idDiv_navBar_${obj}`).classList.add("navbarActive");
		} else {
			KadUtils.dbID(`idDiv_navBar_${obj}`).classList.remove("navbarActive");
		}
	}
	const scrollOptions = {
		top: 0,
		behavior: "smooth",
	};
	document.body.scrollTo(scrollOptions); // For Safari
	document.documentElement.scrollTo(scrollOptions); // For Safari
}

function navTitle() {
	let titleText = contentLayout.prevNavContent;
	if (contentLayout.prevNavContent == "User") {
		titleText = nuncDiscipuli.short;
	} else if (contentLayout.prevNavContent == "GlobalSettings") {
		titleText = "Settings";
		// } else if (["AccountSettingsA", "AccountSettingsB"].includes(contentLayout.prevNavContent)) {
		// 	titleText = "UserData";
	} else if (contentLayout.prevNavContent == "Clear") {
		titleText = bgaOptions.animations[bgaOptions.curr].constructor.name;
	} else if (contentLayout.prevNavContent.includes("cl_")) {
		titleText = contentGrid[contentLayout.prevNavContent].name;
	}
	document.title = `KAD-${titleText}`;
}

function createGridLayout(layoutName) {
	contentLayout.contentList = createContentList(layoutName);
	if (contentLayout.contentList == []) {
		createAreaString([], 0);
		return;
	}
	// fill list with data
	const rowLength = contentLayout.contentList.length == 1 ? 1 : KadUtils.KadCSS.getRoot("gridRowLength", true);
	let gridArray = [];
	if (rowLength === 1) {
		for (const name of contentLayout.contentList) {
			gridArray.push(name);
		}
		createAreaString(gridArray, rowLength);
		return;
	}
	for (const name of contentLayout.contentList) {
		let contWidth = contentGrid[name].hasOwnProperty("width") ? contentGrid[name].width : 1;
		if (contWidth > rowLength) contWidth = rowLength;
		let contHeight = contentGrid[name].hasOwnProperty("height") ? contentGrid[name].height : 1;
		let notPlaced = true;
		let indexRow = 0;

		while (notPlaced) {
			for (let r = 0; r < rowLength; r++) {
				const indexR = indexRow * rowLength + r;
				notPlaced = false;
				//if the first spot is not free and if the row can't contain the contWidth --> do nothing!
				if (gridArray[indexR] !== undefined || Math.floor((indexR + contWidth - 1) / rowLength) != indexRow) {
					notPlaced = true;
				} else {
					// if this place and all to the right are free(second loop) - and inside that loop,
					for (let x = 0; x < contWidth; x++) {
						for (let y = 0; y < contHeight; y++) {
							const index = indexR + x + y * rowLength;
							if (gridArray[index] !== undefined) {
								notPlaced = true;
							}
						}
					}
					if (!notPlaced) {
						// if  true, push to Array at these places!
						for (let x = 0; x < contWidth; x++) {
							for (let y = 0; y < contHeight; y++) {
								const index = indexR + x + y * rowLength;
								gridArray[index] = name; //--> not the name, the Index in the contentGrid!!!
							}
						}
						notPlaced = false;
						break;
					} //end Insertion
				} //end ELSE "first spot is not taken"

				if (!notPlaced) break;
			} // end main FOR (r)
			indexRow++;
			//safety
			if (indexRow > 100) {
				console.error("unable to find spot!");
				break;
			}
		} // end WHILE
	} // end Grid-Element
	createAreaString(gridArray, rowLength);
}

function createContentList(layoutName) {
	if (layoutName === "Clear") {
		// used in backgroundAnimations to clear all Tiles
		return [];
	}
	if (layoutName.includes("cl_")) {
		// fullscreen-subgrid
		return [layoutName];
	}
	if (layoutName === "GlobalSettings") {
		return contentLayout.GlobalSettings;
	}
	if (layoutName === "AccountSettings") {
		return contentLayout.AccountSettings;
	}
	if (userLoggedIn()) {
		return [...contentLayout.navContent[layoutName]];
	}
	const hostDeb = KadUtils.hostDebug();
	return [...contentLayout.navContent[layoutName]].filter((content) => {
		return hostDeb ? true : contentGrid[content].logReqUser == undefined;
	});
}

function createAreaString(gridArray, rowLength) {
	if (gridArray == []) {
		KadUtils.dbIDStyle("id_contentGrid").gridTemplateAreas = "";
		return;
	}

	const gridEnd = gridArray.length % rowLength;
	const addedLength = gridEnd == 0 ? 0 : rowLength - gridEnd;
	const iteratinoLength = gridArray.length + addedLength;

	// turn grid array to String
	let gridString = "";
	for (let i = 0; i < iteratinoLength; i++) {
		if (i % rowLength === 0) {
			gridString += '" "';
		}
		gridString += gridArray[i] === undefined ? ". " : `${gridArray[i]} `;
	}
	gridString += '"';
	gridString = gridString.slice(2); // remove fist '" ' from the string
	KadUtils.dbIDStyle("id_contentGrid").gridTemplateAreas = gridString;
}

export function createSubgrid() {
	const dbList = [];
	for (const dbDataObj of Object.values(DBData)) {
		// dbList.push(dbDataObj.dbName);
		dbList.push(dbDataObj.contentName);
	}
	for (const gridKey in contentGrid) {
		KadUtils.dbCL(gridKey).classList.add("cl_contentSubGrid");
		KadUtils.dbCLStyle(gridKey).gridArea = gridKey;
		const contentObj = contentGrid[gridKey];
		const displayName = contentObj.name;

		for (const content of contentObj.subgrid) {
			KadUtils.dbCLStyle(content[0]).gridArea = content[0];
			if (content[1]) KadUtils.dbCLStyle(content[0]).justifySelf = content[1];
			if (content[2]) KadUtils.dbCLStyle(content[0]).alignSelf = content[2];
		}

		// CERATE Title-bar
		const parentGrid = KadUtils.dbCL(gridKey);
		const parent = document.createElement("DIV");
		parent.classList.add("cl_gridTitle"); //design sits inside this class!!!
		parent.id = `idDiv_gridTitle_${gridKey}`;
		parentGrid.insertBefore(parent, parentGrid.firstChild);

		// nav-Icon
		let contGroup = contentObj.contentGroup;

		const dropIconParent = KadUtils.KadTable.createCell("Div", {
			names: ["navIcon", gridKey],
			type: "Div",
			createClass: ["cl_DropdownParent"],
			onclick: () => {
				navClick(contGroup);
			},
		});
		parent.appendChild(dropIconParent);
		const dropIconImg = KadUtils.KadTable.createCell("Img", {
			names: ["navIcon", gridKey],
			subGroup: "gridtitle",
			img: `nav${contGroup}`,
		});
		dropIconParent.appendChild(dropIconImg);
		const dropIconText = KadUtils.KadTable.createCell("Lbl", {
			names: ["titleIcon", gridKey],
			type: "Lbl",
			text: `Gehe zu Kathegorie ${contGroup}.`,
			createClass: ["clDropdown", "cl_DropdownInfo"],
		});
		dropIconParent.appendChild(dropIconText);

		//name --> TITLE
		const titleDiv = KadUtils.KadTable.createCell("Div", {
			names: ["titleName", gridKey],
			type: "Div",
			createClass: ["cl_DropdownParent"],
		});
		parent.appendChild(titleDiv);
		const titleText = KadUtils.KadTable.createCell("H1", {
			names: ["titleName", displayName],
			text: displayName,
		});
		titleDiv.appendChild(titleText);

		// NameHeritage --> DROPDOWN
		if (contentObj.hasOwnProperty("heritage")) {
			const heritage = contentObj.heritage;
			if (heritage.length > 0) {
				const dropNameText = KadUtils.KadTable.createCell("Lbl", {
					names: ["titleDropName", gridKey],
					type: "Lbl",
					text: `\"${displayName}\" ist ${heritage[0]} und bedeutet \"${heritage[1]}\"`,
					createClass: ["clDropdown", "clDropdownName"],
				});
				titleDiv.appendChild(dropNameText);
			}
		}

		// info --> DROPDOWN
		if (contentObj.hasOwnProperty("info")) {
			const dropInfoParent = KadUtils.KadTable.createCell("Div", {
				names: ["titleInfo", gridKey],
				type: "Div",
				createClass: ["cl_DropdownParent"],
			});
			parent.appendChild(dropInfoParent);
			const dropInfoImg = KadUtils.KadTable.createCell("Img", {
				names: ["titleInfo", gridKey],
				subGroup: "gridtitle",
				img: "cInfo",
			});
			dropInfoParent.appendChild(dropInfoImg);
			const dropInfoText = KadUtils.KadTable.createCell("Lbl", {
				names: ["titleInfo", gridKey],
				type: "Lbl",
				text: contentObj.info,
				createClass: ["clDropdown", "cl_DropdownInfo"],
			});
			dropInfoParent.appendChild(dropInfoText);
		}

		// source --> OPEN NEW WINDOW
		if (contentObj.hasOwnProperty("source")) {
			for (const [key, value] of Object.entries(contentObj.source)) {
				const dropSourceParent = KadUtils.KadTable.createCell("Div", {
					names: ["titleSource", gridKey, key],
					createClass: ["cl_DropdownParent"],
					type: "Div",
				});
				parent.appendChild(dropSourceParent);
				const dropSourceImg = KadUtils.KadTable.createCell("Img", {
					names: ["titleSource", key],
					subGroup: "url",
					img: KadUtils.KadImage.getFavicon(value, globalValues.mediaSizes.imgSize),
					onclick: () => {
						window.open(value);
					},
				});
				dropSourceParent.appendChild(dropSourceImg);
				const dropSourceText = KadUtils.KadTable.createCell("Lbl", {
					names: ["titleSource", "text", gridKey],
					type: "Lbl",
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
		const dropSpaceParent = KadUtils.KadTable.createCell("Div", {
			names: ["titleSpace", gridKey],
			type: "Div",
			style: {
				flex: 1,
			},
		});
		parent.appendChild(dropSpaceParent);

		if (dbList.includes(gridKey)) {
			//UPLOAD
			const titleUploadParent = KadUtils.KadTable.createCell("Div", {
				names: ["gridtitle", "dbUL", gridKey],
				type: "Div",
				createClass: ["ULParent"],
				style: {
					display: "none",
				},
			});
			parent.appendChild(titleUploadParent);
			const titleUploadBtn = KadUtils.KadTable.createCell("Btn", {
				names: ["gridtitle", "dbUL", gridKey],
				type: "Btn",
				subGroup: "gridtitle",
				img: "upload",
				ui: {
					uiSize: "size1",
					uiType: "transparent",
				},
				onclick: () => {
					saveDiscipuli(gridKey.slice(3)); // remove "cl_"
				},
			});
			titleUploadParent.appendChild(titleUploadBtn);

			//DOWNLOAD
			const titleDownloadParent = KadUtils.KadTable.createCell("Div", {
				names: ["gridtitle", "dbDL", gridKey],
				type: "Div",
				createClass: ["DLParent"],
				style: {
					display: "none",
				},
			});
			parent.appendChild(titleDownloadParent);

			const titleDownloadBtn = KadUtils.KadTable.createCell("Btn", {
				names: ["gridtitle", "dbDL", gridKey],
				type: "Btn",
				subGroup: "gridtitle",
				img: "download",
				ui: {
					uiSize: "size1",
					uiType: "transparent",
				},
				onclick: () => {
					loadDiscipuli(gridKey.slice(3)); // remove "cl_"
				},
			});
			titleDownloadParent.appendChild(titleDownloadBtn);
		}

		//fullscreen this subgrid
		const titleFullParent = KadUtils.KadTable.createCell("Div", {
			names: ["gridtitle", "full", gridKey],
			type: "Div",
		});
		parent.appendChild(titleFullParent);
		const titleFullBtn = KadUtils.KadTable.createCell("Btn", {
			names: ["gridtitle", "full", gridKey],
			type: "Btn",
			subGroup: "gridtitle",
			img: "fullscreen",
			ui: {
				uiSize: "size1",
				uiType: "transparent",
			},
			onclick: () => {
				toggelFullscreen(gridKey);
			},
		});
		titleFullParent.appendChild(titleFullBtn);

		//clear --> refresh
		const titleTrashParent = KadUtils.KadTable.createCell("Div", {
			names: ["gridtitle", "trash", gridKey],
			type: "Div",
		});
		parent.appendChild(titleTrashParent);
		const titleTrashBtn = KadUtils.KadTable.createCell("Btn", {
			names: ["gridtitle", "trash", gridKey],
			type: "Btn",
			subGroup: "gridtitle",
			img: "trash",
			ui: {
				uiSize: "size1",
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
	let parent = KadUtils.dbID("idNav_navElements");
	let navElements = KadUtils.dbCL("cl_navElements", null);
	while (navElements.length > 0) {
		navElements[0].parentNode.removeChild(navElements[0]);
	}
	contentLayout.contentLength = 0;

	if (contentGroupSort.length != Object.keys(contentLayout.navContent).length) console.log("Not all Groupnames contained in `contentGroupSort`");
	// const navNamesOld = Object.keys(contentLayout.navContent);

	for (let i = contentGroupSort.length - 1; i >= 0; i--) {
		contentLayout.contentLength++;
		const obj = contentGroupSort[i];
		const navParentDiv = KadUtils.KadTable.createCell("Div", {
			names: ["navBar", obj],
			type: "Div",
			createClass: ["cl_navElements"],
			idNoChild: true,
			style: {
				whiteSpace: "nowrap",
			},
			onclick: () => navClick(obj),
		});
		parent.insertBefore(navParentDiv, parent.children[0]);
		const navParentImg = KadUtils.KadTable.createCell("Img", {
			names: ["navBarIcon", "parent", obj],
			subGroup: "navbar",
			img: `nav${obj}`,
		});
		navParentDiv.appendChild(navParentImg);
		const navParentLbl = KadUtils.KadTable.createCell("Lbl", {
			names: ["navBarLbl", obj],
			createClass: ["cl_navNames"],
			type: "Lbl",
			idNoChild: true,
			text: obj,
		});
		navParentDiv.appendChild(navParentLbl);
	}
	KadUtils.dbID("idDiv_navBar_Universe").classList.add("navbarActive");
	KadUtils.dbIDStyle("idDiv_navBar_User").display = "none";
	KadUtils.dbID("idLbl_navBarLbl_User").textContent = nuncDiscipuli.short || "User";
}

export function createFooter() {
	let parent = KadUtils.dbID("idDiv_footerCredits");
	while (parent.length > 0) {
		parent.removeChild(parent.firstChild);
	}
	contentFooter.forEach((arr, index) => {
		const name = arr[0];
		const url = arr[1];
		const dropSourceParent = KadUtils.KadTable.createCell("Div", {
			names: ["footerSource", index],
			createClass: ["cl_DropdownParent", "clFooterCredits"],
			type: "Div",
			// title: `${name} von:\n${url}\n(Opens in a new Tab)`,
		});
		parent.appendChild(dropSourceParent);

		const dropSourceImg = KadUtils.KadTable.createCell("Img", {
			names: ["footerSource", index],
			subGroup: "url",
			img: KadUtils.KadImage.getFavicon(url, globalValues.mediaSizes.imgSize),
			onclick: () => {
				window.open(url);
			},
		});
		dropSourceParent.appendChild(dropSourceImg);
		const dropSourceText = KadUtils.KadTable.createCell("Lbl", {
			names: ["footerSource", index],
			type: "Lbl",
			text: `${name} von:<br>${url}<br>(Opens in a new Tab)`,
			createClass: ["clDropup", "cl_DropdownInfo"],
			onclick: () => {
				window.open(url);
			},
		});
		dropSourceParent.appendChild(dropSourceText);
	});
}
