define(['phaser'], function (Phaser) {
    'use strict';

    var GravityWell = function (game, config) {
        var defaultConfig = {
            power: 5,
            angle: 0,
            position: {
                x: game.engine.world.centerX,
                y: game.engine.world.centerY
            } 
        }

        this.state = Phaser.Utils.mixin(config || {}, defaultConfig);

        this.game = game;

        this.view = game.engine.add.sprite(20, 20, GravityWell.Sprite);
        this.view.anchor.x = this.view.anchor.y = 0.5;

        game.engine.physics.p2.enableBody(this.view, false);
        this.body = this.view.body;
        this.body.x = this.state.position.x;
        this.body.y = this.state.position.y;
        this.body.collideWorldBounds = false;
        this.body.kinematic = true;

        this.spring = game.engine.physics.p2.createSpring(this.view, game.gamestate.player, 0, this.state.power, 0);
    }

    GravityWell.prototype = {
        constructor: GravityWell,

        update: function () {
        
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