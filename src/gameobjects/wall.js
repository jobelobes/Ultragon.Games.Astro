define(['phaser'], function (Phaser) {
    'use strict';

    var Wall = function (game, config) {
        this.state = config;

        this.game = game;

        this.sprite = game.engine.add.bitmapData(config.width, config.height);
        this.sprite.ctx.beginPath();
        this.sprite.ctx.rect(0, 0, config.width, config.height);
        this.sprite.ctx.fillStyle = config.color;
        this.sprite.ctx.fill();

        this.view = game.engine.add.sprite(config.width, config.height, this.sprite);
        this.view.anchor.x = this.view.anchor.y = 0.5;

        game.engine.physics.p2.enableBody(this.view, true);
        this.body = this.view.body;
        this.body.x = this.state.initialPosition.x;
        this.body.y = this.state.initialPosition.y;
        this.body.rotation = this.state.initialRotation;
        this.body.static = true;
    }

    Wall.prototype = {
        constructor: Wall,

        update: function () {

        }
    };

    Wall.Preload = function(game, config) {
        
    }

    return Wall;
});