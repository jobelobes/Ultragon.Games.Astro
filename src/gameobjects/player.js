define(['phaser'], function (Phaser) {
    'use strict';

    var Player = function (game, config) {
        var defaultConfig = {
            debug: false,
            thrust: {
                minPower: 100,
                maxPower: 10000,
                maxFuel: 500000,
                regenRate: 0.01,
            },
            mass: 10,
            position: {
                x: game.engine.world.centerX,
                y: game.engine.world.centerY,
            },
            points: 0,
        };

        this.state = Phaser.Utils.mixin(config || {}, defaultConfig);
        this.state.thrust.fuel = this.state.thrust.maxFuel;
        this.state.maxDistance = Math.sqrt(game.engine.width * game.engine.width + game.engine.height * game.engine.height);

        this.game = game;

        this.view = this.game.engine.add.sprite(0, 0, 'player');
        this.view.anchor.x = this.view.anchor.y = 0.5;

        this.game.engine.physics.p2.enableBody(this.view, this.state.debug);

        this.body = this.view.body;
        this.body.mass = this.state.mass;
        this.body.x = this.state.position.x
        this.body.y = this.game.engine.world.centerY;
        this.body.collideWorldBounds = true;
        this.body.dynamic = true;
    }

    Player.prototype = {
        constructor: Player,

        awardPoints: function (value) {
            this.state.points += value;
        },

        update: function () {

            if (this.game.engine.input.mousePointer.isDown) {
                var mouse = this.game.engine.input.mousePointer;
                var deltaX = Math.min(Math.max(mouse.x, 0), this.game.engine.width) - this.body.x;
                var deltaY = Math.min(Math.max(mouse.y, 0), this.game.engine.height) - this.body.y;

                var angle = Math.atan2(deltaY, deltaX);
                var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                var thrust = Math.min(this.game.engine.math.linear(this.state.thrust.minPower, this.state.thrust.maxPower, distance / this.state.maxDistance), this.state.thrust.fuel);

                this.body.force.x = Math.cos(angle) * thrust;
                this.body.force.y = Math.sin(angle) * thrust;

                this.state.thrust.fuel = Math.max(this.state.thrust.fuel - thrust, 0);

            } else {
                this.state.thrust.fuel = Math.min(this.state.thrust.fuel + (this.state.thrust.regenRate * this.state.thrust.maxFuel), this.state.thrust.maxFuel);
            }

            if(this.state.debug) {
                console.log(JSON.stringify(this.state));
            }
        }
    };

    Player.Preload = function (game) {
        game.engine.load.image('player', 'assets/player.png');
    }

    return Player;
});