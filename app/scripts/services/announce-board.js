'use strict';

(function () {

  /* @ngInject */
  function AnnounceBoard($timeout) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var isActive = false;
    var msg = '';

    // Public API here
    this.isAnnouncing = function () {
      return isActive;
    };

    this.getContent = function () {
      return isActive ? msg : '';
    };

    this.announceForGivenMs = function (content, ms) {
      msg = content;
      isActive = true;
      $timeout(function () {
        isActive = false;
      }, ms);
    };

    this.announce = function (content) {
      msg = content;
      isActive = true;
    };
  }

  angular
      .module('mineswipperAppInternal')
      .service('announceBoard', AnnounceBoard);

})();
