Cookie.MainMenu = function (game) {
};

Cookie.MainMenu.prototype = {
	// TODO: split into smaller functions
	create: function () {
		this.add.sprite(0, 0, 'bg');

		var textHeight = Cookie.convertHeight(27);
		var padding = Cookie.convertHeight(20);

		var logo = this.add.sprite(Cookie.convertWidth(480/2 - padding), Cookie.convertHeight(160), 'logo');
		logo.anchor.setTo(1, 0.5);

		var style = { font: textHeight + "px Sigmar One", fill: "#ffffff", align: "center" };

		var play = this.add.text(Cookie.visibleRect.centerX + padding, Cookie.visibleRect.centerY, "Play", style);
		play.anchor.setTo(0, 1);
		var achievements = this.add.text(Cookie.visibleRect.centerX + padding, Cookie.visibleRect.centerY, "Achievements", style);
		achievements.anchor.setTo(0, 0);

		var sound = this.add.sprite(Cookie.visibleRect.right - Cookie.convertWidth(10), Cookie.visibleRect.bottom - Cookie.convertHeight(10), 'sound');
		sound.anchor.setTo(1, 1);

		var mute = this.add.sprite(Cookie.visibleRect.right - Cookie.convertWidth(10), Cookie.visibleRect.bottom - Cookie.convertHeight(10), 'mute');
		mute.anchor.setTo(1, 1);
		mute.visible = false;

		play.inputEnabled = true;
		achievements.inputEnabled = true;

		sound.inputEnabled = true;
		mute.inputEnabled = true;

		if(Cookie.sound.isSoundOn()) {
			sound.visible = true;
			mute.visible = false;
		} else {
			sound.visible = false;
			mute.visible = true;
		}

		sound.events.onInputUp.add(function () {
			Cookie.sound.mute(true);

			sound.visible = false;
			mute.visible = true;
		}, this);

		mute.events.onInputUp.add(function () {
			Cookie.sound.mute(false);
			mute.visible = false;
			sound.visible = true;
		}, this);

		var onOver = function () {
			this.fill = "#FFBF71";
		};

		var onOut = function () {
			this.fill = "#FFFFFF";
		};

		var onDown = function () {
			this.fill = "#ffb04f";
		};

		play.events.onInputOver.add(onOver, play);
		play.events.onInputOut.add(onOut, play);
		play.events.onInputDown.add(onDown, play);

		achievements.events.onInputOver.add(onOver, achievements);
		achievements.events.onInputOut.add(onOut, achievements);
		achievements.events.onInputDown.add(onDown, achievements);

		play.events.onInputUp.add(this.playClicked, this);
		achievements.events.onInputUp.add(this.achievementsClicked, this);
	},
	upgradeClicked: function () {
		this.state.start('GameResult', true, false, 1201, 15);
	},
	playClicked: function(){
		this.state.start('PrePlay');
	},
	achievementsClicked: function(){
		googleplaygame.showAchievements();
	},

	update: function () {}
};