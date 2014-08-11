'use strict';

(function () {

  /* @ngInject */
  function cellFactory() {
    function Cell(xPos, yPos) {
      var revealState = false, mineFlag = false, flag = false;
      this.x = xPos;
      this.y = yPos;
      this.isRevealed = function isRevealed() {
        return revealState;
      };
      this.reveal = function reveal() {
        revealState = true;
      };
      this.isMine = function isMine() {
        return mineFlag;
      };
      this.setMine = function setMine() {
        mineFlag = true;
      };
      this.isFlagged = function isFlagged() {
        return flag;
      };
      this.toggleFlag = function toggleFlag() {
        flag = !flag;
        return flag;
      };
    }

    return Cell;
  }

  angular
      .module('mineswipperAppInternal')
      .factory('Cell', cellFactory);

})();
