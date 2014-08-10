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

});
