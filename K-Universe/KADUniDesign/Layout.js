let contentGrid = {};
const contentLayout = {
	createContentGrid() {
		let arr = Array.from(Object.entries(rawContentGrid));
		contentGrid = Object.fromEntries(
			arr.filter((obj) => {
				return obj[1].active == undefined || obj[1].active == true;
				// return !obj[1].hasOwnProperty("active") || obj[1].active == false;
			})
		);
	},
	navContent: {
		Universe: [],
		User: [],
	},
	origUniverse: [],
	get GlobalSettings() {
		if (!nuncDiscipuli.checkLogin) return ["cl_GeneralSettings", "cl_ColorSettings"];
		return Object.keys(contentGrid).filter((key) => {
			return contentGrid[key].contentGroup == "GlobalSettings";
		});
	},
	get getUniverse() {
		return Object.keys(contentGrid).filter((key) => {
			return contentGrid[key].contentGroup != "AccountSettings" && contentGrid[key].contentGroup != "GlobalSettings";
		});
	},
	get nameList() {
		let list = [];
		Object.values(contentGrid).forEach((obj) => {
			if (obj.contentGroup == "AccountSettings" || obj.contentGroup == "GlobalSettings") return;
			if (obj.hasOwnProperty("active") && obj.active == false) return;
			list.push(obj.name);
		});
		return list;
	},
	AccountSettings: ["cl_UserAcc"],
	contentList: [],
	contentLength: 0,
	prevNavContent: null,
	prevNavFullscreen: null,
	defaultPage: globalValues.hostDebug ? "cl_Numbery" : "Universe",
};

function layoutHideLoadingscreen() {
	KadUtils.dbCL("cl_Loading").classList.add("cl_LoadingFinished");
}

function layoutShowLoadingscreen() {
	KadUtils.dbCL("cl_Loading").classList.remove("cl_LoadingFinished");
}

function layoutCreateContentlayoutList() {
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

window.addEventListener("resize", layoutResizeGrid);

function layoutResizeGrid() {
	const winWidth = window.innerWidth;
	const minWidth = globalValues.mediaSizes.divGridMinWidth;
	const x = Math.max(1, Math.floor(winWidth / minWidth)); // minimum 2 Cols, floored division
	// const gap = KadUtils.CSS.getRoot("gridGap", true);
	// const margin = globalValues.mediaSizes.margin;
	// const tryWidth = minWidth * x + (x - 1) * gap + margin * 2;
	// const calcX = tryWidth < winWidth + gap + margin * 2 ? x : x;
	const calcX = x; //tryWidth < winWidth + gap + margin * 2 ? x : x;
	if (KadUtils.CSS.getRoot("gridRowLength", true) != calcX) {
		KadUtils.CSS.setRoot("gridRowLength", calcX);
		layoutNavClick(contentLayout.prevNavContent);
	}
	let navNames = KadUtils.dbCL("cl_navNames", null);
	const sp = KadUtils.dbID("idDiv_navBar_Universe");
	const diff1 = sp.offsetLeft <= 0;
	navNames.forEach((obj) => {
		obj.style.display = diff1 ? "none" : "initial";
	});
	const diff2 = sp.offsetLeft <= 0;
	if (diff2 && !diff1) {
		navNames.forEach((obj) => {
			obj.style.display = diff2 ? "none" : "initial";
		});
	}
}

function layoutNavClick(layoutName) {
	if ([...Object.keys(contentLayout.navContent)].includes(layoutName)) {
		if (layoutName === "Universe") {
			contentLayout.navContent[layoutName] = [...contentLayout.origUniverse];
		} else if (layoutName === "User") {
			contentLayout.navContent[layoutName] = [...nuncDiscipuli.getData("UserGridLayout")];
		} else {
			contentLayout.navContent[layoutName] = contentLayout.navContent[layoutName].sort();
		}
	}
	contentLayout.prevNavContent = layoutName || contentLayout.defaultPage;
	layoutNavTitle();
	layoutCreateGridLayout(contentLayout.prevNavContent);

	for (let objKey in contentGrid) {
		const state = contentLayout.contentList.includes(objKey);
		KadUtils.dbCLStyle(objKey).display = state ? "initial" : "none";
		KadUtils.dbCL(objKey).pointerEvents = state ? "auto" : "none";
	}

	for (const obj of [...Object.keys(contentLayout.navContent), "GlobalSettings", "AccountSettingsA", "AccountSettingsB"]) {
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

function layoutNavTitle() {
	let titleText = contentLayout.prevNavContent;
	if (contentLayout.prevNavContent == "User") {
		titleText = nuncDiscipuli.short;
	} else if (contentLayout.prevNavContent == "GlobalSettings") {
		titleText = "Settings";
	} else if (["AccountSettingsA", "AccountSettingsB"].includes(contentLayout.prevNavContent)) {
		titleText = "UserData";
	} else if (contentLayout.prevNavContent == "Clear") {
		titleText = bgaOptions.animations[bgaOptions.curr].constructor.name;
	} else if (contentLayout.prevNavContent.includes("cl_")) {
		titleText = contentGrid[contentLayout.prevNavContent].name;
	}
	document.title = `KAD-${titleText}`;
}

function layoutCreateContentList(layoutName) {
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
	if (layoutName === "AccountSettingsA" || layoutName === "AccountSettingsB") {
		return contentLayout.AccountSettings;
	}
	if (nuncDiscipuli.checkLogin) {
		return [...contentLayout.navContent[layoutName]];
	}
	const hostDeb = globalValues.hostDebug;
	return [...contentLayout.navContent[layoutName]].filter((content) => {
		return hostDeb ? true : contentGrid[content].logReqUser == undefined;
	});
}

function layoutCreateGridLayout(layoutName) {
	contentLayout.contentList = layoutCreateContentList(layoutName);
	if (contentLayout.contentList == []) {
		layoutCreateAreaString([], 0);
		return;
	}
	// fill list with data
	const rowLength = contentLayout.contentList.length == 1 ? 1 : KadUtils.CSS.getRoot("gridRowLength", true);
	let gridArray = [];
	if (rowLength === 1) {
		for (const name of contentLayout.contentList) {
			gridArray.push(name);
		}
		layoutCreateAreaString(gridArray, rowLength);
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
	layoutCreateAreaString(gridArray, rowLength);
}

function layoutCreateAreaString(gridArray, rowLength) {
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

function layoutCreateSubgrid() {
	for (const gridKey in contentGrid) {
		KadUtils.dbCL(gridKey).classList.add("cl_contentSubGrid");
		KadUtils.dbCLStyle(gridKey).gridArea = gridKey;
		for (const content of contentGrid[gridKey].subgrid) {
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
		let contGroup = contentGrid[gridKey].contentGroup;
		if (contGroup.includes("AccountSettings")) {
			contGroup = "User";
		}
		const dropIconParent = KadUtils.Table.createCell("Div",{
			names: ["navIcon", gridKey],
			type: "Div",
			createClass: ["clDropdownParent"],
			onclick: () => {
				layoutNavClick(contGroup);
			},
		});
		parent.appendChild(dropIconParent);
		const dropIconImg = KadUtils.Table.createCell("Img",{
			names: ["navIcon", gridKey],
			subGroup: "gridtitle",
			img: `nav${contGroup}`,
		});
		dropIconParent.appendChild(dropIconImg);
		const dropIconText = KadUtils.Table.createCell("Lbl",{
			names: ["titleIcon", gridKey],
			type: "Lbl",
			text: `Gehe zu Kathegorie ${contGroup}.`,
			createClass: ["clDropdown", "clDropdownInfo"],
		});
		dropIconParent.appendChild(dropIconText);

		//name --> TITLE
		const titleDiv = KadUtils.Table.createCell("Div",{
			names: ["titleName", gridKey],
			type: "Div",
			createClass: ["clDropdownParent"],
		});
		parent.appendChild(titleDiv);
		const titleText = KadUtils.Table.createCell("H1",{
			names: ["titleName", contentGrid[gridKey].name],
			text: contentGrid[gridKey].name,
		});
		titleDiv.appendChild(titleText);

		// NameHeritage --> DROPDOWN
		if (contentGrid[gridKey].hasOwnProperty("heritage")) {
			const heritage = contentGrid[gridKey].heritage;
			if (heritage.length > 0) {
				const dropNameText = KadUtils.Table.createCell("Lbl",{
					names: ["titleDropName", gridKey],
					type: "Lbl",
					text: `\"${contentGrid[gridKey].name}\" ist ${heritage[0]} und bedeutet \"${heritage[1]}\"`,
					createClass: ["clDropdown", "clDropdownName"],
				});
				titleDiv.appendChild(dropNameText);
			}
		}

		// info --> DROPDOWN
		if (contentGrid[gridKey].hasOwnProperty("info")) {
			const dropInfoParent = KadUtils.Table.createCell("Div",{
				names: ["titleInfo", gridKey],
				type: "Div",
				createClass: ["clDropdownParent"],
			});
			parent.appendChild(dropInfoParent);
			const dropInfoImg = KadUtils.Table.createCell("Img",{
				names: ["titleInfo", gridKey],
				subGroup: "gridtitle",
				img: "cInfo",
			});
			dropInfoParent.appendChild(dropInfoImg);
			const dropInfoText = KadUtils.Table.createCell("Lbl",{
				names: ["titleInfo", gridKey],
				type: "Lbl",
				text: contentGrid[gridKey].info,
				createClass: ["clDropdown", "clDropdownInfo"],
			});
			dropInfoParent.appendChild(dropInfoText);
		}

		// source --> OPEN NEW WINDOW
		if (contentGrid[gridKey].hasOwnProperty("source")) {
			for (const [key, value] of Object.entries(contentGrid[gridKey].source)) {
				const dropSourceParent = KadUtils.Table.createCell("Div",{
					names: ["titleSource", gridKey, key],
					createClass: ["clDropdownParent"],
					type: "Div",
				});
				parent.appendChild(dropSourceParent);
				const dropSourceImg = KadUtils.Table.createCell("Img",{
					names: ["titleSource", key],
					subGroup: "url",
					img: KadUtils.Image.getFavicon(value, globalValues.mediaSizes.imgSize),
					onclick: () => {
						window.open(value);
					},
				});
				dropSourceParent.appendChild(dropSourceImg);
				const dropSourceText = KadUtils.Table.createCell("Lbl",{
					names: ["titleSource", "text", gridKey],
					type: "Lbl",
					text: `${key} von:<br>${value}<br>(Opens in a new Tab)`,
					createClass: ["clDropdown", "clDropdownInfo"],
					onclick: () => {
						window.open(value);
					},
				});
				dropSourceParent.appendChild(dropSourceText);
			}
		}
		//DEBUG-LABEL
		const dropSpaceParent = KadUtils.Table.createCell("Div",{
			names: ["titleSpace", gridKey],
			type: "Div",
			style: {
				flex: 1,
			},
		});
		parent.appendChild(dropSpaceParent);

		//UPLOAD
		const titleUploadParent = KadUtils.Table.createCell("Div",{
			names: ["gridtitle", "dbUpload", gridKey],
			type: "Div",
		});
		parent.appendChild(titleUploadParent);
		titleUploadParent.style.display = "none";
		const titleUploadBtn = KadUtils.Table.createCell("Btn",{
			names: ["gridtitle", "dbUpload_cl", contentGrid[gridKey].userStoreDBName],
			type: "Btn",
			subGroup: "gridtitle",
			img: "upload",
			ui: {
				uiSize: "size1",
				uiType: "transparent",
			},
			onclick: () => {
				saveDiscipuli(contentGrid[gridKey].userStoreDBName);
			},
		});
		titleUploadParent.appendChild(titleUploadBtn);

		//DOWNLOAD
		const titleDownloadParent = KadUtils.Table.createCell("Div",{
			names: ["gridtitle", "dbDownload", gridKey],
			type: "Div",
			style: {
				display: "none",
			},
		});
		parent.appendChild(titleDownloadParent);
		titleDownloadParent.style.display = "none";
		const titleDownloadBtn = KadUtils.Table.createCell("Btn",{
			names: ["gridtitle", "dbDownload_cl", contentGrid[gridKey].userStoreDBName],
			type: "Btn",
			subGroup: "gridtitle",
			img: "download",
			ui: {
				uiSize: "size1",
				uiType: "transparent",
			},
			onclick: () => {
				loadDiscipuli(contentGrid[gridKey].userStoreDBName);
			},
		});
		titleDownloadParent.appendChild(titleDownloadBtn);

		//fullscreen this subgrid
		const titleFullParent = KadUtils.Table.createCell("Div",{
			names: ["gridtitle", "full", gridKey],
			type: "Div",
		});
		parent.appendChild(titleFullParent);
		const titleFullBtn = KadUtils.Table.createCell("Btn",{
			names: ["gridtitle", "full", gridKey],
			type: "Btn",
			subGroup: "gridtitle",
			img: "fullscreen",
			ui: {
				uiSize: "size1",
				uiType: "transparent",
			},
			onclick: () => {
				layoutToggelFullscreen(gridKey);
			},
		});
		titleFullParent.appendChild(titleFullBtn);

		//clear --> refresh
		const titleTrashParent = KadUtils.Table.createCell("Div",{
			names: ["gridtitle", "trash", gridKey],
			type: "Div",
		});
		parent.appendChild(titleTrashParent);
		const titleTrashBtn = KadUtils.Table.createCell("Btn",{
			names: ["gridtitle", "trash", gridKey],
			type: "Btn",
			subGroup: "gridtitle",
			img: "trash",
			ui: {
				uiSize: "size1",
				uiType: "transparent",
			},
			onclick: () => {
				let funcName = "clear_" + gridKey;
				window[funcName]();
			},
		});
		titleTrashParent.appendChild(titleTrashBtn);
	}
}

function layoutToggelFullscreen(gridKey) {
	if (contentLayout.prevNavContent == gridKey) {
		layoutNavClick(contentLayout.prevNavFullscreen);
	} else {
		contentLayout.prevNavFullscreen = contentLayout.prevNavContent;
		layoutNavClick(gridKey);
	}
}

function layoutCreateNavbar() {
	let parent = KadUtils.dbID("idNav_navElements");
	let navElements = KadUtils.dbCL("cl_navElements", null);
	while (navElements.length > 0) {
		navElements[0].parentNode.removeChild(navElements[0]);
	}
	contentLayout.contentLength = 0;
	for (let i = Object.keys(contentLayout.navContent).length - 1; i >= 0; i--) {
		contentLayout.contentLength++;
		let obj = Object.keys(contentLayout.navContent)[i];
		const navParentDiv = KadUtils.Table.createCell("Div",{
			names: ["navBar", obj],
			type: "Div",
			createClass: ["cl_navElements"],
			idNoChild: true,
			style: {
				whiteSpace: "nowrap",
				display: obj == "User" ? "none" : "initial",
			},
			onclick: () => {
				layoutNavClick(obj);
			},
		});
		parent.insertBefore(navParentDiv, parent.children[0]);
		const navParentImg = KadUtils.Table.createCell("Img",{
			names: ["navBarIcon", "parent", obj],
			subGroup: "navbar",
			img: `nav${obj}`,
		});
		navParentDiv.appendChild(navParentImg);
		const navParentLbl = KadUtils.Table.createCell("Lbl",{
			names: ["navBarLbl", obj],
			createClass: ["cl_navNames"],
			type: "Lbl",
			idNoChild: true,
			text: obj == "User" ? nuncDiscipuli.short || "User" : obj,
			style: {
				// fontSize: KadUtils.CSS.getRoot("fontSizeLarge")
			},
		});
		navParentDiv.appendChild(navParentLbl);
	}
	// move User to last place!
	parent.insertBefore(KadUtils.dbID("idDiv_navBar_User"), parent.children[contentLayout.contentLength]);
	KadUtils.CSS.setRoot("navContentLength", contentLayout.contentLength - 1); //"User" gets skipped
	KadUtils.dbID("idBtn_navBar_KW").textContent = "KW " + KadUtils.Date.getWeekNumber();
	KadUtils.dbID("idDiv_navBar_Universe").classList.add("navbarActive");
}

function layoutCreateFooter() {
	let parent = KadUtils.dbID("idDiv_footerCredits");
	while (parent.length > 0) {
		parent.removeChild(parent.firstChild);
	}
	contentFooter.forEach((arr, index) => {
		const name = arr[0];
		const url = arr[1];
		const dropSourceParent = KadUtils.Table.createCell("Div",{
			names: ["footerSource", index],
			createClass: ["clDropdownParent", "clFooterCredits"],
			type: "Div",
		});
		parent.appendChild(dropSourceParent);

		const dropSourceImg = KadUtils.Table.createCell("Img",{
			names: ["footerSource", index],
			subGroup: "url",
			img: KadUtils.Image.getFavicon(url, globalValues.mediaSizes.imgSize),
			onclick: () => {
				window.open(url);
			},
		});
		dropSourceParent.appendChild(dropSourceImg);
		const dropSourceText = KadUtils.Table.createCell("Lbl",{
			names: ["footerSource", index],
			type: "Lbl",
			text: `${name} von:<br>${url}<br>(Opens in a new Tab)`,

			createClass: ["clDropup", "clDropdownInfo"],
			onclick: () => {
				window.open(url);
			},
		});
		dropSourceParent.appendChild(dropSourceText);
	});
}
