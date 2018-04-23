var app = angular.module('TransitViewer',[]);
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
	
	$scope.doSearch = function (id, dist) {
		var req = $http.get("/nearby_transit/" + id + "/" + dist);
		req.success(function(t) {
			$scope.t = t;
		})
	}
});