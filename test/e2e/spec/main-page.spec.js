'use strict';

require('../lib/matchers.protractor.js');
var MainPage = require('../pages/main-page.js');

describe('mineswipperApp Main Page', function () {
  var mainPage;

  beforeEach(function () {
    mainPage = new MainPage();
    browser.addMockModule('mineswipperAppMocks', function () {
      module({
        minePlanter: {
          generateMinePosition: function () {
            return [0];
          }
        }
      });
    });
  })
  ;

  afterEach(function () {
    browser.removeMockModule();
  });

  it('should display the board only after clicking "start game"', function () {
    mainPage.navigate();
    var gameSection = $('.game-section');
    expect(gameSection).toHaveClass('ng-hide');
    $('#start-game-btn').click();
    expect(gameSection).not.toHaveClass('ng-hide');
  });

  it('should display "lose" message when stepping upon a mine', function () {
    mainPage.navigate();
    var announceMsg = $('.announce-msg');
    expect(announceMsg).toHaveClass('ng-hide');
    $('.game-cell [data-x=0][data-y=0]').click();
    expect(announceMsg).not.toHaveClass('ng-hide');
    expect(announceMsg.getText()).toContain('win');
  });

})
;
