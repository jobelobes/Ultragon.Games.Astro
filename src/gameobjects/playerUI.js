define(['phaser'], function (Phaser) {
    'use strict';

    var PlayerUI = function (game, config) {
        var defaultConfig = {
            position: {
                x: 0,
                y: 0,
            }
        };

        this.state = Phaser.Utils.mixin(config || {}, defaultConfig);

        this.game = game;

        this.view = game.engine.add.group();
        this.view.x = this.state.position.x;
        this.view.y = this.state.position.y;
        
        this.text = game.engine.add.text(10, 30, "", { font: "20px Courier", fill: "#fff", tabs: 132 });

        this.view.add(game.engine.add.text(10, 10, "Fuel\tScore\tHealth", { font: "20px Courier", fill: "#fff", tabs: 132 }))
        this.view.add(this.text);
    }

    PlayerUI.prototype = {
        constructor: PlayerUI,

        update: function (delta) {
            var playerState = this.game.gamestate.player.state;
            this.text.setText(Math.trunc(playerState.thrust.fuel) + "\t" + Math.trunc(playerState.score) + "\t" + Math.trunc(playerState.health.amount));
        }
    };

    PlayerUI.Preload = function (game) {

    }

    return PlayerUI;
});