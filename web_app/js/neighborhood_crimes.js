var app = angular.module('CrimeViewer',[]);
app.controller('nController', function($scope, $http) {
	$scope.byRange = function (fieldName, minValue, maxValue) {
	  if (minValue >= maxValue || maxValue === undefined || minValue === undefined) {
		  minValue = Number.MIN_VALUE;
		  maxValue = Number.MAX_VALUE;
	  }
	  return function predicateFunc(item) {
		return minValue <= item[fieldName] && item[fieldName] <= maxValue;
	  };
	};
    var request = $http.get("/json/q4_cache.json");
    request.success(function(data) {
        $scope.data = data;
    });
    request.error(function(data){
        console.log('err');
    });
	
	request = $http.get("/json/q4_header.json");
    request.success(function(data) {
        $scope.headers = data;
    });
    request.error(function(data){
        console.log('err');
    });
});