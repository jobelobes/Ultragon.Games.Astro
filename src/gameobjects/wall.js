define(['phaser'], function (Phaser) {
    'use strict';

    var Wall = function (game, config) {
        var defaultConfig = {
            width: 20,
            height: 20,
            color: "#FFFFFF",
            position: {
                x: 0,
                y: 0,
            },
            rotation: 0,
            damage_ps: 10,
        }

        this.state = Phaser.Utils.mixin(config || {}, defaultConfig);
        this.state.playInContact = false;

        this.game = game;

        this.sprite = game.engine.add.bitmapData(this.state.width, this.state.height);
        this.sprite.ctx.beginPath();
        this.sprite.ctx.rect(0, 0, this.state.width, this.state.height);
        this.sprite.ctx.fillStyle = this.state.color;
        this.sprite.ctx.fill();

        this.view = game.engine.add.sprite(this.state.width, this.state.height, this.sprite);
        this.view.anchor.x = this.view.anchor.y = 0.5;

        game.engine.physics.p2.enableBody(this.view, false);
        this.body = this.view.body;
        this.body.x = this.state.position.x;
        this.body.y = this.state.position.y;
        this.body.rotation = this.state.rotation;
        this.body.static = true;
        if(this.state.damage_ps > 0){
            this.body.onBeginContact.add(this.onBeginContact.bind(this), this)
            this.body.onEndContact.add(this.onEndContact.bind(this), this)
        }
    }

    Wall.prototype = {
        constructor: Wall,

        update: function (delta) {
            if(this.state.playInContact) {
                this.game.gamestate.player.awardDamage(this.state.damage_ps);
            }
        },

        onBeginContact: function (bodyA, bodyB, shapeA, shapeB, equation){
            if(bodyA !== this.game.gamestate.player.body){
                return;
            }

            this.state.playInContact = true;
        },

        onEndContact: function (bodyA, bodyB, shapeA, shapeB, equation){
            if(bodyA !== this.game.gamestate.player.body) {
                return;
            }

            this.state.playInContact = false;
        }
    };

    Wall.Preload = function(game, config) {
        
    }

    return Wall;
});