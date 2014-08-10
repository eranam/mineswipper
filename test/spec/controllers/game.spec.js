'use strict';

describe('Controller: GameController', function () {

  beforeEach(function () {
    module('mineswipperAppInternal');
  });

  var GameController, scope, Game;

  beforeEach(inject(function ($controller, $rootScope, _Game_) {
    scope = $rootScope.$new();
    scope.conf = {
      xSize: 10,
      ySize: 10,
      mines: 100
    };
    GameController = $controller('GameController', {
      $scope: scope
    });
    Game = _Game_;
  }));

  it('should expose "game" property that is a GameFactory instance', function () {
    GameController.startGame(scope.conf);
    expect(GameController.game instanceof Game).toBeTruthy();
  });
  it('range method should return an array', function () {
    expect(GameController.range(1) instanceof Array).toBeTruthy();
  });
  it('range should returns an array of given size filled with acceding numbers starting from 0', function () {
    expect(GameController.range(1)).toEqual([0]);
    expect(GameController.range(5)).toEqual([0, 1, 2, 3, 4]);
  });

});
