import kaboom from "kaboom";
import "kaboom/global";

// Initialize content
kaboom({
	font: "sink",
	background: [32, 104, 229],
});

// Load the sprites
loadSprite("ballora", "sprites/ballora.png.png");
loadSprite("enemy", "sprites/enm.png.png");
loadSprite("bonus", "sprites/bonus.png");

// Load the sounds
loadSound("background", "sounds/bgm.wav");
loadSound("kill", "sounds/kill.wav");
loadSound("bonus", "sounds/bonuss.wav");
loadSound("done", "sounds/complete.wav");

// Define variables
let SPEED = 620;
let BSPEED = 2;
let SCORE = 0;
let LIVES = 3;
let scoretext;
let livestext;
let bg = false;
let backgroundMusic;
let invincible = false;

// Function to display score
const displayScore = () => {
	if (scoretext) {
		destroy(scoretext);
	}
	scoretext = add([
		text("Score: " + SCORE),
		scale(1),
		pos(width() - 151, 51),
	]);
};

// Function to display lives
const displayLives = () => {
	if (livestext) {
		destroy(livestext);
	}
	livestext = add([
		text("Lives: " + LIVES),
		scale(1),
		pos(10, 51),
	]);
};

const playBackgroundMusic = () => {
	if (!bg) {
		backgroundMusic = play("background", { loop: true, volume: 0.4 });
		bg = true;
	}
};

const player = add([
	sprite("ballora"),
	pos(120, 80),
	area(),
	scale(1),
	body(),
]);

setInterval(() => {
	for (let i = 0; i < 4; i++) {
		let x = rand(0, width());
		let y = height();
		let enemySpeed = rand(BSPEED, BSPEED + 3);
		let enemyScale = rand(2, 4);

		let enemy = add([
			sprite("enemy"),
			pos(x, y),
			area(),
			scale(enemyScale),
			"bug"
		]);
		enemy.onUpdate(() => {
			enemy.moveTo(enemy.pos.x, enemy.pos.y - enemySpeed);
		});
	}

	let x = rand(0, width());
	let y = height();
	let bonusSpeed = rand(BSPEED, BSPEED + 3);
	let bonusScale = rand(0.2, 0.3);

	let bonus = add([
		sprite("bonus"),
		pos(x, y),
		area(),
		scale(bonusScale),
		"bonus"
	]);
	bonus.onUpdate(() => {
		bonus.moveTo(bonus.pos.x, bonus.pos.y - bonusSpeed);
	});
	if (BSPEED < 13) {
		BSPEED += 0.5;
	}
}, 4000);

player.onCollide("bug", (bug) => {
	if (!invincible) {
		play("done");
		destroy(bug);
		addKaboom(player.pos);
		LIVES -= 1;
		displayLives();
		invincible = true;
		player.opacity = 0.5;
		wait(2, () => {
			invincible = false;
			player.opacity = 1;
		});
		if (LIVES <= 0) {
			destroy(player);
			gameOverScreen();
		}
	}
});

player.onCollide("bonus", (bonus) => {
	play("bonus");
	destroy(bonus);
	SCORE += 1;
	displayScore();
});

onKeyDown("left", () => {
	// Play background music
	playBackgroundMusic();
	player.move(-SPEED, 0);
});
onKeyDown("right", () => {
	// Play background music
	playBackgroundMusic();
	player.move(SPEED, 0);
});
onKeyDown("up", () => {
	// Play background music
	playBackgroundMusic();
	player.move(0, -SPEED);
});
onKeyDown("down", () => {
	// Play background music
	playBackgroundMusic();
	player.move(0, SPEED);
});

displayScore();
displayLives();

const startScreen = add([
	text("Press Enter to Start"),
	pos(width() / 2 - 300, height() / 2 - 20),
	scale(2),
]);

onKeyPress("enter", () => {
	destroy(startScreen);
	startGame();
});

const startGame = () => {
};

const gameOverScreen = () => {
	add([
		text("Game Over\nPress R to Restart"),
		scale(2),
		color(255, 0, 0),
		pos(width() / 2 - 170, height() / 2 - 20),
	]);
	onKeyPress("r", () => {
		location.reload();
	});
};
