Cookie.AchievementManager = function (game) {
	this.game = game;

	this.freshId = "achievementid-from-google-play";
	this.wellCookedId = "achievementid-from-google-play";
	this.burnedId = "achievementid-from-google-play";
	this.welcomeId = "achievementid-from-google-play";

	this.chocolateLoverId = "achievementid-from-google-play";
	this.battleScarsId = "achievementid-from-google-play";
	this.theFearedId = "achievementid-from-google-play";

	this.noCookieForYouId = "achievementid-from-google-play";
	this.noCookieForYouCount = 5;

	this.unstopableId = "achievementid-from-google-play";
	this.unstopableCount = 20;

	this.damagedId = "achievementid-from-google-play";
	this.damagedCount = 5;


	this.survivorId = "achievementid-from-google-play";
	this.survivorTime = 30;
	this.respectedId = "achievementid-from-google-play";
	this.respectedTime = 2*60;
	this.kingId = "achievementid-from-google-play";
	this.kingTime = 5*60;

	this.survivorUnlocked = false;
	this.respectedUnlocked = false;
	this.kingUnlocked = false;

	this.welcomeUnlocked = false;
	this.noCookieForUnlocked = false;
	this.unstopableUnlocked = false;
	this.damagedUnlocked = false;
};

Cookie.AchievementManager.prototype = {
	incrementGameCount: function () {
		var that = this;
		googleplaygame.incrementAchievement({
			achievementId: that.freshId,
			numSteps: 1
		});

		googleplaygame.incrementAchievement({
			achievementId: that.wellCookedId,
			numSteps: 1
		});

		googleplaygame.incrementAchievement({
			achievementId: that.burnedId,
			numSteps: 1
		});
	},
	unlockWelcome: function () {
		if (this.welcomeUnlocked)
			return;

		var that = this;
		googleplaygame.unlockAchievement({
			achievementId: that.welcomeId
		});

		this.welcomeUnlocked = true;
	},
	incrementChocolateLover: function () {
		var that = this;
		googleplaygame.incrementAchievement({
			achievementId: that.chocolateLoverId,
			numSteps: 1
		});	
	},
	incrementBattleScars: function () {
		var that = this;
		googleplaygame.incrementAchievement({
			achievementId: that.battleScarsId,
			numSteps: 1
		});	
	},
	incrementTheFeared: function () {
		var that = this;
		googleplaygame.incrementAchievement({
			achievementId: that.theFearedId,
			numSteps: 1
		});
	},
	// 5 enemies killed without taking damage in one game
	unlockNoCookieForYou: function (untouchedCount, damageTaken) {
		if (!damageTaken && this.noCookieForYouCount <= untouchedCount) {
			if (this.noCookieForUnlocked)
				return;

			var that = this;
			googleplaygame.unlockAchievement({
				achievementId: that.noCookieForYouId
			});

			this.noCookieForUnlocked = true;
		}
	},
	// 20 enemy bites in one game
	unlockUnstopable: function (bitesTaken) {
		if (this.unstopableCount <= bitesTaken) {
			if (this.noCookieForUnlocked)
				return;

			var that = this;
			googleplaygame.unlockAchievement({
				achievementId: that.unstopableId
			});

			this.noCookieForUnlocked = true;
		}
	},
	// 5 enemy bites in one game
	unlockDamaged: function (bitesTaken) {
		if (this.damagedCount <= bitesTaken) {
			if (this.damagedUnlocked)
				return;

			var that = this;
			googleplaygame.unlockAchievement({
				achievementId: that.damagedId
			});

			this.damagedUnlocked = true;
		}
	},
	// survive time
	unlockSurvivor: function (timeSurvived) {
		var that = this;
		if (!this.survivorUnlocked && this.survivorTime <= timeSurvived) {
			googleplaygame.unlockAchievement({
				achievementId: that.survivorId
			});
			this.survivorUnlocked = true;
		}
		if (!this.respectedUnlocked && this.respectedTime <= timeSurvived) {
			googleplaygame.unlockAchievement({
				achievementId: that.respectedId
			});
			this.respectedUnlocked = true;
		}
		if (!this.kingUnlocked && this.kingTime <= timeSurvived) {
			googleplaygame.unlockAchievement({
				achievementId: that.kingId
			});
			this.kingUnlocked = true;
		}
	}
};