'use strict';

describe('Service: game', function () {
  var planterMock, cellsCount, game, minesPosArr, conf;
  var enableMines = true;

  function minePlanterMock() {
    var planterMock = {};
    planterMock.generateMinePosition = function () {
      return minesPosArr;
    };
    spyOn(planterMock, 'generateMinePosition').andCallThrough();
    return planterMock;
  }

  function cellFactoryMock() {
    cellsCount++;
    var spy = jasmine.createSpy(String(cellsCount)), revealed = false, isMine = false;

    spy.reveal = jasmine.createSpy('"cell.reveal()"').andCallFake(function () {
      revealed = true;
    });

    spy.isRevealed = jasmine.createSpy('"cell.isRevealed()"').andCallFake(function () {
      return revealed;
    });
    spy.toggleFlag = jasmine.createSpy('"cell.toggleFlag()"');
    spy.isFlagged = jasmine.createSpy('"cell.isFlagged()"');

    spy.isMine = jasmine.createSpy('"cell.isMine()"').andCallFake(function () {
      return isMine && enableMines;
    });

    spy.setMine = jasmine.createSpy('"cell.setMine()"').andCallFake(function () {
      isMine = true;
    });

    return spy;
  }

  function initializeGame(minesArr) {
    minesPosArr = minesArr;
    inject(function (Game) {
      game = new Game(conf);
    });
  }

  beforeEach(function () {
    module('mineswipperAppInternal');
    cellsCount = -1;
    planterMock = minePlanterMock();
    module({
      Cell: cellFactoryMock,
      minePlanter: planterMock
    });
  });

  describe('small board (3x3) tests:', function () {
    beforeEach(function () {
      conf = {
        xSize: 3,
        ySize: 3,
        mines: 5
      };
      initializeGame([0, 2, 4, 6, 8]);
    });

    describe('configurations:', function () {
      function testCallingThroghtToCell(methodName) {
        game[methodName](0, 0);
        var cell = game.getCell(0, 0);
        expect(cell[methodName]).toHaveBeenCalledOnce();
      }

      it('should invoke minePlanterMock', function () {
        expect(planterMock.generateMinePosition).toHaveBeenCalledOnce();
      });

      it('should call isReveal upon the cell object', function () {
        testCallingThroghtToCell('isRevealed');
      });
      it('should call isFlagged upon the cell object', function () {
        testCallingThroghtToCell('isFlagged');
      });
      it('should call toggleFlagged upon the cell object', function () {
        testCallingThroghtToCell('toggleFlag');
      });
    });

    describe('getLabel method:', function () {

      it('should return empty string when asking the label of a cell that is a mine', function () {
        expect(game.getLabel(0, 0)).toBe('');
      });
      it('should return the number of mines surrounding a non-mine cell', function () {
        expect(game.getLabel(1, 0)).toBe(3);
      });
      it('should return empty string when the surrounding mines count is zero', function () {
        initializeGame([]);
        expect(game.getLabel(1, 0)).toBe('');
      });

    });

    describe('revealing propagation:', function () {
      beforeEach(function () {
        enableMines = false;
      });
      afterEach(function () {
        enableMines = true;
      });

      it('should reveal all the board if there is no mines', function () {
        game.reveal(0, 0);
        for (var x = 0; x < conf.xSize; x++) {
          for (var y = 0; y < conf.ySize; y++) {
            expect(game.getCell(x, y).isRevealed()).toBeTruthy();
          }
        }
      });

    });
  });
  describe('large board (10x10) tests:', function () {
    beforeEach(function () {
      conf = {
        xSize: 10,
        ySize: 10,
        mines: 10
      };
    });

    function testCellInRange(xRight, xLeft, yUp, yBottom, expectFunc) {
      for (var x = xRight; x < xLeft; x++) {
        for (var y = yUp; y < yBottom; y++) {
          expect(expectFunc(game.getCell(x, y))).toBeTruthy();
        }
      }
    }

    function testCellsUNRevealedInRange(xRight, xLeft, yUp, yBottom) {
      function isNotReveal(cell) {
        return !cell.isRevealed();
      }

      testCellInRange(xRight, xLeft, yUp, yBottom, isNotReveal);
    }

    function testCellsRevealedInRange(xRight, xLeft, yUp, yBottom) {
      function isReveal(cell) {
        return cell.isRevealed();
      }

      testCellInRange(xRight, xLeft, yUp, yBottom, isReveal);
    }

    it('should reveal only half of the board', function () {
      initializeGame([4, 14, 24, 34, 44, 54, 64, 74, 84, 94]);
      game.reveal(0, 0);
      testCellsRevealedInRange(0, 4, 0, conf.ySize);
      testCellsUNRevealedInRange(4, conf.xSize, 0, conf.ySize);
    });

    it('should reveal all the board', function () {
      initializeGame([24, 34, 44, 54, 64, 74, 84, 94]);
      game.reveal(0, 0);
      testCellsRevealedInRange(0, 4, 0, conf.ySize);
      testCellsRevealedInRange(5, conf.xSize, 0, conf.ySize);

      testCellsRevealedInRange(4, 5, 0, 2);
      testCellsUNRevealedInRange(4, 5, 2, conf.ySize);
    });
  });
});
