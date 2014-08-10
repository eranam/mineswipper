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
      it('should get the mines count according to the configuration object', function () {
        expect(game.getMinesCount()).toBe(conf.mines);
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

    describe('reveal mines:', function () {
      /*
       it('should initialize revealedCounter to zero', function () {
       expect(game.getRevealedCounter()).toBe(0);
       });
       it('should revealed the mine and update the counter', function () {
       game.reveal(0, 1);
       expect(game.getCell(0, 1).reveal).toHaveBeenCalledOnce();
       expect(game.getRevealedCounter()).toBe(1);
       });
       it('should not revealed twice', function () {
       game.reveal(0, 1);
       game.reveal(0, 1);
       expect(game.getCell(0, 1).reveal).toHaveBeenCalledOnce();
       expect(game.getRevealedCounter()).toBe(1);
       });
       */
    });

    describe('terminations methods:', function () {
      function revealAll(game, skipMines) {
        if (typeof skipMines === 'undefined') {
          skipMines = false;
        }
        for (var x = 0; x < conf.xSize; x++) {
          for (var y = 0; y < conf.ySize; y++) {
            if (!skipMines || !game.getCell(x, y).isMine()) {
              game.reveal(x, y);
            }
          }
        }
      }

      function revealAllNoneMines(game) {
        revealAll(game, true);
      }

      it('should initialized the game such that isWin() return false', function () {
        expect(game.isWin()).toBeFalsy();
      });
      it('should initialized the game such that isLost() return false', function () {
        expect(game.isLost()).toBeFalsy();
      });
      it('should lose after stepping on a mine', function () {
        game.reveal(0, 0);
        expect(game.isLost()).toBeTruthy();
        expect(game.isWin()).toBeFalsy();
      });
      it('should Lose after a mine exploded', function () {
        game.reveal(0, 0);
        revealAll(game);
        expect(game.isWin()).toBeFalsy();
        expect(game.isLost()).toBeTruthy();
      });
      it('should win if revealed all non-mine cell', function () {
        revealAllNoneMines(game);
        expect(game.isWin()).toBeTruthy();
        expect(game.isLost()).toBeFalsy();
      });

    });

    describe('surrounding mines methods:', function () {

      it('should return the number of mines surrounding a cell excluding itself (which is a mine)', function () {
        expect(game.surroundingMinesCount(0, 0)).toBe(1);
      });
      it('should return the number of mines surrounding the center cell', function () {
        expect(game.surroundingMinesCount(1, 1)).toBe(4);
      });
      it('should return the number of mines surrounding a non-mine cell', function () {
        expect(game.surroundingMinesCount(1, 0)).toBe(3);
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
      expect(game.isWin()).toBeFalsy();
      testCellsRevealedInRange(0, 4, 0, conf.ySize);
      testCellsUNRevealedInRange(4, conf.xSize, 0, conf.ySize);
    });

    it('should reveal all the board', function () {
      initializeGame([24, 34, 44, 54, 64, 74, 84, 94]);
      game.reveal(0, 0);
      expect(game.isWin()).toBeTruthy();
      testCellsRevealedInRange(0, 4, 0, conf.ySize);
      testCellsRevealedInRange(5, conf.xSize, 0, conf.ySize);

      testCellsRevealedInRange(4, 5, 0, 2);
      testCellsUNRevealedInRange(4, 5, 2, conf.ySize);
    });
  });
});
