import { contentGrid, contentLayout, createGridLayout } from "../General/Layout.js";
import { contentGroupsMaincontent, contentGroupsNav } from "../General/MainContent.js";
import { dbID, initEL, KadColor, KadInteraction, KadTable } from "../KadUtils/KadUtils.js";
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
  enableGroupList: [],
  enabledList: [],
  columnCount: 3,
  usedGrid: "User",
  groupColors: {},
};

// initEL({ id: idBtn_userGridToggleAll, fn: userGridToggleAll });
initEL({ id: idBtn_userGridSaveLayout, fn: saveUsergridLayout });
initEL({ id: idSel_userGridSelect, fn: userGridSelectGroup, selStartValue: userGridOptions.usedGrid });

export function clear_cl_UserGridLayout() {
  KadInteraction.removeContextmenu(idCanv_userGrid);
  userGridOptions.groups = {};
  userGridOptions.enableGroupList = [...contentGroupsMaincontent];
  userGridOptions.enabledList = [...contentLayout.navContent.Universe];

  for (let groupKey of contentGroupsMaincontent) {
    userGridOptions.groups[groupKey] = contentLayout.navContent[groupKey];
  }
  idSel_userGridSelect.KadReset({ selList: contentGroupsNav.map((item) => [item, item]) });

  //separate because IDs not ready before
  for (let i = 0; i < contentGroupsMaincontent.length; i++) {
    const groupKey = contentGroupsMaincontent[i];
    const col = globalColors.colorOptions[(5 + i) % globalColors.colorOptions.length];
    userGridOptions.groupColors[groupKey] = [col, KadColor.stateAsArray({ colorArray: col, type: "HSL" })];
  }
  userGridRedraw();
}

export const storage_cl_UserGridLayout = {
  dbName: "UserGridLayout",
  contentName: "cl_UserGridLayout",
  clear() {
    this.data = [];
  },
  getData() {
    return userGridOptions.enabledList;
  },
  saveData(data) {
    userGridOptions.enabledList = [...data];
    contentLayout.navContent.User = [...data];
  },
  activateData() {
    for (let group of Object.keys(userGridOptions.groups)) {
      userGridCheckGroup(null, group);
    }
    userGridRedraw();
  },
};

function userGridUpdateSingle(data) {
  const indexData = userGridOptions.enabledList.indexOf(data);
  if (indexData == -1) {
    userGridOptions.enabledList.push(data);
  } else {
    userGridOptions.enabledList.splice(indexData, 1);
  }
  userGridCheckGroup(data);
  userGridRedraw();
}

function userGridCheckGroup(data, savedGroup = null) {
  const group = savedGroup == null ? contentGrid[data].contentGroup : savedGroup;
  let isEmpty = true;
  for (let item of contentLayout.navContent[group]) {
    if (userGridOptions.enabledList.includes(item)) {
      isEmpty = false;
      break;
    }
  }
  const index = userGridOptions.enableGroupList.indexOf(group);
  if (!isEmpty && index == -1) {
    userGridOptions.enableGroupList.push(group);
  } else if (isEmpty && index > -1) {
    userGridOptions.enableGroupList.splice(index, 1);
  }
}

function userGridUpdateGroup(group) {
  userGridOptions.enabledList = userGridOptions.enabledList.filter((item) => !userGridOptions.groups[group].includes(item));
  const index = userGridOptions.enableGroupList.indexOf(group);
  if (index == -1) {
    userGridOptions.enableGroupList.push(group);
    userGridOptions.enabledList.push(...userGridOptions.groups[group]);
  } else {
    userGridOptions.enableGroupList.splice(index, 1);
  }
  userGridRedraw();
}

// function userGridToggleAll() { }

function userGridRedraw() {
  userGridCreateTable();
  userGridCreateCells();
}

function userGridCreateTable() {
  let header = {};
  let headerRowOffset = 0;

  const dataArrayColumns = new Array(userGridOptions.columnCount * 2).fill(null).map(() => []);
  for (const [group, arr] of Object.entries(userGridOptions.groups)) {
    header[headerRowOffset] = [
      { type: "Checkbox", data: userGridOptions.enableGroupList.includes(group), colSpan: userGridOptions.columnCount - 1, settings: { noBorder: "right", align: "right", names: ["userGridGroup", group], onclick: [userGridUpdateGroup, group] } },
      { data: group, colSpan: userGridOptions.columnCount + 1, settings: { for: `userGridGroup_${group}` } },
    ];

    const arrCount = Math.ceil(arr.length / userGridOptions.columnCount);
    headerRowOffset += arrCount + 1;

    for (let i = 0; i < arrCount * userGridOptions.columnCount; i++) {
      if (arr[i] != undefined) {
        dataArrayColumns[(i % userGridOptions.columnCount) * 2].push(userGridOptions.enabledList.includes(arr[i]));
        dataArrayColumns[(i % userGridOptions.columnCount) * 2 + 1].push(arr[i]);
      } else {
        dataArrayColumns[(i % userGridOptions.columnCount) * 2].push(null);
        dataArrayColumns[(i % userGridOptions.columnCount) * 2 + 1].push(null);
      }
    }
  }

  const body = [];
  for (let i = 0; i < userGridOptions.columnCount; i++) {
    body.push({ type: "Checkbox", data: dataArrayColumns[i * 2], settings: { noBorder: "right", onclick: [userGridUpdateSingle, dataArrayColumns[i * 2 + 1]], names: ["userGrid", dataArrayColumns[i * 2 + 1]] } });
    body.push({
      data: dataArrayColumns[i * 2 + 1].map((item) => {
        if (item) return contentGrid[item].name;
      }),
      settings: { for: ["userGrid", dataArrayColumns[i * 2 + 1]] },
    });
  }

  KadTable.createHTMLGrid({ id: idTab_disableUserGridTable, header, body });
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
    c.clear();
    for (let cell of userGridOptions.canvasCells) {
      cell.show();
    }
  };
}, "#idCanv_userGrid");

export function userGridCreateCells() {
  let list = [];
  if (userGridOptions.usedGrid == "User") {
    list = userGridOptions.enabledList;
  }
  if (list.length == 0) return;
  const { grid2DArray, gridData } = createGridLayout(userGridOptions.usedGrid, list);

  userGridOptions.canvasCells = [];
  const x = Math.floor(userGridOptions.canvas.w / grid2DArray[0].length);
  const cellSize = [x, userGridOptions.cellHeight];
  userGridOptions.height = cellSize[1] * grid2DArray.length + userGridOptions.cellHeight / 2;
  canvas_cl_UserGridLayout(); //resize Canvas

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

//-------------
/*

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

*/
