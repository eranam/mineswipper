'use strict';

describe('Service: cell', function () {

  // load the service's module
  beforeEach(function () {
    module('mineswipperAppInternal');

    //add your mocks here
  });

  // instantiate service
  var Cell, cellObj;
  beforeEach(inject(function (_Cell_) {
    Cell = _Cell_;
    cellObj = new Cell();
  }));

  it('should initialized to be unrevealed', function () {
    expect(cellObj.isRevealed()).toBeFalsy();
  });
  it('should be revealed after reveal operation', function () {
    cellObj.reveal();
    expect(cellObj.isRevealed()).toBeTruthy();
  });
  it('should initialized to be empty cell', function () {
    expect(cellObj.isMine()).toBeFalsy();
  });
  it('should set a mine inside the cell', function () {
    cellObj.setMine();
    expect(cellObj.isMine()).toBeTruthy();
  });

});
