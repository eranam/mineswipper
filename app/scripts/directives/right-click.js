'use strict';

(function () {

  /* @ngInject */
  function rightClick() {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.on('contextmenu', function (event) {
          event.preventDefault();
          scope.$apply(function () {
            scope.$eval(attrs.rightClick || '""');
          });
        });
      }
    };
  }

  angular
      .module('mineswipperAppInternal')
      .directive('rightClick', rightClick);

})();
