import { daEL, dbID, dbCL, KadDOM, KadTable } from "../General/KadUtils.js";
import { contentGrid, contentLayout } from "../General/Layout.js";

const usergridOptions = {
	enableAll: false,
	checkAllGroups: () => {
		//usergridCheckGroup
		for (const groupKey of Object.keys(usergridOptions.groups)) {
			let counter = 0;
			const cbEnabled = dbCL(`clCb_disableUsergridSingle_${groupKey}`, null);
			for (let i = 0; i < cbEnabled.length; i++) {
				if (cbEnabled[i].checked) {
					counter++;
				}
			}
			if (counter == 0) {
				dbID(`idBtn_child_disableUsergridGroup_${groupKey}`).firstChild.src = KadDOM.getImgPath("cCheck");
				usergridOptions.groups[groupKey] = false;
			} else {
				dbID(`idBtn_child_disableUsergridGroup_${groupKey}`).firstChild.src = KadDOM.getImgPath("cX");
				usergridOptions.groups[groupKey] = true;
			}
		}
	},
	groups: {},
	updateAllSingles: (groupKey) => {
		const singleList = dbCL(`clCb_disableUsergridSingle_${groupKey}`, null);
		for (let i = 0; i < singleList.length; i++) {
			singleList[i].checked = usergridOptions.groups[groupKey];
		}
	},
	toggleAllGridDisable: () => {
		usergridOptions.enableAll = !usergridOptions.enableAll;
		for (const groupKey in usergridOptions.groups) {
			usergridOptions.groups[groupKey] = usergridOptions.enableAll;
			usergridToggleGroup(groupKey);
		}
	},
	generateArray: () => {
		for (const key of contentLayout.navContent.Universe) {
			contentGrid[key].userSelected = dbID(`idVin_child_disableUsergridSingle_CB_${key}`).checked;
		}
		return Object.keys(contentGrid).filter((key) => {
			return contentGrid[key].userSelected === true && contentLayout.navContent.Universe.includes(key);
		});
	},
};

daEL(idBtn_toggleUserGrid, "click", usergridOptions.toggleAllGridDisable);
daEL(idBtn_loaduserGridLayout, "click", saveUsergridLayout);

export function clear_cl_UserGridLayout() {
	const tempArr = Object.keys(contentLayout.navContent);
	tempArr.splice(tempArr.indexOf("Universe"), 1);
	tempArr.splice(tempArr.indexOf("User"), 1);
	usergridOptions.groups = {};
	for (let i = 0; i < tempArr.length; i++) {
		usergridOptions.groups[tempArr[i]] = false;
	}
	contentLayout.navContent.User = []; //[...contentLayout.navContent.Universe];
	usergridCreateTable();
}

export const storage_cl_UserGridLayout = {
	dbName: "UserGridLayout",
	contentName: "cl_UserGridLayout",
	clear() {
		this.data = [contentLayout.navContent.Universe];
	},
	get data() {
		return usergridOptions.generateArray();
	},
	set data(data) {
		contentLayout.navContent.User = data.filter((cl) => {
			return Object.keys(contentGrid).includes(cl);
		});
		for (const gridName of contentLayout.navContent.Universe) {
			contentGrid[gridName].userSelected = contentLayout.navContent.User.includes(gridName); //safety, if old things in Database!
		}
		usergridCreateTable();
		usergridOptions.checkAllGroups();
	},
};

function usergridToggleSingle() {
	usergridOptions.checkAllGroups();
	contentLayout.navContent.User = usergridOptions.generateArray();
}

function usergridToggleGroup(groupKey) {
	usergridOptions.groups[groupKey] = !usergridOptions.groups[groupKey];
	usergridOptions.updateAllSingles(groupKey);
	usergridOptions.checkAllGroups();
	contentLayout.navContent.User = usergridOptions.generateArray();
}

function usergridCreateTable() {
	//clear Table
	KadTable.clear("idTabBody_DisableUserGrid");
	for (const groupKey in usergridOptions.groups) {
		//create Headers
		const rowTh = KadTable.insertRow("idTabBody_DisableUserGrid");
		rowTh.id = `idTabBody_DisableUserGrid_Group${groupKey}`;

		KadTable.addHeaderCell(rowTh, {
			names: ["disableUsergridGroup", groupKey],
			type: "Lbl",
			text: groupKey,
			colSpan: 2,
			cellStyle: {
				textAlign: "right",
			},
			cellOnclick: () => {
				usergridToggleGroup(groupKey);
			},
		});
		KadTable.addHeaderCell(rowTh, {
			names: ["disableUsergridGroup", groupKey],
			type: "Btn",
			subGroup: "subgrid",
			img: "cCheck",
			ui: {
				uiSize: "size1",
				uiType: "transparent",
			},
			style: {
				margin: "UIPadding",
			},
			colSpan: 2,
			cellStyle: {
				textAlign: "left",
			},
			cellOnclick: () => {
				usergridToggleGroup(groupKey);
			},
		});
		for (let j = 0; j < contentLayout.navContent[groupKey].length; j++) {
			let objName = contentLayout.navContent[groupKey][j];
			const row = KadTable.insertRow("idTabBody_DisableUserGrid");
			usergridCreateCheckbox(row, j, groupKey, objName);
			//create the second column
			if (contentLayout.navContent[groupKey][j + 1] !== undefined) {
				++j;
				objName = contentLayout.navContent[groupKey][j];
				usergridCreateCheckbox(row, j, groupKey, objName);
			}
		}
	}
}

function usergridCreateCheckbox(row, j, groupKey, objName) {
	// Checkbox
	const cellA = KadTable.addCell(row, {
		names: ["disableUsergridSingle", "CB", objName],
		type: "Vin",
		subGroup: "checkbox",
		cellStyle: {
			textAlign: "center",
		},
		createClass: [`clCb_disableUsergridSingle_${groupKey}`],
		checked: contentGrid[objName].userSelected,
		onclick: () => {
			usergridToggleSingle(objName);
		},
	});
	let uImage = null;
	// if (contentGrid[objName].hasOwnProperty("name")) {
	// 	uImage = KadTable.addCell(row, {
	// 		names: ["disableUsergridSingle", groupKey, j],
	// 		type: "Img",
	// 		subGroup: "subgrid",
	// 		img: "upload",
	// 		onclick: () => {
	// 			usergridToggleSingle(objName);
	// 		},
	// 	});
	// }
	KadTable.addCell(
		row,
		{
			names: ["disableUsergridSingle", groupKey, j],
			type: "Lbl",
			text: contentGrid[objName].name,
			ui: {
				for: cellA.childNodes[0].id,
			},
		},
		uImage
	);
}

function saveUsergridLayout() {
	dbID("idBtn_child_gridtitle_dbUL_cl_UserGridLayout").click();
}
