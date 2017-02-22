define(['phaser'], function (Phaser) {
    'use strict';

    var Target = function (game, config) {
        var defaultConfig = {
            radius: 10,
            color: '#33FF86',
            position: {
                x: 0,
                y: 0,
            }
        };

        this.state = Phaser.Utils.mixin(config || {}, defaultConfig);

        this.game = game;

        this.sprite = game.engine.add.bitmapData(this.state.radius * 2, this.state.radius * 2);
        this.sprite.ctx.beginPath();
        this.sprite.ctx.arc(this.state.radius, this.state.radius, this.state.radius, 0, 2 * Math.PI);
        this.sprite.ctx.fillStyle = this.state.color;
        this.sprite.ctx.fill();

        this.view = game.engine.add.group();
        this.view.x = game.engine.world.centerX;
        this.view.y = game.engine.world.centerY;

        this.target = game.engine.add.sprite(0, 0, this.sprite);
        this.target.anchor.x = this.target.anchor.y = 0.5;

        this.text = game.engine.add.text(0, 30, "{thrust}", { font: "12px Courier", fill: "#fff" });

        this.line = game.engine.add.graphics(0,0);

        this.view.add(this.target);
        this.view.add(this.text);
        this.view.add(this.line);
    }

    Target.prototype = {
        constructor: Target,

        update: function (delta) {
            if (this.game.engine.input.mousePointer.isDown) {
                this.view.visible = true;
                
                this.view.x = this.game.engine.input.mousePointer.x;
                this.view.y = this.game.engine.input.mousePointer.y;
                this.text.setText(Math.trunc(this.game.gamestate.player.state.thrust.amount));

                this.line.clear();
                this.line.beginFill(0xab3602);
                this.line.lineStyle(4, 0x02fdeb, 1);
                this.line.moveTo(0,0);
                this.line.lineTo(this.game.gamestate.player.view.x - this.view.x, this.game.gamestate.player.view.y - this.view.y);
                this.line.endFill();

            } else {
                this.view.visible = false;
            }
        }
    };

    Target.Preload = function (game) {

    }

    return Target;
});