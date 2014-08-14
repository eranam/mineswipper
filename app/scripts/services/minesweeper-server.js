'use strict';

(function () {

  /* @ngInject */
  function MinesweeperServer($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var apiUrl = '/_api/minesweeper/game/';
    var server = $resource(apiUrl);
    var games = [];

    //  Public API here
    this.getData = function () {
      return games;
    };

    this.save = function (game) {
      server.save(game);
    };
    this.load = function () {
      games = server.query();
    };

    this.load();
  }

  angular
      .module('mineswipperAppInternal')
      .service('minesweeperServer', MinesweeperServer);

})();
