// Detecting when font was loaded - somewhere from stackoverflow
function waitForWebfonts(fonts, callback) {
	var loadedFonts = 0;
	for(var i = 0, l = fonts.length; i < l; ++i) {
		(function(font) {
			var node = document.createElement('span');
			// Characters that vary significantly among different fonts
			node.innerHTML = 'giItT1WQy@!-/#';
			// Visible - so we can measure it - but not on the screen
			node.style.position      = 'absolute';
			node.style.left          = '-10000px';
			node.style.top           = '-10000px';
			// Large font size makes even subtle changes obvious
			node.style.fontSize      = '300px';
			// Reset any font properties
			node.style.fontFamily    = 'sans-serif';
			node.style.fontVariant   = 'normal';
			node.style.fontStyle     = 'normal';
			node.style.fontWeight    = 'normal';
			node.style.letterSpacing = '0';
			document.body.appendChild(node);

			// Remember width with no applied web font
			var width = node.offsetWidth;

			node.style.fontFamily = font;

			var interval;
			function checkFont() {
				// Compare current width with original width
				if(node && node.offsetWidth != width) {
					++loadedFonts;
					node.parentNode.removeChild(node);
					node = null;
				}

				// If all fonts have been loaded
				if(loadedFonts >= fonts.length) {
					if(interval) {
						clearInterval(interval);
					}
					if(loadedFonts == fonts.length) {
						callback();
						return true;
					}
				}
			}

			if(!checkFont()) {
				interval = setInterval(checkFont, 50);
			}
		})(fonts[i]);
	}
}

document.addEventListener('deviceready', function () {
	(function () {
		// hide status bar and soft buttons on resume
		document.addEventListener("resume", function () {
			Immersify.enableSticky(function() {}, function() {}); 
		}, false);

		// Waits for webfont to be loaded, then starts the game
		waitForWebfonts(['Sigmar One'], function() {
			// Login to Game services
			googleplaygame.auth(function() {
				Cookie.isLoggedIn = true;   
			}, function() {
				Cookie.isLoggedIn = false;
			});

			// hides status bar and soft buttons on newer android devices
			Immersify.enableSticky(function() {}, function() {});

			// setting asset size and scaling
			Cookie.screen = "ldpi";
			Cookie.srx = Math.max(window.innerWidth, window.innerHeight) *window.devicePixelRatio;
			Cookie.sry = Math.min(window.innerWidth, window.innerHeight) *window.devicePixelRatio;

			Cookie.logicWidth = 480;
			Cookie.logicHeight = 320;
			var r = Cookie.logicWidth / Cookie.logicHeight;

			if(Cookie.srx >= 360) {
				Cookie.screen = "ldpi";
				Cookie.gameWidth = 360;
			}

			if(Cookie.srx >= 480) {
				Cookie.screen = "mdpi";
				Cookie.gameWidth = 480;
			}

			if(Cookie.srx >= 720) {
				Cookie.screen = "hdpi";
				Cookie.gameWidth = 720;
			}

			if(Cookie.srx >= 960) {
				Cookie.screen = "xhdpi";
				Cookie.gameWidth = 960;
			}

			if(Cookie.srx >= 1440) {
				Cookie.screen = "xxhdpi";
				Cookie.gameWidth = 1440;
			}

			// If on deskop, we may need to fix the maximum resolution instead of scaling the game to the full monitor resolution
			var device = Phaser.Device;
			if(device.desktop) {
				Cookie.screen = "ldpi";
				Cookie.gameWidth = 720;
			}

			Cookie.screen = "drawable-" + Cookie.screen;
			device = null;

			Cookie.gameHeight = Cookie.gameWidth/r;
			
			// We need these methods later to convert the logical game position to display position,
			// So convertWidth(logicWidth) will be right edge for all screens
			Cookie.convertWidth = function(value) {
				return value / Cookie.logicWidth * Cookie.visibleWidth; 
			};

			Cookie.convertHeight = function(value) {
				return value / Cookie.logicHeight * Cookie.visibleHeight;
			};

			// init game
			var game = new Phaser.Game(Cookie.gameWidth, Cookie.gameHeight, Phaser.AUTO, 'gamediv');
			Cookie.achievements = new Cookie.AchievementManager(game);

			// Add states
			game.state.add('Boot', Cookie.Boot);
			game.state.add('Preloader', Cookie.Preloader);
			game.state.add('MainMenu', Cookie.MainMenu);
			game.state.add('PrePlay', Cookie.PrePlay);
			game.state.add('Game', Cookie.Game);
			game.state.add('GameResult', Cookie.GameResult);
			game.state.start('Boot');
		});
		

	})();
}, false);