(function () {
    'use strict';

    requirejs.config({
        baseUrl: "src/",
        paths: {
        	phaser:   'libs/phaser.min'
        },

        shim: {
        	'phaser': {
        		exports: 'Phaser'
        	}
        }
    });
 
    require(['phaser', 'game'], function (Phaser, Game) {
		var game = new Game();
		game.start();
    });
}());