var app = angular.module('myApp',[]);
var socket = io.connect();

function handleProceed(message) {
  socket.emit('message', {
    me: 'man',
    attachment: {
      type:  'text',
      message: message
    }
  });
}

function handleCancel() {
  socket.emit('message', {
    me: 'man',
    attachment: {
      type:  'text',
      message: 'Cancel'
    }
  });
}

function handleShopping() {
  socket.emit('message', {
    me: 'man',
    attachment: {
      type:  'text',
      message: 'Shopp!!'
    }
  });
}

function handleQuickReply(args) {
  console.log(response);
  var [response, message] = args.split(',')
  $('#quick-reply').remove();
  socket.emit('message', {
    me: 'man',
    attachment: {
      type:  'quick_reply',
      message: message,
      response: response
    }
  });
}

function generateTextTemplate(message) {
  return '<p class="flex-text message">' + message + '</p>';
}

function generateQuickReplyTemplate(message, replies) {
  var html = '<div id="quick-reply" class="container text-center">';

  for (var i = 0; i < replies.length; i++) {
    html += '<button class="btn btn-primary quick-button" onclick="handleQuickReply(\'' + replies[i] + ',' + message + '\')">' + replies[i] + '</button>';
  }

  html += '</div>';

  return html;
}

function generateImageTemplate(title, subtitle, imageUrl, link1, link2) {
  var html =
    '<div class="card" style="width: 100%; border-radius: 8px">' +
      '<img class="card-img-top" style="border-top-left-radius: 8px; border-top-right-radius: 8px" src="'+ imageUrl + '" alt="Card image cap">' +
      '<div class="card-body">' +
        '<h5 class="card-title" style="font-weight: bold;">' + title + '</h5>' +
        '<h6 class="card-subtitle mb-2 text-muted" style="font-size: 80%;">' + subtitle + '</h6>' +
        '<hr/>' +
        '<div class="text-center" style="cursor: pointer" onclick="handleShopping()"><a href="' + link1 + '">Start Shopping</a></div>' +
        '<hr>' +
        '<div class="text-center" style="cursor: pointer"><a href="' + link2 + '">Call Us</a></div>' +
      '</div>' +
    '</div>';

  return html;
}

function generateVideoTemplate() {
  var html =
    '<div class="card" style="width: 18rem; border-radius: 8px">' +
      '<video class="card-img-top" controls src="../../../Downloads/javascript30/00 - Getting Setup.mp4" style="border-top-left-radius: 8px; border-top-right-radius: 8px"></video>' +
      '<div class="card-body" style="margin-top: -12%">' +
        '<hr/>' +
        '<div class="text-center" style="cursor: pointer"><a href="#">Show Me more!</a></div>' +
      '</div>' +
    '</div>';

  return html;
}

function generateButtonTemplate(message, text1, link1, text2, link2) {
  var html =  
  '<div class="card" style="width: 100%; border-radius: 8px">' +
    '<div class="card-body">' +
      '<p class="button-text" style="opacity: 0.8; font-family: sans-serif">' + message + '</p>' +
      '<div class="text-center" style="cursor: pointer" onclick="handleProceed(\'' + text1 + '\')"><a href="' + link1 + '">' + text1 + '</a></div>' +
      '<hr>' +
      '<div class="text-center" style="cursor: pointer" onclick="handleCancel()"><a href="' + link2 + '">' + text2 + '</a></div>' +
    '</div>' +
  '</div>';

  return html;
}

function generateReceiptTemplate(imageUrl, number, size, cardInfo, address, total) {
  var html =
    '<div class="card" style="width: 100%; border-radius: 8px">' +
      '<img class="card-img-top" style="border-top-left-radius: 8px; border-top-right-radius: 8px" src="' + imageUrl + '" alt="Card image cap">' +
      '<div class="card-body">' +
        '<div class="grid-container">' +
          '<div class="grid-items">' +
            '<h5 class="card-title" style="font-weight: bold;">Paid With</h5>' +
            '<h6 class="card-subtitle mb-2 text-muted" style="font-size: 80%;">' + cardInfo + '</h6>' +
          '</div>' +
          '<div class="grid-items">' +
            '<h5 class="card-title" style="font-weight: bold;">Number of items</h5>' +
            '<h6 class="card-subtitle mb-2 text-muted" style="font-size: 80%;">' + number + '</h6>' +
          '</div>' +
          '<div class="grid-items">' +
            '<h5 class="card-title" style="font-weight: bold;">Ship To</h5>' +
            '<h6 class="card-subtitle mb-2 text-muted" style="font-size: 80%;">' + address + '</h6>' +
          '</div>' +
          '<div class="grid-items">' +
            '<h5 class="card-title" style="font-weight: bold;">Size</h5>' +
            '<h6 class="card-subtitle mb-2 text-muted" style="font-size: 80%;">' + size + '</h6>' +
          '</div>' +
        '</div>' +
        '<hr/>' +
        '<p style="float: left">Total</p><p style="float: right; font-weight: bold">' + total + '</p>' +
      '</div>'
    '</div>';

  return html;
}

app.controller('myCtrl', function($scope){

  $('input').keypress(function(e) {
    if (e.which == 13) {
      $('#sendMessage').click();
    }
  });

  $scope.send = function () {
 	  var msg = $scope.message;

    $scope.message = "";
    socket.emit('message', {
      me: 'man',
      attachment: {
        type: 'text',
        message: msg
      }
    });
 }

  socket.on('message', function(msg) {
    console.log(msg);
    var li = '';
    if (msg.me === 'bot') {
      li += '<li style="width: 100%"><div style="margin-left: -5%" class="macro flex-container">' +
      '<img class="flex-img img-circle" src="' + 'client/img/bot.png' + '"></img>';
    } else {
      li += '<li style="width: 100%; margin-right: 14%; text-align: end"><div style="margin-left: 18%" class="macro flex-container">';
    }

    if (msg.attachment.type === 'text') {
      li += generateTextTemplate(msg.attachment.message);
    }
    if (msg.attachment.type === 'button') {
      li += generateButtonTemplate(msg.attachment.message, msg.attachment.text1,
        msg.attachment.link1, msg.attachment.text2, msg.attachment.link2);
    }
    if (msg.attachment.type === 'image') {
      li += generateImageTemplate(msg.attachment.title, msg.attachment.subtitle, msg.attachment.url,
        msg.attachment.link1, msg.attachment.link2);
    }
    if (msg.attachment.type === 'quickReply') {
      li += generateTextTemplate(msg.attachment.message);
    }
    if (msg.attachment.type === 'receipt') {
      li += generateReceiptTemplate(msg.attachment.imageUrl, msg.attachment.number, msg.attachment.size,
        msg.attachment.cardInfo, msg.attachment.address, msg.attachment.total);
    }
    if (msg.attachment.type === 'quick_reply') {
      li += generateTextTemplate(msg.attachment.response);
    }

    //generateImageTemplate(message, message, '/client/img/shoes.jpg', '#', '#');

    if (msg.me === 'man') {
      li += '<img style="float: right" class="flex-img img-circle" src="' + 'client/img/man.png' + '"></img>'
    }
    li += '</div>';
    if (msg.attachment.type === 'quickReply') {
      li += generateQuickReplyTemplate(msg.attachment.message, msg.attachment.replies);
    }
    li += '</li>';

    $('ul').append(li);

    if (msg.attachment.type === 'quickReply') {
      //$('ul').after(generateQuickReplyTemplate(msg.attachment.replies));
    }
    
    $('ul').animate({scrollTop: $('ul').prop("scrollHeight")}, 500);
  });
});
