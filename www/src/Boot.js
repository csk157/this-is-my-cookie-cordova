Cookie = {
	screen: "small",
	soundOn: true,
	getSettings: function () {
		return JSON.parse(window.localStorage.getItem('settings'));
	},
	getSetting: function (key) {
		return Cookie.getSettings()[key];
	},
	setSetting: function (key, val) {
		var s = Cookie.getSettings();
		s[key] = val;

		window.localStorage.setItem('settings', JSON.stringify(s));
	}
};

Cookie.Boot = function (game) {
	this.game = game;
};

Cookie.Boot.prototype = {
	preload: function () {
		// Assets for preloader
		this.load.image('bg','img/' + Cookie.screen + "/bg.png");
		this.load.image('preloaderBar', 'img/'+Cookie.screen+"/loading-bar.png");
	},

	create: function () {
		if (!window.localStorage.getItem('settings')) {
			console.warn('sound settings do not exist');
			window.localStorage.setItem('settings', JSON.stringify({ soundOn: true }));
		}

		Cookie.sound = new Cookie.SoundManager();

		this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = false;
	 
		if (!this.game.device.desktop) {
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.minWidth = 480;
			this.scale.minHeight = 320;
			this.scale.maxWidth = 1440;
			this.scale.maxHeight = 960;
			this.scale.refresh();

			Cookie.startX = 0;
			Cookie.startY = 0;
			Cookie.visibleWidth = this.scale.width;
			Cookie.visibleHeight = this.scale.width * (window.innerHeight / window.innerWidth);
			Cookie.visibleRect = new Phaser.Rectangle(Cookie.startX, Cookie.startY, Cookie.visibleWidth, Cookie.visibleHeight);
		}

		this.state.start('Preloader');
	},

	gameResized: function (width, height) {

	},

	enterIncorrectOrientation: function () {
		Cookie.orientated = false;
		document.getElementById('orientation').style.display = 'block';

	},

	leaveIncorrectOrientation: function () {
		Cookie.orientated = true;
		document.getElementById('orientation').style.display = 'none';
		this.scaleStage();
	}
};