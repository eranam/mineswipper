'use strict';

(function () {

  /* @ngInject */
  function GameController($scope, Game, $log, announceBoard) {
    var defaultConf = {
      xSize: 10,
      ySize: 10,
      mines: 10
    };
    //$scope.conf = $scope.conf || {};
    angular.extend($scope.conf, defaultConf);

    this.game = undefined;

    this.startGame = function () {
      this.game = new Game($scope.conf);
      $log.log('configure successfully: ' + $scope.conf.xSize + ' ' + $scope.conf.ySize + ' ' + $scope.conf.mines);
    };

    this.announceBoard = announceBoard;

  }

  angular
      .module('mineswipperAppInternal')
      .controller('GameController', GameController);

})();
