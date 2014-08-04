'use strict';

describe('Service: game', function () {
  var planterMock, cellsCount, enableMines = true;
  var game, minesPosArr;

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

    spy.isMine = jasmine.createSpy('"cell.isMine()"').andCallFake(function () {
      return isMine && enableMines;
    });
    spy.setMine = jasmine.createSpy('"cell.setMine()"').andCallFake(function () {
      isMine = true;
    });

    return spy;
  }

  // load the service's module
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

    var conf = {
      xSize: 3,
      ySize: 3,
      mines: 5
    };
    beforeEach(function () {
      minesPosArr = [0, 2, 4, 6, 8];
    });
    beforeEach(inject(function (Game) {
      game = new Game(conf);
    }));

    describe('configurations', function () {
      it('should initiate new game with given x size', function () {
        expect(game.xSize()).toBe(conf.xSize);
      });
      it('should initiate new game with given y size', function () {
        expect(game.ySize()).toBe(conf.ySize);
      });
      it('should initiate new game with given number of mines', function () {
        expect(game.minesNum()).toBe(conf.mines);
      });
      it('should invoke minePlanterMock', function () {
        expect(planterMock.generateMinePosition).toHaveBeenCalledOnce();
      });
    });

    describe('retrieved cells', function () {
      it('should retrieved last cell for highest X and Y coordinates', function () {
        expect(Number(game.getCell(conf.xSize - 1, conf.ySize - 1).identity)).toBe((conf.xSize * conf.ySize) - 1);
      });
      it('should retrieved the center cells (index 4, for grid of 3x3)', function () {
        expect(Number(game.getCell(1, 1).identity)).toBe(4);
      });
      it('should throws an error when the one parameter is not a number', function () {
        expect(function () {
          game.getCell([], 1);
        }).toThrow('Coordinate parameters must be numbers.');
      });
      it('should throws an error when the coordinates are out of grid\'s bound', function () {
        expect(function () {
          game.getCell(conf.xSize, 1);
        }).toThrow('Coordinate parameters are out of the grid.');
      });
    });

    function extractSortedId(list) {
      return list.map(function (cell) {
        return Number(cell.identity);
      }).sort();
    }

    describe('getAdjacentCells for grid of 3x3:', function () {
      function testAdjacentByCoordinates(x, y, expected) {
        var adjacentCellsList = game.getAdjacentCells(x, y);
        expect(extractSortedId(adjacentCellsList)).toEqual(expected);
      }

      it('should not exceeds grid boundaries for top-left corner (i.e. (0, 0))', function () {
        testAdjacentByCoordinates(0, 0, [1, 3]);
      });
      it('should return all 4 adjacent cells for the center cell', function () {
        testAdjacentByCoordinates(1, 1, [1, 3, 5, 7]);
      });
    });

    describe('getAllNeighbors for grid of 3x3:', function () {
      function testAllNeighborsByCoordinates(x, y, expected) {
        var neighborsCellsList = game.getAllNeighbors(x, y);
        expect(extractSortedId(neighborsCellsList)).toEqual(expected);
      }

      it('should not exceeds grid boundaries for bottom-right corner (i.e. (2, 2))', function () {
        testAllNeighborsByCoordinates(2, 2, [4, 5, 7]);
      });
      it('should return all the grid besides itself', function () {
        testAllNeighborsByCoordinates(1, 1, [0, 1, 2, 3, 5, 6, 7, 8]);
      });
    });

    describe('reveal mines', function () {

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
    });

    describe('terminations methods', function () {
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

    describe('surrounding mines methods', function () {

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

    describe('revealing propagation', function () {
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
    var conf = {
      xSize: 10,
      ySize: 10,
      mines: 10
    };

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

    function initializeGame(minesArr) {
      minesPosArr = minesArr;
      inject(function (Game) {
        game = new Game(conf);
      });
    }

    beforeEach(function () {
      //initializeGame([4, 14, 24, 34, 44, 54, 64, 74, 84, 94]);
    });

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
