'use strict';

(function () {

  /* @ngInject */
  function cellFactory() {
    function Cell() {
      this.revealState = false;
      this.mineFlag = false;
      this.flag = false;
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
    Cell.prototype.isFlagged = function isFlagged() {
      return this.flag;
    };
    Cell.prototype.toggleFlag = function toggleFlag() {
      this.flag = !this.flag;
      return this.flag;
    };
    return Cell;
  }

  angular
      .module('mineswipperAppInternal')
      .factory('Cell', cellFactory);

})();
