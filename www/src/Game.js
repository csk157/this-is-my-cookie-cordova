Cookie.Game = function (game) {
	this.coinCounter = null;
	this.coinText = null;
	this.scoreText = null;
	this.healthText = null;
	this.cookie = null;

	this.statusBar = null;
	this.statusBarMargin = 0;
	this.statusBarTextHeight = 0;

	this.coins = null;
	this.healthPieces = null;
	this.enemies = [];
	this.enemiesPool = [];
	this.enemySprites = null;

	this.randomGenerator = null;
	this.barCoin = null;
	this.pauseMenu = null;
	this.enemyAdder = null;

	this.damageTaken = false;
	this.timePlayed = 0;
	this.enemiesKilled = 0;
	this.timesBitten = 0;
	this.healthCollected = 0;
	this.onPauseListener = undefined;
};

Cookie.Game.prototype = {
	getTextStyle: function () {
		return { font: this.statusBarTextHeight + "px Sigmar One", fill: "#ffffff", align: "center" };
	},
	addStatusBar: function () {
		this.statusBar = this.add.group();

		this.scoreText = this.add.text(this.statusBarMargin, Cookie.startY + this.statusBarMargin, "score: 0", this.getTextStyle());
		this.healthText = this.add.text(Cookie.convertWidth(480) - this.statusBarMargin, Cookie.startY + this.statusBarMargin, "100/100", this.getTextStyle());
		this.healthText.anchor.setTo(1, 0);

		this.coinCounter = this.add.group();
		
		// this.barCoin = this.add.sprite(0, Cookie.yPos(this.statusBarMargin), 'coin');
		// this.barCoin.anchor.setTo(0, 0);
		// this.coinCounter.add(this.barCoin);

		// var multiplierStyle = this.getTextStyle();
		// multiplierStyle.font = this.barCoin.height + "px Sigmar One";

		// var multiplierText = this.add.text(this.coinCounter.width + this.statusBarMargin, this.barCoin.getBounds().bottom, "x", multiplierStyle);
		// multiplierText.anchor.setTo(0, 1);
		// this.coinCounter.add(multiplierText);

		// var coinTextStyle = this.getTextStyle();
		// coinTextStyle.font = this.barCoin.height + "px Sigmar One";

		// this.coinText = this.add.text(this.coinCounter.width + this.statusBarMargin, this.barCoin.getBounds().bottom, "0", coinTextStyle);
		// this.coinText.anchor.setTo(0, 1);

		// this.coinCounter.add(this.coinText);

		// this.coinCounter.x = Cookie.convertWidth(480 / 2) - this.coinCounter.width / 2;
		
		this.pause = this.add.text(Cookie.visibleRect.centerX, Cookie.startY + this.statusBarMargin, "||", this.getTextStyle());
		this.pause.inputEnabled = true;
		this.pause.events.onInputUp.add(function() {
			this.pauseGame();
		}, this, 50);

		this.statusBar.add(this.scoreText);
		this.statusBar.add(this.healthText);
		// this.statusBar.add(this.coinCounter);

		this.updateHealth(this.cookie.health, this.cookie.maxHealth);

	},
	pauseGame: function () {
		this.add.tween(this.pause.scale).to({ x: 0.85, y: 0.9 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
		this.game.paused = true;
		this.pauseMenu.visible = true;
	},
	resumeGame: function () {
		this.game.paused = false;
		this.pauseMenu.visible = false;
	},
	mainMenu: function () {
		this.game.paused = false;
		this.state.start("MainMenu");
	},
	addCookie: function () {
		// Create cookie and setting callbacks
		this.cookie = new Cookie.Cookie(this);
		this.cookie.onScoreChanged = function (newScore) {
			this.updateScore(newScore);
		}.bind(this);

		this.cookie.onCoinsChanged = function (newCoins) {
			this.updateCoins(newCoins);
		}.bind(this);

		this.cookie.onHealthChanged = function (newHealth, maxHealth) {
			this.updateHealth(newHealth, maxHealth);
		}.bind(this);

		this.cookie.onHealthCollected = function () {
			Cookie.achievements.incrementChocolateLover();
		}.bind(this);

		this.cookie.onBitten = function () {
			this.damageTaken = true;
			Cookie.achievements.incrementBattleScars();
		}.bind(this);

		this.cookie.onKilled = function (score, coins) {
			this.state.start('GameResult', true, false, score, coins);
		}.bind(this);
	},
	onEnemyDied: function () {
		Cookie.achievements.incrementTheFeared();
		this.enemiesKilled++;

		Cookie.achievements.unlockNoCookieForYou(this.enemiesKilled, this.damageTaken);
		Cookie.achievements.unlockDamaged(this.enemiesKilled);
		Cookie.achievements.unlockUnstopable(this.enemiesKilled);

	},
	addCoin: function () {
		var pos = this.findSpawnPosition('coin');
		var coin = this.coins.getFirstExists(false);
		coin.reset(pos.x, pos.y);
		coin.alpha = 1;
		coin.scale.setTo(1, 1);

		this.add.tween(coin.scale).to({ x: 0.85, y: 0.9 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

		var tw = this.add.tween(coin).to( { alpha: 0 }, 500, Phaser.Easing.Exponential.Out, false, Phaser.Timer.SECOND * 5);
		tw.onComplete.add(function (obj) {	
				this.removeCoin(obj);
			}, this);
		tw.start();

	},
	addHealthPiece: function () {
		var pos = this.findSpawnPosition('chocolate-piece');
		var choco = this.healthPieces.getFirstExists(false);
		choco.reset(pos.x, pos.y);
		choco.alpha = 1;
		choco.scale.setTo(1, 1);
		choco.angle = -10;

		this.add.tween(choco).to({ angle: 10 }, 400, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

		var tw = this.add.tween(choco).to( { alpha: 0 }, 500, Phaser.Easing.Exponential.Out, false, Phaser.Timer.SECOND * 5);
		tw.onComplete.add(function (obj) {	
				this.removeHealthPiece(obj);
			}, this);
		tw.start();
	},
	updateScore: function (newScore) {
		this.scoreText.text = "score: " + Math.round(newScore);
	},
	updateHealth: function (newHealth, maxHealth) {
		this.healthText.text = Math.round(newHealth) + "/" + maxHealth;
	},
	updateCoins: function (newCoins) {
		this.coinText.text = newCoins;
		this.add.tween(this.barCoin.scale).to( { x: 0.7, y: 0.88 }, 200, Phaser.Easing.Exponential.InOut, true, 0, 0, true);
	},
	removeCoin: function (coin) {
		this.tweens.removeFrom(coin);
		coin.kill();
	},
	removeHealthPiece: function (piece) {
		this.tweens.removeFrom(piece);
		piece.kill();
	},
	findSpawnPosition: function (imageName) {
		var img = this.cache.getImage(imageName);

		var imgRect = new Phaser.Rectangle(
			this.randomGenerator.integerInRange(img.width / 2, Cookie.visibleRect.right - img.width),
			this.randomGenerator.integerInRange(Cookie.startY + img.height / 2, Cookie.visibleRect.bottom - img.height),
			img.width,
			img.height
		);

		// repeat until the random position does not cros anything
		while (
			this.cookie.sprite.getBounds().intersects(imgRect) ||
			!this.world.getBounds().containsRect(imgRect) ||
			this.physics.arcade.overlap(this.coins, imgRect) ||
			this.physics.arcade.overlap(this.healthPieces, imgRect) ||
			this.physics.arcade.overlap(this.enemySprites, imgRect)
		) {
			imgRect.x = this.randomGenerator.integerInRange(imgRect.width / 2, Cookie.visibleRect.right - imgRect.width);
			imgRect.y = this.randomGenerator.integerInRange(Cookie.startY + imgRect.height / 2, Cookie.visibleRect.bottom - imgRect.height);
		}

		return { x: imgRect.x, y: imgRect.y };
	},
	spawnEnemy: function () {
		var pos = this.findSpawnPosition('red-enemy');

		var enemy = null;
		if (this.enemiesPool.length > 0) {
			enemy = _.last(this.enemiesPool);
			this.enemiesPool = _.without(this.enemiesPool, enemy);
			enemy.reset(pos);
		} else {
			enemy = new Cookie.RedEnemy(this, { x: pos.x, y: pos.y }, this.cookie);
		}

		this.enemySprites.add(enemy.sprite);
		this.enemies.push(enemy);
	},
	removeEnemy: function (enemy) {
		this.enemies = _.without(this.enemies, enemy);
		this.enemiesPool.push(enemy);
		this.enemySprites.remove(enemy.sprite);
	},
	create: function () {
		this.statusBarMargin = Cookie.convertHeight(5);
		this.statusBarTextHeight = Cookie.convertHeight(15);
		this.randomGenerator = new Phaser.RandomDataGenerator();
		
		this.add.sprite(0, 0, 'bg');
		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.coins = this.add.group();
		this.coins.createMultiple(2, 'coin');
		this.coins.setAll('anchor.x', 0.5);
		this.coins.setAll('anchor.y', 0.5);
		this.physics.arcade.enable(this.coins);

		this.healthPieces = this.add.group();
		this.healthPieces.createMultiple(2, 'chocolate-piece');
		this.healthPieces.setAll('anchor.x', 0.5);
		this.healthPieces.setAll('anchor.y', 0.5);
		this.physics.arcade.enable(this.healthPieces);

		this.enemySprites = this.add.group();
		this.addCookie();
		this.addStatusBar();
		this.createPauseMenu();

		this.addTimeEvents();

		this.onPauseListener = function () {
			this.pauseGame();
		}.bind(this);

		document.addEventListener("pause", this.onPauseListener, false);
	},

	addTimeEvents: function() {
		// var coinAdder = this.time.events.add(Phaser.Timer.SECOND * 6, function () {
		// 		this.addCoin();
		// 	}, this);
		// coinAdder.loop = true;

		var healthAdder = this.time.events.add(Phaser.Timer.SECOND * 9, function () {
				this.addHealthPiece();
			}, this);
		healthAdder.loop = true;

		this.spawnEnemy();
		this.enemyAdder = this.time.events.add(Phaser.Timer.SECOND * 5, function () {
				this.spawnEnemy();
				if (this.enemyAdder.delay - 200 > Phaser.Timer.SECOND * 2) {
					this.enemyAdder.delay -= 200;
				}
			}, this);
		this.enemyAdder.loop = true;
	},

	update: function () {
		var d = this.time.elapsed;
		this.timePlayed += d;

		Cookie.achievements.unlockSurvivor(this.timePlayed / 1000);

		this.cookie.update(d);
		_.each(this.enemies, function (e) {
			e.update(d);
		});

		var enemySprites = _.pluck(this.enemies, 'sprite');

		this.physics.arcade.collide(enemySprites, enemySprites, function(enspr1, enspr2) {
			var enemy1 = _.findWhere(this.enemies, { sprite: enspr1 });
			var enemy2 = _.findWhere(this.enemies, { sprite: enspr2 });

			if (!enemy1.active || !enemy2.active)
				return;

			if (!enemy1.dead)
				enemy2.inflictDamage(enemy1.damage);

			if (!enemy2.dead) {
				enemy1.inflictDamage(enemy2.damage);
			}
		}, null, this);
		// this.cookie.collectCoins(this.coins);
		this.cookie.collectHealth(this.healthPieces);
	},
	createPauseMenu: function () {
		this.pauseMenu = this.add.group();
		var graphics = this.add.graphics(0, 0);
		graphics.beginFill(0x000000, 0.9);
		graphics.drawRect(Cookie.visibleRect.centerX - Cookie.convertWidth(120), 0, Cookie.convertWidth(120*2), this.world.height);

		var gamePausedTxt = this.add.text(Cookie.visibleRect.centerX, Cookie.visibleRect.top, "Game Paused", { font: Cookie.convertHeight(30) + "px Sigmar One", fill: "#ffffff", align: "center" });
		gamePausedTxt.anchor.setTo(0.5, 0);

		var resume = this.add.text(Cookie.visibleRect.centerX, Cookie.visibleRect.centerY, "Resume", { font: Cookie.convertHeight(20) + "px Sigmar One", fill: "#ffffff", align: "center" });
		resume.anchor.setTo(0.5, 1);

		var sound = this.add.text(Cookie.visibleRect.centerX, Cookie.visibleRect.centerY, "Sound: " + (Cookie.sound.isSoundOn() ? "On" : "Off"), { font: Cookie.convertHeight(20) + "px Sigmar One", fill: "#ffffff", align: "center" });
		sound.anchor.setTo(0.5, 0);

		var mainMenu = this.add.text(Cookie.visibleRect.centerX, Cookie.visibleRect.bottom, "Main Menu", { font: Cookie.convertHeight(20) + "px Sigmar One", fill: "#ffffff", align: "center" });
		mainMenu.anchor.setTo(0.5, 1);


		// resume.inputEnabled = true;
		// resume.events.onInputUp.add(this.resumeGame, this);
		
		// mainMenu.inputEnabled = true;
		// mainMenu.events.onInputUp.add(this.mainMenu, this);

		this.pauseMenu.add(graphics);
		this.pauseMenu.add(gamePausedTxt);
		this.pauseMenu.add(resume);
		this.pauseMenu.add(sound);
		this.pauseMenu.add(mainMenu);
		this.pauseMenu.visible = false;

		this.input.onDown.add(function (e) {
			if (this.game.paused) {
				if (resume.getBounds().contains(e.x, e.y)) {
					this.resumeGame();
				} else if (sound.getBounds().contains(e.x, e.y)) {
					if (Cookie.sound.isSoundOn()) {
						Cookie.sound.mute(true);
						sound.text = "Sound: Off";
					} else {
						Cookie.sound.mute(false);
						sound.text = "Sound: On";
					}
				} else if (mainMenu.getBounds().contains(e.x, e.y)) {
					this.mainMenu();
				}
			}
		}, this);
	},
	init: function () {
	},
	shutdown: function () {
		this.coinCounter = null;
		this.coinText = null;
		this.scoreText = null;
		this.healthText = null;
		this.cookie = null;

		this.statusBar = null;
		this.statusBarMargin = 0;
		this.statusBarTextHeight = 0;

		this.coins = null;
		this.healthPieces = null;
		this.enemies = [];
		this.enemiesPool = [];
		this.enemySprites = null;

		this.randomGenerator = null;
		this.barCoin = null;

		document.removeEventListener("pause", this.onPauseListener, false);
	}
};