import { contentGroupsMaincontent } from "../General/MainContent.js";
import { dbID, dbCL, KadDOM, KadTable, initEL, KadArray, hostDebug, KadInteraction } from "../KadUtils/KadUtils.js";
import { contentGrid, contentLayout, createGridLayout } from "../General/Layout.js";
import { globalColors } from "./Color.js";
import { globalValues } from "./General.js";

const usergridOptions = {
	get canvas() {
		return { w: globalValues.mediaSizes.canvasSize.w, h: globalValues.mediaSizes.canvasSize.h * 2 };
	},
	canvasCells: [],
	columns: 3,
	enableAll: true,
	groups: {},
	enableGroups: {},
	usedGrid: hostDebug() ? "Utility" : "User",
};

initEL({ id: idBtn_userGridToggleAll, fn: userGridToggleAll });
initEL({ id: idBtn_userGridSaveLayout, fn: saveUsergridLayout });

export function clear_cl_UserGridLayout() {
	KadInteraction.removeContextmenu(idCanv_userGrid);
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
	createBlockArray();
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
		contentLayout.navContent.User = [...data];
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
	caUG.redraw();
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
		const rowTh = KadTable.createRow("idTabBody_DisableUserGrid");
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
			const row = KadTable.createRow("idTabBody_DisableUserGrid");
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

export function canvas_cl_UserGridLayout() {
	caUG.resizeCanvas(usergridOptions.canvas.w, usergridOptions.canvas.h);
	caUG.redraw();
}
// w/h = 400 , 700

const caUG = new p5((c) => {
	c.setup = function () {
		c.canv_UGird = c.createCanvas(usergridOptions.canvas.w, usergridOptions.canvas.h);
		c.canv_UGird.id("CanvasUserGrid");
		c.canv_UGird.parent("#idCanv_userGrid");
		c.colorMode(c.HSL);
		c.noLoop();
		// c.background(globalColors.elements.bgcColor);
		// c.canv_UGird.mouseMoved(mouseMovedUGrid);
		// c.canv_UGird.mousePressed(mousePressedUGrid);
		// c.canv_UGird.mouseReleased(mouseReleasedUGrid);
		// c.canv_UGird.doubleClicked(mouseDoubleUGrid); // attach
	};

	c.draw = function () {
		c.background("lightblue");

		c.line(usergridOptions.canvas.w);
		for (let cell of usergridOptions.canvasCells) {
			cell.show();
		}
	};
}, "#idCanv_userGrid");

function createBlockArray() {
	if (contentLayout.navContent[usergridOptions.usedGrid].length === 0) return;
	usergridOptions.canvasCells = [];
	const gridCols = contentLayout.navContent[usergridOptions.usedGrid].length; //getCssRoot("gridColLength", true);
	const { rowLength, gridArray } = createGridLayout("Universe"); //usergridOptions.usedGrid
	const cellSize = [Math.floor(usergridOptions.canvas.w / rowLength), 50]; // Math.floor(usergridOptions.canvas.h / usergridOptions.canvasCols)
	let existingNames = [];
	for (let n = 0; n < gridArray.length; n++) {
		const name = gridArray[n];
		if (name == undefined) continue;
		if (!existingNames.includes(name)) {
			const { i, j } = KadArray.indexTo2DxyPosition(n, rowLength);
			usergridOptions.canvasCells.push(new UGridCell(name, j, i, cellSize[0], cellSize[1]));
			existingNames.push(name);
		}
	}
	caUG.redraw();
}

class UGridCell {
	constructor(name, px, py, cellW, cellH) {
		this.name = contentGrid[name].name;
		this.size = [contentGrid[name].size[0] * cellW, cellH * contentGrid[name].size[1]];
		this.pos = [px * cellW, py * cellH];
	}
	margin = 5;

	show() {
		let bgcColor = "red"; // globalColors.elements.baseColor; // this.free ? (this.selected ? getCssRoot("bgcSubgrid") : getCssRoot("bgcNavbar")) : getCssRoot("bgcBackground");
		let textColor = globalColors.elements.text; // this.free ? (this.selected ? getCssRoot("textColorSubgrid") : getCssRoot("textColorNavbar")) : getCssRoot("textColorBackground");
		caUG.push();
		caUG.translate(this.pos[0] + this.margin, this.pos[1] + this.margin);
		//RECTANGLE
		// caUG.noFill();
		caUG.fill(bgcColor);
		caUG.stroke(textColor);
		caUG.strokeWeight(2);
		caUG.rect(0, 0, this.size[0] - 2 * this.margin, this.size[1] - 2 * this.margin);
		//TEXT
		caUG.fill(textColor);
		caUG.noStroke();
		// caUG.textAlign(caUG.CENTER, caUG.CENTER);
		caUG.textAlign(caUG.CENTER, caUG.CENTER);
		caUG.text(this.name, this.size[0] / 2, this.size[1] / 2);
		caUG.stroke(0, 0, 255);
		caUG.strokeWeight(8);
		caUG.pop();
	}

	// snap() {
	//   this.posGrid.x = caUG.constrain(Math.floor((this.posCanvas.x / this.tileDim.x) + 0.5), 0, usergridOptions.canvasRows - (this.tileWH.x + 1));
	//   this.posGrid.y = caUG.constrain(Math.floor((this.posCanvas.y / this.tileDim.y) + 0.5), 0, usergridOptions.canvasCols - (this.tileWH.y - 1));
	//   this.posCanvas.x = this.posGrid.x * this.tileDim.x;
	//   this.posCanvas.y = this.posGrid.y * this.tileDim.y;
	// };

	// contains(mouse) {
	//   return (mouse.x > this.posCanvas.x && mouse.x < this.posCanvas.x + this.tileSize.x && mouse.y > this.posCanvas.y && mouse.y < this.posCanvas.y + this.tileSize.y);
	// };
}
/*
function mouseDoubleUGrid() {
  let vMouse = caUG.createVector(caUG.mouseX, caUG.mouseY);
  for (let i = 0; i < usergridOptions.canvasCells.length; i++) {
    if (usergridOptions.canvasCells[i].contains(vMouse)) {
      usergridOptions.canvasCells[i].free = !usergridOptions.canvasCells[i].free;
      caUG.redraw();
      break;
    };
  };
};

function mousePressedUGrid() {
  usergridOptions.canvasMousePressed = true;
  let vMouse = caUG.createVector(caUG.mouseX, caUG.mouseY);
  for (let i = usergridOptions.canvasCells.length - 1; i >= 0; i--) {
    if (usergridOptions.canvasCells[i].contains(vMouse) && usergridOptions.canvasCells[i].free) {
      usergridOptions.canvasSelCell = i;
      usergridOptions.canvasCells[i].selected = true;
      usergridOptions.canvasCells[i].offset.set(p5.Vector.sub(usergridOptions.canvasCells[i].posCanvas, vMouse));
      usergridOptions.canvasCells[i].posCenter.set(vMouse);
      break;
    };
  };
  caUG.redraw();
};

function mouseReleasedUGrid() {
  usergridOptions.canvasCells[usergridOptions.canvasSelCell].selected = false;
  usergridOptions.canvasMousePressed = false;
  usergridOptions.canvasCells[usergridOptions.canvasSelCell].snap();
  usergridOptions.canvasCells.push(usergridOptions.canvasCells.splice(usergridOptions.canvasSelCell, 1)[0]); //place Cell at the end of the createBlockArray
  caUG.redraw();
};

function mouseMovedUGrid() {
  if (usergridOptions.canvasMousePressed && usergridOptions.canvasCells[usergridOptions.canvasSelCell].free) {
    let vMouse = caUG.createVector(caUG.mouseX, caUG.mouseY);
    usergridOptions.canvasCells[usergridOptions.canvasSelCell].posCanvas.set(p5.Vector.add(vMouse, usergridOptions.canvasCells[usergridOptions.canvasSelCell].offset));
    caUG.redraw();
    // Wow, what a function!
  };
};

*/
