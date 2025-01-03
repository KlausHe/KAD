import { contentGrid, contentLayout, createGridLayout } from "../General/Layout.js";
import { contentGroupsMaincontent, contentGroupsNav } from "../General/MainContent.js";
import { dbCL, dbID, initEL, KadColor, KadDOM, KadInteraction, KadTable } from "../KadUtils/KadUtils.js";
import { globalColors } from "./Color.js";
import { globalValues } from "./General.js";

const userGridOptions = {
  get canvas() {
    return { w: globalValues.mediaSizes.canvasSize.w, h: this.height };
  },
  height: 100,
  cellHeight: 40,
  canvasCells: [],
  columns: 3,
  enableAll: true,
  groups: {},
  enableGroups: {},
  enabledList: [],
  usedGrid: "Universe",
  groupColors: {},
};

initEL({ id: idBtn_userGridToggleAll, fn: userGridToggleAll });
initEL({ id: idBtn_userGridSaveLayout, fn: saveUsergridLayout });
initEL({ id: idSel_userGridSelect, fn: userGridSelectGroup });

export function clear_cl_UserGridLayout() {
  KadInteraction.removeContextmenu(idCanv_userGrid);
  userGridOptions.groups = {};
  userGridOptions.enableGroups = {};

  for (let groupKey of contentGroupsMaincontent) {
    userGridOptions.groups[groupKey] = contentLayout.navContent[groupKey].map((entry, index) => ({ [entry]: index % 3 == 0 ? true : false }));
    userGridOptions.enableGroups[groupKey] = false;
  }
  userGridCreateTable();
  idSel_userGridSelect.KadReset({ selList: contentGroupsNav.map((item) => [item, item]) });

  //separate because IDs not ready before
  for (let i = 0; i < contentGroupsMaincontent.length; i++) {
    const groupKey = contentGroupsMaincontent[i];
    const col = globalColors.colorOptions[(5 + i) % globalColors.colorOptions.length];
    userGridOptions.groupColors[groupKey] = [col, KadColor.stateAsArray({ colorArray: col, type: "HSL" })];
    userGridCheckGroup(groupKey);
  }
  userGridCreateCells();
}

export const storage_cl_UserGridLayout = {
  dbName: "UserGridLayout",
  contentName: "cl_UserGridLayout",
  clear() {
    this.data = [];
  },
  get data() {
    return userGridOptions.enabledList;
  },
  set data(data) {
    userGridOptions.enabledList = [...data];
    contentLayout.navContent.User = [...data];
  },
};

function userGridToggleAll() {
  userGridOptions.enableAll = !userGridOptions.enableAll;
  for (const groupKey in userGridOptions.groups) {
    userGridOptions.groups[groupKey].forEach((obj) => {
      dbID(`idVin_disableUsergridSingle_CB_${Object.keys(obj)}`).checked = userGridOptions.enableAll;
    });
    userGridCheckGroup(groupKey);
    userGridUpdateGroup(groupKey);
  }
}

function userGridCheckGroup(groupKey) {
  let somethingChecked = 0;
  const cbEnabled = dbCL(`clCb_disableUsergridSingle_${groupKey}`, null);
  for (let i = 0; i < cbEnabled.length; i++) {
    if (cbEnabled[i].checked) somethingChecked++;
  }
  const state = somethingChecked === cbEnabled.length ? false : true;
  dbID(`idBtn_child_disableUsergridGroup_${groupKey}`).firstChild.src = KadDOM.getImgPath(state ? "cCheck" : "cX");
  userGridOptions.enableGroups[groupKey] = state;
  caUG.redraw();
}

function userGridToggleGroup(groupKey) {
  userGridOptions.enableGroups[groupKey] = !userGridOptions.enableGroups[groupKey];
  userGridUpdateGroup(groupKey);
  userGridCheckGroup(groupKey);
}

function userGridUpdateGroup(groupKey) {
  const singleList = dbCL(`clCb_disableUsergridSingle_${groupKey}`, null);
  for (let i = 0; i < singleList.length; i++) {
    singleList[i].checked = !userGridOptions.enableGroups[groupKey];
  }
}

function userGridCreateTable() {
  const header = null;
  const body = null;

  KadTable.createHTMLGrid({ id: idTab_disableUserGridTable, header, body });

  KadTable.clear("idTabBody_DisableUserGrid");
  for (const groupKey in userGridOptions.groups) {
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
        userGridToggleGroup(groupKey);
      },
    });
    KadTable.addHeaderCell(rowTh, {
      names: ["disableUsergridGroup", groupKey],
      type: "Lbl",
      text: groupKey,
      colSpan: userGridOptions.columns * 2 - 1,
      cellStyle: {
        textAlign: "left",
      },
      cellOnclick: () => {
        userGridToggleGroup(groupKey);
      },
    });
    for (let j = 0; j < userGridOptions.groups[groupKey].length; j += userGridOptions.columns) {
      const row = KadTable.createRow("idTabBody_DisableUserGrid");
      for (let p = 0; p < userGridOptions.columns; p++) {
        if (userGridOptions.groups[groupKey][j + p] != undefined) {
          const clName = Object.keys(userGridOptions.groups[groupKey][j + p]);
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
            checked: userGridOptions.groups[groupKey][j + p],
            onclick: () => {
              userGridCheckGroup(groupKey);
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

function userGridSelectGroup() {
  userGridOptions.usedGrid = idSel_userGridSelect.KadGet();
  userGridCreateCells();
}

export function canvas_cl_UserGridLayout() {
  caUG.resizeCanvas(userGridOptions.canvas.w, userGridOptions.canvas.h);
  caUG.redraw();
}

const caUG = new p5((c) => {
  c.setup = function () {
    c.canv_UGird = c.createCanvas(userGridOptions.canvas.w, userGridOptions.canvas.h);
    c.canv_UGird.id("CanvasUserGrid");
    c.canv_UGird.parent("#idCanv_userGrid");
    c.colorMode(c.HSL);
    c.noLoop();
    // c.canv_UGird.mouseMoved(mouseMovedUGrid);
    // c.canv_UGird.mousePressed(mousePressedUGrid);
    // c.canv_UGird.mouseReleased(mouseReleasedUGrid);
    // c.canv_UGird.doubleClicked(mouseDoubleUGrid); // attach
  };

  c.draw = function () {
    c.background("lightblue");
    for (let cell of userGridOptions.canvasCells) {
      cell.show();
    }
  };
}, "#idCanv_userGrid");

export function userGridCreateCells() {
  let list = null;
  if (userGridOptions.usedGrid == "User") {
    list = ["cl_Analysis", "cl_Barvoslepy", "cl_Piny", "cl_Blechgeometrie", "cl_Expansion", "cl_Expansion"];
  }
  const { grid2DArray, gridData } = createGridLayout(userGridOptions.usedGrid, list);

  if (gridData.length == 0) return;
  userGridOptions.canvasCells = [];
  const x = Math.floor(userGridOptions.canvas.w / grid2DArray[0].length);
  const cellSize = [x, userGridOptions.cellHeight];
  userGridOptions.height = cellSize[1] * grid2DArray.length + userGridOptions.cellHeight / 2;
  canvas_cl_UserGridLayout(); //resize sCanvas

  for (let item of gridData) {
    const gridObj = contentGrid[item.name];
    userGridOptions.canvasCells.push(new UGridCell(item, gridObj, cellSize));
  }

  caUG.redraw();
}

class UGridCell {
  margin = 5;
  constructor(item, gridObj, cellSize) {
    this.name = gridObj.name;
    this.group = gridObj.contentGroup;
    this.size = [item.contWidth * cellSize[0], item.contHeight * cellSize[1]];
    this.pos = [item.column * cellSize[0], item.row * cellSize[1]];
    this.backgroundColor = userGridOptions.groupColors[this.group][0];
    this.textColor = userGridOptions.groupColors[this.group][1];
  }

  show() {
    caUG.push();
    caUG.translate(this.pos[0], this.pos[1]);
    //RECTANGLE
    // caUG.noFill();
    caUG.fill(this.backgroundColor);
    caUG.stroke(this.textColor);
    caUG.strokeWeight(2);
    caUG.rect(this.margin, this.margin, this.size[0] - 2 * this.margin, this.size[1] - 2 * this.margin);
    //TEXT
    caUG.fill(this.textColor);
    caUG.noStroke();
    caUG.textAlign(caUG.CENTER, caUG.BOTTOM);
    caUG.text(this.name, this.size[0] / 2, this.size[1] / 2);
    caUG.textAlign(caUG.CENTER, caUG.TOP);
    caUG.text(`(${this.group})`, this.size[0] / 2, this.size[1] / 2);
    // caUG.stroke(0, 0, 255);
    // caUG.strokeWeight(8);
    caUG.pop();
  }

  // snap() {
  //   this.posGrid.x = caUG.constrain(Math.floor((this.posCanvas.x / this.tileDim.x) + 0.5), 0, userGridOptions.canvasRows - (this.tileWH.x + 1));
  //   this.posGrid.y = caUG.constrain(Math.floor((this.posCanvas.y / this.tileDim.y) + 0.5), 0, userGridOptions.canvasCols - (this.tileWH.y - 1));
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
  for (let i = 0; i < userGridOptions.canvasCells.length; i++) {
    if (userGridOptions.canvasCells[i].contains(vMouse)) {
      userGridOptions.canvasCells[i].free = !userGridOptions.canvasCells[i].free;
      caUG.redraw();
      break;
    };
  };
};

function mousePressedUGrid() {
  userGridOptions.canvasMousePressed = true;
  let vMouse = caUG.createVector(caUG.mouseX, caUG.mouseY);
  for (let i = userGridOptions.canvasCells.length - 1; i >= 0; i--) {
    if (userGridOptions.canvasCells[i].contains(vMouse) && userGridOptions.canvasCells[i].free) {
      userGridOptions.canvasSelCell = i;
      userGridOptions.canvasCells[i].selected = true;
      userGridOptions.canvasCells[i].offset.set(p5.Vector.sub(userGridOptions.canvasCells[i].posCanvas, vMouse));
      userGridOptions.canvasCells[i].posCenter.set(vMouse);
      break;
    };
  };
  caUG.redraw();
};

function mouseReleasedUGrid() {
  userGridOptions.canvasCells[userGridOptions.canvasSelCell].selected = false;
  userGridOptions.canvasMousePressed = false;
  userGridOptions.canvasCells[userGridOptions.canvasSelCell].snap();
  userGridOptions.canvasCells.push(userGridOptions.canvasCells.splice(userGridOptions.canvasSelCell, 1)[0]); //place Cell at the end of the createCell
  caUG.redraw();
};

function mouseMovedUGrid() {
  if (userGridOptions.canvasMousePressed && userGridOptions.canvasCells[userGridOptions.canvasSelCell].free) {
    let vMouse = caUG.createVector(caUG.mouseX, caUG.mouseY);
    userGridOptions.canvasCells[userGridOptions.canvasSelCell].posCanvas.set(p5.Vector.add(vMouse, userGridOptions.canvasCells[userGridOptions.canvasSelCell].offset));
    caUG.redraw();
    // Wow, what a function!
  };
};

*/
