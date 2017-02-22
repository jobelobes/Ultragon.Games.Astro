define(['phaser'], function (Phaser) {
    'use strict';

    var Target = function (game, config) {
        var defaultConfig = {
            radius: 50,
            color: '#FFFFFF',
            position: {
                x: 0,
                y: 0,
            },
            pointsAwarded_ps: 10,
        };

        this.state = Phaser.Utils.mixin(config || {}, defaultConfig);
        this.state.isPlayerColliding = false;

        this.game = game;

        this.sprite = game.engine.add.bitmapData(this.state.radius * 2, this.state.radius * 2);
        this.sprite.ctx.beginPath();
        this.sprite.ctx.arc(this.state.radius, this.state.radius, this.state.radius, 0, 2 * Math.PI);
        this.sprite.ctx.fillStyle = this.state.color;
        this.sprite.ctx.fill();

        this.view = game.engine.add.sprite(this.sprite.width, this.sprite.height, this.sprite);
        this.view.anchor.x = this.view.anchor.y = 0.5;

        game.engine.physics.p2.enableBody(this.view, false);
        this.body = this.view.body;
        this.body.setCircle(this.state.radius);
        this.body.x = this.state.position.x;
        this.body.y = this.state.position.y;
        this.body.kinematic = true;
        this.body.data.shapes[0].sensor = true;
        this.body.onBeginContact.add(this.onBeginContact.bind(this), this)
        this.body.onEndContact.add(this.onEndContact.bind(this), this)
    }

    Target.prototype = {
        constructor: Target,

        update: function (delta) {
            if(this.state.isPlayerColliding) {
                this.game.gamestate.player.awardPoints(delta * this.state.pointsAwarded_ps);
            }
            
        },

        onBeginContact: function (bodyA, bodyB, shapeA, shapeB, equation){
            if(bodyA === this.game.gamestate.player.body){
                this.state.isPlayerColliding = true;
            }
        },

        onEndContact: function (bodyA, bodyB, shapeA, shapeB, equation){
            if(bodyA === this.game.gamestate.player.body){
                this.state.isPlayerColliding = false;
            }
        }
    };

    Target.Preload = function (game) {

    }

    return Target;
});