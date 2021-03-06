/*global module:false*/
var LCD = (function(options) {
  this.board = options.board;
  this.pin = options.pin || 1;
  this.board.pinMode(this.pin, 'out');
});

LCD.prototype.write = function(word) {
  var char,
      nmPin = this.board.normalizePin(this.pin);
  this.board.write('97' + nmPin + '00' + word);
};

LCD.prototype.normalizeChar = function(char) {
  return char.charCodeAt(0).toString(16).toUpperCase();
};

module.exports = LCD;