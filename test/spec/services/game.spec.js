'use strict';

describe('Service: game', function () {
  var planterMock, cellsCount, game, minesPosArr, conf;

  function minePlanterMock() {
    var planterMock = {};
    planterMock.genRandomIndexesInRange = function () {
      return minesPosArr;
    };
    spyOn(planterMock, 'genRandomIndexesInRange').andCallThrough();
    return planterMock;
  }

  function cellFactoryMock(x, y) {
    cellsCount++;
    var spy = jasmine.createSpy(String(cellsCount)), revealed = false, isMine = false, flag = false;
    spy.x = x;
    spy.y = y;
    spy.reveal = jasmine.createSpy('"cell.reveal()"').andCallFake(function () {
      revealed = true;
    });
    spy.isRevealed = jasmine.createSpy('"cell.isRevealed()"').andCallFake(function () {
      return revealed;
    });
    spy.toggleFlag = jasmine.createSpy('"cell.toggleFlag()"').andCallFake(function () {
      flag = !flag;
      return flag;
    });
    spy.isFlagged = jasmine.createSpy('"cell.isFlagged()"').andReturn(flag);
    spy.isMine = jasmine.createSpy('"cell.isMine()"').andCallFake(function () {
      return isMine;
    });
    spy.setMine = jasmine.createSpy('"cell.setMine()"').andCallFake(function () {
      isMine = true;
    });

    return spy;
  }

  function initializeGame(minesArr) {
    conf.mines = minesArr.length;
    cellsCount = -1;
    minesPosArr = minesArr;
    inject(function (Game) {
      game = new Game(conf);
    });
  }

  beforeEach(function () {
    module('mineswipperAppInternal');
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
        ySize: 3
      };
      initializeGame([0, 2, 4, 6, 8]);
    });

    describe('configurations:', function () {

      it('should invoke minePlanterMock', function () {
        expect(planterMock.genRandomIndexesInRange).toHaveBeenCalledOnce();
      });

      it('should call toggleFlagged upon the cell object', function () {
        var cell = game.getCell(0, 0);
        game.toggleFlag(cell);
        expect(cell.toggleFlag).toHaveBeenCalledOnce();
      });

      it('should start flag counter with zero', function () {
        expect(game.flagCount).toBe(0);
      });

      it('should increase flag count after flagging a cell', function () {
        game.toggleFlag(game.getCell(0, 0));
        expect(game.flagCount).toBe(1);
      });

    });

    describe('getLabel method:', function () {
      beforeEach(function () {
        initializeGame([0, 2, 4, 6, 8]);
      });
      it('should return empty string when asking the label of a cell that is a mine', function () {
        expect(game.getLabel(game.getCell(0, 0))).toBe('');
      });
      it('should return the number of mines surrounding a non-mine cell', function () {
        expect(game.getLabel(game.getCell(1, 0))).toBe(3);
      });
      it('should return empty string when the surrounding mines count is zero', function () {
        initializeGame([]);
        expect(game.getLabel(game.getCell(1, 0))).toBe('');
      });

    });

    describe('revealing propagation:', function () {
      beforeEach(function () {
        initializeGame([]);
      });

      it('should reveal all the board if there is no mines', function () {
        var someCell = game.getCell(0, 0);
        game.reveal(someCell);
        for (var x = 0; x < conf.xSize; x++) {
          for (var y = 0; y < conf.ySize; y++) {
            expect(game.getCell(x, y).isRevealed()).toBe(true);
          }
        }
      });
    });
  });
  describe('large board (10x10) tests:', function () {
    beforeEach(function () {
      conf = {
        xSize: 10,
        ySize: 10
      };
    });

    function testCellInRange(xRight, xLeft, yUp, yBottom, expectFunc) {
      for (var x = xRight; x < xLeft; x++) {
        for (var y = yUp; y < yBottom; y++) {
          expect(expectFunc(game.getCell(x, y))).toBe(true);
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
      var cell = game.getCell(0, 0);
      game.reveal(cell);
      testCellsRevealedInRange(0, 4, 0, conf.ySize);
      testCellsUNRevealedInRange(4, conf.xSize, 0, conf.ySize);
    });

    it('should reveal all the board', function () {
      initializeGame([24, 34, 44, 54, 64, 74, 84, 94]);
      var cell = game.getCell(0, 0);
      game.reveal(cell);
      testCellsRevealedInRange(0, 4, 0, conf.ySize);
      testCellsRevealedInRange(5, conf.xSize, 0, conf.ySize);

      testCellsRevealedInRange(4, 5, 0, 2);
      testCellsUNRevealedInRange(4, 5, 2, conf.ySize);
    });
  });
});
