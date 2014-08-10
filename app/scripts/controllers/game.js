'use strict';

(function () {

  /* @ngInject */
  function GameController($scope, Game, $log) {
    this.game = undefined;
    var defaultConf = {
      xSize: 10,
      ySize: 10,
      mines: 10
    };
    $scope.conf = $scope.conf || {};
    angular.extend($scope.conf, defaultConf);

    this.startGame = function () {
      this.game = new Game($scope.conf);
      $log.log('configure successfully: ' + $scope.conf.xSize + ' ' + $scope.conf.ySize + ' ' + $scope.conf.mines);
    };

    this.range = function (num) {
      var arr = [];
      for (var i = 0; i < num; i++) {
        arr.push(i);
      }
      return arr;
    };
  }

  angular
      .module('mineswipperAppInternal')
      .controller('GameController', GameController);

})();
