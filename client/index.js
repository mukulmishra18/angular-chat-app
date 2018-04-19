var app = angular.module('myApp',[]);

function generateTextTemplate(message) {
  return '<p class="flex-text message">' + message + '</p>';
}

function handleQuickReply(evt) {
  console.log(evt);
  $('#quick-reply').remove();
}

function generateQuickReplyTemplate() {
  var html =
    '<div id="quick-reply" class="container" style="position: absolute; bottom: 13%">' +
      '<button class="btn btn-danger quick-button" onclick="handleQuickReply(0)">red</button>' +
      '<button class="btn btn-success quick-button" onclick="handleQuickReply(1)">green</button>' +
      '<button class="btn btn-primary quick-button" onclick="handleQuickReply(2)">blue</button>' +
    '</div>';

  return html;
}

function generateImageTemplate(title, subtitle, imageUrl, link1, link2) {
  var html =
    '<div class="card" style="width: 100%; border-radius: 8px">' +
      '<img class="card-img-top" style="border-radius: 8px" src="'+ imageUrl + '" alt="Card image cap">' +
      '<div class="card-body">' +
        '<h5 class="card-title" style="font-weight: bold;">' + title + '</h5>' +
        '<h6 class="card-subtitle mb-2 text-muted" style="font-size: 80%;">' + subtitle + '</h6>' +
        '<hr/>' +
        '<div class="text-center" style="cursor: pointer"><a href="' + link1 + '">Start Shopping</a></div>' +
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

function generateButtonTemplate() {
  var html =  
  '<div class="card" style="width: 100%; border-radius: 8px">' +
    '<div class="card-body">' +
      '<p class="button-text">What can I do for you?</p>' +
      '<div class="text-center" style="cursor: pointer"><a href="#">Card title</a></div>' +
      '<hr>' +
      '<div class="text-center" style="cursor: pointer"><a href="#">Some quick example text</a></div>' +
    '</div>' +
  '</div>';

  return html;
}

app.controller('myCtrl', function($scope){
	var scoket = io.connect();

  $('input').keypress(function(e) {
    if (e.which == 13) {
      $('#sendMessage').click();
    }
  });

  $scope.send = function () {
 	  var msg = $scope.message;

    $scope.message = "";
    scoket.emit('message', msg);
 }

  scoket.on('message', function(message) {
    var li = '<li style="width: 100%">' +
      '<div style="margin-left: -5%" class="macro flex-container">' +
      '<img class="flex-img img-circle" src="client/img/bot.png"></img>';
          
      li += generateImageTemplate(message, message, '/client/img/shirt.jpg', '#', '#');
      //generateImageTemplate(message, message, 'client/img/shirt.jpg', '#', '#');

      li += '</div>' + '</li>';

    $('ul').append(li);
    $('ul').after(generateQuickReplyTemplate());
    $('ul').animate({scrollTop: $('ul').prop("scrollHeight")}, 500);
  });
});
