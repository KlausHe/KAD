const usergridOptions = {
	enableAll: false,
	checkAllGroups: () => {
		//usergridCheckGroup
		for (const [groupKey, state] of Object.entries(usergridOptions.groups)) {
			let counter = 0;
			const cbEnabled = KadUtils.dbCL(`clCb_disableUsergridSingle_${groupKey}`, null);
			for (let i = 0; i < cbEnabled.length; i++) {
				if (cbEnabled[i].checked) {
					counter++;
				}
			}
			if (counter == 0) {
				KadUtils.dbID(`idBtn_child_disableUsergridGroup_${groupKey}`).firstChild.src = KadUtils.DOM.getImgPath("cCheck");
				usergridOptions.groups[groupKey] = false;
			} else {
				KadUtils.dbID(`idBtn_child_disableUsergridGroup_${groupKey}`).firstChild.src = KadUtils.DOM.getImgPath("cX");
				usergridOptions.groups[groupKey] = true;
			}
		}
	},
	groups: {},
	updateAllSingles: (groupKey) => {
		//change the "checked" value in the DOM element, nothing else!
		const singleList = KadUtils.dbCL(`clCb_disableUsergridSingle_${groupKey}`, null);
		for (let i = 0; i < singleList.length; i++) {
			singleList[i].checked = usergridOptions.groups[groupKey];
		}
	},
	toggleAllGridDisable: () => {
		//general enabling/disabling of all groups and therefor singles
		usergridOptions.enableAll = !usergridOptions.enableAll;
		for (const groupKey in usergridOptions.groups) {
			usergridOptions.groups[groupKey] = usergridOptions.enableAll;
			usergridToggleGroup(groupKey);
		}
	},
	generateArray: () => {
		for (const key of contentLayout.navContent.Universe) {
			contentGrid[key].userSelected = KadUtils.dbID(`idVin_child_disableUsergridSingle_CB_${key}`).checked;
		}
		return Object.keys(contentGrid).filter((key) => {
			return contentGrid[key].userSelected === true && contentLayout.navContent.Universe.includes(key);
		});
	},
};

function clear_cl_UserGridLayout() {
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
	KadUtils.Table.clear("idTabBody_DisableUserGrid");
	for (const groupKey in usergridOptions.groups) {
		//create Headers
		const rowTh = KadUtils.Table.insertRow("idTabBody_DisableUserGrid");
		rowTh.id = `idTabBody_DisableUserGrid_Group${groupKey}`;

		KadUtils.Table.addHeaderCell(rowTh, {
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

		KadUtils.Table.addHeaderCell(rowTh, {
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
			const row = KadUtils.Table.insertRow("idTabBody_DisableUserGrid");
			// Checkbox
			const cellA = KadUtils.Table.addCell(row, {
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
			//userImage
			let uImage = null;
			if (contentGrid[objName].hasOwnProperty("userStoreDBName")) {
				uImage = KadUtils.Table.addCell(row, {
					names: ["disableUsergridSingle", groupKey, j],
					type: "Img",
					subGroup: "subgrid",
					img: "upload",
					onclick: () => {
						usergridToggleSingle(objName);
					},
				});
			}
			// LBL for
			KadUtils.Table.addCell(
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

			//create the second column
			if (contentLayout.navContent[groupKey][j + 1] !== undefined) {
				++j;
				objName = contentLayout.navContent[groupKey][j];

				// Checkbox
				const cellB = KadUtils.Table.addCell(row, {
					names: ["disableUsergridSingle", "CB", objName],
					type: "Vin",
					subGroup: "checkbox",
					style: {
						textAlign: "center",
					},
					createClass: [`clCb_disableUsergridSingle_${groupKey}`],
					checked: contentGrid[objName].userSelected,
					onclick: () => {
						usergridToggleSingle(objName);
					},
				});
				//userImage
				let uImage;
				if (contentGrid[objName].hasOwnProperty("userStoreDBName")) {
					uImage = KadUtils.Table.addCell(row, {
						names: ["disableUsergridSingle", groupKey, j],
						type: "Img",
						subGroup: "subgrid",
						img: "upload",
						onclick: () => {
							usergridToggleSingle(objName);
						},
					});
				}
				// LBL for
				KadUtils.Table.addCell(
					row,
					{
						names: ["disableUsergridSingle", groupKey, j],
						type: "Lbl",
						for: cellB.childNodes[0].id,
						text: contentGrid[objName].name,
						style: {
							textAlign: "left",
						},
					},
					contentGrid[objName].hasOwnProperty("userStoreDBName") ? uImage : null
				);
			}
		}
	}
}

function saveUsergridLayout() {
	KadUtils.dbID("idBtn_child_gridtitle_dbUpload_cl_UserGridLayout").click();
}

/*
let canvasUGridwidth = 400;
let canvasUGridheight = 700;
let rowsUGrid;
let colsUGrid;
let demoCells = [];
let indexCellUGrid = null;
let mouseIsDraggedUGrid = false;
let allGridEnabled = false;

function clear_cl_UserGrid() {
  caUG.background(KadUtils.CSS.getRoot("bgcNavbar"));
};

const caUG = new p5((c) => {
  c.setup = function() {
    c.canv_UGird = c.createCanvas(canvasUGridwidth, canvasUGridheight);
    c.canv_UGird.id("CanvasUserGrid")
    c.canv_UGird.parent('#idCanv_userGrid');
    c.canv_UGird.mouseMoved(mouseMovedUGrid);
    c.canv_UGird.mousePressed(mousePressedUGrid);
    c.canv_UGird.mouseReleased(mouseReleasedUGrid);
    c.canv_UGird.doubleClicked(mouseDoubleUGrid); // attach
    c.noLoop();
  };

  c.draw = function() {
    c.background(KadUtils.CSS.getRoot("bgcNavbar"));
    for (i = 0; i < demoCells.length; i++) {
      demoCells[i].show();
    };
  };
}, '#idCanv_userGrid');

function createBlockArray() {
  layoutCreateGridLayout(nuncDiscipuli.accountInfos.shortName);
  demoCells = [];
  rowsUGrid = KadUtils.CSS.getRoot("gridRowLength", true);
  colsUGrid = KadUtils.CSS.getRoot("gridColLength", true);
  let tileWidth = canvasUGridwidth / (rowsUGrid - 1);
  let tileHeight = canvasUGridheight / (colsUGrid + 1);

  // for (let name of contentLayout[nuncDiscipuli.accountInfos.shortName]) {
  //   let colStart = contentGrid[name].startPos % rowsUGrid;
  //   let rowStart = Math.floor(contentGrid[name].startPos / rowsUGrid);
  //   demoCells.push(new UGridCell(name, colStart, rowStart, contentGrid[name].width, contentGrid[name].height, tileWidth, tileHeight));
  // }
  // caUG.redraw();
};

function mouseDoubleUGrid() {
  let vMouse = caUG.createVector(caUG.mouseX, caUG.mouseY);
  for (let i = 0; i < demoCells.length; i++) {
    if (demoCells[i].contains(vMouse)) {
      demoCells[i].free = !demoCells[i].free;
      caUG.redraw();
      break;
    };
  };
};

function mousePressedUGrid() {
  mouseIsDraggedUGrid = true;
  let vMouse = caUG.createVector(caUG.mouseX, caUG.mouseY);
  for (let i = demoCells.length - 1; i >= 0; i--) {
    if (demoCells[i].contains(vMouse) && demoCells[i].free) {
      indexCellUGrid = i;
      demoCells[i].selected = true;
      demoCells[i].offset.set(p5.Vector.sub(demoCells[i].posCanvas, vMouse));
      demoCells[i].posCenter.set(vMouse);
      break;
    };
  };
  caUG.redraw();
};

function mouseReleasedUGrid() {
  demoCells[indexCellUGrid].selected = false;
  mouseIsDraggedUGrid = false;
  demoCells[indexCellUGrid].snap();
  demoCells.push(demoCells.splice(indexCellUGrid, 1)[0]); //place Cell at the end of the createBlockArray
  caUG.redraw();
};

function mouseMovedUGrid() {
  if (mouseIsDraggedUGrid && demoCells[indexCellUGrid].free) {
    let vMouse = caUG.createVector(caUG.mouseX, caUG.mouseY);
    demoCells[indexCellUGrid].posCanvas.set(p5.Vector.add(vMouse, demoCells[indexCellUGrid].offset));
    caUG.redraw();
    // Wow, what a function!
  };
};

class UGridCell {
  constructor(name, i, j, w, h, tileWidth, tileHeight) {
    this.id = name;
    this.name = contentGrid[name].name;
    this.space = 5;
    this.selected = false;
    this.free = true;
    this.posGrid = caUG.createVector(i, j);
    this.offset = caUG.createVector(0, 0);
    this.tileDim = caUG.createVector(tileWidth, tileHeight); //tileWidth / tileHeight
    this.tileWH = caUG.createVector(w, h); // w / h
    this.tileSize = caUG.createVector(w * tileWidth, h * tileHeight); //width / height
    this.posCanvas = caUG.createVector(i * tileWidth, j * tileHeight); //x / y
    this.posCenter = p5.Vector.add(this.posCanvas, p5.Vector.div(this.tileSize, 2));
  };

  snap() {
    this.posGrid.x = caUG.constrain(Math.floor((this.posCanvas.x / this.tileDim.x) + 0.5), 0, rowsUGrid - (this.tileWH.x + 1));
    this.posGrid.y = caUG.constrain(Math.floor((this.posCanvas.y / this.tileDim.y) + 0.5), 0, colsUGrid - (this.tileWH.y - 1));
    this.posCanvas.x = this.posGrid.x * this.tileDim.x;
    this.posCanvas.y = this.posGrid.y * this.tileDim.y;
  };

  contains(mouse) {
    return !(mouse.x < this.posCanvas.x || mouse.x > this.posCanvas.x + this.tileSize.x || mouse.y < this.posCanvas.y || mouse.y > this.posCanvas.y + this.tileSize.y);
  };

  show() {
    let bgcColor = this.free ? this.selected ? KadUtils.CSS.getRoot("bgcSubgrid") : KadUtils.CSS.getRoot("bgcNavbar") : KadUtils.CSS.getRoot("bgcBackground");
    let textColor = this.free ? this.selected ? KadUtils.CSS.getRoot("textColorSubgrid") : KadUtils.CSS.getRoot("textColorNavbar") : KadUtils.CSS.getRoot("textColorBackground");

    this.posCenter = p5.Vector.add(this.posCanvas, p5.Vector.div(this.tileSize, 2));

    caUG.push();
    caUG.translate(this.posCenter);
    //RECTANGLE
    caUG.fill(bgcColor);
    caUG.stroke(textColor);
    caUG.strokeWeight(2);
    caUG.rectMode(caUG.CENTER);
    caUG.rect(0, 0, this.tileSize.x - this.space, this.tileSize.y - this.space);
    //TEXT
    caUG.fill(textColor);
    caUG.noStroke();
    caUG.textAlign(caUG.CENTER, caUG.CENTER);
    caUG.text(this.name, 0, 0);
    caUG.pop();
    caUG.stroke(0, 0, 255);
    caUG.strokeWeight(8);
  };
};
*/
