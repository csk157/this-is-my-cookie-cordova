Cookie.Preloader = function (game) {
	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};

Cookie.Preloader.prototype = {
	preload: function () {
		this.background = this.add.sprite(0, 0, 'bg');
		this.preloadBar = this.add.sprite(Cookie.convertWidth(240), Cookie.convertWidth(280), 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		
		this.load.setPreloadSprite(this.preloadBar);
		var that = this;

		this.load.image('logo','img/'+Cookie.screen+"/logo.png");
		this.load.image('coin','img/'+Cookie.screen+"/coin.png");
		this.load.image('cookie','img/'+Cookie.screen+"/cookie.png");
		this.load.image('red-enemy','img/'+Cookie.screen+"/red-enemy.png");
		this.load.image('eyeball','img/'+Cookie.screen+"/eyeball.png");
		this.load.image('eye','img/'+Cookie.screen+"/eye.png");
		this.load.image('upper-teeth','img/'+Cookie.screen+"/upper-teeth.png");
		this.load.image('lower-teeth','img/'+Cookie.screen+"/lower-teeth.png");
		this.load.image('chocolate-piece','img/'+Cookie.screen+"/chocolate-piece.png");
		this.load.image('finger','img/'+Cookie.screen+"/finger.png");
		this.load.image('sound','img/'+Cookie.screen+"/sound.png");
		this.load.image('mute','img/'+Cookie.screen+"/mute.png");

		Cookie.sound.loadSounds();
	},
	create: function () {
		document.addEventListener("pause", function () {
			Cookie.sound.pauseBgMusic();
		}, false);

		document.addEventListener("resume", function () {
			Cookie.sound.resumeBgMusic();
		}, false);

		this.state.start('MainMenu');
		
	},
	update: function () {
		if (this.ready)
			this.state.start('MainMenu');
	}
};