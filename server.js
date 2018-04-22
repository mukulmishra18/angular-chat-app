var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static('./'));

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, './client/index.html'));
});

var state = {
  proceed: false,
  cancelled: false,
  finished: false,
  startedShopping: false,
  confirmed: false
};

io.on('connection', function (socket) {
  console.log('user connected');


  // Promisify timeout function. Get rid of callback hell. Pheww...
  function promiseTimeout(callback, millisec) {
    return new Promise(function (resolve, reject) {
      return setTimeout(function () {
        callback();
        resolve();
      }, millisec);
    });
  }

  promiseTimeout(function() {
    io.emit('message', {
      me: 'bot',
      attachment: {
        type: 'text',
        message: 'Hi! I am an automated bot!'
      }
    });
  }, 1500).then(function() {
    return promiseTimeout(function() {
      io.emit('message', {
        me: 'bot',
        attachment: {
          type: 'text',
          message: 'I have something for you that I will try to sell you today.'
        }
      });  
    }, 1500);
  }).then(function() {
    return promiseTimeout(function() {
      io.emit('message', {
        me: 'bot',
        attachment: {
          type: 'button',
          message: 'Click to \"Proceed\" to continue or \"Cancel\" to cancel.',
          text1: 'Proceed',
          link1: '#',
          text2: 'Cancel',
          link2: '#'
        }
      });
    }, 1500);
  });

  socket.on('message', function (message) {
    if (state.finished || state.cancelled) {
      return;
    }
    console.log('Message:', message);
    if (message.attachment.type === 'text') {
      if (message.attachment.message === 'Proceed' && !state.proceed) {
        state.proceed = true;
        promiseTimeout(function() {
          io.emit('message', {
            me: 'bot',
            attachment: {
              type: 'text',
              message: 'Great! Here is the product!'
            }
          });
        }, 1500).then(function() {
          return promiseTimeout(function() {
            io.emit('message', {
              me: 'bot',
              attachment: {
                type: 'image',
                url: '/client/img/shoes.jpg',
                title: 'Nike A500S',
                subtitle: 'Light weight, comfortable',
                link1: '#',
                link2: '#'
              }
            });
          }, 1500);
        });
      }

      if (message.attachment.message === 'Cancel') {
        state.cancelled = true;
        io.emit('message', message);
        promiseTimeout(function() {
          io.emit('message', {
            me: 'bot',
            attachment: {
              type: 'text',
              message: 'Order cancelled successfully.'
            }
          });
        }, 1500).then(function() {
          promiseTimeout(function() {
            io.emit('message', {
              me: 'bot',
              attachment: {
                type: 'text',
                message: 'Thank You for shopping with us!'
              }
            });
          }, 1500);
        });
      }

      if (message.attachment.message === 'Shopp!!' && !state.startedShopping) {
        state.startedShopping = true;
        promiseTimeout(function() {
          io.emit('message', {
            me: 'bot',
            attachment: {
              type: 'text',
              message: 'Great!'
            }
          });
        }, 1500).then(function() {
          promiseTimeout(function() {
            io.emit('message', {
              me: 'bot',
              attachment: {
                type: 'quickReply',
                message: 'Choose a size.',
                replies: [11, 12, 13]
              }
            });
          }, 1500);
        });
      }

      if (message.attachment.message === 'Confirm' && !state.confirmed) {
        state.confirmed = true;
        promiseTimeout(function() {
          io.emit('message', {
            me: 'bot',
            attachment: {
              type: 'text',
              message: 'We mailed you the receipt.'
            }
          });
        }, 1500).then(function() {
          promiseTimeout(function() {
            io.emit('message', {
              me: 'bot',
              attachment: {
                type: 'text',
                message: 'Thank you for shopping with us!'
              }
            });
          }, 1500);
        });
      }
    }

    if (message.attachment.type === 'quick_reply') {
      if (message.attachment.message === 'Choose a size.') {
        state.size = message.attachment.response;
        promiseTimeout(function() {
          io.emit('message', {
            me: 'bot',
            attachment: {
              type: 'text',
              message: 'Nice fit!'
            }
          });
        }, 1500).then(function() {
          promiseTimeout(function() {
            io.emit('message', {
              me: 'bot',
              attachment: {
                type: 'quickReply',
                message: 'How many?',
                replies: [1, 2, 3]
              }
            });
          }, 1500);
        });
      }

      if (message.attachment.message === 'How many?') {
        state.number = message.attachment.response;
        promiseTimeout(function() {
          io.emit('message', {
            me: 'bot',
            attachment: {
              type: 'text',
              message: 'Almost done!'
            }
          });
        }, 1500).then(function() {
          return promiseTimeout(function() {
            io.emit('message', {
              me: 'bot',
              attachment: {
                type: 'text',
                message: 'Generating receipt. Please wait for a second'
              }
            });
          }, 1500);
        }).then(function() {
          return promiseTimeout(function() {
            io.emit('message', {
              me: 'bot',
              attachment: {
                type: 'receipt',
                imageUrl: '/client/img/shoes.jpg',
                number: state.number,
                size: state.size,
                cardInfo: 'Visa 5565',
                address: '232 Hacker Street, Imaginary World',
                total: '$66.99'
              }
            });
          }, 2000);
        }).then(function() {
          return promiseTimeout(function() {
            io.emit('message', {
              me: 'bot',
              attachment: {
                type: 'button',
                message: 'Click to \"Confirm\" to confirm the order or \"Cancel\" to cancel.',
                text1: 'Confirm',
                link1: '#',
                text2: 'Cancel',
                link2: '#'
              }
            })
          }, 1500);
        });
      }
    }

    io.emit('message', message);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
})

http.listen(8080, function () {
  console.log('Server listening on port 8080');
});
