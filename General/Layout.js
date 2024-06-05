import * as Clear from "../MainModulesClear.js";
import * as DBData from "../MainModulesDBData.js";
import { globalValues } from "../Settings/General.js";
import { loadDiscipuli, nuncDiscipuli, saveDiscipuli, userLoggedIn } from "./Account.js";
import { bgaOptions } from "./BackgroundAnimation.js";
import { KadArray, KadCSS, KadImage, KadTable, checkedLog, dbCL, dbCLStyle, dbID, dbIDStyle, error, hostDebug, objectLength } from "./KadUtils.js";
import { contentFooter, contentGroups, contentGroupsNav, rawContentGrid } from "./MainContent.js";

function contentCheckActive(contentObj) {
	if (contentObj.hasOwnProperty("deactivated") && contentObj.deactivated) return false;
	return true;
}

export let contentGrid = {};
export const contentLayout = {
	createContentGrid() {
		let arr = Array.from(Object.entries(rawContentGrid));
		arr.sort((a, b) => {
			return b[1].name < a[1].name ? 1 : -1;
		});
		let sorted = [];
		for (let group of contentGroups) {
			for (let i = 0; i < arr.length; i++) {
				if (contentCheckActive(arr[i][1]) || arr[i][1].contentGroup == group) sorted.push(arr[i]);
			}
		}
		contentGrid = Object.fromEntries(sorted);
	},
	navContent: {
		Universe: [],
		User: [],
	},
	origUniverse: [],
	get GlobalSettings() {
		if (!userLoggedIn() && !hostDebug()) return ["cl_GeneralSettings", "cl_ColorSettings"];
		return Object.keys(contentGrid).filter((key) => {
			return contentGrid[key].contentGroup == "Global-Settings";
		});
	},
	get getUniverse() {
		return Object.keys(contentGrid).filter((key) => {
			return !contentLayout.settingsNames.includes(contentGrid[key].contentGroup);
		});
	},
	get nameList() {
		let list = [];
		Object.values(contentGrid).forEach((obj) => {
			if (contentLayout.settingsNames.includes(obj.contentGroup)) return;
			if (!contentCheckActive(obj)) return;
			list.push(obj.name);
		});
		return list;
	},
	AccountSettings: ["cl_UserLogin", "cl_UserChange"],
	contentList: [],
	contentLength: 0,
	prevNavContent: null,
	prevNavFullscreen: null,
	settingsNames: ["Account-Settings", "Global-Settings"],
	defaultPage: hostDebug() ? "cl_ColorSettings" : "Universe",
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
	const calcX = x; //tryWidth < winWidth + gap + margin * 2 ? x : x;
	if (KadCSS.getRoot("gridRowLength", true) != calcX) {
		KadCSS.setRoot("gridRowLength", calcX);
		navClick(contentLayout.prevNavContent);
	}
	let navNames = dbCL("cl_navNames", null);
	const sp = dbID("idDiv_navBar_Universe");
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
	const rowLength = contentLayout.contentList.length == 1 ? 1 : KadCSS.getRoot("gridRowLength", true);
	let gridArray = [];
	if (rowLength === 1) {
		for (const name of contentLayout.contentList) {
			gridArray.push(name);
		}
		createAreaString(gridArray, rowLength);
		return;
	}
	for (const name of contentLayout.contentList) {
		checkedLog(!contentGrid[name].hasOwnProperty("size"), "no size:[] defined at", name);
		let contWidth = contentGrid[name].size[0];
		if (contWidth > rowLength) contWidth = rowLength;
		const contHeight = contentGrid[name].size[1];

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
			if (checkedLog(indexRow > 100, "unable to find spot!")) {
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
	const hostDeb = hostDebug();
	return [...contentLayout.navContent[layoutName]].filter((content) => {
		return hostDeb ? true : contentGrid[content].logReqUser == undefined;
	});
}

function createAreaString(gridArray, rowLength) {
	if (gridArray == []) {
		dbIDStyle("id_contentGrid").gridTemplateAreas = "";
		error("No Grid for gridTemplateAreas provided");
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
	dbIDStyle("id_contentGrid").gridTemplateAreas = gridString;
}

export function createSubgrid() {
	const dbList = [];
	for (const dbDataObj of Object.values(DBData)) {
		dbList.push(dbDataObj.contentName);
	}
	for (const gridKey in contentGrid) {
		const parentGrid = dbCL(gridKey);
		const contentObj = contentGrid[gridKey];
		const displayName = contentObj.name;

		parentGrid.style.gridArea = gridKey;

		const childDivArea = parentGrid.children[0].style;
		childDivArea.gridTemplateRows = "";
		for (let num of contentObj.maingrid.rows) {
			if (num == 0) {
				childDivArea.gridTemplateRows += "auto ";
			} else {
				childDivArea.gridTemplateRows += `var(--UIHeight${num}) `;
			}
		}
		childDivArea.gridTemplateRows += "auto";

		const arr = KadArray.createArray(contentObj.maingrid.areas[0].length, null, "auto").join(" ");
		childDivArea.gridTemplateColumns = `1fr ${arr} 1fr`;

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

		const dropIconParent = KadTable.createCell("Div", {
			names: ["navIcon", gridKey],
			createClass: ["cl_DropdownParent"],
			onclick: () => {
				navClick(contGroup);
			},
		});
		parent.appendChild(dropIconParent);
		const dropIconImg = KadTable.createCell("Img", {
			names: ["navIcon", gridKey],
			subGroup: "gridtitle",
			img: `nav${contGroup}`,
		});
		dropIconParent.appendChild(dropIconImg);
		const dropIconText = KadTable.createCell("Lbl", {
			names: ["titleIcon", gridKey],
			text: `Gehe zu Kathegorie ${contGroup}.`,
			createClass: ["clDropdown", "cl_DropdownInfo"],
		});
		dropIconParent.appendChild(dropIconText);

		//name --> TITLE
		const titleDiv = KadTable.createCell("Div", {
			names: ["titleName", gridKey],
			createClass: ["cl_DropdownParent"],
		});
		parent.appendChild(titleDiv);
		const titleText = KadTable.createCell("H1", {
			names: ["titleName", displayName],
			text: displayName,
		});
		titleDiv.appendChild(titleText);

		// NameHeritage --> DROPDOWN
		if (contentObj.hasOwnProperty("heritage")) {
			const heritage = contentObj.heritage;
			if (heritage.length > 0) {
				const dropNameText = KadTable.createCell("Lbl", {
					names: ["titleDropName", gridKey],
					text: `\"${displayName}\" ist ${heritage[0]} und bedeutet \"${heritage[1]}\"`,
					createClass: ["clDropdown", "clDropdownName"],
				});
				titleDiv.appendChild(dropNameText);
			}
		}

		// info --> DROPDOWN
		if (contentObj.hasOwnProperty("info")) {
			const dropInfoParent = KadTable.createCell("Div", {
				names: ["titleInfo", gridKey],
				createClass: ["cl_DropdownParent"],
			});
			parent.appendChild(dropInfoParent);
			const dropInfoImg = KadTable.createCell("Img", {
				names: ["titleInfo", gridKey],
				subGroup: "gridtitle",
				img: "cInfo",
			});
			dropInfoParent.appendChild(dropInfoImg);
			const dropInfoText = KadTable.createCell("Lbl", {
				names: ["titleInfo", gridKey],
				text: contentObj.info,
				createClass: ["clDropdown", "cl_DropdownInfo"],
			});
			dropInfoParent.appendChild(dropInfoText);
		}

		// source --> OPEN NEW WINDOW
		if (contentObj.hasOwnProperty("source")) {
			for (const [key, value] of Object.entries(contentObj.source)) {
				const dropSourceParent = KadTable.createCell("Div", {
					names: ["titleSource", gridKey, key],
					createClass: ["cl_DropdownParent"],
				});
				parent.appendChild(dropSourceParent);
				const dropSourceImg = KadTable.createCell("Img", {
					names: ["titleSource", key],
					subGroup: "url",
					img: KadImage.getFavicon(value, globalValues.mediaSizes.imgSize),
					onclick: () => {
						window.open(value);
					},
				});
				dropSourceParent.appendChild(dropSourceImg);
				const dropSourceText = KadTable.createCell("Lbl", {
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
		const dropSpaceParent = KadTable.createCell("Div", {
			names: ["titleSpace", gridKey],
			style: {
				flex: 1,
			},
		});
		parent.appendChild(dropSpaceParent);

		if (dbList.includes(gridKey)) {
			//UPLOAD
			const titleUploadParent = KadTable.createCell("Div", {
				names: ["gridtitle", "dbUL", gridKey],
				createClass: ["ULParent"],
				style: {
					display: "none",
				},
			});
			parent.appendChild(titleUploadParent);
			const titleUploadBtn = KadTable.createCell("Btn", {
				names: ["gridtitle", "dbUL", gridKey],
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
			const titleDownloadParent = KadTable.createCell("Div", {
				names: ["gridtitle", "dbDL", gridKey],
				createClass: ["DLParent"],
				style: {
					display: "none",
				},
			});
			parent.appendChild(titleDownloadParent);

			const titleDownloadBtn = KadTable.createCell("Btn", {
				names: ["gridtitle", "dbDL", gridKey],
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
		const titleFullParent = KadTable.createCell("Div", {
			names: ["gridtitle", "full", gridKey],
		});
		parent.appendChild(titleFullParent);
		const titleFullBtn = KadTable.createCell("Btn", {
			names: ["gridtitle", "full", gridKey],
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
		const titleTrashParent = KadTable.createCell("Div", {
			names: ["gridtitle", "trash", gridKey],
		});
		parent.appendChild(titleTrashParent);
		const titleTrashBtn = KadTable.createCell("Btn", {
			names: ["gridtitle", "trash", gridKey],
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
	let parent = dbID("idNav_navElements");
	let navElements = dbCL("cl_navElements", null);
	while (navElements.length > 0) {
		navElements[0].parentNode.removeChild(navElements[0]);
	}
	contentLayout.contentLength = 0;
	checkedLog(contentGroupsNav.length != objectLength(contentLayout.navContent), "Not all Groupnames contained in `contentGroupsNav`");

	for (let i = contentGroupsNav.length - 1; i >= 0; i--) {
		contentLayout.contentLength++;
		const obj = contentGroupsNav[i];
		const navParentDiv = KadTable.createCell("Div", {
			names: ["navBar", obj],
			createClass: ["cl_navElements"],
			idNoChild: true,
			style: {
				whiteSpace: "nowrap",
			},
			onclick: () => navClick(obj),
		});
		const navParentImg = KadTable.createCell("Img", {
			names: ["navBarIcon", "parent", obj],
			subGroup: "navbar",
			img: `nav${obj}`,
		});
		navParentDiv.appendChild(navParentImg);
		const navParentLbl = KadTable.createCell("Lbl", {
			names: ["navBarLbl", obj],
			createClass: ["cl_navNames"],
			idNoChild: true,
			text: obj,
		});
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
		const dropSourceParent = KadTable.createCell("Div", {
			names: ["footerSource", index],
			createClass: ["cl_DropdownParent", "clFooterCredits"],
		});
		parent.appendChild(dropSourceParent);

		const dropSourceImg = KadTable.createCell("Img", {
			names: ["footerSource", index],
			subGroup: "url",
			img: KadImage.getFavicon(url, globalValues.mediaSizes.imgSize),
			onclick: () => {
				window.open(url);
			},
		});
		dropSourceParent.appendChild(dropSourceImg);
		const dropSourceText = KadTable.createCell("Lbl", {
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
