var app = angular.module('NeighborhoodViewer',[]);
app.controller('nController', function($scope, $http) {
	$.getJSON("/json/q1_header.json", function(json) {
		console.log(json);
		$scope.data = json;
	})
    $.getJSON("/json/q1_cache.json", function(json) {
		console.log(json);
    	$scope.data = json;
	});
});