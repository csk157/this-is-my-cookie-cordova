Cookie.RoundEye = function (game, pos, follow, group) {
	this.game = game;
	this.group = group;
	this.follow = follow;

	this.eyeball = game.add.sprite(pos.x, pos.y, 'eyeball');
	this.eyeball.anchor.setTo(0.5, 0.5);
	this.group.addChild(this.eyeball);

	this.eye = game.add.sprite(this.eyeball.x, this.eyeball.y, 'eye');
	this.eye.anchor.setTo(-0.3, 0.5);
	this.group.addChild(this.eye);
};

Cookie.RoundEye.prototype = {
	update: function (delta) {
		this.eye.rotation = this.game.physics.arcade.angleBetween(this.group, this.follow);
	}

};