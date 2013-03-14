/*global require:false module:false __dirname:false process:false*/

// modified board.js to allow for debug. lines 39 & 42
var arduino = require('duino'),
    board = new arduino.Board( {
      debug: true
    }),
    LCD = require(process.cwd() + '/script/lcd'),
    express = require('express'),
    app = express(),
    args = require('optimist').argv,
    port = 3001,
    alive = true,
    lcd = new LCD({
      board: board,
      pin: 4
    });

// process arguments.
if(args) {
  if(args.hasOwnProperty('port')) {
    port = args.port;
  }
}

app.use(express.static(__dirname));

app.post('/text/:value', function(req, res, next) {
  var value = req.param('value');
  board.log('text/:value: ' + value);
  if(alive) {
    lcd.write(value);
  }
  res.send(true);
});

app.listen(port);
board.log("serial textserver running on port " + port + " in " + app.settings.env + " mode");