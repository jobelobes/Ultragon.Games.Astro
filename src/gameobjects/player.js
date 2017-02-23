define(['phaser', 'gameobjects/thrustui'], function (Phaser, ThrustUI) {
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
            health: {
                max: 100,
                regenRate: 0.01,
            },
            score: 0,
        };

        this.state = Phaser.Utils.mixin(config || {}, defaultConfig);
        this.state.thrust.fuel = this.state.thrust.maxFuel;
        this.state.health.amount = this.state.health.max;
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
        this.body.angularDamping = 0.8;

        this.thrustUI = new ThrustUI(game);
    }

    Player.prototype = {
        constructor: Player,

        awardPoints: function (value) {
            this.state.score += value;
        },

        awardDamage: function (value) {
            this.state.health.amount = Math.max(this.state.health.amount - value, 0);
        },

        awardHealth: function(value) {
            this.state.health.amount = Math.min(Math.max(this.state.health.amount + value, 0), this.state.health.max);
        },

        update: function (delta) {

            if (this.game.engine.input.mousePointer.isDown) {
                var mouse = this.game.engine.input.mousePointer;
                var deltaX = Math.min(Math.max(mouse.x, 0), this.game.engine.width) - this.body.x;
                var deltaY = Math.min(Math.max(mouse.y, 0), this.game.engine.height) - this.body.y;

                var angle = Math.atan2(deltaY, deltaX);
                var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                this.state.thrust.amount = Math.min(this.game.engine.math.linear(this.state.thrust.minPower, this.state.thrust.maxPower, distance / this.state.maxDistance), this.state.thrust.fuel);

                this.body.force.x = Math.cos(angle) * this.state.thrust.amount;
                this.body.force.y = Math.sin(angle) * this.state.thrust.amount;

                this.state.thrust.fuel = Math.max(this.state.thrust.fuel - this.state.thrust.amount, 0);
            } else {
                this.state.thrust.amount = 0;
                this.state.thrust.fuel = Math.min(this.state.thrust.fuel + (this.state.thrust.regenRate * this.state.thrust.maxFuel), this.state.thrust.maxFuel);
            }

            if(this.state.debug) {
                console.log(JSON.stringify(this.state));
            }

            this.state.health.amount = Math.min(this.state.health.amount + this.state.health.max * this.state.health.regenRate * delta, this.state.health.max);

            this.thrustUI.update(delta);
        }
    };

    Player.Preload = function (game) {
        game.engine.load.image('player', 'assets/player.png');

        ThrustUI.Preload(game);
    }

    return Player;
});