'use strict';

(function () {

  /* @ngInject */
  function gameFactory(Cell, minePlanter, $timeout, $interval, $log) {
    function Game(conf) {
      var game = this;
      var configurations = {
        xSize: 10,
        ySize: 10,
        mines: 100
      };
      angular.extend(configurations, conf);
      var timerHandle = undefined, revealedCounter = 0,
          boardSize = configurations.xSize * configurations.ySize,
          maxRevealed = boardSize - configurations.mines,
          cellsNum = configurations.xSize * configurations.ySize;

      function getAllNeighbors(x, y) {
        var neighborsCoordinates = getNeighborsCoordinates(x, y);
        return mapCoordinateArrToCellsArr(neighborsCoordinates);
      }

      function isInsideGrid(x, y) {
        return (x >= 0 && x < configurations.xSize) && (y >= 0 && y < configurations.ySize);
      }

      function getNeighborsCoordinates(xVal, yVal) {
        var res = [], indentVal = [1, 0, -1];
        indentVal.forEach(function (indentX) {
          indentVal.forEach(function (indentY) {
            if (indentY || indentX) {
              res.push({x: xVal + indentX, y: yVal + indentY});
            }
          });
        });
        return res;
      }

      function convertCoordinatesToIndex(x, y) {
        return x + (y * configurations.xSize);
      }

      function mapCoordinateArrToCellsArr(coordinates) {
        var cellsArr = [];
        coordinates.forEach(function (coordinate) {
          if (isInsideGrid(coordinate.x, coordinate.y)) {
            var index = convertCoordinatesToIndex(coordinate.x, coordinate.y);
            cellsArr.push(game.cells[index]);
          }
        });
        return cellsArr;
      }

      function revealAll() {
        game.cells.forEach(function (cell) {
          cell.reveal();
        });
      }

      function loseGame() {
        cancelTimer();
        revealAll();
        game.announceMsg = 'You Lose!';
      }

      function winGame() {
        cancelTimer();
        game.announceMsg = 'You Win!';
      }

      function updateTimer(startTime) {
        game.elapsedTime = (new Date().getTime() - startTime);
      }

      function cancelTimer() {
        $interval.cancel(timerHandle);
      }

      function startTimerIfNotRunning() {
        if (!timerHandle) {
          var startTime = new Date().getTime();
          timerHandle = $interval(function () {
            updateTimer(startTime);
          }, 10);
        }
      }

      function checkForGameTermination(cell) {
        if (cell.isMine()) {
          $log.log('lost game');
          loseGame();
        } else {
          revealedCounter++;
          if (revealedCounter === maxRevealed) {
            $log.log('win game');
            winGame();
          }
        }
      }

      function propagateCellReveal(x, y) {
        if (surroundingMinesCount(x, y) === 0) {
          var neighborsCoordinates = getNeighborsCoordinates(x, y).filter(function (coordinate) {
            return isInsideGrid(coordinate.x, coordinate.y);
          });
          neighborsCoordinates.forEach(function (coordinate) {
            game.reveal(coordinate.x, coordinate.y);
          });
        }
      }

      function getCell(x, y) {
        var index = convertCoordinatesToIndex(x, y);
        return game.cells[index];
      }

      function surroundingMinesCount(x, y) {
        var neighbors = getAllNeighbors(x, y);
        return neighbors.filter(function (cell) {
          return cell.isMine();
        }).length;
      }

      this.cells = [];
      this.flagCount = 0;
      this.elapsedTime = 0;

      this.reveal = function reveal(x, y) {
        startTimerIfNotRunning();
        var cell = this.cells[convertCoordinatesToIndex(x, y)];
        if (!cell.isRevealed()) {
          cell.reveal();
          checkForGameTermination(cell);
          propagateCellReveal(x, y);
        }
      };

      this.getY = function getY() {
        return configurations.ySize;
      };

      this.getX = function getX() {
        return configurations.xSize;
      };

      this.isRevealed = function isRevealed(x, y) {
        return getCell(x, y).isRevealed();
      };

      this.isFlagged = function isFlagged(x, y) {
        return getCell(x, y).isFlagged();
      };

      this.toggleFlag = function getState(x, y) {
        return getCell(x, y).toggleFlag() ? ++game.flagCount : --game.flagCount;
      };

      this.getLabel = function getLabel(x, y) {
        return getCell(x, y).isMine() ? '' : surroundingMinesCount(x, y) || '';
      };

      this.isMine = function isMine(x, y) {
        return getCell(x, y).isMine();
      };

      this.announceMsg = 'Take your move!';
      for (var i = 0; i < cellsNum; i++) {
        game.cells.push(new Cell());
      }
      minePlanter.generateMinePosition(boardSize, configurations.mines).forEach(function (indexPos) {
        game.cells[indexPos].setMine();
      });
      $timeout(function () {
        game.announceMsg = undefined;
      }, 1000);
      this.getCell = getCell;
    }

    return Game;
  }

  angular
      .module('mineswipperAppInternal')
      .factory('Game', gameFactory);

})();
