'use strict';

describe('Service: minePlanter', function () {

  // load the service's module
  beforeEach(function () {
    module('mineswipperAppInternal');

    //add your mocks here
  });

  // instantiate service
  var minePlanter;
  beforeEach(inject(function (_minePlanter_) {
    minePlanter = _minePlanter_;
  }));

  function isArrContains(arr, num) {
    return arr.indexOf(num) !== -1;
  }

  it('should return an array', function () {
    expect(minePlanter.generateMinePosition(5, 5) instanceof Array).toBeTruthy();
  });
  it('should return an array of length "minesNum" when there are enough values', function () {
    expect(minePlanter.generateMinePosition(15, 5).length).toBe(5);
  });
  it('the array length should not exceeds the maxPositionNum parameter', function () {
    expect(minePlanter.generateMinePosition(15, 50).length).toBe(15);
  });
  it('should contains all the original values', function () {
    var resArr = minePlanter.generateMinePosition(15, 15);
    for (var num = 0; num < 15; num++) {
      expect(isArrContains(resArr, num)).toBeTruthy();
    }
  });
  it('should return shuffled array', function () {
    var resArr = minePlanter.generateMinePosition(5, 5);
    expect(resArr).not.toEqual([0, 1, 2, 3, 4]);
  });

});
