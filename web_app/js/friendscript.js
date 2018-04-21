var app = angular.module('Friendships',[]);

app.controller('relationshipController', function($scope, $http) {
	$scope.doSearch = function (query) {
		var req = $http.get("/getFamily/" + query);
		req.success(function(t) {
			$scope.t = t;
		})
	}
	var request = $http.get("/getFriends");
    request.success(function(data) {
        $scope.data = data;
    });
    request.error(function(data){
        console.log('err');
    });
});

