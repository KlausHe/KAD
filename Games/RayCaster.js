import { globalColors } from "../Settings/Color.js";
import { dbID, daEL, deepClone, KadDOM, KadInteraction, initEL, log } from "../KadUtils/KadUtils.js";
import { globalValues } from "../Settings/General.js";
import { timeoutCanvasFinished } from "../Main.js";

const raycasterOptions = {
	get canvas() {
		return { w: globalValues.mediaSizes.canvasSize.w, h: globalValues.mediaSizes.canvasSize.h };
	},
	height: 400,
	boardSize: 16,
	boardSizeOrig: 16,
	cols: 1,
	rows: 1,
	cellwidth: 1,
	cells: [],
	stack: [],
	currCell: 0,
	currDist: 0,
	longDist: 0,
	longCell: null,
	modes: {
		maze: false,
		mazeOrig: true,
		target: false,
		targetOrig: true,
		poly: false,
		polyOrig: false,
		spider: false,
		spiderOrig: false,
	},
	speed: 1,
	speedOrig: 3,
	fovD: 1,
	fovDOrig: 8, // this.boardSizeOrig
	segments: [],
	polygons: [],
	rayStart: [],
	borders: [],
};

initEL({ id: idBtn_generateRayMaze, fn: newRayMaze });

initEL({ id: idVin_rayMazeSize, fn: raySizeChange, resetValue: raycasterOptions.boardSizeOrig });
initEL({ id: idVin_rayMazeSpeed, fn: raySpeedChange, resetValue: raycasterOptions.speedOrig });
initEL({ id: idVin_rayMazeView, fn: rayViewChange, resetValue: raycasterOptions.fovDOrig });
initEL({ id: idCb_rayDebug, fn: rayDebugChange, resetValue: raycasterOptions.modes.mazeOrig });
initEL({ id: idCb_rayTarget, fn: rayTargetChange, resetValue: raycasterOptions.modes.targetOrig });
initEL({ id: idCb_rayPoly, fn: rayPolyChange, resetValue: raycasterOptions.modes.polyOrig });
initEL({ id: idCb_raySpider, fn: raySpiderChange, resetValue: raycasterOptions.modes.spiderOrig });

initEL({ id: idCanv_rayCaster, action: "keydown", fn: keyPushedRayCaster });
initEL({ id: idCanv_rayCaster, action: "keyup", fn: keyPushedRayCaster });

export function clear_cl_RayCaster() {
	const boardWidth = raycasterOptions.canvas.w;
	raycasterOptions.cellwidth = Math.floor(boardWidth / raycasterOptions.boardSize);
	raycasterOptions.cols = Math.floor(boardWidth / raycasterOptions.cellwidth);
	raycasterOptions.rows = Math.floor(raycasterOptions.canvas.h / raycasterOptions.cellwidth);

	raycasterOptions.boardSize = idVin_rayMazeSize.KadReset();
	raycasterOptions.speed = idVin_rayMazeSpeed.KadReset();
	raycasterOptions.fovD = idVin_rayMazeView.KadReset();
	raycasterOptions.modes.maze = idCb_rayDebug.KadReset();
	raycasterOptions.modes.target = idCb_rayTarget.KadReset();
	raycasterOptions.modes.poly = idCb_rayPoly.KadReset();
	raycasterOptions.modes.spider = idCb_raySpider.KadReset();

	raycasterOptions.borders = [
		{ a: caRC.createVector(0, 0), b: caRC.createVector(boardWidth, 0) },
		{ a: caRC.createVector(boardWidth, 0), b: caRC.createVector(boardWidth, raycasterOptions.canvas.h) },
		{ a: caRC.createVector(boardWidth, raycasterOptions.canvas.h), b: caRC.createVector(0, raycasterOptions.height) },
		{ a: caRC.createVector(0, raycasterOptions.canvas.h), b: caRC.createVector(0, 0) },
	];
	newRayMaze();
	caRC.redraw();
	caRC.noLoop();
}

export function canvas_cl_RayCaster() {
	caRC.resizeCanvas(raycasterOptions.canvas.w, raycasterOptions.canvas.h);
	caRC.redraw();
}

function rayCasterReset() {
	raycasterOptions.rayStart = [
		{
			x: raycasterOptions.cellwidth / 2 + 0.05, //slight offset to avoid edge errors
			y: raycasterOptions.cellwidth / 2 + 0.05, //slight offset to avoid edge errors
			velX: 0,
			velY: 0,
			radius: raycasterOptions.cellwidth / 8,
			key37: "keyup",
			key38: "keyup",
			key39: "keyup",
			key40: "keyup",
		},
	];
	raycasterOptions.polygons = [];
	raycasterOptions.cells = [];
	raycasterOptions.raySegments = [];
	raycasterOptions.currDist = 0;
	raycasterOptions.longDist = 0;
}

function raySizeChange() {
	raycasterOptions.boardSize = idVin_rayMazeSize.KadGet();
	KadInteraction.focus(idCanv_rayCaster, caRC);
}

function raySpeedChange() {
	raycasterOptions.speed = idVin_rayMazeSpeed.KadGet();
	KadInteraction.focus(idCanv_rayCaster, caRC);
}

function rayViewChange() {
	raycasterOptions.fovD = raycasterOptions.boardSize * 0.1 * idVin_rayMazeView.KadGet();
	KadInteraction.focus(idCanv_rayCaster, caRC);
}

function rayDebugChange() {
	raycasterOptions.modes.maze = dbID(idCb_rayDebug).checked;
	KadInteraction.focus(idCanv_rayCaster, caRC);
}

function rayPolyChange() {
	raycasterOptions.modes.poly = dbID(idCb_rayPoly).checked;
	KadDOM.enableBtn(idCb_raySpider, !raycasterOptions.modes.poly);
	KadInteraction.focus(idCanv_rayCaster, caRC);
}

function raySpiderChange() {
	raycasterOptions.modes.spider = dbID(idCb_raySpider).checked;
	KadDOM.enableBtn(idCb_rayPoly, !raycasterOptions.modes.spider);
	KadInteraction.focus(idCanv_rayCaster, caRC);
}

function rayTargetChange() {
	raycasterOptions.modes.target = dbID(idCb_rayTarget).checked;
	KadInteraction.focus(idCanv_rayCaster, caRC);
}

const caRC = new p5((c) => {
	c.setup = function () {
		c.canv = c.createCanvas(raycasterOptions.canvas.w, raycasterOptions.canvas.h);
		c.canv.id("canvasRayCaster");
		c.canv.parent("#idCanv_rayCaster");
		c.colorMode(c.HSL);
		c.ellipseMode(c.CENTER);
		c.clear();
		caRC.noLoop();
	};

	c.draw = function () {
		//ONLY ON FOCUS!!!
		if (document.activeElement != idCanv_rayCaster) return;
		c.clear();
		// get the actual cellnumber
		let idI = Math.floor(raycasterOptions.rayStart[0].x / raycasterOptions.cellwidth);
		let idJ = Math.floor(raycasterOptions.rayStart[0].y / raycasterOptions.cellwidth);
		let cell = raycasterOptions.cells[idI + idJ * raycasterOptions.rows];
		if (cell === raycasterOptions.longCell) {
			caRC.noLoop();
			log(cell, raycasterOptions.longCell);
			mazeRayFinished();
			clear_cl_RayCaster();
		} else if (cell) {
			let newPosX = raycasterOptions.rayStart[0].x + raycasterOptions.rayStart[0].velX;
			let newPosY = raycasterOptions.rayStart[0].y + raycasterOptions.rayStart[0].velY;

			//Wallcollision - Lines
			if (cell.walls[0].existing && newPosY - raycasterOptions.rayStart[0].radius < cell.walls[0].a.y) raycasterOptions.rayStart[0].velY = 0; // Top
			if (cell.walls[2].existing && newPosY + raycasterOptions.rayStart[0].radius > cell.walls[2].a.y) raycasterOptions.rayStart[0].velY = 0; // Bottom
			if (cell.walls[3].existing && newPosX - raycasterOptions.rayStart[0].radius < cell.walls[3].a.x) raycasterOptions.rayStart[0].velX = 0; // Left
			if (cell.walls[1].existing && newPosX + raycasterOptions.rayStart[0].radius > cell.walls[1].a.x) raycasterOptions.rayStart[0].velX = 0; // Right

			//Wallcollision - Edges
			const rSq = raycasterOptions.rayStart[0].radius ** 2;
			const dSqTLX = (newPosX - cell.edges.tl.x) ** 2;
			const dSqTLY = (newPosY - cell.edges.tl.y) ** 2;
			const dSqTRX = (newPosX - cell.edges.tr.x) ** 2;
			const dSqTRY = (newPosY - cell.edges.tr.y) ** 2;
			const dSqBLX = (newPosX - cell.edges.bl.x) ** 2;
			const dSqBLY = (newPosY - cell.edges.bl.y) ** 2;
			const dSqBRX = (newPosX - cell.edges.br.x) ** 2;
			const dSqBRY = (newPosY - cell.edges.br.y) ** 2;

			if (dSqTLX + dSqTLY < rSq || dSqTRX + dSqTRY < rSq || dSqBLX + dSqBLY < rSq || dSqBRX + dSqBRY < rSq) {
				raycasterOptions.rayStart[0].velX = 0;
				raycasterOptions.rayStart[0].velY = 0;
			}

			raycasterOptions.rayStart[0].x += raycasterOptions.rayStart[0].velX;
			raycasterOptions.rayStart[0].y += raycasterOptions.rayStart[0].velY;
			raycasterOptions.polygons[0] = getSightPolygon(raycasterOptions.rayStart[0]);
			raycasterDrawContent(); //--------Draw content
		}
	};
}, "#idCanv_rayCaster");

function raycasterDrawContent() {
	for (let i = raycasterOptions.polygons.length - 1; i >= 0; i--) {
		let intersects = raycasterOptions.polygons[i];
		let alpha = ((raycasterOptions.polygons.length - i) / raycasterOptions.polygons.length) * 255;
		caRC.fill(330, 100, 50, alpha);
		caRC.noStroke();
		caRC.strokeWeight(1);

		if (!raycasterOptions.modes.poly && raycasterOptions.modes.spider) {
			// DRAW ALL RAYS
			for (let j = 0; j < intersects.length; j++) {
				let intersect = intersects[j];
				// Draw red laser with dot
				caRC.stroke(globalColors.elements.btnNegative);
				caRC.fill(globalColors.elements.btnNegative);
				caRC.line(raycasterOptions.rayStart[i].x, raycasterOptions.rayStart[i].y, intersect.x, intersect.y);
				caRC.circle(intersect.x, intersect.y, raycasterOptions.cellwidth / 4);
				//loop throug all positions
				for (let n = raycasterOptions.rayStart.length - 1; n >= 0; n--) {
					alpha = ((raycasterOptions.rayStart.length - n) / raycasterOptions.rayStart.length) * 255;
					let c = caRC.color(globalColors.elements.btnNegative);
					c.setAlpha(alpha);
					caRC.fill(c);
					caRC.circle(raycasterOptions.rayStart[n].x, raycasterOptions.rayStart[n].y, raycasterOptions.rayStart[0].radius * 2);
				}
			}
		} else if (raycasterOptions.modes.poly) {
			caRC.beginShape();
			caRC.noStroke();
			for (let i = 0; i < intersects.length; i++) {
				caRC.vertex(intersects[i].x, intersects[i].y);
			}
			caRC.endShape(caRC.CLOSE);
			//loop throug all positions
			for (let n = raycasterOptions.rayStart.length - 1; n >= 0; n--) {
				alpha = ((raycasterOptions.rayStart.length - n) / raycasterOptions.rayStart.length) * 255;
				caRC.fill(240, 100, 50, alpha);
				caRC.circle(raycasterOptions.rayStart[n].x, raycasterOptions.rayStart[n].y, raycasterOptions.rayStart[0].radius * 2);
			}
		}

		if (raycasterOptions.modes.target) {
			caRC.stroke(globalColors.elements.line);
			caRC.fill(globalColors.elements.btnPositive);
			let mid = 0.5 * raycasterOptions.cellwidth;
			let x = mid + raycasterOptions.cellwidth * raycasterOptions.longCell.i;
			let y = mid + raycasterOptions.cellwidth * raycasterOptions.longCell.j;
			caRC.circle(x, y, raycasterOptions.cellwidth / 4);
		}

		if (raycasterOptions.modes.maze) {
			raycasterOptions.cells.forEach((cell) => {
				cell.show();
			});
		}

		if (i == 0) {
			// caRC.fill(240, 100, 50);
			caRC.fill(240, 100, 50, alpha);
			caRC.stroke(0, 0, 0);
			caRC.circle(raycasterOptions.rayStart[0].x, raycasterOptions.rayStart[0].y, raycasterOptions.rayStart[0].radius * 2);
		}
	}
}

function mazeRayFinished() {
	timeoutCanvasFinished(caRC, {
		textTop: "Congratulations!",
		textBottom: "You finished!",
	});
}

function newRayMaze() {
	rayCasterReset();
	for (let i = 0; i < raycasterOptions.rows; i++) {
		for (let j = 0; j < raycasterOptions.cols; j++) {
			raycasterOptions.cells.push(new RaycasterCell(j, i, raycasterOptions.cols, raycasterOptions.rows, raycasterOptions.cellwidth));
		}
	}
	raycasterOptions.currCell = raycasterOptions.cells[0];
	raycasterOptions.longCell = raycasterOptions.currCell;
	raycasterOptions.currCell.visited = true;
	let pending;
	do {
		pending = generateRayMaze();
	} while (pending);
	for (let i = 0; i < raycasterOptions.cells.length; i++) {
		for (let j = 0; j < 4; j++) {
			if (raycasterOptions.cells[i].walls[j].existing && raycasterOptions.cells[i].visited) {
				raycasterOptions.raySegments.push(raycasterOptions.cells[i].walls[j]);
			}
		}
	}
	for (let i = 0; i < raycasterOptions.borders.length; i++) {
		raycasterOptions.raySegments.push(raycasterOptions.borders[i]);
	}
	KadInteraction.focus(idCanv_rayCaster, caRC);
}

function generateRayMaze() {
	let neighbours = raycasterOptions.currCell.checkRayNeighbours();
	if (neighbours.length > 0) {
		let next = caRC.random(neighbours);
		next.visited = true;
		//removeWalls
		if (raycasterOptions.currCell.j - next.j == 1) {
			//top
			raycasterOptions.currCell.walls[0].existing = false;
			next.walls[2].existing = false;
		}
		if (raycasterOptions.currCell.i - next.i == -1) {
			//right
			raycasterOptions.currCell.walls[1].existing = false;
			next.walls[3].existing = false;
		}
		if (raycasterOptions.currCell.j - next.j == -1) {
			//bottom
			raycasterOptions.currCell.walls[2].existing = false;
			next.walls[0].existing = false;
		}
		if (raycasterOptions.currCell.i - next.i == 1) {
			//left
			raycasterOptions.currCell.walls[3].existing = false;
			next.walls[1].existing = false;
		}
		raycasterOptions.stack.push(next);
		raycasterOptions.currCell = next;
		raycasterOptions.currDist++;
	} else {
		if (raycasterOptions.stack.length > 0) {
			raycasterOptions.currCell = raycasterOptions.stack.pop();
		} else {
			//DONE!
			raycasterOptions.currCell = raycasterOptions.cells[0];
			return false;
		}
		raycasterOptions.currDist--;
	}
	if (raycasterOptions.longDist < raycasterOptions.currDist) {
		raycasterOptions.longDist = raycasterOptions.currDist;
		raycasterOptions.longCell = raycasterOptions.currCell;
	}
	return true;
}

function getSightPolygon(rayS) {
	// Get all unique points
	let points = ((segments) => {
		let a = [];
		segments.forEach((seg) => {
			// constrain the FOV
			let dsAX = seg.a.x - rayS.x;
			let dsAY = seg.a.y - rayS.y;
			let dsBX = seg.b.x - rayS.x;
			let dsBY = seg.b.y - rayS.y;
			let dA = dsAX * dsAX + dsAY * dsAY;
			let dB = dsBX * dsBX + dsBY * dsBY;
			if (dA <= Math.abs(raycasterOptions.fovD * raycasterOptions.cellwidth * raycasterOptions.cellwidth) || dB <= Math.abs(raycasterOptions.fovD * raycasterOptions.cellwidth * raycasterOptions.cellwidth)) {
				a.push(seg.a, seg.b);
			}
		});
		return a;
	})(raycasterOptions.raySegments);

	let uniquePoints = ((points) => {
		let set = {};
		return points.filter((p) => {
			let key = p.x + "," + p.y;
			if (key in set) {
				return false;
			} else {
				set[key] = true;
				return true;
			}
		});
	})(points);

	// Get all angles
	let uniqueAngles = [];
	for (let j = 0; j < uniquePoints.length; j++) {
		let uniquePoint = uniquePoints[j];
		let angle = Math.atan2(uniquePoint.y - rayS.y, uniquePoint.x - rayS.x);
		uniquePoint.angle = angle;
		uniqueAngles.push(angle - 0.0000001, angle, angle + 0.0000001);
	}

	// RAYS IN ALL DIRECTIONS
	let intersects = [];
	for (let j = 0; j < uniqueAngles.length; j++) {
		let angle = uniqueAngles[j];

		// Calculate dx & dy from angle
		let dx = Math.cos(angle);
		let dy = Math.sin(angle);

		// Ray from center of screen to mouse
		let ray = {
			a: { x: rayS.x, y: rayS.y },
			b: { x: rayS.x + dx, y: rayS.y + dy },
			angle: angle,
		};
		// Find CLOSEST intersection
		let closestIntersect = null;
		for (let i = 0; i < raycasterOptions.raySegments.length; i++) {
			let intersect = getIntersection(ray, raycasterOptions.raySegments[i]);
			if (!intersect) continue;
			if (!closestIntersect || intersect.param < closestIntersect.param) {
				closestIntersect = intersect;
			}
		}
		// Intersect angle
		if (!closestIntersect) continue;
		closestIntersect.angle = angle;
		// Add to list of intersects
		intersects.push(closestIntersect);
	}
	intersects = intersects.sort(function (a, b) {
		return a.angle - b.angle;
	});
	return intersects;
}

function keyPushedRayCaster(event) {
	let keyInput = event.keyCode;
	if (event.type === "keyup" && (keyInput == 88 || keyInput == 120)) {
		//"X"
		raycasterOptions.rayStart.splice(1, 0, deepClone(raycasterOptions.rayStart[0])); //DEEP CLONE JSON
		raycasterOptions.polygons.splice(1, 0, raycasterOptions.polygons[0]);
		if (raycasterOptions.rayStart.length > 6) {
			raycasterOptions.rayStart.splice(raycasterOptions.rayStart.length - 1, 1);
			raycasterOptions.polygons.splice(raycasterOptions.polygons.length - 1, 1);
		}
	} else {
		if (raycasterOptions.rayStart[0][`key${keyInput}`] != event.type) {
			raycasterOptions.rayStart[0][`key${keyInput}`] = event.type;
		}

		if (raycasterOptions.rayStart[0].key37 === "keydown") {
			raycasterOptions.rayStart[0].velX = raycasterOptions.speed * -1;
		} else if (raycasterOptions.rayStart[0].key39 === "keydown") {
			raycasterOptions.rayStart[0].velX = raycasterOptions.speed * 1;
		} else if (raycasterOptions.rayStart[0].key37 === "keyup" && raycasterOptions.rayStart[0].key39 === "keyup") {
			raycasterOptions.rayStart[0].velX = 0;
		}

		if (raycasterOptions.rayStart[0].key38 === "keydown") {
			raycasterOptions.rayStart[0].velY = raycasterOptions.speed * -1;
		} else if (raycasterOptions.rayStart[0].key40 === "keydown") {
			raycasterOptions.rayStart[0].velY = raycasterOptions.speed * 1;
		} else if (raycasterOptions.rayStart[0].key38 === "keyup" && raycasterOptions.rayStart[0].key40 === "keyup") {
			raycasterOptions.rayStart[0].velY = 0;
		}
	}
}

// Find intersection of RAY & SEGMENT
function getIntersection(ray, segment) {
	// RAY in parametric: Point + Delta*T1
	let r_px = ray.a.x;
	let r_py = ray.a.y;
	let r_dx = ray.b.x - ray.a.x;
	let r_dy = ray.b.y - ray.a.y;
	// SEGMENT in parametric: Point + Delta*T2
	let s_px = segment.a.x;
	let s_py = segment.a.y;
	let s_dx = segment.b.x - segment.a.x;
	let s_dy = segment.b.y - segment.a.y;
	//improved Parallelity check
	if (r_dx * s_dy == r_dy * s_dx) {
		return null; // they do not intersect
	}
	// SOLVE FOR T1 & T2
	let T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
	let T1 = (s_px + s_dx * T2 - r_px) / r_dx;
	// Must be within parametic whatevers for RAY/SEGMENT
	if (T1 < 0) return null;
	if (T2 < 0 || T2 > 1) return null;
	// Return the POINT OF INTERSECTION
	return {
		x: r_px + r_dx * T1,
		y: r_py + r_dy * T1,
		param: T1,
	};
}

class RaycasterCell {
	constructor(i, j, cols, rows, w) {
		this.i = i;
		this.j = j;
		this.cols = cols;
		this.rows = rows;
		this.w = w;
		this.visited = false;
		this.edges = {
			tl: caRC.createVector(w * i, w * j),
			tr: caRC.createVector(w * (i + 1), w * j),
			br: caRC.createVector(w * (i + 1), w * (j + 1)),
			bl: caRC.createVector(w * i, w * (j + 1)),
			// bl_y: w * (this.j + 1)
		};
		this.fovRadius = [
			{
				x: 0,
				y: 0,
			},
		];

		this.walls = [
			{
				a: this.edges.tl, //TOP left
				b: this.edges.tr, //TOP right
				existing: true,
			},
			{
				a: this.edges.tr, //TOP right
				b: this.edges.br, //BOTTOM right
				existing: true,
			},
			{
				a: this.edges.br, //BOTTOM right
				b: this.edges.bl, //BOTTOM left
				existing: true,
			},
			{
				a: this.edges.bl, //BOTTOM left
				b: this.edges.tl, //TOP left
				existing: true,
			},
		];
	}

	show() {
		caRC.noFill();
		caRC.stroke(globalColors.elements.line);
		for (let i = 0; i < 4; i++) {
			if (this.walls[i].existing) {
				caRC.line(this.walls[i].a.x, this.walls[i].a.y, this.walls[i].b.x, this.walls[i].b.y);
			}
		}
	}

	mazeRayIndex(i, j) {
		return i < 0 || j < 0 || i > this.cols - 1 || j > this.rows - 1 ? -1 : i + j * this.cols;
	}

	checkRayNeighbours() {
		let neighbours = [];
		let top = raycasterOptions.cells[this.mazeRayIndex(this.i, this.j - 1)];
		let right = raycasterOptions.cells[this.mazeRayIndex(this.i + 1, this.j)];
		let bottom = raycasterOptions.cells[this.mazeRayIndex(this.i, this.j + 1)];
		let left = raycasterOptions.cells[this.mazeRayIndex(this.i - 1, this.j)];
		if (top && !top.visited) neighbours.push(top);
		if (right && !right.visited) neighbours.push(right);
		if (bottom && !bottom.visited) neighbours.push(bottom);
		if (left && !left.visited) neighbours.push(left);
		return neighbours;
	}
}
