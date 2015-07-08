Cookie.SCORE_PER_SECOND = 1;
Cookie.Cookie = function (game) {
	this.game = game;
	this.sprite = game.add.sprite(Cookie.convertWidth(240), Cookie.convertHeight(160), 'cookie');
	this.sprite.anchor.setTo(0.5, 0.5);
	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.body.allowRotation = false;
	this.sprite.body.bounce.setTo(1, 1);

	this.sprite.body.drag.setTo(1, 1);
	this.sprite.body.collideWorldBounds = true;

	this.onScoreChanged = function(newScore) {};
	this.onHealthChanged = function(newHealth) {};
	this.onCoinsChanged = function(newCoins) {};
	this.onKilled = function(score, coins) {};

	this.score = 0;
	this.coins = 0;
	
	this.maxHealth = 100;
	this.health = this.maxHealth;

	this.pendingCoins = [];
	this.pendingHealthPieces = [];
	this.game.add.tween(this.sprite.scale).to({ x: 0.95, y: 0.98 }, 600, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

	this.stunnedTimer = 0;

	this.isDown = false;
	this.game.input.onDown.add(function(a,b) {
		this.isDown = true;
	}, this);

	this.game.input.onUp.add(function(a,b) {
		this.isDown = false;
	}, this);
};

Cookie.Cookie.prototype = {
	update: function (delta) {
		this.addScore(this.timeToScore(delta));
		
		if (this.isStunned()) {
			this.stunnedTimer -= delta;
			return;
		}

		if (this.isDown) {
			this.game.physics.arcade.moveToObject(this.sprite, this.game.input.position, 500);
			if (Phaser.Rectangle.contains(this.sprite.body, this.game.input.x, this.game.input.y)) {
				this.stop();
			}
		} else {
			this.stop();
		}
	},
	isStunned: function () {
		return this.stunnedTimer > 0;
	},
	stop: function () {
		this.sprite.body.velocity.setTo(0, 0);
	},
	inflictDamage: function (dmg) {
		this.onBitten();
		this.health -= dmg;

		var dmgTxt = this.game.add.text(this.sprite.x, this.sprite.y, "" + dmg, { font: Cookie.convertHeight(10) + "px Sigmar One", fill: "#ff0000", align: "center" });
		dmgTxt.anchor.setTo(0.5);
		var twn = this.game.add.tween(dmgTxt).to({ y: dmgTxt.y - Cookie.convertHeight(5), alpha: 0 }, 500, Phaser.Easing.Linear.None);
		twn.onComplete.add(function () {
			dmgTxt.destroy();
		}, this);

		twn.start();

		if (this.health > 0) {
			this.sprite.angle = 0;
			var shake = this.game.add.tween(this.sprite).to({ angle: -30 }, 100, Phaser.Easing.Sinusoidal.InOut, false, 0, 0, true)
				.chain(
					this.game.add.tween(this.sprite).to({ angle: 30 }, 100, Phaser.Easing.Sinusoidal.InOut, false, 0, 0, true)
				);

			this.stop();
			shake.start();

			this.stunnedTimer = 300;
			this.onHealthChanged(this.health, this.maxHealth);

			Cookie.sound.play('crunch');
		} else {
			Cookie.sound.play('fail');
			this.onKilled(this.score, this.coins);
		}
	},
	timeToScore: function (delta) {
		return (delta / 1000) * Cookie.SCORE_PER_SECOND;
	},
	addScore: function (score) {
		this.score += score;
		this.onScoreChanged(this.score);
	},
	addCoin: function (coins) {
		this.coins += coins;
		this.onCoinsChanged(this.coins);
	},
	heal: function (health) {
		if (this.health + health > this.maxHealth) {
			this.health = this.maxHealth;
		} else {
			this.health += health;
		}

		var healTxt = this.game.add.text(this.sprite.x, this.sprite.y, "" + health, { font: Cookie.convertHeight(10) + "px Sigmar One", fill: "#00FF00", align: "center" });
		healTxt.anchor.setTo(0.5);
		var twn = this.game.add.tween(healTxt).to({ y: healTxt.y - Cookie.convertHeight(5), alpha: 0 }, 500, Phaser.Easing.Linear.None);
		twn.onComplete.add(function () {
			healTxt.destroy();
		}, this);

		twn.start();

		Cookie.sound.play('chocolate');
		this.onHealthChanged(this.health, this.maxHealth);
	},
	collectCoins: function (coins) {
		coins.forEachAlive(function(c) {
			if (_.contains(this.pendingCoins, c)) 
				return;

			this.game.physics.arcade.overlap(this.sprite, c, function (spr, coin) {
				this.addCoin(1);
				this.pendingCoins.push(c);
				var moveTween = this.game.add.tween(c).to({ x: this.sprite.x, y: this.sprite.y }, 100, Phaser.Easing.Exponential.In);
				var scaleTween = this.game.add.tween(c.scale).to({ x: 0.1, y: 0.1 }, 100, Phaser.Easing.Exponential.In);
				
				moveTween.onComplete.add(function () {
					this.game.removeCoin(c);
					this.pendingCoins = _.without(this.pendingCoins, c);
				}, this);

				moveTween.start();
				scaleTween.start();
			}, null, this);
		}, this);
	},
	collectHealth: function (pieces) {
		pieces.forEachAlive(function(c) {
			if (_.contains(this.pendingHealthPieces, c))
				return;

			this.game.physics.arcade.overlap(this.sprite, c, function(spr, cn) {
				this.onHealthCollected();
				this.heal(10);
				this.pendingHealthPieces.push(c);
				var moveTween = this.game.add.tween(c).to({ x: this.sprite.x, y: this.sprite.y }, 100, Phaser.Easing.Exponential.In);
				var scaleTween = this.game.add.tween(c.scale).to({ x: 0.1, y: 0.1 }, 100, Phaser.Easing.Exponential.In);
				
				moveTween.onComplete.add(function () {
					this.game.removeHealthPiece(c);
					this.pendingHealthPieces = _.without(this.pendingHealthPieces, c);
				}, this);

				moveTween.start();
				scaleTween.start();
			}, null, this);
		}, this);
	}

};