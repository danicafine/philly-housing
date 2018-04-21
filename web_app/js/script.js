var app = angular.module('NYCBikes',[]);
app.controller('bikeController', function($scope, $http) {
    var request = $http.get("https://feeds.citibikenyc.com/stations/stations.json");
    request.success(function(data) {
    	// columnsToDisplay = ['Station Name', 'Available Docks', 'Total Docks', 'Available Bikes', 'Last Communication', 'Status'];
        $scope.data = data.stationBeanList;
    });
    request.error(function(data){
        console.log('err');
    });
});