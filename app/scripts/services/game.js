'use strict';

(function () {

  /* @ngInject */
  function gameFactory(Cell, minePlanter) {
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
      angular.extend(this.configurations, conf);
      this.cells = [];
      this.revealedCounter = 0;
      var boardSize = this.configurations.xSize * this.configurations.ySize;
      this.maxRevealed = boardSize - this.configurations.mines;
      var cellsNum = this.configurations.xSize * this.configurations.ySize;
      for (var i = 0; i < cellsNum; i++) {
        this.cells.push(new Cell());
      }
      this.gameState = gameStates.inProgress;
      minePlanter.generateMinePosition(this.configurations.mines, boardSize).forEach(function (indexPos) {
        that.cells[indexPos].setMine();
      });
    }

    function isInsideGrid(game, x, y) {
      return (x >= 0 && x < game.configurations.xSize) && (y >= 0 && y < game.configurations.ySize);
    }

    function assertCoordinates(game, x, y) {
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

    function convertCoordinateToCells(game, coordinates) {
      var cells = [];
      coordinates.forEach(function (coordinate) {
        if (isInsideGrid(game, coordinate.x, coordinate.y)) {
          var index = convertCoordinatesToIndex(game, coordinate.x, coordinate.y);
          cells.push(game.cells[index]);
        }
      });
      return cells;
    }

    function getNeighbors(game, x, y, onlyAdjacent) {
      assertCoordinates(game, x, y);
      var neighborsCoordinates = getNeighborsCoordinates(x, y, onlyAdjacent);
      return convertCoordinateToCells(game, neighborsCoordinates);
    }

    function updateGameState(game, cell) {
      if (cell.isMine()) {
        game.gameState = gameStates.lost;
      } else {
        game.revealedCounter++;
        if (game.revealedCounter === game.maxRevealed) {
          game.gameState = gameStates.win;
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
    Game.prototype.xSize = function xSize() {
      return this.configurations.xSize;
    };
    Game.prototype.ySize = function ySize() {
      return this.configurations.ySize;
    };
    Game.prototype.minesNum = function minesNum() {
      return this.configurations.mines;
    };
    Game.prototype.getCell = function getCell(x, y) {
      assertCoordinates(this, x, y);
      var index = convertCoordinatesToIndex(this, x, y);
      return this.cells[index];
    };
    Game.prototype.getAdjacentCells = function getAdjacentCells(x, y) {
      return getNeighbors(this, x, y, true);
    };
    Game.prototype.getAllNeighbors = function getAllNeighbors(x, y) {
      return getNeighbors(this, x, y, false);
    };
    Game.prototype.getRevealedCounter = function getRevealedCounter() {
      return this.revealedCounter;
    };
    Game.prototype.reveal = function reveal(x, y) {
      assertCoordinates(this, x, y);
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
      var neighbors = this.getAllNeighbors(x, y);
      return neighbors.filter(function (cell) {
        return cell.isMine();
      }).length;
    };

    return Game;
  }

  angular
      .module('mineswipperAppInternal')
      .factory('Game', gameFactory);

})();
