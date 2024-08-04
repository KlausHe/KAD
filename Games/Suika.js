import { globalValues } from "../Settings/General.js";
import { dbID, initEL } from "../KadUtils/KadUtils.js";

const suikaOptions = {
	get canvas() {
		return { w: globalValues.mediaSizes.canvasSize.w * 0.66 + 2 * Game.wallPad, h: globalValues.mediaSizes.canvasSize.w };
	},
	background: null,
	playState: 3,
	playStates: {
		PLAYING: 1,
		PAUSED: 2,
		RESET: 3,
	},
	pausedBall: null,
	bgcCanvas: "skyblue",
	sounds: null,
	enableSounds: false,
	soundsPath: "./Games/SuikaAssets/sounds",
	imagesPath: "./Games/SuikaAssets/images",
};

initEL({ id: idBtn_suikaStart, fn: suikaStart, resetValue: "Start" });
initEL({ id: idBtn_suikaPause, fn: suikaPause, resetValue: "Pause" });
initEL({ id: idBtn_suikaRestart, fn: suikaRestart, resetValue: "Restart" });
initEL({ id: idCb_suikaSoundOutput, fn: suikaToggleSound, resetValue: false });

export function clear_cl_Suika() {
	idBtn_suikaStart.KadReset();
	idBtn_suikaPause.KadReset();
	idBtn_suikaRestart.KadReset();
	idCb_suikaSoundOutput.KadReset();
	Game.wallPad = Game.resizeUnits(0.06875); //0.06875
	Game.loseHeight = Game.resizeUnits(0.2);
	Game.bottomHeight = Game.resizeUnits(0.05);
	Game.suikaInitEngine();
	Game.initGame();
}

export function canvas_cl_Suika() {
	dbID(idImg_suikaNextFruit).src = `${suikaOptions.imagesPath}/circle0.png`;
	Game.render.canvas.style.width = `${suikaOptions.canvas.w}px`;
	Game.render.canvas.style.height = `${suikaOptions.canvas.h}px`;
}

function suikaStart() {
	if (suikaOptions.playState == suikaOptions.playStates.PLAYING) return;
	if (suikaOptions.playState == suikaOptions.playStates.PAUSED) {
		Game.previewBall = suikaOptions.pausedBall;
	}
	if (suikaOptions.playState == suikaOptions.playStates.RESET) {
		Game.stateIndex = GameStates.READY;
		Game.initGame();
		Game.startGame();
	}
	Game.runner.enabled = true;
	Game.showHighscore(Game.highscore);
	Game.gameOver(false);
	suikaOptions.playState = suikaOptions.playStates.PLAYING;
}

function suikaPause() {
	if (suikaOptions.playState != suikaOptions.playStates.PLAYING) return;
	suikaOptions.playState = suikaOptions.playStates.PAUSED;
	if (Game.previewBall) {
		suikaOptions.pausedBall = Game.previewBall;
	}
	Game.runner.enabled = false;
}

function suikaRestart() {
	suikaOptions.playState = suikaOptions.playStates.RESET;
	Game.previewBall = null;

	Render.stop(Game.render);
	World.clear(Game.engine.world);
	Engine.clear(Game.engine);
	Game.render.textures = {};
}

function suikaToggleSound() {
	suikaOptions.enableSounds = idCb_suikaSoundOutput.KadGet();
}

function mulberry32(a) {
	return function () {
		let t = (a += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
const rand = mulberry32(Date.now());
const { Engine, Render, World, Runner, MouseConstraint, Mouse, Composite, Bodies, Events } = Matter;
const friction = {
	friction: 0.006,
	frictionStatic: 0.006,
	frictionAir: 0,
	restitution: 0.1,
};

const GameStates = {
	MENU: 0,
	READY: 1,
	DROP: 2,
	LOSE: 3,
};

const Game = {
	engine: null,
	runner: null,
	render: null,
	mouseConstraint: null,
	previewBall: null,
	sounds: {
		click: new Audio(`${suikaOptions.soundsPath}/click.mp3`),
		pop0: new Audio(`${suikaOptions.soundsPath}/pop0.mp3`),
		pop1: new Audio(`${suikaOptions.soundsPath}/pop1.mp3`),
		pop2: new Audio(`${suikaOptions.soundsPath}/pop2.mp3`),
		pop3: new Audio(`${suikaOptions.soundsPath}/pop3.mp3`),
		pop4: new Audio(`${suikaOptions.soundsPath}/pop4.mp3`),
		pop5: new Audio(`${suikaOptions.soundsPath}/pop5.mp3`),
		pop6: new Audio(`${suikaOptions.soundsPath}/pop6.mp3`),
		pop7: new Audio(`${suikaOptions.soundsPath}/pop7.mp3`),
		pop8: new Audio(`${suikaOptions.soundsPath}/pop8.mp3`),
		pop9: new Audio(`${suikaOptions.soundsPath}/pop9.mp3`),
		pop10: new Audio(`${suikaOptions.soundsPath}/pop10.mp3`),
	},
	stateIndex: GameStates.READY,
	score: 0,
	highscore: 0,
	wallPad: null,
	loseHeight: null,
	bottomHeight: null,
	fruitsMerged: [],
	calculateScore: function () {
		const score = Game.fruitsMerged.reduce((total, count, sizeIndex) => {
			const value = Game.fruitSizes[sizeIndex].scoreValue * count;
			return total + value;
		}, 0);
		Game.score = score;
		if (score > Game.highscore) {
			Game.highscore = score;
			Game.showHighscore(`*${score}*`);
		}
		dbID(idLbl_suikaScore).textContent = score;
	},
	get fruitSizes() {
		return [
			{ radius: Game.resizeUnits(0.0375), scoreValue: 1, img: `${suikaOptions.imagesPath}/circle0.png` }, //raduis 24(px)
			{ radius: Game.resizeUnits(0.05), scoreValue: 3, img: `${suikaOptions.imagesPath}/circle1.png` }, //raduis 32(px)
			{ radius: Game.resizeUnits(0.0625), scoreValue: 6, img: `${suikaOptions.imagesPath}/circle2.png` }, //raduis 40(px)
			{ radius: Game.resizeUnits(0.0875), scoreValue: 10, img: `${suikaOptions.imagesPath}/circle3.png` }, //raduis 56(px)
			{ radius: Game.resizeUnits(0.1), scoreValue: 15, img: `${suikaOptions.imagesPath}/circle4.png` }, //raduis 64(px)
			{ radius: Game.resizeUnits(0.1125), scoreValue: 21, img: `${suikaOptions.imagesPath}/circle5.png` }, //raduis 72(px)
			{ radius: Game.resizeUnits(0.13125), scoreValue: 28, img: `${suikaOptions.imagesPath}/circle6.png` }, //raduis 84(px)
			{ radius: Game.resizeUnits(0.15), scoreValue: 36, img: `${suikaOptions.imagesPath}/circle7.png` }, //raduis 96(px)
			{ radius: Game.resizeUnits(0.2), scoreValue: 45, img: `${suikaOptions.imagesPath}/circle8.png` }, //raduis 128(px)
			{ radius: Game.resizeUnits(0.25), scoreValue: 55, img: `${suikaOptions.imagesPath}/circle9.png` }, //raduis 160(px)
			{ radius: Game.resizeUnits(0.3), scoreValue: 66, img: `${suikaOptions.imagesPath}/circle10.png` }, //raduis 192(px)
		];
	},
	currentFruitSize: 0,
	nextFruitSize: 0,
	setNextFruitSize: () => {
		Game.nextFruitSize = Math.floor(rand() * 5);
		dbID(idImg_suikaNextFruit).src = `${suikaOptions.imagesPath}/circle${Game.nextFruitSize}.png`;
	},
	resizeUnits: (size) => {
		return suikaOptions.canvas.w * size;
	},
	showHighscore: function (score) {
		dbID(idLbl_suikaHighscore).textContent = score;
	},
	gameOver: (state) => {
		idLbl_suikaGameOver.textContent = state ? "GameOver" : "";
	},
	suikaInitEngine: function () {
		this.engine = Engine.create();
		this.runner = Runner.create();
		this.render = Render.create({
			element: dbID("idCanv_suika"),
			engine: Game.engine,
			options: {
				width: suikaOptions.canvas.w,
				height: suikaOptions.canvas.h,
				wireframes: false,
				background: "#ffdcae",
			},
		});

		this.mouse = Mouse.create(Game.render.canvas);
		this.mouseConstraint = MouseConstraint.create(Game.engine, {
			mouse: this.mouse,
			constraint: {
				stiffness: 0.2,
				render: {
					visible: false,
				},
			},
		});
		this.render.mouse = this.mouse;
	},
	initGame: function () {
		Render.run(Game.render);
		Runner.run(Game.runner, Game.engine);
		Game.fruitsMerged = Array.apply(null, Array(Game.fruitSizes.length)).map(() => 0);
	},

	startGame: function () {
		if (suikaOptions.enableSounds) {
			Game.sounds.click.play();
		}

		const wallProps = {
			isStatic: true,
			render: { fillStyle: "#FFEEDB" },
			...friction,
		};
		const topProp = {
			isStatic: true,
			render: {
				fillStyle: "#0000AA",
				opacity: 0.2,
			},
			...friction,
		};

		const gameStatics = [
			Bodies.rectangle(Game.wallPad / 2, suikaOptions.canvas.h / 2, Game.wallPad, suikaOptions.canvas.h, wallProps), // Left
			Bodies.rectangle(suikaOptions.canvas.w - Game.wallPad / 2, suikaOptions.canvas.h / 2, Game.wallPad, suikaOptions.canvas.h, wallProps), // Right
			Bodies.rectangle(suikaOptions.canvas.w / 2, suikaOptions.canvas.h + Game.wallPad / 2 - Game.bottomHeight, suikaOptions.canvas.w, Game.wallPad, wallProps), // Bottom
			Bodies.rectangle(suikaOptions.canvas.w / 2, Game.loseHeight, suikaOptions.canvas.w, 6, topProp), // Top
		];

		// turns off collisions
		gameStatics[3].collisionFilter = {
			group: -1,
			category: 2,
			mask: 0,
		};

		Composite.add(Game.engine.world, gameStatics);
		Game.calculateScore();
		Game.previewBall = Game.generateFruitBody(suikaOptions.canvas.w / 2, Game.loseHeight / 2, 0, { isStatic: true });

		Composite.add(Game.engine.world, Game.previewBall);

		setTimeout(() => {
			Game.stateIndex = GameStates.READY;
		}, 250);

		Events.on(Game.mouseConstraint, "mouseup", function (e) {
			Game.addFruit(e.mouse.position.x);
		});

		Events.on(Game.mouseConstraint, "mousemove", function (e) {
			if (Game.stateIndex !== GameStates.READY) return;
			if (Game.previewBall === null) return;
			Game.previewBall.position.x = Math.min(suikaOptions.canvas.w - Game.wallPad - Game.previewBall.circleRadius, Math.max(Game.wallPad + Game.previewBall.circleRadius, e.mouse.position.x));
		});

		Events.on(Game.engine, "collisionStart", function (e) {
			for (let i = 0; i < e.pairs.length; i++) {
				const { bodyA, bodyB } = e.pairs[i];

				if (bodyA.isStatic || bodyB.isStatic) continue; // Skip if collision is wall

				if (bodyA.position.y + bodyA.circleRadius <= Game.loseHeight || bodyB.position.y + bodyB.circleRadius <= Game.loseHeight) {
					// Lost Game
					Game.loseGame();
					return;
				}
				if (bodyA.sizeIndex !== bodyB.sizeIndex) continue; // Skip different sizes
				if (bodyA.popped || bodyB.popped) continue; // Skip if already popped
				let newSize = bodyA.sizeIndex + 1;

				// Go back to smallest size
				if (bodyA.circleRadius >= Game.fruitSizes[Game.fruitSizes.length - 1].radius) {
					newSize = 0;
				}

				Game.fruitsMerged[bodyA.sizeIndex] += 1;

				// Therefore, circles are same size, so merge them.
				const midPosX = (bodyA.position.x + bodyB.position.x) / 2;
				const midPosY = (bodyA.position.y + bodyB.position.y) / 2;

				bodyA.popped = true;
				bodyB.popped = true;

				if (suikaOptions.enableSounds) {
					Game.sounds[`pop${bodyA.sizeIndex}`].play();
				}
				Composite.remove(Game.engine.world, [bodyA, bodyB]);
				Composite.add(Game.engine.world, Game.generateFruitBody(midPosX, midPosY, newSize));
				Game.addPop(midPosX, midPosY, bodyA.circleRadius);
				Game.calculateScore();
			}
		});
	},

	addPop: function (x, y, r) {
		const circle = Bodies.circle(x, y, r, {
			isStatic: true,
			collisionFilter: { mask: 0x0040 },
			angle: rand() * (Math.PI * 2),
			render: {
				sprite: {
					texture: `${suikaOptions.imagesPath}/pop.png`,
					xScale: r / 384,
					yScale: r / 384,
				},
			},
		});

		Composite.add(Game.engine.world, circle);
		setTimeout(() => {
			Composite.remove(Game.engine.world, circle);
		}, 150);
	},

	loseGame: function () {
		Game.stateIndex = GameStates.LOSE;
		Game.runner.enabled = false;
		Game.gameOver(true);
		suikaStart();
	},

	lookupFruitIndex: function (radius) {
		const sizeIndex = Game.fruitSizes.findIndex((size) => size.radius == radius);
		if (sizeIndex === undefined) return null;
		if (sizeIndex === Game.fruitSizes.length - 1) return null;
		return sizeIndex;
	},

	generateFruitBody: function (x, y, sizeIndex, extraConfig = {}) {
		const fruit = Game.fruitSizes[sizeIndex];
		const imgSize = (1024 - 20) * 0.5; // 20px for image inaccuracies
		const circle = Bodies.circle(x, y, fruit.radius, {
			...friction,
			...extraConfig,
			render: { sprite: { texture: fruit.img, xScale: fruit.radius / imgSize, yScale: fruit.radius / imgSize } }, //512
		});
		circle.sizeIndex = sizeIndex;
		circle.popped = false;
		return circle;
	},

	addFruit: function (x) {
		if (Game.stateIndex !== GameStates.READY) return;

		Game.stateIndex = GameStates.DROP;
		const latestFruit = Game.generateFruitBody(x, Game.loseHeight * 0.5, Game.currentFruitSize);
		Composite.add(Game.engine.world, latestFruit);

		Game.currentFruitSize = Game.nextFruitSize;
		Game.setNextFruitSize();
		Game.calculateScore();

		Composite.remove(Game.engine.world, Game.previewBall);
		Game.previewBall = Game.generateFruitBody(Game.render.mouse.position.x, Game.loseHeight * 0.5, Game.currentFruitSize, {
			isStatic: true,
			collisionFilter: { mask: 0x0040 },
		});

		setTimeout(() => {
			if (Game.stateIndex === GameStates.DROP) {
				Composite.add(Game.engine.world, Game.previewBall);
				Game.stateIndex = GameStates.READY;
			}
		}, 500);
	},
};
