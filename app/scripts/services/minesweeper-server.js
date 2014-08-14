'use strict';

(function () {

  /* @ngInject */
  function MinesweeperServer($http, $log) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var apiUrl = '/_api/minesweeper/game/';
    var games = [];

    function logError(body, statusCode) {
      $log.error('request to server failed: ' + statusCode + '\nBody: ' + body);
    }

    //  Public API here
    this.getData = function () {
      return games;
    };

    this.save = function (game) {
      $http.post(apiUrl, game)
          .success(function (res) {
            $log.log('save game successfully, your id is: ' + res);
            angular.extend(game, res);
            games.push(game);
          })
          .error(logError);
    };

    this.load = function () {
      $http.get(apiUrl)
          .success(function (resArr) {
            $log.log('load games successfully, got ' + resArr.length + ' items.');
            angular.copy(resArr, games);
          })
          .error(logError);
    };

    function removeGameById(id) {
      for (var i = 0; i < games.length; i++) {
        if (games[i].id === id) {
          games.splice(i, 1);
          return;
        }
      }
    }

    this.remove = function (id) {
      $http.delete(apiUrl + id)
          .success(function () {
            $log.log('delete game ' + id + ' successfully.');
            removeGameById(id);
          })
          .error(function (body, statusCode) {
            if (statusCode === 404) {
              $log.error('Delete operation failed: cant find an item with the given id=' + id + '.');
            } else {
              logError(body, statusCode);
            }
          });
    };
  }

  angular
      .module('mineswipperAppInternal')
      .service('minesweeperServer', MinesweeperServer);

})();
