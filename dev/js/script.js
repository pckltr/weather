var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('weatherController', ['$scope', '$http', '$filter', '$log', function($scope, $http, $filter, $log) {

    $scope.locationInput = '';
    $scope.locationResponse = '';
    $scope.locationList = {};
    $scope.locations = []
    $scope.locationList.locations = $scope.locations;
    $scope.loc = {};

    $scope.getWeather = function() {
        $scope.locationInput = $filter('lowercase')($scope.locationInput);

        $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + $scope.locationInput + '&units=metric&appid=46a1409601ea84d005d756c1a93d3a75')
            .success(function(result) {

                $scope.locationInput = '';
                $scope.locationResponse = angular.fromJson(result);

                $scope.loc = {
                    temp: $filter('number')($scope.locationResponse.main.temp, 0),
                    name: $scope.locationResponse.name,
                    desc: $scope.locationResponse.weather[0].description
                }

                $scope.locationList.locations.push($scope.loc);
                $log.log(angular.fromJson($scope.locationList));

            })
            .error(function(data, status) {

                $scope.locationResponse = data;

            });
    }

}]);

weatherApp.directive("weatherCard", function() {
    return {
        restrict: 'AECM',
        templateUrl: '../directives/weatherCard.html',
        replace: true,
        scope: {
            locationObject: "="
        }
    }
});
