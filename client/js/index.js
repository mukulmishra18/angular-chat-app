var app = angular.module('myApp',[]);

app.controller('myCtrl', function($scope){
	var scoket = io.connect('http://localhost:8080');
  $scope.send = function () {
 	  var msg = $scope.message;
    $scope.message = "";

    scoket.emit('message', msg);
 }

  scoket.on('message', function(message) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(message));
    document.getElementById("messages").appendChild(li);
 });
});
