define(['phaser', 'gameobjects/gravitywell'], function (Phaser, GravityWell) {
    'use strict';

    var GravityWellManager = function (game, config) {
        var defaultConfig = {
            minPower: 0,
            maxPower: 5,
            maxCount: 1
        };

        this.state = Phaser.Utils.mixin(config || {}, defaultConfig);

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

        update: function () {
            for (var i = 0; i < this.items.length; i++) {
                var gravityWell = this.items[i];

                // this.state.angle = (this.state.angle + (this.state.speed * Math.PI)) % (2 * Math.PI);

                // var offsetX = Math.cos(this.state.angle) * this.game.engine.world.centerX + this.game.engine.world.centerX;
                // var offsetY = Math.sin(this.state.angle) * this.game.engine.world.centerX + this.game.engine.world.centerX;
                // this.body.x = offsetX;
                // this.body.y = offsetY;

                gravityWell.update();
            }
        }
    };

    GravityWellManager.Preload = function (game) {
        GravityWell.Preload(game);
    }

    return GravityWellManager;
});