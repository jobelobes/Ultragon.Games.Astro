define(['phaser'], function (Phaser) {
    'use strict';

    var Player = function (game, config) {
        this.state = config;

        this.game = game;

        this.view = this.game.engine.add.sprite(0, 0, 'player');
        this.view.anchor.x = this.view.anchor.y = 0.5;

        this.game.engine.physics.p2.enableBody(this.view, true);

        this.body = this.view.body;
        this.body.x = config.initialPosition.x
        this.body.y = this.game.engine.world.centerY;
        this.body.collideWorldBounds = true;
        this.body.dynamic = true;
    }

    Player.prototype = {
        constructor: Player,

        update: function () {
            if (!this.game.engine.input.mousePointer.isDown) {
                return;
            }

            var mouse = this.game.engine.input.mousePointer;
            var angle = Math.atan2(mouse.y- this.body.y, mouse.x- this.body.x);

            this.body.force.x = Math.cos(angle) * this.state.speed;
            this.body.force.y = Math.sin(angle) * this.state.speed;
        }
    };

    Player.Preload = function (game) {
        game.engine.load.image('player', 'assets/player.png');
    }

    return Player;
});