define(['phaser', 'gameobjects/player', 'gameobjects/gravitywell', 'gameobjects/wall'], function (Phaser, Player, GravityWell, Wall) {
    'use strict';

    var Game = function () {
        console.log('Initializing \'Astro\'');
    }

    Game.prototype = {
        constructor: Game,

        start: function () {
            this.engine = new Phaser.Game(800, 800, Phaser.AUTO, '', {
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this),
                render: this.render.bind(this)
            });

            this.gamestate = {
                config: {
                    maxGravityWell: 1
                },
                objects: [],
            };
        },

        preload: function () {
            Player.Preload(this);
            GravityWell.Preload(this);
        },

        create: function () {

            // initialize physics
            this.engine.physics.startSystem(Phaser.Physics.P2JS);
            this.engine.physics.p2.restitution = 0.8;

            this.gamestate.player = new Player(this, {
                speed: 8000,
                initialPosition: {
                    x: this.engine.world.centerX,
                    y: this.engine.world.centerY,
                }
            });
            this.gamestate.objects.push(this.gamestate.player);

            // Create gravity wells -->
            this.gamestate.gravitywells = [];
            for (var i = 0; i < this.gamestate.config.maxGravityWell; i++) {
                var angle = (2 * Math.PI / this.gamestate.config.maxGravityWell) * i;

                var gravitywell = new GravityWell(this, {
                    angle: angle,
                    power: Math.random() * 50,
                    speed: Math.random() * 0.001,
                    initialPosition: {
                        x: Math.cos(angle) * this.engine.world.centerX + this.engine.world.centerX,
                        y: Math.sin(angle) * this.engine.world.centerY + this.engine.world.centerY
                    } 
                });

                this.gamestate.gravitywells.push(gravitywell);
                this.gamestate.objects.push(gravitywell);
            }
            // <--

            // Create airlock -->
            this.gamestate.airlock = this.engine.add.group();

            var airlockSides = 10;
            var width = 20;
            var height = this.engine.world.centerX * Math.tan(Math.PI / airlockSides) + 10;

            for (var i = 0; i < airlockSides; i++) {

                var angle = (2 * Math.PI / airlockSides) * i;
                var airlockWall = new Wall(this, {
                    initialPosition: {
                        x: Math.cos(angle) * this.engine.world.centerX * 0.5 + this.engine.world.centerX,
                        y: Math.sin(angle) * this.engine.world.centerX * 0.5 + this.engine.world.centerX,
                    },
                    initialRotation: angle,
                    width: width,
                    height: height,
                    color: '#ff0000'
                })

                this.gamestate.objects.push(airlockWall);
                this.gamestate.airlock.add(airlockWall.view)

            }
            // <--
        },

        update: function () {
            for (var i = 0; i < this.gamestate.objects.length; i++) {
                this.gamestate.objects[i].update();
            }

            this.engine.physics.arcade.collide(this.gamestate.objects, this.gamestate.objects);
        },

        render: function () {

        },
    };

    return Game;
});