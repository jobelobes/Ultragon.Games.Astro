define([
    'phaser', 
    'gameobjects/player', 
    'gameobjects/gravitywellmgr', 
    'gameobjects/wall',
    'gameobjects/target'], 
function (Phaser, Player, GravityWellMgr, Wall, Target) {
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
            GravityWellMgr.Preload(this);
        },

        create: function () {

            // initialize physics
            this.engine.physics.startSystem(Phaser.Physics.P2JS);
            this.engine.physics.p2.restitution = 0.8;

            this.gamestate.player = new Player(this, {
                debug: true,
            });
            this.gamestate.objects.push(this.gamestate.player);

            this.gamestate.target = new Target(this, {
                position: {
                    x: this.engine.world.centerX,
                    y: this.engine.world.centerY,
                }
            })
            this.gamestate.objects.push(this.gamestate.target);

            // Create airlock -->
            this.gamestate.airlock = this.engine.add.group();

            var airlockSides = 10;
            var width = 20;
            var height = this.engine.world.centerX * Math.tan(Math.PI / airlockSides) + 10;

            for (var i = 0; i < airlockSides; i++) {

                var angle = (2 * Math.PI / airlockSides) * i;
                var airlockWall = new Wall(this, {
                    position: {
                        x: Math.cos(angle) * this.engine.world.centerX * 0.5 + this.engine.world.centerX,
                        y: Math.sin(angle) * this.engine.world.centerX * 0.5 + this.engine.world.centerX,
                    },
                    rotation: angle,
                    width: width,
                    height: height,
                    color: '#ff0000'
                })

                this.gamestate.objects.push(airlockWall);
                this.gamestate.airlock.add(airlockWall.view)

            }
            // <--

            this.gamestate.gravitywells = new GravityWellMgr(this, {
                minPower: 1,
                maxPower: 5,
                maxCount: 1
            });
            this.gamestate.objects.push(this.gamestate.gravitywells);
        },

        update: function () {
            var delta = this.engine.time.physicsElapsed;
            for (var i = 0; i < this.gamestate.objects.length; i++) {
                this.gamestate.objects[i].update(delta);
            }
        },

        render: function () {

        },
    };

    return Game;
});