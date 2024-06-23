import { KadArray, KadCSS, KadDOM, KadDate, KadRandom, dbID, deepClone, hostDebug, initEL } from "../KadUtils/KadUtils.js";
import { contentLayout, navClick } from "../General/Layout.js";
import { globalColors } from "../Settings/Color.js";

export const bgaOptions = {
	curr: 0,
	animations: [],
	pointDiameter: 4,
	alpha: 0.2,
	drawing: false,
	resetting: true,
	navContPrev: "",
	maxRadius: null,
};

export function clear_cl_BackgroundAnimation() {
	bgaOptions.animations = [new Clock(), new SegmentClock(), new Time(), new Cursordot(), new Trail(), new Hilbert(), new LanktonsAnt(), new Cardioid(), new AStar(), new Flowfield(), new PoissonDisc(), new Phyllotaxis(), new TenPrint(), new GameOfLife(), new PongAI()];
	idSel_bgaSelect.KadReset({ selList: bgaOptions.animations.map((a) => a.constructor.name) });
}

export function canvas_cl_BackgroundAnimation() {
  const g = KadCSS.getRoot("gridGap", true, true);
  const n = KadCSS.getRoot("navbarHeight", true, true);
  caBA.resizeCanvas(window.innerWidth, window.innerHeight - g - n);
  if (bgaOptions.drawing) {
    bgaOptions.animations[bgaOptions.curr].reset();
  }
  bgaOptions.maxRadius = Math.min(window.innerWidth, window.innerHeight) / 3;
	caBA.redraw();
}

export function bgaClearBackground() {
	bgaOptions.drawing = false;
	bgaStopp();
	caBA.clear();
}

function bgaClearGrid() {
	if (contentLayout.prevNavContent != "Clear") {
		bgaOptions.navContPrev = contentLayout.prevNavContent;
		navClick("Clear");
	} else {
		contentLayout.prevNavContent = bgaOptions.navContPrev;
		navClick();
	}
}

initEL({ id: idDiv_bgaToggle, fn: bgaToggle });
initEL({ id: idSel_bgaSelect, fn: bgaSelectAnimation, selList: [1] });
initEL({ id: idDiv_bgaClearGrid, fn: bgaClearGrid });

export function bgaToggleReset(obj) {
	bgaOptions.resetting = obj.checked;
}

function bgaStart() {
	bgaOptions.animations[bgaOptions.curr].reset();
	caBA.frameRate(bgaOptions.animations[bgaOptions.curr].Framerate);
	dbID("idImg_bgaToggle").src = KadDOM.getImgPath("tStop");
	bgaOptions.drawing = true;
	caBA.loop();
	if (hostDebug()) {
		bgaClearGrid();
	}
}

function bgaStopp() {
	dbID("idImg_bgaToggle").src = KadDOM.getImgPath("tPlay");
	caBA.noLoop();
}

function bgaToggle() {
	if (caBA.isLooping()) {
		bgaStopp();
	} else {
		bgaStart();
	}
}

function bgaSelectAnimation() {
	bgaOptions.curr = idSel_bgaSelect.selectedIndex;
	bgaClearBackground();
	bgaStopp();
}

function bgaQuit() {
	if (bgaOptions.resetting) {
		bgaOptions.animations[bgaOptions.curr].reset();
	} else {
		bgaStopp();
	}
}

const caBA = new p5((c) => {
	c.setup = function () {
		const n = KadCSS.getRoot("navbarHeight", true, true);
		c.canv = c.createCanvas(window.innerWidth, window.innerHeight - n);
		c.canv.id("canvasBackAnimation");
		c.canv.parent("#idCanv_backgroundAnimation");
		c.colorMode(c.HSL);
		clear_cl_BackgroundAnimation();
		bgaClearBackground();
		c.noLoop();
		bgaOptions.maxRadius = Math.min(window.innerWidth, window.innerHeight) / 3;
	};
	c.draw = function () {
		if (bgaOptions.drawing) {
			bgaOptions.animations[bgaOptions.curr].draw();
		}
	};
	c.windowResized = function () {
    canvas_cl_BackgroundAnimation()
    return 
    const g = KadCSS.getRoot("gridGap", true, true);
		const n = KadCSS.getRoot("navbarHeight", true, true);
		c.resizeCanvas(window.innerWidth, window.innerHeight - g - n);
		if (bgaOptions.drawing) {
			bgaOptions.animations[bgaOptions.curr].reset();
		}
		bgaOptions.maxRadius = Math.min(window.innerWidth, window.innerHeight) / 3;
	};
}, "#idCanv_backgroundAnimation");

// ---------------
class Clock {
	constructor() {
		this.Framerate = 4;
		this.size;
		this.col;
	}

	reset() {
		if (caBA.height / 4 < caBA.width / 6) {
			// size based in height
			this.size = caBA.height / 3;
		} else {
			// size based in width
			this.size = caBA.width / 4;
		}
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha);
		caBA.fill(this.col);
		caBA.noStroke();
	}
	draw() {
		caBA.clear();
		caBA.translate(caBA.width / 2, caBA.height / 2);
		const today = new Date();
		const format = today.getSeconds() % 2 == 0 ? "HH mm" : "HH:mm";
		const time = KadDate.getDate(today, { format });
		const date = KadDate.getDate(today);
		caBA.textAlign(caBA.CENTER, caBA.BOTTOM);
		caBA.textSize(this.size);
		caBA.text(time, 0, 0);
		caBA.textAlign(caBA.CENTER, caBA.TOP);
		caBA.textSize(this.size / 2);
		caBA.text(date, 0, 0);
	}
}

class SegmentClock {
	constructor() {
		this.Framerate = 4;
		this.nums = [0x7e, 0x30, 0x6d, 0x79, 0x33, 0x5b, 0x5f, 0x70, 0x7f, 0x7b];
		this.offset = 0;
		this.offsetHalf = 0;
		this.leng = 0;
		this.thickness = 1;
		this.col;
	}

	reset() {
		this.offset = caBA.height / 4 < caBA.width / 6 ? caBA.height / 5 : caBA.width / 9; // size based in height : size based in width
		this.offsetHalf = this.offset / 2;
		this.leng = this.offset * 0.9;
		this.thickness = this.offset * 0.1;
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha);
		caBA.rectMode(caBA.CENTER);
		caBA.noStroke();
	}
	draw() {
		caBA.clear();
		const center = caBA.width / 2;
		const today = new Date();
		const h = today.getHours();
		const m = today.getMinutes();
		const s = today.getSeconds();
		if (s % 2 == 0) this.drawColon(center);
		if (h > 10) this.segment(Math.floor(h / 10), center - this.offset * 2.5);
		this.segment(h % 10, center - this.offset * 1);
		this.segment(Math.floor(m / 10), center + this.offset * 1);
		this.segment(m % 10, center + this.offset * 2.5);
	}

	drawColon(c) {
		caBA.push();
		caBA.translate(c, caBA.height / 2);
		caBA.fill(this.col);
		caBA.circle(0, this.offsetHalf, this.thickness);
		caBA.circle(0, -this.offsetHalf, this.thickness);
		caBA.pop();
	}

	segment(index, x) {
		const val = this.nums[index];
		caBA.push();
		caBA.translate(x, caBA.height / 2);
		caBA.noStroke();
		// A
		this.setColor(val, 6);
		caBA.rect(0, -this.offset, this.leng, this.thickness, this.thickness / 2);
		// B
		this.setColor(val, 5);
		caBA.rect(this.offsetHalf, -this.offsetHalf, this.thickness, this.leng, this.thickness / 2);
		// C
		this.setColor(val, 4);
		caBA.rect(this.offsetHalf, this.offsetHalf, this.thickness, this.leng, this.thickness / 2);
		// D
		this.setColor(val, 3);
		caBA.rect(0, this.offset, this.leng, this.thickness, this.thickness / 2);
		// E
		this.setColor(val, 2);
		caBA.rect(-this.offsetHalf, this.offsetHalf, this.thickness, this.leng, this.thickness / 2);
		// F
		this.setColor(val, 1);
		caBA.rect(-this.offsetHalf, -this.offsetHalf, this.thickness, this.leng, this.thickness / 2);
		// G
		this.setColor(val, 0);
		caBA.rect(0, 0, this.leng, this.thickness, this.thickness / 2);
		caBA.pop();
	}

	setColor(val, shift) {
		if ((val >> shift) & 1) {
			caBA.fill(this.col);
		} else {
			caBA.noFill();
		}
	}
}

class Time {
	constructor() {
		this.Framerate = 30;
		this.size;
		this.col;
		this.starttime = null;
		this.offset = 0;
	}

	reset() {
		if (caBA.height / 4 < caBA.width / 6) {
			// size based in height
			this.size = caBA.height / 5;
		} else {
			// size based in width
			this.size = caBA.width / 8;
		}
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha);
		caBA.fill(this.col);
		caBA.noStroke();
		caBA.textAlign(caBA.LEFT, caBA.CENTER);
		caBA.textSize(this.size);
		this.offset = caBA.textWidth("00:00:00:000") / 2;
	}
	draw() {
		caBA.clear();
		caBA.translate(caBA.width / 2, caBA.height / 2);
		const time = KadDate.getDate(null, { format: "HH:mm:ss-ms" });
		caBA.text(time, -this.offset, 0);
	}
}

class Cursordot {
	constructor() {
		this.Framerate = 30;
		this.r = bgaOptions.pointDiameter * 10;
		this.col = null;
	}
	reset() {
		caBA.noStroke();
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha);
		caBA.fill(this.col);
	}
	draw() {
		caBA.clear();
		caBA.circle(caBA.mouseX, caBA.mouseY, this.r);
	}
}

class Trail {
	constructor() {
		this.Framerate = 30;
		this.w = bgaOptions.pointDiameter;
		this.col = null;
		this.trail = [];
		this.trialLength = 40;
		this.shape = "";
		this.close = "";
	}
	reset() {
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha);
		caBA.noFill();
		caBA.stroke(this.col);
		caBA.strokeWeight(this.w * 2);
		this.shape = ""; //KadRandom.randomObject(["", caBA.TRIANGLE_FAN])
		this.close = caBA.OPEN; //KadRandom.randomObject(["", caBA.CLOSE])
		this.trail[0] = {
			x: caBA.mouseX,
			y: caBA.mouseY,
		};
	}
	draw() {
		caBA.clear();
		if (caBA.mouseX - this.trail[0].x != 0 || caBA.mouseY - this.trail[0].y != 0) {
			this.trail.unshift({
				x: caBA.mouseX,
				y: caBA.mouseY,
			});
			if (this.trail.length >= this.trialLength) {
				this.trail.pop();
			}
		}

		caBA.beginShape(this.shape);
		this.trail.forEach((t) => {
			caBA.curveVertex(t.x, t.y);
		});
		caBA.endShape(this.close);
	}
}

class Hilbert {
	constructor() {
		this.order = 8;
		this.N;
		this.total;
		this.path = [];
		this.counter;
		this.col;
	}
	reset() {
		this.Framerate = 30;
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha);
		caBA.stroke(this.col);
		caBA.strokeWeight(1);
		caBA.noFill();
		this.N = caBA.int(2 ** this.order);
		this.total = this.N ** 2;
		this.counter = 0;
		for (let i = 0; i < this.total; i++) {
			this.path[i] = this.hilbert(i);
			let len = caBA.width / this.N;
			this.path[i].mult(len);
			this.path[i].add(len / 2, len / 2);
		}
	}
	draw() {
		caBA.clear();
		for (let i = 1; i < this.counter; i++) {
			caBA.line(this.path[i].x, this.path[i].y, this.path[i - 1].x, this.path[i - 1].y);
		}
		this.counter += 5;
		if (this.counter >= this.path.length) {
			this.counter = 0;
		}
	}
	hilbert(i) {
		const points = [new p5.Vector(0, 0), new p5.Vector(0, 1), new p5.Vector(1, 1), new p5.Vector(1, 0)];

		let index = i & 3;
		let v = points[index];
		for (let j = 1; j < this.order; j++) {
			i = i >>> 2;
			index = i & 3;
			let len = 2 ** j;
			if (index == 0) {
				let temp = v.x;
				v.x = v.y;
				v.y = temp;
			} else if (index == 1) {
				v.y += len;
			} else if (index == 2) {
				v.x += len;
				v.y += len;
			} else if (index == 3) {
				let temp = len - 1 - v.x;
				v.x = len - 1 - v.y;
				v.y = temp;
				v.x += len;
			}
		}
		return v;
	}
}

class LanktonsAnt {
	constructor() {
		this.Framerate = 30;
		this.grid;
		this.resolution = bgaOptions.pointDiameter;
		this.cols;
		this.rows;
		this.x;
		this.y;
		this.dir;
		this.col;
	}
	reset() {
		this.cols = Math.floor(caBA.width / this.resolution);
		this.rows = Math.floor(caBA.height / this.resolution);
		this.grid = KadArray.createArray(this.cols, this.rows, 0);
		this.x = Math.floor(this.cols / 2);
		this.y = Math.floor(this.rows / 2);
		this.dir = Math.floor(Math.random() * 4);
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha);
		caBA.fill(this.col);
		caBA.noStroke();
	}

	draw() {
		caBA.clear();
		// for (let n = 0; n < 20; n++) {
		const state = this.grid[this.x][this.y];
		if (state == 0) {
			this.turn(1);
			this.grid[this.x][this.y] = 1;
		} else if (state == 1) {
			this.turn(-1);
			this.grid[this.x][this.y] = 0;
		}

		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				if (this.grid[i][j] == 1) {
					caBA.square(i * this.resolution, j * this.resolution, this.resolution);
				}
			}
		}
		this.moveForward();
		// };
	}

	turn(d) {
		//d=1--> right, d=-1--> left
		this.dir = (this.dir + 4 + d) % 4;
	}

	moveForward() {
		if (this.dir == 0) this.y--;
		else if (this.dir == 2) this.y++;
		else if (this.dir == 1) this.x--;
		else if (this.dir == 3) this.x++;

		if (this.x > this.cols - 1) {
			this.x = 0;
		} else if (this.x < 0) {
			this.x = this.cols - 1;
		}
		if (this.y > this.rows - 1) {
			this.y = 0;
		} else if (this.y < 0) {
			this.y = this.rows - 1;
		}
	}
}

class Cardioid {
	constructor() {
		this.Framerate = 30;
		this.r = 1;
		this.factor = 1;
		this.fDir = 1;
		this.inc = 0.005;
		this.total = 200;
		this.col;
	}
	reset() {
		this.fDir = 1;
		this.factor = 1;
		this.r = bgaOptions.maxRadius;
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha);
		caBA.rectMode(caBA.CENTER);
		caBA.ellipseMode(caBA.CENTER);
		caBA.noFill();
		caBA.stroke(this.col);
		caBA.strokeWeight(1);
	}
	draw() {
		caBA.clear();
		this.factor += this.inc * this.fDir;
		caBA.translate(caBA.width / 2, caBA.height / 2);
		caBA.circle(0, 0, this.r * 2);
		for (let i = 0; i < this.total; i++) {
			const a = this.getVector(i, this.total);
			const b = this.getVector(i * this.factor, this.total);
			caBA.line(a.x, a.y, b.x, b.y);
		}
		if (this.factor >= 10 || this.factor < 1) {
			this.fDir *= -1;
		}
	}
	getVector(index, total) {
		const angle = caBA.map(index % this.total, 0, this.total, 0, caBA.TWO_PI);
		const v = p5.Vector.fromAngle(angle + caBA.PI);
		v.mult(this.r);
		return v;
	}
}

class AStar {
	constructor() {
		this.Framerate = 30;
		this.grid;
		this.openSet = [];
		this.closedSet = [];
		this.cols;
		this.rows;
		this.resolution = bgaOptions.pointDiameter * 4;
		this.startPoint;
		this.endPoint;
		this.current;
		this.col;
	}
	reset() {
		this.cols = Math.floor(caBA.width / this.resolution);
		this.rows = Math.floor(caBA.height / this.resolution) - 2;
		this.grid = [];
		for (let i = 0; i < this.cols; i++) {
			this.grid[i] = [];
			for (let j = 0; j < this.rows; j++) {
				this.grid[i].push(new AStar.Spot(i, j, this.cols, this.rows, this.resolution));
			}
		}
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.grid[i][j].addNeighbors(this.grid);
			}
		}
		this.startPoint = this.grid[KadRandom.randomObject(this.cols)][KadRandom.randomObject(this.rows)];
		this.endPoint = this.grid[KadRandom.randomObject(this.cols)][KadRandom.randomObject(this.rows)];
		this.startPoint.wall = false;
		this.endPoint.wall = false;
		this.openSet = [];
		this.openSet.push(this.startPoint);
		this.closedSet = [];
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha);
		caBA.rectMode(caBA.CENTER);
		caBA.ellipseMode(caBA.CENTER);
		caBA.noStroke();
	}
	draw() {
		caBA.clear();
		caBA.translate(this.resolution / 2, this.resolution / 2);
		this.current = null;
		// Am I still searching?
		if (this.openSet.length > 0) {
			let winner = 0;
			this.openSet.forEach((s, index) => {
				if (s.f < this.openSet[winner].f) winner = index;
			});
			this.current = this.openSet[winner];
			if (this.current === this.endPoint) {
				bgaQuit();
				return;
			}
			// Best option moves from openSet to closedSet
			this.removeFromArray(this.openSet, this.current);
			this.closedSet.push(this.current);

			// Check all the neighbors
			let neighbors = this.current.neighbors;
			for (let i = 0; i < neighbors.length; i++) {
				const neighbor = neighbors[i];
				if (!this.closedSet.includes(neighbor) && !neighbor.wall) {
					let tempG = this.current.g + this.heuristic(neighbor, this.current);
					let newPath = false;
					if (this.openSet.includes(neighbor)) {
						if (tempG < neighbor.g) {
							neighbor.g = tempG;
							newPath = true;
						}
					} else {
						neighbor.g = tempG;
						newPath = true;
						this.openSet.push(neighbor);
					}
					if (newPath) {
						neighbor.h = this.heuristic(neighbor, this.endPoint);
						neighbor.f = neighbor.g + neighbor.h;
						neighbor.previous = this.current;
					}
				}
			}
		} else {
			bgaQuit();
			return;
		}
		caBA.clear();
		for (let i = 0; i < this.cols; i++) {
			this.grid[i].forEach((p) => p.show());
		}
		this.closedSet.forEach((p) => p.show(globalColors.elements.btnNegative));
		this.openSet.forEach((p) => p.show(globalColors.elements.btnPositive));
		this.endPoint.show(globalColors.elements.baseColor);

		let path = [];
		let temp = this.current;
		path.push(temp);
		while (temp.previous) {
			path.push(temp.previous);
			temp = temp.previous;
		}
		caBA.stroke(this.col);
		caBA.noFill();
		caBA.strokeWeight(this.resolution / 2);
		caBA.beginShape();
		for (var i = 0; i < path.length; i++) {
			caBA.vertex(path[i].i * this.resolution, path[i].j * this.resolution);
		}
		caBA.endShape();
	}

	heuristic(a, b) {
		var d = caBA.dist(a.i, a.j, b.i, b.j);
		return d;
	}

	removeFromArray(arr, item) {
		arr.splice(arr.indexOf(item), 1);
	}
}
AStar.Spot = class {
	constructor(i, j, cols, rows, res) {
		this.i = i;
		this.j = j;
		this.f = 0;
		this.g = 0;
		this.h = 0;
		this.c = cols;
		this.r = rows;
		this.res = res;
		this.neighbors = [];
		this.previous = undefined;
		this.wall = Math.random(1) < 0.2 ? true : false;
		this.col = caBA.color(globalColors.elements.text);
		this.col.setAlpha(bgaOptions.alpha);
	}
	show(col) {
		if (this.wall) {
			caBA.fill(this.col);
			caBA.noStroke();
			caBA.square(this.i * this.res, this.j * this.res, this.res);
		} else if (col) {
			let c = caBA.color(col);
			c.setAlpha(bgaOptions.alpha);
			caBA.fill(c);
			caBA.square(this.i * this.res, this.j * this.res, this.res);
		}
	}

	addNeighbors(g) {
		const x = this.i;
		const y = this.j;

		if (x < this.c - 1) {
			this.neighbors.push(g[x + 1][y]);
		}
		if (x > 0) {
			this.neighbors.push(g[x - 1][y]);
		}
		if (y < this.r - 1) {
			this.neighbors.push(g[x][y + 1]);
		}
		if (y > 0) {
			this.neighbors.push(g[x][y - 1]);
		}
		if (x > 0 && y > 0) {
			this.neighbors.push(g[x - 1][y - 1]);
		}
		if (x < this.c - 1 && y > 0) {
			this.neighbors.push(g[x + 1][y - 1]);
		}
		if (x > 0 && y < this.r - 1) {
			this.neighbors.push(g[x - 1][y + 1]);
		}
		if (x < this.c - 1 && y < this.r - 1) {
			this.neighbors.push(g[x + 1][y + 1]);
		}
	}
};

class Flowfield {
	constructor() {
		this.Framerate = 30;
		this.inc = 0.1;
		this.scl = 30;
		this.cols;
		this.rows;
		this.zoff = 0;
		this.particles = [];
		this.flowfield = [];
		this.particleCount = 250;
		this.col;
	}

	reset() {
		this.cols = Math.floor(caBA.width / this.scl);
		this.rows = Math.floor(caBA.height / this.scl);
		this.flowfield = new Array(this.cols * this.rows);
		this.particles = [];
		for (let i = 0; i < this.particleCount; i++) {
			this.particles[i] = new Flowfield.Particle();
		}
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha * 0.1);
		caBA.stroke(this.col);
		caBA.strokeWeight(1);
	}
	draw() {
		let yoff = 0;
		for (let y = 0; y < this.rows; y++) {
			let xoff = 0;
			for (let x = 0; x < this.cols; x++) {
				let index = x + y * this.cols;
				let angle = caBA.noise(xoff, yoff, this.zoff) * caBA.TWO_PI * 4;
				let v = p5.Vector.fromAngle(angle);
				v.setMag(1);
				this.flowfield[index] = v;
				xoff += this.inc;
				//debug flowfield
				// caBA.push();
				// caBA.translate(x * this.scl, y * this.scl);
				// caBA.rotate(v.heading());
				// caBA.strokeWeight(1);
				// caBA.line(0, 0, this.scl, 0);
				// caBA.pop();
			}
			yoff += this.inc;
			this.zoff += 0.0003;
		}
		for (let p of this.particles) {
			p.follow(this.flowfield, this.cols, this.scl);
			p.update();
			p.edges();
			p.show();
		}
	}
}
Flowfield.Particle = class {
	constructor() {
		this.pos = caBA.createVector(caBA.random(caBA.width), caBA.random(caBA.height));
		this.vel = caBA.createVector(0, 0);
		this.acc = caBA.createVector(0, 0);
		this.maxspeed = 4;
		this.prevPos = this.pos.copy();
	}

	follow(force, cols, scl) {
		const x = Math.floor(this.pos.x / scl);
		const y = Math.floor(this.pos.y / scl);
		const index = x + y * cols;
		this.acc.add(force[index]);
	}
	update() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}
	show() {
		caBA.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
		this.updatePrev();
	}

	updatePrev() {
		this.prevPos.x = this.pos.x;
		this.prevPos.y = this.pos.y;
	}

	edges() {
		if (this.pos.x > caBA.width) {
			this.pos.x = 0;
			this.updatePrev();
		}
		if (this.pos.x < 0) {
			this.pos.x = caBA.width;
			this.updatePrev();
		}
		if (this.pos.y > caBA.height) {
			this.pos.y = 0;
			this.updatePrev();
		}
		if (this.pos.y < 0) {
			this.pos.y = caBA.height;
			this.updatePrev();
		}
	}
};

class PoissonDisc {
	constructor() {
		this.Framerate = 10;
		this.r = 4;
		this.k = 30;
		this.w = this.r / Math.sqrt(2);
		this.grid = [];
		this.active = [];
		this.ordered = [];
		this.cols = Math.floor(caBA.width / this.w);
		this.rows = Math.floor(caBA.height / this.w);
	}

	reset() {
		this.ordered = [];
		this.active = [];
		this.grid = [];
		for (let i = 0; i < this.cols * this.rows; i++) {
			this.grid[i] = undefined;
		}
		let x = caBA.width / 2;
		let y = caBA.height / 2;
		let i = Math.floor(x / this.w);
		let j = Math.floor(y / this.w);
		let pos = caBA.createVector(x, y);
		this.grid[i + j * this.cols] = pos;
		this.active.push(pos);
		caBA.noStroke();
	}
	draw() {
		caBA.clear();
		for (let total = 0; total < 5; total++) {
			if (this.active.length > 0) {
				let randIndex = Math.floor(caBA.random(this.active.length));
				let pos = this.active[randIndex];
				let found = false;
				for (let n = 0; n < this.k; n++) {
					let sample = p5.Vector.random2D();
					let m = caBA.random(this.r, 2 * this.r);
					sample.setMag(m);
					sample.add(pos);
					const col = Math.floor(sample.x / this.w);
					const row = Math.floor(sample.y / this.w);
					if (col > -1 && row > -1 && col < this.cols && row < this.rows && !this.grid[col + row * this.cols]) {
						let ok = true;
						for (let i = -1; i <= 1; i++) {
							for (let j = -1; j <= 1; j++) {
								const index = col + i + (row + j) * this.cols;
								let neighbor = this.grid[index];
								if (neighbor) {
									let d = p5.Vector.dist(sample, neighbor);
									if (d < this.r) {
										ok = false;
									}
								}
							}
						}
						if (ok) {
							found = true;
							this.grid[col + row * this.cols] = sample;
							this.active.push(sample);
							this.ordered.push(sample);
							break;
						}
					}
				}
				if (!found) {
					this.active.splice(randIndex, 1);
				}
			}
		}
		for (let i = 0; i < this.ordered.length; i++) {
			if (this.ordered[i]) {
				caBA.fill(i % 360, 50, 50, bgaOptions.alpha);
				caBA.circle(this.ordered[i].x, this.ordered[i].y, bgaOptions.pointDiameter);
			}
		}
		if (this.ordered.length >= 10000) {
			bgaQuit();
		}
	}
}

class Phyllotaxis {
	constructor() {
		this.Framerate = 10;
		this.n = 0;
		this.c = 3;
		this.points = [];
		this.begin = 0;
	}
	reset() {
		this.n = 0;
		this.c = 3;
		this.points = [];
		this.begin = 0;
		caBA.angleMode(caBA.DEGREES);
		caBA.noStroke();
	}
	draw() {
		caBA.clear();
		caBA.translate(caBA.width / 2, caBA.height / 2);
		caBA.rotate(this.n * 0.2);
		for (let i = 0; i < this.n; i++) {
			const a = i * 137.5;
			const r = this.c * Math.sqrt(i);
			const x = r * caBA.cos(a);
			const y = r * caBA.sin(a);
			let hu = caBA.sin(this.begin + i * 0.5);
			hu = caBA.map(hu, -1, 1, 0, 360);
			const col = caBA.color(i % 360, 50, 50);
			caBA.fill(hu, 50, 50, bgaOptions.alpha);
			caBA.circle(x, y, bgaOptions.pointDiameter);
			if (x > bgaOptions.maxRadius || y > bgaOptions.maxRadius) {
				bgaQuit();
			}
		}
		this.n += 3;
		this.begin += 3;
	}
}

class TenPrint {
	constructor() {
		this.Framerate = 10;
		this.w = bgaOptions.pointDiameter * 4;
		this.grid = [];
		this.avaible = [];
		this.counter = 0;
		this.cols = 1;
		this.rows = 1;
		this.col;
	}
	reset() {
		this.grid = [];
		this.counter = 0;
		this.cols = Math.floor(caBA.width / this.w);
		this.rows = Math.floor(caBA.height / this.w);
		this.avaible = Array.from(Array(this.cols * this.rows).keys());
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				const index = j + i * this.rows;
				this.grid[index] = {
					dir: Math.random() > 0.5,
					x: i * this.w,
					y: j * this.w,
				};
			}
		}
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha);
		caBA.stroke(this.col);
		caBA.clear();
	}
	draw() {
		for (let i = 0; i < 5; i++) {
			const avaibleIndex = KadRandom.randomIndex(this.avaible);
			const index = this.avaible.splice(avaibleIndex, 1);
			const spot = this.grid[index];
			if (spot.dir) {
				caBA.line(spot.x, spot.y, spot.x + this.w, spot.y + this.w);
			} else {
				caBA.line(spot.x, spot.y + this.w, spot.x + this.w, spot.y);
			}
			if (this.avaible.length <= 0) {
				bgaQuit();
			}
		}
	}
}

class GameOfLife {
	constructor() {
		this.Framerate = 10;
		this.gridCurr;
		this.gridPrev;
		this.gridSTL;
		this.cols;
		this.rows;
		this.resolution = bgaOptions.pointDiameter * 2;
		this.resetting = null;
		this.col;
	}
	reset() {
		this.resetting = null;
		this.cols = Math.floor(caBA.width / this.resolution);
		this.rows = Math.floor(caBA.height / this.resolution);
		this.gridCurr = KadArray.createArray(this.cols, this.rows);
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.gridCurr[i][j] = Math.random() > 0.7;
			}
		}
		this.gridPrev = null;
		this.gridSTL = null;
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha);
		caBA.noStroke();
		caBA.fill(this.col);
	}
	draw() {
		caBA.clear();
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				const x = i * this.resolution;
				const y = j * this.resolution;
				if (this.gridCurr[i][j] == 1) {
					caBA.square(x, y, this.resolution - 1);
				}
			}
		}
		// logic
		let gridNext = KadArray.createArray(this.cols, this.rows);
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				const state = this.gridCurr[i][j];
				let sum = 0;
				const neighbors = this.countNeighbors(this.gridCurr, i, j);
				if (state == 0 && neighbors == 3) {
					gridNext[i][j] = 1;
				} else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
					gridNext[i][j] = 0;
				} else {
					gridNext[i][j] = state;
				}
			}
		}
		// Copy next to current
		this.gridSTL = this.copy2DArray(this.gridPrev);
		this.gridPrev = this.copy2DArray(this.gridCurr);
		this.gridCurr = this.copy2DArray(gridNext);
		if (this.resetting === null && JSON.stringify(this.gridCurr) === JSON.stringify(this.gridSTL)) {
			this.resetting = caBA.frameCount + caBA.frameRate() * 5;
		}
		if (this.resetting != null && caBA.frameCount >= this.resetting) {
			bgaQuit();
		}
	}

	countNeighbors(g, x, y) {
		let sum = 0;
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				let c = (x + i + this.cols) % this.cols;
				let r = (y + j + this.rows) % this.rows;
				sum += g[c][r];
			}
		}
		sum -= g[x][y];
		return sum;
	}
	copy2DArray(from) {
		return deepClone(from);
	}
}

class PongAI {
	constructor() {
		this.Framerate = 30;
		this.col;
		this.leng = 0;
		this.thickness;
		this.ball;
		this.pads = [];
	}
	reset() {
		this.leng = caBA.height / 4 < caBA.width / 6 ? caBA.height / 5 : caBA.width / 9; // size based in height : size based in width
		this.thickness = this.leng * 0.1;
		this.col = caBA.color(globalColors.elements.baseColor);
		this.col.setAlpha(bgaOptions.alpha);
		caBA.fill(this.col);
		caBA.rectMode(caBA.CENTER);
		caBA.ellipseMode(caBA.CENTER);
		caBA.angleMode(caBA.RADIANS);
		caBA.noStroke();
		this.ball = new PongAI.Ball(this.thickness / 2, null);
		this.pads[0] = new PongAI.Pad(this.thickness * 2, caBA.height / 2, this.thickness, this.leng, this.ball);
		this.pads[1] = new PongAI.Pad(caBA.width - this.thickness * 2, caBA.height / 2, this.thickness, this.leng, this.ball);
	}
	draw() {
		caBA.clear();
		this.pads[0].update();
		this.pads[1].update();
		this.pads[0].show();
		this.pads[1].show();
		this.ball.checkPads(this.pads);
		const hit = this.ball.update();
		if (hit != null) {
			this.ball.reset();
			this.pads[hit].scored();
		}
		this.ball.show();
		// show Scores
		caBA.textAlign(caBA.CENTER, caBA.TOP);
		caBA.textSize(this.leng / 2);
		caBA.text(this.pads[0].score, this.leng, this.thickness);
		caBA.text(this.pads[1].score, caBA.width - this.leng, this.thickness);
		// caBA.text(caBA.nf(caBA.frameRate(), 2, 1), caBA.width / 2, this.thickness)
	}
}
PongAI.Pad = class {
	constructor(x, y, w, h, ball) {
		this.acc = new p5.Vector(0, 0);
		this.pos = new p5.Vector(x, y);
		this.w = w;
		this.h = h;
		this.vel = new p5.Vector(0, 0);
		this.maxSpeed = caBA.random(8, 12);
		this.maxForce = caBA.random(10, 20);
		this.ball = ball;
		this.ballDir = this.pos.x < caBA.width / 2 ? -1 : 1;
		this.c = new p5.Vector(this.x + this.w, caBA.height / 2);
		this.score = 0;
	}
	update() {
		// ball direction
		if (Math.sign(this.ball.vel.x) == this.ballDir) {
			//ball following
			this.seek(this.ball.pos);
			this.arrive(this.ball.pos);
			this.calculate();
		} else if (this.score < 6) {
			//move to CENTER
			this.seek(this.ball.pos);
			this.arrive(this.ball.pos);
			this.calculate();
		} else {
			//move to CENTER
			this.seek(this.c);
			this.arrive(this.c);
			this.calculate();
		}

		// edge collosion
		if (this.pos.y + this.h / 2 > caBA.height) {
			this.pos.set(this.pos.x, caBA.height - this.h / 2);
		} else if (this.pos.y - this.h / 2 < 0) {
			this.pos.set(this.pos.x, this.h / 2);
		}
	}

	calculate() {
		const posX = this.pos.x;
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.pos.add(this.vel);
		this.pos.set(posX, this.pos.y); // keep the X-Position
		this.acc.set(0, 0);
	}

	seek(target) {
		let force = p5.Vector.sub(target, this.pos);
		force.setMag(this.maxSpeed);
		force.sub(this.vel);
		force.limit(this.maxForce);
		this.applyForce(force);
	}

	arrive(target) {
		let desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
		let d = desired.mag();
		if (d < this.h / 2) {
			let m = caBA.map(d, 0, this.h / 2, 0, this.maxspeed);
			desired.setMag(m);
		} else {
			desired.setMag(this.maxspeed);
		}
		let steer = p5.Vector.sub(desired, this.velocity);
		steer.limit(this.maxForce);
		this.applyForce(steer);
	}

	applyForce(force) {
		this.acc.add(force);
	}

	scored() {
		this.score++;
	}

	show() {
		caBA.push();
		caBA.translate(this.pos.x, this.pos.y);
		caBA.rect(0, 0, this.w, this.h, this.w / 4);
		// caBA.rotate((this.ballDir < 0) ? caBA.HALF_PI : -caBA.HALF_PI);
		// caBA.textAlign(caBA.CENTER, caBA.CENTER);
		// caBA.textSize(this.w);
		// caBA.text(`${caBA.nf(this.maxSpeed, 1, 1)}${caBA.nf(this.maxForce, 1, 0)}`, 0, 0);
		caBA.pop();
	}
};

PongAI.Ball = class {
	constructor(r, dir) {
		this.pos = new p5.Vector(caBA.width / 2, caBA.height / 2);
		this.vel = p5.Vector.random2D();
		this.r = r;
		this.maxSpeed = 10;
		this.nextDir = dir;
		this.reset();
	}
	reset() {
		if (this.nextDir === null) {
			this.nextDir = Math.random() > 0.5 ? 0 : -caBA.PI;
		} else {
			this.nextDir = this.pos.x < caBA.width / 2 ? -caBA.PI : 0;
		}
		this.pos.set(caBA.width / 2, caBA.height / 2);
		const angle = caBA.random(-caBA.radians(45), caBA.radians(45));
		this.vel.setHeading(angle + this.nextDir);
		this.vel.setMag(this.maxSpeed);
	}
	update() {
		this.pos.add(this.vel);
		if (this.pos.x + this.r < 0) {
			return 1; // add score to player 1
		} else if (this.pos.x + this.r > caBA.width) {
			return 0; // add score to player 0
		}
		if (this.pos.y - this.r < 0 || this.pos.y + this.r > caBA.height) {
			this.vel.y *= -1;
		}
		return null;
	}

	checkPads(pads) {
		//check left Pad
		let p = pads[0];
		if (this.pos.y - this.r < p.pos.y + p.h / 2 && this.pos.y + this.r > p.pos.y - p.h / 2 && this.pos.x - this.r < p.pos.x + p.w / 2) {
			if (this.pos.x > p.pos.x) {
				this.pos.x = p.pos.x + p.w / 2 + this.r;
				this.vel.x *= -1;
				//change angle
				const rad = caBA.radians(30);
				const diff = this.pos.y - p.pos.y;
				const angle = caBA.map(diff, -p.h / 2, p.h / 2, rad, -rad);
				this.vel.setHeading(this.vel.heading() - angle);
			}
		}
		//check right Pad
		p = pads[1];
		if (this.pos.y - this.r < p.pos.y + p.h / 2 && this.pos.y + this.r > p.pos.y - p.h / 2 && this.pos.x + this.r > p.pos.x - p.w / 2) {
			if (this.pos.x < p.pos.x) {
				this.pos.x = p.pos.x - p.w / 2 - this.r;
				this.vel.x *= -1;
				//change angle
				const rad = caBA.radians(30);
				const diff = this.pos.y - p.pos.y;
				const angle = caBA.map(diff, -p.h / 2, p.h / 2, rad, -rad);
				this.vel.setHeading(this.vel.heading() + angle);
			}
		}
	}
	show() {
		caBA.push();
		caBA.translate(this.pos.x, this.pos.y);
		caBA.circle(0, 0, this.r * 2);
		caBA.pop();
	}
};

//--------------------------------------------------------------
// class NEW {
//   constructor() {}
//   reset() {
//     this.Framerate = 30;
//     caBA.rectMode(caBA.CENTER);
//     caBA.ellipseMode(caBA.CENTER);
//     caBA.noStroke();
//   }
//   draw() {
//   }
// }
