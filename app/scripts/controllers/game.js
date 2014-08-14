'use strict';

(function () {

  /* @ngInject */
  function GameController($scope, Game, $log, announceBoard) {
    var defaultConf = {
      xSize: 10,
      ySize: 10,
      mines: 10
    };
    $scope.conf = $scope.conf || {};
    angular.extend($scope.conf, defaultConf);

    this.game = undefined;
    function givUseAHint(msg){
      announceBoard.announceForGivenMs(msg, 1500);
    }

    function validateInput(configurations) {
      if (configurations.xSize <= 0 || configurations.ySize <= 0) {
        givUseAHint('The X and Y values must be grater than zero.');
        return false;
      }
      if (configurations.xSize * configurations.ySize <= configurations.mines){
        givUseAHint('Number of mines must be smaller than the size of the board.');
        return false;
      } else if (configurations.mines <=0){
        givUseAHint('The board must contains at least one mine.');
        return false;
      }
      return true;
    }

    this.startGame = function () {
      if (validateInput($scope.conf)) {
        this.game = new Game($scope.conf);
        $log.log('configure successfully with: x=' + $scope.conf.xSize + ', y=' + $scope.conf.ySize + ', mines=' + $scope.conf.mines);
      } else {
        $log.error('Invalid input parameters.');
      }
    };

    this.announceBoard = announceBoard;

  }

  angular
      .module('mineswipperAppInternal')
      .controller('GameController', GameController);

})();
