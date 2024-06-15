import { contentGroupsMaincontent } from "../General/MainContent.js";
import { dbID, dbCL, KadDOM, KadTable, initEL } from "../KadUtils/KadUtils.js";
import { contentGrid, contentLayout } from "../General/Layout.js";

const usergridOptions = {
	columns: 3,
	enableAll: true,
	groups: {},
	enableGroups: {},
};

initEL({ id: idBtn_userGridToggleAll, fn: userGridToggleAll });
initEL({ id: idBtn_userGridSaveLayout, fn: saveUsergridLayout });

export function clear_cl_UserGridLayout() {
	usergridOptions.groups = {};
	usergridOptions.enableGroups = {};

	for (let groupKey of contentGroupsMaincontent) {
		usergridOptions.groups[groupKey] = contentLayout.navContent[groupKey].map((entry, index) => ({ [entry]: index % 3 == 0 ? true : false }));
		usergridOptions.enableGroups[groupKey] = false;
	}
	usergridCreateTable();

	//separate because IDs not ready before
	for (let groupKey of contentGroupsMaincontent) {
		usergridCheckGroup(groupKey);
	}
}

export const storage_cl_UserGridLayout = {
	dbName: "UserGridLayout",
	contentName: "cl_UserGridLayout",
	clear() {
		this.data = [];
	},
	get data() {
		let list = [];
		for (const groupKey in usergridOptions.groups) {
			for (let clObj of usergridOptions.groups[groupKey]) {
				const clName = Object.keys(clObj);
				if (dbID(`idVin_disableUsergridSingle_CB_${clName}`).checked) list.push(...clName);
			}
		}
		return list;
	},
	set data(data) {
		for (const groupKey in usergridOptions.groups) {
			for (let clObj of usergridOptions.groups[groupKey]) {
				const clName = Object.keys(clObj)[0];
				const state = data.includes(clName);
				clObj[clName] = state;
				dbID(`idVin_disableUsergridSingle_CB_${clName}`).checked = state;
			}
		}
	},
};

function userGridToggleAll() {
	usergridOptions.enableAll = !usergridOptions.enableAll;
	for (const groupKey in usergridOptions.groups) {
		usergridOptions.groups[groupKey].forEach((obj) => {
			dbID(`idVin_disableUsergridSingle_CB_${Object.keys(obj)}`).checked = usergridOptions.enableAll;
		});
		usergridCheckGroup(groupKey);
		usergridUpdateGroup(groupKey);
	}
}

function usergridCheckGroup(groupKey) {
	let somethingChecked = 0;
	const cbEnabled = dbCL(`clCb_disableUsergridSingle_${groupKey}`, null);
	for (let i = 0; i < cbEnabled.length; i++) {
		if (cbEnabled[i].checked) somethingChecked++;
	}
	const state = somethingChecked === cbEnabled.length ? false : true;
	dbID(`idBtn_child_disableUsergridGroup_${groupKey}`).firstChild.src = KadDOM.getImgPath(state ? "cCheck" : "cX");
	usergridOptions.enableGroups[groupKey] = state;
}

function usergridUpdateGroup(groupKey) {
	const singleList = dbCL(`clCb_disableUsergridSingle_${groupKey}`, null);
	for (let i = 0; i < singleList.length; i++) {
		singleList[i].checked = !usergridOptions.enableGroups[groupKey];
	}
}

function usergridToggleGroup(groupKey) {
	usergridOptions.enableGroups[groupKey] = !usergridOptions.enableGroups[groupKey];
	usergridUpdateGroup(groupKey);
	usergridCheckGroup(groupKey);
}

function usergridCreateTable() {
	KadTable.clear("idTabBody_DisableUserGrid");
	for (const groupKey in usergridOptions.groups) {
		const rowTh = KadTable.insertRow("idTabBody_DisableUserGrid");
		rowTh.id = `idTabBody_DisableUserGrid_Group${groupKey}`;

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
			cellStyle: {
				textAlign: "center",
			},
			cellOnclick: () => {
				usergridToggleGroup(groupKey);
			},
		});
		KadTable.addHeaderCell(rowTh, {
			names: ["disableUsergridGroup", groupKey],
			type: "Lbl",
			text: groupKey,
			colSpan: usergridOptions.columns * 2 - 1,
			cellStyle: {
				textAlign: "left",
			},
			cellOnclick: () => {
				usergridToggleGroup(groupKey);
			},
		});
		for (let j = 0; j < usergridOptions.groups[groupKey].length; j += usergridOptions.columns) {
			const row = KadTable.insertRow("idTabBody_DisableUserGrid");
			for (let p = 0; p < usergridOptions.columns; p++) {
				if (usergridOptions.groups[groupKey][j + p] != undefined) {
					const clName = Object.keys(usergridOptions.groups[groupKey][j + p]);
					const name = contentGrid[clName].name;
					const info = contentGrid[clName].info ? contentGrid[clName].info.replaceAll("<br>", " ") : "";
					const cellA = KadTable.addCell(row, {
						names: ["disableUsergridSingle", "CB", clName],
						type: "Vin",
						subGroup: "checkbox",
						idNoChild: true,
						title: info,
						cellStyle: {
							textAlign: "center",
						},
						createClass: [`clCb_disableUsergridSingle_${groupKey}`],
						checked: usergridOptions.groups[groupKey][j + p],
						onclick: () => {
							usergridCheckGroup(groupKey);
						},
					});
					KadTable.addCell(row, {
						names: ["disableUsergridSingle", groupKey, j + p],
						type: "Lbl",
						text: name,
						title: info,
						ui: {
							for: cellA.childNodes[0].id,
						},
					});
				}
			}
		}
	}
}

function saveUsergridLayout() {
	dbID("idBtn_child_gridtitle_dbUL_cl_UserGridLayout").click();
}
