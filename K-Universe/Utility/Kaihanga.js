const kaihangaOptions = {
	width: 200,
	height: 200,
	maxLength: 10,
	entries: [],
	wheel: null,
	spinning: false,
	startColor: null,
};

function clear_cl_Kaihanga() {
	kaihangaOptions.entries = [];
	kaihangaOptions.spinning = false;
	clearTable("idTabBody_Kaihanga");
	caKA.noLoop();
	caKA.clear();
	kaihangaOptions.startColor = caKA.floor(caKA.random(5, globalValues.colors.array.length));
	kaihangaCreateRandomSet();
	kaihangaUpdate();
	resetInput("idVin_kaihangaEntry", "Enter Options");
	dbID("idVin_kaihangaEntry").maxLength = kaihangaOptions.maxLength;

	dbID("idLbl_kaihangaResult").textContent = "Gewinner: ...";
	dataForLabel("idLbl_kaihangaResult");
	dbIDStyle("idLbl_kaihangaResult").backgroundColor = "";
	dbIDStyle("idCanv_kaihanga").cursor = "pointer";
}

const caKA = new p5((c) => {
	c.setup = function () {
		c.canv = c.createCanvas(kaihangaOptions.width, kaihangaOptions.height);
		c.canv.id("canvasKaihanga");
		c.canv.parent("#idCanv_kaihanga");
		c.canv.mousePressed(mousePushedKaihanga);
		c.colorMode(c.HSL);
		c.angleMode(c.DEGREES);
		c.noLoop();
	};

	c.draw = function () {
		if (kaihangaOptions.entries.length > 0) {
			kaihangaOptions.wheel.update();
			kaihangaOptions.wheel.draw();
		}
	};
}, "#idCanv_kaihanga");

function mousePushedKaihanga() {
	let speed = caKA.floor(caKA.map(caKA.mouseX, 0, kaihangaOptions.width, 1, 18));
	kaihangaStart(speed);
}

//gameLogic
function kaihangaWheelUpdate() {
	let segOptions = [];
	for (let i = 0; i < kaihangaOptions.entries.length; i++) {
		const col = globalValues.colors.array[(i + kaihangaOptions.startColor) % globalValues.colors.array.length];
		segOptions.push({
			fillStyle: col,
			strokeStyle: utilsColor.stateAsArray(col, "HSL"),
			text: kaihangaOptions.entries[i],
			num: i,
		});
	}
	kaihangaOptions.wheel = new KaihangaWheel({
		innerR: (kaihangaOptions.width * 0.1) / 2,
		outerR: (kaihangaOptions.width * 0.8) / 2,
		textFontSize: getCssRoot("fontSize", true),
		segments: segOptions,
		lineWeigth: 1,
		animation: {
			duration: 2,
			spins: 4,
			callbackFinished: kaihangaResult,
			backgroundColor: globalValues.colors.elements.background,
		},
	});
	kaihangaOptions.wheel.draw();
}

function kaihangaStart(speed) {
	if (kaihangaOptions.spinning == false) {
		kaihangaCreateRandomSet();
		kaihangaUpdate();
		kaihangaOptions.wheel.animation.spins = speed;
		kaihangaOptions.wheel.animation.duration = 1 / (speed * 10);
		kaihangaOptions.wheel.startAnimation();
		kaihangaOptions.spinning = true;
	}
}

function kaihangaCreateRandomSet() {
	if (kaihangaOptions.entries.length == 0) {
		let rand = caKA.floor(caKA.random(4, 8));
		for (let i = 0; i < rand; i++) {
			kaihangaAddOption(kaihangaCreateOption());
		}
	}
}

function kaihangaResult(winner) {
	kaihangaOptions.spinning = false;
	dbID("idLbl_kaihangaResult").textContent = "Gewinner: " + winner.text;
	dataForLabel("idLbl_kaihangaResult", winner.text);
}

function kaihangaClearRow(index) {
	kaihangaOptions.entries.splice(index, 1);
	kaihangaUpdate();
}

function kaihangaEntrySubmit() {
	if (dbID("idVin_kaihangaEntry").value.trim() == "") {
		kaihangaAddOption();
	}
}

function kaihangaAddOption(randOpt = null) {
	if (!kaihangaOptions.spinning) {
		let value = randOpt;
		if (randOpt == null) {
			value = dbID("idVin_kaihangaEntry").value.trim();
			if (value == "") {
				value = kaihangaCreateOption();
			}
		}
		kaihangaOptions.entries.push(value);
		dbID("idVin_kaihangaEntry").value = "";
	}
	kaihangaUpdate();
}

function kaihangaCreateOption() {
	let opt = netsaonaOptions.data.RandomWord.filter((op) => {
		return op.length <= kaihangaOptions.maxLength;
	});
	return randomObject(opt);
}

function kaihangaUpdate() {
	if (!kaihangaOptions.spinning) {
		dbID("idLbl_kaihangaResult").innerHTML = "Gewinner: ...";
		dataForLabel("idLbl_kaihangaResult");
		dbIDStyle("idLbl_kaihangaResult").backgroundColor = "";
		dbIDStyle("idLbl_kaihangaResult").color = "";
		kaihangaWheelUpdate();
		clearTable("idTabBody_Kaihanga");
		for (let i = 0; i < kaihangaOptions.entries.length; i++) {
			let row = insertTableRow("idTabBody_Kaihanga");
			row.id = `idRow_kaihanga_${i}`;
			tableAddCell(row, {
				names: ["kaihanga", i],
				type: "Btn",
				subGroup: "subgrid",
				img: "trash",
				ui: {
					uiSize: "square",
					uiType: "transparent",
				},
				cellStyle: {
					textAlign: "center",
					cursor: "pointer",
				},
				cellOnclick: function () {
					kaihangaClearRow(i);
				},
			});
			tableAddCell(row, {
				names: ["kaihanga", i],
				type: "Colbox",
				color: kaihangaOptions.wheel.segments[i].fillStyle,
				style: {
					textAlign: "center",
				},
			});
			tableAddCell(row, {
				names: ["kaihanga", i],
				type: "Lbl",
				text: kaihangaOptions.entries[i],
				copy: true,
			});
		}
	}
}

class KaihangaWheel {
	constructor(options) {
		this.segments = options.segments;
		this.innerR = options.innerR;
		this.outerR = options.outerR;
		this.middleR = (this.outerR + this.innerR) / 2;
		this.angle = 0;
		this.pi = Math.PI / 8;
		this.animation = options.animation;
		this.lineWeight = options.lineWeigth;
		this.background = options.animation.backgroundColor;
		this.winner;
		this.winnerAngle = 0;
	}

	startAnimation() {
		this.winnerAngle = caKA.random(0, 360);
		this.winner = caKA.floor((this.winnerAngle * this.segments.length) / 360);
		caKA.loop();
	}

	update() {
		if (this.pi < Math.PI) {
			const factor = Math.cos(this.pi + Math.PI) + 1;
			this.angle = factor * 360 * this.animation.spins + this.winnerAngle;
			this.pi += 0.01;
			this.draw();
		} else {
			caKA.noLoop();
			kaihangaResult(this.segments[this.winner]);
		}
	}

	draw() {
		caKA.clear();
		caKA.push();
		caKA.translate(kaihangaOptions.width / 2, kaihangaOptions.height / 2);
		caKA.rotate((this.angle + 90) * -1);
		caKA.noFill();
		caKA.stroke(globalValues.colors.elements.line);
		caKA.strokeWeight(this.lineWeight);
		//Segments
		let seg = 360 / this.segments.length;
		for (let i = 0; i < this.segments.length; i++) {
			let a = seg * i;
			let b = seg * (i + 1);
			let xi = caKA.cos(a) * this.innerR;
			let yi = caKA.sin(a) * this.innerR;
			let xa = caKA.cos(a) * this.outerR;
			let ya = caKA.sin(a) * this.outerR;
			caKA.fill(this.segments[i].fillStyle);
			caKA.arc(0, 0, this.outerR * 2, this.outerR * 2, a, b);
			caKA.line(xi, yi, xa, ya);
			caKA.fill(this.background);
			caKA.arc(0, 0, this.innerR * 2, this.innerR * 2, a, b);
			//text
			caKA.push();
			caKA.noStroke();
			caKA.fill(this.segments[i].strokeStyle);
			caKA.textAlign(caKA.CENTER, caKA.CENTER);
			caKA.rotate(b - seg / 2);
			caKA.translate(this.middleR, 0);
			caKA.text(this.segments[i].text, 0, 0);
			caKA.pop();
		}
		if (kaihangaOptions.entries.length > 0) {
			caKA.fill(this.background);
			caKA.circle(0, 0, this.innerR * 2);
		}
		caKA.pop();
		if (kaihangaOptions.entries.length > 0) {
			caKA.push();
			let cx = 1.5;
			let cy = this.innerR * 1.5;
			caKA.translate(kaihangaOptions.width / 2, kaihangaOptions.height / 2 - this.outerR - this.lineWeight);
			caKA.noStroke();
			caKA.fill(globalValues.colors.elements.line);
			caKA.push();
			caKA.rotate(135);
			caKA.rect(-cx, -cx, 2 * cx, cy, cx);
			caKA.pop();
			caKA.push();
			caKA.rotate(225);
			caKA.rect(-cx, -cx, 2 * cx, cy, cx);
			caKA.pop();
			caKA.pop();
		}
	}
}
