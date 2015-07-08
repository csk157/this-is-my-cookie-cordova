Cookie.PrePlay = function (game) {
	this.finger = null;
	this.cookie = null;
	this.fingerDown = false;
};

Cookie.PrePlay.prototype = {
	preload: function () {
		
	},

	create: function () {
		this.add.sprite(0, 0, 'bg');
		var graphics = this.add.graphics(0, 0);
		graphics.beginFill(0xFFFFFF, 0.3);
		graphics.drawRect(0, 0, this.world.width, this.world.height);
		
		this.cookie = this.add.sprite(Cookie.convertWidth(140), Cookie.convertHeight(160), 'cookie');
		this.cookie.anchor.setTo(0.5, 0.5);

		this.physics.enable(this.cookie, Phaser.Physics.ARCADE);
		
		this.finger = this.add.sprite(Cookie.convertWidth(240), Cookie.convertHeight(100), 'finger');

		var moveRight = this.add.tween(this.finger).to({ x: Cookie.convertWidth(400), y: Cookie.convertHeight(100)}, 600, Phaser.Easing.Sinusoidal.In);
		var moveDown = this.add.tween(this.finger).to({ x: Cookie.convertWidth(400), y: Cookie.convertHeight(250)}, 400, Phaser.Easing.Sinusoidal.In);
		var moveLeft = this.add.tween(this.finger).to({ x: Cookie.convertWidth(140), y: Cookie.convertHeight(250)}, 800, Phaser.Easing.Sinusoidal.In);
		var moveLeftUp = this.add.tween(this.finger).to({ x: Cookie.convertWidth(50), y: Cookie.convertHeight(100)}, 800, Phaser.Easing.Sinusoidal.In);

		this.time.events.add(500, function () {
				var onComplete = function () {
					moveLeftUp.onComplete.add(function () {
						this.time.events.add(200, function () {
							this.upFinger();
						}, this);
					}, this);

					var twn = moveRight.chain(moveDown, moveLeft, moveLeftUp);
					twn.start();
				};

				this.downFinger(onComplete);
		}, this);


		var howTotxt = this.add.text(Cookie.convertWidth(240), Cookie.startY, "How to play?", { font: Cookie.convertHeight(30) + "px Sigmar One", fill: "#ffffff", align: "center" });
		howTotxt.anchor.setTo(0.5, 0);
		
		var txt = this.add.text(Cookie.convertWidth(240), Cookie.visibleRect.bottom, "Click anywhere to start", { font: Cookie.convertHeight(20) + "px Sigmar One", fill: "#ffffff", align: "center" });
		txt.anchor.setTo(0.5, 1);

		this.add.tween(txt.scale).to({ x: 0.95, y: 0.98 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);

		this.input.onDown.add(function (e) {
			this.state.start("Game");
		}, this);
	},
	update: function () {
		if (this.fingerDown) {
			this.physics.arcade.moveToObject(this.cookie, this.finger, 230);
		} else {
			this.cookie.body.velocity.setTo(0, 0);
		}
	},
	downFinger: function (onComplete) {
		this.add.tween(this.finger).to({alpha: 0.8}, 300, Phaser.Easing.Exponential.In, true, 0, 0, false);
		var scaleTween = this.add.tween(this.finger.scale).to({x: 0.9, y: 0.9}, 300, Phaser.Easing.Exponential.In, false, 0, 0, false);
		scaleTween.onComplete.add(function () {
			this.fingerDown = true;

			onComplete.bind(this)();
		}, this);

		scaleTween.start();

		var clickTxt = this.game.add.text(this.finger.x, this.finger.y, "Touch", { font: Cookie.convertHeight(10) + "px Sigmar One", fill: "#ffffff", align: "center" });
		clickTxt.anchor.setTo(0.5);
		var twn = this.game.add.tween(clickTxt).to({ y: clickTxt.y - Cookie.convertHeight(5), alpha: 0 }, 500, Phaser.Easing.Linear.None);
		twn.onComplete.add(function () {
			clickTxt.destroy();
		}, this);

		twn.start();
	},
	upFinger: function () {
		this.add.tween(this.finger).to({alpha: 1}, 300, Phaser.Easing.Exponential.In, true, 0, 0, false);
		var scaleTween = this.add.tween(this.finger.scale).to({x: 1, y: 1}, 300, Phaser.Easing.Exponential.In, false, 0, 0, false);
		scaleTween.onComplete.add(function () {
			this.fingerDown = false;
		}, this);

		scaleTween.start();

		var clickTxt = this.game.add.text(this.finger.x, this.finger.y, "Release", { font: Cookie.convertHeight(10) + "px Sigmar One", fill: "#ffffff", align: "center" });
		clickTxt.anchor.setTo(0.5);
		var twn = this.game.add.tween(clickTxt).to({ y: clickTxt.y - Cookie.convertHeight(5), alpha: 0 }, 500, Phaser.Easing.Linear.None);
		twn.onComplete.add(function () {
			clickTxt.destroy();
		}, this);

		twn.start();
	}
};