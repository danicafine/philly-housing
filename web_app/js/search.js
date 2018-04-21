var app = angular.module('Searcher',[]);
app.controller('bikeController', function($scope, $http) {
    var request = $http.get("https://feeds.citibikenyc.com/stations/stations.json");
    request.success(function(data) {
		console.log("hello")
    	$scope.headers = [{'name':'Station Name'}, {'name':'Available Docks'}, {'name' : 'Total Docks'}, {'name' :'Available Bikes'}, {'name': 'Last Communication'}, {'name': 'Status'}];
        $scope.data = data.stationBeanList;
    });
    request.error(function(data){
        console.log('err');
    });
});