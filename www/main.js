(function(window) {

  var allowButton = document.getElementById('allowButton'),
      onButton = document.getElementById('onButton'),
      offButton = document.getElementById('offButton'),
      postRequest = function(value) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3001/text/' + value, true);
        xhr.send();
        console.log('send > ' + value);
      },
      recognition,
      transcript = '',
      curses = ['shit', 'ass', 'fuck', 'damn', 'damn it', 'donkey', 'dick'],
      censorList = ['s***', 'a**', 'f***'];
      index = 0,
      continuous = true,
      throttle = (function() {
        var timeout = -1,
            delay = 1000;
          return function(func) {
            if(timeout > -1) {
              console.log('request throttled');
              return false;
            } 
            timeout = setTimeout(function() {
              clearTimeout(timeout);
              timeout = -1;
            }, delay);
            console.log('request pass');
            func.apply(null, Array.prototype.slice.call(arguments, 1, arguments.length));
            return true;
          };
      }()),
      notify = function(value) {
        var kill = function() {
              var timeout;
              timeout = setTimeout(function() {
                clearTimeout(timeout);
                // postRequest(<termination>);
              }, 2000);
            };
        if(throttle(postRequest, value)) {
          kill();
        }
      },
      detect = function() {
        if(curses.indexOf(transcript.toLowerCase()) !== -1) {
          console.log('curse found: ' + transcript);
          notify(transcript.toLowerCase());
        }
        else if(transcript.indexOf('*') !== -1) {
          var index = censorList.indexOf(transcript.toLowerCase());
          if(index !== -1) {
            console.log('curse assumed: ' + curses[index]);
            notify(curses[index]);
          }
        }
      };

  onButton.addEventListener('click', function(event) {
    try {
      recognition.start();
    }
    catch(e) {
      console.error(e.message);
    }
  });
  offButton.addEventListener('click', function(event) {
    try {
      recognition.stop();
    }
    catch(e) {
      console.error(e.message);
    }
  });

  window.addEventListener('keydown', function(event) {
    if(String.fromCharCode(event.keyCode).toLowerCase() === 'l') {
      var curse = curses[index++ % curses.length];
      console.log('curse: ' + curse);
      notify(curse);
    }
  });

  if (('webkitSpeechRecognition' in window)) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = 6;

    recognition.onstart = function() { 
      console.log('speech begin');
    };
    recognition.onresult = function(event) {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcript = event.results[i][0].transcript.trim();
        } else {
          transcript = event.results[i][0].transcript.trim();
          if(recognition.continuous) {
            console.log('detect... ' + transcript);
            detect();
          }
        }
      }
    };
    recognition.onerror = function(event) { 
      console.log('speech error: ' + JSON.stringify(event, null, 2));
    };
    recognition.onend = function() { 
      console.log('speech end: ' + transcript);
      detect();
    };
  }

}(this));