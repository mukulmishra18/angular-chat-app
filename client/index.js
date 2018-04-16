var app = angular.module('myApp',[]);

app.controller('myCtrl', function($scope){
	var scoket = io.connect('http://localhost:8080');

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
      '<div class="macro flex-container">' +
          '<img class="flex-img img-circle" src="client/img/bot.png"></img>' +
          '<p class="flex-text">' + message + '</p>' +
      '</div>' +
    '</li>';

    $('ul').append(li);
  });
});
