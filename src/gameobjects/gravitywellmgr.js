define(['phaser', 'gameobjects/gravitywell'], function (Phaser, GravityWell) {
    'use strict';

    var GravityWellManager = function (game, config) {
        var defaultConfig = {
            minPower: 0,
            maxPower: 5,
            maxCount: 1
        };

        this.state = Phaser.Utils.mixin(config || {}, defaultConfig);
        this.state.totalTime = 0;

        this.game = game;

        this.view = this.game.engine.add.group();

        this.items = [];
        for (var i = 0; i < this.state.maxCount; i++) {
            var angle = (2 * Math.PI / this.state.maxCount) * i;

            var gravitywell = new GravityWell(this.game, {
                speed: 0,
                power: 5,
                position: {
                    x: Math.cos(angle) * this.game.engine.world.centerX + this.game.engine.world.centerX,
                    y: Math.sin(angle) * this.game.engine.world.centerY + this.game.engine.world.centerY
                }
            });

            this.items.push(gravitywell);
            this.view.add(gravitywell.view);
        }
    }

    GravityWellManager.prototype = {
        constructor: GravityWellManager,

        update: function (delta) {

            this.state.totalTime += delta;
            if (this.state.totalTime > 5) {
                for (var i = 0; i < this.items.length; i++) {
                    this.changePosition(this.items[i]);
                }
                this.state.totalTime = 0;
            }

            for (var i = 0; i < this.items.length; i++) {
                this.items[i].update();
            }
        },

        changePosition: function (gravityWell) {
            var angle = Math.random() * 2 * Math.PI;
            var posX = Math.cos(angle) * this.game.engine.world.centerX + this.game.engine.world.centerX;
            var posY = Math.sin(angle) * this.game.engine.world.centerX + this.game.engine.world.centerX;

            gravityWell.body.x = posX;
            gravityWell.body.y = posY;
        }
    };

    GravityWellManager.Preload = function (game) {
        GravityWell.Preload(game);
    }

    return GravityWellManager;
});