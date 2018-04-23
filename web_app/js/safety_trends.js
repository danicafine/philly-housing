var app = angular.module('SafetyViewer',[]);
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
	
	$scope.doSearch = function (start, end) {
		var req = $http.get("/safety_trends/" + start + "/" + end);
		req.success(function(t) {
			$scope.t = t;
		})
	}
});