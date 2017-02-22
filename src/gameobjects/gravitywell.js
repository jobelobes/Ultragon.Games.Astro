define(['phaser'], function (Phaser) {
    'use strict';

    var GravityWell = function (game, config) {
        this.state = config;

        this.game = game;

        this.view = game.engine.add.sprite(20, 20, GravityWell.Sprite);
        this.view.anchor.x = this.view.anchor.y = 0.5;

        game.engine.physics.p2.enableBody(this.view, true);
        this.body = this.view.body;
        this.body.x = this.state.initialPosition.x;
        this.body.x = this.state.initialPosition.y;
        this.body.collideWorldBounds = false;
        this.body.kinematic = true;

        this.spring = game.engine.physics.p2.createSpring(this.view, game.gamestate.player, 0, this.state.power, 0);
    }

    GravityWell.prototype = {
        constructor: GravityWell,

        update: function () {
            this.state.angle = (this.state.angle + (this.state.speed * Math.PI)) % (2 * Math.PI);

            var offsetX = Math.cos(this.state.angle) * this.game.engine.world.centerX + this.game.engine.world.centerX;
            var offsetY = Math.sin(this.state.angle) * this.game.engine.world.centerX + this.game.engine.world.centerX;
            this.body.x = offsetX;
            this.body.y = offsetY;
        }
    };

    GravityWell.Preload = function(game) {
        GravityWell.Sprite = game.engine.add.bitmapData(20, 20);
        GravityWell.Sprite.ctx.beginPath();
        GravityWell.Sprite.ctx.arc(10, 10, 10, 0, 2 * Math.PI);
        GravityWell.Sprite.ctx.fillStyle = '#ff0000';
        GravityWell.Sprite.ctx.fill();
    }

    return GravityWell;
});