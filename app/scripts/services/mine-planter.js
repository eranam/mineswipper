'use strict';

(function () {

  /* @ngInject */
  function MinePlanter() {
    // Public API here
    this.generateMinePosition = function generateMinePosition(maxPositionNum, minesNum) {
      var positionsPool = [], minesPos = [];
      for (var i = 0; i < maxPositionNum; i++) {
        positionsPool.push(i);
      }
      while (minesPos.length < minesNum && positionsPool.length) {
        var randPos = Math.floor(Math.random() * positionsPool.length);
        minesPos.push(positionsPool[randPos]);
        positionsPool.splice(randPos, 1);
      }
      return minesPos;
    };
  }

  angular
      .module('mineswipperAppInternal')
      .service('minePlanter', MinePlanter);

})();
