var app = angular.module('SchoolViewer',[]);
app.controller('nController', function($scope, $http) {

	$scope.filterItems = {
		"Private" : true,
		"Charter" : true,
		"District" : true,
		"Contracted" : true,
		"Archdiocese" : true
	};
	$scope.items = [
    {name:'Private'}, 
    {name:'Charter'}, 
	{name:'District'},
	{name:'Contracted'},
	{name:'Archdiocese'},
  	];
	
	$scope.testFilter = function (item) {
    	return $scope.filterItems[item.subtype];
  	};
	$scope.doSearch = function (size) {
		var req = $http.get("/nearby_schools/" + size);
		req.success(function(t) {
			$scope.t = t;
		})
	}
});