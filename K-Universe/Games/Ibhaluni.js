const ibhaluniOptions = {
	get canvas() {
		return { w: (globalValues.mediaSizes.canvasSize.w * 3) / 4, h: globalValues.mediaSizes.canvasSize.h };
	},
	backgroundDay: null,
	backgroundNight: null,
	balloons: [],
	colors: ["red", "blue", "green", "gold", "orange", "DarkOrchid", "IndianRed"],
	nums: 15,
	started: false,
	bgcCanvas: "skyblue",
	sound: null,
	score: 0,
	misses: 0,
};

function clear_cl_Ibhaluni() {
	ibhaluniOptions.balloons = [];
	caIB.noLoop();
	caIB.background(globalValues.colors.elements.background);
}

function ibhaluniStart() {
	if (ibhaluniOptions.started) {
		ibhaluniOptions.started = false;
		dbID("idBtn_ibhaluniStart").textContent = "Start";
		caIB.noLoop();
	} else {
		ibhaluniOptions.started = true;
		ibhaluniReset();
		dbID("idBtn_ibhaluniStart").textContent = "Stop";
		caIB.loop();
	}
}

function ibhaluniReset() {
	ibhaluniOptions.balloons = [];
	ibhaluniOptions.score = 0;
	ibhaluniOptions.misses = 0;
	if (ibhaluniOptions.sound === null) {
		ibhaluniOptions.sound = new Audio("./Games/IbhaluniHH.mp3");
	}
	for (let i = 0; i < ibhaluniOptions.nums; i++) {
		ibhaluniOptions.balloons.push(new IbhaluniObj());
	}
}

const caIB = new p5((c) => {
	c.setup = function () {
		c.canv = c.createCanvas(ibhaluniOptions.canvas.w, ibhaluniOptions.canvas.h);
		c.canv.id("canvasIbhaluni");
		c.canv.parent("#idCanv_ibhaluni");
		c.canv.mousePressed(mousePushedIbhaluni);
		c.colorMode(c.HSL);
		c.noLoop();
		ibhaluniOptions.backgroundDay = caIB.loadImage("Games/ib_BGday.png");
		ibhaluniOptions.backgroundNight = caIB.loadImage("Games/ib_BGnight.png");
		c.redraw();
		c.cursor(c.CROSS);
	};
	c.draw = function () {
		c.background(globalValues.colors.darkmodeOn ? ibhaluniOptions.backgroundNight : ibhaluniOptions.backgroundDay);
		for (let balloon of ibhaluniOptions.balloons) {
			balloon.update();
			balloon.check();
		}
		for (let i = ibhaluniOptions.balloons.length - 1; i >= 0; i--) {
			ibhaluniOptions.balloons[i].show();
		}
		c.fill(globalValues.colors.elements.line);
		c.textSize(12);
		c.textAlign(c.LEFT, c.TOP);
		c.text(`score: ${ibhaluniOptions.score}`, 10, 10);
		c.textAlign(c.RIGHT, c.TOP);
		c.text(`misses: ${ibhaluniOptions.misses}`, ibhaluniOptions.canvas.w - 10, 10);
	};
}, "#idCanv_ibhaluni");

function ibhalumiResize() {
	caIB.resizeCanvas(ibhaluniOptions.canvas.w, ibhaluniOptions.canvas.h);
}

function mousePushedIbhaluni() {
	for (let balloon of ibhaluniOptions.balloons) {
		const checked = balloon.clicked();
		if (checked) return;
	}
}

class IbhaluniObj {
	constructor(id) {
		this.id = id;
		this.xSize = 30;
		this.ySize = 40;
		this.color = caIB.random(ibhaluniOptions.colors);
		this.x = Math.random() * (ibhaluniOptions.canvas.w - this.xSize) + this.xSize / 2;
		this.y = Math.random() * ibhaluniOptions.canvas.w * 1 + ibhaluniOptions.canvas.h;
		this.popping = false;
		this.poppingCounter = 0;
		this.poppingScl = 1;
		this.poppingSclLimits = [10, 25];
		this.falling = false;
		this.speedX = valueConstrain(Math.random(), 0.2, 1);
		this.speedY = valueConstrain(Math.random(), 0.2, 1) * 1.5;
		this.noiseSeed = Math.random() * 1000;
		this.mirrored = Math.random() > 0.5;
		this.angle = 0;
	}

	show() {
		if (this.popping) {
			this.poppingCounter++;
			this.poppingScl += 0.01;
		}
		caIB.push();
		caIB.translate(this.x, this.y);
		this.angle = valueMapping(this.speedX * caIB.noise(this.noiseSeed + this.y / 300) - this.speedX / 2, -this.speedX / 2, this.speedX / 2, -caIB.PI / 4, caIB.PI / 4);
		caIB.rotate(this.angle);
		// String hanging off the bottom
		caIB.stroke(0);
		caIB.strokeWeight(1);
		caIB.noFill();
		if (this.mirrored) {
			caIB.bezier(0, 24, -10, 40, 10, 70, 0, 80);
		} else {
			caIB.bezier(0, 24, 10, 40, -10, 60, 0, 70);
		}
		caIB.noStroke();
		caIB.fill(this.color);
		caIB.triangle(0, this.ySize / 2 - 2, 4, 24, -4, 24);
		if (!this.falling) {
			caIB.translate(0, this.ySize / 2 - (this.ySize / 2) * this.poppingScl);
			// caIB.rotate(this.angle);
			if (this.popping && this.poppingCounter >= this.poppingSclLimits[0]) {
				// Main balloon
				const factorW = valueMapping(this.poppingCounter, this.poppingSclLimits[0], this.poppingSclLimits[1], 0, this.xSize * this.poppingScl * 0.5);
				const factorH = valueMapping(this.poppingCounter, this.poppingSclLimits[0], this.poppingSclLimits[1], 0, this.ySize * this.poppingScl * 0.5);
				this.drawEllipse(factorW, factorH);
			} else {
				// Main balloon
				caIB.ellipse(0, 0, this.xSize * this.poppingScl, this.ySize * this.poppingScl);
				// Semi-transparent white ellipse for the highlight
				caIB.rotate(-this.angle);
				caIB.fill(255, 75);
				caIB.ellipse(-5, -8, 7 * this.poppingScl, 10 * this.poppingScl);
			}
		}
		caIB.pop();
	}

	drawEllipse(w = 0, h = 0) {
		let shape = [];
		const outerR = caIB.createVector(this.xSize * this.poppingScl * 0.5, this.ySize * this.poppingScl * 0.5);
		const innerR = caIB.createVector(w, h);
		caIB.angleMode(caIB.DEGREES);
		for (let a = 0; a < 360; a += 5) {
			shape.push(caIB.createVector(outerR.x * caIB.cos(a), outerR.y * caIB.sin(a)));
		}
		shape.push(caIB.createVector(outerR.x, 0));
		for (let a = 360; a >= 0; a -= 5) {
			shape.push(caIB.createVector(innerR.x * caIB.cos(a), innerR.y * caIB.sin(a)));
		}
		caIB.beginShape();
		for (const v of shape) {
			caIB.vertex(v.x, v.y);
		}
		caIB.endShape();
		caIB.angleMode(caIB.RADIANS);
	}

	update() {
		if (this.poppingCounter > this.poppingSclLimits[1] && this.falling == false) {
			if (dbID("idCb_ibhaluniSoundOutput").checked) {
				this.stop();
				this.play();
			}
			this.falling = true;
			ibhaluniOptions.score++;
		}
		this.x += this.speedX * caIB.noise(this.noiseSeed + this.y / 20) - this.speedX / 2;
		this.y += this.falling ? this.speedY * 3 : this.speedY * -1;
	}

	play() {
		ibhaluniOptions.sound.play();
	}

	stop() {
		if (ibhaluniOptions.sound.paused) return;
		ibhaluniOptions.sound.pause();
		ibhaluniOptions.sound.currentTime = 0;
	}

	check() {
		if (this.y < -(this.ySize * 2)) {
			this.resetBalloon();
			ibhaluniOptions.score--;
			ibhaluniOptions.misses++;
		} else if (this.falling && this.y > ibhaluniOptions.canvas.h + this.ySize) {
			this.resetBalloon();
		}
	}

	resetBalloon() {
		this.y = Math.random() * ibhaluniOptions.canvas.w + ibhaluniOptions.canvas.h;
		this.popping = false;
		this.poppingCounter = 0;
		this.poppingScl = 1;
		this.falling = false;
	}

	clicked() {
		if (!this.popping && !this.falling) {
			const diX = (caIB.mouseX - this.x) / (this.xSize / 2);
			const diY = (caIB.mouseY - this.y) / (this.ySize / 2);
			if (diX * diX + diY * diY < 1) {
				this.popping = true;
				return true;
			}
		}
	}
}
