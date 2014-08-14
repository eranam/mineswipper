'use strict';

describe('Service: announceBoard', function () {

  // load the service's module
  beforeEach(function () {
    module('mineswipperAppInternal');
    module({$timeout: setTimeout});
  });

  var announceBoard;
  beforeEach(inject(function (_announceBoard_) {
    jasmine.Clock.useMock();
    announceBoard = _announceBoard_;
  }));

  function testAnnounceGivenMsg(msg) {
    expect(announceBoard.getContent()).toBe(msg);
    expect(announceBoard.isAnnouncing()).toBe(true);
  }

  it('should initialize announcing to false', function () {
    expect(announceBoard.isAnnouncing()).toBe(false);
  });

  it('should return empty string when not announcing', function () {
    expect(announceBoard.getContent()).toBe('');
  });

  it('should announce', function () {
    var str = 'bla';
    announceBoard.announce(str);
    testAnnounceGivenMsg(str);
    jasmine.Clock.tick(1000000);
    testAnnounceGivenMsg(str);
  });

  it('should announce for given ms', function () {
    var ms = 100, str = 'erna';
    announceBoard.announceForGivenMs(str, ms);
    testAnnounceGivenMsg(str);
    jasmine.Clock.tick(ms + 1);
    expect(announceBoard.isAnnouncing()).toBe(false);
    expect(announceBoard.getContent()).toBe('');
  });

});
