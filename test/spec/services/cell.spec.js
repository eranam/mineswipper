'use strict';

describe('Service: cell', function () {

  // load the service's module
  beforeEach(function () {
    module('mineswipperAppInternal');

    //add your mocks here
  });

  // instantiate service
  var Cell, cellObj, xPos, yPos;
  beforeEach(inject(function (_Cell_) {
    Cell = _Cell_;
    xPos = 5;
    yPos = 6;
    cellObj = new Cell(xPos, yPos);
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
  it('should initialize the flag to false', function () {
    expect(cellObj.isFlagged()).toBe(false);
  });
  it('should toggle the flag', function () {
    cellObj.toggleFlag();
    expect(cellObj.isFlagged()).toBe(true);
    cellObj.toggleFlag();
    expect(cellObj.isFlagged()).toBe(false);
  });
  it('should expose x, y coordinate on cell-object', function () {
    expect(cellObj.x).toBe(xPos);
    expect(cellObj.y).toBe(yPos);
  });
});
