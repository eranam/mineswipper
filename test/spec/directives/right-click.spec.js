'use strict';

describe('Directive: rightClick', function () {

  beforeEach(function () {
    module('mineswipperAppInternal');
  });

  var element, scope;

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();
    scope.$compileObj = $compile;
  }));

  function testCase(expressionStr, expectFunction) {
    var attrString = 'right-click';
    if (arguments.length === 1) {
      expectFunction = arguments[0];
    } else {
      attrString += '="' + expressionStr + '"';
    }
    element = angular.element('<div ' + attrString + ' ></div>');
    element = scope.$compileObj(element)(scope);
    element.triggerHandler('contextmenu');
    expect(expectFunction(element)).toBe(true);
  }

  it('should call function on scope when the event fires', function () {
    scope.run = jasmine.createSpy('run method');
    testCase('run();', function () {
      return scope.run.callCount === 1;
    });
  });

  it('should invoke the handler only for "contextmenu" events', function () {
    scope.run = jasmine.createSpy('run method');
    element = angular.element('<div right-click="run();"></div>');
    element = scope.$compileObj(element)(scope);
    element.triggerHandler('click');
    element.triggerHandler('keypress');
    element.triggerHandler('scroll');
    expect(scope.run).not.toHaveBeenCalled();
  });

  it('should evaluate variable value placed on scope when the event fires', function () {
    scope.title = 'eran';
    testCase('{{title}}', function (element) {
      return element.attr('right-click') === 'eran';
    });
  });

  it('should evaluate expression value when the event fires', function () {
    testCase('{{5 * 5}}', function (element) {
      return element.attr('right-click') === '25';
    });
  });

  it('should accept empty string an value', function () {
    testCase('""', function (element) {
      return element.attr('right-click') === '';
    });
  });

  it('should accept attribute without a value', function () {
    testCase(function (element) {
      return element.attr('right-click') === '';
    });
  });

  it('should prevent default for left-click events', function () {
    var contextMenuEvent = $.Event('contextmenu');
    spyOn(contextMenuEvent, 'preventDefault');
    element = angular.element('<div right-click ></div>');
    element = scope.$compileObj(element)(scope);
    element.trigger(contextMenuEvent);
    expect(contextMenuEvent.preventDefault).toHaveBeenCalledOnce();
  });
});
