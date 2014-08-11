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
      var stopWathcHandle, revealedCellsCount = 0,
          boardSize = configurations.xSize * configurations.ySize,
          maxRevealedCells = boardSize - configurations.mines;

      function getNeighborCells(x, y) {
        var neighborsCoordinates = getNeighborsCoordinates(x, y);
        return mapCoordinatesArrToCellsArr(neighborsCoordinates);
      }

      function isInsideTheGameGrid(x, y) {
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

      function convertIndexToCoordinates(indx) {
        return {
          x: indx % configurations.ySize,
          y: Math.floor(indx / configurations.ySize)
        };
      }

      function mapCoordinatesArrToCellsArr(coordinates) {
        var cellsArr = [];
        coordinates.forEach(function (coordinate) {
          if (isInsideTheGameGrid(coordinate.x, coordinate.y)) {
            cellsArr.push(rows[coordinate.x][coordinate.y]);
          }
        });
        return cellsArr;
      }

      function revealAllCells() {
        rows.forEach(function (row) {
          row.forEach(function (cell) {
            cell.reveal();
          });
        });
      }

      function loseGame() {
        $log.log('lost game');
        cancelStopWatch();
        revealAllCells();
        game.announceMsg = 'You Lose!';
      }

      function winGame() {
        $log.log('win game');
        cancelStopWatch();
        game.announceMsg = 'You Win!';
      }

      function updateElapsedTime(startTime) {
        game.elapsedTime = (new Date().getTime() - startTime);
      }

      function cancelStopWatch() {
        $interval.cancel(stopWathcHandle);
      }

      function startStopWatchIfNotRunning() {
        if (!stopWathcHandle) {
          var startTime = new Date().getTime();
          stopWathcHandle = $interval(function () {
            updateElapsedTime(startTime);
          }, 10);
        }
      }

      function checkForGameTermination(lastPlayedCell) {
        if (lastPlayedCell.isMine()) {
          loseGame();
        } else {
          revealedCellsCount++;
          if (revealedCellsCount === maxRevealedCells) {
            winGame();
          }
        }
      }

      function propagateCellRevealing(x, y) {
        if (surroundingMinesCount(x, y) === 0) {
          var validNeighborCoordinates = getNeighborsCoordinates(x, y).filter(function (coordinate) {
            return isInsideTheGameGrid(coordinate.x, coordinate.y);
          });
          validNeighborCoordinates.forEach(function (coordinate) {
            game.reveal(getCell(coordinate.x, coordinate.y));
          });
        }
      }

      /*
       accepts either a cell object or <x, y> coordinates.
       */
      function getCell(x, y) {
        if (arguments.length === 1) {
          x = arguments[0].x;
          y = arguments[0].y;
        }
        return rows[y][x];
      }

      function surroundingMinesCount(x, y) {
        var neighbors = getNeighborCells(x, y);
        return neighbors.filter(function (cell) {
          return cell.isMine();
        }).length;
      }

      var rows = [];
      this.flagCount = 0;
      this.elapsedTime = 0;

      this.reveal = function reveal(lastPlayedCell) {
        startStopWatchIfNotRunning();
        if (!lastPlayedCell.isRevealed()) {
          lastPlayedCell.reveal();
          checkForGameTermination(lastPlayedCell);
          propagateCellRevealing(lastPlayedCell.x, lastPlayedCell.y);
        }
      };

      this.getRows = function getRows() {
        return rows;
      };

      this.toggleFlag = function toggleFlag(cell) {
        if (cell.toggleFlag()) {
          game.flagCount++;
        } else {
          game.flagCount--;
        }
      };

      this.getLabel = function getLabel(cell) {
        return cell.isMine() ? '' : surroundingMinesCount(cell.x, cell.y) || '';
      };

      this.announceMsg = 'Take your move!';
      for (var x = 0; x < configurations.xSize; x++) {
        for (var y = 0, row = []; y < configurations.ySize; y++) {
          row.push(new Cell(x, y));
        }
        rows.push(row);
      }
      minePlanter.genRandomIndexesInRange(boardSize, configurations.mines).forEach(function (indexPos) {
        getCell(convertIndexToCoordinates(indexPos)).setMine();
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
