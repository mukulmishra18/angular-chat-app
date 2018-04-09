var app = angular.module('myApp',[]);

app.controller('myCtrl', function($scope){
  $scope.send = function () {
    var li = document.createElement("li");
 	  var msg = $scope.message;

    $scope.message = "";
    li.appendChild(document.createTextNode(msg));
    document.getElementById("messages").appendChild(li);
 }
});
