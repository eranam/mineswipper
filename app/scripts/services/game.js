'use strict';

(function () {

  /* @ngInject */
  function gameFactory(Cell, minePlanter, $timeout) {
    var gameStates = {
      inProgress: 'inProgress',
      win: 'win',
      lost: 'lost'
    };

    function Game(conf) {
      var that = this;
      this.configurations = {
        xSize: 10,
        ySize: 10,
        mines: 100
      };
      this.announceMsg = 'Take your move!';
      angular.extend(this.configurations, conf);
      this.cells = [];
      this.revealedCounter = 0;
      this.flagCount = 0;
      var boardSize = this.configurations.xSize * this.configurations.ySize;
      this.maxRevealed = boardSize - this.configurations.mines;
      var cellsNum = this.configurations.xSize * this.configurations.ySize;
      for (var i = 0; i < cellsNum; i++) {
        this.cells.push(new Cell());
      }
      this.gameState = gameStates.inProgress;
      minePlanter.generateMinePosition(boardSize, this.configurations.mines).forEach(function (indexPos) {
        that.cells[indexPos].setMine();
      });
      $timeout(function (){
        that.announceMsg = undefined;
      }, 1000);
    }

    function isInsideGrid(game, x, y) {
      return (x >= 0 && x < game.configurations.xSize) && (y >= 0 && y < game.configurations.ySize);
    }

    function assertValidCoordinates(game, x, y) {
      if (!angular.isNumber(x) || !angular.isNumber(y)) {
        throw new Error('Coordinate parameters must be numbers.');
      } else if (!isInsideGrid(game, x, y)) {
        throw new Error('Coordinate parameters are out of the grid.');
      }
    }

    function getNeighborsCoordinates(xVal, yVal, onlyAdjacent) {
      function isAdjacentCoordinate(indentX, indentY) {
        return !indentY || !indentX;
      }

      var res = [], indentVal = [1, 0, -1];
      indentVal.forEach(function (indentX) {
        indentVal.forEach(function (indentY) {
          if (indentY || indentX) {
            if (!onlyAdjacent || isAdjacentCoordinate(indentX, indentY)) {
              res.push({x: xVal + indentX, y: yVal + indentY});
            }
          }
        });
      });
      return res;
    }

    function convertCoordinatesToIndex(game, x, y) {
      return x + (y * game.configurations.xSize);
    }

    function mapCoordinateArrToCellsArr(game, coordinates) {
      var cells = [];
      coordinates.forEach(function (coordinate) {
        if (isInsideGrid(game, coordinate.x, coordinate.y)) {
          var index = convertCoordinatesToIndex(game, coordinate.x, coordinate.y);
          cells.push(game.cells[index]);
        }
      });
      return cells;
    }

    function getNeighborsArr(game, x, y, onlyAdjacent) {
      assertValidCoordinates(game, x, y);
      var neighborsCoordinates = getNeighborsCoordinates(x, y, onlyAdjacent);
      return mapCoordinateArrToCellsArr(game, neighborsCoordinates);
    }

    function revealAll(game) {
      game.cells.forEach(function (cell) {
        cell.reveal();
      });
    }

    function lose(game) {
      game.gameState = gameStates.lost;
      revealAll(game);
      game.announceMsg = 'You Lose!';
    }

    function win(game) {
      game.gameState = gameStates.win;
      game.announceMsg = 'You Win!';
    }

    function updateGameState(game, cell) {
      if (cell.isMine()) {
        lose(game);
      } else {
        game.revealedCounter++;
        if (game.revealedCounter === game.maxRevealed) {
          win(game);
        }
      }
    }

    function revealingPropagation(game, x, y) {
      if (game.surroundingMinesCount(x, y) === 0) {
        var neighborsCoordinates = getNeighborsCoordinates(x, y).filter(function (coordinate) {
          return isInsideGrid(game, coordinate.x, coordinate.y);
        });
        neighborsCoordinates.forEach(function (coordinate) {
          game.reveal(coordinate.x, coordinate.y);
        });
      }
    }

    Game.states = gameStates;

    Game.prototype.getCell = function getCell(x, y) {
      assertValidCoordinates(this, x, y);
      var index = convertCoordinatesToIndex(this, x, y);
      return this.cells[index];
    };

    function getAllNeighbors(game, x, y) {
      return getNeighborsArr(game, x, y, false);
    }

    Game.prototype.reveal = function reveal(x, y) {
      assertValidCoordinates(this, x, y);
      var cell = this.cells[convertCoordinatesToIndex(this, x, y)];
      if (!cell.isRevealed()) {
        cell.reveal();
        updateGameState(this, cell);
        revealingPropagation(this, x, y);
      }
    };
    Game.prototype.isWin = function isWin() {
      return this.gameState === gameStates.win;
    };
    Game.prototype.isLost = function isLost() {
      return this.gameState === gameStates.lost;
    };
    Game.prototype.surroundingMinesCount = function surroundingMinesCount(x, y) {
      var neighbors = getAllNeighbors(this, x, y);
      return neighbors.filter(function (cell) {
        return cell.isMine();
      }).length;
    };
    Game.prototype.getMinesCount = function getMinesCount() {
      return this.configurations.mines;
    };
    Game.prototype.getY = function getY() {
      return this.configurations.ySize;
    };
    Game.prototype.getX = function getX() {
      return this.configurations.xSize;
    };
    Game.prototype.isRevealed = function isRevealed(x, y) {
      return this.getCell(x, y).isRevealed();
    };
    Game.prototype.isFlagged = function isFlagged(x, y) {
      return this.getCell(x, y).isFlagged();
    };
    Game.prototype.toggleFlag = function getState(x, y) {
      return this.getCell(x, y).toggleFlag() ? ++this.flagCount : --this.flagCount;
    };
    Game.prototype.getLable = function getLable(x, y) {
      return this.getCell(x, y).isMine() ? '' : this.surroundingMinesCount(x, y) || '';
    };
    Game.prototype.isMine = function getLable(x, y) {
      return this.getCell(x, y).isMine();
    };
    return Game;
  }

  angular
      .module('mineswipperAppInternal')
      .factory('Game', gameFactory);

})();
