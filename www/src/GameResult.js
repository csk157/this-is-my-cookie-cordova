Cookie.GameResult = function (game) {
	this.score = 0;
	this.coins = 0;
	this.textHeight = 0;
	this.gameOverText = null;
	this.scoreText = null;
	this.coinText = null;
	this.playAgain = null;
	this.mainMenu = null;

	this.scoreRunner = {
		start: 0,
		finish: 0,
		current: 0,
		coins: 0
	};
	
	this.coinRunner = {
		start: 0,
		finish: 0,
		current: 0
	};

	this.waitingTimer = {
		time: 500,
		current: 0
	};

	this.addingCoins = {
		coinScore: 50,
		scoreLeft: 0,
		maxTime: 2000,
		normalTimePerCoin: 100
	};

	this.screenState = "AnimatingScore";
};

Cookie.GameResult.prototype = {
	init: function (score, coins) {
		this.score = score;
		this.coins = coins;

		this.scoreRunner = {
			start: 0,
			finish: Math.ceil(score),
			time: 1000,
			current: 0,
			coins: coins
		};

		this.coinRunner = {
			start: 0,
			finish: Math.ceil(coins),
			time: 1000,
			current: 0
		};

		this.addingCoins.scoreLeft = score;

		if (Cookie.isLoggedIn) {
			googleplaygame.submitScore({
				leaderboardId: "leaderboard-id",
				score: score
			}, function (res) {
				// score submitted successfully
			}, function (res) {
				console.warn("Score was not submitted", res);
			});
		}
	},
	getTextStyle: function () {
		return { font: this.textHeight + "px Sigmar One", fill: "#ffffff", align: "center" };
	},
	create: function () {
		Cookie.achievements.incrementGameCount();
		Cookie.achievements.unlockWelcome();
		
		this.add.sprite(0, 0, 'bg');
		this.textHeight = Cookie.convertHeight(25);

		this.gameOverText = this.add.text(this.world.centerX, Cookie.viewTop + Cookie.convertHeight(25), "Your cookie was eaten!", this.getTextStyle());
		this.gameOverText.anchor.setTo(0.5, 0);


		var bottomOfGameOver = this.gameOverText.y + this.gameOverText.height;
		var scoreSize = this.getTextStyle();
		scoreSize.font = (this.textHeight * 2) + "px Sigmar One";
		this.scoreText = this.add.text(Cookie.convertWidth(240), Cookie.convertHeight(160), Math.ceil(this.score), scoreSize);
		this.scoreText.anchor.setTo(0.5, 1);


		var leaderboardSize = this.getTextStyle();
		leaderboardSize.font = (this.textHeight * 0.8) + "px Sigmar One";
		var leaderboard = this.add.text(Cookie.convertWidth(240), Cookie.convertHeight(160), "Click to see leaderboard", leaderboardSize);
		leaderboard.anchor.setTo(0.5, 0);

		leaderboard.inputEnabled = true;
		leaderboard.events.onInputUp.add(this.showLeaderBoard);
		
		this.scoreText.inputEnabled = true;
		this.scoreText.events.onInputUp.add(this.showLeaderBoard);
		this.add.tween(this.scoreText.scale).to({ x: 0.95, y: 0.98 }, 600, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

		// var barCoin = this.add.sprite(Cookie.convertWidth(240 + 30), this.scoreText.y + this.scoreText.getBounds().centerY * 1.25, 'coin');
		// barCoin.anchor.setTo(0, 0.5);
		// this.add.tween(barCoin.scale).to({ x: 0.95, y: 0.98 }, 400, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

		// this.coinText = this.add.text(barCoin.x + barCoin.width + Cookie.convertWidth(10), bottomOfGameOver + Cookie.convertHeight(0), this.coins, scoreSize);
		// this.coinText.anchor.setTo(0, 0);

		// this.add.tween(this.coinText.scale).to({ x: 0.95, y: 0.98 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

		this.playAgain = this.add.text(Cookie.convertWidth(0 + 10), Cookie.visibleRect.bottom, "Play Again", this.getTextStyle());
		this.playAgain.anchor.setTo(0, 1);

		this.mainMenu = this.add.text(Cookie.convertWidth(480 - 10), Cookie.visibleRect.bottom, "Main Menu", this.getTextStyle());
		this.mainMenu.anchor.setTo(1, 1);

		this.playAgain.inputEnabled = true;
		this.playAgain.events.onInputUp.add(this.playAgainClicked, this);
		
		this.mainMenu.inputEnabled = true;
		this.mainMenu.events.onInputUp.add(this.mainMenuClicked, this);
	},
	playAgainClicked: function () {
		this.state.start("Game");
	},
	mainMenuClicked: function () {
		this.state.start("MainMenu");
	},
	showLeaderBoard: function () {
		googleplaygame.showLeaderboard({ leaderboardId: "your-leaderboard-id"});
	},
	update: function () {
		if (this.screenState == "AnimatingScore") {
			if (this.scoreRunner.current <= this.scoreRunner.finish) {
				this.scoreRunner.current += (this.scoreRunner.time / this.scoreRunner.finish) * this.time.elapsed;
				this.scoreText.text = Math.ceil(this.scoreRunner.current);

				// this.coinText.text = this.coins + Math.floor(this.scoreRunner.current / 50);
			}
		}


		// if (this.screenState == "Waiting") {
		// 	if (this.waitingTimer.current <= this.waitingTimer.time) {
		// 		this.waitingTimer.current += this.time.elapsed;
		// 	}
		// }

		//	Do some nice funky main menu effect here
	},
	shutdown: function () {
		this.score = 0;
		this.coins = 0;
		this.textHeight = 0;
		this.gameOverText = null;
		this.scoreText = null;
		this.coinText = null;
		this.playAgain = null;
		this.mainMenu = null;
	}
};