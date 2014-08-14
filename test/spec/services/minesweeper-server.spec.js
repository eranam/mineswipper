'use strict';

describe('Service: minesweeperServer', function () {
  var $httpBackend, minesweeperServer, apiUrl = '/_api/minesweeper/game/', $log;
  // load the service's module
  beforeEach(function () {
    module('mineswipperAppInternal');
  });

  beforeEach(inject(function (_$httpBackend_, _minesweeperServer_, _$log_) {
    $httpBackend = _$httpBackend_;
    $log = _$log_;
    minesweeperServer = _minesweeperServer_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
  });

  function flushAndExpectGetData(expectation){
    $httpBackend.flush();
    expect(minesweeperServer.getData()).toEqual(expectation);
  }

  it('should get list of items from server', function () {
    var objArray = [
      {name: 'erna'},
      {name: 'amar'}
    ];
    $httpBackend.expectGET(apiUrl).respond(JSON.stringify(objArray));
    minesweeperServer.load();
    flushAndExpectGetData(objArray);
  });

  it('should save an item to server and add it to the data', function () {
    $httpBackend.expectPOST(apiUrl).respond(JSON.stringify({id: 12}));
    minesweeperServer.save({name: 'amar'});
    flushAndExpectGetData([
      {name: 'amar', id: 12}
    ]);
  });

  it('should delete an item by it\'s id', function () {
    var id = 9;
    var items = [
      {id: 9},
      {id: 10}
    ];
    $httpBackend.expectGET(apiUrl).respond(JSON.stringify(items));
    minesweeperServer.load();
    $httpBackend.expectDELETE(apiUrl + id).respond(200);
    minesweeperServer.remove(id);
    flushAndExpectGetData([
      {id: 10}
    ]);
  });

  it('should log an error when try to delete an item with a no-existing id', function () {
    var nonExistingId = 90000;
    var items = [
      {id: 9},
      {id: 10}
    ];
    spyOn($log, 'error');
    $httpBackend.expectGET(apiUrl).respond(JSON.stringify(items));
    minesweeperServer.load();
    $httpBackend.expectDELETE(apiUrl + nonExistingId).respond(404);
    minesweeperServer.remove(nonExistingId);
    flushAndExpectGetData(items);
    expect($log.error).toHaveBeenCalledWith('Delete operation failed: cant find an item with the given id=' + nonExistingId + '.');
  });

});
