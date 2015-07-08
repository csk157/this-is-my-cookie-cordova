Cookie.RedEnemy = function (game, pos, cookie) {
	this.game = game;
	this.sprite = game.add.sprite(pos.x, pos.y, 'red-enemy');
	this.sprite.anchor.setTo(0.5, 0.5);
	
	this.leftEye = new Cookie.RoundEye(game, { x: -Cookie.convertWidth(5), y: -Cookie.convertHeight(5) }, cookie.sprite, this.sprite);
	this.rightEye = new Cookie.RoundEye(game, { x: Cookie.convertWidth(5), y: -Cookie.convertHeight(5) }, cookie.sprite, this.sprite);

	this.teethUpper = game.add.sprite(0, Cookie.convertHeight(5), 'upper-teeth');
	this.teethUpper.anchor.setTo(0.5, 0.5);
	this.sprite.addChild(this.teethUpper);

	this.teethLower = game.add.sprite(0, Cookie.convertHeight(8), 'lower-teeth');
	this.teethLower.anchor.setTo(0.5, 0.5);
	this.sprite.addChild(this.teethLower);

	this.game.add.tween(this.teethUpper).to({ x: this.teethUpper.x - Cookie.convertWidth(1), y: this.teethUpper.y - Cookie.convertHeight(1.5) }, 200, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
	this.game.add.tween(this.teethLower).to({ x: this.teethLower.x - Cookie.convertWidth(1), y: this.teethLower.y + Cookie.convertHeight(1.5) }, 200, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.body.allowRotation = false;
	this.sprite.body.bounce.setTo(1, 1);

	this.sprite.body.drag.setTo(1, 1);
	this.sprite.body.collideWorldBounds = true;

	this.onDeath = function() {};

	this.cookie = cookie;

	this.reset(pos);
};

Cookie.RedEnemy.prototype = {
	update: function (delta) {
		if (this.dead || !this.active)
			return;

		this.leftEye.update(delta);
		this.rightEye.update(delta);

		this.game.physics.arcade.collide(this.cookie.sprite, this.sprite);
		if (!this.game.physics.arcade.intersects(this.cookie.sprite.body, this.sprite.body)) {
			this.game.physics.arcade.moveToObject(this.sprite, this.cookie.sprite, 300);
		} else {
			// Kill on collision with player
			this.inflictDamage(this.health);
			this.cookie.inflictDamage(this.damage);
		}
	},
	stop: function () {
		this.sprite.body.velocity.setTo(0, 0);
	},
	inflictDamage: function (dmg) {
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
			Cookie.sound.play('knock');
		} else {
			this.die();
		}
	},
	die: function() {
		if (this.dead)
			return;

		this.game.onEnemyDied();
		this.cookie.addScore(this.score);
		this.stop();
		this.game.tweens.removeFrom(this.sprite, false);

		var dying = this.game.add.tween(this.sprite.scale).to({ x: 0.2, y: 0.4 }, 300, Phaser.Easing.Sinusoidal.In);
		var dyingRotate = this.game.add.tween(this.sprite).to({ angle: 360 }, 300, Phaser.Easing.Sinusoidal.In);

		dying.onComplete.add(function () {
			this.game.removeEnemy(this);
			this.game.tweens.removeFrom(this.sprite, false);
			this.sprite.kill();
		}, this);

		dyingRotate.start();
		dying.start();
		this.dead = true;
	},
	reset: function(pos) {
		this.sprite.reset(pos.x, pos.y);
		this.sprite.scale.setTo(1, 1);
		this.game.add.tween(this.sprite.scale).to({ x: 0.95, y: 0.98 }, 450, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
		this.active = false;
		this.sprite.alpha = 0;

		var fadeIn = this.game.add.tween(this.sprite).to({ alpha: 1 }, 2000, Phaser.Easing.Exponential.In, false);
		fadeIn.onComplete.add(function () {
			this.active = true;
		}, this);

		fadeIn.start();

		this.dead = false;
		this.damage = 30;
		this.health = 50;
		this.stunnedTimer = 0;
		this.score = 50;
	}
};