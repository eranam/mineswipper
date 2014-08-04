'use strict';

(function () {

  /* @ngInject */
  function cellFactory() {
    function Cell() {
      this.revealState = false;
      this.mineFlag = false;
    }

    Cell.prototype.isRevealed = function isRevealed() {
      return this.revealState;
    };
    Cell.prototype.reveal = function reveal() {
      this.revealState = true;
    };
    Cell.prototype.isMine = function isMine() {
      return this.mineFlag;
    };
    Cell.prototype.setMine = function setMine() {
      this.mineFlag = true;
    };

    return Cell;
  }

  angular
      .module('mineswipperAppInternal')
      .factory('Cell', cellFactory);

})();
