Cookie.SoundManager = function () {
	
};

Cookie.SoundManager.prototype = {
	getAudioUrl: function (path) {
		return device.platform.toLowerCase() == "android" ? "/android_asset/www/" + path : path;
	},
	loadSounds: function () {
		this.bgMusic = new Media(this.getAudioUrl('audio/bg.mp3'), function (m) {
			// success
		}, function (e) {
			console.warn('Sound error:', e);
		}, function (status) { if (status === Media.MEDIA_STOPPED) { Cookie.sound.bgMusic.play(); } });
		
		this.crunchSound = new Media(this.getAudioUrl('audio/crunch.mp3'), function (m) {
			// success
		}, function (e) {
			console.warn('Sound error:', e);
		}, function (status) { });

		this.knockSound = new Media(this.getAudioUrl('audio/knock.mp3'), function (m) {
			// success
		}, function (e) {
			console.warn('Sound error:', e);
		}, function (status) { });

		this.failSound = new Media(this.getAudioUrl('audio/fail.mp3'), function (m) {
			// success
		}, function (e) {
			console.warn('Sound error:', e);
		}, function (status) { });

		this.chocolateSound = new Media(this.getAudioUrl('audio/chocolate.mp3'), function (m) {
			// success
		}, function (e) {
			console.warn('Sound error:', e);
		}, function (status) { });

		this.bgMusic.play();
		if(!this.isSoundOn())
			this.silence();

	},
	mute: function (muted) {
		Cookie.setSetting('soundOn', !muted);

		if(muted) {
			this.silence();
		} else {
			this.loud();
		}
	},
	silence: function() {
		this.bgMusic.setVolume(0);
		this.crunchSound.setVolume(0);
		this.knockSound.setVolume(0);
		this.failSound.setVolume(0);
		this.chocolateSound.setVolume(0);
	},
	loud: function () {
		this.bgMusic.setVolume(1);
		this.crunchSound.setVolume(1);
		this.knockSound.setVolume(1);
		this.failSound.setVolume(1);
		this.chocolateSound.setVolume(1);
	},
	isSoundOn: function () {
		return Cookie.getSetting('soundOn');
	},
	pauseBgMusic: function () {
		this.bgMusic.pause();
	},
	resumeBgMusic: function () {
		this.bgMusic.play();
	},
	pauseAllEffects: function () {
		this.crunchSound.pause();
		this.knockSound.pause();
		this.failSound.pause();
		this.chocolateSound.pause();
	},
	play: function (sound) {
		if(!this.isSoundOn()){
			return;
		}

		switch (sound) {
			case 'crunch':
				this.crunchSound.play();
				break;
			case 'knock':
				this.knockSound.play();
				break;
			case 'fail':
				this.failSound.play();
				break;
			case 'chocolate':
				this.chocolateSound.play();
				break;
		}
	}

};