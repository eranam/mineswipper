'use strict';

describe('Service: minesweeperServer', function () {
  var $httpBackend, minesweeperServer;
  // load the service's module
  beforeEach(function () {
    module('mineswipperAppInternal');

  });

  beforeEach(inject(function (_minesweeperServer_, _$httpBackend_) {
    minesweeperServer = _minesweeperServer_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should get list of games from server', function () {
    $httpBackend.expectGET('/_api/minesweeper/game/').respond('[]');
    minesweeperServer.load();
    $httpBackend.flush();
    expect(minesweeperServer.getData()).toEqual([]);
  });

  xit('should post the current game to the server', function () {
    $httpBackend.expectPOST('/_api/minesweeper/game/').respond('1');
    minesweeperServer.load();
    $httpBackend.flush();
    expect(minesweeperServer.getData()).toEqual([]);
  });

});
