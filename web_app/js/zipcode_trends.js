var app = angular.module('TrendViewer',[]);
app.controller('nController', function($scope, $http) {
	$scope.byRange = function (fieldName, minValue, maxValue) {
	  if (minValue === undefined) minValue = Number.MIN_VALUE;
	  if (maxValue === undefined) maxValue = Number.MAX_VALUE;
	  if (minValue >= maxValue) {
//		  minValue = Number.MIN_VALUE;
		  maxValue = Number.MAX_VALUE;
	  }
	  return function predicateFunc(item) {
		return minValue <= item[fieldName] && item[fieldName] <= maxValue;
	  };
	};
	
	$scope.doSearch = function (year, month, day) {
		if (day.length == 1) {
			day = "0" + day
		}
		if (month.length == 1) {
			month = "0" + month
		}
		var date = year + month + day;
		var req = $http.get("/zipcode_trends/" + date);
		req.success(function(t) {
			$scope.t = t;
		})
	}
});